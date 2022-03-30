const fs = require("fs");
const path = require("path");
const root = path.dirname(require.main.filename);
const util = require("util");
const asyncs = require("async");

const readDir = () => {
  const pathToRead = root + "/../data/";
  fs.readdir(pathToRead, (err, filenames) => {
    if (err) {
      console.error(err);
      return;
    }
    filenames.forEach(async (filename) => {
      let obj = {};
      await fs.readdir(pathToRead + filename, (err, fl) => {
        if (err) {
          console.error(err);
          return;
        }
        asyncs.mapLimit(
          fl,
          10,
          async (fil) => {
            const raw = await util.promisify(fs.readFile)(
              pathToRead + filename + "/" + fil,
              "utf-8"
            );
            const val = JSON.parse(raw);
            obj[fil] = val;
          },
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            fs.writeFile(
              `${pathToRead + filename + "/"}/data.json`,
              JSON.stringify(obj, null, 2),
              (err) => {
                if (err) {
                  console.log("unable to create file " + filename);
                  console.error(err);
                }
              }
            );
          }
        );
      });
    });
  });
};

readDir();
