export const inRange = (params) => {
  const { ranges, currentValue } = params;
  let returnValue = "";

  ranges.every((range) => {
    const value = Object.keys(range)[0];
    const min = range[value][0];
    const max = range[value][1];

    if (currentValue >= min && currentValue <= max) {
      returnValue = value;
      return false;
    }

    return true;
  });

  return returnValue;
};
