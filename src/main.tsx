import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import StarRating from './StarRating';
// import './index.css'
// import App from './App.tsx'

function StarTest() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating
        maxRating={5}
        color="red"
        size={32}
        messages={['Terrible', 'Bad', 'Ok', 'Good', 'Amazing']}
        onSetRating={setMovieRating}
      />
      <p>The current movie is rated {movieRating} stars</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <StarRating maxRating={5} />
    <StarTest />
  </StrictMode>,
);
