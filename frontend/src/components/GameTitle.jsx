const GameTitle = () => {
  return (
    <div className="text-right">
      <h1 className="stencil-text text-6xl md:text-7xl font-bold text-white mb-2 tracking-wider">
        RUSSIAN
      </h1>
      <div className="flex items-center justify-end mb-2">
        <div className="w-32 h-px bg-white mr-2"></div>
        <span className="bullet"></span>
      </div>
      <h1 className="stencil-text text-6xl md:text-7xl font-bold text-white tracking-[0.3em] pl-[0.3em]">
        ROULETTE
      </h1>
    </div>
  );
};

export default GameTitle;