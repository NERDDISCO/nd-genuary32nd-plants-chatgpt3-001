/**
 * @license
 * nd-genuary32nd-plants-chatgpt3-001 by NERDDISCO
 * MIT 2023 NERDDISCO
 * https://nerddis.co/nd-genuary32nd-plants-chatgpt3-001
 */
import { Base } from "./molecules/Base";
import { PRNG } from "./utils/PRNG";
import { pseudoRandomBetween } from "./utils/pseudoeRandomBetween";
import { FxHashFeatures } from "./atoms/FxHashFeatures";

import Plants from "./atoms/plants";

const prng = new PRNG();
const base = new Base({});
const { canvas, ctx } = base;

const amount = 365;
const size = 0.1;
const spaceX = 0.1;
const spaceY = size / 32;
const spaceZ = 0.1;
let rotationSpeed = 0.0075;
const envGradientColorStops = pseudoRandomBetween(prng.next(), 2, 20, true);
const rotationX = pseudoRandomBetween(prng.next(), -24, 24);
const rotationY = pseudoRandomBetween(prng.next(), -24, 24);
const rotationZ = pseudoRandomBetween(prng.next(), -24, 24);

// const colors = prng.list({ size: 365, unique: true, precision: 4 });
const positions = prng.list({ size: 365, unique: true, precision: 4 });
const rotations = prng.list({ size: 365, unique: true, precision: 4 });
const wireframes = prng.list({ size: 365, unique: true, precision: 4 });
const wrappings = prng.list({ size: 365, unique: true });
const wireframeThreshold = prng.next();

const wrappingRanges = [
  { dots: [0.0, 0.5] },
  { stripes: [0.5, 0.75] },
  { fxhash: [0.75, 1.0] },
];

Plants({ ctx, canvas, prng });

// const fxHashFeatures = new FxHashFeatures({
//   amount,
//   wrappings,
//   wrappingRanges,
//   wireframes,
//   wireframeThreshold,
//   envGradientColorStops,
//   // dawt,
//   rotationX,
//   rotationY,
//   rotationZ,
// });

/**
 * Animate
 */
const tick = () => {
  if (isFxpreview) {
  }

  window.requestAnimationFrame(tick);
};

// if (isFxpreview) {
//   setTimeout(() => {
//     // Take the screenshot for fxhash
//     fxpreview();
//   }, 15000);
// }

// Start the animation
tick();
