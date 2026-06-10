import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  ...(process.env.OUTPUT_MODE === "standalone" && { output: "standalone" }),
}

export default nextConfig