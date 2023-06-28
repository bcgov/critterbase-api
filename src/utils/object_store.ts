import AWS from "aws-sdk";
import fs from "fs";
import multer from "multer";

// Configure AWS with your access and secret key.
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env; // These should be set in your .env file
if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.log("Access key ID:", ACCESS_KEY_ID);
  console.log("Secret access key:", SECRET_ACCESS_KEY);
  console.log("S3 bucket name:", BUCKET_NAME);
  throw new Error("S3 credentials not set");
}

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
const uploadFileToS3 = async (file: Express.Multer.File, artifact_id: string): Promise<string> => {
  // Read content from the file
  const fileContent = fs.readFileSync(file.path);

  // Setting up S3 upload parameters
  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `${artifact_id}_${file.originalname}`,
    Body: fileContent,
    Metadata: {original_name: file.originalname}, // TODO: finalise metadata
  };

  // Uploading files to the bucket
  const response = await s3.upload(params).promise(); // Proper promise usage with AWS SDK

  return response.Key;
};

// TODO: File retrieval
const getFileDownloadUrl = (fileName: string): string => {
  // Setting up S3 download parameters
  const params: AWS.S3.GetObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  };

  return s3.getSignedUrl("getObject", params);
};

export { uploadFileToS3, getFileDownloadUrl };
