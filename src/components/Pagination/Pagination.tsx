import type { PaginationProps } from 'antd';
import { Pagination as Paginator } from 'antd';
import './Pagination.module.css';

type Props = Required<Pick<PaginationProps, 'current' | 'total' | 'onChange'>>;

export default function Pagination({
  current,
  total,
  onChange,
}: Props): JSX.Element | null {
  const pageSize = 20;
  const maxPages = 500;
  const maxTotal = pageSize * maxPages;
  const adjustedTotal = Math.min(total, maxTotal);
  const shouldShowPagination = !(current === 1 && total <= pageSize);

  if (!shouldShowPagination) return null;

  return (
    <Paginator
      current={current}
      total={adjustedTotal}
      onChange={onChange}
      pageSize={pageSize}
      showSizeChanger={false}
    />
  );
}
