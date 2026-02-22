import ComponentsAgsasVolunteer from '@/components/agsa/pages/get_involved/volunteer/components-agsa-volunteer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Volunteer',
};

const volunteer = () => {
    return <ComponentsAgsasVolunteer />;
};

export default volunteer;
