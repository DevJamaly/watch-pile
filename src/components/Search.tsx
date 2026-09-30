import { useEffect, useRef } from 'react';
import { useKey } from '../hooks/useKey';

interface SearchProps {
  query: string;
  setQuery: (q: string) => void;
}

function Search({ query, setQuery }: SearchProps) {
  /* // Don't focus via document.querySelector here. It searches the whole page, so
  // multiple instances or another '.search' class focus the wrong element. It
  // ties behaviour to a CSS class name, so a rename breaks focus silently. The
  // <HTMLInputElement> generic is a cast, not a check. With [] deps it runs once,
  // so a conditionally or lazily rendered input is never focused. And it needs a
  // global document, so it breaks SSR and tests. Use a ref, or autoFocus.
  useEffect(() => {
    const el = document.querySelector<HTMLInputElement>('.search');
    if (!el) return;
    console.log(el);
    el.focus();
  }, []); */

  const searchInput = useRef<HTMLInputElement>(null);

  useKey('Enter', () => {
    if (document.activeElement === searchInput.current) return;
    searchInput.current?.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={searchInput}
    />
  );
}

export default Search;
