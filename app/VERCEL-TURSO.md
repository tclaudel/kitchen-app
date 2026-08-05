# Déploiement Vercel + Turso

## Préparer le dépôt

1. Publier le dossier `app/` dans un dépôt GitHub.
2. Dans Vercel, importer le dépôt.
3. Définir le **Root Directory** sur `app` si le dépôt contient aussi `_bmad-output/`.
4. Utiliser la commande de build `npm run build`.

## Base Turso

Créer une base Turso et récupérer son URL libSQL et son token. Les variables Vercel devront contenir :

```text
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
```

La configuration Prisma actuelle utilise encore SQLite local avec `better-sqlite3`. Elle doit être remplacée par l'adaptateur libSQL avant le premier déploiement Vercel.

## Photos

Le stockage local n'est pas persistant sur Vercel. Pour conserver les photos, utiliser ensuite un stockage objet comme Vercel Blob ou Cloudflare R2. Pour le premier déploiement, l'import peut rester en mode revue sans conserver durablement le fichier source.

## Vérification après déploiement

- Ouvrir `/recipes`.
- Vérifier la connexion à Turso.
- Ouvrir une recette.
- Tester la recherche.
- Tester l'écran de revue photo.
