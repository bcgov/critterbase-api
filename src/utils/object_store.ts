import AWS from "aws-sdk";
import { Metadata } from "aws-sdk/clients/s3";

/**
 * Local getter for retrieving the S3 client.
 *
 * @returns {*} {AWS.S3} The S3 client
 */
export const _getS3Client = (): AWS.S3 => {
  const awsEndpoint = new AWS.Endpoint(_getObjectStoreUrl());

  return new AWS.S3({
    endpoint: awsEndpoint.href,
    accessKeyId: process.env.OBJECT_STORE_ACCESS_KEY_ID,
    secretAccessKey: process.env.OBJECT_STORE_SECRET_KEY_ID,
    signatureVersion: "v4",
    s3ForcePathStyle: true,
  });
};

/**
 * Local getter for retrieving the S3 object store URL.
 *
 * @returns {*} {string} The object store URL
 */
export const _getObjectStoreUrl = (): string => {
  return process.env.OBJECT_STORE_URL ?? "nrs.objectstore.gov.bc.ca";
};

/**
 * Local getter for retrieving the S3 object store bucket name.
 *
 * @returns {*} {string} The object store bucket name
 */
export const _getObjectStoreBucketName = (): string => {
  return process.env.OBJECT_STORE_BUCKET_NAME ?? "";
};

/**
 * Returns the S3 host URL. It optionally takes an S3 key as a parameter, which produces
 * a full URL to the given file in S3.
 *
 * @export
 * @param {string} [key] The key to an object in S3
 * @returns {*} {string} The s3 host URL
 */
export const getS3HostUrl = (key?: string): string => {
  // Appends the given S3 object key, trimming between 0 and 2 trailing '/' characters
  return `${_getObjectStoreUrl()}/${_getObjectStoreBucketName()}/${
    key ?? ""
  }`.replace(/\/{0,2}$/, "");
};

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
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
    Metadata: metadata,
  };
  const s3Client = _getS3Client();

  // Uploading files to the bucket
  const response = await s3Client.upload(params).promise();

  return response.Key;
};

// TODO: File retrieval
const getFileDownloadUrl = (fileName: string): string => {
  // Setting up S3 download parameters
  const params: AWS.S3.GetObjectRequest = {
    Bucket: _getObjectStoreBucketName(),
    Key: fileName,
  };
  const s3Client = _getS3Client();

  return s3Client.getSignedUrl("getObject", params);
};

export { uploadFileToS3, getFileDownloadUrl };
