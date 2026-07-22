// Self-check for hours.ts. Run with: node src/lib/hours.test.mjs
import assert from 'node:assert/strict';
import { parseHours } from './hours.ts';

const REAL_HOURS =
  'Mon 9:00a-1:00p & 3:00p-7:00p; Tue closed; Wed 3:00p-6:30p; Thu 9:00a-1:00p & 3:00p-6:00p; Fri 8:00a-12:00p; Sat 8:00a-11:30a; Sun closed';

const EXPECTED = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '13:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '15:00', closes: '19:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '15:00', closes: '18:30' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:00', closes: '13:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '15:00', closes: '18:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '12:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '11:30' },
];

assert.deepEqual(parseHours(REAL_HOURS), EXPECTED, 'real hours string should match expected spec array');

// 12:00p -> 12:00 (noon, not 24:00)
assert.deepEqual(parseHours('Mon 12:00p-1:00p'), [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '12:00', closes: '13:00' },
]);

// 12:00a -> 00:00 (midnight, not 12:00)
assert.deepEqual(parseHours('Mon 12:00a-1:00a'), [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '00:00', closes: '01:00' },
]);

// closed day produces nothing
assert.deepEqual(parseHours('Tue closed'), []);

// full day names work too — a client may well type "Monday" instead of "Mon"
assert.deepEqual(parseHours('Monday 9:00a-1:00p; Tuesday closed'), [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '13:00' },
]);

// garbage segment is skipped, not emitted as invalid schema
assert.deepEqual(parseHours('Mon 9:00a-1:00p; Xyz garbage; Wed whatever-nonsense'), [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '13:00' },
]);

console.log('hours.test.mjs: all assertions passed');
