export default function RiskFactor({ score, level }) {
    if (!score) {
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
        const textColor = "text-red-700"
            ? isHigh
            : "text-yellow-700"
            ? isMed
            : "text-green-700";
        return (
            <p>
                Your risk of diabetes is
                <span className={"`font-bold ${textColor}`"}>{level}</span>
            </p>
        );
    }
}
