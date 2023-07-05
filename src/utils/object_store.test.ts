import {
  _getObjectStoreBucketName,
  _getObjectStoreUrl,
  _getS3Client,
  getS3HostUrl,
  uploadFileToS3,
  getFileDownloadUrl,
} from "./object_store";
import { apiError } from "./types";

// Mock the AWS SDK
jest.mock("aws-sdk", () => {
  const mS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ Key: "mockKey" }),
    getSignedUrl: jest.fn().mockReturnValue("mockSignedUrl"),
  };

  const mS3Endpoint = {
    href: "mockUrl",
  };

  return {
    S3: jest.fn(() => mS3Instance),
    Endpoint: jest.fn(() => mS3Endpoint),
  };
});

const AWS = require("aws-sdk");

describe("File: object_store.ts", () => {
  beforeEach(() => {
    process.env.OBJECT_STORE_ACCESS_KEY_ID = "test-access-key-id";
    process.env.OBJECT_STORE_SECRET_KEY_ID = "test-secret-access-key";
    process.env.OBJECT_STORE_URL = "test-url";
    process.env.OBJECT_STORE_BUCKET_NAME = "test-bucket-name";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(_getS3Client.name, () => {
    it("should return a S3 client", () => {
      const s3Client = _getS3Client();
      expect(s3Client).toBeDefined();
      expect(AWS.S3).toHaveBeenCalledTimes(1);
    });

    it("should throw a server error if S3 keys are undefined", () => {
      delete process.env.OBJECT_STORE_ACCESS_KEY_ID;
      delete process.env.OBJECT_STORE_SECRET_KEY_ID;

      try {
        _getS3Client();
        fail("Expected _getS3Client to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(apiError);
        expect(error.message).toBe("Internal Server Error");
        expect(error.status).toBe(500);
        expect(error.errorType).toBe("serverIssue");
      }
    });
  });

  describe(_getObjectStoreUrl.name, () => {
    it("should return a url", () => {
      const url = _getObjectStoreUrl();
      expect(url).toBe("test-url");
    });

    it("should throw a server error if url is undefined", () => {
      delete process.env.OBJECT_STORE_URL;

      try {
        _getObjectStoreUrl();
        fail("Expected _getObjectStoreUrl to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(apiError);
        expect(error.message).toBe("Internal Server Error");
        expect(error.status).toBe(500);
        expect(error.errorType).toBe("serverIssue");
      }
    });
  });

  describe(_getObjectStoreBucketName.name, () => {
    it("should return a bucket name", () => {
      const bucketName = _getObjectStoreBucketName();
      expect(bucketName).toBe("test-bucket-name");
    });

    it("should throw a server error if bucket name is undefined", () => {
      delete process.env.OBJECT_STORE_BUCKET_NAME;

      try {
        _getObjectStoreBucketName();
        fail("Expected _getObjectStoreBucketName to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(apiError);
        expect(error.message).toBe("Internal Server Error");
        expect(error.status).toBe(500);
        expect(error.errorType).toBe("serverIssue");
      }
    });
  });

  describe(getS3HostUrl.name, () => {
    it("should return a host url", () => {
      const hostUrl = getS3HostUrl();
      expect(hostUrl).toBe("test-url/test-bucket-name");
    });
  });

  describe(uploadFileToS3.name, () => {
    it("should upload a file to S3 and return the name of the file", async () => {
      const mockFile = {
        originalname: "testFile",
        buffer: Buffer.from("test buffer"),
        mimetype: "text/plain",
      } as Express.Multer.File;

      const result = await uploadFileToS3(mockFile, "id");
      expect(result).toBe("mockKey");
      expect(AWS.Endpoint).toHaveBeenCalledTimes(1);
      expect(AWS.S3).toHaveBeenCalledTimes(1);
    });
  });

  describe(getFileDownloadUrl.name, () => {
    it("should return a file download url", () => {
      const fileKey = "mockKey";
      const downloadUrl = getFileDownloadUrl(fileKey);
      expect(downloadUrl).toBe("mockSignedUrl");
    });
  });
});
