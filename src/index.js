require("dotenv").config();
const { Client } = require("@notionhq/client");
const { AUTH } = process.env;

const notion = new Client({
  auth: AUTH,
});

module.exports = { notion };
