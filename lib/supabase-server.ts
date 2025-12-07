import { createClient } from "@supabase/supabase-js";

export async function getServerSupabase() {
  const supabaseUrl = "https://qrpxdfgfesbdndlqbjid.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycHhkZmdmZXNiZG5kbHFiamlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTU2MDYsImV4cCI6MjA3OTIzMTYwNn0.NfhkjBhobX7bh2yJzs_tfQ_xarnozj9mM1FYc_nUxao";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function getSession() {
  const supabase = await getServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUserProfile(userId: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserDocuments(userId: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserSubscription(userId: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
