import { useEffect, useState, type JSX } from 'react';
import TrimText from '../../utils/TrimText';

type Props = { title: string };

export default function TruncatedTitle({ title }: Props): JSX.Element {
  const getWidth = () =>
    typeof window !== 'undefined' ? window.innerWidth : 0;
  const [screenWidth, setScreenWidth] = useState<number>(getWidth());

  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(getWidth());
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth, { passive: true });
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const maxTitleLength = screenWidth <= 450 ? 25 : 35;
  const shortTitle = TrimText(title, maxTitleLength);

  return <h5 className="movieTitle">{shortTitle}</h5>;
}
