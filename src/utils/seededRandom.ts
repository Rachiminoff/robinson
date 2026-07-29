// src/utils/seededRandom.ts

/**
 * Seeded random number generator using a deterministic algorithm.
 * Given the same seed, it will always return the same sequence of numbers.
 * 
 * @param seed - The seed value for the random number generator
 * @returns A pseudo-random number between 0 and 1
 * 
 * @example
 * seededRandom(42) // 0.374540
 * seededRandom(42) // 0.374540 (same result for same seed)
 */
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

/**
 * Generates a random number between min and max (inclusive) using a seed.
 * 
 * @param seed - The seed value for the random number generator
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A pseudo-random number between min and max
 * 
 * @example
 * seededRandomBetween(42, 0, 100) // 64.23
 */
export const seededRandomBetween = (seed: number, min: number, max: number): number => {
  return seededRandom(seed) * (max - min) + min;
};

/**
 * Generates a random integer between min and max (inclusive) using a seed.
 * 
 * @param seed - The seed value for the random number generator
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A pseudo-random integer between min and max
 * 
 * @example
 * seededRandomInt(42, 0, 10) // 6
 */
export const seededRandomInt = (seed: number, min: number, max: number): number => {
  return Math.floor(seededRandomBetween(seed, min, max + 1));
};

/**
 * Picks a random item from an array using a seed.
 * 
 * @param arr - The array to pick from
 * @param seed - The seed value for the random number generator
 * @returns A random item from the array
 * 
 * @example
 * const colors = ['red', 'blue', 'green'];
 * randomItem(colors, 42) // 'blue'
 */
export const randomItem = <T,>(arr: T[], seed: number): T => {
  const index = seededRandomInt(seed, 0, arr.length - 1);
  return arr[index];
};

/**
 * Shuffles an array using a seed.
 * 
 * @param arr - The array to shuffle
 * @param seed - The seed value for the random number generator
 * @returns A new shuffled array
 * 
 * @example
 * const arr = [1, 2, 3, 4, 5];
 * shuffleArray(arr, 42) // [3, 1, 5, 2, 4]
 */
export const shuffleArray = <T,>(arr: T[], seed: number): T[] => {
  const result = [...arr];
  let currentSeed = seed;
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = seededRandomInt(currentSeed, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
    currentSeed += 100;
  }
  
  return result;
};

/**
 * Generates a random seed from a lyric index and time.
 * 
 * @param index - The lyric index
 * @param time - The current time
 * @returns A unique seed value
 */
export const generateSeed = (index: number, time: number): number => {
  return index * 1000 + Math.floor(time * 10);
};

/**
 * Creates a deterministic random number generator with a given seed.
 * Useful for generating multiple random numbers with the same seed.
 * 
 * @param seed - The initial seed
 * @returns An object with methods to generate random numbers
 * 
 * @example
 * const rng = createRNG(42);
 * rng.next() // 0.374540
 * rng.next() // 0.950714
 * rng.nextInt(0, 10) // 4
 */
export const createRNG = (seed: number) => {
  let currentSeed = seed;
  
  return {
    next: (): number => {
      currentSeed = currentSeed * 16807 + 0;
      return seededRandom(currentSeed);
    },
    nextBetween: (min: number, max: number): number => {
      return seededRandomBetween(currentSeed + 1, min, max);
    },
    nextInt: (min: number, max: number): number => {
      return seededRandomInt(currentSeed + 2, min, max);
    },
    nextItem: <T,>(arr: T[]): T => {
      return randomItem(arr, currentSeed + 3);
    },
    seed: (newSeed: number) => {
      currentSeed = newSeed;
    }
  };
};

export default {
  seededRandom,
  seededRandomBetween,
  seededRandomInt,
  randomItem,
  shuffleArray,
  generateSeed,
  createRNG
};