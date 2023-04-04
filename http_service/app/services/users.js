const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { BUCKET_NAME, ACCESS_KEY, SECRET_KEY, END_POINT, AMQP_URL } =
  global.config;

const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const amqp = require("amqplib");

const AWS = require("aws-sdk");

const { connect, Channel } = require("amqplib");

const {
  NotAvailableError,
  BadRequestError,
  ForbiddenError,
} = require("../errors");
const { hashPass, checkPass } = require("../utils/bcrypt");

/**
 *
 *
 * @param {*} jwt
 * @param {*} pgInstance
 * @param {*} data
 * @return {*}
 */
exports.login = async (jwt, pgInstance, data) => {
  // get user

  const { email, password } = data;

  var user = await prisma.users.findFirst({
    where: { email: email },
  });

  let token;
  if (user) {
    const passChecked = await checkPass(password, user.password);
    if (passChecked) {
      // create jwt
      token = jwt.sign({
        user_id: user.id,
      });
    } else {
      throw new BadRequestError("Wrong username or password");
    }
  } else {
    const hashedPass = hashPass(password);

    user = await prisma.users
      .create({
        data: {
          email: email,
          password: hashedPass,
          created_at: new Date(),
        },
      })
      .catch((err) => {
        throw new BadRequestError(err.message);
      });

    token = jwt.sign({
      email: email,
      user_id: user.id,
    });
  }

  // return jwt
  return {
    data: {
      access_token: token,
      user_id: user.id,
      successful: true,
    },
  };
};

exports.uploadFile = async (pgInstance, user, body, file) => {
  const { inputs, language } = body;

  var userinfo = await prisma.users.findFirst({
    where: { id: user.user_id },
  });

  const file_there = file?.buffer;

  if (!file_there || !language || !inputs) {
    throw new BadRequestError("feilds not completed");
  }

  var uploadInsert = await prisma.uploads.create({
    data: {
      email: userinfo.email,
      inputs: inputs,
      language: language,
      enable: 0,
      created_at: new Date(),
    },
  });

  const s3 = new S3Client({
    region: "default",
    endpoint: END_POINT,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: String(uploadInsert.id),
    Body: file_there,
    ACL: "private",
  };
  await s3.send(new PutObjectCommand(s3Params));

  return { data: { upload_id: uploadInsert.id } };
};

exports.executeFile = async (params) => {
  var upload = await prisma.uploads.findFirst({
    where: { id: params.id },
  });

  if (upload.enable == 0) {
    try {
      // Connect to RabbitMQ server
      const connection = await amqp.connect(AMQP_URL);
      const channel = await connection.createChannel();

      // Define queue
      const queueName = "jobs";
      await channel.assertQueue(queueName, { durable: true });

      // Send ID to the queue
      const message = Buffer.from(String(upload.id));
      channel.sendToQueue(queueName, message, { persistent: true });

      // Close the connection
      await channel.close();
      await connection.close();
    } catch (err) {
      console.error(err);
      throw new BadRequestError("send message to queue error");
    }
  }

  return {
    data: {
      registered_id: upload.id,
    },
  };

  /////
  // connect('amqps://nllpexfc:UrsKVMWVeQ9wE2Gqy5_bw8r_H2JxwTmz@moose.rmq.cloudamqp.com/nllpexfc')
  // .then(conn => {
  //   return conn.createChannel();
  // })
  // .then(ch => {
  //   const queueName = 'serpro';
  //   return ch.assertQueue(queueName).then(qok => {
  //     return ch.consume(queueName, msg => {
  //       if (msg !== null) {
  //         console.log(msg.content.toString());
  //         ch.ack(msg);
  //       }
  //     });
  //   });
  // })
  // .catch(err => {
  //   console.error(err);
  // });
  /////
};

exports.statusFile = async (pgInstance, user) => {
  const { rows: results } = await pgInstance.query(
    "SELECT u.id, r.output, r.status, r.execute_date FROM uploads as u INNER JOIN jobs as j ON u.id = j.upload_id INNER JOIN results as r ON j.id = r.job  WHERE u.email = $1;",
    [user.user_id]
  );

  const data = results.rows.map((row) => {
    return {
      upload_id: row.id,
      output: row.output,
      status: row.status,
      execute_date: row.execute_date,
      download_url:
        "https://service-provider.s3.ir-thr-at1.arvanstorage.ir/" + row.id,
    };
  });

  return { data: { data } };
};
