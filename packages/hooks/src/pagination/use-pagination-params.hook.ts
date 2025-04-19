// usePaginationParams.ts
import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback, useEffect } from 'react';

export interface UsePaginationParamsOptions {
  defaultPageIndex?: number;
  defaultPageSize?: number;
  paramNames?: {
    pageIndex?: string;
    pageSize?: string;
  };
}

export function usePaginationParams(
  {
    defaultPageIndex = 1,
    defaultPageSize = 50,
    paramNames = { pageIndex: 'pageIndex', pageSize: 'pageSize' },
  }: UsePaginationParamsOptions
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyIndex = paramNames.pageIndex!;
  const keySize  = paramNames.pageSize!;

  // 1. On mount: nếu chưa có param, set mặc định vào URL
  useEffect(() => {
    let changed = false;
    const params = new URLSearchParams(searchParams);
    const _pageIndexValue = Number(params.get(keyIndex));
    const _pageSizeValue = Number(params.get(keySize));

    if (!params.has(keyIndex) || isNaN(_pageIndexValue) || _pageIndexValue < 1) {
      params.set(keyIndex, defaultPageIndex.toString());
      changed = true;
    }
    if (!params.has(keySize) || isNaN(_pageSizeValue) || _pageSizeValue < 1) {
      params.set(keySize, defaultPageSize.toString());
      changed = true;
    }
    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, []);

  // 2. Parse giá trị từ URL (hoặc fallback về default nếu không hợp lệ)
  const pageIndex = useMemo(() => {
    const raw = searchParams.get(keyIndex);
    const v = raw !== null ? parseInt(raw, 10) : NaN;
    return isNaN(v) || v < 1 ? defaultPageIndex : v;
  }, [searchParams, keyIndex, defaultPageIndex]);

  const pageSize = useMemo(() => {
    const raw = searchParams.get(keySize);
    const v = raw !== null ? parseInt(raw, 10) : NaN;
    return isNaN(v) || v < 1 ? defaultPageSize : v;
  }, [searchParams, keySize, defaultPageSize]);

  // 3. Các setter cập nhật URL
  const setPageIndex = useCallback(
    (newIndex: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(keyIndex, newIndex.toString());
      setSearchParams(params);
    },
    [searchParams, keyIndex, setSearchParams]
  );

  const setPageSize = useCallback(
    (newSize: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(keySize, newSize.toString());
      setSearchParams(params);
    },
    [searchParams, keySize, setSearchParams]
  );

  return { pageIndex, pageSize, setPageIndex, setPageSize };
}
