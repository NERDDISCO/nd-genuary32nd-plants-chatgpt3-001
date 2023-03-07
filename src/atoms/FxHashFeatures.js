import { inRange } from "../utils/inRange";

export function fxHashFeatures(props) {
  const { plants, redrawInMs, plantsAmount, environment } = props;

  let specialPlantsAmount = 0;

  for (let i = 0; i < plants.length; i++) {
    specialPlantsAmount += plants[i].isSpecial ? 1 : 0
  }

  const firstRedraw = inRange({
    currentValue: redrawInMs,
    ranges: [
      { fast: [0, 5000] },
      { average: [5000, 15000] },
      { cozy: [15000, 60000] },
    ],
  });

  window.$fxhashFeatures = {
    plantsAmount,
    firstRedraw,
    specialPlantsAmount,
    environment
  };
}
