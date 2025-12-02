import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }) => void;
  isLoading?: boolean;
}

export function CreateUserDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: CreateUserDialogProps) {
  const t = useTranslations("AdminDialogs");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT" as "STUDENT" | "INSTRUCTOR" | "ADMIN",
  });

  const handleSubmit = () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert(t("fillAllFields"));
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "STUDENT",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{t("createUserTitle")}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label={t("username")}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            fullWidth
            required
          />
          <TextField
            label={t("email")}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            required
          />
          <TextField
            label={t("password")}
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            fullWidth
            required
            helperText={t("passwordHelper")}
          />
          <FormControl fullWidth>
            <InputLabel>{t("role")}</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "STUDENT" | "INSTRUCTOR" | "ADMIN",
                })
              }
              label={t("role")}
            >
              <MenuItem value="STUDENT">{t("student")}</MenuItem>
              <MenuItem value="INSTRUCTOR">{t("instructor")}</MenuItem>
              <MenuItem value="ADMIN">{t("admin")}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {t("cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t("creating") : t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==========================================
// EDIT USER DIALOG
// ==========================================
interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
  } | null;
  onSubmit: (data: {
    userId: number;
    username?: string;
    email?: string;
    role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    isActive?: boolean;
  }) => void;
  isLoading?: boolean;
}

export function EditUserDialog({
  open,
  onClose,
  user,
  onSubmit,
  isLoading,
}: EditUserDialogProps) {
  const t = useTranslations("AdminDialogs");

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: (user?.role || "STUDENT") as "STUDENT" | "INSTRUCTOR" | "ADMIN",
    isActive: user?.isActive ?? true,
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!user) return;
    onSubmit({
      userId: user.id,
      ...formData,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{t("editUserTitle")}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label={t("username")}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            fullWidth
          />
          <TextField
            label={t("email")}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>{t("role")}</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "STUDENT" | "INSTRUCTOR" | "ADMIN",
                })
              }
              label={t("role")}
            >
              <MenuItem value="STUDENT">{t("student")}</MenuItem>
              <MenuItem value="INSTRUCTOR">{t("instructor")}</MenuItem>
              <MenuItem value="ADMIN">{t("admin")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>{t("status")}</InputLabel>
            <Select
              value={formData.isActive ? "active" : "inactive"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "active",
                })
              }
              label={t("status")}
            >
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {t("cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t("saving") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==========================================
// VIEW USER DETAILS DIALOG
// ==========================================
interface ViewUserDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  userDetails: any;
  isLoading: boolean;
}

export function ViewUserDetailsDialog({
  open,
  onClose,
  userId,
  userDetails,
  isLoading,
}: ViewUserDetailsDialogProps) {
  const t = useTranslations("AdminDialogs");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{t("viewUserTitle")}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : !userDetails ? (
          <Alert severity="error">{t("errorLoadingDetails")}</Alert>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Info de bază */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("generalInfo")}
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  <strong>{t("username")}:</strong> {userDetails.username}
                </Typography>
                <Typography>
                  <strong>{t("email")}:</strong> {userDetails.email}
                </Typography>
                <Typography>
                  <strong>{t("role")}:</strong>{" "}
                  <Chip label={userDetails.role} size="small" />
                </Typography>
                <Typography>
                  <strong>{t("registrationDate")}:</strong>{" "}
                  {new Date(userDetails.createdAt).toLocaleDateString("ro-RO")}
                </Typography>
              </Stack>
            </Box>

            <Divider />

            {/* Rezervări */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("reservations")} ({userDetails.reservations?.length || 0})
              </Typography>
              {userDetails.reservations?.length > 0 ? (
                <List dense>
                  {userDetails.reservations.map((r: any) => (
                    <ListItem key={r.id}>
                      <ListItemText
                        primary={r.courseName || t("deletedCourse")}
                        secondary={`${r.courseName || t("deletedCourse")} - ${t("reservedAt")}: ${new Date(r.reservedAt).toLocaleDateString("ro-RO")}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  {t("noReservations")}
                </Typography>
              )}
            </Box>

            {/* Cursuri ca instructor */}
            {userDetails.instructorCourses?.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("instructorCourses")} (
                    {userDetails.instructorCourses.length})
                  </Typography>
                  <List dense>
                    {userDetails.instructorCourses.map((c: any) => (
                      <ListItem key={c.id}>
                        <ListItemText
                          primary={c.title}
                          secondary={`${c.category} - ${t("startDate")}: ${new Date(c.startDate).toLocaleDateString("ro-RO")}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}

            {/* Grupuri */}
            {userDetails.groupMemberships?.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("groupMemberships")} (
                    {userDetails.groupMemberships.length})
                  </Typography>
                  <List dense>
                    {userDetails.groupMemberships.map((gm: any) => (
                      <ListItem key={gm.id}>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <span>{gm.groupName}</span>
                              {gm.isLeader && (
                                <Chip
                                  label={t("leader")}
                                  size="small"
                                  color="warning"
                                />
                              )}
                            </Stack>
                          }
                          secondary={`${t("courseId")}: ${gm.courseId}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
