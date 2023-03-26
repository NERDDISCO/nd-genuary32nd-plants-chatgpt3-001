import { inRange } from "../utils/inRange";

export function FxFeatures(props) {
  const { plants, redrawInMs, plantsAmount, environment, flowerLightness } =
    props;

  let specialPlantsAmount = 0;

  for (let i = 0; i < plants.length; i++) {
    specialPlantsAmount += plants[i].isSpecial ? 1 : 0;
  }

  // prettier-ignore
  const firstRedraw = inRange({
    currentValue: redrawInMs,
    ranges: [
      { "Tarantula":                                            [0, 250] },       // Pendulum - Tarantula
      { "It's a Trap":                                          [250, 1000] },    // Star Wars
      { "Schwifty":                                             [1000, 5000] },   // Rick & Morty
      { "This Is The Way":                                      [5000, 15000] },  // Star Wars: The Mandalorian
      { "s'All Good Man":                                       [15000, 20000] }, // Better Call Saul
      { "There's Always Money In The Banana Stand":             [20000, 25000] }, // Arrested Development
      { "You Turn Yourself Around, Thats What It's All About":  [25000, 30000] }, // BoJack Horseman
      { "Danger Zone":                                          [30000, 40000] }, // Archer
      { "Go God Go":                                            [40000, 42500] }, // South Park - Go God Go
      { "What's My Age Again":                                  [42500, 50000] }, // Blink-182 - What's My Age Again
      { "Say My Name":                                          [50000, 55000] }, // Breaking Bad
      { "winter Is Coming":                                     [55000, 59999] }, // Game of Thrones
      { "We Have Done The Impossible And That Makes Us Mighty": [59999, 60000] }  // Firefly
    ],
  });

  // prettier-ignore
  const _flowerLightness = inRange({
      currentValue: flowerLightness,
      ranges: [
        { "Nightmare Moon":     [10, 30] },
        { "Twilight Sparkle":   [30, 50] },
        { "Rarity":             [50, 70] },
        { "Princess Celestia":  [70, 90] },
      ],
    });

  $fx.features({
    "Time of Day": environment,
    "Plants Amount": plantsAmount,
    "Special Plants Amount": specialPlantsAmount,
    "Flower Lightness": _flowerLightness,
    "First Redraw": firstRedraw,
  });

  return $fx.getFeatures();
}
