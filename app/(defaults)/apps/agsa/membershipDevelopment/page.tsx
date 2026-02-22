import ComponentsAgsasMembershipDevelopment from '@/components/agsa/pages/membership_development/components-agsa-membership-development';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Membership Development',
};

const membershipDevelopment = () => {
    return <ComponentsAgsasMembershipDevelopment />;
};

export default membershipDevelopment;
