
import ComponentsContentPublishingArticles from '@/components/contentpublishing/pages/articles/ComponentsContentPublishingArticles';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Articles',
};

const article = () => {
    return <ComponentsContentPublishingArticles />;
};

export default article;