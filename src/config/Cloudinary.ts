
import { v2 as cloudinary } from "cloudinary";
import { config } from "./ServerConfig";

cloudinary.config({
  cloud_name: config.CLOUDINARYCLOUD,
  api_key: config.CLOUDINARYAPIKEY,
  api_secret: config.CLOUDINARYSECRET,
});

export default cloudinary;
