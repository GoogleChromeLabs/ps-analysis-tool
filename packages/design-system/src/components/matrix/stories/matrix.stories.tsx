/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import Matrix from '..';

const meta: Meta<typeof Matrix> = {
  title: 'DesignSystem/Matrix',
  component: Matrix,
  tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: {
    dataComponents: [
      {
        count: 7,
        color: '#5CC971',
        countClassName: 'text-functional',
        description:
          'These are essential cookies that are necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size), etc.',
        title: 'Functional',
        isExpanded: true,
        containerClasses: '',
      },
      {
        count: 9,
        color: '#F3AE4E',
        countClassName: 'text-marketing',
        description:
          "They are used to track visitors across websites to gather information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
        title: 'Marketing',
        isExpanded: true,
        containerClasses: '',
      },
      {
        count: 2,
        color: '#4C79F4',
        countClassName: 'text-analytics',
        description:
          'Used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site. This data helps website owners understand and improve the user experience, optimize content, and identify areas for enhancement.',
        title: 'Analytics',
        isExpanded: true,
        containerClasses: '',
      },
      {
        count: 23,
        color: '#EC7159',
        countClassName: 'text-uncategorized',
        description:
          'We are unable to categorize certain cookies since we do not possess any relevant information about them. Nonetheless, you may visit sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
        title: 'Uncategorized',
        isExpanded: true,
        containerClasses: '',
      },
    ],
  },
};
