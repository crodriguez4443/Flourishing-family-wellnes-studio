// Parses the CMS-editable free-text hours string (src/data/site.json ->
// contactInfo.hours) into schema.org OpeningHoursSpecification objects.
// This is the single source of truth for hours; the human-readable string
// stays untouched in the CMS.

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string;
  opens: string;
  closes: string;
}

const DAY_NAMES: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const TIME_RE = /^(\d{1,2}):(\d{2})([ap])$/i;

function parseTime(raw: string): string | null {
  const match = TIME_RE.exec(raw.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3].toLowerCase();
  if (hour < 1 || hour > 12) return null;
  if (meridiem === 'p' && hour !== 12) hour += 12;
  if (meridiem === 'a' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}`;
}

export function parseHours(input: string): OpeningHoursSpecification[] {
  const specs: OpeningHoursSpecification[] = [];

  for (const entry of input.split(';')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    // Accept both "Mon" and "Monday" — a client typing the full day name
    // should not silently drop that day from the schema.
    const [, dayAbbr, rest] = /^([A-Za-z]{3,})\s+(.+)$/.exec(trimmed) ?? [];
    if (!dayAbbr || !rest) continue;

    const dayOfWeek = DAY_NAMES[dayAbbr.slice(0, 3).toLowerCase()];
    if (!dayOfWeek) continue;

    if (rest.trim().toLowerCase() === 'closed') continue;

    for (const range of rest.split('&')) {
      const [opensRaw, closesRaw] = range.split('-').map((s) => s.trim());
      if (!opensRaw || !closesRaw) continue;

      const opens = parseTime(opensRaw);
      const closes = parseTime(closesRaw);
      if (!opens || !closes) continue;

      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek, opens, closes });
    }
  }

  return specs;
}
