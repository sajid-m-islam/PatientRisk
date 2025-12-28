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
        <form onSubmit={handleSubmit}>
            <label for="gender">Gender: </label>
            <br></br>
            <input type="text" id="gender" name="gender"></input>
            <br></br>
            <select id="gender" name="gender">
                <option value="" selected disabled>
                    Choose
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <br></br>
            <label for="age">Age: </label>
            <br></br>
            <input type="number" id="age" name="age"></input>
            <br></br>
            <label for="ethnicity">Ethnicity: </label>
            <br></br>
            <select id="ethnicity" name="ethnicity">
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
            <input type="number" id="bmi" name="bmi"></input>
            <br></br>
            <label for="waist">Waist Circumference: </label>
            <br></br>
            <input type="number" id="waist" name="waist"></input>
            <br></br>
            <label for="systolic">Systolic Blood Pressure: </label>
            <br></br>
            <input type="systolic" id="systolic" name="systolic"></input>
            <br></br>
            <label for="diastolic">Diastolic Blood Pressure: </label>
            <br></br>
            <input type="diastolic" id="diastolic" name="diastolic"></input>
            <br></br>
            <label for="calories">Calories: </label>
            <br></br>
            <input type="number" id="calories" name="calories"></input>
            <br></br>
            <label for="sugar">Sugar Intake: </label>
            <br></br>
            <input type="sugar" id="sugar" name="sugar"></input>
            <br></br>
            <label for="fiber">Fiber Intake: </label>
            <br></br>
            <input type="fiber" id="fiber" name="fiber"></input>
            <br></br>
        </form>
    );
}
