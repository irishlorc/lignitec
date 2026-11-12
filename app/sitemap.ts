import type { MetadataRoute } from 'next';
import { company } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/materials', '/applications', '/science', '/about', '/contact'].map((p) => ({ url: company.url + p, changeFrequency: 'monthly' }));
}
