import { GetUserLanguage, langString } from '_/lang/core';

export const LangString = (id: langData, ...args: any[]) => {
  return langString(GetUserLanguage(navigator.language), id, ...args);
};
