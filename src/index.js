/**
 * @license
 * nd-genuary32nd-plants-chatgpt3-001 by NERDDISCO
 * MIT 2023 NERDDISCO
 * https://nerddis.co/nd-genuary32nd-plants-chatgpt3-001
 */
import { Base } from "./molecules/Base";
import { PRNG } from "./utils/PRNG";
import Plants from "./atoms/plants";

const prng = new PRNG();
const base = new Base({});
const { canvas, ctx } = base;

const size = 0.1;

Plants({ ctx, canvas, prng });

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
