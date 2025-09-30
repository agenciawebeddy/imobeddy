import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhukvpvqjsccqwvywoee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWt2cHZxamNjY3F3dnl3b2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTAyNzUsImV4cCI6MjA3NDE2NjI3NX0.43vekofiKmqcFW1q1kjeGGQtt1UA4AyrxxsMqPHzcdE';

export const supabase = createClient(supabaseUrl, supabaseKey);