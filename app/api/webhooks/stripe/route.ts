import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase-server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const supabase = await getServerSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const plan =
          subscription.items.data[0].price.id === PLANS.pro.priceId
            ? "pro"
            : "enterprise";
        const credits = PLANS[plan].credits;
        const periodEnd = (subscription as any).current_period_end as number | undefined;

        await supabase
          .from("profiles")
          .update({
            subscription_tier: plan,
            credits_remaining: credits,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
            credits_reset_date: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          })
          .eq("id", userId);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, subscription_tier")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (!existingProfile) break;

        const plan =
          subscription.items.data[0].price.id === PLANS.pro.priceId
            ? "pro"
            : "enterprise";
        const periodEnd = (subscription as any).current_period_end as number | undefined;
        const credits = PLANS[plan].credits;

        await supabase
          .from("profiles")
          .update({
            subscription_tier: plan,
            subscription_status: subscription.status,
            credits_remaining: credits,
            credits_reset_date: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (!existingProfile) break;

        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "canceled",
            credits_remaining: PLANS.free.credits,
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;

        if (subscriptionId) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId as string);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}
