
import React from 'react';

interface ContactButtonProps {
  icon: string;
  text: string;
  href: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ icon, text, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-start p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-all duration-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transform hover:-translate-y-1 hover:shadow-lg"
    >
      <i className={`${icon} w-6 text-center text-lg`}></i>
      <span className="ml-4 font-semibold">{text}</span>
    </a>
  );
};

export default ContactButton;
