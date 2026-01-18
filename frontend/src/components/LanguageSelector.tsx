import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'es', name: 'Español', flag: '/Spain.png' },
  { code: 'en', name: 'English', flag: '/UK.png' },
  { code: 'fr', name: 'Français', flag: '/France.png' },
  { code: 'it', name: 'Italiano', flag: '/Italy.png' },
  { code: 'pt', name: 'Português', flag: '/Portugal.png' }
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg px-6 py-2 border border-white/20 transition-all duration-200 font-bold"
        style={{ height: '42px' }}
      >
        <img 
          src={currentLanguage.flag} 
          alt={currentLanguage.name}
          className="w-5 h-5 rounded-sm object-cover"
        />
        <span className="text-white">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-[#0b0d12]/95 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/20 transition-colors ${
                  lang.code === i18n.language ? 'bg-white/10' : ''
                }`}
              >
                <img 
                  src={lang.flag} 
                  alt={lang.name}
                  className="w-4 h-4rounded-sm object-cover"
                />
                <span className="text-white font-medium">{lang.name}</span>
                {lang.code === i18n.language && (
                  <svg className="w-5 h-5 text-[#00d2ff] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;