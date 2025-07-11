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
import { BLOCK_STATUS, type CookieTableData } from '@google-psat/common';
import {
  InboundIcon,
  OutboundIcon,
  OutboundInboundColoredIcon,
  OutboundInboundIcon,
  QuestionMark,
  GreenTick,
  type TableRow,
} from '@google-psat/design-system';

const NamePrefixIconSelector = ({ originalData }: TableRow) => {
  const data = originalData as CookieTableData;

  const isDomainInAllowList = data?.isDomainInAllowList;
  if (isDomainInAllowList) {
    return <GreenTick />;
  }

  const isInboundBlocked =
    data?.blockingStatus?.inboundBlock !== undefined &&
    data.blockingStatus.inboundBlock !== BLOCK_STATUS.NOT_BLOCKED;
  const isInboundBlockedInAll =
    data?.blockingStatus?.inboundBlock === BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS;

  const isOutboundBlocked =
    data?.blockingStatus?.outboundBlock !== undefined &&
    data.blockingStatus.outboundBlock !== BLOCK_STATUS.NOT_BLOCKED;
  const isOutboundBlockedInAll =
    data?.blockingStatus?.outboundBlock === BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS;

  const hasValidBlockedReason =
    data?.blockedReasons && data.blockedReasons.length !== 0;

  if (!hasValidBlockedReason) {
    if (isInboundBlocked || isOutboundBlocked) {
      return <QuestionMark />;
    }

    return <></>;
  }

  if (isInboundBlocked && isOutboundBlocked) {
    if (isInboundBlockedInAll && isOutboundBlockedInAll) {
      return (
        <OutboundInboundIcon className="[&_line]:stroke-[#D8302F] scale-150" />
      );
    }

    if (!isInboundBlockedInAll && !isOutboundBlockedInAll) {
      return (
        <OutboundInboundIcon className="[&_line]:stroke-[#FE8455] scale-150" />
      );
    }

    if (isInboundBlockedInAll) {
      return <OutboundInboundColoredIcon className="rotate-180 scale-150" />;
    }

    return <OutboundInboundColoredIcon className="scale-150" />;
  }

  if (isInboundBlocked) {
    if (isInboundBlockedInAll) {
      return <InboundIcon className="[&_line]:stroke-[#D8302F] scale-150" />;
    }
    return <InboundIcon className="[&_line]:stroke-[#FE8455] scale-150" />;
  }

  if (isOutboundBlocked) {
    if (isOutboundBlockedInAll) {
      return <OutboundIcon className="[&_line]:stroke-[#D8302F] scale-150" />;
    }
    return <OutboundIcon className="[&_line]:stroke-[#FE8455] scale-150" />;
  }

  return <></>;
};

export default NamePrefixIconSelector;
