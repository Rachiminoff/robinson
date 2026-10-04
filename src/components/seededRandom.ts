export const seededRandom = (seed: number): number => {
  const safeSeed = Math.abs(seed) + 0.1;
  const x = Math.sin(safeSeed * 127.1 + 311.7) * 43758.5453123;
  return Math.max(0, Math.min(1, x - Math.floor(x)));
};

/** Returns a deterministic floating-point value in the inclusive range. */
export const seededRandomBetween = (
  seed: number,
  min: number,
  max: number,
): number => {
  return min + seededRandom(seed) * (max - min);
};

/** Returns a deterministic integer between min and max, inclusive. */
export const seededRandomInt = (
  seed: number,
  min: number,
  max: number,
): number => {
  if (max < min) {
    throw new Error('seededRandomInt requires max >= min');
  }
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
};

export const randomItem = <T>(items: readonly T[], seed: number): T => {
  if (items.length === 0) {
    throw new Error('randomItem requires a non-empty array');
  }
  const index = Math.floor(seededRandom(seed) * items.length);
  return items[Math.min(index, items.length - 1)];
};
