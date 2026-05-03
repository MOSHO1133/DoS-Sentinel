import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  'https://hjgbcamapsfjyudpfule.supabase.co',
  'sb_publishable_xWyiVo7rxkg6QtPIIY6VkA_tSzS5OVj',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

export const TABLE = 'attack_logs';
export const FETCH_LIMIT = 100000;