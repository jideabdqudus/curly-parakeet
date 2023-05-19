const { get, post, put, del } = require("./neptune");

const executeGetQuery = async (query) => {
  try {
    const endpoint = "/gremlin?gremlin=" + encodeURIComponent(query);
    const response = await get(endpoint);
    return response;
  } catch (error) {
    throw new Error("Failed to execute Gremlin query: " + error.message);
  }
};

const executePostQuery = async (query) => {
  try {
    const endpoint = "/gremlin";
    const body = { gremlin: query };
    const response = await post(endpoint, body);
    return response;
  } catch (error) {
    throw new Error("Failed to execute Gremlin query: " + error.message);
  }
};

const executePutQuery = async (vertexId, properties) => {
  try {
    const endpoint = `/gremlin/${vertexId}`;
    const body = { properties };
    const response = await put(endpoint, body);
    return response;
  } catch (error) {
    throw new Error("Failed to execute Gremlin query: " + error.message);
  }
};

const executeDeleteQuery = async (vertexId) => {
  try {
    const endpoint = `/gremlin/${vertexId}`;
    const response = await del(endpoint);
    return response;
  } catch (error) {
    throw new Error("Failed to execute Gremlin query: " + error.message);
  }
};

module.exports = {
  executeGetQuery,
  executePostQuery,
  executePutQuery,
  executeDeleteQuery,
};
