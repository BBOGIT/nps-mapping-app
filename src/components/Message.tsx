import React from 'react';

interface MessageProps {
  message: string;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
    {message}
  </div>
);