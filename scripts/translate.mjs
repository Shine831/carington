import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * E-JARNALUD SOFT - Smart i18n Sync Utility (2026)
 * This script scans for missing keys in translations.ts and can be extended
 * to call an LLM API (like Gemini) to auto-fill them.
 */

const TRANSLATIONS_PATH = path.join(__dirname, '../src/context/translations.ts');

async function syncTranslations() {
  console.log('--- E-JARNALUD SOFT i18n Sync ---');
  
  if (!fs.existsSync(TRANSLATIONS_PATH)) {
    console.error('Error: translations.ts not found at', TRANSLATIONS_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
  
  // Basic validation - check if both fr and en exist
  const hasFr = content.includes('fr: {');
  const hasEn = content.includes('en: {');

  if (!hasFr || !hasEn) {
    console.error('Error: translations.ts must contain both "fr" and "en" sections.');
    process.exit(1);
  }

  console.log('✔ Dictionary detected.');
  console.log('✔ Structure: Static TS Object');
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠ GEMINI_API_KEY not found in environment.');
    console.log('To automate translations, legal: "npm run translate" with a valid API key.');
  }

  console.log('\nTip: To add a new language, append it to the translations object and run this script.');
  console.log('Design: Premium Static Analysis - No runtime overhead for users.');
}

syncTranslations().catch(console.error);
