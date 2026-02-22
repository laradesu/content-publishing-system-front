import ComponentsAgsasReport from '@/components/agsa/pages/document/report/components-agsa-report';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'report',
};

const report = () => {
    return <ComponentsAgsasReport />;
};

export default report;
