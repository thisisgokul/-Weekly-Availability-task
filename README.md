"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { daysOfWeek, fullDaysOfWeek } from "@/lib/constants";



export default function WeeklyAvailabilityForm() {
  const { data: fetchedData, isLoading } = useSWR(`/api/get-specific-datas`, fetcher);
  const [selectedDays, setSelectedDays] = useState([]);
  const [availability, setAvailability] = useState(Array(7).fill([]));
  const [newAvailability, setNewAvailability] = useState([]);

  useEffect(() => {
    console.log(fetchedData);
    
    if (fetchedData?.length > 0) {
      const rawData = fetchedData
        .map((item) => item.data) // Extract `data` from each object
        .flat()
        .map((slot) => ({
          ...slot,
          day: slot.day.trim(), // Trim whitespace from day names
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

  const toggleDaySelection = (dayIndex) => {
    const updatedSelectedDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((day) => day !== dayIndex)
      : [...selectedDays, dayIndex];

    setSelectedDays(updatedSelectedDays);

    // Update availability for newly added days
    const updatedAvailability = [...availability];
    if (!selectedDays.includes(dayIndex)) {
      updatedAvailability[dayIndex] = [{ start: "09:00", end: "17:00" }];
      setNewAvailability((prev) => [
        ...prev,
        { day: fullDaysOfWeek[dayIndex], timeSlots: [{ start: "09:00", end: "17:00" }] },
      ]);
    } else {
      updatedAvailability[dayIndex] = [];
      setNewAvailability((prev) =>
        prev.filter((item) => item.day !== fullDaysOfWeek[dayIndex])
      );
    }

    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (dayIndex, slotIndex, type, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex][slotIndex][type] = value;
    setAvailability(updatedAvailability);

    // Update newAvailability with modified day
    const updatedDay = {
      day: fullDaysOfWeek[dayIndex],
      timeSlots: updatedAvailability[dayIndex],
    };

    setNewAvailability((prev) => {
      const existingIndex = prev.findIndex((item) => item.day === updatedDay.day);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedDay;
        return updated;
      } else {
        return [...prev, updatedDay];
      }
    });
  };

  const addTimeSlot = (dayIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].push({ start: "", end: "" });
    setAvailability(updatedAvailability);
  };

  const removeTimeSlot = (dayIndex, slotIndex,slot) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].splice(slotIndex, 1);
    setAvailability(updatedAvailability);
    console.log(slot.user_id);
    toast.promise(
        axios.delete(`/api/delete-user-slot`, { data: { user_id: slot.user_id } }),
        {
          loading: "Deleting time slot...",
          success: "Time slot deleted successfully!",
          error: "Failed to delete time slot. Please try again.",
        }
      );

  };

  const handleSave = async () => {
    if (newAvailability.length === 0) {
      toast.info("No new data to save.");
      return;
    }

    console.log("New Availability Data:", newAvailability);

    toast.promise(
      axios.post("/api/send-user-data", { data: newAvailability }),
      {
        loading: "Saving new data...",
        success: "New data saved successfully!",
        error: "Failed to save data. Please try again.",
      }
    );

    // Clear newAvailability after saving
    setNewAvailability([]);
  };

  if (isLoading) return  <div className="flex items-center h-80 lg:flex-row flex-col gap-2 justify-center">
 
    <Loader2 className="my-4 h-8 w-8 animate-spin" />

</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Set Your Weekly Availability</h1>

      <div className="flex justify-center mb-6">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full mx-1 ${
              selectedDays.includes(index)
                ? "bg-blue-900 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => toggleDaySelection(index)}
          >
            {day}
          </button>
        ))}
      </div>

      {selectedDays.length === 0 ? (
        <p className="text-center text-gray-600">
          No data found. Add availability by selecting a day above.
        </p>
      ) : (
        fullDaysOfWeek.map((day, dayIndex) =>
          selectedDays.includes(dayIndex) && (
            <div key={dayIndex} className="mb-4">
              <h2 className="text-lg font-semibold mb-2">{day}</h2>
              {availability[dayIndex]?.map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center gap-4 mb-2">
                  <input
                    type="time"
                    className="border rounded p-2"
                    value={slot.start}
                    onChange={(e) =>
                      handleTimeChange(dayIndex, slotIndex, "start", e.target.value)
                    }
                  />
                  <span>to</span>
                  <input
                    type="time"
                    className="border rounded p-2"
                    value={slot.end}
                    onChange={(e) =>
                      handleTimeChange(dayIndex, slotIndex, "end", e.target.value)
                    }
                  />
                 
                    <Button
                      variant="outline"
                      className="p-2"
                      onClick={() => removeTimeSlot(dayIndex, slotIndex,slot)}
                    >
                      <Minus size={16} />
                    </Button>
                
                </div>
              ))}
              <Button
                variant="outline"
                className="p-2 mt-2"
                onClick={() => addTimeSlot(dayIndex)}
              >
                <Plus size={16} /> Add Time Slot
              </Button>
            </div>
          )
        )
      )}

      {selectedDays.length > 0 && (
        <Button
          className="w-full p-3 bg-blue-600 text-white rounded mt-4"
          onClick={handleSave}
        >
          Save Availability
        </Button>
      )}
    </div>
  );
}













