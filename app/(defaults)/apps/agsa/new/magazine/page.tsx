import ComponentsAgsaMagazines from '@/components/agsa/pages/new/magazine/components-agsa-magazine';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'magazines',
};

const magazines = () => {
    return <ComponentsAgsaMagazines />;
};

export default magazines;
