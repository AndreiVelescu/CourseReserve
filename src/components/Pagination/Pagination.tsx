import {
  Box,
  FormControl,
  Pagination as MuiPagination,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { Select } from "../Select";

import { PaginationProps } from "./types";

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const t = useTranslations("Pagination");
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    onPageChange(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(event.target.value as number);
  };

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {t("Total Items")}: {totalCount}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={pageSize}
              label={t("Items per page")}
              onChange={handlePageSizeChange}
              size="small"
            >
              {pageSizeOptions.map((size) => (
                <Select.Option key={size} value={size}>
                  {size}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <MuiPagination
          sx={{ xs: { mt: 2 }, sm: { mt: 0 } }}
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          size="medium"
          siblingCount={1}
        />
      </Stack>
    </Box>
  );
};
