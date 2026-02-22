import ComponentsAgsasShortBrief from '@/components/agsa/pages/document/short_brief/components-agsa-shortbrief';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'shortbrief',
};

const shortbrief = () => {
    return <ComponentsAgsasShortBrief />;
};

export default shortbrief;
