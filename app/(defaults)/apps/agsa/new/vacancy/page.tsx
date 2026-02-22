import ComponentsAgsaVacancies from '@/components/agsa/pages/new/vacancy/components-agsa-vacancy';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'vacancies',
};

const vacacies = () => {
    return <ComponentsAgsaVacancies />;
};

export default vacacies;
;
