import React, { useState } from 'react';
import ViewToggleButton from './ViewToggleButton';

function Box({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ViewToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(open => !open)}
      />
      {isOpen && children}
    </div>
  );
}

export default Box;
