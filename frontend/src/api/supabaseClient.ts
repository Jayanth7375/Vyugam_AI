import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://juxfdgsyhpmyujxghqgb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eGZkZ3N5aHBteXVqeGdocWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDk1MDYsImV4cCI6MjEwNzEyNTUwNn0.Q3X6Y8qy5p027FJW_GwwEWDl5qYW1iIBdiJVcbgOuII';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
