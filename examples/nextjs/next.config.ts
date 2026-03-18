// @author João Gabriel de Almeida

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@owl/core", "@owl/react", "@owl/server"],
};

export default nextConfig;
