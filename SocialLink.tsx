
import React from 'react';

interface SocialLinkProps {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';
  href: string;
  icon: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, platform }) => {
  const platformStyles = {
    facebook: 'text-[#1877F2]',
    instagram: 'text-transparent bg-clip-text bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    tiktok: 'text-black dark:text-white',
    whatsapp: 'text-[#25D366]',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit my ${platform} profile`}
      className="text-3xl transition-transform duration-300 transform hover:scale-125"
    >
      <i className={`${icon} ${platformStyles[platform]}`}></i>
    </a>
  );
};

export default SocialLink;
