import { createPiMemoryCurator } from '../src/providers/pi/memory-curator.ts';

export function createE2eCurators(
  input: { provider: string; model: string; apiKey: string },
  create: typeof createPiMemoryCurator = createPiMemoryCurator,
) {
  const shared = { provider: input.provider, apiKey: input.apiKey, lightest: true };
  return {
    memoryCurator: create(shared),
    classificationCurator: create(shared),
    onboardingCurator: create({ ...shared, model: input.model }),
  };
}
