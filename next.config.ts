import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gttplcphxztyhiesfoon.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dHBsY3BoeHp0eWhpZXNmb29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njk5OTksImV4cCI6MjA4OTE0NTk5OX0.ZnVm_avtvUwnPdHXiEHvglvNW6elSmBVC2Dj3cNqjyw",
  },
};

export default nextConfig;
