import ComponentsAgsasComment from '@/components/agsa/pages/comment/ComponentsAgsasComment';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Comment',
};

const Comment = () => {
    return <ComponentsAgsasComment />;
};

export default Comment;
