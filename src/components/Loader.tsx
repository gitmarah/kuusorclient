import React from 'react';

const Loader: React.FC<{ color: string, bgcolor: string }> = ({ color, bgcolor }) => {
  return (
    <div 
    className={`loader border-t-2 rounded-full border-${color} bg-${bgcolor} animate-spin aspect-square w-4 flex justify-center items-center text-yellow-700`} />
  );
}

export default Loader;
