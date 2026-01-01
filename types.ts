
export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  profileImageUrl: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  vCardUrl: string;
  vCardRawData: string;
  cardFrontImageUrl?: string;
  cardBackImageUrl?: string;
}
