import { createClient } from "@/lib/supabase/client";
import type { Answers } from "@/lib/questionnaire";

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function saveProfile(answers: Answers): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    region: answers.region,
    birth_year: answers.birthYear,
    adults: answers.adults,
    children: answers.childrenAges,
    income_monthly: answers.incomeUnknown ? null : answers.incomeMonthly,
    income_unknown: answers.incomeUnknown,
    income_range: answers.incomeRange,
    statuses: answers.statuses,
    disability_group: answers.disabilityGroup,
    employment: answers.employment,
    housing: answers.housing,
    updated_at: new Date().toISOString(),
  });

  return !error;
}

export async function listSavedSlugs(): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_benefits")
    .select("benefit_slug")
    .eq("user_id", user.id);

  if (error || !data) return [];
  return data.map((row) => row.benefit_slug as string);
}

export async function saveBenefit(slug: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("user_benefits").upsert({
    user_id: user.id,
    benefit_slug: slug,
    updated_at: new Date().toISOString(),
  });

  return !error;
}

export type BenefitState = {
  status: string;
  checkedDocuments: string[];
};

export async function getBenefitState(slug: string): Promise<BenefitState | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_benefits")
    .select("status, checked_documents")
    .eq("user_id", user.id)
    .eq("benefit_slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return {
    status: data.status as string,
    checkedDocuments: (data.checked_documents as string[]) ?? [],
  };
}

export async function updateBenefitStatus(slug: string, status: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("user_benefits").upsert({
    user_id: user.id,
    benefit_slug: slug,
    status,
    updated_at: new Date().toISOString(),
  });

  return !error;
}

export async function setCheckedDocuments(slug: string, docs: string[]): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("user_benefits").upsert({
    user_id: user.id,
    benefit_slug: slug,
    checked_documents: docs,
    updated_at: new Date().toISOString(),
  });

  return !error;
}

export async function removeBenefit(slug: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("user_benefits")
    .delete()
    .eq("user_id", user.id)
    .eq("benefit_slug", slug);

  return !error;
}
