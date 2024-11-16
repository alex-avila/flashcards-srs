import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/decks",
        destination: "/",
        // TODO: reconsider if permanent should be false or true
        permanent: false,
      },
    ]
  },
}

export default nextConfig
