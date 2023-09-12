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
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/user-event';

/**
 * Internal dependencies.
 */
import RWSJsonGenerator from '..';
import createPrimaryOutput from '../utils/createOutput';
import type {
  AssociatedSiteType,
  CountrySiteType,
  ServiceSiteType,
} from '../types';
import JsonOutput from '../jsonOutput';

describe('RWSJsonGenerator', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('should render form', () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    expect(
      screen.getByText('Related Website Sets JSON Generator')
    ).toBeInTheDocument();
  });

  it('should interact with contact email and primary domain', async () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });

    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Contact can't be blank")
    ).toBeInTheDocument();

    const contactInput = screen.getByPlaceholderText(
      'Email address or group alias if available'
    );

    fireEvent.change(contactInput, {
      target: { value: 'hello@gmail.com' },
    });

    expect(contactInput).toHaveValue('hello@gmail.com');

    expect(await screen.findByText("Url can't be blank")).toBeInTheDocument();

    const primaryDomainInput = screen.getByPlaceholderText(
      'https://primary.com'
    );

    fireEvent.change(primaryDomainInput, {
      target: { value: 'https://primary.com' },
    });

    expect(primaryDomainInput).toHaveValue('https://primary.com');
  });

  it('should interact with associated sites input', async () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    const addAssociatedSiteButton = screen.getAllByRole('button', {
      name: 'Add',
    })[0];

    fireEvent.click(addAssociatedSiteButton);

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });

    fireEvent.click(submitButton);

    expect(
      (await screen.findAllByText("Url can't be blank"))[1]
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Rationale can't be blank")
    ).toBeInTheDocument();

    const domainInput = screen.getByPlaceholderText('https://associated.com');

    fireEvent.change(domainInput, {
      target: { value: 'https://associated.com' },
    });

    expect(domainInput).toHaveValue('https://associated.com');

    const rationaleInput = screen.getByPlaceholderText(
      'Connected to the primary domain because...'
    );

    fireEvent.change(rationaleInput, {
      target: {
        value: "Connected to the primary domain because it's a subset",
      },
    });

    expect(rationaleInput).toHaveValue(
      "Connected to the primary domain because it's a subset"
    );

    const removeButton = screen.getByRole('button', {
      name: 'Remove',
    });

    fireEvent.click(removeButton);

    expect(screen.queryByText('Associated Domain #1')).not.toBeInTheDocument();
  });

  it('should interact with service sites input', async () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    const addServiceSiteButton = screen.getAllByRole('button', {
      name: 'Add',
    })[1];

    fireEvent.click(addServiceSiteButton);

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });

    fireEvent.click(submitButton);

    expect(
      (await screen.findAllByText("Url can't be blank"))[1]
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Rationale can't be blank")
    ).toBeInTheDocument();

    const domainInput = screen.getByPlaceholderText('https://service.com');

    fireEvent.change(domainInput, {
      target: { value: 'https://service.com' },
    });

    expect(domainInput).toHaveValue('https://service.com');

    const rationaleInput = screen.getByPlaceholderText(
      'Connected to the primary domain because...'
    );

    fireEvent.change(rationaleInput, {
      target: {
        value: "Connected to the primary domain because it's a service",
      },
    });

    const removeButton = screen.getByRole('button', {
      name: 'Remove',
    });

    fireEvent.click(removeButton);

    expect(screen.queryByText('Service Domain #1')).not.toBeInTheDocument();
  });

  it('should interact with country sites input', async () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    const addCountrySiteButton = screen.getAllByRole('button', {
      name: 'Add',
    })[2];

    fireEvent.click(addCountrySiteButton);

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });

    fireEvent.click(submitButton);

    expect(
      (await screen.findAllByText("Url can't be blank"))[1]
    ).toBeInTheDocument();

    expect(
      (await screen.findAllByText("Url can't be blank"))[2]
    ).toBeInTheDocument();

    const domainInput = screen.getByPlaceholderText('https://cctld.com');

    fireEvent.change(domainInput, {
      target: { value: 'https://cctld.com' },
    });

    expect(domainInput).toHaveValue('https://cctld.com');

    const addAssociatedSiteButton = screen.getAllByRole('button', {
      name: 'Add',
    })[0];

    fireEvent.click(addAssociatedSiteButton);

    const associatedDomainInput = screen.getByPlaceholderText(
      'https://associated.com'
    );

    fireEvent.change(associatedDomainInput, {
      target: { value: 'https://associated.com' },
    });

    const rationaleInput = screen.getByPlaceholderText(
      'Connected to the primary domain because...'
    );

    fireEvent.change(rationaleInput, {
      target: {
        value: "Connected to the primary domain because it's a subset",
      },
    });

    const select = screen.getByRole('combobox');

    fireEvent.change(select, {
      target: { value: 'https://associated.com' },
    });

    expect(select).toHaveValue('https://associated.com');

    fireEvent.change(associatedDomainInput, {
      target: { value: 'https://associated1.com' },
    });

    expect(select).toHaveValue('');

    const removeButton = screen.getAllByRole('button', {
      name: 'Remove',
    })[1];

    fireEvent.click(removeButton);

    expect(screen.queryByText('ccTLD #1')).not.toBeInTheDocument();
  });

  it('should reset form', () => {
    const screen = render(<RWSJsonGenerator open={true} />);

    const contactInput = screen.getByPlaceholderText(
      'Email address or group alias if available'
    );

    fireEvent.change(contactInput, {
      target: { value: 'hello@gmail.com' },
    });

    const primaryDomainInput = screen.getByPlaceholderText(
      'https://primary.com'
    );

    fireEvent.change(primaryDomainInput, {
      target: { value: 'https://primary.com' },
    });

    const resetButton = screen.getByRole('button', {
      name: 'Reset',
    });

    fireEvent.click(resetButton);

    expect(contactInput).toHaveValue('');
    expect(primaryDomainInput).toHaveValue('');
  });

  it('should output json resources', () => {
    const contact = 'hello@gmail.com';
    const primaryDomain = 'https://primary.com';
    const associatedSites = [
      {
        url: 'https://associated.com',
        rationale: "Connected to the primary domain because it's a subset",
      },
    ];
    const serviceSites = [
      {
        url: 'https://service.com',
        rationale: "Connected to the primary domain because it's a service",
      },
    ];
    const countrySites = [
      {
        site: 'https://associated.com',
        cctld: 'https://associated.co.uk',
      },
    ];

    const result = createPrimaryOutput(
      contact,
      primaryDomain,
      associatedSites as AssociatedSiteType[],
      serviceSites as ServiceSiteType[],
      countrySites as CountrySiteType[]
    );

    render(
      <JsonOutput
        primaryWellKnownOutput={result}
        otherWellKnownOutput={{
          primary: primaryDomain,
        }}
      />
    );

    expect(result).toStrictEqual({
      contact,
      primary: primaryDomain,
      associatedSites: ['https://associated.com'],
      serviceSites: ['https://service.com'],
      rationaleBySite: {
        'https://associated.com':
          "Connected to the primary domain because it's a subset",
        'https://service.com':
          "Connected to the primary domain because it's a service",
      },
      ccTLDs: {
        'https://associated.com': ['https://associated.co.uk'],
      },
    });
  });
});
