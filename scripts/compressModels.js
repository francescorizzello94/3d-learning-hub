import { readdir, readFile, writeFile } from "fs";
import { extname, join } from "path";
import gltfPipeline from "gltf-pipeline";
const processGltf = gltfPipeline.processGltf;

const inputDir = "server\\static";
const outputDir = "server\\static_output";

readdir(inputDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (extname(file) === ".gltf" || extname(file) === ".glb") {
      const inputPath = join(inputDir, file);
      const outputPath = join(outputDir, file);

      const options = {
        dracoOptions: {
          compressionLevel: 10,
        },
      };

      readFile(inputPath, (err, data) => {
        if (err) throw err;

        processGltf(data, options)
          .then((result) => {
            writeFile(outputPath, result.gltf, (err) => {
              if (err) throw err;
            });
            console.log("Models compressed successfully");
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  });
});
