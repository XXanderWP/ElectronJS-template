import { langs, getAllLangs } from '_lang/core';

describe('Language Module', () => {
  describe('Language Keys Consistency', () => {
    it('should have no missing keys in any language version', () => {
      const allLangs = getAllLangs();

      // Get all keys from all languages
      const allKeys = new Set<string>();

      allLangs.forEach(lang => {
        Object.keys(langs[lang]).forEach(key => {
          allKeys.add(key);
        });
      });

      // Check that each language has all keys
      allLangs.forEach(lang => {
        const langKeys = Object.keys(langs[lang]);
        const missingKeys: string[] = [];

        allKeys.forEach(key => {
          if (!langKeys.includes(key)) {
            missingKeys.push(key);
          }
        });

        // If there are missing keys, the test should fail
        expect(missingKeys).toEqual([]);

        if (missingKeys.length > 0) {
          console.error(
            `Language '${lang}' is missing the following keys: ${missingKeys.join(', ')}`
          );
        }
      });
    });
  });

  it('should have the same number of keys in all language versions', () => {
    const allLangs = getAllLangs();

    // Get the number of keys in each language
    const keyCounts = allLangs.map(lang => ({
      lang,
      count: Object.keys(langs[lang]).length,
    }));

    // All languages should have the same number of keys
    const firstLangCount = keyCounts[0].count;

    keyCounts.forEach(({ lang, count }) => {
      expect(count).toEqual(firstLangCount);

      if (count !== firstLangCount) {
        console.error(
          `Language '${lang}' has ${count} keys, but expected ${firstLangCount}`
        );
      }
    });
  });
});
