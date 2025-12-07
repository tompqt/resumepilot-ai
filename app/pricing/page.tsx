"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PLANS } from "@/lib/plans";
import { supabase } from "@/lib/supabase-client";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleCheckout = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      window.location.href = "/signup";
      return;
    }

    setLoading(planName);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (!session) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Veuillez vous connecter d'abord",
        });
        setTimeout(() => {
          window.location.href = "/login?redirect=/pricing";
        }, 2000);
        setLoading(null);
        return;
      }

      if (sessionError) {
        toast({
          variant: "destructive",
          title: "Erreur de session",
          description: "Veuillez vous reconnecter",
        });
        setTimeout(() => {
          window.location.href = "/login?redirect=/pricing";
        }, 2000);
        setLoading(null);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Échec de la création du checkout",
      });
      setLoading(null);
    }
  };

  return (
    <Container className="py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Tarifs Simples et Transparents
          </h1>
          <p className="text-xl text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins de recherche d'emploi
          </p>
          {isAuthenticated !== null && (
            <p className="text-sm text-muted-foreground mt-2">
              {isAuthenticated ? "✓ Vous êtes connecté" : "Veuillez vous connecter pour vous abonner"}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Gratuit</CardTitle>
              <div className="mt-4">
                <span className="text-2xl font-bold">Essayer gratuitement</span>
              </div>
              <CardDescription className="mt-2">
                Parfait pour essayer la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">3 générations IA</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Tous les modèles</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Téléchargement en texte</span>
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleCheckout(null, "free")}
                disabled={loading === "free"}
              >
                {loading === "free" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Commencer"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-600 border-2 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Plus Populaire
              </span>
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">€9.50</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <CardDescription className="mt-2">
                Pour les chercheurs d'emploi actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">50 générations IA/mois</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Tous les modèles</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Analyse ATS</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Optimisation CV</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Support prioritaire</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleCheckout(PLANS.pro.priceId, "pro")}
                disabled={loading === "pro"}
              >
                {loading === "pro" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Démarrer l'essai Pro"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entreprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">€49</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <CardDescription className="mt-2">
                Pour les équipes et agences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Générations illimitées</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Toutes les fonctionnalités Pro</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Collaboration d'équipe</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Accès API</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Support dédié</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleCheckout(PLANS.enterprise.priceId, "enterprise")}
                disabled={loading === "enterprise"}
              >
                {loading === "enterprise" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Démarrer l'essai Entreprise"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">
            Questions Fréquemment Posées
          </h2>
          <div className="max-w-2xl mx-auto text-left space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                Comment fonctionnent les crédits ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Chaque génération IA (CV, lettre de motivation ou analyse ATS) utilise 1
                crédit. Les crédits sont renouvelés mensuellement pour les plans payants.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Puis-je annuler à tout moment ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Oui, vous pouvez annuler votre abonnement à tout moment. Vous
                continuerez à avoir accès jusqu'à la fin de votre période de facturation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Nous acceptons toutes les cartes bancaires principales via notre
                processeur de paiement sécurisé Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
