import ComponentsAgsaCompany from '@/components/agsa/pages/company/ComponentsAgsaCompany';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Company',
};

const company = () => {
    return <ComponentsAgsaCompany />;
};

export default company;