const CHANCE = .3;

export const generateRandomValue = (min: number, max: number, numAfterDigit = 0) =>
  Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));

export const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];

export const getRandomItems = <T>(items: T[]): T[] => (items.filter(() => Math.random() < CHANCE) || getRandomItem(items));
