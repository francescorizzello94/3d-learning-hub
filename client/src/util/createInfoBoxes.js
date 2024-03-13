import * as THREE from "three";

export const createInfoBoxes = (infoArray, scene) => {
  const scale = 0.01;
  infoArray = infoArray.slice(0, 4);

  const horizontalDistance = 4;
  const verticalDistance = 2.5;

  const positions = [
    new THREE.Vector3(-horizontalDistance, verticalDistance, 0), // Top left
    new THREE.Vector3(-horizontalDistance, -verticalDistance, 0), // Bottom left
    new THREE.Vector3(horizontalDistance, verticalDistance, 0), // Top right
    new THREE.Vector3(horizontalDistance, -verticalDistance, 0), // Bottom right
  ];

  infoArray.forEach((infoContent, index) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    wrapText(
      context,
      infoContent,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width - 20,
      24
    );

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);

    sprite.position.copy(positions[index]);

    scene.add(sprite);
  });
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
