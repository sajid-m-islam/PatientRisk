export default function RiskFactor({ score, level }) {
    if (score === null || score === undefined) {
        return (
            <div>
                <button
                    type="submit"
                    form="risk-form"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all w-full max-w-xs"
                >
                    Calculate Risk Score
                </button>
            </div>
        );
    } else {
        const isHigh = level === "high";
        const isMed = level === "medium";
        const textColor = isHigh
            ? "text-red-700"
            : isMed
            ? "text-yellow-700"
            : "text-green-700";
        return (
            <div>
                <button
                    type="submit"
                    form="risk-form"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all w-full max-w-xs"
                >
                    Calculate Risk Score
                </button>
                <br></br>
                <div className="relative top-[18px]">
                    <p className="text-[20px]">
                        Your risk of diabetes is{" "}
                        <span className={`font-bold ${textColor}`}>
                            {level}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}
