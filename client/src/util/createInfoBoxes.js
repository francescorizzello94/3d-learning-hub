import * as THREE from "three";

export const createInfoBoxes = (infoArray, scene, camera) => {
  const scale = 0.01;
  const horizontalOffset = 5;
  const verticalOffset = 2;

  const positions = [
    new THREE.Vector3(-horizontalOffset, verticalOffset, 0),
    new THREE.Vector3(-horizontalOffset, -verticalOffset, 0),
    new THREE.Vector3(horizontalOffset, verticalOffset, 0),
    new THREE.Vector3(horizontalOffset, -verticalOffset, 0),
  ];

  if (infoArray.length > positions.length) {
    infoArray = infoArray.slice(0, positions.length);
  }

  infoArray.forEach((infoContent, index) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = "#fff";
    context.font = "20px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    wrapText(
      context,
      infoContent,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width - 20,
      20
    );

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(
      canvas.width * scale,
      canvas.height * scale
    );

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(positions[index]);

    mesh.lookAt(camera.position);

    scene.add(mesh);
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
