import { Link } from 'react-router-dom';
import useScrollReveal from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";

import {
  BookOpen,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const featuresReveal = useScrollReveal();
  const principlesReveal = useScrollReveal();

  // Detect dark mode
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkQuery.addEventListener('change', handler);

    return () => darkQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img
                src="/src/assets/logo.avif"
                alt="Haridwar University Logo"
                className="w-[140px] h-[42px] sm:w-[160px] sm:h-[48px] object-contain"
              />
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {["features", "about", "contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: "url('/src/assets/HeroImage.avif')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70"></div>

        {/* Sidebar */}
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className={`absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          />
          {/* Sidebar Panel */}
          <div
            className={`absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-l-3xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <img
                src="/src/assets/logo.avif"
                className="w-[120px] object-contain"
                alt="Logo"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            {/* Navigation */}
            <nav className="p-6">
              <ul className="space-y-4">
                {["Features", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all duration-200 font-medium"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li className="pt-6">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center rounded-xl py-3 font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-md"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>




  {/* Hero Content */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
    <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-8 animate-fade-in">
      Manage Your University <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
        With Excellence
      </span>
    </h1>
    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10 animate-slide-up">
      A comprehensive ERP solution designed for modern education. Streamline administration,
      enhance learning, and empower your campus community.
    </p>
    <div className="flex justify-center gap-4 animate-slide-up">
      <Link to="/login" className="btn btn-primary px-8 py-4 text-lg rounded-full">
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
      <a href="#features" className="btn btn-secondary px-8 py-4 text-lg rounded-full">
        Learn More
      </a>
    </div>
  </div>

</div>



              

      {/* Features */}
      <div id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-primary-600 font-semibold uppercase">Features</h2>
            <p className="text-3xl font-display font-bold">
              Everything you need to run your campus
            </p>
          </div>

          <div
            ref={featuresReveal.ref}
            className={`grid grid-cols-1 md:grid-cols-3 gap-12 transition-all duration-200
              ${featuresReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            {[
              {
                icon: Users,
                title: "Student Management",
                desc: "Complete lifecycle management from admission to alumni.",
              },
              {
                icon: BookOpen,
                title: "Academic Planning",
                desc: "Course scheduling and curriculum management.",
              },
              {
                icon: Award,
                title: "Examination & Results",
                desc: "Secure exams with automated evaluation.",
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{ transitionDelay: `${i * 120}ms` }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <f.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


           {/* About ERP Section */}
<div
  id="about"
  className="scroll-mt-24 py-28 bg-white dark:bg-gray-900"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <div className="text-center mb-20">
      <h2 className="text-primary-600 font-semibold tracking-wider uppercase">
        About the System
      </h2>
      <p className="mt-3 text-4xl font-display font-bold text-gray-900 dark:text-white">
        ERP Management System for Modern Education
      </p>
      <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
        A centralized and scalable ERP solution designed to streamline
        academic and administrative operations.
      </p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

      {/* Left Content */}
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-7 w-7 text-primary-600 mt-1" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            A unified digital platform that replaces fragmented and
            manual institutional processes.
          </p>
        </div>

        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-7 w-7 text-primary-600 mt-1" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Automates workflows and centralizes data to improve efficiency,
            accuracy, and transparency.
          </p>
        </div>

        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-7 w-7 text-primary-600 mt-1" />
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Built on role-based access to enable secure collaboration
            among all stakeholders.
          </p>
        </div>
      </div>

      {/* Right Design Principles */}
      <div
            ref={principlesReveal.ref}
           
            className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all duration-500
              ${ principlesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
      

        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm">
          <Users className="h-10 w-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Role-Based Architecture
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Secure access aligned with defined user roles.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm">
          <BookOpen className="h-10 w-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Centralized Information
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Single source of reliable institutional data.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm">
          <Award className="h-10 w-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Transparency
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights for informed decisions.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm">
          <GraduationCap className="h-10 w-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Scalability
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Flexible design that grows with institutions.
          </p>
        </div>

      </div>

    </div>
  </div>
</div>

           

            {/* Stats Section */}
            <div className="py-24 bg-gray-50 dark:bg-gray-800/50 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
             {[
                            { label: "Students", value: "10,000+" },
                            { label: "Faculty", value: "500+" },
                            { label: "Courses", value: "100+" },
                            { label: "Years of Excellence", value: "25+" }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-display font-bold text-primary-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-6">
  <div className="bg-white px-3 py-2 rounded-xl shadow-sm">
    <img
      src="/src/assets/logo.avif"
      alt="Haridwar University Logo"
      className="w-[180px] h-[60px] object-contain"
    />
  </div>
</div>

                            <p className="text-gray-400 text-sm">
                                Empowering the featured generation through excellence in education and technology.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Faculty Login</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 id = "contact" className="text-lg font-semibold mb-6">Contact</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>Haridwar, Uttarakhand</li>
                                <li>info@haridwaruniversity.edu</li>
                                <li>+91 123 456 7890</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                                />
                                <button className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-700">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                        © 2026 Haridwar University. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;