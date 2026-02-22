import ComponentsAgsasBoradMember from '@/components/agsa/pages/assembly/board_member/components-agsa-bordmember';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Borad Member',
};

const boradmember = () => {
    return <ComponentsAgsasBoradMember />;
};

export default boradmember;
