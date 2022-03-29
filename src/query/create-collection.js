const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://root:example@localhost:27017/";

const client = new MongoClient(url);
const exec = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    await client.db("admin").createCollection("hackaton");
    console.log("criou colection");
  } catch (e) {
    console.log("não conectou!");
    console.log(e.message);
  } finally {
    client.close();
  }
};

exec();
