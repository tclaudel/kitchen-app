# 02.2 Recherche

**Scenario:** Le Cuisinier pragmatique retrouve une recette  
**Page Number:** 02.2  
**Created:** 2026-08-04  
**Method:** Whiteport Design Studio (WDS)

---

## Overview

**Page Purpose:** Permettre de saisir un mot-clé et d'identifier rapidement une recette enregistrée.

**Entry Point:** L'utilisateur active la barre de recherche depuis « Mes recettes ».

**Main User Goal:** Trouver puis sélectionner la recette voulue en moins de 10 secondes.

**Business Goal:** Valider la recherche texte comme valeur centrale du MVP.

---

## Concept

- Champ de recherche conservé visible en haut de page.
- Résultats filtrés sur le titre, les ingrédients, les tags et la description.
- Résultats présentés en cartes lisibles sur mobile.
- Sélection d'une carte pour ouvrir la consultation de la recette.
- État vide explicite si aucun résultat ne correspond.

## Primary Interaction

L'utilisateur saisit un mot-clé, observe les résultats mis à jour, puis sélectionne une carte de recette.

## Detailed Specification

### Access

- MVP public, sans authentification ni profils.
- Les résultats correspondent uniquement aux recettes présentes dans la base.

### Layout

- Conserver l'en-tête **Recettes en famille**.
- Afficher un titre **Recherche**.
- Placer le champ de recherche sous le titre, avec le focus disponible dès l'arrivée.
- Afficher les résultats sous forme de cartes cohérentes avec « Mes recettes ».

### Search Field

- Placeholder : **« Rechercher une recette ou un ingrédient… »**.
- Rechercher dans le titre, les ingrédients, les tags et la description.
- Conserver la requête visible pendant l'affichage des résultats.
- Afficher un bouton d'effacement lorsque la requête n'est pas vide.
- Déclencher la recherche après une courte pause de saisie afin d'éviter une requête à chaque caractère.
- Permettre la validation au clavier sur desktop.

### Results

- Afficher le nombre de résultats lorsque la requête a produit des correspondances.
- Réutiliser les cartes de recettes de « Mes recettes ».
- Mettre en évidence le titre et l'information correspondant à la requête lorsque c'est possible.
- Rendre chaque carte entièrement cliquable vers la consultation.
- Trier les résultats de manière stable et prévisible, par pertinence simple puis titre.

### States

- Requête vide : afficher les recettes récentes ou les suggestions de la bibliothèque.
- Chargement : conserver le champ visible et afficher des placeholders de cartes.
- Résultats : afficher la liste ou la grille des recettes correspondantes.
- Aucun résultat : afficher **« Aucune recette trouvée »**, rappeler la requête et proposer de l'effacer.
- Erreur : afficher un message court et une action **« Réessayer »**.

### Responsive Behavior

- Mobile : champ pleine largeur et résultats en une colonne.
- Desktop : champ dans une largeur de lecture limitée et grille de cartes.
- Maintenir une cible tactile confortable pour l'effacement et la sélection des cartes.

### Object IDs

- `HDR-01` : nom « Recettes en famille ».
- `SEARCH-01` : champ de recherche.
- `SEARCH-02` : bouton d'effacement.
- `RESULTS-01` : compteur de résultats.
- `RESULTS-02` : grille ou liste de résultats.
- `RECIPE-CARD-01` : carte de recette cliquable.
- `STATE-01` : état vide sans résultat.
- `STATE-02` : état d'erreur avec réessai.

### Exit Action

La sélection d'une carte ouvre **Consultation d'une recette**.

## Next Step

La sélection ouvre la page « Consultation d'une recette ».

---

_Conceptual specification - ready for visual design._
