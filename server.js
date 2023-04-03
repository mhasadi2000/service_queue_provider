const path = require("path");

const { errorHandler } = require("./app/middlewares/error-handler");
const {
  NotAuthorizedError,
  RequestValidationError,
  NotFoundError,
} = require("./app/errors");

const multer = require("fastify-multer");

const start = async () => {
  const fastify = require("fastify")({
    logger: true,
    ajv: {
      customOptions: { allErrors: true },
    },
  });
  try {
    fastify.register(require("@fastify/env"), {
      schema: {
        type: "object",
        required: ["POSTGRES_URI", "JWT_SECRET"],
        properties: {
          POSTGRES_URI: {
            type: "string",
          },
          PORT: {
            type: "integer",
            default: 3000,
          },
          HOST: {
            type: "string",
            default: "127.0.0.1",
          },
          NODE_ENV: {
            type: "string",
            default: "development",
          },
          JWT_SECRET: {
            type: "string",
          },
          JWT_EXPIRES_IN: {
            type: "string",
            default: "3h",
          },
          CROSS: {
            type: "string",
            default: "http://localhost:3000",
          },
          UPLOAD_MAX_SIZE: {
            type: "number",
            default: 5 * 1000 * 1024, //5 MB
          },
          IMAGE_FORMAT: {
            type: "string",
            default: ".(jpg|jpeg|png|gif|PNG|JPG|GIF|JPEG)$",
          },
          FILE_URL: {
            type: "string",
            default: "https://s3.ir-thr-at1.arvanstorage.ir",
          },
          SERVER_URL: {
            type: "string",
          },
        },
      },
      dotenv: true,
    });
    await fastify.after();

    global.config = fastify.config;

    fastify.register(multer.contentParser);
    global.publicPath = `${__dirname}${path.sep}public${path.sep}`;

    fastify.register(require("@fastify/static"), {
      root: path.join(__dirname, "public"),
    });

    fastify.register(require("@fastify/cors"), {
      origin: (origin, cb) => {
        const allowedOrigins = fastify.config.CROSS.split(",");

        if (!origin || allowedOrigins.includes(origin) || true) {
          cb(null, true);
          return;
        }

        cb(new Error("Not allowed"), false);
      },
    });

    fastify.register(require("@fastify/postgres"), {
      connectionString: fastify.config.POSTGRES_URI,
      native: true,
    });

    fastify.register(require("fastify-axios"));

    fastify.register(require("@fastify/jwt"), {
      secret: fastify.config.JWT_SECRET,
      sign: {
        expiresIn: fastify.config.JWT_EXPIRES_IN,
      },
    });


    fastify.decorate("authenticate", async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw new NotAuthorizedError();
      }
    });

    if (fastify.config.NODE_ENV === "development") {
      fastify.register(require("@fastify/swagger"), {
        exposeRoute: true,
        routePrefix: "/docs",
        swagger: {
          info: { title: "service provider queue document" },
        },
      });
    }

    fastify.setSchemaErrorFormatter(function (errors, dataVar) {
      return new RequestValidationError(errors);
    });

    fastify.register(require("./app/routes/users"));

    fastify.setErrorHandler(errorHandler);

    fastify.setNotFoundHandler(function (request, reply) {
      throw new NotFoundError();
    });

    await fastify.listen({
      host: fastify.config.HOST,
      port: fastify.config.PORT,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
