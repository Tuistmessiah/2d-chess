const { select_where } = require("../../database/queries/generic");

const { verifyAndExtract } = require("../utils-api");

module.exports = {
  findGameByName,
  findGameByCode,
};

const ENTITY_NAME = "game";

/* Props: varied
 * Return: 'runQuery': { type: "error"/"response", content }
 */

async function findGameByName(gameName) {
  return select_where(ENTITY_NAME, "game_name", gameName).then(
    verifyAndExtract
  );
}

// TODO: remove (obsolete)
async function findGameByCode(entityName, gameCode) {
  const { type, content } = await select_where(
    entityName,
    "game_code",
    gameCode
  );
  if (content.length > 1) {
    return {
      type: error,
      content: { message: "More than one session value found" },
    };
  }
  return { type, content: content[0] };
}
