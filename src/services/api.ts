// src/api.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL ou Anon Key não encontradas nas variáveis de ambiente.');
  throw new Error('Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes.');
}

console.info('✅ Supabase URL e Anon Key carregadas com sucesso.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
