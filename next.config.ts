import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: "export",

  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/nur.mk",
};

export default nextConfig;
