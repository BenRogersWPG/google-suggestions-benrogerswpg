import { bench, describe, vi, beforeAll } from 'vitest';

// Mock axios so the benchmarks measure the library's own logic (input
// handling, request setup and response parsing) deterministically, without
// making real network calls to Google's suggestion endpoint.
vi.mock('axios', () => ({
  default: {
    get: vi.fn(async () => ({
      data: [
        'nodejs',
        [
          'nodejs download',
          'nodejs tutorials',
          'nodejs framework',
          'nodejs interview questions github',
          'nodejs fetch',
          'nodejs versions',
          'nodejs documentation',
          'nodejs express',
        ],
      ],
    })),
  },
}));

// The module uses `module.exports = ...`, so import it through CJS interop.
// eslint-disable-next-line @typescript-eslint/no-var-requires
let getGoogleSuggestions: (query: string) => Promise<string[]>;

beforeAll(async () => {
  const mod = await import('../src/index');
  getGoogleSuggestions = (mod as any).default ?? (mod as any);
});

describe('getGoogleSuggestions', () => {
  bench('empty query (short-circuit)', async () => {
    await getGoogleSuggestions('');
  });

  bench('single-word query', async () => {
    await getGoogleSuggestions('nodejs');
  });

  bench('multi-word query', async () => {
    await getGoogleSuggestions('how to write a benchmark in typescript');
  });
});
