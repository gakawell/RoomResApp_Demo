# Campus Study Room Finder

## Project Overview
Campus Study Room Finder is a web application that helps students discover available study spaces across campus. The app provides a searchable list of rooms, interactive filters, time-based availability simulation, and a lightweight booking request flow.

The current implementation is fully client-side and uses static data to model room inventory and scheduling behavior.

## Key Features
- Room catalog with core metadata: building, room number, floor, capacity, and amenities
- Interactive filtering by building, minimum capacity, and feature flags
- Date and time range selection to narrow results to available rooms
- Click-to-open room details panel for deeper room information
- Booking request simulation with instant user confirmation message
- Responsive layout for mobile and desktop

## Technology Stack
- React
- TypeScript
- Vite
- CSS

## Application Architecture
The application follows a simple component-driven architecture with local state in the top-level app component.

High-level components:
- App: Owns global UI state, combines filter logic and availability logic, and coordinates interactions between components
- RoomFilters: Manages filter inputs and emits active filter state
- RoomDetails: Displays selected room details and booking actions
- Room list item renderer: Displays each room card and handles room selection

Data flow:
1. Static room data is loaded from the rooms data module
2. Filter selections are captured in RoomFilters and passed upward
3. App composes two filtering stages:
   - Base filtering by building, capacity, and features
   - Availability filtering based on selected date and time range
4. Resulting rooms are rendered as cards
5. Selecting a room opens RoomDetails
6. Request booking triggers a front-end confirmation message

## Install And Run Locally
Prerequisites:
- Node.js 18+
- npm 9+

Install dependencies:

    npm install

Start the development server:

    npm run dev

Build for production:

    npm run build

Preview the production build:

    npm run preview

## Folder Structure

    campus-study-rooms/
    ├─ public/
    ├─ src/
    │  ├─ App.tsx
    │  ├─ App.css
    │  ├─ RoomFilters.tsx
    │  ├─ RoomDetails.tsx
    │  ├─ rooms.ts
    │  ├─ index.css
    │  ├─ main.tsx
    │  └─ assets/
    ├─ index.html
    ├─ package.json
    ├─ vite.config.ts
    └─ README.md

## How Availability Is Simulated
Availability is intentionally deterministic and client-side:
- A helper function evaluates each room against selected date, start time, and end time
- The logic applies predictable scheduling rules based on room/building/time combinations
- The same inputs always produce the same availability output

This approach is useful for demos, UI development, and testing interaction flows before introducing a real backend scheduling service.

## Future Enhancements
- Replace simulated availability with backend-driven real-time schedules
- Add authenticated user accounts and booking history
- Add conflict detection and booking approval workflows
- Introduce room photos, maps, and building wayfinding
- Add accessibility and preference-based recommendations
- Add automated tests for filtering, availability, and booking flows

## Contribution Guidelines
Contributions are welcome.

Recommended workflow:
1. Fork the repository and create a feature branch
2. Keep changes focused and well-scoped
3. Run build and lint checks locally before opening a pull request
4. Provide clear PR descriptions with rationale and screenshots for UI changes

Please open an issue first for major feature proposals or architectural changes.

## License
License to be defined.
