export const pseudoRandomBetween = (random, min, max, round = true) => {
  if (round) {
    return Math.floor(random * (max - min + 1) + min);
  } else {
    return random * (max - min) + min;
  }
};
