import ComponentsAgsasTestimonial from '@/components/agsa/pages/testimonial/components-agsa-testimonial';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'testimonial',
};

const testimonial = () => {
    return <ComponentsAgsasTestimonial />;
};

export default testimonial;
