# Trigger Map Poster: kitchen-app

> Visual overview connecting business goals to user psychology

**Created:** 2026-08-04  
**Author:** Thomas  
**Methodology:** Based on Effect Mapping, adapted for WDS framework

---

## Vision

`kitchen-app` est une application rapide à mettre en place, qui permet au foyer d'enregistrer une recette aimée depuis une photo ou une URL, puis de la retrouver facilement au moment voulu.

---

## Business Objectives

1. Mettre le MVP en ligne sur le VPS en 1 jour maximum.
2. Retrouver une recette en moins de 10 secondes.
3. Permettre l'ajout d'au moins 1 recette par jour.
4. Faire utiliser l'application par 2 membres du foyer au lancement.

---

## Target Groups (Prioritized)

### 1. Le Collectionneur de recettes

Priorité principale : capturer rapidement les recettes aimées et les retrouver sans parcourir plusieurs livres ou sources.

**Positive Drivers:**

- Gagner du temps.
- Centraliser les recettes.
- Partager les recettes avec des proches.
- Conserver durablement les recettes appréciées.

**Negative Drivers:**

- Chercher longtemps une recette.
- Ne pas avoir la recette disponible partout.
- Devoir recopier ou ressaisir la recette.
- Risquer de perdre une recette appréciée.

### 2. Le Cuisinier pragmatique

Priorité secondaire : consulter une recette simplement et rapidement avant les courses, au moment de choisir un repas ou pendant la préparation.

**Positive Drivers:**

- Utiliser une application simple et intuitive.
- Retrouver rapidement une recette.
- Lire une présentation claire inspirée de Cookidoo ou Cookomix.
- Consulter la recette sur mobile pendant la préparation.

**Negative Drivers:**

- Suivre des instructions peu claires ou contradictoires.
- Rencontrer des étapes manquantes après un import.
- Utiliser une interface compliquée.
- Ne pas accéder rapidement à la recette sur mobile.

---

## Design Focus Statement

Construire d'abord le chemin le plus court entre une recette trouvée dans un livre ou en ligne et sa consultation fiable au moment de cuisiner. La livraison rapide prime afin de recueillir du feedback réel et d'améliorer le produit par itérations.

**Primary Design Target:** Le Collectionneur de recettes

**Must Address:**

- Centralisation simple.
- Recherche en moins de 10 secondes.
- Capture photo/scan ponctuelle.
- Consultation mobile claire.

**Should Address:**

- Import URL simple.
- Ajout manuel minimal.
- Partage, listes de courses et IA dans les évolutions futures.

---

## Cross-Group Patterns

### Shared Drivers

- Réduire le temps perdu.
- Retrouver rapidement une recette.
- Accéder aux recettes depuis différents contextes.
- Bénéficier d'une interface simple.

### Unique Drivers

- Le Collectionneur privilégie la capture, la conservation et le partage.
- Le Cuisinier pragmatique privilégie la clarté et la fiabilité des instructions.

### Potential Tensions

Une extraction rapide peut produire une recette incomplète ou ambiguë. Le MVP devra trouver un équilibre entre vitesse d'ajout et qualité minimale de consultation, sans élargir excessivement le périmètre.

---

## Next Steps

- [ ] Utiliser l'analyse d'impact pour prioriser l'UX.
- [ ] Valider les hypothèses avec les deux membres du foyer.
- [ ] Tester la boucle capture → recherche → consultation.
- [ ] Mettre à jour le document avec les apprentissages réels.

---

_Generated with Whiteport Design Studio framework_
