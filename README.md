# Weekly Availability Form

This project implements a React-based UI for managing weekly availability. It allows users to select days, add or remove time slots, and save their availability for each day of the week. The data is persisted via API endpoints.

## Features

1. **Day Selection**: Users can select specific days of the week to set availability.
2. **Time Slot Management**: Users can add, edit, or remove time slots for each selected day.
3. **Real-time Updates**: Changes are reflected immediately in the UI and stored in local state.
4. **API Integration**:
   - Save new availability data via a `POST` request.
   - Delete specific time slots via a `DELETE` request.
5. **User Feedback**: Provides loading, success, and error messages using the `sonner` toast library.

## Components

### 1. **`WeeklyAvailabilityForm`**

This is the main component for managing weekly availability.

#### Responsibilities:
- Fetches initial data using `useSWR`.
- Maintains state for selected days and availability.
- Handles saving new availability data via API.

#### Key Functions:
- `toggleDaySelection(dayIndex)`: Adds or removes a day from the selected days.
- `handleSave()`: Sends new availability data to the backend API.

#### Dependencies:
- `axios` for API calls.
- `sonner` for toast notifications.
- Helper components: `DaySelectionButtons` and `DayBlock`.

### 2. **`DayBlock`**

Handles time slots for a specific day.

#### Responsibilities:
- Renders input fields for start and end times of each time slot.
- Allows adding and removing time slots.
- Updates parent state (`availability` and `newAvailability`) on changes.

#### Key Functions:
- `handleTimeChange(slotIndex, type, value)`: Updates the start or end time of a specific time slot.
- `addTimeSlot()`: Adds a new time slot.
- `removeTimeSlot(slotIndex, slot)`: Removes a time slot and makes an API call to delete it.

## API Endpoints

### 1. **`GET /api/get-all-datas`**
Fetches initial availability data.


### 2. **`POST /api/send-user-data`**
Saves new availability data.


### 3. **`DELETE /api/delete-user-slot`**
D


## Installation

1. Clone the repository.
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory.
   ```bash
   cd <project-directory>
   ```
3. Install dependencies.
   ```bash
   npm install
   ```
4. add env variables
   
5. Start the development server.
   ```bash
   npm run dev
   ```

## Usage

1. Open the app in your browser (usually at `http://localhost:3000`).
2. Select a day to add availability.
3. Add or edit time slots for the selected day.
4. Save your changes using the "Save Availability" button.


