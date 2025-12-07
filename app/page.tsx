import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Zap, CheckCircle2, ArrowRight, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Outils de Carrière Propulsés par IA
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Générez des CV Professionnels en{" "}
              <span className="text-blue-600 dark:text-blue-400">10 Secondes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Créez des CV et lettres de motivation optimisés pour les ATS avec l'IA.
              Démarquez-vous et décrochez l'emploi de vos rêves plus rapidement.
            </p>
            <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 px-6 py-3 rounded-lg mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  75% des chercheurs d'emploi obtiennent plus d'entretiens avec des CV optimisés par IA
                </span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Commencer Gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/cv">Essayer le Générateur</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Aucune carte de crédit requise. 3 générations gratuites.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comment Ça Marche
            </h2>
            <p className="text-muted-foreground">
              Générez des documents professionnels en trois étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>1. Entrez Vos Informations</CardTitle>
                <CardDescription>
                  Fournissez votre titre de poste, expérience et informations clés
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>2. L'IA Génère le Contenu</CardTitle>
                <CardDescription>
                  Notre IA crée un document professionnel optimisé pour les ATS
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>3. Téléchargez & Postulez</CardTitle>
                <CardDescription>
                  Obtenez votre document instantanément et commencez à postuler
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-muted/50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Fonctionnalités IA Puissantes
            </h2>
            <p className="text-muted-foreground">
              Tout ce dont vous avez besoin pour créer des candidatures gagnantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Optimisé pour les ATS",
                description: "Contournez les systèmes de suivi des candidatures avec un contenu optimisé par mots-clés"
              },
              {
                title: "Styles Multiples",
                description: "Choisissez parmi des formats professionnels, modernes ou créatifs"
              },
              {
                title: "Optimisation CV",
                description: "Adaptez automatiquement votre CV aux descriptions de poste spécifiques"
              },
              {
                title: "Lettres de Motivation",
                description: "Générez des lettres de motivation convaincantes qui attirent l'attention"
              },
              {
                title: "Analyse ATS",
                description: "Obtenez des commentaires détaillés et des suggestions d'amélioration"
              },
              {
                title: "Téléchargement Instantané",
                description: "Exportez en PDF et commencez à postuler immédiatement"
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Ce Que Disent Nos Utilisateurs
            </h2>
            <p className="text-muted-foreground">
              Rejoignez des milliers de chercheurs d'emploi satisfaits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sophie Martin",
                role: "Ingénieure Logiciel",
                content: "ResumePilot m'a aidée à décrocher l'emploi de mes rêves dans une grande entreprise tech. Le CV généré par IA était professionnel et optimisé pour les ATS !",
                rating: 5
              },
              {
                name: "Marc Dubois",
                role: "Responsable Marketing",
                content: "J'ai essayé beaucoup de créateurs de CV, mais celui-ci est de loin le meilleur. Le générateur de lettres de motivation est incroyable !",
                rating: 5
              },
              {
                name: "Julie Bernard",
                role: "Designer Produit",
                content: "La fonction d'analyse ATS m'a aidée à optimiser mon CV. J'ai obtenu 3 fois plus de rappels pour des entretiens !",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-muted/50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Questions Fréquemment Posées
            </h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir sur ResumePilot.ai
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment fonctionne le générateur de CV par IA ?</AccordionTrigger>
                <AccordionContent>
                  Notre IA analyse vos informations et génère un CV professionnel en utilisant des modèles de langage avancés. Elle structure votre expérience, met en valeur vos réalisations et optimise pour les systèmes ATS.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Combien de CV puis-je générer gratuitement ?</AccordionTrigger>
                <AccordionContent>
                  Le plan gratuit inclut 3 générations IA. Vous pouvez générer des CV, lettres de motivation ou effectuer des analyses ATS. Passez à Pro pour 50 générations par mois.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Puis-je modifier le contenu généré ?</AccordionTrigger>
                <AccordionContent>
                  Oui ! Après la génération, vous pouvez télécharger le contenu et le modifier dans n'importe quel éditeur de texte ou traitement de texte pour y ajouter votre touche personnelle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Mes données sont-elles sécurisées et privées ?</AccordionTrigger>
                <AccordionContent>
                  Absolument. Nous utilisons un chiffrement standard de l'industrie et ne partageons jamais vos informations personnelles. Vos documents sont stockés de manière sécurisée et accessibles uniquement par vous.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Qu'est-ce que l'optimisation ATS ?</AccordionTrigger>
                <AccordionContent>
                  L'optimisation ATS (Applicant Tracking System) garantit que votre CV est formaté et contient des mots-clés qui passent à travers les systèmes de filtrage automatisés utilisés par la plupart des entreprises.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-blue-600 dark:bg-blue-900 text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Décrocher l'Emploi de Vos Rêves ?
            </h2>
            <p className="text-blue-100 mb-8">
              Rejoignez des milliers de chercheurs d'emploi qui utilisent l'IA pour créer des candidatures gagnantes
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Commencer l'Essai Gratuit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
