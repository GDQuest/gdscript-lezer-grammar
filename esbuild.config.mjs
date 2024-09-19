import * as esbuild from "esbuild";

import pkg from "./package.json" assert { type: "json" };

/** @type {esbuild.BuildOptions} */
const baseConfig = {
  entryPoints: ["./src/index.mts"],
  tsconfig: "./tsconfig.browser.json",
  bundle: true,
  sourcemap: true,
  outdir: "./dist",
  target: ["chrome109", "edge112", "firefox102", "safari15"],
  allowOverwrite: true,
  external: [...Object.keys(pkg.peerDependencies ?? {})],
};

// module
/** @type {esbuild.BuildOptions} */
const moduleConfig = {
  ...baseConfig,
  format: "esm",
  splitting: true,
};
await esbuild.build({
  ...moduleConfig,
  outExtension: {
    ".js": ".mjs",
  },
});
await esbuild.build({
  ...moduleConfig,
  outExtension: {
    ".js": ".min.mjs",
  },
  minify: true,
});

// cjs
/** @type {esbuild.BuildOptions} */
const commonJsConfig = {
  ...baseConfig,
  format: "cjs",
};
await esbuild.build({
  ...commonJsConfig,
  outExtension: {
    ".js": ".cjs",
  },
});
await esbuild.build({
  ...commonJsConfig,
  outExtension: {
    ".js": ".min.cjs",
  },
  minify: true,
});
