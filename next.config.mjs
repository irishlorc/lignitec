/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Preserve links from the current lignitec.nl structure.
  async redirects() {
    return [
      { source: '/collections', destination: '/materials', permanent: true },
      { source: '/the-company', destination: '/about', permanent: true },
      { source: '/our-mission', destination: '/about#mission', permanent: true },
      { source: '/info', destination: '/science', permanent: true },
      { source: '/vacancies', destination: '/about', permanent: false },
    ];
  },
};
export default nextConfig;
