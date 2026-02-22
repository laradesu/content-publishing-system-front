import ComponentsAgsasVideo from '@/components/agsa/pages/gallery/video/components-agsa-video';

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'video',
};

const video = () => {
    return <ComponentsAgsasVideo />;
};

export default video;
