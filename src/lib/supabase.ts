import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwmynlghrmtoufyrcihp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bXlubGdocm10b3VmeXJjaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2Mzc3ODAsImV4cCI6MjA2NzIxMzc4MH0.1VpevdV-ReX7w3QCoM0xaPjSywusUtrbrtFk9AsWNAw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase