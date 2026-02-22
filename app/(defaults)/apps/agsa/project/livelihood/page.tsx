import ComponentsAgsasProjectLivelihood from '@/components/agsa/pages/project/livelihood/components-agsa-livelihood';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'livelihood',
};

const livelihood = () => {
    return <ComponentsAgsasProjectLivelihood />;
};

export default livelihood;
