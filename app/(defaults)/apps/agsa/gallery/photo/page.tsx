import ComponentsAgsasphoto from '@/components/agsa/pages/gallery/photo/components-agsa-photo';

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'photo',
};

const photo = () => {
    return <ComponentsAgsasphoto />;
};

export default photo;
