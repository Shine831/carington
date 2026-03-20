/**
 * ------------------------------------------------------------------------
 * AUTO-TRANSLATE SCRIPT — Carington / E-Jarnauld
 * ------------------------------------------------------------------------
 * Usage: npm run translate
 *
 * This script reads all French (FR) translation strings from
 * src/context/translations.ts and auto-generates the English (EN) version
 * using Google Translate (free, no API key required via google-translate-api-x).
 *
 * Translations are cached in scripts/.translate-cache.json so only changed
 * strings are re-translated on subsequent runs, saving time & quota.
 * ------------------------------------------------------------------------
 */

import { translate } from "google-translate-api-x";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TRANSLATIONS_PATH = join(ROOT, "src", "context", "translations.ts");
const CACHE_PATH = join(__dirname, ".translate-cache.json");

// ── Helpers ────────────────────────────────────────────────────────────────

function loadCache() {
  try {
    return existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, "utf8")) : {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

/** Recursively walk an object and collect all string leaf values as [path, value] */
function collectStrings(obj, prefix = "") {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") {
      results.push([path, val]);
    } else if (typeof val === "object" && val !== null) {
      results.push(...collectStrings(val, path));
    }
  }
  return results;
}

/** Set a deeply nested key on an object using a dot-path */
function setDeep(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

/** Clone the FR object structure with empty strings for EN */
function cloneStructure(obj) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = typeof val === "object" && val !== null ? cloneStructure(val) : "";
  }
  return result;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌐  Auto-Translate: FR → EN\n");

  // 1. Extract FR translations object from the TS file via eval-safe regex
  const source = readFileSync(TRANSLATIONS_PATH, "utf8");

  // Extract the raw JS object between `fr: {` and its matching closing brace
  // For robustness we use dynamic import via a temp file trick
  const tmpFile = join(__dirname, ".tmp-translations-" + Date.now() + ".mjs");
  const cleaned = source
    .replace(/^export const translations = /, "export default ")
    .replace(/; *$/, "");
  writeFileSync(tmpFile, cleaned);

  const { default: allTranslations } = await import(pathToFileURL(tmpFile).href);
  const fr = allTranslations.fr;

  // 2. Collect all FR strings
  const entries = collectStrings(fr);
  console.log(`📋  Found ${entries.length} French strings to translate.\n`);

  // 3. Load cache
  const cache = loadCache();
  const en = cloneStructure(fr);

  let translated = 0;
  let cached = 0;
  let failed = 0;

  // 4. Translate each string (with caching)
  for (const [path, frText] of entries) {
    if (!frText.trim()) {
      setDeep(en, path, frText);
      continue;
    }

    const cacheKey = `fr:${frText}`;

    if (cache[cacheKey]) {
      setDeep(en, path, cache[cacheKey]);
      cached++;
      continue;
    }

    try {
      const result = await translate(frText, { from: "fr", to: "en" });
      const enText = result.text;
      cache[cacheKey] = enText;
      setDeep(en, path, enText);
      translated++;
      process.stdout.write(`  ✓ [${path}]: ${frText.substring(0, 40)}… → ${enText.substring(0, 40)}\n`);

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.warn(`  ⚠ Failed to translate [${path}]: ${err.message}`);
      setDeep(en, path, frText); // Fallback: use FR text
      failed++;
    }
  }

  // 5. Save cache
  saveCache(cache);

  // 6. Write EN back to translations.ts
  const enJson = JSON.stringify(en, null, 4)
    .replace(/"([^"]+)":/g, "$1:")  // Remove quotes from keys
    .replace(/"/g, "\"");           // Keep string quotes

  // Replace the `en: { ... }` block in the TS source
  const newSource = source.replace(
    /en:\s*\{[\s\S]*?\n  \}\n\};/,
    `en: ${enJson}\n};`
  );

  writeFileSync(TRANSLATIONS_PATH, newSource, "utf8");

  console.log(`\n✅  Done!`);
  console.log(`   📦  Translated: ${translated} strings`);
  console.log(`   💾  From cache: ${cached} strings`);
  if (failed > 0) console.log(`   ⚠   Failed:     ${failed} strings (kept FR text as fallback)`);
  console.log(`\n🚀  translations.ts updated. Run 'npm run build' to apply.\n`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
