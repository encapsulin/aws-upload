// export const handler = async (event, context) => {
//     // console.log('event:', JSON.stringify(event, null, 2));
//     console.log('event:', JSON.stringify(event, null, 2));
//     console.log('context:', context);
//     // console.log('value1 =', event.key1);
//     // console.log('value2 =', event.key2);
//     // console.log('value3 =', event.key3);
//     return "event.key1";  // Echo back the first key value
//     // throw new Error('Something went wrong');
// };

// Example using AWS SDK v3
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });
const bucketName = process.env.S3_BUCKET_NAME;;//"fn-upload";

export const handler = async (event) => {
    console.log('Received event:', event);
    console.log(bucketName);

    // default: today in yyyy-mm-dd
    let dir = new Date().toISOString().slice(0, 10);
    if (event?.queryStringParameters?.dir) {
        dir = event.queryStringParameters.dir;
    } else if (event?.payload?.dir) {
        dir = event.payload.dir;
    }

    let file = '';
    if (event?.queryStringParameters?.file) {
        file = event.queryStringParameters.file;
    } else if (event?.payload?.file) {
        file = event.payload.file;
    }
    console.log("file:"+file)

    let cmd = "put"

    if(event?.queryStringParameters?.cmd && event?.queryStringParameters?.cmd ==="get") {
        cmd="get"
    }

    let command = new GetObjectCommand({
        Bucket: bucketName,
        Key: file,
        ContentType: "application/octet-stream",
    });

    if(cmd === "put") {
        let filePrefix = new Date().toISOString().slice(0, 19).replace(/[^0-9\-]/g, "-")
        file = filePrefix + "" + file

        command = new PutObjectCommand({
            Bucket: bucketName,
            Key: file,
            ContentType: "application/octet-stream",
        });
    }

    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600 
    });

    if (event.requestContext?.http?.method === "OPTIONS") {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: "",
        };
    }

    return {
        statusCode: 200,
        headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        body: JSON.stringify({ signedUrl: signedUrl, file }),
    };
};