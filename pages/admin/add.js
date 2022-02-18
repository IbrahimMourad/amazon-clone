import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';

import Layout from '../../components/Layout';

import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';

const AddProduct = () => {
  const fileRef = useRef();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    // if not admin redirect to home
    if (!userInfo.isAdmin) {
      router.push('/');
    }
  }, []);

  const fileUploadHandler = async (e) => {
    const form = e.target;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === 'image'
    );
    const formData = new FormData();
    for (const file of fileInput.files) {
      formData.append('file', file);
    }
    formData.append('upload_preset', 'matjari-uploads');

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/matjari/image/upload`,
        formData
      );
      return data.secure_url;
    } catch (error) {
      getError(error);
    }
  };

  const submitHandler = async (productData, e) => {
    closeSnackbar();

    const image = await fileUploadHandler(e);

    try {
      const { data } = await axios.post(
        '/api/admin',
        { ...productData, image },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      enqueueSnackbar(`(${productData.name}) added.`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Add new product">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={classes.form}
        autoComplete="off"
      >
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <div style={{ padding: '0 14px' }}>
          {/* Grid Container Start*/}
          <Grid container spacing={3}>
            {/* Product Name */}
            <Grid xs={12} md={4} item>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Product Name"
                    error={Boolean(errors.name)}
                    helperText={
                      errors.name
                        ? errors.name.type === 'minLength'
                          ? 'Product name length is more than 1'
                          : 'Product name is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Slug */}
            <Grid xs={12} md={4} item>
              <Controller
                name="slug"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="slug"
                    label="Product Slug"
                    error={Boolean(errors.slug)}
                    helperText={
                      errors.slug
                        ? errors.slug.type === 'minLength'
                          ? 'Product Slug length is more than 1'
                          : 'Product Slug is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Category */}
            <Grid xs={12} md={4} item>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="category"
                    label="Product Category"
                    error={Boolean(errors.category)}
                    helperText={
                      errors.category
                        ? errors.category.type === 'minLength'
                          ? 'Product Category length is more than 1'
                          : 'Product Category is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Price */}
            <Grid xs={12} md={4} item>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{
                  required: true,

                  min: 1,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="number"
                    id="price"
                    label="Product Price"
                    error={Boolean(errors.price)}
                    helperText={
                      errors.price
                        ? errors.price.type === 'min'
                          ? 'Product Price length is more than 0'
                          : 'Product Price is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Brand */}
            <Grid xs={12} md={4} item>
              <Controller
                name="brand"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="brand"
                    label="Product Brand"
                    error={Boolean(errors.brand)}
                    helperText={
                      errors.brand
                        ? errors.brand.type === 'minLength'
                          ? 'Product Brand length is more than 1'
                          : 'Product Brand is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product CountInStock */}
            <Grid xs={12} md={4} item>
              <Controller
                name="countInStock"
                control={control}
                defaultValue=""
                rules={{
                  required: true,

                  min: 1,
                }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    variant="outlined"
                    fullWidth
                    id="countInStock"
                    label="Count In Stock"
                    error={Boolean(errors.countInStock)}
                    helperText={
                      errors.countInStock
                        ? errors.countInStock.type === 'min'
                          ? 'Product Count In Stock should be more than 0'
                          : 'Product Count In Stock is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Description */}
            <Grid xs={12} md={8} item>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  maxLength: 250,
                  min: 1,
                }}
                render={({ field }) => (
                  <TextField
                    multiline
                    rows={2}
                    maxRows={4}
                    type="text"
                    variant="outlined"
                    fullWidth
                    id="description"
                    label="Description"
                    error={Boolean(errors.description)}
                    helperText={
                      errors.description
                        ? errors.description.type === 'maxLength'
                          ? 'Description should not be more than 250 characters long'
                          : 'Description is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Product Image */}
            <Grid xs={12} md={4} item>
              <Controller
                name="image"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                }}
                render={({ field, ref }) => (
                  <TextField
                    type="file"
                    variant="outlined"
                    fullWidth
                    id="image"
                    inputRef={ref}
                    error={Boolean(errors.image)}
                    helperText={errors.image ? 'Product Image is required' : ''}
                    {...field}
                  />
                )}
              />
            </Grid>
            {/* Grid Container end*/}
          </Grid>
        </div>

        <List>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Add to store
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default AddProduct;
