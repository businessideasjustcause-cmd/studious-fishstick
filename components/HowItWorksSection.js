import React from 'react';
import { Sparkles, ArrowRight, FileText, LayoutTemplate, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Set your requirements',
    description: 'Input your grade level, subject, standards, and topic. Define your unique needs and constraints.',
    icon: <LayoutTemplate className="w-10 h-10 text-blue-600" />,
  },
  {
    number: '02',
    title: 'Get your resource',
    description: 'Draft Studio generates complete resources. Review, customize, and adjust to perfection.',
    icon: <Sparkles className="w-10 h-10 text-blue-600" />,
  },
  {
    number: '03',
    title: 'Expand or export',
    description: 'Create related materials or download files in multiple formats for immediate use.',
    icon: <Download className="w-10 h-10 text-blue-600" />,
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase bg-blue-50 px-4 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="mt-4 text-5xl font-extrabold text-gray-950 tracking-tighter sm:text-6xl">
            How it <span className="text-blue-600">works</span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-gray-600 mx-auto">
            Create tailored teaching materials in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-blue-100 -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-blue-50 hover:border-blue-100 transition-all duration-300 group z-10"
            >
              {/* Icon Container with subtle animation */}
              <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              
              {/* Step Number */}
              <div className="absolute -top-5 left-8 bg-gray-950 text-white font-bold text-sm w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
                {step.number}
              </div>

              {/* Step Content */}
              <h3 className="text-2xl font-semibold text-gray-950">
                {step.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
