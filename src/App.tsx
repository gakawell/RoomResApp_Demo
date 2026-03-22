import { useEffect, useState } from 'react';
import './App.css';
import { STUDY_ROOMS, type StudyRoom } from './rooms';
import RoomFilters, { type ActiveFilters } from './RoomFilters';
import RoomDetails from './RoomDetails';

type RoomListItemProps = {
  room: StudyRoom;
  onSelect: (room: StudyRoom) => void;
};

function matchesBuilding(room: StudyRoom, building: string | null): boolean {
  return building === null || room.building === building;
}

function matchesMinCapacity(room: StudyRoom, minCapacity: number | null): boolean {
  return minCapacity === null || room.capacity >= minCapacity;
}

function matchesFeature(room: StudyRoom, feature: string): boolean {
  const normalizedFeature = feature.toLowerCase();
  const hasFeatureTag = room.features.some(
    (item) => item.toLowerCase() === normalizedFeature,
  );

  if (normalizedFeature === 'whiteboard') {
    return room.hasWhiteboard || hasFeatureTag;
  }

  if (normalizedFeature === 'monitor') {
    return room.hasMonitor || hasFeatureTag;
  }

  if (normalizedFeature === 'quiet') {
    return room.isQuiet || hasFeatureTag;
  }

  return hasFeatureTag;
}

function matchesSelectedFeatures(room: StudyRoom, features: string[]): boolean {
  return features.every((feature) => matchesFeature(room, feature));
}

function applyRoomFilters(rooms: StudyRoom[], filters: ActiveFilters): StudyRoom[] {
  return rooms.filter((room) => {
    const buildingMatch = matchesBuilding(room, filters.building);
    const capacityMatch = matchesMinCapacity(room, filters.minCapacity);
    const featureMatch = matchesSelectedFeatures(room, filters.features);
    return buildingMatch && capacityMatch && featureMatch;
  });
}

function toMinutes(timeValue: string): number {
  const [hourPart, minutePart] = timeValue.split(':');
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  return hour * 60 + minute;
}

function isRoomAvailable(
  room: StudyRoom,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  if (!date || !startTime || !endTime) {
    return true;
  }

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  if (startMinutes >= endMinutes) {
    return false;
  }

  const sessionHours = Math.max(1, Math.floor((endMinutes - startMinutes) / 60));
  const startHour = Math.floor(startMinutes / 60);
  const dayNumber = Number(date.replace(/-/g, ''));
  const roomNumberSeed = Number.parseInt(room.roomNumber.replace(/\D/g, ''), 10) || 0;

  const busyByRule =
    (dayNumber + roomNumberSeed + startHour + sessionHours) % 4 === 0;

  const busyByBuildingWindow =
    room.building === 'Main Library' && startHour >= 12 && startHour < 14;

  const busyByLongSession = sessionHours >= 3 && room.capacity <= 4;

  return !(busyByRule || busyByBuildingWindow || busyByLongSession);
}

function applyAvailabilityFilter(
  rooms: StudyRoom[],
  date: string,
  startTime: string,
  endTime: string,
): StudyRoom[] {
  return rooms.filter((room) => isRoomAvailable(room, date, startTime, endTime));
}

function RoomListItem({ room, onSelect }: RoomListItemProps) {
  const keyFeatures = [
    ...(room.isQuiet ? ['quiet'] : []),
    ...(room.hasWhiteboard ? ['whiteboard'] : []),
    ...(room.hasMonitor ? ['monitor'] : []),
    ...room.features,
  ]
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, 4);

  return (
    <li className="room-item">
      <button
        type="button"
        onClick={() => onSelect(room)}
        className="room-card-button"
        aria-label={`View details for ${room.building} ${room.roomNumber}`}
      >
        <h3 className="room-title">
          {room.building} {room.roomNumber}
        </h3>
        <p className="room-meta">Capacity: {room.capacity} students</p>
        <p className="room-meta">Key features: {keyFeatures.join(', ')}</p>
      </button>
    </li>
  );
}

function App() {
  const [filteredRooms, setFilteredRooms] = useState<StudyRoom[]>(STUDY_ROOMS);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    building: null,
    minCapacity: null,
    features: [],
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  useEffect(() => {
    const roomsAfterFilters = applyRoomFilters(STUDY_ROOMS, activeFilters);
    const availableRooms = applyAvailabilityFilter(
      roomsAfterFilters,
      selectedDate,
      startTime,
      endTime,
    );

    setFilteredRooms(availableRooms);
  }, [activeFilters, selectedDate, startTime, endTime]);

  const handleFilterChange = (
    _nextFilteredRooms: StudyRoom[],
    nextActiveFilters: ActiveFilters,
  ) => {
    setActiveFilters(nextActiveFilters);
  };

  const handleRequestBooking = (room: StudyRoom) => {
    const dateLabel = selectedDate || 'any date';
    const timeLabel =
      startTime && endTime ? `${startTime}-${endTime}` : 'any time range';

    setBookingMessage(
      `Booking request submitted for ${room.building} ${room.roomNumber} on ${dateLabel} at ${timeLabel}.`,
    );
    setSelectedRoom(null);

    window.setTimeout(() => {
      setBookingMessage(null);
    }, 4000);
  };

  const handleCloseDetails = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
      </header>

      <main className="app-layout">
        <aside className="filters-panel" aria-label="Filters">
          <h2>Filters</h2>
          <RoomFilters allRooms={STUDY_ROOMS} onFilterChange={handleFilterChange} />
        </aside>

        <section className="rooms-panel" aria-label="Study rooms">
          <h2>All Study Rooms</h2>

          {bookingMessage && (
            <p
              role="status"
              aria-live="polite"
              className="room-meta booking-banner"
            >
              {bookingMessage}
            </p>
          )}

          <div className="availability-controls">
            <label htmlFor="selected-date">Date</label>
            <br />
            <input
              id="selected-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />

            <div className="time-field">
              <label htmlFor="start-time">Start time</label>
              <br />
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>

            <div className="time-field">
              <label htmlFor="end-time">End time</label>
              <br />
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>

          <p className="room-meta room-count">
            Showing {filteredRooms.length} available rooms
          </p>
          <ul className="room-list">
            {filteredRooms.map((room) => (
              <RoomListItem key={room.id} room={room} onSelect={setSelectedRoom} />
            ))}
          </ul>
          {filteredRooms.length === 0 && (
            <p className="room-meta">No rooms match the current filters.</p>
          )}

          {selectedRoom && (
            <div className="details-panel">
              <RoomDetails
                room={selectedRoom}
                onClose={handleCloseDetails}
                onRequestBooking={handleRequestBooking}
              />
            </div>
          )}
        </section>
      </main>

      <footer className="room-meta app-footer">
        Active filters: building {activeFilters.building ?? 'any'}, minimum capacity{' '}
        {activeFilters.minCapacity ?? 'any'}, features{' '}
        {activeFilters.features.length > 0
          ? activeFilters.features.join(', ')
          : 'none'}, date {selectedDate || 'any'}, time range{' '}
        {startTime && endTime ? `${startTime}-${endTime}` : 'any'}
      </footer>
    </div>
  );
}

export default App;
