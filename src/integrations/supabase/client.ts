// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://vsksnlkivrneyxwcowve.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3NubGtpdnJuZXl4d2Nvd3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDM4MjcsImV4cCI6MjA0NjExOTgyN30.yDxjzU4XyUAw7xI4tOYla-sFEgGGRcIwXwsoYB-naE8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);