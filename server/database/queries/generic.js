const {
  runQuery,
  queryColsParser,
  queryValIndexesParser,
  queryColSetParser,
  queryValuesParser,
} = require("./query-runner");

module.exports = {
  select_all,
  insert_values,
  select_where_id,
  update_where_id,
  delete_where_id,
  select_where,
};

/* Props: vary by query, but all need the 'entityName'
 * Return: 'runQuery': { type: "error"/"response", content }
 */

// - A+CRUD
function select_all(entityName) {
  const query = `SELECT * FROM ${entityName}`;
  return runQuery({ query });
}

function insert_values(entityName, content) {
  const queryCols = queryColsParser(content);
  const queryValIndexes = queryValIndexesParser(content);
  const queryValues = queryValuesParser(content);
  const query = `INSERT INTO ${entityName}(${queryCols}) VALUES(${queryValIndexes}) RETURNING id`;
  return runQuery({ query, queryValues });
}

function select_where_id(entityName, id) {
  const query = `SELECT * FROM ${entityName} WHERE "id" = $1`;
  return runQuery({ query, queryValues: [id] });
}

function update_where_id(entityName, id, content) {
  const queryCols = queryColsParser(content);
  const queryValues = queryValuesParser(content);
  const queryColSet = queryColSetParser(content);
  const query = `UPDATE ${entityName} SET ${queryColSet} WHERE id = $1 RETURNING ${queryCols}`;
  return runQuery({ query, queryValues: [id, ...queryValues] });
}

function delete_where_id(entityName, id) {
  const query = `DELETE FROM ${entityName} WHERE "id" = $1`;
  return runQuery({ query, queryValues: [id] });
}

// - Find
function select_where(entityName, variableName, variable) {
  const query = `SELECT * FROM ${entityName} WHERE "${variableName}" = $1`;
  return runQuery({ query, queryValues: [variable] });
}
