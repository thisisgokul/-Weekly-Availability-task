import { Button } from "@/components/ui/button";
import axios from "axios";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function DayBlock({
  day,
  dayIndex,
  availability,
  setAvailability,
  setNewAvailability,
}) {
  // Handles changes to start or end time for a specific time slot
  const handleTimeChange = (slotIndex, type, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex][slotIndex][type] = value;
    setAvailability(updatedAvailability);

    const updatedDay = {
      day,
      timeSlots: updatedAvailability[dayIndex],
    };
    // Update the newAvailability state to reflect changes for the current day
    setNewAvailability((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.day === updatedDay.day
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedDay;
        return updated;
      } else {
        return [...prev, updatedDay];
      }
    });
  };
  // Adds a new empty time slot for the current day
  const addTimeSlot = () => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].push({ start: "", end: "" });
    setAvailability(updatedAvailability);
  };

  // Removes a time slot and sends a delete request to the server
  const removeTimeSlot = (slotIndex, slot) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].splice(slotIndex, 1);
    setAvailability(updatedAvailability);
    // Show a toast notification for the delete operation
    console.log(slot.user_id );
    
    toast.promise(
      axios.delete(`/api/delete-user-slot`, {
        data: { user_id: slot.user_id },
      }),
      {
        loading: "Deleting time slot...",
        success: "Time slot deleted successfully!",
        error: "deleted.",
      }
    );
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-blue-800">{day}</h2>
      {availability[dayIndex]?.map((slot, slotIndex) => (
        <div
          key={slotIndex}
          className="flex items-center gap-4 mb-2 justify-between"
        >
          <input
            type="time"
            className="border rounded p-2 flex-1"
            value={slot.start}
            onChange={(e) =>
              handleTimeChange(slotIndex, "start", e.target.value)
            }
          />
          <span className="text-gray-700">to</span>
          <input
            type="time"
            className="border rounded p-2 flex-1"
            value={slot.end}
            onChange={(e) => handleTimeChange(slotIndex, "end", e.target.value)}
          />
          <Button
            variant="outline"
            className="p-2 text-red-600"
            onClick={() => removeTimeSlot(slotIndex, slot)}
          >
            <Minus size={16} />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="p-2 mt-2 text-green-600"
        onClick={addTimeSlot}
      >
        <Plus size={16} /> Add Time Slot
      </Button>
    </div>
  );
}
