import { frontmatter as busyProfessionalPlan } from '../content/programs/busy-professional-plan.md';
import { frontmatter as fertilityJourney } from '../content/programs/fertility-journey.md';
import { frontmatter as postpartumCare } from '../content/programs/postpartum-care.md';
import { frontmatter as pregnancyJourney } from '../content/programs/pregnancy-journey.md';

export const programs = [
  fertilityJourney,
  pregnancyJourney,
  postpartumCare,
  busyProfessionalPlan,
].sort((a, b) => a.order - b.order);

export const programPageShared = {
  relatedStage: 'Trying → Expecting → Postpartum',
};

export type Program = (typeof programs)[number];
