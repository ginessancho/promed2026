import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['api/trpc/_handler.ts'],
  bundle: true,
  outfile: 'api/trpc/[trpc].js',
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  // Stub out WebSocket-related modules - we only use HTTP
  alias: {
    'ws': './api/trpc/ws-stub.js',
    '@libsql/isomorphic-ws': './api/trpc/ws-stub.js',
  },
  // Inject fetch polyfill for browser platform
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('✅ Serverless function bundled successfully');

