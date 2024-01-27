import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string ; // Adres URL twojej instancji Supabase
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string; // Klucz publiczny (anon key)

const supabase = createClient(supabaseUrl, supabaseAnonKey, {db: {
    schema: "next_auth"
}});

export default supabase;