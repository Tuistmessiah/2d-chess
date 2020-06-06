const pool = require("../dbPool");

module.exports = {
  runQuery,
  queryColsParser,
  queryValIndexesParser,
  queryColSetParser,
  queryValuesParser,
};

/* Props: {query: string, queryValues: array of strings, code?: string}
 *  'code' can identify the query in the node log.
 *  If not set then the query string and values will be printed.
 * Return: { type: "error"/"response", content: [object] }
 */
async function runQuery({ query, queryValues = [], code = "" }) {
  const content = await new Promise((resolve, reject) => {
    pool.query(query, [...queryValues], (error, response) => {
      const queryCode = code
        ? code
        : `'${query}' with values '[${Object.values(queryValues)}]'`;
      if (error) {
        console.error(`Query -> Error - ${queryCode}: ${error}`);
        return reject(error);
      }
      console.info(`Query -> Success - ${queryCode}: ${response}`);
      const content = response.rows;
      resolve(content);
    });
  }).catch((error) => error);

  let type = content.name === "error" ? "error" : "response";

  return {
    type,
    content,
  };
}

// Parsers: Objects to strings (for queries to build before calling 'runQuery')

function queryColsParser(content) {
  return Object.keys(content).join();
}
function queryValIndexesParser(content) {
  const queryValues = Object.values(content);
  return Array(queryValues.length)
    .fill()
    .map((val, i) => "$" + (i + 1))
    .join();
}
function queryValuesParser(content) {
  return Object.values(content);
}

function queryColSetParser(content) {
  return Object.keys(content)
    .map((key, i) => key + " = $" + (i + 2))
    .join();
}
