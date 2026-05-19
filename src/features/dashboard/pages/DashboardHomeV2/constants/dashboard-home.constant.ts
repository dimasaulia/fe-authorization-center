import type { TranslationKey } from "@/modules/preferences";
import type { AppIconName } from "@/shared/components/AppIcon";

export const quickLinks = [
  {
    badgeKey: "dashboard.quick.mail.badge",
    descriptionKey: "dashboard.quick.mail.description",
    icon: "mail",
    titleKey: "dashboard.quick.mail.title",
    tone: "blue",
  },
  {
    badgeKey: "dashboard.quick.storage.badge",
    descriptionKey: "dashboard.quick.storage.description",
    icon: "folder",
    titleKey: "dashboard.quick.storage.title",
    tone: "green",
  },
  {
    badgeKey: "dashboard.quick.network.badge",
    descriptionKey: "dashboard.quick.network.description",
    icon: "shield",
    titleKey: "dashboard.quick.network.title",
    tone: "purple",
  },
] as const satisfies ReadonlyArray<{
  badgeKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: AppIconName;
  titleKey: TranslationKey;
  tone: "blue" | "green" | "purple";
}>;

export const notifications = [
  {
    descriptionKey: "dashboard.notifications.mail.description",
    titleKey: "dashboard.notifications.mail.title",
    timeKey: "dashboard.notifications.mail.time",
    tone: "bg-hero",
  },
  {
    descriptionKey: "dashboard.notifications.drive.description",
    titleKey: "dashboard.notifications.drive.title",
    timeKey: "dashboard.notifications.drive.time",
    tone: "bg-[#0EA58A]",
  },
  {
    descriptionKey: "dashboard.notifications.network.description",
    titleKey: "dashboard.notifications.network.title",
    timeKey: "dashboard.notifications.network.time",
    tone: "bg-[#7C3AED]",
  },
] as const satisfies ReadonlyArray<{
  descriptionKey: TranslationKey;
  titleKey: TranslationKey;
  timeKey: TranslationKey;
  tone: string;
}>;

export const accessStats = [
  { labelKey: "dashboard.access.groups", value: "3" },
  { labelKey: "dashboard.access.servers", value: "8" },
  { labelKey: "dashboard.access.webApps", value: "14" },
  { labelKey: "dashboard.access.devices", value: "2" },
] as const satisfies ReadonlyArray<{
  labelKey: TranslationKey;
  value: string;
}>;

export const toolCategories = [
  { key: "forYou", labelKey: "dashboard.tools.category.forYou" },
  { key: "sales", labelKey: "dashboard.tools.category.sales" },
  { key: "finance", labelKey: "dashboard.tools.category.finance" },
  { key: "operations", labelKey: "dashboard.tools.category.operations" },
  { key: "people", labelKey: "dashboard.tools.category.people" },
] as const;

export type ToolCategory = (typeof toolCategories)[number]["key"];

export const businessTools = [
  {
    categories: ["forYou", "sales"],
    descriptionKey: "dashboard.tools.crm.description",
    icon: "document",
    titleKey: "dashboard.tools.crm.title",
    tone: "purple",
  },
  {
    categories: ["forYou", "sales"],
    descriptionKey: "dashboard.tools.sales.description",
    icon: "briefcase",
    titleKey: "dashboard.tools.sales.title",
    tone: "orange",
  },
  {
    categories: ["forYou", "finance"],
    descriptionKey: "dashboard.tools.accounting.description",
    icon: "calculator",
    titleKey: "dashboard.tools.accounting.title",
    tone: "green",
  },
  {
    categories: ["forYou", "operations"],
    descriptionKey: "dashboard.tools.inventory.description",
    icon: "package",
    titleKey: "dashboard.tools.inventory.title",
    tone: "blue",
  },
  {
    categories: ["forYou", "people"],
    descriptionKey: "dashboard.tools.employees.description",
    icon: "people",
    titleKey: "dashboard.tools.employees.title",
    tone: "pink",
  },
  {
    categories: ["operations", "people"],
    descriptionKey: "dashboard.tools.projects.description",
    icon: "menu",
    titleKey: "dashboard.tools.projects.title",
    tone: "neutral",
  },
  {
    categories: ["finance", "operations"],
    descriptionKey: "dashboard.tools.purchase.description",
    icon: "box",
    titleKey: "dashboard.tools.purchase.title",
    tone: "orange",
  },
] as const satisfies ReadonlyArray<{
  categories: ReadonlyArray<ToolCategory>;
  descriptionKey: TranslationKey;
  icon: AppIconName;
  titleKey: TranslationKey;
  tone: "blue" | "green" | "purple" | "orange" | "pink" | "neutral";
}>;
