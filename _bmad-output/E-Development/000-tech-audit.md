# Audit technique initial : kitchen-app

**Date :** 2026-08-04  
**Statut :** Projet vierge, fondation proposée  
**Objectif :** fournir une base technique minimale pour un MVP livrable rapidement sur VPS.

## État du codebase

- Aucun code applicatif détecté.
- Aucun framework ou outil de build existant.
- Aucun Work Order ou PRD technique existant.
- Les documents produit et UX sont disponibles dans `_bmad-output/`.

## Stack proposée

- **Application :** Next.js avec TypeScript
- **UI :** Tailwind CSS
- **Persistance :** SQLite
- **Accès aux données :** Prisma
- **Déploiement :** Coolify sur VPS, avec Docker géré automatiquement
- **OCR :** abstraction de service permettant de commencer avec une implémentation simple et d'ajouter un fournisseur ensuite

## Architecture MVP

- Application monolithique Next.js pour minimiser le temps de livraison.
- Routes serveur pour les recettes et la recherche.
- Composants React pour la bibliothèque, la recherche, l'import photo et la consultation.
- SQLite comme base locale adaptée au foyer et au premier déploiement.
- Stockage des images importées sur volume persistant géré par Coolify sur le VPS.
- Modèle de recette structuré : titre, image, ingrédients, étapes, tags, description, durées et portions optionnelles.

## Contraintes fonctionnelles

- Accès public pour le MVP, sans authentification.
- Import limité à la photo/scan.
- Édition et validation nécessaires avant enregistrement d'une extraction OCR.
- Recherche sur titre, ingrédients, tags et description.
- Consultation responsive mobile et desktop.
- Signalement d'incident d'extraction à prévoir comme donnée simple.

## Risques et décisions à confirmer

- La qualité OCR dépendra fortement des photos et du fournisseur choisi.
- L'accès public implique que les recettes et images ne doivent pas contenir de données confidentielles dans le MVP.
- SQLite est le choix le plus rapide, mais une migration vers PostgreSQL pourra être nécessaire si le périmètre devient multi-utilisateur ou fortement concurrent.
- Le format interne doit rester structuré et extensible sans imposer Cooklang au MVP.

## Suite recommandée

1. Écrire le PRD à partir des scénarios et spécifications UX.
2. Initialiser l'application Next.js.
3. Implémenter la bibliothèque et la recherche.
4. Ajouter l'import photo et le flux d'édition OCR.
5. Vérifier l'expérience dans un navigateur mobile et déployer sur VPS.
