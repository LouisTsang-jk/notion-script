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
  for (const movie of movieList) {
    movie.info = await parseHTML(await download(movie.url));
  }
  console.log(JSON.stringify(movieList))
  // Update Tags
  const { updateConfigByDatabase } = await import('./src/query/index.mjs')
  const existTags = databaseConfig.properties.Tags.multi_select.options.map(({ name }) => name)
  const movieTags = movieList.reduce((acc, {info}) => acc = [...acc, ...info.tags], [])
  const COLORS = ['default', 'gray' , 'brown' , 'orange' , 'yellow' , 'green' , 'blue' , 'purple' , 'pink' , 'red' ]
  await updateConfigByDatabase(DATABASE_ID, {
    properties: {
      Tags: {
        multi_select: {
          options: [...new Set([...existTags, ...movieTags])].map((option, index) => ({
            name: option,
            color: COLORS[index % COLORS.length]
          }))
        }
      }
    }
  })
  // console.log(download())
  // Update Movie List
})();
