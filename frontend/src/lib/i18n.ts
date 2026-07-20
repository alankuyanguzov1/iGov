import ru from "@/dictionaries/ru.json";

export type Locale = "ru";

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru };

export function getDictionary(locale: Locale = "ru"): Dictionary {
  return dictionaries[locale];
}
