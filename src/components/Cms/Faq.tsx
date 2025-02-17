'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqData = [
  {
    question: 'What is Netflix?',
    answer:
      'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.',
  },
  {
    question: 'How much does Netflix cost?',
    answer:
      'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $19.99 a month. No extra costs, no contracts.',
  },
  {
    question: 'Where can I watch?',
    answer:
      'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.',
  },
  {
    question: 'How do I cancel?',
    answer:
      'Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.',
  },
  {
    question: 'What can I watch on Netflix?',
    answer:
      'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.',
  },
  {
    question: 'Is Netflix good for kids?',
    answer:
      'The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls to ensure a safe viewing experience for kids.',
  },
];

export default function FAQSection() {
  return (
    <section className="">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-5xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="mb-2 border-none">
              <AccordionTrigger className="flex w-full items-center justify-between bg-[#2D2D2D] px-6 py-6 text-left text-lg text-white hover:no-underline md:text-2xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="bg-[#2D2D2D] px-6 pb-6 text-lg text-white md:text-xl">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
