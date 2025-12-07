"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";
import { Loader2, CreditCard, User, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setName(session.user.user_metadata?.name || "");
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (error) throw error;

      setMessage("Profil mis à jour avec succès !");
    } catch (error: any) {
      setMessage(error.message || "Échec de la mise à jour du profil");
    } finally {
      setUpdating(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/billing-portal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/pricing");
          return;
        }
        throw new Error(data.error || "Échec de l'ouverture du portail de facturation");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Failed to open billing portal:", error);
      setMessage(error.message || "Échec de l'ouverture du portail de facturation. Veuillez d'abord améliorer votre plan.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Paramètres du Compte</h1>
          <p className="text-muted-foreground">Gérez votre compte et votre abonnement</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du Profil
              </CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {message && (
                  <div className="bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={user?.email} disabled />
                  </div>
                </div>
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mettre à Jour le Profil
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Abonnement
              </CardTitle>
              <CardDescription>Gérez votre abonnement et facturation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Plan Actuel</p>
                  <p className="text-sm text-muted-foreground">Plan Gratuit</p>
                </div>
                <Badge>Gratuit</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Crédits</p>
                  <p className="text-sm text-muted-foreground">10 crédits restants</p>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button onClick={handleManageSubscription} className="w-full">
                  Améliorer le Plan
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/pricing")}>
                  Voir les Tarifs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
