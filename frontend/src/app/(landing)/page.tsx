import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Segments } from "@/components/landing/segments";
import { Faq } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "GovAid Navigator: проверьте свои льготы за две минуты",
  description:
    "Ответьте на восемь вопросов и узнайте, какие выплаты, вычеты и льготы вам положены в Казахстане. Расчет по действующим законам, бесплатно и без регистрации.",
  openGraph: {
    title: "GovAid Navigator",
    description:
      "Персональный навигатор по мерам государственной поддержки Казахстана. Узнайте, что вам положено.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Stats />
      <HowItWorks />
      <Segments />
      <Faq />
    </main>
  );
}
