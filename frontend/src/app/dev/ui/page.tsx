import { ArrowRight, Search } from "lucide-react";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Progress,
  Radio,
  Select,
} from "@/components/ui";

/*
  Внутренняя страница для визуальной проверки дизайн-системы.
  Не является пользовательским интерфейсом продукта, в навигации не участвует.
  Перед публичным релизом (эпик 10) закрывается или удаляется.
*/

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-b border-border pb-12">
      <h2 className="font-heading text-xl font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}

const swatches = [
  { name: "fg", cls: "bg-fg" },
  { name: "muted", cls: "bg-muted" },
  { name: "faint", cls: "bg-faint" },
  { name: "border", cls: "bg-border" },
  { name: "accent", cls: "bg-accent" },
  { name: "accent hover", cls: "bg-accent-hover" },
];

export default function UiShowcasePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          Дизайн-система
        </h1>
        <p className="text-muted">
          Служебная страница. Каждый компонент проверяется глазами до использования в продукте.
        </p>
      </header>

      <Section title="Типографика">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-fg">
            Заголовок первого уровня
          </h1>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-fg">
            Заголовок второго уровня
          </h2>
          <h3 className="font-heading text-lg font-semibold text-fg">
            Заголовок третьего уровня
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-fg">
            Основной текст набирается шрифтом Golos Text. Он остается читаемым в длинных
            описаниях условий и пошаговых инструкциях.
          </p>
          <p className="max-w-xl text-sm text-muted">
            Вторичный текст для подсказок, пояснений и дат верификации.
          </p>
        </div>
      </Section>

      <Section title="Цвета">
        <div className="flex flex-wrap gap-4">
          {swatches.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-2">
              <div className={`size-16 rounded-sm border border-border ${s.cls}`} />
              <span className="text-xs text-muted">{s.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Кнопки">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Проверить льготы</Button>
          <Button variant="secondary">Вторичное действие</Button>
          <Button variant="ghost">Призрачная</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Маленькая</Button>
          <Button size="md">Средняя</Button>
          <Button size="lg">Большая</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>Недоступна</Button>
          <Button loading>Загрузка</Button>
          <Button>
            Продолжить
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <ButtonLink href="/" variant="secondary">
            Ссылка как кнопка
          </ButtonLink>
        </div>
      </Section>

      <Section title="Поля ввода">
        <div className="grid max-w-md gap-6">
          <Input label="Ваш доход в месяц" placeholder="Например 250 000" hint="Указывайте доход до вычета налогов" />
          <Input label="Электронная почта" type="email" placeholder="name@mail.kz" />
          <Input
            label="Год рождения"
            defaultValue="19999"
            error="Проверьте год рождения, в нем лишняя цифра"
          />
          <Input label="Недоступное поле" disabled placeholder="Заблокировано" />
        </div>
      </Section>

      <Section title="Выпадающий список">
        <div className="grid max-w-md gap-6">
          <Select label="Регион проживания" defaultValue="">
            <option value="" disabled>
              Выберите регион
            </option>
            <option value="astana">Астана</option>
            <option value="almaty">Алматы</option>
            <option value="shymkent">Шымкент</option>
            <option value="karaganda">Карагандинская область</option>
          </Select>
        </div>
      </Section>

      <Section title="Чекбоксы и радио">
        <div className="grid max-w-md gap-4">
          <Checkbox label="У меня есть дети до 18 лет" defaultChecked />
          <Checkbox
            label="Я студент очного отделения"
            description="Колледж или университет, грант или платное"
          />
          <Checkbox label="Недоступный вариант" disabled />
        </div>
        <div className="grid max-w-md gap-4">
          <Radio name="employment" label="Работаю официально" defaultChecked />
          <Radio name="employment" label="Работаю неофициально" />
          <Radio name="employment" label="Не работаю" description="Включая поиск работы" />
        </div>
      </Section>

      <Section title="Бейджи">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Нейтральный</Badge>
          <Badge variant="solid">Черный</Badge>
          <Badge variant="accent">Вам положено</Badge>
          <Badge variant="outline">Почти подходит</Badge>
        </div>
      </Section>

      <Section title="Прогресс анкеты">
        <div className="grid max-w-md gap-6">
          <Progress value={25} label="Шаг 2 из 8" />
          <Progress value={60} label="Шаг 5 из 8" />
          <Progress value={90} label="Шаг 7 из 8" />
        </div>
      </Section>

      <Section title="Карточка">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Адресная социальная помощь</CardTitle>
              <Badge variant="accent">до 35 596 тенге</Badge>
            </div>
            <CardDescription>
              Ежемесячная выплата семьям, чей доход на человека ниже черты бедности
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-fg">
              Размер выплаты зависит от дохода семьи и количества детей. Точная сумма
              рассчитывается после заполнения анкеты.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">
              Подробнее
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button size="sm" variant="ghost">
              <Search className="size-4" aria-hidden />
              Найти в законе
            </Button>
          </CardFooter>
        </Card>
      </Section>
    </main>
  );
}
