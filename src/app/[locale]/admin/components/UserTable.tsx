import {
  Avatar,
  Badge,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useTranslations } from "next-intl";

export type UserType = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date | string;
  reservations: any[];
  instructorCourses: any[];
};

type UserLog = {
  id: number;
  userId: number | null;
  actionType: string;
  actionDetails: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};

type UserTableProps = {
  filteredUsers: UserType[];
  allUserLogs?: UserLog[];
  handleOpenLogs: (userId: number) => void;
  getInitials: (name: string) => string;
  getRoleIcon: (role: string) => React.ReactElement | undefined;
  getRoleColor: (
    role: string,
  ) =>
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  formatDate: (date: string) => string;
  onViewDetails: (userId: number) => void;
  onEdit: (user: UserType) => void;
  onDelete: (userId: number) => void;
};

export const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  allUserLogs,
  handleOpenLogs,
  getInitials,
  getRoleIcon,
  getRoleColor,
  formatDate,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("UserTable");

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("headers.user")}</TableCell>
            <TableCell>{t("headers.email")}</TableCell>
            <TableCell>{t("headers.role")}</TableCell>
            <TableCell>{t("headers.registrationDate")}</TableCell>
            <TableCell>{t("headers.reservations")}</TableCell>
            <TableCell>{t("headers.courses")}</TableCell>
            <TableCell>{t("headers.activity")}</TableCell>
            <TableCell align="right">{t("headers.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                <Typography color="text.secondary">{t("noUsers")}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => {
              const userLogCount =
                allUserLogs?.filter((log) => log.userId === user.id).length ||
                0;

              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getInitials(user.username)}
                      </Avatar>
                      <Typography fontWeight="medium">
                        {user.username}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(new Date(user.createdAt).toISOString())}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.reservations.length}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.instructorCourses.length}
                      size="small"
                      variant="outlined"
                      color={
                        user.instructorCourses.length > 0
                          ? "primary"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={t("tooltips.viewHistory")}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenLogs(user.id)}
                        color="primary"
                      >
                        <Badge badgeContent={userLogCount} color="error">
                          <HistoryIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Tooltip title={t("tooltips.viewDetails")}>
                        <IconButton onClick={() => onViewDetails(user.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("tooltips.edit")}>
                        <IconButton onClick={() => onEdit(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("tooltips.delete")}>
                        <IconButton onClick={() => onDelete(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
