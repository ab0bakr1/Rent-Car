"use client";

import React from 'react'
import { useTheme } from "next-themes";
import { bgHeroDark, bgHeroLight } from '../../../public/assets/images/images';
import From from '../molecules/From';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

export default function Hero() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const bgImage = isDark ? bgHeroDark.src : bgHeroLight.src;

    return (
        <section 
            className='h-screen w-full bg-cover bg-center bg-no-repeat relative' 
            style={{ backgroundImage: `url(${bgImage})` }}
        >  
            <div className='container h-full w-full flex items-center relative'>
                <div className='flex flex-col justify-center w-full lg:w-1/2 translate-y-20 p-10 relative z-10'>
                    <Title size="lg" variant='primary' className='mb-4 font-bold lg:text-7xl'>استأجر الفخامة، قد التميز</Title>
                    <Text size="lg" variant='secondary' className='mb-4 lg:text-2xl'>احصل على تجربة قيادة لا تُنسى مع أسطول سياراتنا المتنوع</Text>
                    <div className="ds-bg-alt ds-rounded-lg ds-border-md p-5 relative z-10">
                        <From />
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 h-full w-full z-0 bg-white/10 dark:bg-black/20" />
        </section>
    )
}