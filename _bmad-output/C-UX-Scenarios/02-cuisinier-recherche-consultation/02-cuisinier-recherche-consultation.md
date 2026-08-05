# 02 : Le Cuisinier pragmatique retrouve une recette

**Projet :** kitchen-app  
**Créé :** 2026-08-04  
**Méthode :** Whiteport Design Studio (WDS)

---

## Transaction

Retrouver rapidement une recette déjà enregistrée et la consulter pour cuisiner.

---

## Objectif métier

**Objectif :** retrouver une recette en moins de 10 secondes.

---

## Utilisateur et situation

**Persona :** Le Cuisinier pragmatique (Secondaire)  
**Situation :** Sur son mobile, avant les courses ou pendant la préparation d'un repas, il veut accéder rapidement à une recette déjà enregistrée.

---

## Motivations et freins

**Espoir :** trouver rapidement une recette claire et complète, directement exploitable pour cuisiner.  
**Inquiétude :** perdre du temps dans une interface compliquée ou tomber sur des instructions incomplètes ou contradictoires.

---

## Appareil et point de départ

**Appareil :** Mobile  
**Entrée :** Il ouvre directement kitchen-app sur son mobile depuis son foyer, puis utilise la recherche depuis l'accueil / bibliothèque pour retrouver la recette.

---

## Meilleur résultat

**Réussite utilisateur :** retrouver la recette en moins de 10 secondes et suivre des instructions claires sur mobile.

**Réussite produit :** confirmer que la recherche et la consultation sont suffisamment simples pour être utilisées régulièrement par les deux membres du foyer.

---

## Chemin le plus court

1. **Accueil / bibliothèque** — accéder au champ de recherche.
2. **Recherche** — saisir un mot-clé et sélectionner la recette correspondante.
3. **Consultation d'une recette** — lire les ingrédients et les étapes sur mobile. ✓

---

## Connexions au Trigger Map

**Persona :** Le Cuisinier pragmatique (Secondaire)

**Motivations adressées :**

- ✅ **Want :** retrouver rapidement une recette et consulter une présentation claire.
- ❌ **Fear :** perdre du temps dans une interface compliquée ou suivre des instructions incomplètes.

**Objectif métier :** retrouver une recette en moins de 10 secondes.

---

## Étapes du scénario

| Étape | Dossier | Objectif | Action de sortie |
|---|---|---|---|
| 02.1 | `02.1-accueil-bibliotheque/` | Accéder à la recherche | Saisir une requête |
| 02.2 | `02.2-recherche/` | Identifier la recette voulue | Sélectionner un résultat |
| 02.3 | `02.3-consultation-recette/` | Lire et suivre la recette | Consulter les étapes ✓ |
