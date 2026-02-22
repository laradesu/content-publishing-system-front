import ComponentsAgsasProgramManagement from '@/components/agsa/pages/program_management/components-agsa-program-management';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'ProgramManagement',
};

const programManagement = () => {
    return <ComponentsAgsasProgramManagement />;
};

export default programManagement;
