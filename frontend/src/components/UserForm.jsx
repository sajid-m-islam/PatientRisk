import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function UserForm({ onNameReceived }) {
    const [userData, setUserData] = useState({
        fullName: "",
        dob: "",
        email: "",
        feet: "",
        inches: "",
        weight: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user.id)
                    .maybeSingle();
                if (profileError)
                    console.log("error loading data", profileError);

                setUserData({
                    email: user.email,
                    fullName: profile?.full_name || "",
                    dob: profile?.dob || "",
                    feet: Math.floor(profile?.height_inches / 12) || "",
                    inches: profile?.height_inches % 12 || "",
                    weight: profile?.weight || "",
                });
                if (profile?.full_name) {
                    onNameReceived(profile.full_name);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error: userError } = await supabase
            .from("users")
            .update({
                full_name: userData.fullName,
                dob: userData.dob,
                height_inches: userData.feet * 12 + userData.inches,
                weight: userData.weight,
            })
            .eq("id", user.id)
            .select();
        if (userError) {
            console.log("error occured", error);
        } else {
            console.log("Successfully updated");
            onNameReceived(userData.fullName);
        }
    };

    return (
        <form id="user-form" className="flex flex-col gap-6">
            <div className="flex flex-col">
                <label htmlFor="fullName" className="text-[26px] font-bold">
                    Name:{" "}
                </label>
                <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border p-1 rounded-md"
                ></input>
            </div>
            <div className="flex flex-col">
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    readOnly
                    className="border p-1 rounded-md"
                ></input>
            </div>
            <div className="flex flex-col">
                <label htmlFor="dob">Date of Birth:</label>
                <input
                    type="date"
                    name="dob"
                    value={userData.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border p-1 rounded-md"
                ></input>
            </div>
            <div className="flex flex-col gap-2">
                <label>Height:</label>
                <div className="flex gap-2">
                    <label htmlFor="feet">Feet: </label>
                    <input
                        type="number"
                        name="feet"
                        value={userData.feet}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border p-1 rounded-md w-16"
                    ></input>
                    <label htmlFor="inches">Inches: </label>
                    <input
                        type="number"
                        name="inches"
                        value={userData.inches}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border p-1 rounded-md w-16"
                    ></input>
                </div>
            </div>
            <div className="flex flex-col">
                <label htmlFor="weight">Weight:</label>
                <input
                    type="number"
                    name="weight"
                    value={userData.weight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border p-1 rounded-md w-20"
                ></input>
            </div>
        </form>
    );
}
