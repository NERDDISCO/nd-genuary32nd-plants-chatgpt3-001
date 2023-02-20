import { inRange } from "../utils/inRange";

export function fxHashFeatures(props) {
  const { plants, baseMs, redrawFactor, redrawInMs } = props;

  const plantMissing = "nothing here yet"

  window.$fxhashFeatures = {
    // name: "nd-genuary32nd-plants-chatgpt3-001",
    // artist: "NERDDISCO",
    // web: "nerddis.co/nd-genuary32nd-plants-chatgpt3-001",
    redrawInMs,
    plant1: plantMissing,
    plant2: plantMissing,
    plant3: plantMissing,
    plant4: plantMissing,
    plant6: plantMissing,
    plant7: plantMissing,
    plant8: plantMissing,
  };

  for (let i = 0; i < plants.length; i++) {
    window.$fxhashFeatures[`plant${i + 1}`] =
      plants[i] !== undefined ? "<3" : plantMissing;
  }
}
