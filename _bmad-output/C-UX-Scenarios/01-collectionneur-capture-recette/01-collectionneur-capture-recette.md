# 01 : Le Collectionneur de recettes capture une recette

**Projet :** kitchen-app  
**Créé :** 2026-08-04  
**Méthode :** Whiteport Design Studio (WDS)

---

## Transaction

Photographier une recette dans un livre, vérifier et corriger le contenu extrait, puis l'enregistrer dans la bibliothèque.

---

## Objectif métier

**Objectif :** mettre le MVP en ligne sur le VPS en 1 jour maximum afin de démarrer rapidement la boucle de feedback.

---

## Utilisateur et situation

**Persona :** Le Collectionneur de recettes (Primaire)  
**Situation :** Chez lui ou dans une librairie, il découvre une recette intéressante dans un livre et veut la conserver sans la recopier.

---

## Motivations et freins

**Espoir :** obtenir une transcription fidèle au livre, automatiquement structurée selon un template de recette clair.  
**Inquiétude :** devoir corriger trop d'erreurs ou perdre des informations importantes du livre.

---

## Appareil et point de départ

**Appareil :** Mobile  
**Entrée :** Il ouvre directement kitchen-app sur son téléphone, sélectionne « Ajouter une recette », puis choisit « Photo/scan ».

---

## Meilleur résultat

**Réussite utilisateur :** obtenir une recette fidèle au livre, structurée selon le template, corrigée si nécessaire et prête à être utilisée.

**Réussite produit :** permettre de signaler un incident d'extraction ou de qualité afin de recueillir du feedback exploitable et d'améliorer rapidement le MVP.

---

## Chemin le plus court

1. **Accueil / bibliothèque** — sélectionner l'ajout d'une recette.
2. **Ajout d'une recette** — choisir Photo/scan et prendre la photo.
3. **Import et extraction** — attendre l'extraction structurée.
4. **Prévisualisation / validation** — corriger la recette, la signaler si nécessaire et l'enregistrer. ✓

---

## Connexions au Trigger Map

**Persona :** Le Collectionneur de recettes (Primaire)

**Motivations adressées :**

- ✅ **Want :** gagner du temps et centraliser les recettes.
- ❌ **Fear :** devoir recopier une recette ou perdre des informations importantes.

**Objectif métier :** mettre le MVP en ligne sur le VPS en 1 jour maximum.

---

## Étapes du scénario

| Étape | Dossier | Objectif | Action de sortie |
|---|---|---|---|
| 01.1 | `01.1-accueil-bibliotheque/` | Démarrer l'ajout d'une recette | Sélectionner « Ajouter une recette » |
| 01.2 | `01.2-ajout-recette/` | Choisir la capture photo et prendre la photo | Sélectionner « Photo/scan » puis capturer |
| 01.3 | `01.3-import-extraction/` | Obtenir une recette structurée à partir de la photo | Ouvrir la prévisualisation |
| 01.4 | `01.4-previsualisation-validation/` | Corriger, signaler et enregistrer une recette prête à l'emploi | Enregistrer la recette ✓ |
