import ComponentsAgsaProfile from '@/components/agsa/pages/users/profile/components-agsa-profile';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Profile',
};

const Profile = () => {
    return <ComponentsAgsaProfile />;
};

export default Profile;
