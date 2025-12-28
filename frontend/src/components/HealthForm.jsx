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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("risk-factor", healthData);
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
        } catch (error) {
            alert("Error occured submitting form");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-0">
            <div>
                <label for="gender">Gender: </label>
                <br></br>
                <select
                    id="gender"
                    name="gender"
                    class="border p-2 rounded-2xl"
                >
                    <option value="" selected disabled>
                        Choose
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <br></br>
                <label for="age">Age: </label>
                <br></br>
                <input
                    type="number"
                    id="age"
                    name="age"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="ethnicity">Ethnicity: </label>
                <br></br>
                <select
                    id="ethnicity"
                    name="ethnicity"
                    class="border p-2 rounded-2xl"
                >
                    <option value="" selected disabled>
                        Choose
                    </option>
                    <option value="mexicanAmerican">Mexican American</option>
                    <option value="otherHispanic">Other Hispanic</option>
                    <option value="white">Non-Hispanic White</option>
                    <option value="black">Non-Hispanic Black</option>
                    <option value="asian">Non-Hispanic Asian</option>
                    <option value="other">Other Race</option>
                </select>
                <br></br>
                <label for="bmi">BMI: </label>
                <br></br>
                <input
                    type="number"
                    id="bmi"
                    name="bmi"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="waist">Waist Circumference: </label>
                <br></br>
                <input
                    type="number"
                    id="waist"
                    name="waist"
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
                    name="systolic"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="diastolic">Diastolic Blood Pressure: </label>
                <br></br>
                <input
                    type="number"
                    id="diastolic"
                    name="diastolic"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="calories">Calories: </label>
                <br></br>
                <input
                    type="number"
                    id="calories"
                    name="calories"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="sugar">Sugar Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="sugar"
                    name="sugar"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
                <label for="fiber">Fiber Intake: </label>
                <br></br>
                <input
                    type="number"
                    id="fiber"
                    name="fiber"
                    class="border p-2 rounded-2xl"
                ></input>
                <br></br>
            </div>
        </form>
    );
}
