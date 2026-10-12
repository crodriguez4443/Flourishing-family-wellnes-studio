import { frontmatter as busyProfessionalPlan } from '../content/programs/busy-professional-plan.md';
import { frontmatter as fertilityJourney } from '../content/programs/fertility-journey.md';
import { frontmatter as postpartumCare } from '../content/programs/postpartum-care.md';
import { frontmatter as pregnancyJourney } from '../content/programs/pregnancy-journey.md';

// The CMS groups each program's fields into collapsible sections, so the .md
// frontmatter nests them (heroSection: { title, ... }). Pages expect the flat
// shape, so spread every `*Section` object back to the top level here.
const flatten = (frontmatter: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(frontmatter).flatMap(([key, value]) =>
      key.endsWith('Section') ? Object.entries(value ?? {}) : [[key, value]],
    ),
  );

export const programs = [
  fertilityJourney,
  pregnancyJourney,
  postpartumCare,
  busyProfessionalPlan,
]
  .map(flatten)
  .sort((a, b) => a.order - b.order);

export const programPageShared = {
  relatedStage: 'Trying → Expecting → Postpartum',
};

export type Program = (typeof programs)[number];
