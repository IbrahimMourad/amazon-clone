import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Products from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';

export default function Home({ products }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [pageLoading, setPageLoading] = useState(true);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  useEffect(() => {
    // on first render and each update
    setTimeout(() => setPageLoading(false), 1500);
  });

  return (
    <div>
      {pageLoading ? (
        <Loading />
      ) : (
        <Layout>
          <h1>Products</h1>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} key={product.name}>
                <Card>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={product.image}
                        title={product.name}
                      />
                      <CardContent>
                        <Typography>{product.name}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </NextLink>
                  <CardActions>
                    <Typography>${product.price}</Typography>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => addToCartHandler(product)}
                    >
                      Add to cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Layout>
      )}
    </div>
  );
}
export const getServerSideProps = async () => {
  await db.connect();
  const products = await Products.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObject),
    },
  };
};
