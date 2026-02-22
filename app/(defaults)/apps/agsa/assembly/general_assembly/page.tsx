
import ComponentsAgsasGeneralAssembly from '@/components/agsa/pages/assembly/general_assembly/ComponentsAgsasGeneralAssembly';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Borad Member',
};

const generalAssembly = () => {
    return <ComponentsAgsasGeneralAssembly />;
};

export default generalAssembly;