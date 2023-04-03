const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const imageAddress = `${FILE_URL}${path.sep}${file.filename}`;

  const { inputs, language, enable } = body;

  const upload = await prisma.uploads
    .create({
      data: {
        email: user.email,
        inputs: inputs,
        language: language,
        enable: enable,
        created_at: new Date(),
      },
    })
    .catch((err) => {
      throw new BadRequestError(err.message);
    });

  return { data: { image_url: imageAddress } };
};
