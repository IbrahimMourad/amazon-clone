import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { onError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({ onError });

handler.use(isAuth);

handler.post(async (req, res) => {
  if (req.user.isAdmin) {
    await db.connect();

    const newProduct = new Product({
      ...req.body,
      user: req.user._id,
      userName: req.user.name,
      email: req.user.email,
    });

    const product = await newProduct.save();

    res.status(201).send(product);
  } else {
    res.status(401).send('Unauthorized Access');
  }
});

export default handler;
