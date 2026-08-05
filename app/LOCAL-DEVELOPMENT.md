# Guide de déploiement local

Ce guide permet d'installer et d'exécuter **Recettes en famille** sur un ordinateur local.

## Prérequis

Installer :

- Node.js 22 LTS ou supérieur.
- npm 10 ou supérieur.
- Git.
- OpenCode CLI si l'OCR OpenCode doit être utilisé.

Vérifier les versions :

```bash
node --version
npm --version
git --version
opencode --version
```

OpenCode est optionnel pour lancer l'interface et consulter les recettes. Il est requis pour tester l'extraction OCR réelle.

## 1. Récupérer le projet

Depuis un terminal :

```bash
git clone URL_DU_DEPOT
cd kitchen-app/app
```

Si le projet est déjà présent :

```bash
cd /chemin/vers/kitchen-app/app
```

## 2. Installer les dépendances

```bash
npm ci
```

Utiliser `npm install` uniquement si `package-lock.json` doit être régénéré.

## 3. Configurer l'environnement

Créer ou modifier `app/.env` :

```text
DATABASE_URL=file:./dev.db
OPENCODE_SERVER_URL=http://127.0.0.1:4096
OPENCODE_SERVER_PASSWORD=mot-de-passe-local
OPENCODE_SERVER_HOSTNAME=127.0.0.1
OPENCODE_SERVER_PORT=4096
OPENCODE_MODEL=opencode-go/kimi-k2.6
```

Ne jamais committer `.env` ou un mot de passe réel. Le fichier est ignoré par Git.

## 4. Initialiser Prisma et SQLite

Générer le client Prisma :

```bash
npx prisma generate
```

Créer ou appliquer la base locale :

```bash
npx prisma migrate deploy
```

Pour créer une nouvelle migration après une modification du schéma :

```bash
npx prisma migrate dev --name description-du-changement
```

Ajouter les données de démonstration :

```bash
npm run db:seed
```

Le seed ne doit être lancé qu'une fois sur une base vide si l'on veut éviter les doublons.

Inspecter la base avec Prisma Studio :

```bash
npx prisma studio
```

## 5. Lancer l'application sans OCR

Pour tester l'interface, la bibliothèque, la recherche et la consultation :

```bash
npm run dev
```

Ouvrir :

```text
http://localhost:3000/recipes
```

Routes principales :

- `http://localhost:3000/recipes` — bibliothèque et recherche.
- `http://localhost:3000/recipes/import` — import photo.
- `http://localhost:3000/recipes/import/review` — écran de revue.
- `http://localhost:3000/recipes/<id>` — consultation d'une recette.

## 6. Activer OpenCode Server pour l'OCR

Avant de lancer le serveur, vérifier que le port 4096 n'est pas déjà utilisé :

```bash
lsof -nP -iTCP:4096 -sTCP:LISTEN
```

Si OpenCode est déjà lancé sur ce port, ne pas démarrer une seconde instance. Vérifier simplement sa disponibilité avec la commande ci-dessous.

Dans un second terminal, depuis `app/`, lancer :

```bash
OPENCODE_SERVER_PASSWORD=mot-de-passe-local \
opencode serve \
  --hostname 127.0.0.1 \
  --port 4096
```

Le serveur doit rester limité à `127.0.0.1`. Ne pas l'exposer sur Internet.

Vérifier sa disponibilité :

```bash
curl -u opencode:mot-de-passe-local http://127.0.0.1:4096/global/health
```

Si le port est déjà occupé par un serveur OpenCode que tu veux remplacer, arrêter son processus puis relancer la commande. Pour utiliser un autre port, modifier simultanément le port du serveur et `OPENCODE_SERVER_URL` dans `.env`.

Si le serveur répond, retourner au terminal Next.js et lancer l'application :

```bash
npm run dev
```

## 7. Tester l'OCR

1. Ouvrir `http://localhost:3000/recipes`.
2. Cliquer sur **Ajouter une recette par photo**.
3. Sélectionner une photo nette d'une recette.
4. Cliquer sur **Extraire la recette**.
5. Vérifier le brouillon dans l'écran de revue.
6. Corriger les ingrédients ou les étapes si nécessaire.
7. Signaler un problème éventuel.
8. Enregistrer la recette.
9. Vérifier qu'elle apparaît dans la bibliothèque.

## 8. Configuration du fournisseur OpenCode

OpenCode doit avoir au moins un fournisseur configuré et authentifié. Vérifier les fournisseurs disponibles :

```bash
opencode providers
```

La commande exacte d'authentification dépend du fournisseur configuré dans OpenCode. Vérifier ensuite la configuration dans l'interface ou avec :

```bash
curl -u opencode:mot-de-passe-local http://127.0.0.1:4096/provider
```

Si aucun fournisseur ou modèle vision n'est disponible, le serveur peut fonctionner mais l'extraction d'image échouera.

Pour voir les modèles disponibles :

```bash
curl -u opencode:mot-de-passe-local http://127.0.0.1:4096/config/providers > /tmp/opencode-providers.json
```

Choisir un modèle dont la configuration indique une modalité d'entrée image. Pour OpenCode Go, renseigner son identifiant exact dans `OPENCODE_MODEL` après vérification. Ne pas supposer que `gpt-5.6-luna` accepte les images sans confirmer sa capacité dans cette réponse.

## 9. Vérifier la qualité du code

Avant de pousser des changements :

```bash
npm run lint
npm run build
```

La pipeline GitHub exécute également ces validations.

## 10. Mode production local

Construire l'application :

```bash
npm run build
```

Lancer le serveur de production :

```bash
npm run start
```

Ouvrir :

```text
http://localhost:3000/recipes
```

## 11. Réinitialiser la base locale

Attention : cette opération supprime les recettes locales.

```bash
rm -f dev.db dev.db-journal
npx prisma migrate deploy
npm run db:seed
```

## 12. Problèmes fréquents

### `P1003` ou base introuvable

Vérifier `DATABASE_URL` :

```text
DATABASE_URL=file:./dev.db
```

Puis relancer :

```bash
npx prisma migrate deploy
```

### OCR non configuré

Vérifier que le serveur OpenCode tourne :

```bash
curl -u opencode:mot-de-passe-local http://127.0.0.1:4096/global/health
```

Vérifier aussi `OPENCODE_SERVER_URL`, le mot de passe et la présence d'un fournisseur vision.

### Port 4096 déjà utilisé

Identifier le processus :

```bash
lsof -i :4096
```

Arrêter l'ancien serveur, ou choisir un autre port et modifier simultanément :

- `OPENCODE_SERVER_PORT`.
- `OPENCODE_SERVER_URL`.
- l'option `--port` d'OpenCode.

### Le build échoue après une modification Prisma

Régénérer le client :

```bash
npx prisma generate
npm run build
```

### Les changements d'interface ne s'affichent pas

- Vérifier que le serveur utilise le bon dossier `app/`.
- Arrêter puis relancer `npm run dev`.
- Supprimer `.next` si nécessaire, puis relancer le serveur.

## Commandes quotidiennes

```bash
cd app
npm ci
npm run db:seed       # uniquement pour une base vide
npm run dev
```

Dans un second terminal pour l'OCR :

```bash
cd app
OPENCODE_SERVER_PASSWORD=mot-de-passe-local opencode serve --hostname 127.0.0.1 --port 4096
```
