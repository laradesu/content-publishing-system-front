import ComponentsAgsasProjectHealth from '@/components/agsa/pages/project/health/components-agsa-health';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'health',
};

const health = () => {
    return <ComponentsAgsasProjectHealth />;
};

export default health;
