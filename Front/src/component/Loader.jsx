import React from 'react';
import LoadingGif from '../images/spinner2.gif';

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75">
      <img src={LoadingGif} alt="Loading..." className="w-20 h-20" /> {/* Adjust size as needed */}
    </div>
  );
}
