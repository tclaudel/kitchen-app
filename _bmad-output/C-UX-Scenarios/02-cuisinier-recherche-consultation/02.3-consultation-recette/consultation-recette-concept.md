# 02.3 Consultation d'une recette

**Scenario:** Le Cuisinier pragmatique retrouve une recette  
**Page Number:** 02.3  
**Created:** 2026-08-04  
**Method:** Whiteport Design Studio (WDS)

---

## Overview

**Page Purpose:** Afficher une recette complète, claire et directement utilisable sur mobile.

**Entry Point:** L'utilisateur sélectionne une carte dans les résultats de recherche.

**Main User Goal:** Lire les ingrédients et suivre les étapes de préparation sans ambiguïté.

**Business Goal:** Confirmer que la recherche mène rapidement à une consultation utile.

---

## Concept

- Titre de la recette clairement identifiable.
- Image de la recette si elle est disponible.
- Informations essentielles visibles avant les étapes.
- Liste d'ingrédients structurée et lisible.
- Étapes numérotées, séparées et faciles à suivre.
- Mise en page mobile-first avec une lecture confortable pendant la cuisine.

## Primary Interaction

L'utilisateur fait défiler la recette, consulte les ingrédients puis suit les étapes de préparation.

## Detailed Specification

### Access

- MVP public, sans authentification ni profils.
- La recette est accessible depuis une carte de la bibliothèque ou des résultats de recherche.

### Header and Recipe Summary

- Afficher un retour vers la page précédente.
- Afficher le titre complet de la recette.
- Afficher l'image principale lorsqu'elle existe.
- Afficher les métadonnées disponibles : durée, portions et source.
- Masquer les métadonnées absentes plutôt que d'afficher des valeurs fictives.

### Ingredients

- Afficher un titre de section **Ingrédients**.
- Présenter chaque ingrédient sur une ligne distincte.
- Conserver la quantité et l'unité exactement telles qu'extraites ou corrigées.
- Maintenir une lecture confortable sur mobile, sans tableau horizontal.

### Preparation

- Afficher un titre de section **Préparation**.
- Afficher les étapes dans l'ordre, avec une numérotation explicite.
- Séparer visuellement chaque étape.
- Préserver les paragraphes et retours à la ligne utiles à la compréhension.
- Ne pas fusionner ou tronquer les instructions importées.

### Responsive Behavior

- Mobile : contenu en une colonne, texte suffisamment grand et zones respirées pour la lecture pendant la cuisine.
- Desktop : largeur de lecture limitée afin d'éviter des lignes trop longues.
- L'image peut s'étendre au conteneur, sans déplacer les ingrédients sous une navigation complexe.

### States

- Chargement : afficher un squelette du titre, de l'image et des sections.
- Recette introuvable : afficher **« Recette introuvable »** avec un retour vers « Mes recettes ».
- Données incomplètes : afficher les sections disponibles sans inventer les informations manquantes.
- Erreur de chargement : afficher un message clair et une action **« Réessayer »**.

### Object IDs

- `RECIPE-HEADER-01` : bouton retour.
- `RECIPE-HEADER-02` : titre de la recette.
- `RECIPE-HEADER-03` : image principale.
- `RECIPE-META-01` : métadonnées disponibles.
- `INGREDIENTS-01` : section ingrédients.
- `INGREDIENT-ITEM-01` : ligne d'ingrédient.
- `PREPARATION-01` : section préparation.
- `STEP-ITEM-01` : étape numérotée.
- `STATE-01` : recette introuvable.
- `STATE-02` : erreur de chargement.

### Content Integrity

- Afficher les informations extraites après validation utilisateur.
- Préserver les étapes et ingrédients corrigés sans transformation silencieuse.
- Signaler l'absence de données plutôt que compléter automatiquement avec une supposition.

## Next Step

La consultation constitue la fin du scénario : la recette est prête à être utilisée.

---

_Conceptual specification - ready for visual design._
