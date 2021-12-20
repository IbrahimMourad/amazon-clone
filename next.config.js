module.exports = {
  reactStrictMode: true,
  env: {
    PAYPAL_CLIENT_ID: // your paypal id here
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
