import type { JSX } from 'react';
import { Spin } from 'antd';
import styles from './Spinner.module.css';

export default function Spinner(): JSX.Element {
  return (
    <div className={styles.container}>
      <Spin className={styles.spinner} tip="Loading...">
        <div className={styles.content} />
      </Spin>
    </div>
  );
}
