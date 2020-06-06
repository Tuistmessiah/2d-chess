const {
  select_all,
  insert_values,
  select_where_id,
  update_where_id,
  delete_where_id,
} = require("../../database/queries/generic");

const { extractFromArray } = require("../utils-api");

module.exports = {
  findAll,
  create,
  read,
  update,
  destroy,
};

/* Props: varied
 * Return: 'runQuery': { type: "error"/"response", content }
 */

/* ACRUD (All + CRUD):
 * all
 * create
 * read (id)
 * update (id)
 * delete (id)
 * */

function findAll(entityName) {
  return select_all(entityName);
}

function create(entityName, content) {
  return insert_values(entityName, content).then(extractFromArray);
}

function read(entityName, id) {
  return select_where_id(entityName, id).then(extractFromArray);
}

function update(entityName, id, content) {
  return update_where_id(entityName, id, content).then(extractFromArray);
}

function destroy(entityName, id) {
  return delete_where_id(entityName, id).then(extractFromArray);
}
