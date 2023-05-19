const AWS = require("aws-sdk");
const asyncHandler = require("express-async-handler");

require("dotenv").config();

const executeNeptuneRequests = asyncHandler(async (method, point, body) => {
  try {
    // Fetch sensitive information from environment variables or secure configuration
    const host = `${process.env.TEST_CLUSTER_ENDPOINT}`;
    const accessKeyId = `${process.env.TEST_ACCESS_KEY}`;
    const secretAccessKey = `${process.env.TEST_SECRET_ACCESS_KEY}`;

    // Initialize AWS credentials securely
    const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);

    // Configure AWS Neptune endpoint
    const url = `https://${host}${point}`;
    const region = `${process.env.TEST_REGION}`;
    const endpoint = new AWS.Endpoint(url);
    endpoint.port = `${process.env.TEST_CLUSTER_PORT}`;

    // Create an HTTP request
    const httpRequest = new AWS.HttpRequest(endpoint, region);
    httpRequest.method = method;
    httpRequest.headers["Host"] = host;
    httpRequest.headers["Content-Type"] = "application/json";
    if (body) {
      httpRequest.body = JSON.stringify(body);
    }

    // Sign the request with AWS credentials
    const signer = new AWS.Signers.V4(httpRequest, "neptune-db");
    signer.addAuthorization(credentials, new Date());

    // Send the request and await the response
    const response = await new Promise((resolve, reject) => {
      const client = new AWS.HttpClient();
      client.handleRequest(
        httpRequest,
        null,
        (response) => {
          let responseBody = "";
          response.on("data", (chunk) => {
            responseBody += chunk;
          });
          response.on("end", () => {
            resolve(responseBody);
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
    return response;
  } catch (error) {
    throw new Error("Failed to execute Gremlin query: " + error.message);
  }
});

const post = async (endpoint, body) => {
  return executeNeptuneRequests("POST", endpoint, body);
};

const get = async (endpoint) => {
  return executeNeptuneRequests("GET", endpoint);
};

const put = async (endpoint, body) => {
  return executeNeptuneRequests("PUT", endpoint, body);
};

const del = async (endpoint) => {
  return executeNeptuneRequests("DELETE", endpoint);
};

module.exports = {
  post,
  get,
  put,
  del,
};
