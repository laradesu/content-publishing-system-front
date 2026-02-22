import ComponentsAgsasSourceofFinance from '@/components/agsa/pages/source_of_finance/components-agsa-source_of_finance';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'SourceofFinace',
};

const sourceofFinance = () => {
    return <ComponentsAgsasSourceofFinance />;
};

export default sourceofFinance;
