module.exports = {
  errorJON,
};

/* Props: {code: http code, message?: string to add to error message}
 *  Error messages should be listed and fetched from 'errors' object
 */
function errorJON(code, message = "") {
  return { error: errors[code] + message };
}

// - INTERNALS

const errors = {
  500: "Internal Server Error",
};
