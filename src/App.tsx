import { useState } from 'react';
import './App.css';
import { STUDY_ROOMS, type StudyRoom } from './rooms';
import RoomFilters, { type ActiveFilters } from './RoomFilters';

type RoomListItemProps = {
  room: StudyRoom;
};

function RoomListItem({ room }: RoomListItemProps) {
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
      <h3 className="room-title">
        {room.building} {room.roomNumber}
      </h3>
      <p className="room-meta">Capacity: {room.capacity} students</p>
      <p className="room-meta">Key features: {keyFeatures.join(', ')}</p>
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

  const handleFilterChange = (
    nextFilteredRooms: StudyRoom[],
    nextActiveFilters: ActiveFilters,
  ) => {
    setFilteredRooms(nextFilteredRooms);
    setActiveFilters(nextActiveFilters);
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
          <p className="room-meta" style={{ marginBottom: '0.75rem' }}>
            Showing {filteredRooms.length} rooms
          </p>
          <ul className="room-list">
            {filteredRooms.map((room) => (
              <RoomListItem key={room.id} room={room} />
            ))}
          </ul>
          {filteredRooms.length === 0 && (
            <p className="room-meta">No rooms match the current filters.</p>
          )}
        </section>
      </main>

      <footer className="room-meta" style={{ marginTop: '1rem' }}>
        Active filters: building {activeFilters.building ?? 'any'}, minimum capacity{' '}
        {activeFilters.minCapacity ?? 'any'}, features{' '}
        {activeFilters.features.length > 0
          ? activeFilters.features.join(', ')
          : 'none'}
      </footer>
    </div>
  );
}

export default App;
