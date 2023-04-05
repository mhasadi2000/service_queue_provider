const { GetObjectCommand } = require("@aws-sdk/client-s3");
const qs = require("querystring");
const fs = require("fs");
const amqp = require("amqplib");
const { BUCKET_NAME, ACCESS_KEY, SECRET_KEY, END_POINT, AMQP_URL } =
  require("./config");
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "default",
  endpoint: END_POINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});
const { PrismaClient } = require("@prisma/client");
const { BadRequestError } = require("./errors");
const prisma = new PrismaClient();

async function uploadedFileProcessor(id) {
  fs.readFile(__dirname + "/cache/" + id, "utf8", async (err, data) => {
    if (err) throw err;
    const fileData = data;

    var upload = await prisma.uploads.findFirst({
        where: { id: id },
      });
    if (upload.id == null) throw new BadRequestError("error in finding upload")

    const { language, inputs } = upload;
    const queryString = qs.stringify({
      code: fileData,
      language,
      input: inputs,
    });
    const date = new Date().toISOString();

    var job = await prisma.jobs.create({
        data:{
            upload_id:id,
            job:queryString,
            status:'none'
        }
      });

      if (job.id == null) throw new BadRequestError("error in creating job")


      var result = await prisma.results.create({
        data:{
            job:job.id,
            output:null,
            status: 'in progress',
            execute_date: date
        }
      });

      if (result.id == null) throw new BadRequestError("error in creating result")

  });
}

//handle incoming messages
async function messageHandler(message) {
  const id = message.content.toString();
  console.log("id of queue: " + id);
  fs.access(__dirname + "/cache/" + id, async function (err) {
    if (err) {
      // Retrieve file from S3 bucket
      const s3Params = {
        Bucket: BUCKET_NAME,
        Key: id,
      };
      const data = await s3.send(new GetObjectCommand(s3Params));
      const filePath = __dirname + "/cache/" + id;
      const writeStream = fs.createWriteStream(filePath);
      data.Body?.pipe(writeStream);
      writeStream.on("finish", () => {
        uploadedFileProcessor(id);
      });
    } else {
        uploadedFileProcessor(id);
    }
  });
}

async function start() {

  console.log("rabbitmq Consuming have been started");

  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue("jobs", { durable: true });
  channel.consume("jobs", messageHandler, { noAck: true });
}

start();
