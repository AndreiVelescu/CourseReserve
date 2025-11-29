import { TableCellProps } from "@mui/material";

export type Column<T> = {
  id: string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: TableCellProps["align"];
  format?: (value: any, row: T) => React.ReactNode;
  getValue?: (row: T) => React.ReactNode;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[] | undefined;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  loading?: boolean;
};
