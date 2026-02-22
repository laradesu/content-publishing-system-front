import ComponentsAuthUserLoginForm from '@/components/auth/user/components-auth-userlogin-form';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'User Login',
};

const UserSignIn = () => {
    return (
        <div className="relative min-h-screen bg-[#060818]">
            {/* Background images */}
            <div className="absolute inset-0">
                <img
                    src="/assets/images/auth/bg-gradient.png"
                    alt="background"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-16">
                <img
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="decor"
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <img
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="decor"
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <img
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="decor"
                    className="absolute right-0 top-0 h-[300px]"
                />
                <img
                    src="/assets/images/auth/polygon-object.svg"
                    alt="decor"
                    className="absolute bottom-0 end-[28%]"
                />

                {/* Login card */}
                <div className="relative w-full max-w-[440px] rounded-xl bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl p-8 dark:bg-black/40 dark:border-white/10">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold uppercase text-primary md:text-4xl">
                            Sign in
                        </h1>
                        <p className="text-sm font-medium text-white mt-1 drop-shadow-md">
                            Enter your username and password to login
                        </p>

                    </div>

                    {/* Login form */}
                    <ComponentsAuthUserLoginForm />

                    {/* OR separator */}
                    <div className="relative my-8 text-center">
                        <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30 dark:bg-gray-600"></span>
                        <span className="relative bg-black/40 dark:bg-black/50 px-4 text-sm font-semibold uppercase text-gray-200 dark:text-gray-300">
                            or
                        </span>
                    </div>

                    {/* Social login buttons */}
                    {/* <div className="flex justify-center gap-4 mb-6">
                        {[
                            { icon: <IconGoogle />, color: 'bg-gradient-to-br from-red-500 to-blue-500' },
                            { icon: <IconFacebookCircle />, color: 'bg-gradient-to-br from-blue-600 to-blue-400' },
                            { icon: <IconInstagram />, color: 'bg-gradient-to-br from-pink-500 to-purple-500' },
                            { icon: <IconTwitter />, color: 'bg-gradient-to-br from-sky-500 to-blue-400' },
                        ].map((social, i) => (
                            <Link
                                key={i}
                                href="#"
                                className={`h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${social.color}`}
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div> */}

                    {/* Forgot password / Sign up */}
                    <div className="text-center text-sm text-black dark:text-gray-300">
                        <p className="mb-2">
                            Forgot your password?{' '}
                            <Link
                                href="#"
                                className="text-primary font-semibold underline transition hover:text-white"
                            >
                                Reset password
                            </Link>
                        </p>
                        {/* <p>
                            Don&apos;t have an account?{' '}
                            <Link
                                href="#"
                                className="text-primary font-semibold underline transition hover:text-white"
                            >
                                Sign up
                            </Link>
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSignIn;
