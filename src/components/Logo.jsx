import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ className = "w-50 h-50" }) {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden select-none transition-all duration-300`}>
      <img 
        src={logoImg} 
        alt="Bereka Logo" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
}