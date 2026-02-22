import ComponentsAgsasNews from '@/components/agsa/pages/new/new/components-agsa-new';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'new',
};

const news = () => {
    return <ComponentsAgsasNews />;
};

export default news;
