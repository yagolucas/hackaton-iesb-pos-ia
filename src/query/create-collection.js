require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWD}@localhost:27017/`;
const fs = require("fs");
const path = require("path");
const root = path.dirname(require.main.filename);
const asyncs = require("async");

const dataFolder = root + "/../../data/";

const client = new MongoClient(url);
const createCollections = async () => {
  try {
    await client.connect();
    fs.readdir(dataFolder, (err, files) => {
      if (err) {
        console.log("has error");
        client.close();
        return;
      }
      asyncs.mapLimit(
        files,
        10,
        async (file) => await client.db("admin").createCollection(file),
        () => client.close()
      );
    });
  } catch (e) {
    console.log("não conectou!");
    console.log(e.message);
    client.close();
  }
};

createCollections();
