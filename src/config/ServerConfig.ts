import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.MONGO_URI,
  ENVIRONMENT: process.env.NODE_ENV,
  SALTROUNDS: Number(process.env.SALT_ROUNDS),
  JWTSECRET: process.env.JWT_SECRET,
  CLOUDINARYCLOUD: process.env.CLOUDINARY_CLOUD,
  CLOUDINARYAPIKEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARYSECRET: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
