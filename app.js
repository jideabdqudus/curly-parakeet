const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const { errorHandler } = require("./middleware");

const dotenv = require("dotenv").config();

const {
  executeGetQuery,
  executePostQuery,
  executePutQuery,
  executeDeleteQuery,
} = require("./gremlin");

app.use(express.json());
app.use(errorHandler);
app.use(express.urlencoded({ extended: false }));

/*

- To get all the vertices in the graph database : g.V()

- To get a vertex with the ID "1" :  g.V(1)

- Get the value of the 'name' property on the vertex with the ID '1' :     g.V(1).values('name')

- To get outgoing edges: g.V(1).outE()

- Get the names of people vertex 1 knows: g.V('1').outE('knows').inV().values('name') or g.V(1).out('knows').values('name')

*/

app.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      // const gremlinQuery = "g.V().limit(10)";

      // const gremlinQuery = "g.V('b4c41702-19f2-e686-266c-a4f7da01d6db').outE('name')";

      // const gremlinQuery = "g.V('b4c41702-19f2-e686-266c-a4f7da01d6db').values('email')";

      // const gremlinQuery = "g.V('84c346e7-9b21-ff8d-dfe4-32c2f834cdef').values('name')";

      const result = await executeGetQuery(gremlinQuery);
      res.status(200).json(JSON.parse(result));
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
      throw new Error(error);
    }
  })
);

app.post(
  "/create",
  asyncHandler(async (req, res) => {
    try {
      const username = "jim";
      const email = "jim@mail.com";

      const gremlinQuery = `g.addV('user').property('username', '${username}').property('email', '${email}')`;
      const result = await executePostQuery(query);
      res.status(200).json(JSON.parse(result));
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
      throw new Error(error);
    }
  })
);

app.put(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    const vertexId = "123";
    const properties = { name: "John", age: 30 };
    try {
      const result = await executePutQuery(vertexId, properties);
      res.status(200).json(JSON.parse(result));
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
      throw new Error(error);
    }
  })
);

app.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const vertexId = "123";
    try {
      const result = await executeDeleteQuery(vertexId);
      res.status(200).json(JSON.parse(result));
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
      throw new Error(error);
    }
  })
);

const port = process.env.PORT || 7114;

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
