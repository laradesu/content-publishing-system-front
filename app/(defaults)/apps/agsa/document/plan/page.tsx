import ComponentsAgsasPlan from '@/components/agsa/pages/document/plan/components-agsa-plan';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'plan',
};

const plan = () => {
    return <ComponentsAgsasPlan />;
};

export default plan;
