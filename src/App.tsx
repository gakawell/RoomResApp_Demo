import './App.css';
import { STUDY_ROOMS, type StudyRoom } from './rooms';

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
  return (
    <div className="app">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
      </header>

      <main className="app-layout">
        <aside className="filters-panel" aria-label="Filters">
          <h2>Filters</h2>
          <p>Filtering controls will go here next.</p>
        </aside>

        <section className="rooms-panel" aria-label="Study rooms">
          <h2>All Study Rooms</h2>
          <ul className="room-list">
            {STUDY_ROOMS.map((room) => (
              <RoomListItem key={room.id} room={room} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
