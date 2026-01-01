
import React, { useState, useRef, ChangeEvent } from 'react';
import type { BusinessCardData } from '../types';
import ContactButton from './ContactButton';
import SocialLink from './SocialLink';

interface BusinessCardProps {
  data: BusinessCardData;
  adminPassword: string;
  onUpdate: (newData: Partial<BusinessCardData>) => void;
  onPasswordUpdate: (newPassword: string) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, onUpdate, adminPassword, onPasswordUpdate }) => {
  const { name, title, company, profileImageUrl, email, phone, address, socials, vCardUrl, vCardRawData, cardFrontImageUrl, cardBackImageUrl } = data;

  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearString = currentYear > startYear ? `${startYear} - ${currentYear}` : startYear;

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const pressTimer = useRef<number | null>(null);

  const handlePressStart = () => {
    pressTimer.current = window.setTimeout(() => {
      setIsPanelVisible(true);
    }, 10000); // 10 seconds
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  
  const resetPanelState = () => {
    setIsPanelVisible(false);
    setIsAuthenticated(false);
    setPasswordInput('');
    setError('');
    setSuccess('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password sio sahihi.');
    }
    setPasswordInput('');
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ profileImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setError("Tafadhali chagua faili la picha.");
    }
  };

  const handleCardImageChange = (event: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (side === 'front') {
                onUpdate({ cardFrontImageUrl: reader.result as string });
            } else {
                onUpdate({ cardBackImageUrl: reader.result as string });
            }
        };
        reader.readAsDataURL(file);
    } else {
        setError("Tafadhali chagua faili la picha halali.");
    }
  };


  const handlePasswordChange = () => {
    setError('');
    setSuccess('');
    if (currentPassword !== adminPassword) {
      setError("Password ya sasa sio sahihi.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Password mpya hazifanani.");
      return;
    }
    if (newPassword.length < 3) {
      setError("Password mpya lazima iwe na angalau herufi 3.");
      return;
    }
    if (newPassword !== newPassword.toUpperCase() || !/^[A-Z]+$/.test(newPassword)) {
       setError("Password mpya lazima iwe na herufi kubwa pekee.");
       return;
    }

    onPasswordUpdate(newPassword);
    setSuccess("Password imebadilishwa kikamilifu.");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  const handleDownloadQRCode = async (format: 'png' | 'svg' | 'jpg') => {
    setError(''); // Clear previous errors
    try {
      // Use a higher resolution for downloads
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(vCardRawData)}&size=1024x1024&format=${format}&q=H`;
      const response = await fetch(qrApiUrl);
      if (!response.ok) {
        throw new Error(`QR Server responded with status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `M_ART_PRO_QR_Code.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      setError('Imeshindwa kupakua QR code. Tafadhali angalia mtandao wako.');
    }
  };

  const renderAdminPanel = () => {
    if (!isAuthenticated) {
      return (
         <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl w-full max-w-sm text-slate-800 dark:text-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ingiza Password</h2>
              <button onClick={resetPanelState} className="text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="Funga"><i className="fas fa-times"></i></button>
            </div>
            <div className="space-y-4">
               <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Password"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Ingia
              </button>
            </div>
          </div>
      );
    }

    return (
       <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl w-full max-w-sm text-slate-800 dark:text-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Paneli ya Usimamizi</h2>
          <button onClick={resetPanelState} className="text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="Funga"><i className="fas fa-times"></i></button>
        </div>
        <div className="space-y-6">
          
          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
            <h3 className="text-lg font-semibold mb-2">Picha ya Wasifu</h3>
            <label htmlFor="profile-pic-upload" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Badilisha Picha
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
            <h3 className="text-lg font-semibold mb-2">Pakia Picha za Kadi</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="card-front-upload" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Upande wa Mbele</label>
                    <input id="card-front-upload" type="file" accept="image/*" onChange={(e) => handleCardImageChange(e, 'front')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900" />
                </div>
                <div>
                    <label htmlFor="card-back-upload" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Upande wa Nyuma</label>
                    <input id="card-back-upload" type="file" accept="image/*" onChange={(e) => handleCardImageChange(e, 'back')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900" />
                </div>
            </div>
          </div>


          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
             <h3 className="text-lg font-semibold mb-2">Badilisha Password</h3>
             <div className="space-y-3">
               <input type="password" placeholder="Password ya Sasa" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
               <input type="password" placeholder="Password Mpya" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
               <input type="password" placeholder="Thibitisha Password Mpya" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
               
               <button onClick={handlePasswordChange} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Badilisha Password
               </button>
             </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
             <h3 className="text-lg font-semibold mb-3 text-center">Pakua QR Code</h3>
             <div className="flex justify-center mb-3">
                <img 
                  src={vCardUrl.replace('size=150x150', 'size=200x200')} 
                  alt="QR Code for vCard" 
                  className="w-48 h-48 rounded-lg shadow-md border-4 border-slate-200 dark:border-slate-600"
                />
             </div>
             <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">Inajumuisha link ya kadi hii ya kidijitali.</p>
             <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleDownloadQRCode('png')} className="flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  <i className="fas fa-file-image"></i> PNG
                </button>
                <button onClick={() => handleDownloadQRCode('svg')} className="flex items-center justify-center gap-2 bg-purple-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                  <i className="fas fa-vector-square"></i> SVG
                </button>
                <button onClick={() => handleDownloadQRCode('jpg')} className="flex items-center justify-center gap-2 bg-teal-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                  <i className="fas fa-file-alt"></i> JPG
                </button>
             </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center pt-4">{success}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-200 dark:hover:shadow-blue-800/50 relative overflow-hidden">
      
      {isPanelVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          {renderAdminPanel()}
        </div>
      )}

      <div className="text-center">
        <img
          src={profileImageUrl}
          alt={name}
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-slate-200 dark:border-slate-600 shadow-md object-cover"
        />
        <h1
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className="text-3xl font-bold text-slate-800 dark:text-white cursor-pointer select-none"
          title="Bonyeza na shikilia kufungua paneli ya usimamizi"
        >
          {name}
        </h1>
        <p className="text-md text-blue-600 dark:text-blue-400 font-medium">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{company}</p>
      </div>

      <div className="my-8 space-y-3">
        <ContactButton 
          icon="fa-solid fa-phone" 
          text="Piga Simu" 
          href={`tel:${phone}`} 
        />
        <ContactButton 
          icon="fa-solid fa-envelope" 
          text="Tuma Barua Pepe" 
          href={`mailto:${email}`} 
        />
        <ContactButton 
          icon="fa-solid fa-location-dot" 
          text="Angalia Ramani" 
          href="https://maps.app.goo.gl/UB54Fpy6FNb2sDnZ9" 
        />
      </div>

      <div className="flex justify-center items-center space-x-6 my-6">
        <SocialLink platform="facebook" href={socials.facebook} icon="fa-brands fa-facebook" />
        <SocialLink platform="instagram" href={socials.instagram} icon="fa-brands fa-instagram" />
        <SocialLink platform="tiktok" href={socials.tiktok} icon="fa-brands fa-tiktok" />
        <SocialLink platform="whatsapp" href={socials.whatsapp} icon="fa-brands fa-whatsapp" />
      </div>

      {(cardFrontImageUrl || cardBackImageUrl) && (
        <div className="my-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Maelezo ya Mmiliki</h3>
          <div className="space-y-4">
            {cardFrontImageUrl && (
              <img src={cardFrontImageUrl} alt="Kadi - Upande wa Mbele" className="w-full rounded-lg shadow-md" />
            )}
            {cardBackImageUrl && (
              <img src={cardBackImageUrl} alt="Kadi - Upande wa Nyuma" className="w-full rounded-lg shadow-md" />
            )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Hifadhi Mawasiliano Yangu</h3>
        <div className="flex justify-center">
            <img 
                src={vCardUrl}
                alt="QR Code for vCard" 
                className="w-36 h-36 rounded-lg shadow-sm"
            />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Skani kodi hii kuongeza mawasiliano yangu.</p>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; {yearString} Harun_Bonus255. Haki zote zimehifadhiwa.</p>
      </footer>
    </div>
  );
};

export default BusinessCard;
