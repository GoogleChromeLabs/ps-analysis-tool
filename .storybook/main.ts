/**
 * External dependencies.
 */
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../packages/**/src/**/stories/*.mdx',
    '../packages/**/src/**/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: require('postcss'),
        },
      },
    },
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
    //@todo find the right method to correct this error.
    // @ts-ignore this property exists on webpack RuleSetRule still ts is showing error.
    const fileLoaderRule = config?.module?.rules?.find(
      (rule) => rule.test && rule.test.test('.svg')
    );
    if (fileLoaderRule) {
      // @ts-ignore this property exists on webpack RuleSetRule still ts is showing error.
      fileLoaderRule.exclude = /\.svg$/;
    }

    config?.module?.rules?.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('@svgr/webpack'),
    });

    return config;
  },
};

export default config;
