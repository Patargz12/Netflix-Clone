import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Content from '@/components/Cms/Content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Faq from '../components/Cms/Faq';
import Footer from '../components/Layouts/Footer';
import GuestNavbar from '../components/Layouts/GuestNavbar';

export function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <>
      <div className="bg-black">
        <section>
          <div
            className="h-screen bg-cover bg-center relative"
            style={{ backgroundImage: "url('/images/Hero_Image.png')" }}
          >
            {/* Top Shadow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent h-2/4 z-1" />

            {/* Bottom Shadow Gradient */}
            <div className="absolute inset-x-0 bg-gradient-to-t from-black via-transparent to-transparent h-2/4 bottom-0 z-1" />

            <div className="absolute inset-0 bg-opacity-80 z-1" />
            <GuestNavbar />
            <div className="relative z-10 flex flex-col px-4 items-start lg:items-center justify-center h-screen px-18 text-white">
              <h1 className="text-5xl font-bold mb-4">Unlimited Movies, TV Shows, and more.</h1>
              <p className="text-lg mt-2">Watch anywhere, Cancel Anytime.</p>
              <p className="text-md mt-6">
                Ready to watch? Enter your email to create or restart your membership.{' '}
              </p>
              <div className="flex flex-col md:flex-row space-x-0 space-y-4 md:space-y-0 md:space-x-6 mt-3">
                <Input
                  variant="secondary"
                  type="email"
                  placeholder="Email address"
                  className="px-4 py-7 w-72"
                />
                <Button size="lg">Get Started</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="h-44 w-full bg-gradient-to-r from-[#000510] via-[#4e0b1c] to-[#000510]">
          <div className="flex justify-center items-center h-full space-x-4">
            <div>
              <img src="/public/images/popcorn_img.png" alt="popcorn_img" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">The Netflix you love for just $6.39</h1>
              <p className="text-white font-light">Get the started ads plan</p>
              <div className="flex flex-row items-center space-x-1 mt-2">
                <a href="#" className="underline text-blue-500 ">
                  Learn More
                </a>
                <ChevronRight className="text-blue-500" />
              </div>
            </div>
          </div>
        </section>
        <section>
          <Content
            title="Enjoy on your TV"
            description="Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
            imageSrc="/images/TV.png"
            imageAlt="TV showing Netflix interface"
          />

          <Content
            title="Watch Everywhere"
            description="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
            imageSrc="/images/devices.png"
            imageAlt="Mobile device showing downloads"
            reversed
          />

          <Content
            title="Create profiles for kids"
            description="Send kids on adventures with their favorite characters in a space made just for them—free with your membership."
            imageSrc="/images/Kids.png"
            imageAlt="Mobile device showing downloads"
          />

          <Content
            title="Download your shows to watch offline."
            description="Watch on a plane, train or submarine..."
            imageSrc="/images/Ipad.png"
            imageAlt="Mobile device showing downloads"
            reversed
          />
        </section>
        <section className="w-full px-2 md:px-0 py-16 md:py-24">
          <Faq />

          <div className="mt-12 text-center px-8 md:px-0">
            <p className="mb-4 text-lg text-white md:text-xl">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 md:flex-row md:justify-center"
            >
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-black/30 text-lg text-white placeholder:text-gray-400 md:min-w-[400px] w-full md:w-1/5"
                required
              />
              <Button type="submit" size="lg">
                Get Started
                <ChevronRight className="ml-2 h-10 w-10" />
              </Button>
            </form>
          </div>
        </section>
        <section>
          <Footer />
        </section>
      </div>
    </>
  );
}
