const fs = require("fs");
const path = require("path");
const root = path.dirname(require.main.filename);

const getExerciseType = (obj) => obj.exercises[0].sport;
const replaceDots = (text) => text.replace(/\./g, "_");

const createFolderForFile = (file) => {
  if (!fs.existsSync(`data/${getExerciseType(file)}`)) {
    fs.mkdirSync(`data/${getExerciseType(file)}`);
  }
};

const createSingleFile = (file) => {
  const homePath = root + "/../data/" + getExerciseType(file);
  fs.writeFile(
    `${homePath}/${replaceDots(file.startTime)}.json`,
    JSON.stringify(file, null, 2),
    (err) => {
      if (err) {
        console.log("unable to create file " + file.startTime);
        console.error(err);
      }
    }
  );
};

const readSingleFile = (filePath, filename) => {
  let obj;
  fs.readFile(filePath + filename, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      obj = JSON.parse(data);
      createFolderForFile(obj);
      createSingleFile(obj);
    } catch (e) {
      console.error(e);
    }
  });
  return obj;
};

const readDir = () => {
  const pathToRead = __dirname + "/../dataset/";
  fs.readdir(pathToRead, (err, filenames) => {
    if (err) {
      console.error(err);
      return;
    }
    filenames.forEach((filename) => {
      readSingleFile(pathToRead, filename);
    });
  });
};

const main = async () => {
  await readDir();
};

main();
