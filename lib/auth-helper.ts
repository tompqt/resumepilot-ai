import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function getAuthenticatedUser(request: NextRequest) {
  console.log("[AUTH] 1. Vérification de l'authentification...");

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    console.log("[AUTH] ✗ ERREUR: Pas de header Authorization");
    return { user: null, error: "No authorization header" };
  }

  console.log("[AUTH] 2. Header Authorization présent");
  const token = authHeader.replace("Bearer ", "");
  console.log("[AUTH] 3. Token extrait (longueur):", token.length);

  try {
    // Décodage du JWT localement (pas d'appel HTTP)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("[AUTH] 4. JWT décodé avec succès");
    console.log("[AUTH] 5. User ID:", payload.sub);
    console.log("[AUTH] 6. Email:", payload.email);
    console.log("[AUTH] 7. Expiration:", new Date(payload.exp * 1000).toISOString());

    // Vérifier l'expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log("[AUTH] ✗ ERREUR: Token expiré");
      return { user: null, error: "Token expired" };
    }

    // Construire un objet user compatible
    const user = {
      id: payload.sub,
      email: payload.email,
      aud: payload.aud,
      role: payload.role,
      app_metadata: payload.app_metadata || {},
      user_metadata: payload.user_metadata || {},
      created_at: payload.created_at,
    };

    console.log("[AUTH] ✓ Utilisateur authentifié:", user.email);
    return { user, error: null };
  } catch (error: any) {
    console.log("[AUTH] ✗ ERREUR lors du décodage JWT:");
    console.log("[AUTH]   - Message:", error.message);
    return { user: null, error: `Invalid token: ${error.message}` };
  }
}

export async function ensureUserProfile(userId: string, email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: userId,
      email: email,
      full_name: email,
    });
  }

  return profile;
}

export async function checkAIGenerationLimit(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("subscription_tier, credits_remaining")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile) {
    return {
      allowed: false,
      error: "Unable to verify your account. Please try again.",
    };
  }

  if (profile.subscription_tier !== "free") {
    return { allowed: true, error: null, remainingCredits: null };
  }

  if (profile.credits_remaining <= 0) {
    return {
      allowed: false,
      error: "You have used all 3 free generations. Please upgrade to continue.",
      remainingCredits: 0,
    };
  }

  return {
    allowed: true,
    error: null,
    remainingCredits: profile.credits_remaining
  };
}

export async function useGenerationCredit(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, credits_remaining")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return { error: "Profile not found" };
  }

  if (profile.subscription_tier === "free" && profile.credits_remaining > 0) {
    const { error } = await supabase
      .from("profiles")
      .update({
        credits_remaining: profile.credits_remaining - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return { error: "Failed to update credits" };
    }

    return { error: null, remainingCredits: profile.credits_remaining - 1 };
  }

  return { error: null, remainingCredits: null };
}
