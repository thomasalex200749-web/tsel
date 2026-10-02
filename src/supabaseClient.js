import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuynqwqtftffdcomeskm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eW5xd3F0ZnRmZmRjb21lc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDkwNzMsImV4cCI6MjEwNTkyNTA3M30.ugo7hh30ftK3ocIySUpP72B2a6G3TODUlTeooSzDG5s';

export const supabase = createClient(supabaseUrl, supabaseKey);