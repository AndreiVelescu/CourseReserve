"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllUsers } from "@/hooks/api/useGetAllUsers";
import { useIsAdmin } from "@/hooks/api/useIsAdmin";
import { useRouter } from "@/i18n/routing";
import { useGetAllUserLogs } from "@/hooks/api/useGetUserLogsById";
import { useSnackbar } from "@/context/SnackbarContext";

// Hooks Admin
import { useCreateUser } from "@/hooks/api/useCreateUser";
import { useUpdateUser } from "@/hooks/api/useUpdateUser";
import { useDeleteUser } from "@/hooks/api/useDeleteUser";
import { useGetUserDetails } from "@/hooks/api/useGetUserDetails";
import { useExportUsers } from "@/hooks/api/useExportUsers";

// Components
import { UserLogs } from "./components/UserLogs";
import { UserTable, UserType } from "./components/UserTable";
import {
  EditUserDialog,
  CreateUserDialog,
  ViewUserDetailsDialog,
} from "./components/AdminDialogs";
import AdminLogsPage from "./components/AdminLogsPage";

function AdminPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // State pentru filtre și căutare
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");

  // State pentru logs
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  );
  const [logsDialogOpen, setLogsDialogOpen] = React.useState(false);

  // State pentru Editare
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);

  // State pentru Creare
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  // State pentru View Details
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState<number | null>(null);

  // API Hooks
  const { data, isLoading, error } = useGetAllUsers();
  const {
    data: allUserLogs,
    isLoading: isLoadingLogs,
    error: errorLogs,
  } = useGetAllUserLogs();

  // ✅ Hooks Admin
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      showSnackbar({
        message: "Utilizator creat cu succes!",
        severity: "success",
      });
      setCreateUserDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["useGetAllUsers"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la crearea utilizatorului",
        severity: "error",
      });
    },
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      showSnackbar({
        message: "Utilizator actualizat cu succes!",
        severity: "success",
      });
      setEditUserDialogOpen(false);
      setUserToEdit(null);
      queryClient.invalidateQueries({ queryKey: ["useGetAllUsers"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la actualizarea utilizatorului",
        severity: "error",
      });
    },
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      showSnackbar({
        message: "Utilizator șters cu succes!",
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["useGetAllUsers"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la ștergerea utilizatorului",
        severity: "error",
      });
    },
  });

  const { data: userDetails, isLoading: isLoadingDetails } = useGetUserDetails(
    userIdToView,
    viewUserDialogOpen,
  );

  const exportUsersMutation = useExportUsers();

  // Redirecționare dacă nu e admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  // Filtrare utilizatori
  const filteredUsers = React.useMemo(() => {
    if (!data) return [];
    return data.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [data, searchTerm, roleFilter]);

  const selectedUserLogs = React.useMemo(() => {
    if (!selectedUserId || !allUserLogs) return [];
    return allUserLogs.filter((log) => log.userId === selectedUserId);
  }, [selectedUserId, allUserLogs]);

  // --- HANDLERS ---

  const handleOpenLogs = (userId: number) => {
    setSelectedUserId(userId);
    setLogsDialogOpen(true);
  };

  const handleCloseLogs = () => {
    setLogsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleViewDetails = (userId: number) => {
    setUserIdToView(userId);
    setViewUserDialogOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setUserToEdit(user);
    setEditUserDialogOpen(true);
  };

  const handleEditUserSubmit = (formData: {
    userId: number;
    username?: string;
    email?: string;
    role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    isActive?: boolean;
  }) => {
    updateUserMutation.mutate(formData);
  };

  // ✅ Handler submit creare user
  const handleCreateUserSubmit = (formData: {
    username: string;
    email: string;
    password: string;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }) => {
    createUserMutation.mutate(formData);
  };

  // ✅ Handler ștergere
  const handleDeleteUser = (userId: number) => {
    const user = data?.find((u) => u.id === userId);
    if (
      window.confirm(
        `Ești sigur că vrei să ștergi utilizatorul "${user?.username}"? Această acțiune este ireversibilă.`,
      )
    ) {
      deleteUserMutation.mutate(userId);
    }
  };

  // ✅ Handler export
  const handleExport = async (format: "csv" | "json") => {
    try {
      const result = await exportUsersMutation.mutateAsync(format);

      if (format === "csv") {
        // Download CSV
        const blob = new Blob([result.data as string], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Download JSON
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      showSnackbar({
        message: "Export realizat cu succes!",
        severity: "success",
      });
    } catch (error) {
      showSnackbar({
        message: "Eroare la export",
        severity: "error",
      });
    }
  };

  // Utilitare UI
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "error" as const;
      case "INSTRUCTOR":
        return "primary" as const;
      case "STUDENT":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <AdminIcon fontSize="small" />;
      case "INSTRUCTOR":
        return <SchoolIcon fontSize="small" />;
      case "STUDENT":
        return <PersonIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  const getActionTypeColor = (actionType: string) => {
    if (actionType.includes("CREATE") || actionType.includes("ADD"))
      return "success";
    if (actionType.includes("DELETE") || actionType.includes("REMOVE"))
      return "error";
    if (actionType.includes("UPDATE") || actionType.includes("EDIT"))
      return "warning";
    if (actionType.includes("VIEW") || actionType.includes("GET"))
      return "info";
    return "default";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Statistici
  const stats = React.useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Total Utilizatori",
        value: data.length,
        icon: <PeopleIcon />,
        color: "#1976d2",
      },
      {
        title: "Administratori",
        value: data.filter((u) => u.role === "ADMIN").length,
        icon: <AdminIcon />,
        color: "#d32f2f",
      },
      {
        title: "Instructori",
        value: data.filter((u) => u.role === "INSTRUCTOR").length,
        icon: <SchoolIcon />,
        color: "#2e7d32",
      },
      {
        title: "Studenți",
        value: data.filter((u) => u.role === "STUDENT").length,
        icon: <PersonIcon />,
        color: "#ed6c02",
      },
    ];
  }, [data]);

  // Loading / Error UI
  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Redirecționare...</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Se încarcă utilizatorii...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h5" color="error">
                Eroare la încărcare
              </Typography>
              <Typography color="text.secondary">{error.message}</Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Reîncearcă
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const selectedUser = data?.find((u) => u.id === selectedUserId);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Gestionare Utilizatori
                </Typography>
                <Typography color="text.secondary">
                  Administrează și monitorizează toți utilizatorii sistemului
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport("csv")}
                disabled={exportUsersMutation.isPending}
              >
                {exportUsersMutation.isPending ? "Se exportă..." : "Export CSV"}
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setCreateUserDialogOpen(true)}
              >
                Adaugă Utilizator
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        gutterBottom
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                placeholder="Caută după nume sau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Rol"
                >
                  <MenuItem value="ALL">Toți</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
                  <MenuItem value="STUDENT">Student</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <UserTable
            filteredUsers={filteredUsers}
            allUserLogs={allUserLogs}
            handleOpenLogs={handleOpenLogs}
            getInitials={getInitials}
            getRoleIcon={getRoleIcon}
            getRoleColor={getRoleColor}
            formatDate={formatDate}
            onViewDetails={handleViewDetails}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </Card>
      </Box>
      <AdminLogsPage />

      {/* Dialog Editare */}
      <EditUserDialog
        open={editUserDialogOpen}
        onClose={() => {
          setEditUserDialogOpen(false);
          setUserToEdit(null);
        }}
        user={userToEdit}
        onSubmit={handleEditUserSubmit}
        isLoading={updateUserMutation.isPending}
      />

      {/* Dialog Creare */}
      <CreateUserDialog
        open={createUserDialogOpen}
        onClose={() => setCreateUserDialogOpen(false)}
        onSubmit={handleCreateUserSubmit}
        isLoading={createUserMutation.isPending}
      />

      {/* Dialog View Details */}
      <ViewUserDetailsDialog
        open={viewUserDialogOpen}
        onClose={() => {
          setViewUserDialogOpen(false);
          setUserIdToView(null);
        }}
        userId={userIdToView}
        userDetails={userDetails}
        isLoading={isLoadingDetails}
      />

      {/* Dialog Logs */}
      <UserLogs
        logsDialogOpen={logsDialogOpen}
        handleCloseLogs={handleCloseLogs}
        selectedUser={selectedUser}
        selectedUserLogs={selectedUserLogs}
        isLoadingLogs={isLoadingLogs}
        errorLogs={errorLogs}
        getActionTypeColor={getActionTypeColor}
        formatDateTime={formatDateTime}
        getInitials={getInitials}
      />
    </Box>
  );
}

export default AdminPage;
