import {
  _getObjectStoreBucketName,
  _getObjectStoreUrl,
  _getS3Client,
  getS3HostUrl,
  uploadFileToS3,
} from "./object_store";
import { apiError } from "./types";

describe("File: object_store.ts", () => {
  const objectStore = require("./object_store");

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
      const s3Client = objectStore._getS3Client();
      expect(s3Client).toBeDefined();
    });

    it("should throw a server error if S3 keys are undefined", () => {
      delete process.env.OBJECT_STORE_ACCESS_KEY_ID;
      delete process.env.OBJECT_STORE_SECRET_KEY_ID;

      try {
        objectStore._getS3Client();
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
      const url = objectStore._getObjectStoreUrl();
      expect(url).toBe("test-url");
    });

    it("should throw a server error if url is undefined", () => {
      delete process.env.OBJECT_STORE_URL;

      try {
        objectStore._getObjectStoreUrl();
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
      const bucketName = objectStore._getObjectStoreBucketName();
      expect(bucketName).toBe("test-bucket-name");
    });

    it("should throw a server error if bucket name is undefined", () => {
      delete process.env.OBJECT_STORE_BUCKET_NAME;

      try {
        objectStore._getObjectStoreBucketName();
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
      const hostUrl = objectStore.getS3HostUrl();
      expect(hostUrl).toBe("test-url/test-bucket-name");
    });
  });

  describe(uploadFileToS3.name, () => {
    it.todo(
      "should upload a file to S3 and return the name of the file"
      //   , async () => {
      //   // Create a mock file
      //   const mockFile = {
      //     originalname: "testfile.txt",
      //     buffer: Buffer.from("test file data"),
      //     mimetype: "text/plain",
      //   } as Express.Multer.File;

      //   // Create the expected response from the S3 client
      //   const artifact_id = "123";
      //   const mockS3Response = {
      //     Key: `${artifact_id}_${mockFile.originalname}`,
      //   };

      //   // Create a mock S3 client
      //   const mockS3Client = {
      //     upload: jest.fn().mockReturnThis(),
      //     promise: jest.fn().mockResolvedValue(mockS3Response),
      //   } as unknown as AWS.S3;

      //   // Mock the _getS3Client function to return the mock S3 client
      //   objectStore._getS3Client.mockImplementation(() => mockS3Client);

      //   // Run the uploadFileToS3 function
      //   const returnedFilename = await objectStore.uploadFileToS3(
      //     mockFile,
      //     artifact_id
      //   );

      //   // Assert that the _getS3Client was called
      //   expect(_getS3Client).toHaveBeenCalled();

      //   // Assert that the s3Client.upload was called
      //   expect(mockS3Client.upload).toHaveBeenCalled();

      //   // Assert that the file name is returned
      //   expect(returnedFilename).toBe(mockS3Response.Key);
      // }
    );
  });

  describe("getFileDownloadUrl", () => {
    it.todo("should return a file download url");
  });
});
