import fetch from "node-fetch";

export const download = async (url) => {
  const response = await fetch(url);
  return await response.text();
};
