// Global settings below are CMS-managed via public/admin (Site Info → Global
// Settings), which reads/writes src/data/site.json. Everything else in this
// file (testimonials, locations) stays code-only.
import site from './site.json';

// Generic "Book a Visit" destination — the /book/ chooser. Service pages link
// straight to their own calendar via bookingCalendarUrl() instead.
export const bookingUrl = site.bookingUrl;

// Program intake (Calendly). Programs are the primary conversion goal and are a
// qualifying conversation, not a one-off appointment, so they never route to Sked.
export const applyUrl = site.applyUrl;

// Three Sked calendars serve five services: chiropractic covers chiropractic,
// pediatric & postpartum, and sports & extremity care. Each service .md names
// its calendar via a `calendar` field.
export const bookingCalendars = site.bookingCalendars;

export const bookingCalendarUrl = (calendar?: string) =>
  calendar && bookingCalendars.some((entry) => entry.slug === calendar)
    ? `/book/${calendar}/`
    : bookingUrl;

export const contactInfo = site.contactInfo;

export const socialLinks = site.socialLinks;

export const doctors = site.doctors;

export const testimonials = [
  {
    quote: 'Both Drs here are amazing! Highly recommended!',
    source: 'Carla',
  },
  {
    quote: 'Great place! They make you feel comfortable and very informative!',
    source: 'Peter',
  },
  {
    quote: 'They are amazing, attentive, and understanding. Highly recommended',
    source: 'Jesse',
  },
];

export const locations = [
  {
    slug: 'clark',
    town: 'Clark',
    title: 'Family wellness care in Clark, NJ',
    // Short <title>-tag override — the long `title` above stays the visible H1.
    // Keeps the rendered tag under 60 chars once " | Flourishing Family" is
    // appended; keyword + town leads for local search.
    metaTitle: 'Family Chiropractic in Clark, NJ',
    summary:
      'One-on-one chiropractic, acupuncture, pregnancy, fertility, postpartum, and family wellness care from our Clark studio.',
  },
  {
    slug: 'westfield',
    town: 'Westfield',
    title: 'Pregnancy and family wellness care near Westfield',
    metaTitle: 'Prenatal & Family Care near Westfield',
    summary:
      'A warm, doctor-led care home for Westfield families looking for pregnancy support, pediatric care, and whole-family wellness.',
  },
  {
    slug: 'cranford',
    town: 'Cranford',
    title: 'Prenatal, postpartum, and family care near Cranford',
    metaTitle: 'Prenatal & Family Care near Cranford',
    summary:
      'Support for Cranford families who want thorough, calm care through pregnancy, postpartum, fertility, and the everyday body.',
  },
  {
    slug: 'scotch-plains',
    town: 'Scotch Plains',
    title: 'Family chiropractic and acupuncture near Scotch Plains',
    metaTitle: 'Family Care near Scotch Plains, NJ',
    summary:
      'A one-on-one wellness studio for Scotch Plains families who want care that is personal, measured, and easy to understand.',
  },
];

export type Location = (typeof locations)[number];
