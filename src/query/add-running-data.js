require('dotenv').config();

const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWD}@localhost:27017/`;
const path = require("path");
const root = path.dirname(require.main.filename);
const fs = require("fs");
const util = require("util");
const asyncs = require("async");

const dataFolder = root + "/../../data/RUNNING/";

const client = new MongoClient(url);
const exec = async (colection) => {
  try {
    const data = [];
    await client.connect();
    const db = client.db("admin");
    const collection = db.collection(colection);

    fs.readdir(dataFolder, (err, files) => {
      if (err) {
        console.log("não conectei");
        client.close();
        return;
      }
      asyncs.mapLimit(
        files,
        10,
        async (file) => {
          const raw = await util.promisify(fs.readFile)(
            dataFolder + file,
            "utf-8"
          );
          const obj = JSON.parse(raw);
          const utilData = obj.exercises[0].samples;
          if (
            !(
              utilData.speed &&
              utilData.recordedRoute &&
              utilData.distance &&
              utilData.cadence
            )
          ) {
            return;
          }
          const filtered = {
            rota: utilData.recordedRoute,
            distancia: utilData.distance,
            velocidade: utilData.speed,
            cadence: utilData.cadence,
          };
          const doc = {
            date: file.replace("_", ".").replace(".json", ""),
            values: filtered,
          };
          data.push(doc);
        },
        async (err) => {
          if (err) {
            console.log(err);
          }
          if (data.length) {
            await collection.insertMany(data);
          }
          client.close();
        }
      );
    });
    console.log("inserção");
  } catch (e) {
    console.log("não conectou!");
    console.log(e.message);
    client.close();
  }
};

exec("RUNNING");
