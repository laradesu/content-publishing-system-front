import ComponentsAgsasLongBrief from '@/components/agsa/pages/document/long_brief/components-agsa-longbrief';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'longbrief',
};

const longbrief = () => {
    return <ComponentsAgsasLongBrief />;
};

export default longbrief;
