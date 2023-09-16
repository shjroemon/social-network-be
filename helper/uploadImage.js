const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const uploadImage = async (image) => {
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    folder: "img-posts",
  });
  fs.unlinkSync(image.tempFilePath);
  return result;
};

module.exports = uploadImage;
