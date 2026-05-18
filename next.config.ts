import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures Payload Lexical / UI client chunks are transpiled for Next + OpenNext (Workers) builds.
  transpilePackages: [
    '@payloadcms/next',
    '@payloadcms/ui',
    '@payloadcms/richtext-lexical',
  ],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
