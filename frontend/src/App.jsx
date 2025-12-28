import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import HealthForm from "./components/HealthForm";

export default function App() {
    const [session, setSession] = useState(null);

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
            <div className="bg-blue-300 min-h-screen w-full">
                <HealthForm />
            </div>
        );
    }
}
