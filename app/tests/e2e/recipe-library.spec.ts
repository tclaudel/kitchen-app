import { expect, test } from "@playwright/test";

test.describe("Recipe library", () => {
  test("opens the recipe library from the home page", async ({ page }) => {
    await test.step("Given I am on the home page", async () => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Mes recettes" })).toBeVisible();
    });

    await test.step('When I choose "Voir mes recettes"', async () => {
      await page.getByRole("link", { name: "Voir mes recettes" }).click();
    });

    await test.step("Then I should see the recipe library heading", async () => {
      await expect(page).toHaveURL(/\/recipes$/);
      await expect(page.getByRole("heading", { name: "Mes recettes" })).toBeVisible();
    });
  });

  test("searches the recipe library", async ({ page }) => {
    await test.step("Given I am on the recipe library page", async () => {
      await page.goto("/recipes");
      await expect(page.getByRole("heading", { name: "Mes recettes" })).toBeVisible();
    });

    await test.step('When I search for "unlikely-recipe-name"', async () => {
      await page.getByRole("searchbox", { name: "Rechercher une recette ou un ingrédient" }).fill("unlikely-recipe-name");
    });

    await test.step("Then I should see that no recipe was found", async () => {
      await expect(page.getByText("Aucune recette trouvée")).toBeVisible();
    });
  });
});
