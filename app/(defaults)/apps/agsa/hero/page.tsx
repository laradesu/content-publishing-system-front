import ComponentsAgsasHero from '@/components/agsa/pages/hero/components-agsa-hero';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'hero',
};

const Hero = () => {
    return <ComponentsAgsasHero />;
};

export default Hero;
