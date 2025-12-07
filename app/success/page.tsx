"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [userPlan, setUserPlan] = useState<string>("pro");
  const isDemoMode = searchParams.get("demo") === "true";

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", session.user.id)
          .single();

        if (profile?.subscription_tier) {
          setUserPlan(profile.subscription_tier);
        }
      }
    };

    fetchUserPlan();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/cv");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const getPlanDetails = () => {
    if (userPlan === "enterprise") {
      return {
        name: "Entreprise",
        credits: "Illimité",
        features: [
          "Générations IA illimitées",
          "Toutes les fonctionnalités Pro",
          "Collaboration d'équipe",
          "Accès API",
          "Support dédié"
        ]
      };
    }
    return {
      name: "Pro",
      credits: "50",
      features: [
        "50 générations IA par mois",
        "Tous les modèles",
        "Analyse ATS",
        "Optimisation CV",
        "Support prioritaire"
      ]
    };
  };

  const planDetails = getPlanDetails();

  return (
    <Container className="min-h-screen flex items-center justify-center py-16">
      <Card className="max-w-2xl w-full border-green-500/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl">
            {isDemoMode ? "Mode Démo Activé !" : "Paiement Réussi !"}
          </CardTitle>
          <CardDescription className="text-lg">
            {isDemoMode
              ? "Test de la plateforme avec les fonctionnalités de démonstration"
              : `Bienvenue dans le plan ${planDetails.name}`}
          </CardDescription>
          {isDemoMode && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm">
              <p className="text-yellow-800 dark:text-yellow-200">
                Mode démo : Les paiements Stripe sont simulés dans cet environnement. En production, vous serez redirigé vers le vrai système de paiement.
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-semibold">Plan</span>
              <span className="text-lg font-bold">{planDetails.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-semibold">Crédits Mensuels</span>
              <span className="text-lg font-bold">{planDetails.credits}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Vos fonctionnalités :</h3>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="font-medium">
                Redirection vers le créateur de CV dans {countdown} secondes...
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Vous pouvez commencer à créer votre CV professionnel maintenant
            </p>
          </div>

          <div className="pt-4 border-t text-center text-sm text-muted-foreground">
            {!isDemoMode && (
              <>
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
                <p className="mt-1">Vous pouvez gérer votre abonnement à tout moment depuis votre page de compte.</p>
              </>
            )}
            {isDemoMode && (
              <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                Mode démo actif - Aucun paiement réel n'a été effectué
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
