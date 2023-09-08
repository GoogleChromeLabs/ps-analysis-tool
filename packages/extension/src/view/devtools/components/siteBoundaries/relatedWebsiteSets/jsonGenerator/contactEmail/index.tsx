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
import React, { useCallback } from 'react';

/**
 * Internal dependencies
 */
import type { ContactEmailType } from '../types';
import { validateContactEmail } from '../utils';
import { RWSInput } from '../components';

interface ContactEmailProps {
  contact: ContactEmailType;
  setContact: (prev: (prev: ContactEmailType) => ContactEmailType) => void;
  validationFailed: boolean;
}

const ContactEmail = ({
  contact,
  setContact,
  validationFailed: errorOccured,
}: ContactEmailProps) => {
  const updateContact = useCallback(
    (contactEmail: string) => {
      contactEmail = contactEmail.trim();

      setContact((prev) => {
        const newContact = { ...prev };
        newContact.email = contactEmail;
        newContact.emailError = validateContactEmail(contactEmail);

        return newContact;
      });
    },
    [setContact]
  );

  return (
    <div className="my-4">
      <RWSInput
        inputLabel="Contact"
        inputPlaceholder="Email address or group alias if available"
        inputValue={contact.email}
        inputChangeHandler={(e) => updateContact(e.target.value)}
        error={contact.emailError}
        errorOccured={errorOccured}
      />
    </div>
  );
};

export default ContactEmail;
