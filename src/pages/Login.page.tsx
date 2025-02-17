import React from 'react';
import LoginForm from '@/components/Auth/Login';
import Footer from '@/components/Layouts/Footer';

export const LoginPage = () => {
  return (
    <>
      <div
        className="h-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/Login_image.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 bg-opacity-80 z-0" />
        <div className="relative z-10 md:absolute flex top-0 justify-center md:justify-start md:left-16">
          <a href="/">
            <img src="/images/netflix_logo.png" alt="Netflix" className="object-contain mt-10" />{' '}
          </a>
        </div>
        <div className="relative flex flex-col items-center justify-center h-screen text-white">
          <LoginForm />
        </div>
        <Footer />
      </div>
    </>
  );
};
