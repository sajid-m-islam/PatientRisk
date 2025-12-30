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
        sugar_intake: "",
        fiber_intake: "",
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
            const riskScore = response.data;
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

            const { error: healthError } = await supabase
                .from("health_profiles")
                .insert([
                    {
                        user_id: user.id,
                        ...healthData,
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
            onResultReceived({ score: riskScore, level: riskLevel });
        } catch (error) {
            console.log(error);
            console.log(healthData);
            alert("Error occured submitting form");
        }
    };

    return (
        <form
            id="risk-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-0"
        >
            <div>
                <label for="gender">Gender: </label>
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
                <label for="age">Age: </label>
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
                <label for="ethnicity">Ethnicity: </label>
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
                <label for="bmi">BMI: </label>
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
                <label for="waist">Waist Circumference: </label>
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
                <label for="systolic">Systolic Blood Pressure: </label>
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
                <label for="diastolic">Diastolic Blood Pressure: </label>
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
                <label for="calories">Calories: </label>
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
                <label for="sugar">Sugar Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="sugar"
                    name="sugar_intake"
                    value={healthData.sugar_intake}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="fiber">Fiber Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="fiber"
                    name="fiber_intake"
                    value={healthData.fiber_intake}
                    onChange={handleChange}
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
            </div>
        </form>
    );
}
