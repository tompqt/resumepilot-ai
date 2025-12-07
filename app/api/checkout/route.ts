import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthenticatedUser, ensureUserProfile } from "@/lib/auth-helper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

const isStackBlitz = process.env.STACKBLITZ === 'true' ||
  (typeof process !== 'undefined' && process.versions && 'webcontainer' in process.versions);

export async function POST(request: NextRequest) {
  try {
    console.log("[CHECKOUT] Début de la requête checkout");
    console.log("[CHECKOUT] Environnement StackBlitz:", isStackBlitz);

    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      console.log("[CHECKOUT] ✗ Échec d'authentification:", authError);
      return NextResponse.json({
        error: authError || "Unauthorized",
        details: "Authentication failed - check server logs for more info"
      }, { status: 401 });
    }

    console.log("[CHECKOUT] ✓ Utilisateur authentifié:", user.email);

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID required" },
        { status: 400 }
      );
    }

    if (isStackBlitz) {
      console.log("[CHECKOUT] Mode DEMO activé - Simulation du checkout Stripe");
      const demoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id=demo_${Date.now()}&demo=true`;

      ensureUserProfile(user.id, user.email!).catch(err => {
        console.error("[CHECKOUT] Profile creation failed (non-blocking):", err);
      });

      return NextResponse.json({
        url: demoUrl,
        demo: true,
        message: "Mode démo - Paiement simulé"
      });
    }

    console.log("[CHECKOUT] Création de la session Stripe...");

    const checkoutSession = await stripe.checkout.sessions.create(
      {
        customer_email: user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
        },
      },
      {
        timeout: 10000,
        maxNetworkRetries: 1,
      }
    );

    console.log("[CHECKOUT] ✓ Session créée:", checkoutSession.id);

    ensureUserProfile(user.id, user.email!).catch(err => {
      console.error("[CHECKOUT] Profile creation failed (non-blocking):", err);
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[CHECKOUT] ✗ Erreur:", error.message);

    if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
      console.log("[CHECKOUT] Timeout détecté - Activation du mode DEMO");
      const demoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id=demo_${Date.now()}&demo=true`;
      return NextResponse.json({
        url: demoUrl,
        demo: true,
        message: "Mode démo activé (timeout réseau)"
      });
    }

    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
