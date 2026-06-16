const serverless = require("serverless-http");
const app = require("../app"); // your main file

module.exports = serverless(app);