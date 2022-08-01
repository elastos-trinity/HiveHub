import { createContext } from 'react';

const LanguageContext = createContext({
  language: 'en',
  changeLanguage: () => {}
});

export default LanguageContext;
