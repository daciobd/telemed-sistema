import React from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({ 
  phoneNumber = "5511987654321",
  message = "Olá, vi o TeleMed e gostaria de conhecer mais sobre a plataforma.",
  className = "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200",
  children = "📲 Falar no WhatsApp"
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const link = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;

  const handleClick = () => {
    window.open(link, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}