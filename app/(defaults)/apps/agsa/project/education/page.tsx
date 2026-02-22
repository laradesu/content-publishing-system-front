import ComponentsAgsasProjectEducation from '@/components/agsa/pages/project/education/components-agsa-education';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'education',
};

const education = () => {
    return <ComponentsAgsasProjectEducation />;
};

export default education;
