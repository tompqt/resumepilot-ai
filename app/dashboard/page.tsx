"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";
import { FileText, PlusCircle, Loader2, FileCheck, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

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

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profileData) {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.email,
          })
          .select()
          .single();
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (docs) {
        setDocuments(docs);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Bon retour, {user?.user_metadata?.name || "Utilisateur"} !
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Totaux</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">CV et lettres de motivation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crédits Restants</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.subscription_tier === "free"
                  ? profile?.credits_remaining ?? 3
                  : "Illimité"}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.subscription_tier === "free"
                  ? "Générations gratuites restantes"
                  : "Abonné premium"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Actuel</CardTitle>
              <Badge variant="outline" className="capitalize">
                {profile?.subscription_tier === "free" ? "Gratuit" : profile?.subscription_tier || "Gratuit"}
              </Badge>
            </CardHeader>
            <CardContent>
              {profile?.subscription_tier === "free" && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Améliorer le Plan
                  </Button>
                </Link>
              )}
              {profile?.subscription_tier !== "free" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Merci pour votre soutien !
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/cv">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Générer un CV
                  </CardTitle>
                  <CardDescription>
                    Créez un CV professionnel adapté à votre candidature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau CV
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cover-letter">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Générer une Lettre de Motivation
                  </CardTitle>
                  <CardDescription>
                    Rédigez une lettre de motivation convaincante qui se démarque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle Lettre de Motivation
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Documents Récents</h2>
          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun document pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Commencez par créer votre premier CV ou lettre de motivation
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/cv">
                    <Button>Créer un CV</Button>
                  </Link>
                  <Link href="/cover-letter">
                    <Button variant="outline">Créer une Lettre de Motivation</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>
                          Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
