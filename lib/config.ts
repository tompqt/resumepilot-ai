// Configuration côté client - valeurs en dur pour éviter les problèmes de variables d'environnement
export const config = {
  supabase: {
    url: "https://qrpxdfgfesbdndlqbjid.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycHhkZmdmZXNiZG5kbHFiamlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTU2MDYsImV4cCI6MjA3OTIzMTYwNn0.NfhkjBhobX7bh2yJzs_tfQ_xarnozj9mM1FYc_nUxao",
  },
  stripe: {
    proPriceId: "price_1SZJISFtfDIeFywLyKvu2QBm",
    enterprisePriceId: "price_1SZJJDFtfDIeFywLwLuG4I8y",
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};
