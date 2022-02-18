import nc from 'next-connect';
import db from '../../utils/db';
import data from '../../utils/data';
import Product from '../../models/Product';
import User from '../../models/User';
import Category from '../../models/Category';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  try {
    await User.deleteMany();
    await User.insertMany(data.users);
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await Category.deleteMany();
    await Category.insertMany(data.categories);
  } catch (err) {
    console.log(err);
  }
  db.disconnect();

  res.send({ message: 'seeded successfuly' });
});

export default handler;
