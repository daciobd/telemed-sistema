import React from "react";

export default function TelemedHub() {
  // Redirect para VideoConsultation
  React.useEffect(() => {
    window.location.href = '/video-consultation?consultationId=demo';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecionando para TeleMed IA...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    </div>
  );
}