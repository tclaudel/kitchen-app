# Déploiement Coolify

## 1. Créer la ressource

Dans Coolify : **New Resource → Application → Git Repository**.

- Repository : le dépôt Git du projet
- Base directory : `/app`
- Build pack : `Dockerfile`
- Dockerfile location : `/Dockerfile`
- Port : `3000`

Après chaque push sur `main`, Coolify peut redéployer automatiquement l'application si le webhook Git est activé. La pipeline GitHub Actions valide le code avant le déploiement Coolify.

## 2. Variables d'environnement

```text
DATABASE_URL=file:/data/recipes.db
NODE_ENV=production
OPENCODE_SERVER_PASSWORD=generate-a-long-random-password
OPENCODE_SERVER_HOSTNAME=127.0.0.1
OPENCODE_SERVER_PORT=4096
```

## 3. Volumes persistants

Créer ces volumes dans l'application :

```text
/data
/app/uploads
```

Le volume `/data` conserve SQLite. Le volume `/app/uploads` conservera les photos importées lorsque le stockage sera branché.

OpenCode Server reste accessible uniquement depuis le conteneur sur `127.0.0.1:4096`. Ne pas publier le port 4096 dans Coolify et ne jamais exposer ce serveur directement au navigateur.

## 4. Initialisation de la base

Après le premier déploiement, exécuter dans le terminal de l'application :

```bash
npx prisma migrate deploy
npm run db:seed
```

Ne relancer le seed qu'une seule fois sur une base vide.

## 5. Domaine et HTTPS

Associer le domaine dans l'onglet **Domains**, puis activer le certificat Let's Encrypt fourni par Coolify.

## 6. Vérification

- Ouvrir `/recipes`.
- Vérifier la présence des recettes seedées.
- Ouvrir une recette.
- Tester la recherche.
- Tester l'import photo jusqu'à l'écran de revue.
