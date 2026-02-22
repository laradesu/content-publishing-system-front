import ComponentsAgsasUserRegister from '@/components/agsa/pages/users/register/components-agsa-register';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'user register',
};

const UserRegister = () => {
    return <ComponentsAgsasUserRegister />;
};

export default UserRegister;
