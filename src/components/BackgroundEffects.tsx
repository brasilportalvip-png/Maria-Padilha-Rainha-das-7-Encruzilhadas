import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div id="mp_spiritual_bg" className="fixed inset-0 -z-50 overflow-hidden bg-black select-none pointer-events-none w-screen h-screen">
      <img
        src="/image/Maria Padilha Fundo.png"
        alt=""
        className="w-full h-full object-cover"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

