import { expect, test } from "@playwright/test";

test.describe("Recipe CRUD", () => {
  let recipeUrl = "";

  test.afterEach(async ({ page }) => {
    if (!recipeUrl) return;
    await page.goto(recipeUrl);
    const deleteButton = page.getByRole("button", { name: "Supprimer la recette" });
    if (await deleteButton.isVisible().catch(() => false)) {
      page.once("dialog", (dialog) => dialog.accept());
      await deleteButton.click();
      await expect(page).toHaveURL(/\/recipes$/);
    }
    recipeUrl = "";
  });

  test("creates, reads, updates, and deletes a recipe", async ({ page }) => {
    const originalTitle = `BDD recette ${Date.now()}`;
    const updatedTitle = `${originalTitle} modifiee`;

    await test.step("Given I have opened the recipe review form with an extracted draft", async () => {
      await page.addInitScript(({ title }) => {
        sessionStorage.setItem("recipe-draft", JSON.stringify({
          title,
          ingredients: ["2 tomates", "1 cuillere d'huile"],
          steps: ["Couper les tomates", "Melanger les ingredients"],
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          servings: 2,
        }));
      }, { title: originalTitle });
      await page.goto("/recipes/import/review");
      await expect(page.getByRole("heading", { name: "Relire la recette" })).toBeVisible();
    });

    await test.step("When I save the recipe", async () => {
      await page.getByRole("button", { name: "Enregistrer la recette" }).click();
    });

    await test.step("Then I should see the saved recipe details", async () => {
      await expect(page).toHaveURL(/\/recipes\/recipe-/);
      await expect(page.getByRole("heading", { name: originalTitle })).toBeVisible();
      await expect(page.getByText("2 tomates")).toBeVisible();
      await expect(page.getByText("25 min")).toBeVisible();
    });

    recipeUrl = page.url();

    await test.step("When I update the recipe title and ingredients", async () => {
      await page.getByRole("link", { name: "Modifier" }).click();
      await expect(page.getByRole("heading", { name: "Modifier la recette" })).toBeVisible();
      await page.locator('input[name="title"]').fill(updatedTitle);
      await page.locator('textarea[name="ingredients"]').fill("3 tomates\n2 cuilleres d'huile");
      await page.locator('textarea[name="steps"]').fill("Couper les tomates\nMelanger soigneusement");
      await page.getByRole("button", { name: "Enregistrer les modifications" }).click();
    });

    await test.step("Then I should see the updated recipe details", async () => {
      await expect(page).toHaveURL(recipeUrl);
      await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
      await expect(page.getByText("3 tomates")).toBeVisible();
      await expect(page.getByText("2 cuilleres d'huile")).toBeVisible();
    });

    await test.step("And the recipe history should contain the previous version", async () => {
      await page.getByRole("link", { name: "Historique" }).click();
      await expect(page.getByRole("heading", { name: "Historique des modifications" })).toBeVisible();
      await expect(page.locator("summary").filter({ hasText: originalTitle })).toBeVisible();
      await page.goto(recipeUrl);
    });

    await test.step("When I confirm deleting the recipe", async () => {
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Supprimer la recette" }).click();
      recipeUrl = "";
    });

    await test.step("Then I should return to the recipe library", async () => {
      await expect(page).toHaveURL(/\/recipes$/);
    });

    await test.step("And I should not see the deleted recipe", async () => {
      await expect(page.getByText(updatedTitle)).not.toBeVisible();
    });
  });
});
