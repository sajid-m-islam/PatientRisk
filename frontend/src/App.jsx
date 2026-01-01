import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import UserForm from "./components/UserForm";
import HealthForm from "./components/HealthForm";
import RiskFactor from "./components/RiskFactor";

export default function App() {
    const [session, setSession] = useState(null);
    const [riskResult, setRiskResult] = useState({ score: null, level: null });
    const [name, setName] = useState("");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return (
            // login page
            <>
                <div className="min-h-screen w-full flex items-center justify-center">
                    <div className="w-full max-w-md mx-4">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                    theme: ThemeSupa,
                                }}
                                providers={[]}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            // home page
            <>
                <div className="min-h-screen w-full flex flex-col">
                    <nav className="bg-white w-full h-16 flex items-center shadow-2xs justify-between px-6 z-10">
                        <h1 className="text-xl font-bold text-blue-900 text-[30px]">
                            Patient Risk
                        </h1>
                        <p>Welcome, {name || "User"}</p>
                    </nav>
                    <div className="bg-blue-300 flex-1 w-full flex relative">
                        {/* userform */}
                        <div className="bg-white w-[500px] h-[600px] rounded-2xl overflow-hidden relative top-20 left-15 shadow-xl p-6">
                            <UserForm onNameReceived={setName} />
                        </div>
                        <div className="flex flex-col justify-between w-[700px] h-[600px] relative top-20 left-40 gap-4">
                            {/* healthform */}
                            <div className="bg-white w-full h-[360px] rounded-2xl overflow-hidden p-4 shadow-xl">
                                <div className="relative left-[20px] top-[3px]">
                                    <HealthForm
                                        onResultReceived={setRiskResult}
                                    />
                                </div>
                            </div>
                            {/* risk output */}
                            <div className="bg-white w-full flex-1 rounded-2xl overflow-hidden shadow-xl">
                                <div className="text-center relative top-[20px]">
                                    <RiskFactor
                                        score={riskResult.score}
                                        level={riskResult.level}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
