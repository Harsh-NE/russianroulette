const RevolverBoard = ({ visitedSlots, onSlotClick }) => {

  return (
    <div className="grid grid-cols-3 gap-6">

      {[0,1,2,3,4,5].map((slot) => {

        const visited = visitedSlots.includes(slot);

        return (
          <button
            key={slot}
            disabled={visited}
            onClick={() => onSlotClick(slot)}
            className={`p-10 rounded-full text-xl font-bold
            ${visited ? "bg-gray-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {slot + 1}
          </button>
        );

      })}

    </div>
  );
};

export default RevolverBoard;