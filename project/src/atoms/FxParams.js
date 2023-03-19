export function FxParams() {
  $fx.params([
    {
      id: "timeOfDay",
      name: "Time of Day",
      type: "select",
      default: "Sunny Noon",
      options: {
        options: ["Sunny Noon", "Rainbow Midnight"],
      },
    },
    {
      id: "backgroundSaturation",
      name: "Background Saturation %",
      type: "number",
      default: 18,
      options: {
        min: 10,
        max: 30,
        step: 1,
      },
    },
    {
      id: "plantsAmount",
      name: "Plants Amount",
      type: "number",
      options: {
        min: 1,
        max: 8,
        step: 1,
      },
    },
    {
      id: "flowerLightness",
      name: "Flower Lightness %",
      type: "number",
      default: 60,
      options: {
        min: 50,
        max: 90,
        step: 1,
      },
    },
  ]);
}
