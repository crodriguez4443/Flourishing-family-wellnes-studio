import { frontmatter as acupuncture } from '../content/services/acupuncture.md';
import { frontmatter as chiropractic } from '../content/services/chiropractic.md';
import { frontmatter as functionalNutrition } from '../content/services/functional-nutrition.md';
import { frontmatter as pediatricPostpartum } from '../content/services/pediatric-postpartum.md';
import { frontmatter as sportsExtremityCare } from '../content/services/sports-extremity-care.md';

export const services = [
  chiropractic,
  acupuncture,
  functionalNutrition,
  pediatricPostpartum,
  sportsExtremityCare,
].sort((a, b) => a.order - b.order);

export const servicePageShared = {
  current: 'services',
  defaultHeroSize: 'clamp(42px,5.4vw,78px)',
  defaultLeftEyebrow: 'What it is',
  defaultRightEyebrow: 'Who it’s for',
  breadcrumbLabel: 'Services',
  breadcrumbHref: '/services/',
  relatedEyebrow: 'Part of a bigger plan',
  finalTitle: 'Ready for care that actually listens?',
  finalText:
    'Book a first visit one-on-one with a doctor, or start with a no-pressure conversation.',
  finalPrimaryLabel: 'Book a visit',
  finalSecondaryLabel: 'Start with a conversation',
  finalSecondaryHref: '/contact/',
};

export type Service = (typeof services)[number];
