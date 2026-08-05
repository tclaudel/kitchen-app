# Installer Coolify pour Recettes en famille

Ce guide décrit l'installation de Coolify sur un serveur VPS puis le déploiement de l'application Next.js.

## Prérequis

Prévoir :

- Un VPS neuf ou dédié à Coolify.
- Ubuntu 22.04 ou 24.04 LTS recommandé.
- Au moins 2 vCPU, 4 Go de RAM et 30 Go de disque pour commencer.
- Une adresse IP publique.
- Un accès SSH avec un utilisateur disposant de `sudo`.
- Un nom de domaine ou sous-domaine pointant vers l'IP du VPS.

Éviter d'installer Coolify sur un serveur qui héberge déjà Docker, Nginx ou des services importants : l'installation configure Docker et le reverse proxy du serveur.

## 1. Se connecter au VPS

Depuis ton ordinateur :

```bash
ssh root@IP_DU_VPS
```

Si tu utilises un autre utilisateur :

```bash
ssh utilisateur@IP_DU_VPS
```

Mettre le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Installer Coolify

Exécuter le script officiel depuis le VPS :

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

Le script installe Docker et Coolify. Ne pas lancer cette commande sur une machine contenant déjà des applications importantes sans sauvegarde et vérification préalable.

À la fin de l'installation, Coolify indique l'URL d'accès initiale. Elle ressemble généralement à :

```text
http://IP_DU_VPS:8000
```

Ouvrir cette adresse dans un navigateur.

## 3. Créer le premier compte

Depuis l'interface Coolify :

1. Créer le compte administrateur.
2. Utiliser un mot de passe unique et long.
3. Configurer le domaine principal de Coolify si proposé.
4. Activer HTTPS une fois le DNS configuré.

Ne pas exposer durablement l'interface d'administration uniquement avec une adresse IP et HTTP.

## 4. Configurer le domaine

Chez le fournisseur DNS, créer un enregistrement `A` :

```text
app.example.com  A  IP_DU_VPS
```

Attendre la propagation DNS, puis dans Coolify associer ce domaine au service ou à l'application concernée. Coolify peut ensuite générer un certificat Let's Encrypt.

## 5. Connecter le dépôt Git

Dans Coolify :

1. Ouvrir **Sources**.
2. Ajouter GitHub ou GitLab.
3. Autoriser l'accès au dépôt contenant le projet.
4. Vérifier que le code de l'application se trouve dans le dossier `app/`.

## 6. Créer l'application

Dans Coolify :

1. Créer un projet, par exemple `Recettes en famille`.
2. Ajouter une ressource **Application**.
3. Sélectionner le dépôt Git.
4. Sélectionner la branche de déploiement, généralement `main`.
5. Définir le répertoire racine sur :

```text
app
```

6. Choisir le build pack **Dockerfile**.
7. Définir le chemin du Dockerfile :

```text
/Dockerfile
```

8. Définir le port exposé à :

```text
3000
```

## 7. Ajouter les variables d'environnement

Dans l'application Coolify, ajouter :

```text
NODE_ENV=production
DATABASE_URL=file:/data/recipes.db
OPENCODE_SERVER_PASSWORD=generate-a-long-random-password
OPENCODE_SERVER_HOSTNAME=127.0.0.1
OPENCODE_SERVER_PORT=4096
```

Ne pas ajouter `DATABASE_AUTH_TOKEN` pour le mode SQLite local.

Le conteneur installe et démarre également OpenCode Server pour le traitement OCR. `OPENCODE_SERVER_PASSWORD` est obligatoire. Le serveur écoute uniquement sur `127.0.0.1` et son port 4096 ne doit pas être publié.

## 8. Ajouter les volumes persistants

Créer les volumes suivants dans la configuration de l'application :

```text
/data
/app/uploads
```

Le volume `/data` conserve la base SQLite entre les déploiements. Le volume `/app/uploads` conservera les photos lorsque leur stockage sera connecté au flux d'import.

Sans volume persistant, une nouvelle image ou un redéploiement peut supprimer la base locale.

## 9. Déployer

Lancer le premier déploiement depuis Coolify.

Le Dockerfile installe les dépendances, génère Prisma et construit Next.js. Une fois le déploiement terminé, ouvrir le domaine de l'application.

## 10. Initialiser la base

Dans le terminal de l'application Coolify, exécuter une seule fois :

```bash
npx prisma migrate deploy
npm run db:seed
```

Si la base contient déjà des données, ne pas relancer le seed sans vérifier son comportement.

## 11. Vérifier l'application

Tester :

1. `/recipes` affiche la bibliothèque.
2. Une recette seedée peut être ouverte.
3. La recherche filtre les recettes.
4. `/recipes/import` permet de choisir une photo.
5. `/recipes/import/review` permet de relire les données.
6. Une recette validée apparaît dans la bibliothèque.
7. Un redéploiement ne supprime pas les recettes.

## 12. Déploiements suivants

Pour chaque mise à jour :

1. Pousser les changements sur Git.
2. Laisser Coolify déclencher le déploiement automatique, ou cliquer sur **Deploy**.
3. Vérifier les logs du build et de l'application.
4. Tester `/recipes` après le déploiement.

Les migrations Prisma doivent être appliquées lorsque le schéma change :

```bash
npx prisma migrate deploy
```

## Dépannage rapide

### L'application ne démarre pas

- Vérifier les logs Coolify.
- Vérifier que le port est `3000`.
- Vérifier que `DATABASE_URL=file:/data/recipes.db` est défini.

### Les recettes disparaissent

- Vérifier que le volume `/data` est bien attaché.
- Vérifier que le chemin de base utilisé par l'application est `/data/recipes.db`.

### Le domaine ne répond pas

- Vérifier l'enregistrement DNS `A`.
- Vérifier que les ports 80 et 443 sont ouverts.
- Vérifier le certificat et le proxy dans Coolify.

### La migration échoue

- Vérifier la variable `DATABASE_URL` dans le terminal Coolify.
- Exécuter `npx prisma migrate deploy` depuis le répertoire de l'application.
- Consulter les logs complets de la commande.

## Sécurité minimale

- Utiliser des clés SSH plutôt qu'un mot de passe root.
- Désactiver l'accès SSH root par mot de passe après installation.
- Garder Coolify et le système à jour.
- Mettre en place une sauvegarde régulière du volume `/data`.
- Ne pas exposer de recettes privées tant que l'authentification n'est pas implémentée.
