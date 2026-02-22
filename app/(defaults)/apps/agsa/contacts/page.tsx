import ComponentsAgsasContactUs from '@/components/agsa/pages/contact/components-agsa-contactus';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'ContactUs',
};

const contactsUs = () => {
    return <ComponentsAgsasContactUs />;
};

export default contactsUs;
