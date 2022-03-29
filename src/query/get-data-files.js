const fs = require("fs");
const asy = require("async");
const util = require("util");

module.exports = async (dataFolder) => {
  const data = [];
  await util.promisify(fs.readdir)(dataFolder, (error, files) => {
    if (error) {
      console.log(error);
      throw new Error("unable to read folder!;")
    }
    asy.mapLimit(
      files,
      10,
      async (file) => {
        const raw = await util.promisify(fs.readFile)(
          dataFolder + file,
          "utf-8"
        );
        const obj = JSON.parse(raw);
        const utilData = obj.exercises[0].samples;
        const filtered = {
          rota: utilData.recordedRoute,
          distancia: utilData.distance,
          velocidade: utilData.speed,
          cadence: utilData.cadence,
        };
        data.push({ [file]: filtered });
      },
      (erro) => {
        if (erro) {
          console.log("unable to read file in folder!;");
          return;
        }
      }
    );
  });
  return data;
};
