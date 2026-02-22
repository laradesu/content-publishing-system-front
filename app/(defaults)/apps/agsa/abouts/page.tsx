import ComponentsAgsasAbouts from '@/components/agsa/pages/about/components-agsa-abouts';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Abouts',
};

const abouts = () => {
    return <ComponentsAgsasAbouts />;
};

export default abouts;
