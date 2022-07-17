import fetch from "node-fetch";
const { AUTH } = process.env;

const fetchHeaders = {
  Accept: "application/json",
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
  Authorization: `Bearer ${AUTH}`,
}

export const updateConfigByDatabase = async (id, data) => {
  const options = {
    method: "PATCH",
    headers: fetchHeaders,
    body: JSON.stringify(data),
  };
  return new Promise((resolve, reject) => {
    fetch(`https://api.notion.com/v1/databases/${id}`, options)
      .then((response) => response.json())
      .then((response) => {
        resolve(response)
      })
      .catch((err) => reject(err));
  })
};
