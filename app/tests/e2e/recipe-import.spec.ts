import { expect, test } from "@playwright/test";

test.describe("Recipe import", () => {
  test("switches between import modes", async ({ page }) => {
    await test.step("Given I am on the recipe import page", async () => {
      await page.goto("/recipes/import");
      await expect(page.getByRole("heading", { name: "Photographier une recette" })).toBeVisible();
    });

    await test.step('When I choose the "Texte libre" import mode', async () => {
      await page.getByRole("button", { name: "Texte libre" }).click();
    });

    await test.step("Then I should see the text recipe form", async () => {
      await expect(page.getByText("Collez votre recette")).toBeVisible();
      await expect(page.getByRole("button", { name: "Structurer la recette" })).toBeVisible();
    });

    await test.step('When I choose the "URL" import mode', async () => {
      await page.getByRole("button", { name: "URL" }).click();
    });

    await test.step("Then I should see the URL recipe form", async () => {
      await expect(page.getByText("Importer depuis une URL")).toBeVisible();
      await expect(page.getByRole("button", { name: "Importer la recette" })).toBeVisible();
    });
  });

  test("rejects a non-image upload", async ({ page }) => {
    await test.step("Given I am on the recipe import page", async () => {
      await page.goto("/recipes/import");
    });

    await test.step("When I upload a non-image file", async () => {
      await page.locator("#recipe-photo").setInputFiles({
        name: "recipe.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("not an image"),
      });
    });

    await test.step("Then I should see an image format error", async () => {
      await expect(page.getByText("Choisissez une image au format JPG, PNG ou HEIC.")).toBeVisible();
    });
  });

  test("shows the review empty state without an extraction", async ({ page }) => {
    await test.step("Given I am on the recipe review page without a draft", async () => {
      await page.goto("/recipes/import/review");
    });

    await test.step("Then I should see that there is no extraction to review", async () => {
      await expect(page.getByRole("heading", { name: "Aucune extraction à vérifier" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Photographier une recette" })).toBeVisible();
    });
  });
});
