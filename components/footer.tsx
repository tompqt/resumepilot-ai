import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-foreground">
                ResumePilot.ai
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Générez des CV et lettres de motivation professionnels propulsés par l'IA.
              Démarquez-vous de la foule et décrochez l'emploi de vos rêves.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Produit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/cv" className="hover:text-foreground">
                  Générateur CV
                </Link>
              </li>
              <li>
                <Link href="/cover-letter" className="hover:text-foreground">
                  Lettre de Motivation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Entreprise</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Tableau de Bord
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-foreground">
                  Compte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumePilot.ai. Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  );
}
