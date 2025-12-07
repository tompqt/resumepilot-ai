# 🚀 Configuration rapide de Supabase

## ⚠️ IMPORTANT: Configuration requise avant utilisation

### Étape 1: Désactiver la confirmation email

**CRITIQUE**: Sans cette étape, la création de compte ne fonctionnera pas!

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet: `0ec90b57d6e95fcbda19832f`
3. Dans la barre latérale, cliquez sur **Authentication** → **Settings**
4. Trouvez la section **Email Settings**
5. **DÉSACTIVEZ** l'option "Enable email confirmations"
6. Cliquez sur **Save**

### Étape 2: Initialiser la base de données

1. Dans le dashboard Supabase, cliquez sur **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez TOUT le contenu du fichier `supabase/init.sql`
4. Cliquez sur **Run** (ou Ctrl/Cmd + Enter)

### Ce que fait le script:

- Crée la table `profiles` pour stocker les informations utilisateur
- Crée la table `documents` pour stocker les CVs et lettres de motivation
- Configure Row Level Security (RLS) pour la sécurité
- Crée des triggers pour créer automatiquement un profil lors de l'inscription
- Ajoute des index pour améliorer les performances

### Vérification:

Après l'exécution du script, vous devriez voir:
- Table `profiles` dans votre base de données
- Table `documents` dans votre base de données
- Les policies RLS configurées

## Variables d'environnement

Assurez-vous que votre fichier `.env` contient toutes les variables nécessaires:

```
OPENAI_API_KEY=votre_clé_openai
STRIPE_SECRET_KEY=votre_clé_stripe
STRIPE_WEBHOOK_SECRET=votre_webhook_secret
STRIPE_PRO_PRICE_ID=votre_price_id_pro
STRIPE_ENTERPRISE_PRICE_ID=votre_price_id_enterprise
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=votre_price_id_pro
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=votre_price_id_enterprise
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

## Stripe Configuration

1. Créez des produits dans Stripe Dashboard
2. Créez des prix pour les plans Pro et Enterprise
3. Copiez les Price IDs dans vos variables d'environnement
4. Configurez le webhook Stripe pour pointer vers `/api/webhooks/stripe`
