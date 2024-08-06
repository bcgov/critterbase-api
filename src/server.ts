import { makeApp } from './app';
import { IS_DEV, IS_PROD, PORT } from './utils/constants';
import { db } from './utils/database';

if (IS_DEV || IS_PROD) {
  makeApp(db).listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });
}
