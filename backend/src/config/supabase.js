const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://juxfdgsyhpmyujxghqgb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eGZkZ3N5aHBteXVqeGdocWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDk1MDYsImV4cCI6MjEwNzEyNTUwNn0.Q3X6Y8qy5p027FJW_GwwEWDl5qYW1iIBdiJVcbgOuII';

let supabase = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false
    }
  });
  console.log('Supabase client initialized for URL:', SUPABASE_URL);
} catch (err) {
  console.error('Error initializing Supabase client:', err);
}

module.exports = {
  supabase,
  SUPABASE_URL
};
