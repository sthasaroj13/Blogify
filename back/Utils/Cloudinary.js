import { v2 as cloudinary } from "cloudinary";

import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRIT,
});

const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;
    //upload file in cloudinary
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });

    //file has be uploaded
    console.log(" file uplaod successfully on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilePath); // this code remove the locally saved temporary file as the upload operation got fail
    return null;
  }
};
export { uploadOnCloudinary };
