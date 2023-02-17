import { pseudoRandomBetween } from "./../utils/pseudoeRandomBetween";

export default function Plants({ ctx, canvas, prng }) {
  const originalCanvasWidth = 2048;
  const originalCanvasHeight = 2048;

  console.log(fxhash)

  const colors = generatePalette(prng.next(), 12);
  const [
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color7,
    colorStem,
    colorGrass,
    colorSky,
    colorGround,
    colorSun,
  ] = colors;

  // Global
  const saturation = pseudoRandomBetween(prng.next(), 0.5, 2.0, false);

  // Sun
  const sunRadius = pseudoRandomBetween(prng.next(), 350, 600, false);
  const sunX = pseudoRandomBetween(prng.next(), 0, 1, false);

  // Ground
  const groundHeight = pseudoRandomBetween(prng.next(), 0.01, 0.1, false);

  const randomValues = [prng.next(), prng.next(), prng.next()];

  const plants = [
  ];

  // Plants
  const plantsAmount = 75;
  const plantsSpace = pseudoRandomBetween(prng.next(), 0.05, 0.1, false)

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
    leafPosition: 0.65,
    centerRadius: 0,
    centerMaxRadius: 0,
    centerColor: color1,
    centerGrowthSpeed: 0,
    centerRadiusFinal: 0,
    petalColor: color2,
    petalAmount: 0,
    petalRadius: 0,
    petalMaxRadius: 0,
    petalAngle: Math.PI / 1.5,
    petalGrowthSpeed: 0.25,
    petalOperation: randomValues[0],
  };

  for (let i = 0; i < plantsAmount; i++) {
    addPlant(plants, plantsSpace, 1.0 - groundHeight)
  }

  // TODO: Maybe make it super simple, only on y = 1.0, no depth
  // add a method to let the plants vanish and regrow, the sun is actually moving
  // not do this for fxpreview, just when you have it open
  // infinite garden, will regrow the same plants over and over

  // Sort the plants by y so that plants in the front
  // are also drawn before the plants in the back
  //plants.sort((a, b) => a.y - b.y);

  // TODO: This is not working yet because of collision problems
  for (let i = 0; i < plantsAmount; i++) {
    addPlant(plants, plantsSpace, 1.0)
  }

  function addPlant(plants, minSpace, y) {
    let plantCollides = false;

    const newPlant = {...basicPlant};
    newPlant.x = pseudoRandomBetween(prng.next(), 0.05, 0.95, false)

    // TODO: Maybe it makes more sense to put them all at the same y
    // and when the plants all exists, iterate over the array and
    // move them accordingly AND then change the colors

    // newPlant.y = pseudoRandomBetween(prng.next(), 1.0 - groundHeight, 1.0, false)

    newPlant.y = y

    for (let i = 0; i < plants.length; i++) {
      let existingPlant = plants[i];
      let xDifference = Math.abs(existingPlant.x - newPlant.x);
      let yDifference = Math.abs(existingPlant.y - newPlant.y);

      if (xDifference < minSpace) {
        plantCollides = true;
        break;
      }
    }

    if (!plantCollides) {
      const [centerColor, petalColor] = getRandomColors([color1, color2, color3, color4, color5, color6])

      newPlant.startTime = pseudoRandomBetween(prng.next(), 0, 2000, false)

      if (newPlant.y < .96) {
        newPlant.stemWidth = pseudoRandomBetween(prng.next(), 5, 10)
        newPlant.stemMaxHeight = pseudoRandomBetween(prng.next(), 0.5, 0.75, false)

        newPlant.centerMaxRadius = pseudoRandomBetween(prng.next(), 20, 40)
        newPlant.petalMaxRadius = pseudoRandomBetween(prng.next(), 10, 20)

        newPlant.stemColor = changeSaturation(colorStem, pseudoRandomBetween(prng.next(), 20, 30))
        newPlant.centerColor = changeSaturation(centerColor, pseudoRandomBetween(prng.next(), 20, 30))
        newPlant.petalColor = changeSaturation(petalColor, pseudoRandomBetween(prng.next(), 20, 30))
      } else {
        newPlant.stemWidth = pseudoRandomBetween(prng.next(), 20, 25)
        newPlant.stemMaxHeight = pseudoRandomBetween(prng.next(), 0.1, 0.5, false)

        newPlant.centerMaxRadius = pseudoRandomBetween(prng.next(), 50, 90)
        newPlant.petalMaxRadius = pseudoRandomBetween(prng.next(), 30, 50)

        newPlant.stemColor = changeSaturation(colorStem, pseudoRandomBetween(prng.next(), 50, 60))
        newPlant.centerColor = changeSaturation(centerColor, pseudoRandomBetween(prng.next(), 50, 60))
        newPlant.petalColor = changeSaturation(petalColor, pseudoRandomBetween(prng.next(), 50, 60))
      }

      newPlant.stemGrowthSpeed = pseudoRandomBetween(prng.next(), 0.1, 0.5, false)
      newPlant.leafSize = pseudoRandomBetween(prng.next(), newPlant.stemWidth + 20, newPlant.stemWidth + 50)

      newPlant.centerGrowthSpeed = pseudoRandomBetween(prng.next(), 0.05, 0.25, false)

      newPlant.petalAmount = pseudoRandomBetween(prng.next(), 3, 15)
      newPlant.petalAngle = degToRad(pseudoRandomBetween(prng.next(), 0, 180))

      plants.push(newPlant);
    }
  }

  function animate(currentTime) {
    let delta = currentTime - previousTime;
    previousTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground({ colorGrass, colorGround, colorSky, groundHeight });
    drawSun({ x: sunX, y: 0, radius: sunRadius, colorSun });

    ctx.globalAlpha = 1;
    for (const plant of plants) {
      if (currentTime >= plant.startTime) {
        let reachedMaxHeight = drawStem(plant, delta);

        if (reachedMaxHeight) {
          ctx.globalAlpha = 0.75;
          drawCirclePetals(plant, delta);
          ctx.globalAlpha = 1;
          drawCenter(plant, delta);
        }
      }
    }
    ctx.globalAlpha = 1;

    saturationFilter(saturation)

    requestAnimationFrame(animate);
  }

  function drawBackground({
    groundHeight = 0.05,
    colorGrass = "lightgreen",
    colorSky = "lightblue",
    colorGround = "#8B4513",
  }) {
    let gradient = ctx.createLinearGradient(
      0,
      canvas.height * (1 - groundHeight),
      0,
      0
    );
    gradient.addColorStop(0, colorGrass); // grass
    gradient.addColorStop(1, colorSky); // sky
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * (1 - groundHeight));

    ctx.fillStyle = colorGround; // ground
    ctx.fillRect(
      0,
      canvas.height * (1 - groundHeight),
      canvas.width,
      canvas.height * groundHeight
    );

    saturationFilter(.25)
  }

  function drawStem(plant, delta) {
    ctx.fillStyle = plant.stemColor || "rgba(255, 255, 255, .25)";
    let stemWidth = (plant.stemWidth / originalCanvasWidth) * canvas.width;
    let stemHeight = (plant.stemHeight / originalCanvasHeight) * canvas.height;
    ctx.fillRect(
      plant.x * canvas.width - stemWidth / 2,
      plant.y * canvas.height - stemHeight,
      stemWidth,
      stemHeight
    );

    let leafY = plant.y * canvas.height - stemHeight * (1 - plant.leafPosition);
    let leafSize = (plant.leafSize / originalCanvasWidth) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(plant.x * canvas.width, leafY);
    ctx.lineTo(plant.x * canvas.width - leafSize, leafY - leafSize / 2);
    ctx.lineTo(plant.x * canvas.width + leafSize, leafY - leafSize / 2);
    ctx.fill();

    if (
      stemHeight <
      ((plant.stemMaxHeight * originalCanvasHeight) / originalCanvasWidth) *
        canvas.width
    ) {
      plant.stemHeight += plant.stemGrowthSpeed * delta;
      return false;
    }

    plant.stemHeightFinal = stemHeight;

    return true;
  }

  function drawCenter(plant, delta) {
    ctx.fillStyle = plant.centerColor || "yellow";
    let radiusFinal = (plant.centerRadius / originalCanvasWidth) * canvas.width;

    ctx.beginPath();
    ctx.arc(
      plant.x * canvas.width,
      plant.y * canvas.height - plant.stemHeightFinal,
      radiusFinal,
      0,
      2 * Math.PI
    );
    ctx.fill();

    if (plant.centerRadius < plant.centerMaxRadius) {
      plant.centerRadius += plant.centerGrowthSpeed * delta;
    }

    plant.centerRadiusFinal = radiusFinal;
  }

  function drawCirclePetals(plant, delta) {
    let operation = "multiply";

    // TODO: Fix this so it looks better
    if (plant.petalAmount >= 8) {
      operation = "xor";
    } else {
      if (plant.petalOperation > 0.5) {
        operation = "color-burn";
      }
    }

    operation = "multiply"

    ctx.globalCompositeOperation = operation;
    ctx.fillStyle = plant.petalColor || "pink";

    let radiusFinal = (plant.petalRadius / originalCanvasWidth) * canvas.width;

    for (let i = 0; i < plant.petalAmount; i++) {
      ctx.beginPath();
      ctx.arc(
        plant.x * canvas.width +
          (radiusFinal + plant.centerRadiusFinal / 2) *
            Math.cos(
              plant.petalAngle + (i * Math.PI) / (plant.petalAmount / 2)
            ),
        plant.y * canvas.height -
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

  function drawSun({ x, y, radius, colorSun = "yellow" }) {
    const radiusFinal = (radius / originalCanvasWidth) * canvas.width;

    ctx.fillStyle = colorSun;
    ctx.beginPath();
    ctx.arc(x * canvas.width, y * canvas.height, radiusFinal, 0, 2 * Math.PI);
    ctx.fill();
  }

  function generatePalette(seed, numColors) {
    let palette = [];
    let hue = 360 * seed;

    for (let i = 0; i < numColors; i++) {
      palette.push(`hsl(${(hue + (i * 360) / numColors) % 360}, 80%, 60%)`);
    }

    return palette;
  }

  function saturationFilter(saturation) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      let gray = (r + g + b) / 3;
      data[i] = gray + (r - gray) * saturation;
      data[i + 1] = gray + (g - gray) * saturation;
      data[i + 2] = gray + (b - gray) * saturation;
    }

    ctx.putImageData(imageData, 0, 0);

  }

  function getRandomColors(colors) {
    let color1 = colors[Math.floor(prng.next() * colors.length)];
    let color2 = colors[Math.floor(prng.next() * colors.length)];

    while (color1 === color2) {
      color2 = colors[Math.floor(prng.next() * colors.length)];
    }

    return [color1, color2];
  }

  function changeSaturation(hslColor, saturationPercent) {
    const [hue, saturation, lightness] = hslColor
      .match(/hsl\(\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/)
      .slice(1)
      .map(Number);

    return `hsl(${hue}, ${saturationPercent}%, ${lightness}%)`;
  }

  function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }


  let previousTime = 0;

  requestAnimationFrame(animate);
}