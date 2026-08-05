# Feature Impact Analysis: kitchen-app

## Scoring

**Primary Persona (⭐):** High = 5 pts | Medium = 3 pts | Low = 1 pt  
**Other Personas:** High = 3 pts | Medium = 1 pt | Low = 0 pts

**Personas:** Collectionneur de recettes (primary), Cuisinier pragmatique (secondary)

---

## Prioritized Features

| Rank | Feature | Collectionneur | Cuisinier | Score | Decision |
| ---- | ------- | ------------- | --------- | ----- | -------- |
| 1 | Recherche texte | High (5) | High (3) | **8** | Must Have MVP |
| 2 | Centralisation des recettes | High (5) | High (3) | **8** | Must Have MVP |
| 3 | Capture photo/scan ponctuelle | High (5) | Medium (1) | **6** | Must Have MVP |
| 4 | Consultation responsive | Medium (3) | High (3) | **6** | Must Have MVP |
| 5 | Import depuis une URL | Medium (3) | Medium (1) | **4** | Consider for MVP |
| 6 | Ajout manuel | Low (1) | Medium (1) | **2** | Consider for MVP |

---

## Decisions

**Must Have MVP (Primary High OR Top Tier Score):**

- Recherche texte (8)
- Centralisation des recettes (8)
- Capture photo/scan ponctuelle (6)
- Consultation responsive (6)

**Consider for MVP:**

- Import depuis une URL (4)
- Ajout manuel (2)

**Defer (Nice-to-Have or Low Strategic Value):**

- Partage de recettes
- Listes de courses
- Import de livres
- Fonctionnalités IA
- Données nutritionnelles et liens entre ingrédients
- Nouveau format texte structuré

---

## Strategic Implications

- La priorité de conception est une boucle de feedback rapide : une première version en ligne en moins d'un jour.
- La recherche et la centralisation constituent la valeur centrale à valider.
- La capture photo/scan répond directement au cas d'usage des recettes présentes dans les livres.
- L'import URL et la saisie manuelle peuvent rester simples au départ et être améliorés avec les retours du foyer.
- Les fonctionnalités futures doivent préserver une structure de recette extensible sans ralentir le MVP.

---

## Questions for Designer

- Comment rendre la capture d'une recette depuis une photo compréhensible et rapide ?
- Comment afficher une recette de façon claire pendant la cuisine sur mobile ?
- Comment fournir un retour visible lorsqu'une extraction photo ou URL est incomplète ?
- Comment garder l'interface suffisamment simple pour deux utilisateurs du même foyer ?

---

_Generated with Whiteport Design Studio framework_  
_Strategic input for Phase 4: UX Design and Phase 6: PRD/Development_
