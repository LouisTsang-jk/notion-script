const { notion } = require("../index");

const getDataByDatabase = async (id) => {
  const data = await notion.databases.query({
    database_id: id,
  });
  return Promise.resolve(data.results);
};

const getConfigByDatabase = async (id) => {
  const data = await notion.databases.retrieve({
    database_id: id,
  });
  return Promise.resolve(data);
};

const getPropertiesDataByPage = async (pageId, propertyId) => {
  const data = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  });
  return Promise.resolve(data);
};

const updatePropertiesDataByPage = async (pageId, body) => {
  const data = await notion.pages.update({
    page_id: pageId,
    ...body
  });
  return Promise.resolve(data);
};

module.exports = {
  getDataByDatabase,
  getConfigByDatabase,
  getPropertiesDataByPage,
  updatePropertiesDataByPage,
};
