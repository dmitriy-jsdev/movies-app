import { useEffect, useState, type JSX } from 'react';
import TrimText from '../../utils/TrimText';
import styles from './TruncatedTitle.module.css';

const getWidth = (): number =>
  typeof window !== 'undefined' ? window.innerWidth : 0;

type Props = { title: string };

export default function TruncatedTitle({ title }: Props): JSX.Element {
  const [screenWidth, setScreenWidth] = useState<number>(getWidth());

  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(getWidth());
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth, { passive: true });
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const maxTitleLength = screenWidth <= 450 ? 25 : 30;
  const shortTitle = TrimText(title, maxTitleLength);

  return <h5 className={styles.movieTitle}>{shortTitle}</h5>;
}
