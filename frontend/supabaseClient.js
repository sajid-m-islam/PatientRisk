import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error("Missing VITE_SUPABASE_URL. Did you create .env.local?");
}
if (!supabaseAnonKey) {
    console.error("Missing VITE_SUPABASE_ANON_KEY. Did you create .env.local?");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
