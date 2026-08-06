CREATE TABLE "RecipeRevision" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "recipeId" TEXT NOT NULL,
  "modifiedBy" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "ingredients" TEXT NOT NULL,
  "steps" TEXT NOT NULL,
  "cooklang" TEXT,
  "prepTimeMinutes" INTEGER,
  "cookTimeMinutes" INTEGER,
  "servings" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecipeRevision_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "RecipeRevision_recipeId_createdAt_idx" ON "RecipeRevision"("recipeId", "createdAt");
