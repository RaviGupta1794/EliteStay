const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const intiData = require("./data.js");

const Mongo_Url = "mongodb://localhost:27017/WanderStay";


main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

async function main() {
  await mongoose.connect(Mongo_Url);
}

const seedDB = async () => {
  await Listing.deleteMany({});
  intiData.data =intiData.data = intiData.data.map((obj) => ({
    ...obj,
    owner: "6a0c5de4c6383a47b5ab198b"
  }));
  await Listing.insertMany(intiData.data);
  console.log("Database seeded successfully");
}
seedDB();