import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';
import BoxedSignIn from './(auth)/auth/boxed-signin/page';
import UserSignIn from './(auth)/auth/user/page';

export const metadata: Metadata = {
    title: 'Admin  Dashboard',
};

const BoxedSignIn1 = () => {
    return <UserSignIn />;
};

export default BoxedSignIn1;
