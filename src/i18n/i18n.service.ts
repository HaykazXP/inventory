import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService {
  private translations: { [key: string]: any } = {};
  private currentLanguage = 'ru'; // Changed from 'en' to 'ru'

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const languages = ['en', 'ru', 'hy', 'ka'];
    const translationPath = path.join(process.cwd(), 'src', 'translations');

    languages.forEach(lang => {
      try {
        const filePath = path.join(translationPath, `${lang}.json`);
        const content = fs.readFileSync(filePath, 'utf8');
        this.translations[lang] = JSON.parse(content);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
      }
    });
  }

  setLanguage(lang: string) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  t(key: string, lang?: string): string {
    const language = lang || this.currentLanguage;
    const keys = key.split('.');
    let value = this.translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Russian (changed from English)
        value = this.translations['ru'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
      { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
    ];
  }

  getAllTranslations(lang: string) {
    return this.translations[lang] || this.translations['ru']; // Changed fallback to Russian
  }
} 