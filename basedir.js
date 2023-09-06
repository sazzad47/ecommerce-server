// Import the built-in 'path' module for working with file and directory paths
const path = require("path");


// Use '__dirname' to refer to the directory where the current module resides
// 'path.join' combines '__dirname' and the provided 'path_to_join' to create a complete path
module.exports = (path_to_join) => path.join(__dirname, path_to_join);

// This function helps in generating absolute paths by appending a provided path
// to the directory where the current module is located using '__dirname'.



