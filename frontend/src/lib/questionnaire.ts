export type IncomeRange = "lt100" | "r100to250" | "r250to500" | "gt500";

export type StatusKey =
  | "student"
  | "pensioner"
  | "disability"
  | "multichildAward"
  | "singleParent"
  | "jobSeekerRegistered";

export type Employment = "official" | "informal" | "notWorking" | "searching";

export type Housing = "own" | "rent" | "relatives";

export type Answers = {
  region: string | null;
  birthYear: number | null;
  adults: number;
  childrenAges: number[];
  incomeMonthly: number | null;
  incomeUnknown: boolean;
  incomeRange: IncomeRange | null;
  statuses: StatusKey[];
  disabilityGroup: 1 | 2 | 3 | null;
  employment: Employment | null;
  housing: Housing | null;
};

export const emptyAnswers: Answers = {
  region: null,
  birthYear: null,
  adults: 1,
  childrenAges: [],
  incomeMonthly: null,
  incomeUnknown: false,
  incomeRange: null,
  statuses: [],
  disabilityGroup: null,
  employment: null,
  housing: null,
};

export const REGIONS: { value: string; label: string }[] = [
  { value: "astana", label: "Астана" },
  { value: "almaty-city", label: "Алматы" },
  { value: "shymkent", label: "Шымкент" },
  { value: "abay", label: "Абайская область" },
  { value: "akmola", label: "Акмолинская область" },
  { value: "aktobe", label: "Актюбинская область" },
  { value: "almaty-region", label: "Алматинская область" },
  { value: "atyrau", label: "Атырауская область" },
  { value: "vko", label: "Восточно Казахстанская область" },
  { value: "zhambyl", label: "Жамбылская область" },
  { value: "zhetysu", label: "Жетысуская область" },
  { value: "zko", label: "Западно Казахстанская область" },
  { value: "karaganda", label: "Карагандинская область" },
  { value: "kostanay", label: "Костанайская область" },
  { value: "kyzylorda", label: "Кызылординская область" },
  { value: "mangystau", label: "Мангистауская область" },
  { value: "pavlodar", label: "Павлодарская область" },
  { value: "sko", label: "Северо Казахстанская область" },
  { value: "turkestan", label: "Туркестанская область" },
  { value: "ulytau", label: "Улытауская область" },
];

const STORAGE_KEY = "govaid_answers_v1";

export function loadAnswers(): Answers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...emptyAnswers, ...(JSON.parse(raw) as Partial<Answers>) };
  } catch {
    return null;
  }
}

export function saveAnswers(answers: Answers): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Хранилище недоступно: анкета продолжит работать в памяти
  }
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ничего
  }
}

export function regionLabel(value: string | null): string {
  return REGIONS.find((r) => r.value === value)?.label ?? "";
}
