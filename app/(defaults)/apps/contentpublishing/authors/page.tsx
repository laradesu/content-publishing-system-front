
import ComponentsContentPublishingAuthor from '@/components/contentpublishing/pages/authors/ComponentsContentPublishing';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Borad Member',
};

const author = () => {
    return <ComponentsContentPublishingAuthor />;
};

export default author;