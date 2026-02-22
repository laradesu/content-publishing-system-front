import ComponentsAgsaMap from '@/components/agsa/pages/map/ComponentsAgsaMap';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Map',
};

const map = () => {
    return <ComponentsAgsaMap />;
};

export default map;