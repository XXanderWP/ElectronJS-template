import { GetUserLanguage, langString } from '_/lang/core';
import { execSync } from 'child_process';
import os from 'os';

let systemLanguage: langType | undefined = undefined;

function detectLanguage() {
  if (systemLanguage) return;
  let lang = null;

  // 1️⃣ Сначала пробуем Node.js / OS
  if (process.platform === 'win32') {
    // Windows: через PowerShell
    try {
      lang = execSync(
        'powershell -Command "[System.Globalization.CultureInfo]::InstalledUICulture.Name"'
      )
        .toString()
        .trim();
    } catch (e) {
      // fallback
      lang =
        process.env.LANG ||
        process.env.LANGUAGE ||
        process.env.LC_ALL ||
        process.env.LC_MESSAGES;
    }
  } else if (process.platform === 'darwin' || process.platform === 'linux') {
    // macOS / Linux
    lang =
      process.env.LANG ||
      process.env.LANGUAGE ||
      process.env.LC_ALL ||
      process.env.LC_MESSAGES;
  }

  lang = lang ? lang.toLowerCase() : '';

  systemLanguage = GetUserLanguage(lang);
}

export const LangString = (id: langData, ...args: any[]) => {
  detectLanguage();
  const lang =
    process.env.LANG ||
    process.env.LANGUAGE ||
    process.env.LC_ALL ||
    process.env.LC_MESSAGES;
  return langString(systemLanguage || GetUserLanguage(lang), id, ...args);
};
