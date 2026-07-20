# GovAid Navigator (iGov)

Персональный навигатор по мерам государственной поддержки Казахстана. Пользователь отвечает на несколько простых вопросов и получает список выплат, вычетов и льгот, которые ему положены, с расчетом сумм в тенге, понятным объяснением со ссылкой на закон и пошаговым планом оформления.

Автор: Kassymzhomart

## Стек

- Next.js 15 (App Router), TypeScript strict
- Tailwind CSS v4
- lucide-react (единственный источник иконок)
- Supabase: Postgres, Auth, RLS (подключается в фазе 4)
- Деплой: Vercel

## Структура

```
iGov/
├── frontend/            Next.js приложение
│   └── src/
│       ├── app/(landing)/   лендинг
│       ├── app/(app)/       основное приложение
│       ├── components/      landing / app / ui
│       ├── lib/             i18n, утилиты
│       └── dictionaries/    все строки интерфейса (ru.json)
├── backend/
│   ├── supabase/        миграции и политики RLS
│   ├── rules-engine/    детерминированный движок правил льгот
│   └── content/         верифицированные карточки льгот
└── docs/                архитектурные решения
```

## Запуск

```
cd frontend
npm install
npm run dev
```

Приложение откроется на http://localhost:3000
