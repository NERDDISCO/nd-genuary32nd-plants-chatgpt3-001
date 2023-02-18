export const pseudoRandomBetween = (random, min, max, round = true) => {
  if (round) {
    return Math.floor(random * (max - min + 1) + min);
  } else {
    return random * (max - min) + min;
  }
};

export const pseudoRandomBetweenList = (prng, size, min, max, round = true, unique = false, precision = null, distance = null) => {
  const values = []
  let iterations = 0

  for (let i = 0; i < size; i++) {
    iterations = 0
    let random = pseudoRandomBetween(prng.next(), min, max, round)

    if (precision !== null) {
      random = +random.toFixed(precision);
    }

    // The array should only contain unique values
    if (unique) {
      while (values.includes(random) || containsValueInRange(values, random, distance)) {
        random = pseudoRandomBetween(prng.next(), min, max, round)

        if (precision !== null) {
          random = +random.toFixed(precision);
        }

        iterations++

        if (iterations > 20) {
          console.log(random)
          iterations = 0
          break
        }
      }
    }

    values.push(random);
  }

  return values;
}

function containsValueInRange(list, value, min, precision = 2) {
  let listContainsValue = false

  for (let i = 0; i < list.length; i++) {
    let existingValue = list[i];
    let difference = Math.abs(existingValue - value);
    difference = +difference.toFixed(precision);

    if (difference <= min) {
      listContainsValue = true;
      break;
    }
  }

  return listContainsValue
}
