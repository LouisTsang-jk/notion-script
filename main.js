const {
  getConfigByDatabase,
  getDataByDatabase,
  getPropertiesDataByPage,
} = require("./src/query/index");

const { parseHTML } = require("./src/parse/index");

const { DATABASE_ID } = process.env;
const TARGET_PROPERTY_NAME = "豆瓣";

(async () => {
  const databaseConfig = await getConfigByDatabase(DATABASE_ID);
  const propertyId = databaseConfig.properties[TARGET_PROPERTY_NAME].id;

  const databaseData = await getDataByDatabase(DATABASE_ID);
  // Get Movie List
  // Get Movie URL(豆瓣)
  const movieList = [];
  for (const { id } of databaseData) {
    movieList.push(await getPropertiesDataByPage(id, propertyId));
  }
  // console.log(JSON.stringify(movieList));
  // Parse XML
  const { download } = await import("./src/parse/download.mjs");
  const content = await download(movieList[1].url);
  parseHTML(content);
  // console.log(download())
  // Update Movie List
})();
