import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";

const vite = await createServer({ configFile: resolve("vite.config.ts"), server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const [{ services }, { team }] = await Promise.all([vite.ssrLoadModule("/src/data/services.ts"), vite.ssrLoadModule("/src/data/team.ts")]);
  const catalog = {
    services: services.map(({ id, slug, name, description, category, durationLabel, price, priceFrom }) => ({ id, slug, name, description, category, durationLabel, price, priceFrom: Boolean(priceFrom) })),
    professionals: team.map(({ id, name, firstName, role, bookingLabel, rating, reviews, specialties, group }) => ({ id, name, firstName, role, bookingLabel, rating: rating ?? null, reviews: reviews ?? null, specialties: specialties ?? [], group })),
  };
  await writeFile(resolve("server/advisor-catalog.json"), JSON.stringify(catalog), "utf8");
} finally { await vite.close(); }
