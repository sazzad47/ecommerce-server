const cloudinary = require("cloudinary").v2;

// Configure the Cloudinary API with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const upload = async (file) => {
  const res = await cloudinary.uploader.upload(file.path, {
    public_id: file.originalname, // Use the original filename as the public ID
  });

  return res.secure_url;
};

module.exports = { upload };
