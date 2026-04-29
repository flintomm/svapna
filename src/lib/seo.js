// JSON-LD builders for the structured-data emitted in each page's <head>.
// Keep these dependency-free so they can be called from .astro frontmatter.
//
// Every URL passed in should be an absolute URL — pages compute these from
// Astro.site + Astro.url.pathname and pass them down.

export const SITE_NAME = 'Svapna';
export const SITE_LEGAL_NAME = 'Svapna Project';
export const SITE_DESCRIPTION =
  'A free, donation-supported course on dream yoga and lucid dreaming. Mandukya, Tibetan milam, modern lucid-dreaming science.';
export const SITE_LOGO_PATH = '/logo.svg';

// Site-wide Organization + WebSite. Emitted on every page from Layout.astro.
export function organizationSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: siteUrl,
    logo: new URL(SITE_LOGO_PATH, siteUrl).href,
    description: SITE_DESCRIPTION,
  };
}

export function websiteSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_LEGAL_NAME,
    },
    inLanguage: 'en',
  };
}

// crumbs: ordered list of { name, url } where url is absolute. The first
// crumb is typically Home; the last is the current page.
export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function courseSchema({ url, name, description, lessonCount, providerUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': url,
    url,
    name,
    description,
    inLanguage: 'en',
    isAccessibleForFree: true,
    educationalLevel: 'introductory to intermediate',
    numberOfCredits: lessonCount,
    provider: {
      '@type': 'Organization',
      name: SITE_LEGAL_NAME,
      url: providerUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, lessonCount)}H`,
    },
  };
}

export function articleSchema({ url, headline, description, image, datePublished, author, section }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    url,
    headline,
    description,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: author || SITE_LEGAL_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_LEGAL_NAME,
    },
    mainEntityOfPage: url,
  };
  if (image) schema.image = image;
  if (datePublished) schema.datePublished = datePublished;
  if (section) schema.articleSection = section;
  return schema;
}

export function definedTermSchema({ url, name, description, termCode, language, inDefinedTermSet }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': url,
    url,
    name,
    description,
    termCode,
    inLanguage: language || undefined,
    inDefinedTermSet: inDefinedTermSet || undefined,
  };
}

export function definedTermSetSchema({ url, name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': url,
    url,
    name,
    description,
    inLanguage: 'en',
  };
}

// Helper to build a crumb trail. `siteUrl` is the absolute site root.
export function buildCrumbs(siteUrl, segments) {
  // segments: [{ name, path }] — path is the URL path with leading slash.
  // The Home crumb is added automatically.
  const out = [{ name: 'Home', url: siteUrl.replace(/\/$/, '') + '/' }];
  for (const s of segments) {
    out.push({ name: s.name, url: new URL(s.path, siteUrl).href });
  }
  return out;
}
