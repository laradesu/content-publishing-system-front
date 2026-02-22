import ComponentsAgsasDonate from '@/components/agsa/pages/get_involved/donate/components-agsa-donate';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Donate',
};

const donate = () => {
    return <ComponentsAgsasDonate />;
};

export default donate;
