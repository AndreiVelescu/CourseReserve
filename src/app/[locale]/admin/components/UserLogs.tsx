import { Button } from "@/components/Button";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
  UserTypeWithoutPass,
  UserTypeWithoutPassForAdmin,
} from "@/lib/server/actions/types";
import { UserActionLog } from "@prisma/client";

type UserLogsProps = {
  logsDialogOpen: boolean;
  handleCloseLogs: () => void;
  selectedUser: UserTypeWithoutPassForAdmin | undefined;
  selectedUserLogs: UserActionLog[];
  isLoadingLogs: boolean;
  errorLogs: Error | null;
  getInitials: (username: string) => string;
  getActionTypeColor: (actionType: string) => string;
  formatDateTime: (date: string) => string;
};

export const UserLogs: React.FC<UserLogsProps> = ({
  logsDialogOpen,
  handleCloseLogs,
  selectedUser,
  selectedUserLogs,
  isLoadingLogs,
  errorLogs,
  getInitials,
  getActionTypeColor,
  formatDateTime,
}) => {
  return (
    <Dialog
      open={logsDialogOpen}
      onClose={handleCloseLogs}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {selectedUser ? getInitials(selectedUser.username) : "?"}
            </Avatar>
            <Box>
              <Typography variant="h6">
                Istoric Activitate - {selectedUser?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleCloseLogs}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isLoadingLogs ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : errorLogs ? (
          <Typography color="error" textAlign="center" py={4}>
            Eroare la încărcarea log-urilor
          </Typography>
        ) : selectedUserLogs.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Nu există activitate înregistrată pentru acest utilizator
          </Typography>
        ) : (
          <List>
            {selectedUserLogs.map((log, index) => (
              <React.Fragment key={log.id}>
                <ListItem
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ width: "100%", mb: 1 }}
                    alignItems="center"
                  >
                    <Chip
                      label={log.actionType}
                      color={getActionTypeColor(log.actionType) as any}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(new Date(log.createdAt).toISOString())}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {log.actionDetails}
                  </Typography>
                  {log.ipAddress && (
                    <Typography variant="caption" color="text.secondary">
                      IP: {log.ipAddress}
                    </Typography>
                  )}
                </ListItem>
                {index < selectedUserLogs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseLogs}>Închide</Button>
      </DialogActions>
    </Dialog>
  );
};
