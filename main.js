const {
  getConfigByDatabase,
  getDataByDatabase,
  getPropertiesDataByPage,
  updatePropertiesDataByPage,
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
    // FIXME change api: query database
    movieList.push({
      ...(await getPropertiesDataByPage(id, propertyId)),
      pageId: id,
    });
  }
  // Parse HTML
  const { download } = await import("./src/parse/download.mjs");
  for (const movie of movieList) {
    movie.info = await parseHTML(await download(movie.url));
  }
  // Update Tags
  const existTags = databaseConfig.properties.Tags.multi_select.options.map(
    ({ name }) => name
  );
  const movieTags = movieList.reduce(
    (acc, { info }) => (acc = [...acc, ...info.tags]),
    []
  );
  const COLORS = [
    "default",
    "gray",
    "brown",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "red",
  ];
  const { updateConfigByDatabase } = await import("./src/query/index.mjs");
  await updateConfigByDatabase(DATABASE_ID, {
    properties: {
      Tags: {
        multi_select: {
          options: [...new Set([...existTags, ...movieTags])].map(
            (option, index) => ({
              name: option,
              color: COLORS[index % COLORS.length],
            })
          ),
        },
      },
    },
  });
  // Update Movie List
  for (const movie of movieList) {
    const { pageId, info } = movie;
    const { name, director, tags } = info
    await updatePropertiesDataByPage(pageId, {
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: {
                content: name
              }
            }
          ]
        },
        Director: {
          rich_text: [
            {
              type: "text",
              text: {
                content: director
              },
            },
          ],
        },
        Tags: {
          multi_select: tags.map(tag => ({ name: tag }))
        }
      },
    });
  }
})();
