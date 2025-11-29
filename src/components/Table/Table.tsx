import {
  Box,
  Table as MuiTable,
  Pagination,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChangeEvent } from "react";

import { Loading } from "../Loading";

import { TableProps } from "./types";

export function Table<T>({
  columns,
  data,
  page,
  rowsPerPage,
  onPageChange,
  totalCount,
  loading,
}: TableProps<T>) {
  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const actualTotalCount = totalCount ?? data?.length;
  const pageCount = Math.ceil(actualTotalCount || 1 / rowsPerPage);

  if (loading) {
    return (
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Loading />
      </Stack>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = column.getValue
                    ? column.getValue(row)
                    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </>
  );
}

export default Table;
