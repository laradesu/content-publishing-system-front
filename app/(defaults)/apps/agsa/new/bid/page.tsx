import ComponentsAgsaBids from '@/components/agsa/pages/new/bid/components-agsa-bid';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'bids',
};

const bids = () => {
    return <ComponentsAgsaBids />;
};

export default bids;
