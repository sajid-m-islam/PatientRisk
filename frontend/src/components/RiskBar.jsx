const RiskBar = ({ score }) => {
    // 1. Safety: Clamp score between 0 and 100 to prevent arrow flying off
    const clampedScore = Math.min(Math.max(score * 100, 0), 100);

    return (
        <div className="w-full max-w-[500px] mt-6 mx-auto">
            {/* Label Row */}
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
                <span>Low Risk</span>
                <span>High Risk</span>
            </div>

            {/* The Bar Container */}
            <div className="relative h-6 w-full mb-2">
                {/* 2. The Gradient Background (Green -> Yellow -> Red) */}
                <div className="absolute top-0 left-0 w-full h-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 shadow-inner"></div>

                {/* 3. The Arrow Marker */}
                {/* We use 'style={{ left: ... }}' to move it dynamically */}
                <div
                    className="absolute top-[-5px] transition-all duration-700 ease-out"
                    style={{ left: `${clampedScore}%` }}
                >
                    <div className="relative -translate-x-1/2 flex flex-col items-center">
                        {/* The Arrow Shape (Triangle) */}
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black"></div>

                        {/* Optional: Show the number below the arrow */}
                        <span className="text-xs font-bold text-black mt-1">
                            {clampedScore}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskBar;
