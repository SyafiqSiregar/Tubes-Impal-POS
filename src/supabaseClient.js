import { createClient } from '@supabase/supabase-js';

// GANTI URL DAN ANON KEY DI BAWAH INI DARI DASHBOARD SUPABASE ANDA
const supabaseUrl = 'https://swbwjaojtczybpirwtjr.supabase.co';
const supabaseAnonKey = 'sb_publishable_y3ewIeIYJ4U4THkM9xRU_g_odLQM6Pc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
