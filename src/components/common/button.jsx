'use client';

import React from 'react';

const CustomButton = ({
  border = 'none',
  onClick,
  background = '#1B1B1B',
  textColor = '#FFF',
  padding = '10px 20px',
  borderRadius = '5px',
  cursor = 'pointer',
  children,
  textSize = '1rem',
}) => {
  const buttonStyle = {
    border,
    background,
    padding,
    borderRadius,
    cursor,
    color: textColor,
    fontSize: textSize,
  };

  return (
    <button className="center border gap-3 w-full hover:scale-95 transition duration-300" onClick={onClick} style={buttonStyle}>
      {children}
    </button>
  );
};

export default CustomButton;
