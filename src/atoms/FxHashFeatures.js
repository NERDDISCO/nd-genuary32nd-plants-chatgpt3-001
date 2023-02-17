import { inRange } from "../utils/inRange";

export class FxHashFeatures {
  constructor({
    amount,
    wrappings,
    wrappingRanges,
    wireframes,
    wireframeThreshold,
    envGradientColorStops,
    // dawt,
    rotationX,
    rotationY,
    rotationZ,
  }) {
    const _wrappings = [];
    const _wireframes = [];

    for (let i = 0; i < amount; i++) {
      const wrapping = inRange({
        currentValue: wrappings[i],
        ranges: wrappingRanges,
      });

      _wrappings.push(wrapping);

      _wireframes.push(wireframes[i] < wireframeThreshold);
    }

    const amountDots = _wrappings.filter((x) => x === "dots").length;
    const amountStripes = _wrappings.filter((x) => x === "stripes").length;
    const amountFxHash = _wrappings.filter((x) => x === "fxhash").length;
    const amountWireframes = _wireframes.filter((x) => x === true).length;

    window.$fxhashFeatures = {
      name: "nd-fxhashturnsone-001",
      // artist: "NERDDISCO",
      // web: "nerddis.co/nd-fxhashturnsone-001",
      hash: fxhash,
      rotationX,
      rotationY,
      rotationZ,
      wrappedInDots: amountDots,
      wrappedInStripes: amountStripes,
      wrappedInFxHash: amountFxHash,
      wireframes: amountWireframes,
      environment: inRange({
        currentValue: envGradientColorStops,
        ranges: [
          { simple: [2, 5] },
          { colorful: [6, 15] },
          { letsParty: [16, 20] },
        ],
      }),
      // ...dawt.globalParameters,
    };
  }
}
