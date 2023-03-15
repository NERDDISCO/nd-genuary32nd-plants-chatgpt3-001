import {
  pseudoRandomBetween,
  pseudoRandomBetweenList,
} from "./../utils/pseudoeRandomBetween";
import { inRange } from "../utils/inRange";
import { fxHashFeatures } from "./FxHashFeatures";

export default function Plants({ ctx, canvas, prng }) {
  const originalCanvasWidth = 2048;
  const originalCanvasHeight = 2048;

  let rafId = null;
  let previousTime = 0;
  let baseMs = 0;
  let baseMsMax = 1000;
  let redrawFactor = 0;
  let redrawFactorMax = 50;
  let redrawInMs = 0;

  const colors = generatePalette(prng.next(), 14);
  let [
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color7,
    color8,
    color9,
    colorStem,
    colorGrass,
    colorSky,
    colorGround,
    colorSun,
  ] = colors;

  const saturation = pseudoRandomBetween(prng.next(), 18, 20);
  let lightness = pseudoRandomBetween(prng.next(), 25, 65);

  const environment = inRange({
    currentValue: lightness,
    ranges: [{ rainbowNight: [25, 26] }, { sunnyDay: [26, 65] }],
  });

  if (environment === "sunnyDay") {
    lightness = pseudoRandomBetween(prng.next(), 55, 65);
  }

  colorSun = changeHsl(colorSun, saturation, lightness);
  colorSky = changeHsl(colorSky, saturation, lightness);
  colorGrass = changeHsl(colorGrass, saturation, lightness);
  colorGround = changeHsl(colorGround, saturation, lightness);

  let colorsRainbow = undefined;

  if (environment === "rainbowNight") {
    colorsRainbow = generateRainbowColors(14);
    for (let i = 0; i < colorsRainbow.length; i++) {
      colorsRainbow[i] = changeHsl(colorsRainbow[i], saturation, lightness);
    }
  }

  // Sun
  const sunRadius = pseudoRandomBetween(prng.next(), 350, 500, false);
  const sunX = pseudoRandomBetween(prng.next(), 0, 1, false);

  // Ground
  const groundHeight = pseudoRandomBetween(prng.next(), 0.01, 0.1, false);

  // Plants
  let plants = [];
  const plantsAmount = pseudoRandomBetween(prng.next(), 1, 8, true);

  const petalAmountsMin = pseudoRandomBetween(prng.next(), 2, 4, true);
  const petalAmounts = pseudoRandomBetweenList(
    prng,
    plantsAmount,
    petalAmountsMin,
    plantsAmount + petalAmountsMin,
    true,
    true
  );

  const stemMaxHeightOverall = pseudoRandomBetween(
    prng.next(),
    0.45,
    0.65,
    false
  );
  const stemMaxHeights = pseudoRandomBetweenList(
    prng,
    plantsAmount,
    0.35,
    stemMaxHeightOverall,
    false,
    true,
    2,
    0.05
  );

  // Rolemodel of each plant
  const basicPlant = {
    x: 0.0,
    y: 1.0,
    startTime: 0,
    stemHeight: 0,
    stemWidth: 0,
    stemMaxHeight: 0,
    stemGrowthSpeed: 0,
    stemColor: colorStem,
    leafSize: 0,
    leafPosition: 0,
    centerRadius: 0,
    centerMaxRadius: 0,
    centerColor: color1,
    centerGrowthSpeed: 0,
    centerRadiusFinal: 0,
    petalAlpha: 0.75,
    petalColor: color2,
    petalAmount: 0,
    petalRadius: 0,
    petalMaxRadius: 0,
    petalAngle: 0,
    petalGrowthSpeed: 0,
    isSpecial: false,
  };

  // Spread the plants along x equally
  const positions = spreadPlants({ amount: plantsAmount });

  // Create all plants
  for (let i = 0; i < plantsAmount; i++) {
    addPlant({
      plants,
      y: 1.0 - groundHeight,
      x: positions[i].x,
      petalAmount: petalAmounts[i],
      petalAmountsMin,
      plantsAmount,
      stemMaxHeight: stemMaxHeights[i],
      isFirst: i === 0 && plantsAmount !== 2 && plantsAmount !== 3,
      isLast:
        i === plantsAmount - 1 && plantsAmount !== 2 && plantsAmount !== 3,
      isTheOne: plantsAmount === 1,
    });
  }

  // Sort plants by height, so that tall plants are in the front
  plants.sort((a, b) => {
    return a.stemMaxHeight - b.stemMaxHeight;
  });

  rafId = requestAnimationFrame(animate);

  console.log(fxhash);

  reset();

  // Create the features for fxhash
  fxHashFeatures({
    plants,
    redrawInMs,
    plantsAmount,
    environment,
  });
  console.log("$fxhashFeatures", window.$fxhashFeatures);

  // Redraw after redrawInMs if preview = 0
  if (!isFxpreview) {
    setTimeout(redraw, redrawInMs);

    // Don't redraw if preview = 1 and trigger fxpreview() to take a screenshot
  } else {
    setTimeout(() => {
      fxpreview();
    }, baseMsMax * redrawFactorMax + 1000);
  }

  // Run scene and draw everything
  function animate(currentTime) {
    let delta = currentTime - previousTime;
    previousTime = currentTime;

    // delta bug:
    // We leave the scene open, go somehwere else (leave the window open or turn off the screen while the artwork is still visible).
    // Once the users comes back and the artwork  is visible again,
    // detla is huge
    if (delta > 68) {
      // Trigger another frame to get a "normal" delta again
      rafId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground({
        colorGrass,
        colorGround,
        colorSky,
        groundHeight,
        colors: colorsRainbow,
      });
      drawSun({ x: sunX, y: 0, radius: sunRadius, colorSun });

      ctx.globalAlpha = 1;

      // Draw all plants
      for (const plant of plants) {
        if (currentTime >= plant.startTime) {
          drawStem(plant, delta);

          let reachedMaxHeight = plant.reachedMaxHeight || false;

          if (reachedMaxHeight) {
            plant.reachedMaxHeight = true;

            ctx.globalAlpha = plant.petalAlpha;
            drawCirclePetals(plant, delta);
            ctx.globalAlpha = 1;

            drawCenter(plant, delta);
          }
        }
      }

      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    }
  }

  // Spread the plants on the ground, so that they are equally apart from each other
  function spreadPlants({ amount }) {
    const data = [];
    const distance = 1.0 / amount;

    for (let i = 1; i <= amount; i++) {
      data.push({
        x: i * distance - distance / 2,
      });
    }

    return data;
  }

  // Generate a plant with random values
  function addPlant({
    plants,
    plantsAmount,
    x,
    y,
    petalAmount,
    petalAmountsMin,
    stemMaxHeight,
    isFirst,
    isLast,
    isTheOne,
  }) {
    const newPlant = { ...basicPlant };

    const [centerColor, petalColor] = getRandomColors([
      color1,
      color2,
      color3,
      color4,
      color5,
      color6,
      color7,
      color8,
    ]);

    newPlant.startTime = pseudoRandomBetween(prng.next(), 0, 2000, false);

    newPlant.stemWidth = pseudoRandomBetween(prng.next(), 20, 25);
    newPlant.stemMaxHeight = stemMaxHeight;

    newPlant.petalAmount = petalAmount;
    newPlant.petalAmountThreshold = plantsAmount + petalAmountsMin;

    let leafSizeFactor = 2.5;

    // Every plant in the middle
    if (!isFirst && !isLast) {
      newPlant.centerMaxRadius = pseudoRandomBetween(prng.next(), 90, 140);
      newPlant.petalMaxRadius = pseudoRandomBetween(prng.next(), 100, 120);

      newPlant.petalAmount = pseudoRandomBetween(
        prng.next(),
        petalAmountsMin,
        plantsAmount + petalAmountsMin
      );

      // Plants very close to the edges
    } else if ((isFirst || isLast) && !isTheOne) {
      newPlant.centerMaxRadius = pseudoRandomBetween(prng.next(), 35, 45);
      newPlant.petalMaxRadius = pseudoRandomBetween(prng.next(), 35, 45);

      newPlant.stemMaxHeight = pseudoRandomBetween(
        prng.next(),
        0.2,
        0.3,
        false
      );

      leafSizeFactor = 1.0;

      // Only one plant exists
    } else if (isTheOne) {
      newPlant.centerMaxRadius = pseudoRandomBetween(prng.next(), 150, 170);
      newPlant.petalMaxRadius = pseudoRandomBetween(prng.next(), 150, 160);

      newPlant.stemMaxHeight = pseudoRandomBetween(
        prng.next(),
        0.4,
        stemMaxHeightOverall,
        false
      );

      newPlant.petalAmount = pseudoRandomBetween(
        prng.next(),
        petalAmountsMin,
        plantsAmount + petalAmountsMin
      );

      // Don't use the threshold when we only have one plant
      newPlant.petalAmountThreshold = 100;
    }

    newPlant.stemColor = changeHsl(
      colorStem,
      pseudoRandomBetween(prng.next(), 30, 40),
      pseudoRandomBetween(prng.next(), 40, 50)
    );
    newPlant.centerColor = changeHsl(
      centerColor,
      pseudoRandomBetween(prng.next(), 60, 80)
    );
    newPlant.petalColor = changeHsl(
      petalColor,
      pseudoRandomBetween(prng.next(), 90, 100)
    );

    newPlant.stemGrowthSpeed = pseudoRandomBetween(
      prng.next(),
      0.1,
      0.5,
      false
    );
    newPlant.centerGrowthSpeed = pseudoRandomBetween(
      prng.next(),
      0.05,
      0.075,
      false
    );

    newPlant.petalGrowthSpeed = pseudoRandomBetween(
      prng.next(),
      0.0125,
      0.025,
      false
    );

    newPlant.leafPosition = pseudoRandomBetween(prng.next(), 0.65, 1, false);

    newPlant.leafSize = pseudoRandomBetween(
      prng.next(),
      newPlant.stemWidth + 20 * leafSizeFactor,
      newPlant.stemWidth + 50 * leafSizeFactor
    );

    newPlant.petalAngle = degToRad(pseudoRandomBetween(prng.next(), 0, 180));

    newPlant.operation = "source-over";

    // Some plants are special, as they have more petals than others
    if (newPlant.petalAmount >= newPlant.petalAmountThreshold) {
      newPlant.operation = "screen";
      newPlant.isSpecial = true;
    }

    // During the night, every plant is special
    if (environment === "rainbowNight") {
      const operation = Math.round(
        pseudoRandomBetween(prng.next(), 0, 1, false)
      );
      newPlant.operation = operation === 0 ? "overlay" : "difference";

      newPlant.stemColor = changeHsl(
        newPlant.stemColor,
        55,
        pseudoRandomBetween(prng.next(), 10, 20)
      );

      newPlant.isSpecial = true;
    }

    newPlant.y = y;
    newPlant.x = x;

    plants.push(newPlant);
  }

  // Draw the linear-gradient background (sky) + the ground
  function drawBackground({
    groundHeight = 0.05,
    colorGrass = "lightgreen",
    colorSky = "lightblue",
    colorGround = "#8B4513",
    colors = undefined,
  }) {
    let gradient = ctx.createLinearGradient(
      0,
      canvas.height * (1.0 - groundHeight),
      0,
      0
    );

    // Special gradient based on multiple colors
    if (colors !== undefined) {
      for (let i = 0; i < colors.length; i++) {
        gradient.addColorStop(i / (colors.length - 1), colors[i]);
      }
      // Basic gradient that consits of two colors
    } else {
      gradient.addColorStop(0, colorGrass); // grass
      gradient.addColorStop(1, colorSky); // sky
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * (1.05 - groundHeight));

    ctx.fillStyle = colorGround; // ground
    ctx.fillRect(
      0,
      canvas.height * (1 - groundHeight),
      canvas.width,
      canvas.height * groundHeight
    );
  }

  // Draw the stem for a given plant
  function drawStem(plant, delta) {
    ctx.fillStyle = plant.stemColor || "rgba(255, 255, 255, .25)";
    let stemWidth = (plant.stemWidth / originalCanvasWidth) * canvas.width;
    let stemHeight = (plant.stemHeight / originalCanvasHeight) * canvas.height;

    ctx.fillRect(
      parseInt(plant.x * canvas.width - stemWidth / 2),
      plant.y * canvas.height - stemHeight,
      parseInt(stemWidth),
      stemHeight
    );

    let leafY = plant.y * canvas.height - stemHeight * (1 - plant.leafPosition);
    let leafSize = (plant.leafSize / originalCanvasWidth) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(parseInt(plant.x * canvas.width), leafY);
    ctx.lineTo(
      parseInt(plant.x * canvas.width) - leafSize,
      leafY - leafSize / 2
    );
    ctx.lineTo(
      parseInt(plant.x * canvas.width) + leafSize,
      leafY - leafSize / 2
    );
    ctx.fill();

    if (
      stemHeight <
        ((plant.stemMaxHeight * originalCanvasHeight) / originalCanvasWidth) *
          canvas.height &&
      !plant.reachedMaxHeight
    ) {
      plant.stemHeight += plant.stemGrowthSpeed * delta;
    } else {
      plant.reachedMaxHeight = true;
    }

    plant.stemHeightFinal = stemHeight;
  }

  // Draw the center (circle) for a given plant
  function drawCenter(plant, delta) {
    ctx.fillStyle = plant.centerColor || "yellow";
    // ctx.globalCompositeOperation = plant.operation;
    let radiusFinal = (plant.centerRadius / originalCanvasWidth) * canvas.width;

    ctx.beginPath();
    ctx.arc(
      parseInt(plant.x * canvas.width),
      parseInt(plant.y * canvas.height) - plant.stemHeightFinal,
      radiusFinal,
      0,
      2 * Math.PI
    );
    ctx.fill();

    if (plant.centerRadius < plant.centerMaxRadius) {
      plant.centerRadius += plant.centerGrowthSpeed * delta;
    }

    plant.centerRadiusFinal = radiusFinal;
    ctx.globalCompositeOperation = "source-over";
  }

  // Draw the petals for a given plant
  function drawCirclePetals(plant, delta) {
    ctx.globalCompositeOperation = plant.operation;
    ctx.fillStyle = plant.petalColor || "pink";

    if (plant.isSpecial) {
      ctx.globalAlpha = 1;
    }

    let radiusFinal = (plant.petalRadius / originalCanvasWidth) * canvas.width;

    for (let i = 0; i < plant.petalAmount; i++) {
      ctx.beginPath();
      ctx.arc(
        parseInt(plant.x * canvas.width) +
          (radiusFinal + plant.centerRadiusFinal / 2) *
            Math.cos(
              plant.petalAngle + (i * Math.PI) / (plant.petalAmount / 2)
            ),
        parseInt(plant.y * canvas.height) -
          plant.stemHeightFinal +
          (radiusFinal + plant.centerRadiusFinal / 2) *
            Math.sin(
              plant.petalAngle + (i * Math.PI) / (plant.petalAmount / 2)
            ),
        radiusFinal,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    if (plant.petalRadius < plant.petalMaxRadius) {
      plant.petalRadius += plant.petalGrowthSpeed * delta;
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // Draw the sun in the top 25% of the canvas
  function drawSun({ x, y, radius, colorSun = "yellow" }) {
    const radiusFinal = (radius / originalCanvasWidth) * canvas.width;

    ctx.fillStyle = colorSun;
    ctx.beginPath();
    ctx.arc(x * canvas.width, y * canvas.height, radiusFinal, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Generate a balanced color palette with colors that are equally apart from
  // each other
  function generatePalette(seed, numColors) {
    let palette = [];
    let hue = 360 * seed;

    for (let i = 0; i < numColors; i++) {
      palette.push(`hsl(${(hue + (i * 360) / numColors) % 360}, 80%, 60%)`);
    }

    return palette;
  }

  // Extract two colors from an array of colors and make sure
  // that they are not the same
  function getRandomColors(colors) {
    let color1 = colors[Math.floor(prng.next() * colors.length)];
    let color2 = colors[Math.floor(prng.next() * colors.length)];

    while (color1 === color2) {
      color2 = colors[Math.floor(prng.next() * colors.length)];
    }

    return [color2, color1];
  }

  // Generate an array of colors that look like a rainbow
  function generateRainbowColors(numColors) {
    const hueStep = 360 / numColors;
    let hue = 0;
    const saturation = 100;
    const lightness = 50;
    const colors = [];

    for (let i = 0; i < numColors; i++) {
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      hue += hueStep;
    }

    return colors;
  }

  // Change the saturation and/or lightness of a given HSL color
  function changeHsl(
    hslColor,
    saturationPercent,
    lightnessPercent = undefined
  ) {
    let [hue, saturation, lightness] = hslColor
      .match(/hsl\(\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/)
      .slice(1)
      .map(Number);

    if (lightnessPercent !== undefined) {
      lightness = lightnessPercent;
    }

    return `hsl(${hue}, ${saturationPercent}%, ${lightness}%)`;
  }

  // Convert degrees to radians
  function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Reset the redrawInMs variable
  function reset() {
    baseMs = pseudoRandomBetween(prng.next(), 25, baseMsMax, true);

    redrawFactor = pseudoRandomBetween(
      prng.next(),
      0.05,
      redrawFactorMax,
      true
    );

    // When reset is called the first time, redrawInMs has no generated value yet,
    // that's why it DOES make sense to call it after rAF and before fxFeatures ;)
    redrawInMs = Math.floor(baseMs * redrawFactor);

    console.log(`redraw in ${redrawInMs}ms`);
  }

  // Redraw the whole scene and make sure that the plants are
  // growing from the ground again
  function redraw() {
    window.cancelAnimationFrame(rafId);

    // Reset some of the plant parameters to enforce a redraw
    for (const plant of plants) {
      plant.reachedMaxHeight = false;
      plant.stemHeight = 0;
      plant.petalRadius = 0;
      plant.centerRadius = 0;

      // Random *growthSpeed
      plant.stemGrowthSpeed = pseudoRandomBetween(prng.next(), 0.1, 0.5, false);
      plant.centerGrowthSpeed = pseudoRandomBetween(
        prng.next(),
        0.05,
        0.075,
        false
      );
      plant.petalGrowthSpeed = pseudoRandomBetween(
        prng.next(),
        0.0125,
        0.025,
        false
      );
    }

    reset();

    rafId = requestAnimationFrame(animate);

    setTimeout(redraw, redrawInMs);
  }
}
