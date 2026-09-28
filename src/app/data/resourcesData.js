/**
 * Resources library data.
 *
 * Shaped the way the content endpoint is expected to answer, so the exports
 * below can be swapped for an API response without touching the components:
 *
 *   resourcesData
 *   ├── featured        (the hero article)
 *   ├── quote
 *   ├── categories
 *   ├── items           (the searchable library)
 *   ├── popularTopics
 *   └── quickLinks
 *
 * Icons are referenced by component and accent colours by palette key (`tone`),
 * resolved at render time from the active theme — see `usePalette()`.
 *
 * `art` names a CSS stand-in class (see `.zp-res-*` in `zp-theme.css`); set
 * `image` on an item once the real photograph is available and it takes over.
 */
import {
  Brain, HeartPulse, Briefcase, UsersRound, Coins, Footprints, Leaf, ChartNoAxesCombined,
  Moon, Zap, Clock3,
  LifeBuoy, ClipboardList, MonitorPlay, BookOpen, Download, ExternalLink,
} from "lucide-react";

export const RESOURCE_TYPES = ["Article", "Video", "Guide", "Podcast"];

export const SORT_OPTIONS = [
  { id: "relevant", label: "Most Relevant" },
  { id: "newest", label: "Newest" },
  { id: "shortest", label: "Shortest First" },
  { id: "title", label: "Title (A-Z)" },
];

export const CATEGORIES = [
  { id: "mental-health", label: "Mental Health", icon: Brain, tone: "teal" },
  { id: "stress", label: "Stress & Anxiety", icon: HeartPulse, tone: "rose" },
  { id: "work-life", label: "Work-Life Balance", icon: Briefcase, tone: "brand" },
  { id: "relationships", label: "Relationships", icon: UsersRound, tone: "violet" },
  { id: "financial", label: "Financial Wellbeing", icon: Coins, tone: "amber" },
  { id: "physical", label: "Physical Health", icon: Footprints, tone: "emerald" },
  { id: "mindfulness", label: "Mindfulness", icon: Leaf, tone: "emerald" },
  { id: "growth", label: "Personal Growth", icon: ChartNoAxesCombined, tone: "violet" },
];

/** `minutes` drives the "shortest first" sort; the verb completes the meta label. */
const META = { Article: "read", Video: "watch", Guide: "read", Podcast: "listen" };
const item = (data) => ({ ...data, meta: `${data.minutes} min ${META[data.type]}` });

export const RESOURCE_ITEMS = [
  item({ id: "managing-stress", title: "Managing Stress at Work", description: "Practical tips to stay calm and productive.", type: "Article", categoryId: "stress", minutes: 5, publishedAt: "2024-11-18", featured: true, art: "zp-res-art-seedling" }),
  item({ id: "intro-mindfulness", title: "Introduction to Mindfulness", description: "A short guided session to help you feel present.", type: "Video", categoryId: "mindfulness", minutes: 10, publishedAt: "2024-11-05", featured: true, art: "zp-res-art-lake" }),
  item({ id: "healthy-habits", title: "Building Healthy Habits", description: "A step-by-step guide for lasting change.", type: "Guide", categoryId: "growth", minutes: 8, publishedAt: "2024-10-22", featured: true, art: "zp-res-art-notebook" }),
  item({ id: "conversations-that-heal", title: "Conversations That Heal", description: "Real stories, real people, real support.", type: "Podcast", categoryId: "mental-health", minutes: 28, publishedAt: "2024-10-09", featured: true, art: "zp-res-art-studio" }),
  item({ id: "sleep-better", title: "Sleep Better, Live Better", description: "Small evening routines that restore your rest.", type: "Guide", categoryId: "physical", minutes: 6, publishedAt: "2024-09-27", art: "zp-res-art-lake" }),
  item({ id: "money-and-mind", title: "Money and Peace of Mind", description: "Budgeting habits that lower financial stress.", type: "Article", categoryId: "financial", minutes: 7, publishedAt: "2024-09-12", art: "zp-res-art-notebook" }),
  item({ id: "boundaries-at-work", title: "Setting Boundaries at Work", description: "Protect your time without letting your team down.", type: "Video", categoryId: "work-life", minutes: 12, publishedAt: "2024-08-30", art: "zp-res-art-studio" }),
  item({ id: "listening-well", title: "The Art of Listening Well", description: "Build stronger relationships through real attention.", type: "Podcast", categoryId: "relationships", minutes: 34, publishedAt: "2024-08-14", art: "zp-res-art-studio" }),
  item({ id: "anxiety-toolkit", title: "An Everyday Anxiety Toolkit", description: "Grounding exercises you can use in five minutes.", type: "Guide", categoryId: "stress", minutes: 9, publishedAt: "2024-07-29", art: "zp-res-art-seedling" }),
  item({ id: "movement-breaks", title: "Movement Breaks That Stick", description: "Short routines for long days at a desk.", type: "Article", categoryId: "physical", minutes: 4, publishedAt: "2024-07-11", art: "zp-res-art-seedling" }),
  item({ id: "growth-mindset", title: "Growing Through Setbacks", description: "How resilience is practised, not inherited.", type: "Article", categoryId: "growth", minutes: 6, publishedAt: "2024-06-25", art: "zp-res-art-notebook" }),
  item({ id: "mindful-mornings", title: "Mindful Mornings", description: "A ten-minute start that steadies the whole day.", type: "Video", categoryId: "mindfulness", minutes: 10, publishedAt: "2024-06-08", art: "zp-res-art-lake" }),
];

