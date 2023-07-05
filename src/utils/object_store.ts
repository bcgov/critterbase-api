import AWS from "aws-sdk";
import { Metadata } from "aws-sdk/clients/s3";
import multer from "multer";
import { apiError } from "./types";

// A middleware for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Local getter for retrieving the S3 client.
 *
 * @returns {*} {AWS.S3} The S3 client
 * @throws {apiError} If necessary environment variables are not defined
 */
const _getS3Client = (): AWS.S3 => {
  const accessKeyId = process.env.OBJECT_STORE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.OBJECT_STORE_SECRET_KEY_ID;

  if (!accessKeyId || !secretAccessKey) {
    throw apiError.serverIssue();
  }

  const awsEndpoint = new AWS.Endpoint(_getObjectStoreUrl());

  return new AWS.S3({
    endpoint: awsEndpoint.href,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    signatureVersion: "v4",
    s3ForcePathStyle: true,
    region: "us-west-2", // TODO: determine if this is necessary with object store service
  });
};

/**
 * Local getter for retrieving the S3 object store URL.
 *
 * @returns {*} {string} The object store URL
 * @throws {apiError} If OBJECT_STORE_URL environment variable is not defined
 */
const _getObjectStoreUrl = (): string => {
  const url = process.env.OBJECT_STORE_URL;

  if (!url) {
    throw apiError.serverIssue();
  }

  return url;
};

/**
 * Local getter for retrieving the S3 object store bucket name.
 *
 * @returns {*} {string} The object store bucket name
 * @throws {apiError} If OBJECT_STORE_BUCKET_NAME environment variable is not defined
 */
const _getObjectStoreBucketName = (): string => {
  const bucketName = process.env.OBJECT_STORE_BUCKET_NAME;

  if (!bucketName) {
    throw apiError.serverIssue();
  }

  return bucketName;
};

/**
 * Returns the S3 host URL. It optionally takes an S3 key as a parameter, which produces
 * a full URL to the given file in S3.
 *
 * @export
 * @param {string} [key] The key to an object in S3
 * @returns {*} {string} The s3 host URL
 */
const getS3HostUrl = (key?: string): string => {
  // Appends the given S3 object key, trimming between 0 and 2 trailing '/' characters
  return `${_getObjectStoreUrl()}/${_getObjectStoreBucketName()}/${
    key ?? ""
  }`.replace(/\/{0,2}$/, "");
};

const uploadFileToS3 = async (
  file: Express.Multer.File,
  artifact_id: string,
  metadata: Metadata = {}
): Promise<string> => {
  // Setting up S3 upload parameters
  const params: AWS.S3.PutObjectRequest = {
    Bucket: _getObjectStoreBucketName(),
    Key: `${artifact_id}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ContentDisposition: 'inline', // This causes the file to be opened in the browser instead of downloaded
    Metadata: metadata,
  };
  const s3Client = _getS3Client();
  // Uploading files to the bucket
  const response = await s3Client.upload(params).promise();
  return response.Key;
};

const getFileDownloadUrl = (fileName: string): string => {
  // Setting up S3 download parameters
  const params: AWS.S3.GetObjectRequest = {
    Bucket: _getObjectStoreBucketName(),
    Key: fileName,
  };
  const s3Client = _getS3Client();

  return s3Client.getSignedUrl("getObject", params);
};

export {
  upload,
  _getS3Client,
  _getObjectStoreUrl,
  _getObjectStoreBucketName,
  getS3HostUrl,
  uploadFileToS3,
  getFileDownloadUrl,
};