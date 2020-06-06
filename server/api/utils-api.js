module.exports = {
  extractFromArray,
  verifyAndExtract,
};

function verifyAndExtract({ type, content }) {
  if (content.length > 1) {
    return {
      type: error,
      content: { message: "More than one item value found. Duplicates in DB!" },
    };
  }
  return { type, content: content[0] };
}

function extractFromArray({ type, content }) {
  return { type, content: content[0] };
}
