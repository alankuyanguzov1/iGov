import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | GovAid Navigator",
  description:
    "Какие данные обрабатывает GovAid Navigator, где они хранятся и как удалить аккаунт",
};

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
