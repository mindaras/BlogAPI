import AWS from "aws-sdk";
import { config } from "@config/config";

AWS.config.update({
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  region: config.aws.region,
});

const s3 = new AWS.S3();

export { s3 };
