export default function DaySelectionButtons({ daysOfWeek, selectedDays, toggleDaySelection }) {
    return (
      <div className="flex justify-center mb-6">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full mx-1 transition-all duration-300 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
    );
  }
  