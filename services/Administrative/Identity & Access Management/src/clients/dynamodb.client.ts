import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION || "eu-west-2",
    endpoint: process.env.AWS_ENDPOINT_URL || "http://localstack:4566",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test"
    }
});

const documentClient = DynamoDBDocumentClient.from(client);

export default documentClient;
