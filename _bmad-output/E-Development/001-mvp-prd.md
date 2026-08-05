# PRD technique : Recettes en famille MVP

**Projet :** kitchen-app  
**Date :** 2026-08-04  
**Statut :** Prêt pour implémentation initiale

## 1. Objectif

Livrer en priorité une application web responsive permettant de centraliser des recettes et de les retrouver rapidement. Le MVP doit être déployable sur un VPS en une journée afin de démarrer une boucle de feedback réelle.

## 2. Périmètre MVP

### Inclus

- Application web responsive publique.
- Bibliothèque « Mes recettes ».
- Recherche texte sur titre, ingrédients, tags et description.
- Import d'une recette depuis une photo ou un scan.
- Extraction OCR vers une structure de recette standardisée.
- Édition et validation de la recette extraite avant enregistrement.
- Consultation mobile et desktop d'une recette.
- Signalement simple d'un incident d'extraction.

### Exclus

- Authentification et profils.
- Import URL.
- Saisie manuelle comme flux MVP principal.
- Modification ou suppression après enregistrement.
- Menus, recommandations, listes de courses et nutrition.
- IA générative avancée et format Cooklang.

## 3. Stack et déploiement

- Next.js + TypeScript.
- Tailwind CSS.
- Prisma + SQLite.
- Coolify sur VPS, avec Docker géré automatiquement.
- Volumes persistants Coolify pour SQLite et les images.

## 4. Modèle de données

### Recipe

- `id` : identifiant unique.
- `title` : titre obligatoire.
- `description` : texte optionnel.
- `imagePath` : chemin local optionnel.
- `ingredients` : liste structurée d'ingrédients, chaque élément comprenant texte, quantité et unité optionnelles.
- `steps` : liste ordonnée d'instructions non vide.
- `tags` : liste de textes optionnelle.
- `prepTimeMinutes` : entier optionnel.
- `cookTimeMinutes` : entier optionnel.
- `servings` : entier optionnel.
- `sourceType` : `photo` pour le MVP.
- `createdAt` : date de création.

### IncidentReport

- `id` : identifiant unique.
- `recipeId` : recette concernée.
- `message` : description obligatoire.
- `createdAt` : date du signalement.

## 5. Routes et vues

### `/recipes`

- Afficher le nom « Recettes en famille ».
- Afficher le titre « Mes recettes ».
- Afficher une recherche immédiatement visible.
- Afficher les recettes sous forme de cartes.
- Afficher un bouton « Ajouter une recette » avec icône appareil photo.
- Afficher un état vide lorsque la bibliothèque ne contient aucune recette.

### `/recipes/search`

- Recevoir une requête texte.
- Rechercher dans le titre, la description, les ingrédients et les tags.
- Afficher les résultats avec cartes réutilisables.
- Afficher les états chargement, aucun résultat et erreur.

### `/recipes/import`

- Permettre la prise ou la sélection d'une photo.
- Limiter le MVP à une recette par import.
- Afficher l'état de traitement OCR.
- Afficher une erreur exploitable en cas d'échec.

### `/recipes/import/review`

- Afficher les données OCR dans le template de recette.
- Autoriser la correction du titre, de la description, des ingrédients, des étapes et des métadonnées présentes.
- Permettre le signalement d'un incident.
- Enregistrer uniquement après validation.

### `/recipes/[id]`

- Afficher le titre, l'image disponible, les métadonnées disponibles, les ingrédients et les étapes.
- Afficher un contenu lisible sur mobile et desktop.
- Afficher un état recette introuvable et un état erreur.

## 6. Exigences fonctionnelles

### FR-001 Bibliothèque

L'application doit afficher les recettes existantes dans une bibliothèque consultable.

### FR-002 Recherche

La recherche doit couvrir le titre, la description, les ingrédients et les tags, avec un objectif de réponse inférieur à 10 secondes pour l'utilisateur.

### FR-003 Import photo

L'utilisateur doit pouvoir sélectionner une photo ou utiliser l'appareil photo depuis mobile.

### FR-004 OCR

Le système doit convertir l'image en brouillon structuré sans enregistrer directement le résultat.

### FR-005 Revue

L'utilisateur doit pouvoir corriger le brouillon avant validation.

### FR-006 Intégrité

Le système ne doit pas inventer les informations absentes. Les champs non extraits restent vides ou sont signalés.

### FR-007 Enregistrement

Une recette validée doit être enregistrée et apparaître dans la bibliothèque et la recherche.

### FR-008 Signalement

L'utilisateur doit pouvoir décrire un incident lié à l'extraction depuis l'écran de revue.

### FR-009 Consultation

Une recette enregistrée doit être consultable avec ses ingrédients et ses étapes dans l'ordre.

## 7. Exigences non fonctionnelles

- Responsive à partir de 320 px de largeur.
- Temps de réponse de recherche perceptiblement immédiat sur le volume MVP.
- Aucun secret ou fichier temporaire sensible exposé côté client.
- Validation serveur des données avant persistance.
- Volumes persistants Coolify pour SQLite et les images.
- Interface utilisable au clavier sur desktop.
- Cibles tactiles adaptées au mobile.

## 8. Critères d'acceptation principaux

### AC-001 Recherche rapide

Étant donné des recettes enregistrées, lorsque l'utilisateur saisit un titre ou un ingrédient, alors les recettes correspondantes apparaissent et une recette peut être ouverte en moins de 10 secondes dans un usage normal.

### AC-002 Capture photo

Étant donné un utilisateur mobile, lorsqu'il sélectionne « Ajouter une recette », alors il peut prendre ou choisir une photo et lancer l'extraction.

### AC-003 Revue OCR

Étant donné une extraction terminée, lorsque l'utilisateur ouvre la revue, alors il voit un brouillon structuré et peut modifier ses champs avant enregistrement.

### AC-004 Enregistrement

Étant donné un brouillon valide avec un titre et au moins une étape, lorsque l'utilisateur valide, alors la recette apparaît dans « Mes recettes » et dans les résultats de recherche.

### AC-005 Consultation

Étant donné une recette enregistrée, lorsque l'utilisateur l'ouvre, alors le titre, les ingrédients et les étapes sont lisibles sur mobile.

### AC-006 Incident

Étant donné une extraction incorrecte, lorsque l'utilisateur envoie un signalement, alors le message est enregistré avec la recette concernée.

## 9. Ordre d'implémentation

1. Initialisation Next.js, Tailwind, Prisma et SQLite.
2. Modèle Recipe et seed de données.
3. Page `/recipes` et cartes.
4. Recherche texte.
5. Page de consultation `/recipes/[id]`.
6. Import photo et stockage local.
7. OCR et écran de revue.
8. Validation, enregistrement et signalement.
9. Configuration Coolify, volumes persistants et déploiement VPS.

## 10. Décisions reportées

- Fournisseur OCR exact.
- Authentification et accès privé.
- Migration PostgreSQL.
- Import URL et saisie manuelle.
- Nutrition, listes de courses, menus et IA.