export const POPULAR_TOPICS = [
  { id: "anxiety", label: "Managing Anxiety", icon: HeartPulse, tone: "rose", categoryId: "stress" },
  { id: "sleep", label: "Improving Sleep", icon: Moon, tone: "violet", categoryId: "physical" },
  { id: "motivated", label: "Staying Motivated", icon: Zap, tone: "amber", categoryId: "growth" },
  { id: "relationships", label: "Healthy Relationships", icon: UsersRound, tone: "violet", categoryId: "relationships" },
  { id: "planning", label: "Financial Planning", icon: Coins, tone: "amber", categoryId: "financial" },
  { id: "time", label: "Time Management", icon: Clock3, tone: "teal", categoryId: "work-life" },
];

export const QUICK_LINKS = [
  { id: "crisis", label: "Crisis Support", icon: LifeBuoy },
  { id: "overview", label: "EAP Program Overview", icon: ClipboardList },
  { id: "webinars", label: "Wellbeing Webinars", icon: MonitorPlay },
  { id: "reading", label: "Recommended Reading", icon: BookOpen },
  { id: "guides", label: "Downloadable Guides", icon: Download },
  { id: "external", label: "External Support Services", icon: ExternalLink },
];

export const FEATURED_RESOURCE = {
  eyebrow: "Featured Resource",
  title: "Small Steps, Big Impact",
  description: "Simple daily habits for a healthier and happier you.",
  cta: "Read Article",
  overlay: ["A healthier", "happier you"],
  art: "zp-res-hero-art",
};

export const WELLBEING_QUOTE = {
  lines: ["Your wellbeing matters.", "Take the time you need."],
};

export const SUPPORT_CALLOUT = {
  title: "Need Immediate Support?",
  detail: "If you or someone you know is in crisis, please reach out for professional help.",
  cta: "View Support Resources",
};

export const SAFETY_NOTICE = {
  title: "Safe & Confidential",
  detail:
    "All resources are general wellness information. For personalized support, employees can access confidential EAP services through the employee portal.",
};

/** Search, filter and sort the library. Pure, so it can move server-side later. */
export function filterResources(items, { query = "", categoryId = null, type = "All Types", sort = "relevant" } = {}) {
  const needle = query.trim().toLowerCase();
  const matched = items.filter((resource) => {
    if (categoryId && resource.categoryId !== categoryId) return false;
    if (type !== "All Types" && resource.type !== type) return false;
    if (!needle) return true;
    return `${resource.title} ${resource.description} ${resource.type}`.toLowerCase().includes(needle);
  });

  const compare = {
    // "Most relevant" keeps the editorial order, with the featured picks first.
    relevant: (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
    newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
    shortest: (a, b) => a.minutes - b.minutes,
    title: (a, b) => a.title.localeCompare(b.title),
  }[sort];

  return compare ? [...matched].sort(compare) : matched;
}

export const resourcesData = {
  featured: FEATURED_RESOURCE,
  quote: WELLBEING_QUOTE,
  categories: CATEGORIES,
  items: RESOURCE_ITEMS,
  popularTopics: POPULAR_TOPICS,
  quickLinks: QUICK_LINKS,
};

export default resourcesData;
