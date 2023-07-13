import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { db } from "./utils/database";
import { makeApp } from "./app";

if (IS_DEV || IS_PROD) {
  makeApp(db).listen(PORT, () => {

    console.log(`listening on ${PORT ?? 8080}`);
  });
}
