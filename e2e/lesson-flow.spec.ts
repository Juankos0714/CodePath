import { test, expect } from "@playwright/test";

test.describe("Flujo de lección piloto", () => {
  test.beforeEach(async ({ page }) => {
    // Assumes a seeded test user — configure via env for CI
    await page.goto("/login");
  });

  test("Landing page carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Aprende a programar/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Empezar gratis/i })).toBeVisible();
  });

  test("Página de registro tiene los campos correctos", async ({ page }) => {
    await page.goto("/registro");
    await expect(page.getByLabelText(/nombre de usuario/i)).toBeVisible();
    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/contraseña/i)).toBeVisible();
  });

  test("Ruta protegida redirige a login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
