/**
 * @license
 * nd-genuary32nd-plants-chatgpt3-001 by NERDDISCO
 * AGPL-v3 2023 NERDDISCO
 * https://nerddis.co/nd-genuary32nd-plants-chatgpt3-001
 */
import { Base } from "./molecules/Base";
import { PRNG } from "./utils/PRNG";
import Plants from "./atoms/plants";

const prng = new PRNG();
const base = new Base({});
const { canvas, ctx } = base;

Plants({ ctx, canvas, prng });

/**
 * Animate
 */
const tick = () => {
  window.requestAnimationFrame(tick);
};

// Start the animation
tick();
