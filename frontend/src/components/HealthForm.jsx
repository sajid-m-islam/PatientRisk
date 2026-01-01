import { useState } from "react";
import api from "../api";
import { supabase } from "../supabaseClient";

export default function HealthForm({ onResultReceived }) {
    const [healthData, setHealthData] = useState({
        gender: "",
        age: "",
        ethnicity: "",
        bmi: "",
        waist_circ: "",
        systolic_bp: "",
        diastolic_bp: "",
        calories: "",
        sugar: "",
        fiber: "",
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setHealthData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/risk-factor", healthData);
            console.log(response.data);
            const riskScore = Number(response.data.risk_score.toFixed(2));
            let riskLevel;
            if (riskScore < 0.4) {
                riskLevel = "low";
            } else if (riskScore < 0.8) {
                riskLevel = "medium";
            } else {
                riskLevel = "high";
            }
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { sugar, fiber, ...restOfData } = healthData;
            const { error: healthError } = await supabase
                .from("health_profiles")
                .insert([
                    {
                        user_id: user.id,
                        ...restOfData,
                        sugar_intake: sugar,
                        fiber_intake: fiber,
                        updated_at: new Date(),
                    },
                ]);
            if (healthError) throw healthError;

            const { error: riskError } = await supabase
                .from("risk_assessments")
                .insert([
                    {
                        user_id: user.id,
                        risk_score: riskScore,
                        risk_level: riskLevel,
                        created_at: new Date(),
                    },
                ]);
            if (riskError) throw riskError;
            console.log(healthData);
            onResultReceived({ score: riskScore, level: riskLevel });
        } catch (error) {
            console.log(error);
            alert("Error occured submitting form");
        }
    };

    return (
        <form
            id="risk-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-2"
        >
            <div>
                <label htmlFor="gender">Gender: </label>
                <br></br>
                <select
                    id="gender"
                    name="gender"
                    value={healthData.gender}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                >
                    <option value="" selected disabled>
                        Choose
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <br></br>
                <label htmlFor="age">Age: </label>
                <br></br>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={healthData.age}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="ethnicity">Ethnicity: </label>
                <br></br>
                <select
                    id="ethnicity"
                    name="ethnicity"
                    value={healthData.ethnicity}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                >
                    <option value="" selected disabled>
                        Choose
                    </option>
                    <option value="Mexican American">Mexican American</option>
                    <option value="Other Hispanic">Other Hispanic</option>
                    <option value="Non-Hispanic White">
                        Non-Hispanic White
                    </option>
                    <option value="Non-Hispanic Black">
                        Non-Hispanic Black
                    </option>
                    <option value="Non-Hispanic Asian">
                        Non-Hispanic Asian
                    </option>
                    <option value="Other Race">Other Race</option>
                </select>
                <br></br>
                <label htmlFor="bmi">BMI: </label>
                <br></br>
                <input
                    type="number"
                    id="bmi"
                    name="bmi"
                    value={healthData.bmi}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="waist">Waist Circumference: </label>
                <br></br>
                <input
                    type="number"
                    id="waist"
                    name="waist_circ"
                    value={healthData.waist_circ}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
            </div>
            <div>
                <label htmlFor="systolic">Systolic Blood Pressure: </label>
                <br></br>
                <input
                    type="number"
                    id="systolic"
                    name="systolic_bp"
                    value={healthData.systolic_bp}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="diastolic">Diastolic Blood Pressure: </label>
                <br></br>
                <input
                    type="number"
                    id="diastolic"
                    name="diastolic_bp"
                    value={healthData.diastolic_bp}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="calories">Calories: </label>
                <br></br>
                <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={healthData.calories}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="sugar">Sugar Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="sugar"
                    name="sugar"
                    value={healthData.sugar}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label htmlFor="fiber">Fiber Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="fiber"
                    name="fiber"
                    value={healthData.fiber}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
            </div>
        </form>
    );
}
