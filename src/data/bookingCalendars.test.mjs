// Self-check for the service -> Sked calendar mapping.
// Run with: node src/data/bookingCalendars.test.mjs
//
// Why this exists: a service whose `calendar` value does not match a calendar
// slug silently falls back to the /book/ chooser instead of erroring, so a typo
// here is invisible in the build and only shows up as a patient landing on the
// wrong page. Reads the files from disk so it also catches a CMS save that
// dropped the field.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(readFileSync(join(here, 'site.json'), 'utf8'));
const servicesDir = join(here, '../content/services');

const slugs = site.bookingCalendars.map((calendar) => calendar.slug);
assert.deepEqual(slugs, ['chiropractic', 'acupuncture', 'nutrition'], 'three calendars, in order');

// Each calendar is a different doctor's schedule, so a key must never be shared.
// Two calendars carrying the same key sends patients to the wrong provider, and
// nothing else in the build would notice.
const keys = site.bookingCalendars.map((calendar) => calendar.skedKey).filter(Boolean);
assert.equal(new Set(keys).size, keys.length, 'no two calendars share a Sked key');

// Client-confirmed: the chiropractic calendar covers three services.
const EXPECTED = {
  'chiropractic.md': 'chiropractic',
  'pediatric-postpartum.md': 'chiropractic',
  'sports-extremity-care.md': 'chiropractic',
  'acupuncture.md': 'acupuncture',
  'functional-nutrition.md': 'nutrition',
};

const files = readdirSync(servicesDir).filter((name) => name.endsWith('.md'));
assert.deepEqual(files.sort(), Object.keys(EXPECTED).sort(), 'every service file is accounted for');

for (const file of files) {
  const calendar = readFileSync(join(servicesDir, file), 'utf8').match(/^calendar:\s*(\S+)/m)?.[1];
  assert.equal(calendar, EXPECTED[file], `${file} books the ${EXPECTED[file]} calendar`);
  assert.ok(slugs.includes(calendar), `${file} points at a calendar that exists`);
}

// bookingUrl is the on-site chooser, not the raw portal — every global CTA uses it.
assert.equal(site.bookingUrl, '/book/', 'bookingUrl is the /book/ chooser');

console.log('booking calendar mapping ok');
