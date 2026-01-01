import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function UserForm({ onNameReceived }) {
    const [userData, setUserData] = useState({
        fullName: "",
        dob: "",
        email: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from("users")
                    .select("full_name, dob")
                    .eq("id", user.id)
                    .single();
                if (profileError)
                    console.log("error loading data", profileError);

                setUserData({
                    email: user.email,
                    fullName: profile?.full_name || "",
                    dob: profile?.dob || "",
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
            })
            .eq("id", user.id)
            .select();
        if (userError) {
            console.log("error occured", error);
        } else {
            console.log("Successfully updated");
            onNameChange(userData.fullName);
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
        </form>
    );
}
