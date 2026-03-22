import type { StudyRoom } from './rooms';

type RoomDetailsProps = {
	room: StudyRoom | null;
	onClose: () => void;
	onRequestBooking: (room: StudyRoom) => void;
};

function formatBooleanLabel(value: boolean): string {
	return value ? 'Yes' : 'No';
}

export default function RoomDetails({
	room,
	onClose,
	onRequestBooking,
}: RoomDetailsProps) {
	if (room === null) {
		return null;
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="room-details-title"
			style={{
				border: '1px solid #d0d5dd',
				borderRadius: '10px',
				padding: '1rem',
				backgroundColor: '#ffffff',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
				maxWidth: '480px',
			}}
		>
			<h2 id="room-details-title" style={{ marginTop: 0 }}>
				Room Details
			</h2>

			<p>
				<strong>Building:</strong> {room.building}
			</p>
			<p>
				<strong>Room number:</strong> {room.roomNumber}
			</p>
			<p>
				<strong>Capacity:</strong> {room.capacity}
			</p>
			<p>
				<strong>Floor:</strong> {room.floor}
			</p>
			<p>
				<strong>Features:</strong> {room.features.join(', ')}
			</p>
			<p>
				<strong>Quiet:</strong> {formatBooleanLabel(room.isQuiet)}
			</p>
			<p>
				<strong>Has whiteboard:</strong> {formatBooleanLabel(room.hasWhiteboard)}
			</p>
			<p>
				<strong>Has monitor:</strong> {formatBooleanLabel(room.hasMonitor)}
			</p>

			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<button type="button" onClick={() => onRequestBooking(room)}>
					Request booking
				</button>
				<button type="button" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
}
