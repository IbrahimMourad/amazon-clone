import NextLink from 'next/link';
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
import Products from '../models/Product';
import db from '../utils/db';
export default function Home({ products }) {
  return (
    <div>
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
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Layout>
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
