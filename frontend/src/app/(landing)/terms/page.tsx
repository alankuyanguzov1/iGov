import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { termsOfUse } from "@/content/legal";

export const metadata: Metadata = {
  title: "Условия использования | GovAid Navigator",
  description: "Условия использования сервиса GovAid Navigator",
};

export default function TermsPage() {
  return <LegalPage doc={termsOfUse} />;
}
