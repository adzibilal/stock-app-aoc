import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://whlzumujufwquneuwdbf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobHp1bXVqdWZ3cXVuZXV3ZGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg5NzUxMTUsImV4cCI6MTk5NDU1MTExNX0.9SBQFZfsyNqkmM2jfJmUeucsf5mE9hdhqYEY8Ji20E4')