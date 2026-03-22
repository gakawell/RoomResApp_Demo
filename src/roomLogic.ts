import type { StudyRoom } from './rooms';

export type ActiveFilters = {
  building: string | null;
  minCapacity: number | null;
  features: string[];
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

export function applyRoomFilters(
  rooms: StudyRoom[],
  filters: ActiveFilters,
): StudyRoom[] {
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

export function isRoomAvailable(
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
