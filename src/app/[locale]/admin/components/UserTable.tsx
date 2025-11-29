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

type UserType = {
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
};

export const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  allUserLogs,
  handleOpenLogs,
  getInitials,
  getRoleIcon,
  getRoleColor,
  formatDate,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilizator</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Data înregistrării</TableCell>
            <TableCell>Rezervări</TableCell>
            <TableCell>Cursuri</TableCell>
            <TableCell>Activitate</TableCell>
            <TableCell align="right">Acțiuni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                <Typography color="text.secondary">
                  Nu au fost găsiți utilizatori
                </Typography>
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
                    <Tooltip title="Vezi istoric activitate">
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
                      <Tooltip title="Vizualizare">
                        <IconButton size="small" color="info">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editare">
                        <IconButton size="small" color="warning">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ștergere">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
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
