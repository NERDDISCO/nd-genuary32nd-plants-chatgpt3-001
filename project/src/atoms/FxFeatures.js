import { inRange } from "../utils/inRange";

export function FxFeatures(props) {
  const { plants, redrawInMs, plantsAmount, environment } = props;

  let specialPlantsAmount = 0;

  for (let i = 0; i < plants.length; i++) {
    specialPlantsAmount += plants[i].isSpecial ? 1 : 0;
  }

  // prettier-ignore
  const firstRedraw = inRange({
    currentValue: redrawInMs,
    ranges: [
      { tarantula:                                   [0, 250] },       // Pendulum - Tarantula
      { itsATrap:                                    [250, 1000] },    // Star Wars
      { schwifty:                                    [1000, 5000] },   // Rick & Morty
      { thisIsTheWay:                                [5000, 15000] },  // Star Wars: The Mandalorian
      { sAllGoodMan:                                 [15000, 20000] }, // Better Call Saul
      { theresAlwaysMoneyInTheBananaStand:           [20000, 25000] }, // Arrested Development
      { YouTurnYourselfAroundThatsWhatItsAllAbout:   [25000, 30000] }, // BoJack Horseman
      { dangerZone:                                  [30000, 40000] }, // Archer
      { goGodGo:                                     [40000, 42500] }, // South Park - Go God Go
      { whatsMyAgeAgain:                             [42500, 50000] }, // Blink-182 - What's My Age Again
      { sayMyName:                                   [50000, 55000] }, // Breaking Bad
      { winterIsComing:                              [55000, 59999] }, // Game of Thrones
      { weHaveDoneTheImpossibleAndThatMakesUsMighty: [59999, 60000] }  // Firefly
    ],
  });

  $fx.features({
    timeOfDay: environment,
    plantsAmount,
    specialPlantsAmount,
    firstRedraw,
  });

  return $fx.getFeatures();
}
