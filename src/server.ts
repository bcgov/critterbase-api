import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { db } from "./utils/database";
import { makeApp } from "./makeApp";

if (IS_DEV || IS_PROD) {
  makeApp(db).listen(PORT, () => {
    console.log(`listening on ${PORT ?? 8080}`);
  });
}
