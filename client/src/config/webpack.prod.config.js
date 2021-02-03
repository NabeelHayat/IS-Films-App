import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import config from './webpack.config.js';

const { plugins } = config;

// config.optimization = {
//   minimize: true,
//   minimizer: [
//     new TerserPlugin({
//       terserOptions: {
//         compress: {
//           drop_console: true,
//         },
//         output: {
//           comments: false,
//         },
//       },
//       sourceMap: true,
//     }),
//   ],
// };

plugins.push(new BundleAnalyzerPlugin({
  analyzerMode: 'static',
}));

export default config;
