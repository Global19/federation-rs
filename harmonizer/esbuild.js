let denoFsPlugin = {
  name: 'fs',
  setup(build) {
    // Intercept require("fs") and replace it with shims
    build.onResolve({ filter: /^fs$/ }, args => ({
      path: args.path,
      namespace: 'deno-fs',
    }))

  build.onLoad({ filter: /.*/, namespace: 'deno-fs'}, () => ({
    contents: 'module.exports = { existsSync: Deno.ensureFileSync, writeFileSync: Deno.writeTextFile }',
    loader: 'js',
  }))
  }
}

require('esbuild').build({
  entryPoints: ['./js/index.mjs'],
  bundle: true,
  minify: true,
  target: 'es2020',
  globalName: 'composition',
  outfile: "./dist/composition.js",
  format: 'iife',
  plugins: [denoFsPlugin],
}).catch(() => process.exit(1))