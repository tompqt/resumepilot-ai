# Guide de Déploiement - ResumePilot.ai

Ce guide vous explique comment déployer votre site sur Vercel pour qu'il soit accessible publiquement et trouvable sur Google.

## Prérequis

1. Un compte GitHub (gratuit)
2. Un compte Vercel (gratuit)
3. Vos clés API (OpenAI, Stripe, Supabase)

## Étape 1 : Pousser le code sur GitHub

### Si ce n'est pas déjà fait :

```bash
# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - ResumePilot.ai"

# Créer un nouveau repository sur GitHub, puis :
git remote add origin https://github.com/VOTRE-USERNAME/resumepilot.git
git branch -M main
git push -u origin main
```

## Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre repository GitHub
5. Vercel détectera automatiquement Next.js
6. **AVANT de déployer**, cliquez sur "Environment Variables" pour les configurer

## Étape 3 : Configurer les Variables d'Environnement

**IMPORTANT : Configurez TOUTES ces variables AVANT le premier déploiement !**

Dans la section "Environment Variables" de Vercel, ajoutez ces variables :

### Variables Obligatoires :

```
OPENAI_API_KEY=votre_clé_openai
STRIPE_SECRET_KEY=votre_clé_stripe
STRIPE_WEBHOOK_SECRET=votre_webhook_secret
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_xxx
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Note sur NEXT_PUBLIC_APP_URL** :
- Si c'est votre premier déploiement et que vous ne connaissez pas encore l'URL Vercel, utilisez temporairement : `https://reformpilot.ai`
- Après le premier déploiement, Vercel vous donnera une URL (ex: `https://votre-projet.vercel.app`)
- Retournez dans Settings > Environment Variables et mettez à jour `NEXT_PUBLIC_APP_URL` avec votre URL Vercel
- Redéployez en allant dans Deployments > ... > Redeploy

## Étape 4 : Configurer Stripe Webhooks

1. Allez dans [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Créez un nouveau webhook
3. URL : `https://votre-domaine.vercel.app/api/webhooks/stripe`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le signing secret et ajoutez-le à `STRIPE_WEBHOOK_SECRET`

## Étape 5 : Vérifier le Déploiement

1. Cliquez sur "Deploy" dans Vercel
2. Attendez que le build se termine (2-5 minutes)
3. Cliquez sur "Visit" pour voir votre site en ligne

## Étape 6 : Référencement Google

### Soumettre à Google Search Console

1. Allez sur [Google Search Console](https://search.google.com/search-console)
2. Ajoutez votre propriété (votre URL Vercel)
3. Vérifiez la propriété via DNS ou HTML
4. Soumettez votre sitemap : `https://votre-domaine.vercel.app/sitemap.xml`

### Fichiers SEO déjà configurés

- ✅ `robots.txt` - Permet aux moteurs de recherche d'indexer votre site
- ✅ `sitemap.xml` - Liste toutes vos pages pour Google
- ✅ Métadonnées SEO - Titres, descriptions, Open Graph

### Temps d'indexation

- Google peut prendre de 1 jour à 4 semaines pour indexer votre site
- Publiez du contenu de qualité régulièrement
- Obtenez des liens depuis d'autres sites (backlinks)

## Étape 7 : Domaine Personnalisé (Optionnel)

1. Achetez un domaine (ex: reformpilot.ai)
2. Dans Vercel, allez dans Settings > Domains
3. Ajoutez votre domaine personnalisé
4. Suivez les instructions DNS de Vercel
5. Mettez à jour `NEXT_PUBLIC_APP_URL` avec votre nouveau domaine

## Maintenance

### Déploiement Automatique

Chaque fois que vous pushez sur GitHub, Vercel redéploie automatiquement !

```bash
git add .
git commit -m "Update feature"
git push
```

### Monitorer votre Site

- Vercel fournit des analytics gratuits
- Surveillez les erreurs dans le dashboard Vercel
- Vérifiez les logs pour débugger

## Résolution de Problèmes

### Erreur "Invalid URL" ou "ERR_INVALID_URL"

Si vous voyez cette erreur :
```
[TypeError: Invalid URL] {
  code: 'ERR_INVALID_URL',
  input: 'NEXT_PUBLIC_APP_URL=https://example.com'
}
```

**Solution** :
1. Allez dans Settings > Environment Variables dans Vercel
2. Vérifiez que `NEXT_PUBLIC_APP_URL` est bien définie (sans le préfixe `NEXT_PUBLIC_APP_URL=`)
3. La valeur doit être juste l'URL : `https://votre-domaine.vercel.app`
4. Redéployez le projet

### Le build échoue

- Vérifiez que toutes les variables d'environnement sont définies
- Regardez les logs de build dans Vercel
- Assurez-vous que `NEXT_PUBLIC_APP_URL` est une URL valide

### Les paiements ne fonctionnent pas

- Vérifiez que le webhook Stripe pointe vers la bonne URL
- Testez avec les clés de test Stripe d'abord

### Base de données

- Vérifiez que Supabase est accessible
- Testez la connexion avec les clés dans `.env`

## Support

Pour toute question :
1. Vérifiez les logs Vercel
2. Consultez la documentation Next.js
3. Vérifiez la configuration Stripe et Supabase
