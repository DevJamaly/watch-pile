import { useState } from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle: React.CSSProperties = {
  display: 'flex',
};

interface StarRatingProps {
  maxRating?: number;
  color?: string;
  size?: number;
  defaultRating?: number;
  messages?: string[];
  className?: string;
  onSetRating?: (rating: number) => void;
}

function StarRating({
  maxRating = 5,
  color = '#fcc419',
  size = 48,
  defaultRating = 0,
  messages = [],
  className = '',
  onSetRating,
}: StarRatingProps) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(newRating: number) {
    setRating(newRating);
    onSetRating?.(newRating);
  }

  const textStyle: React.CSSProperties = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size / 1.5}px`,
  };

  const displayed = tempRating || rating;

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            isFull={displayed > i}
            onHoverEnter={() => setTempRating(i + 1)}
            onHoverExit={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? (messages[displayed - 1] ?? '')
          : displayed || ''}
      </p>
    </div>
  );
}

interface StarProps {
  onHoverEnter: () => void;
  onHoverExit: () => void;
  onRate: () => void;
  isFull: boolean;
  color: string;
  size: number;
}

function Star({
  onHoverEnter,
  onHoverExit,
  onRate,
  isFull,
  color,
  size,
}: StarProps) {
  const starStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: 'pointer',
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRate();
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      style={starStyle}
      onClick={onRate}
      onKeyDown={handleKeyDown}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverExit}
    >
      {isFull ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default StarRating;
