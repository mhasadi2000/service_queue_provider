const axios = require("axios");

const {
  BUCKET_NAME,
  ACCESS_KEY,
  SECRET_KEY,
  END_POINT,
  AMQP_URL,
  CODEX_URL,
} = require("./config");

const { PrismaClient } = require("@prisma/client");
const { BadRequestError } = require("./errors");
const prisma = new PrismaClient();

function codeRunner(data) {
  console.log(data);
  const id = data.id;
  const config = {
    method: "post",
    url: CODEX_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data.job,
  };
  axios(config)
    .then(async function (response) {
      console.log(JSON.stringify(response.data));

      var resultsupdate = await prisma.results.update({
        data: { status: "done", output: response.data.output },
        where: {
          job: id,
        },
      });
      if (resultsupdate.length>0) {
        console.log("result updated successfully");
      } else {
        console.log(`error occured in update result ${id}`);
      }

      var jobsupdate = await prisma.jobs.update({
        data: { status: "executed", output: response.data.output },
        where: {
          id: id,
        },
      });

      if (jobsupdate.length > 0) {
        console.log("job updated successfully");
      } else {
        console.log(`error occured in update job ${id}`);
      }
    })
    .catch(async function (error) {
      console.log(error);
      var jobs = await prisma.jobs.findFirst({
        where: {
          id: id,
        },
      });
      if (jobs.length == 0) {
        console.log(`error occured in select job ${id}`);
        return;
      }

      var uploadsupdate = await prisma.uploads.update({
        data: { enable: 1},
        where: {
          id: jobs.upload_id,
        },
      });

      if (uploadsupdate.length == 0) {
        console.log(`error occured in update upload ${jobs.upload_id}`);
        return;
      }

      console.log("upload updated successfully");
    });
}

function main() {
  setInterval(async () => {
    var jobs = await prisma.jobs.findMany({
      where: {
        status: "none",
      },
    });

    if (jobs.length == 0) {
        console.log("fail");
      return;
    }
 
    jobs.forEach((row) => {
        console.log("start runner");
      codeRunner(row);
      console.log("after runner");
    });
    // pool.query(
    //   "SELECT * FROM jobs WHERE status = $1",
    //   ["none"],
    //   (err, result) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     result.rows.forEach((row) => {
    //       codeRunner(row);
    //     });
    //   }
    // );
  }, 4000);
}

main();
