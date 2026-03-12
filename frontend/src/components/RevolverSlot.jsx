const RevolverSlot = ({ number, visited, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || visited}
      className={`
        relative w-24 h-24 md:w-28 md:h-28 rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${visited 
          ? 'bg-gray-700 cursor-not-allowed opacity-50' 
          : 'bg-transparent border-2 border-white hover:border-red-600 hover:scale-110'
        }
        ${!visited && !disabled && 'hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'}
      `}
    >
      <span className={`text-2xl font-bold ${visited ? 'text-gray-400' : 'text-white'}`}>
        {number}
      </span>
      {!visited && (
        <div className="absolute inset-0 rounded-full border border-red-600 opacity-0 hover:opacity-50 animate-pulse"></div>
      )}
    </button>
  );
};

export default RevolverSlot;