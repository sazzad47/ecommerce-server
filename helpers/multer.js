// Import the 'multer' library for handling file uploads
const multer = require("multer");

// Import the 'basedir' helper for resolving the base directory
const basedir = require("../basedir");

// Configure the disk storage for uploaded files
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    // Set the destination path for uploaded files
    cb(null, basedir("/uploads/")); // Use 'basedir' helper to resolve the path
  },
  filename: (_, file, cb) => {
    // Set the filename for uploaded files
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Define the file filter function
const fileFilter = (_, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/webp"
  ) {
    // Accept the file if its mimetype matches image types
    cb(null, true);
  } else {
    // Reject the file if its mimetype is unsupported
    cb({ message: "Unsupported file type" });
  }
};

// Configure the Multer middleware with the defined storage, limits, and filter
const upload = multer({
  storage, // Use the configured storage for uploaded files
  limits: {
    fileSize: 1024 * 1024, // Set the maximum file size to 1MB
  },
  fileFilter, // Use the defined file filter function
});

// Export the configured upload middleware
module.exports = upload;
