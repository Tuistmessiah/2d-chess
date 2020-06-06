// Functions

/*  Props:
 *     sourceSquare: source square string coords
 *     targetSquare: target square string coords
 *     piece: moving piece string identifier
 *     position: board configuration
 *   return: [false, return doAction()]
 */

// TODO: Use these functions for game logic in backend

function checkPathResult({ sourceSquare, targetSquare, piece, position }) {
  const type = getType(piece);
  const source = decodeCoords(sourceSquare);
  const target = decodeCoords(targetSquare);

  switch (type) {
    case "P":
      if (isValidVertMove({ source, target, position, limit: 2 })) {
        if (movedBackwards({ source, target, color: getColor(piece) })) {
          return false;
        }
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    case "R":
      if (isValidVertMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      if (isValidHorizMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    case "N":
      if (isValidKnighMove({ source, target })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    case "B":
      if (isValidDiagMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    case "Q":
      if (isValidVertMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      if (isValidHorizMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      if (isValidDiagMove({ source, target, position })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    case "K":
      if (isValidVertMove({ source, target, position, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      if (isValidHorizMove({ source, target, position, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      if (isValidDiagMove({ source, target, position, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, position });
      }
      return false;
    default:
      return false;
  }
}

function checkKing({ position, color }) {
  const enemyColor = color === "w" ? "b" : "w";
  const kingPos = Object.keys(position).find(
    (key) => position[key] === `${color}K`
  );

  for (let [sourceSquare, piece] of Object.entries(position)) {
    if (getColor(piece) === enemyColor) {
      const searchParams = {
        sourceSquare,
        targetSquare: kingPos,
        piece,
        position,
      };
      if (checkPathResult(searchParams) === "eat") {
        return true;
      }
    }
  }
  return false;
}

function mateKing({ position, color }) {}

// Hard coded data
const initialPosition = {
  a1: "wR",
  b1: "wN",
  c1: "wB",
  d1: "wQ",
  e1: "wK",
  f1: "wB",
  g1: "wN",
  h1: "wR",

  a2: "wP",
  b2: "wP",
  c2: "wP",
  d2: "wP",
  e2: "wP",
  f2: "wP",
  g2: "wP",
  h2: "wP",

  a7: "bP",
  b7: "bP",
  c7: "bP",
  d7: "bP",
  e7: "bP",
  f7: "bP",
  g7: "bP",
  h7: "bP",

  a8: "bR",
  b8: "bN",
  c8: "bB",
  d8: "bQ",
  e8: "bK",
  f8: "bB",
  g8: "bN",
  h8: "bR",
};

function parsePosition(positionJSON) {}

module.exports = {
  checkPathResult,
  checkKing,
  mateKing,
  initialPosition,
};

// INTERNALS

/*  return: false, ["empty", "eat"]
 */
function doAction({ sourceSquare, targetSquare, position }) {
  const targetContent = position[targetSquare];
  const sourceContent = position[sourceSquare];

  if (!targetContent) {
    return "empty";
  }
  if (getColor(targetContent) !== getColor(sourceContent)) {
    return "eat";
  }
  return false;
}

// Movement

function movedBackwards({ source, target, color }) {
  const movement = source[1] - target[1];
  if (color === "w") {
    return movement > 0;
  }
  if (color === "b") {
    return movement < 0;
  }
  return false;
}

function isValidVertMove({ source, target, position, limit }) {
  if (source[0] === target[0]) {
    const yMin = Math.min(source[1], target[1]);
    const x = source[0];
    const yDist = Math.abs(source[1] - target[1]);

    for (let i = yMin + 1; i < yMin + yDist; i++) {
      if (position[encodeCoords([x, i])]) {
        return false;
      }
    }
    if (limit && limit < yDist) {
      return false;
    }
    return true;
  }
  return false;
}

function isValidHorizMove({ source, target, position, limit }) {
  if (source[1] === target[1]) {
    const xMin = Math.min(source[0], target[0]);
    const y = source[1];
    const xDist = Math.abs(source[0] - target[0]);

    for (let i = xMin + 1; i < xMin + xDist; i++) {
      if (position[encodeCoords([i, y])]) {
        return false;
      }
    }
    if (limit && limit < xDist) {
      return false;
    }
    return true;
  }
  return false;
}

function isValidDiagMove({ source, target, position, limit }) {
  const deltaX = target[0] - source[0];
  const deltaY = target[1] - source[1];
  const dir = [deltaX < 0 ? -1 : 1, deltaY < 0 ? -1 : 1];

  if (Math.abs(deltaX) === Math.abs(deltaY)) {
    const xDist = Math.abs(deltaX);
    for (let i = 1; i < xDist; i++) {
      const coords = [dir[0] * i + source[0], dir[1] * i + source[1]];
      if (position[encodeCoords(coords)]) {
        return false;
      }
    }
    if (limit && limit < deltaX) {
      return false;
    }
    return true;
  }
  return false;
}

function isValidKnighMove({ source, target }) {
  // TODO: Improve this function
  const deltaX = Math.abs(target[0] - source[0]);
  const deltaY = Math.abs(target[1] - source[1]);
  if ((deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1)) {
    return true;
  }
  return false;
}

// Extract data

function getColor(piece) {
  return piece.charAt(0);
}

function getType(piece) {
  return piece.charAt(1);
}

function decodeCoords(strSquare) {
  const x = strSquare.charAt(0).charCodeAt(0) - 97;
  const y = parseInt(strSquare.charAt(1)) - 1;
  return [x, y];
}

function encodeCoords([x, y]) {
  const xStr = String.fromCharCode(x + 97);
  const yStr = (y + 1).toString();
  return `${xStr}${yStr}`;
}
