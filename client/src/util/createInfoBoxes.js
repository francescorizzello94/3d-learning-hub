import * as THREE from "three";

export const createInfoBoxes = (infoArray, scene, camera) => {
  const scale = 0.01; // text size factor

  // distance between camera and info boxes
  const distanceFromCamera = 5;

  // box dimensions
  const boxWidth = 1;
  const boxHeight = 0.5;

  // calculate the position of the info boxes dynamically based on camera orientation
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  const cameraUp = new THREE.Vector3()
    .copy(camera.up)
    .multiplyScalar(boxHeight);
  const cameraRight = new THREE.Vector3()
    .crossVectors(cameraDirection, cameraUp)
    .normalize()
    .multiplyScalar(boxWidth);

  const positions = [
    camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(distanceFromCamera))
      .sub(cameraRight)
      .add(cameraUp), // Top left
    camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(distanceFromCamera))
      .sub(cameraRight)
      .sub(cameraUp), // Bottom left
    camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(distanceFromCamera))
      .add(cameraRight)
      .add(cameraUp), // Top right
    camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(distanceFromCamera))
      .add(cameraRight)
      .sub(cameraUp), // Bottom right
  ];

  // Limit the number of info boxes to the number of positions
  infoArray = infoArray.slice(0, positions.length);

  infoArray.forEach((infoContent, index) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = 1024;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "white";
    context.font = "24px Arial";
    context.textBaseline = "middle";
    context.textAlign = "center";

    // Draw the text in the middle of the canvas
    wrapText(
      context,
      infoContent,
      width / 2,
      height / 2,
      width - 40,
      28,
      canvas
    );

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create geometry that matches the aspect ratio of the canvas
    const planeGeometry = new THREE.PlaneGeometry(
      width * scale,
      height * scale
    );

    // Create a material with the canvas texture
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create the mesh and set its position
    const mesh = new THREE.Mesh(planeGeometry, material);
    mesh.position.copy(positions[index]);
    mesh.lookAt(camera.position);

    // Add the mesh to the scene
    scene.add(mesh);
  });
};

function wrapText(context, text, x, y, lineHeight, canvas) {
  const maxWidth = canvas.width;
  const words = text.split(" ");
  let line = "";
  let lines = [];
  let startY = y;

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + " ";
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, startY);
      line = words[n] + " ";
      startY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, startY);
  lines.push(line);

  return lines;
}
