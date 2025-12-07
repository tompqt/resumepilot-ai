"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";
import { Loader2, Sparkles, FileText, AlertCircle, Crown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CVPreview } from "@/components/cv-preview";

export default function CVGeneratorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    jobTitle: "",
    jobDescription: "",
  });

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

      setProfile(profileData);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          alert(`${data.error}\n\nVeuillez passer à un plan payant pour continuer à générer des CV.`);
        } else {
          alert(`Échec de la génération du CV: ${data.error}\nDétails: ${data.details || 'Erreur inconnue'}`);
        }
        return;
      }

      setGeneratedCV(data.cv);

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .maybeSingle();

      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error generating CV:", error);
      alert("Échec de la génération du CV. Veuillez réessayer.");
    } finally {
      setGenerating(false);
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
      <Container className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-10 w-10 text-blue-600" />
            Générateur de CV
          </h1>
          <p className="text-muted-foreground">
            Créez un CV professionnel adapté à votre emploi cible avec l'IA
          </p>
        </div>

        {profile?.subscription_tier === "free" && (
          <Alert className="mb-6" variant={profile?.credits_remaining === 0 ? "destructive" : profile?.credits_remaining === 1 ? "default" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {profile?.credits_remaining === 0 ? "Plus de Générations Gratuites" : `${profile?.credits_remaining} Génération${profile?.credits_remaining > 1 ? 's' : ''} Gratuite${profile?.credits_remaining > 1 ? 's' : ''} Restante${profile?.credits_remaining > 1 ? 's' : ''}`}
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                {profile?.credits_remaining === 0
                  ? "Passez à un plan payant pour continuer à générer des CV."
                  : "Passez à des générations illimitées avec un plan payant."}
              </span>
              <Link href="/pricing">
                <Button size="sm" variant={profile?.credits_remaining === 0 ? "default" : "outline"}>
                  <Crown className="mr-2 h-4 w-4" />
                  Améliorer Maintenant
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Vos Informations</CardTitle>
                <CardDescription>Remplissez vos informations pour générer votre CV</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom Complet</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jean@exemple.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Résumé Professionnel</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Bref aperçu de votre parcours professionnel..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Expérience Professionnelle</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Listez votre expérience professionnelle, réalisations et responsabilités..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Formation</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Votre parcours académique..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Compétences</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="Listez vos compétences clés..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Poste Ciblé</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="ex: Ingénieur Logiciel Senior"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Description du Poste</Label>
                    <Textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                      placeholder="Collez la description du poste ici pour adapter votre CV..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération du CV...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Générer un CV avec l'IA
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            {generatedCV ? (
              <CVPreview data={generatedCV} />
            ) : (
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>CV Généré</CardTitle>
                  <CardDescription>Votre CV professionnel généré par IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Remplissez le formulaire et cliquez sur générer pour voir votre CV ici</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
