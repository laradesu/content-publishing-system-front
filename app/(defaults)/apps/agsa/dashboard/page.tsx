import ComponentsAgsasAbouts from '@/components/agsa/pages/about/components-agsa-abouts';
import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Abouts',
};

const dashboard = () => {
    return <ComponentsDashboardSales />;
};

export default dashboard;
