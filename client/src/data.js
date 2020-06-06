// Functions

/*  props: 
      sourceSquare: source square string coords
      targetSquare: target square string coords
      piece: moving piece string identifier
      boardConfig: board configuration
    return: [false, return doAction()]
 */
export function checkPathResult({
  sourceSquare,
  targetSquare,
  piece,
  boardConfig,
}) {
  const type = getType(piece);
  const source = decodeCoords(sourceSquare);
  const target = decodeCoords(targetSquare);

  switch (type) {
    case "P":
      if (isValidVertMove({ source, target, boardConfig, limit: 2 })) {
        if (movedBackwards({ source, target, color: getColor(piece) })) {
          return false;
        }
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    case "R":
      if (isValidVertMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      if (isValidHorizMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    case "N":
      if (isValidKnighMove({ source, target })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    case "B":
      if (isValidDiagMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    case "Q":
      if (isValidVertMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      if (isValidHorizMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      if (isValidDiagMove({ source, target, boardConfig })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    case "K":
      if (isValidVertMove({ source, target, boardConfig, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      if (isValidHorizMove({ source, target, boardConfig, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      if (isValidDiagMove({ source, target, boardConfig, limit: 1 })) {
        return doAction({ sourceSquare, targetSquare, boardConfig });
      }
      return false;
    default:
      return false;
  }
}

export function checkKing({ boardConfig, color }) {
  const enemyColor = color === "w" ? "b" : "w";
  const kingPos = Object.keys(boardConfig).find(
    (key) => boardConfig[key] === `${color}K`
  );

  for (let [sourceSquare, piece] of Object.entries(boardConfig)) {
    if (getColor(piece) === enemyColor) {
      const searchParams = {
        sourceSquare,
        targetSquare: kingPos,
        piece,
        boardConfig,
      };
      if (checkPathResult(searchParams) === "eat") {
        return true;
      }
    }
  }
  return false;
}

export function mateKing({ boardConfig, color }) {}
// Hard coded data

export const initialBoardConfig = {
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

export function parseboardConfig(boardConfigJSON) {}

// INTERNALS

/*  return: false, ["empty", "eat"]
 */
function doAction({ sourceSquare, targetSquare, boardConfig }) {
  const targetContent = boardConfig[targetSquare];
  const sourceContent = boardConfig[sourceSquare];

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

function isValidVertMove({ source, target, boardConfig, limit }) {
  if (source[0] === target[0]) {
    const yMin = Math.min(source[1], target[1]);
    const x = source[0];
    const yDist = Math.abs(source[1] - target[1]);

    for (let i = yMin + 1; i < yMin + yDist; i++) {
      if (boardConfig[encodeCoords([x, i])]) {
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

function isValidHorizMove({ source, target, boardConfig, limit }) {
  if (source[1] === target[1]) {
    const xMin = Math.min(source[0], target[0]);
    const y = source[1];
    const xDist = Math.abs(source[0] - target[0]);

    for (let i = xMin + 1; i < xMin + xDist; i++) {
      if (boardConfig[encodeCoords([i, y])]) {
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

function isValidDiagMove({ source, target, boardConfig, limit }) {
  const deltaX = target[0] - source[0];
  const deltaY = target[1] - source[1];
  const dir = [deltaX < 0 ? -1 : 1, deltaY < 0 ? -1 : 1];

  if (Math.abs(deltaX) === Math.abs(deltaY)) {
    const xDist = Math.abs(deltaX);
    for (let i = 1; i < xDist; i++) {
      const coords = [dir[0] * i + source[0], dir[1] * i + source[1]];
      if (boardConfig[encodeCoords(coords)]) {
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
