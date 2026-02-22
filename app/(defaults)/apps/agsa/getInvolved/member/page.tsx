import ComponentsAgsasMember from '@/components/agsa/pages/get_involved/member/components-agsa-member';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Member',
};

const memebr = () => {
    return <ComponentsAgsasMember />;
};

export default memebr;
