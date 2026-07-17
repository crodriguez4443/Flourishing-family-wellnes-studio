import { frontmatter as familyMembership } from '../content/programs/family-membership.md';
import { frontmatter as fertilityJourney } from '../content/programs/fertility-journey.md';
import { frontmatter as postpartumCare } from '../content/programs/postpartum-care.md';
import { frontmatter as pregnancyJourney } from '../content/programs/pregnancy-journey.md';

export const programs = [fertilityJourney, pregnancyJourney, postpartumCare, familyMembership].sort(
  (a, b) => a.order - b.order,
);

export const programPageShared = {
  relatedStage: 'Trying → Expecting → Postpartum → Raising a family',
};

export type Program = (typeof programs)[number];
