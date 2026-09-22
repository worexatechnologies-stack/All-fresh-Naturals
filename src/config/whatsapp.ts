/** Business WhatsApp number for customer orders and notifications. Digits only. */
export const BUSINESS_WHATSAPP_NUMBER = '918553428079';

export function openWhatsAppMessage(message: string) {
  const url = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
