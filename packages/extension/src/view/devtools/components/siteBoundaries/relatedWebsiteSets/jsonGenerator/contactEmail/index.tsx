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

/**
 * Internal dependencies
 */
import type { ContactEmailType } from '../types';
import { RWSInput } from '../components';
import { I18n } from '@ps-analysis-tool/i18n';

interface ContactEmailProps {
  contact: ContactEmailType;
  setContact: (value: string) => void;
  validationFailed: boolean;
}

const ContactEmail = ({
  contact,
  setContact,
  validationFailed: formValidationFailed,
}: ContactEmailProps) => {
  return (
    <div className="my-4">
      <RWSInput
        inputLabel={I18n.getMessage('extContact')}
        inputPlaceholder={I18n.getMessage('extContactNote')}
        inputValue={contact.email}
        inputChangeHandler={(e) => setContact(e.target.value)}
        error={contact.emailError}
        formValidationFailed={formValidationFailed}
      />
    </div>
  );
};

export default ContactEmail;
