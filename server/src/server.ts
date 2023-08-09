import "@config/global/loader";
import "@config/env/loader";
import { connectToDb } from "@config/db/conn";

import app from "@app/index";

connectToDb()
  .then(() =>
    app.listen(globalThis.port, () => {
      console.log(`[SERVER HOSTED ON PORT]: ${globalThis.port}`);
      console.log("Listening for requests...");
    })
  )
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });
