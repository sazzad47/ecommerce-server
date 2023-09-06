const { badRequest } = require("../errors");
const { upload } = require("./cloudinary");
const fs = require("fs");

// Function to upload category photos to Cloudinary
const uploadCategoryPhotos = async (arr) => {
  if (arr.length == 0) {
    throw new badRequest("Provide data", `images`);
  }
  const urls = {};

  // Loop through each file in the array and upload to Cloudinary
  for (const file of arr) {
    const url = await upload(file);

    // Determine if the file is a category image or a banner image
    if (file.originalname.includes("cat_image")) {
      urls["image_url"] = url;
    } else {
      urls["banner_url"] = url;
    }

    // Delete the temporary file after uploading
    fs.unlinkSync(file.path);
  }
  return urls;
};

// Function to upload one phototo Cloudinary
const uploadOnePhoto = async (file) => {
  if (!file) {
    throw new badRequest("Provide data", `file`);
  }
  // Loop through each file in the array and upload to Cloudinary
  const url = await upload(file);

  // Delete the temporary file after uploading
  fs.unlinkSync(file.path);

  return url;
};

// Function to upload product photos to Cloudinary
const uploadProductPhotos = async (arr) => {
  if (!arr || arr.length == 0) {
    throw new badRequest("Provide data", `images`);
  }
  const urls = [];

  // Loop through each file in the array and upload to Cloudinary
  for (const file of arr) {
    const url = await upload(file);
    urls.push(url);

    // Delete the temporary file after uploading
    fs.unlinkSync(file.path);
  }
  return urls;
};

// Function to generate a random ID of a specified length
const makeid = (length) => {
  let result = "";
  const characters = "01234567890123456789012345678901234567890123456789";
  const charactersLength = characters.length;
  let counter = 0;

  // Generate a random ID by picking characters from the 'characters' string
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

module.exports = {
  uploadCategoryPhotos,
  uploadProductPhotos,
  makeid,
  uploadOnePhoto,
};
