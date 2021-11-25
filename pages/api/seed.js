import nc from 'next-connect';
import db from '../../utils/db';
import data from '../../utils/data';
import Product from '../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  await Product.deleteMany();
  await Product.insertMany(data.products);
  db.disconnect();

  res.send({ message: 'seeded successfuly' });
});

export default handler;
