import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  type: "cv" | "cover_letter" | "ats_analysis";
  title: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "incomplete";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}
