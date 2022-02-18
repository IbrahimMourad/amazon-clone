import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { onError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({ onError });

handler.use(isAuth);

handler.get(async (req, res) => {
  if (req.user.isAdmin) {
    await db.connect();

    const products = await Product.find({});

    await db.disconnect();

    res.status(200).send(products);
  } else {
    res.status(401).send('Unauthorized Access');
  }
});

export default handler;
