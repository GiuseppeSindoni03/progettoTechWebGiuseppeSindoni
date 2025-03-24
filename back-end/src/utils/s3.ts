import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner"; // ✅ Modulo corretto per generare Signed URLs

import dotenv from "dotenv";

dotenv.config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;
const REGION = process.env.AWS_REGION as string;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;



console.log("AWS_BUCKET_NAME:", BUCKET_NAME);
console.log("AWS_REGION:", REGION);
console.log("AWS_ACCESS_KEY_ID:", ACCESS_KEY_ID ? " Key Loaded" : " Key MISSING");
console.log("AWS_SECRET_ACCESS_KEY:", SECRET_ACCESS_KEY ? " Key Loaded" : "❌Key MISSING");



// 🔹 Configura il client S3 con AWS SDK v3
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

// 📌 Funzione per caricare un file su S3
export const uploadToS3 = async (file: Express.Multer.File, fileKey: string) => {
  const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
};


export const getSignedUrl = async (fileKey: string): Promise<string> => {
  if (!fileKey) {
    throw new Error("File key non valida");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey
  });

  return await awsGetSignedUrl(s3, command, { expiresIn: 300 });
};
