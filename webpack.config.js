const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    bundle: "./src/index.ts",
    clone: "./src/clone.ts",
    isNil: "./src/isNil.ts",
    isNumber: "./src/isNumber.ts",
    isBoolean: "./src/isBoolean.ts",
    isString: "./src/isString.ts",
    isDate: "./src/isDate.ts",
    isRegex: "./src/isRegex.ts",
    isFunction: "./src/isFunction.ts",
    isPrimitive: "./src/isPrimitive.ts",
    types: "./src/types.ts",
    formatFromStore: "./src/formatFromStore.ts",
    formatToStore: "./src/formatToStore.ts",
  },
  output: {
    path: path.resolve(__dirname),//'lib'
    filename: ({ chunk: { name } }) => {
      if (name.includes('worker')) {
        return `${name}.worker.js`;
      }

      return `${name}.js`;
    },
    libraryTarget: 'umd',
    library: 'json-storage-formatter',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'json-storage-formatter': path.resolve(
        __dirname,
        'node_modules/json-storage-formatter/package.json'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
              plugins: [
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-export-namespace-from',
              ],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
   optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
