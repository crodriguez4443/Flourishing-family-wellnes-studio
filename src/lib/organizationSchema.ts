// Business/organization JSON-LD, rendered on every page from Layout.astro.
// Values are client-confirmed — do not edit without client sign-off.
import { contactInfo, bookingUrl } from '../data/site';
import { parseHours } from './hours';

export function getOrganizationSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    // Stable @id so page-level schema references this one business node rather
    // than duplicating it. There is only one physical practice.
    '@id': new URL('/#business', site).href,
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    medicalSpecialty: ['Chiropractic', 'Acupuncture'],
    name: 'Flourishing Family Wellness Studio',
    alternateName: 'Flourishing Family Chiropractic',
    legalName: 'FLOURISHING FAMILY CHIROPRACTIC, LIMITED LIABILITY COMPANY',
    url: 'https://myflourishingfamily.com',
    email: 'info@myflourishingfamily.com',
    telephone: '+1-908-653-0000',
    foundingDate: '2011',
    logo: new URL('/assets/logo-horizontal-transparent.png', site).href,
    image: new URL('/default-og-image.jpg', site).href,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '68 Washington Street',
      addressLocality: 'Clark',
      addressRegion: 'NJ',
      postalCode: '07066',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.6188116,
      longitude: -74.2981423,
    },
    areaServed: ['Clark', 'Westfield', 'Cranford', 'Scotch Plains'].map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Union County, NJ' },
    })),
    sameAs: [
      'https://www.facebook.com/flourishingfamilywellness',
      'https://www.instagram.com/flourishingfamilywellness/',
      'https://www.yelp.com/biz/flourishing-family-chiropractic-clark',
      'https://nextdoor.com/pages/flourishing-family-chiropractic-clark-nj/',
      'https://maps.google.com/?cid=10511105972297997058',
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: bookingUrl,
    },
    openingHoursSpecification: parseHours(contactInfo.hours),
  };
}
