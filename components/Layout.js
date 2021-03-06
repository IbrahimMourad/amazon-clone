import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';

import Loading from './Loading';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
    setAnchorEl(null);
  };

  // state for Loading Screen
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // on first render and on router dependency updates
    const handleStartLoader = () => {
      setPageLoading(true);
    };

    const handleCompleteLoader = () => {
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStartLoader);
    router.events.on('routeChangeComplete', handleCompleteLoader);
    router.events.on('routeChangeError', handleCompleteLoader);

    return () => {
      router.events.off('routeChangeStart', handleStartLoader);
      router.events.off('routeChangeComplete', handleCompleteLoader);
      router.events.off('routeChangeError', handleCompleteLoader);
    };
  }, [router]);
  useEffect(() => {
    // on first render  , it only runs once.
    window.addEventListener('load', () => {
      setTimeout(() => setPageLoading(false), 1300);
    });
  }, []);
  return (
    <>
      {pageLoading ? (
        <Loading />
      ) : (
        <div>
          <Head>
            <title>{title ? `${title} - Matjari` : 'Matjari'}</title>
            {description && (
              <meta name="description" content={description}></meta>
            )}
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" className={classes.navbar}>
              <Toolbar>
                <NextLink href="/" passHref>
                  <Link>
                    <Typography className={classes.brand}>Matjari</Typography>
                  </Link>
                </NextLink>
                <div className={classes.grow}></div>
                <div>
                  <Switch
                    checked={darkMode}
                    onChange={darkModeChangeHandler}
                  ></Switch>

                  {userInfo?.isAdmin ? (
                    <NextLink href="/admin/add" passHref>
                      <Link>Add Item</Link>
                    </NextLink>
                  ) : null}

                  <NextLink href="/cart" passHref>
                    <Link>
                      {cart.cartItems.length > 0 ? (
                        <Badge
                          color="secondary"
                          badgeContent={cart.cartItems.length}
                        >
                          Cart
                        </Badge>
                      ) : (
                        'Cart'
                      )}
                    </Link>
                  </NextLink>

                  {userInfo ? (
                    <>
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={loginClickHandler}
                        className={classes.navbarButton}
                      >
                        {userInfo.name}
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem
                          onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, '/order-history')
                          }
                        >
                          Order History
                        </MenuItem>
                        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <NextLink href="/login" passHref>
                      <Link>Login</Link>
                    </NextLink>
                  )}
                </div>
              </Toolbar>
            </AppBar>
            <Container className={classes.main}>{children}</Container>
            <footer className={classes.footer}>
              <Typography>All rights reserved. Matjari.</Typography>
            </footer>
          </ThemeProvider>
        </div>
      )}
    </>
  );
}
