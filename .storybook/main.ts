/**
 * External dependencies.
 */
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: [
    '../packages/design-system/src/**/stories/*.mdx',
    '../packages/design-system/src/**/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/extension/src/**/stories/*.mdx',
    '../packages/extension/src/**/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          // Replaces existing CSS rules to support PostCSS
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                // Gets options from `postcss.config.js` in your project root
                loader: 'postcss-loader',
                options: { implementation: require.resolve('postcss') },
              },
            ],
          },
        ],
      },
    },
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: (config) => {
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    const fileLoaderRule = config?.module?.rules?.find((rule) => {
      const test = (rule as RuleSetRule)?.test;
      if (typeof test === 'string' && test.includes('.svg')) {
        return true;
      }
      return false;
    });
    if (fileLoaderRule) {
      // @ts-ignore this property exists on webpack RuleSetRule still ts is showing error.
      fileLoaderRule.exclude = /\.svg$/;
    }

    config?.module?.rules?.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('@svgr/webpack'),
    });

    config.resolve = {
      // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
      exportsFields: ['customExports', 'exports'],
      extensions: ['.ts', '.tsx', '.js'],
      fallback: {
        path: false,
        fs: false,
      },
    };

    return config;
  },
};
export default config;
