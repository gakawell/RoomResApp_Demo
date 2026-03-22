import { describe, expect, it } from 'vitest';
import { STUDY_ROOMS } from '../rooms';
import { applyRoomFilters, isRoomAvailable } from '../roomLogic';

describe('room filtering', () => {
	it('filters by building', () => {
		const result = applyRoomFilters(STUDY_ROOMS, {
			building: 'Main Library',
			minCapacity: null,
			features: [],
		});

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((room) => room.building === 'Main Library')).toBe(true);
	});

	it('filters by minimum capacity', () => {
		const minimumCapacity = 10;
		const result = applyRoomFilters(STUDY_ROOMS, {
			building: null,
			minCapacity: minimumCapacity,
			features: [],
		});

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((room) => room.capacity >= minimumCapacity)).toBe(true);
	});
});

describe('room availability simulation', () => {
	it('returns true for a room/time that is not blocked by rules', () => {
		const room = STUDY_ROOMS.find((item) => item.id === 'lib-104');
		expect(room).toBeDefined();

		expect(isRoomAvailable(room!, '2026-03-22', '08:00', '09:00')).toBe(true);
	});

	it('returns false when rule-based busy window matches', () => {
		const room = STUDY_ROOMS.find((item) => item.id === 'lib-104');
		expect(room).toBeDefined();

		expect(isRoomAvailable(room!, '2026-03-22', '09:00', '10:00')).toBe(false);
	});

	it('returns false for long sessions in small rooms', () => {
		const room = STUDY_ROOMS.find((item) => item.id === 'eng-201');
		expect(room).toBeDefined();

		expect(isRoomAvailable(room!, '2026-03-22', '15:00', '18:00')).toBe(false);
	});
});
