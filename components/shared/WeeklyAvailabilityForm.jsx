"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { daysOfWeek, fullDaysOfWeek } from "@/lib/constants";
import DaySelectionButtons from "../helpers/DaySelectionButtons";
import DayBlock from "../helpers/DayBlock";

/**
 * WeeklyAvailabilityForm Component
 * Allows users to set and save their weekly availability.
 */
export default function WeeklyAvailabilityForm() {
  // Fetches availability data from the API using SWR
  const { data: fetchedData, isLoading } = useSWR(
    `/api/get-all-datas`,
    fetcher
  );
  const [selectedDays, setSelectedDays] = useState([]);
  const [availability, setAvailability] = useState(Array(7).fill([]));
  const [newAvailability, setNewAvailability] = useState([]);

  /**
   * useEffect to process fetched data when it changes.
   * Initializes availability and selected days based on fetched data.
   */
  useEffect(() => {
    if (fetchedData?.length > 0) {
      const rawData = fetchedData
        .map((item) => item.data)
        .flat()
        .map((slot) => ({
          ...slot,
          day: slot.day.trim(),
        }));

      const initialAvailability = Array(7).fill([]);
      const initialSelectedDays = [];

      rawData.forEach((item) => {
        const dayIndex = fullDaysOfWeek.indexOf(item.day);
        if (dayIndex >= 0) {
          initialAvailability[dayIndex] = item.timeSlots;
          if (!initialSelectedDays.includes(dayIndex)) {
            initialSelectedDays.push(dayIndex);
          }
        }
      });

      setAvailability(initialAvailability);
      setSelectedDays(initialSelectedDays);
    }
  }, [fetchedData]);

  /**
   * Toggles the selection state of a day and updates availability.
   * Adds a default time slot if a new day is selected.
   * Removes availability for a day if it is deselected.
   */

  const toggleDaySelection = (dayIndex) => {
    const updatedSelectedDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((day) => day !== dayIndex)
      : [...selectedDays, dayIndex];

    setSelectedDays(updatedSelectedDays);
    // Add default time slot for new selection, or clear it if deselected
    const updatedAvailability = [...availability];
    if (!selectedDays.includes(dayIndex)) {
      updatedAvailability[dayIndex] = [{ start: "09:00", end: "17:00" }];
      setNewAvailability((prev) => [
        ...prev,
        {
          day: fullDaysOfWeek[dayIndex],
          timeSlots: [{ start: "09:00", end: "17:00" }],
        },
      ]);
    } else {
      updatedAvailability[dayIndex] = [];
      setNewAvailability((prev) =>
        prev.filter((item) => item.day !== fullDaysOfWeek[dayIndex])
      );
    }

    setAvailability(updatedAvailability);
  };

  /**
   * Saves new availability data to the backend.
   * Displays toast notifications for loading, success, and error states.
   */
  const handleSave = async () => {
    if (newAvailability.length === 0) {
      toast.info("No new data to save.");
      return;
    }

    toast.promise(
      axios.post("/api/send-user-data", { data: newAvailability }),
      {
        loading: "Saving new data...",
        success: "New data saved successfully!",
        error: "Failed to save data. Please try again.",
      }
    );

    setNewAvailability([]);
  };

  if (isLoading)
    return (
      <div className="flex items-center h-80 lg:flex-row flex-col gap-2 justify-center">
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Set Your Weekly Availability</h1>
      {/* Component for day selection buttons */}
      <DaySelectionButtons
        daysOfWeek={daysOfWeek}
        selectedDays={selectedDays}
        toggleDaySelection={toggleDaySelection}
      />
      {/* Show message if no days are selected, otherwise render availability blocks */}
      {selectedDays.length === 0 ? (
        <p className="text-center text-gray-600">
          No data found. Add availability by selecting a day above.
        </p>
      ) : (
        fullDaysOfWeek.map(
          (day, dayIndex) =>
            selectedDays.includes(dayIndex) && (
              <DayBlock
                key={dayIndex}
                day={day}
                dayIndex={dayIndex}
                availability={availability}
                setAvailability={setAvailability}
                setNewAvailability={setNewAvailability}
              />
            )
        )
      )}
      {/* Save button to submit new availability */}
      {selectedDays.length > 0 && (
        <Button
          className="w-full p-3 bg-blue-600 text-white rounded mt-4 shadow-md hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Availability
        </Button>
      )}
    </div>
  );
}
