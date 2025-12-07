"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";
import { Loader2, Sparkles, Download, Mail, FileText, AlertCircle, Crown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CoverLetterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const letterRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    hiringManager: "",
    jobDescription: "",
    whyInterested: "",
    relevantExperience: "",
    skills: "",
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

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            variant: "destructive",
            title: "Limite Atteinte",
            description: `${data.error}\n\nVeuillez passer à un plan payant pour continuer.`,
          });
          return;
        }
        throw new Error(data.error || "Échec de la génération de la lettre de motivation");
      }

      setGeneratedLetter(data.coverLetter);

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .maybeSingle();

      setProfile(updatedProfile);

      toast({
        title: "Succès !",
        description: "Votre lettre de motivation a été générée avec succès.",
      });
    } catch (error: any) {
      console.error("Error generating cover letter:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Échec de la génération de la lettre de motivation. Veuillez réessayer.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return;

    setDownloading(true);

    try {
      const originalElement = letterRef.current;

      const clonedElement = originalElement.cloneNode(true) as HTMLElement;
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "0";
      clonedElement.style.width = "210mm";
      clonedElement.style.padding = "20mm";
      clonedElement.style.backgroundColor = "#ffffff";
      clonedElement.style.boxSizing = "border-box";

      document.body.appendChild(clonedElement);

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clonedElement, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
      });

      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      if (scaledHeight > pdfHeight) {
        const adjustedRatio = pdfHeight / imgHeight;
        const adjustedWidth = imgWidth * adjustedRatio;
        const xOffset = (pdfWidth - adjustedWidth) / 2;

        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          0,
          adjustedWidth,
          pdfHeight
        );
      } else {
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdfWidth,
          scaledHeight
        );
      }

      pdf.save(
        `${formData.fullName.replace(/\s+/g, "_")}_Lettre_de_Motivation.pdf`
      );

      toast({
        title: "Téléchargé !",
        description: "Votre lettre de motivation a été téléchargée en PDF.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec du téléchargement du PDF. Veuillez réessayer.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.fullName.replace(/\s+/g, "_")}_Lettre_de_Motivation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Téléchargé !",
      description: "Votre lettre de motivation a été téléchargée en texte.",
    });
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
      <Container className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Mail className="h-10 w-10 text-green-600" />
            Générateur de Lettre de Motivation
          </h1>
          <p className="text-muted-foreground text-lg">
            Créez une lettre de motivation convaincante qui vous démarque avec l'IA
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
                  ? "Passez à un plan payant pour continuer à générer des lettres de motivation."
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

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Détails de la Lettre</CardTitle>
                <CardDescription>Fournissez des informations sur le poste et vous-même</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Votre Nom Complet</Label>
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
                      <Label htmlFor="email">Votre Email</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="phone">Votre Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de l'Entreprise</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Acme Corporation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Titre du Poste</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="Ingénieur Logiciel Senior"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hiringManager">Nom du Responsable de Recrutement (Optionnel)</Label>
                    <Input
                      id="hiringManager"
                      name="hiringManager"
                      value={formData.hiringManager}
                      onChange={handleInputChange}
                      placeholder="Marie Durand"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Description du Poste</Label>
                    <Textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                      placeholder="Collez la description du poste ici..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyInterested">Pourquoi ce poste vous intéresse-t-il ?</Label>
                    <Textarea
                      id="whyInterested"
                      name="whyInterested"
                      value={formData.whyInterested}
                      onChange={handleInputChange}
                      placeholder="Expliquez votre motivation et votre intérêt pour l'entreprise et le poste..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relevantExperience">Expérience Pertinente</Label>
                    <Textarea
                      id="relevantExperience"
                      name="relevantExperience"
                      value={formData.relevantExperience}
                      onChange={handleInputChange}
                      placeholder="Mettez en avant votre expérience et réalisations les plus pertinentes..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Compétences Clés</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="Listez vos compétences clés pertinentes pour ce poste..."
                      rows={2}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Générer la Lettre de Motivation avec l'IA
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Lettre de Motivation Générée</CardTitle>
                <CardDescription>Votre lettre de motivation professionnelle générée par IA</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="space-y-4">
                    <div
                      ref={letterRef}
                      className="bg-white p-16 rounded-lg shadow-lg border border-gray-300 max-h-[700px] overflow-y-auto"
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: "1.6",
                        color: "#000000",
                        fontSize: "16px",
                      }}
                    >
                      <div className="max-w-2xl mx-auto space-y-8">
                        <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                            {formData.fullName}
                          </div>
                          <div style={{ color: "#333333" }}>{formData.email}</div>
                          {formData.phone && (
                            <div style={{ color: "#333333" }}>{formData.phone}</div>
                          )}
                        </div>

                        <div style={{ fontSize: "14px", color: "#333333" }}>
                          {new Date().toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>

                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            fontSize: "16px",
                            lineHeight: "1.6",
                            letterSpacing: "0.01em",
                            textAlign: "justify",
                          }}
                        >
                          {generatedLetter}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="w-full"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Génération du PDF...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleDownloadText}
                        variant="outline"
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Télécharger Texte
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">Aucune lettre de motivation encore</p>
                    <p className="text-sm">
                      Remplissez le formulaire et cliquez sur générer pour voir votre lettre de motivation ici
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
