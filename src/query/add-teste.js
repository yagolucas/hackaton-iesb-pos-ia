const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://root:example@localhost:27017/";
const path = require("path");
const root = path.dirname(require.main.filename);
const fs = require("fs");
const util = require("util");
const asyncs = require("async");

const dataFolder = root + "/../../data/RUNNING/";

const addTeste = () => {
  const data = [];
  util.promisify(fs.readdir)(dataFolder, (error, files) => {
    if (error) {
      console.log(error);
      throw new Error("unable to read folder!;");
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

const client = new MongoClient(url);
const exec = async () => {
  try {
    const data = [];
    await client.connect();
    const db = client.db("admin");
    const collection = db.collection("hackaton");
    const raw = await util.promisify(fs.readFile)(
      dataFolder + "2015-06-21T15:26:00_000.json",
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
    const doc = {
      date: "2015-06-21T15:26:00.000",
      values: filtered,
    };
    const result = await collection.insertOne(doc);
    console.log('inserção')
  } catch (e) {
    console.log("não conectou!");
    console.log(e.message);
  } finally {
    client.close();
  }
};

exec();
