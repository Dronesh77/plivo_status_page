// next.config.mjs
export default {
    reactStrictMode: true,
    experimental: {
      turboMode: true,
    },
    webpack(config) {
      // Fix for known issue with PostCSS and lightningcss in Next.js
      config.module.rules.push({
        test: /\.css$/,
        use: ['postcss-loader'],
      });
      return config;
    },
  };
  