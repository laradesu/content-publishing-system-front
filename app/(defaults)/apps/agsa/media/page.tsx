import ComponentsAgsasMedia from '@/components/agsa/pages/media/page';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Media',
};

const Media = () => {
    return <ComponentsAgsasMedia />;
};

export default Media;
