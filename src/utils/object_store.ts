import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { apiError } from "./types";

export type Metadata = Record<string, string>;

// A middleware for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Local getter for retrieving the S3 client.
 *
 * @returns {*} {AWS.S3} The S3 client
 * @throws {apiError} If necessary environment variables are not defined
 */
const _getS3Client = (): S3Client => {
  const accessKeyId = process.env.OBJECT_STORE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.OBJECT_STORE_SECRET_KEY_ID;

  if (!accessKeyId || !secretAccessKey) {
    throw apiError.serverIssue("Object store credentials are not defined");
  }

  const url = _getObjectStoreUrl();

  return new S3Client({
    endpoint: url,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    region: "ca-central-1",
    forcePathStyle: true,
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
    throw apiError.serverIssue("Object store URL is not defined");
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
    throw apiError.serverIssue("Object store bucket name is not defined");
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
  const key = `${artifact_id}_${file.originalname}`;
  const params = {
    Bucket: _getObjectStoreBucketName(),
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: metadata,
  };
  const s3Client = _getS3Client();
  // Uploading files to the bucket
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return key;
};

const getFileDownloadUrl = async (fileName: string): Promise<string> => {
  // Setting up S3 download parameters
  const params = {
    Bucket: _getObjectStoreBucketName(),
    Key: fileName,
  };
  const s3Client = _getS3Client();

  const command = new GetObjectCommand(params);
  return getSignedUrl(s3Client, command);
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
