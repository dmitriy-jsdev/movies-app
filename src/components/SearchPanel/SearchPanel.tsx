import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ChangeEvent,
  type JSX,
} from 'react';
import { Input } from 'antd';
import debounce from 'lodash.debounce';
import styles from './SearchPanel.module.css';

type Props = {
  onSearch: (value: string) => void;
  onRated: () => void;
};

export default function SearchPanel({ onSearch, onRated }: Props): JSX.Element {
  const [activeButton, setActiveButton] = useState<'search' | 'rated'>(
    'search',
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedOnSearch = useMemo(() => debounce(onSearch, 1000), [onSearch]);
  useEffect(() => () => debouncedOnSearch.cancel(), [debouncedOnSearch]);

  const handleButtonClick = useCallback(
    (buttonName: 'search' | 'rated') => {
      setActiveButton(buttonName);

      if (buttonName === 'search') {
        onSearch(searchTerm);
      } else {
        onRated();
      }
    },
    [onSearch, onRated, searchTerm],
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() || value === '') {
      debouncedOnSearch(value.trim());
    }
  };

  return (
    <div className={styles['search-panel']}>
      <div className={styles['button-box']}>
        <button
          className={`${styles['search-btn']} ${
            activeButton === 'search' ? styles.active : ''
          }`}
          type="button"
          onClick={() => handleButtonClick('search')}
        >
          Search
        </button>
        <button
          className={`${styles['rated-btn']} ${
            activeButton === 'rated' ? styles.active : ''
          }`}
          type="button"
          onClick={() => handleButtonClick('rated')}
        >
          Rated
        </button>
      </div>
      {activeButton === 'search' && (
        <Input
          className={styles['search-input']}
          placeholder="Type to search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}
    </div>
  );
}
