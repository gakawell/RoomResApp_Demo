import { useEffect, useMemo, useState } from 'react';
import type { StudyRoom } from './rooms';

export type ActiveFilters = {
	building: string | null;
	minCapacity: number | null;
	features: string[];
};

type RoomFiltersProps = {
	allRooms: StudyRoom[];
	onFilterChange: (
		filteredRooms: StudyRoom[],
		activeFilters: ActiveFilters,
	) => void;
};

const FEATURE_OPTIONS = [
	{ label: 'Whiteboard', value: 'whiteboard' },
	{ label: 'Monitor', value: 'monitor' },
	{ label: 'Quiet', value: 'quiet' },
] as const;

function roomMatchesFeature(room: StudyRoom, feature: string): boolean {
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

export default function RoomFilters({
	allRooms,
	onFilterChange,
}: RoomFiltersProps) {
	const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
		building: null,
		minCapacity: null,
		features: [],
	});

	const buildingOptions = useMemo(() => {
		return Array.from(new Set(allRooms.map((room) => room.building))).sort();
	}, [allRooms]);

	const filteredRooms = useMemo(() => {
		return allRooms.filter((room) => {
			const matchesBuilding =
				!activeFilters.building || room.building === activeFilters.building;

			const matchesCapacity =
				activeFilters.minCapacity === null ||
				room.capacity >= activeFilters.minCapacity;

			const matchesFeatures = activeFilters.features.every((feature) =>
				roomMatchesFeature(room, feature),
			);

			return matchesBuilding && matchesCapacity && matchesFeatures;
		});
	}, [allRooms, activeFilters]);

	useEffect(() => {
		onFilterChange(filteredRooms, activeFilters);
	}, [filteredRooms, activeFilters, onFilterChange]);

	const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setActiveFilters((previous) => ({
			...previous,
			building: value === '' ? null : value,
		}));
	};

	const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setActiveFilters((previous) => ({
			...previous,
			minCapacity: value === '' ? null : Number(value),
		}));
	};

	const handleFeatureToggle = (featureValue: string) => {
		setActiveFilters((previous) => {
			const featureAlreadySelected = previous.features.includes(featureValue);
			return {
				...previous,
				features: featureAlreadySelected
					? previous.features.filter((feature) => feature !== featureValue)
					: [...previous.features, featureValue],
			};
		});
	};

	return (
		<div className="filter-form">
			<div className="filter-group">
				<label htmlFor="building-filter">Building</label>
				<br />
				<select
					id="building-filter"
					value={activeFilters.building ?? ''}
					onChange={handleBuildingChange}
				>
					<option value="">All buildings</option>
					{buildingOptions.map((building) => (
						<option key={building} value={building}>
							{building}
						</option>
					))}
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="capacity-filter">Minimum capacity</label>
				<br />
				<input
					id="capacity-filter"
					type="number"
					min={1}
					value={activeFilters.minCapacity ?? ''}
					onChange={handleCapacityChange}
					placeholder="Any"
				/>
			</div>

			<fieldset className="filter-fieldset">
				<legend>Features</legend>
				{FEATURE_OPTIONS.map((feature) => (
					<label key={feature.value} className="filter-checkbox">
						<input
							type="checkbox"
							checked={activeFilters.features.includes(feature.value)}
							onChange={() => handleFeatureToggle(feature.value)}
						/>{' '}
						{feature.label}
					</label>
				))}
			</fieldset>
		</div>
	);
}
