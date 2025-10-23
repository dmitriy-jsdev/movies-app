import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import './Pagination.module.css';

type Props = Required<Pick<PaginationProps, 'current' | 'total' | 'onChange'>>;

export default function PaginationComponent({
  current,
  total,
  onChange,
}: Props): JSX.Element | null {
  const pageSize = 20;
  const maxPages = 500;
  const maxTotal = pageSize * maxPages;
  const adjustedTotal = Math.min(total, maxTotal);
  const shouldShowPagination = !(current === 1 && total <= pageSize);

  return shouldShowPagination ? (
    <Pagination
      current={current}
      total={adjustedTotal}
      onChange={onChange}
      pageSize={pageSize}
      showSizeChanger={false}
    />
  ) : null;
}
