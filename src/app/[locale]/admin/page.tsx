"use client";

import React, { useEffect } from "react";
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
import { useGetAllUsers } from "@/hooks/api/useGetAllUsers";
import { useIsAdmin } from "@/hooks/api/useIsAdmin";
import { useRouter } from "@/i18n/routing";
import { useGetAllUserLogs } from "@/hooks/api/useGetUserLogsById";
import { UserLogs } from "./components/UserLogs";
import { UserTable } from "./components/UserTable";

function AdminPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  );
  const [logsDialogOpen, setLogsDialogOpen] = React.useState(false);

  const { data, isLoading, error } = useGetAllUsers();
  const {
    data: allUserLogs,
    isLoading: isLoadingLogs,
    error: errorLogs,
  } = useGetAllUserLogs();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

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

  const handleOpenLogs = (userId: number) => {
    setSelectedUserId(userId);
    setLogsDialogOpen(true);
  };

  const handleCloseLogs = () => {
    setLogsDialogOpen(false);
    setSelectedUserId(null);
  };

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
    if (actionType.includes("CREATE") || actionType.includes("ADD")) {
      return "success";
    }
    if (actionType.includes("DELETE") || actionType.includes("REMOVE")) {
      return "error";
    }
    if (actionType.includes("UPDATE") || actionType.includes("EDIT")) {
      return "warning";
    }
    if (actionType.includes("VIEW") || actionType.includes("GET")) {
      return "info";
    }
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

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
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
          bgcolor: "background.default",
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 500, width: "100%" }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "error.main", width: 64, height: 64 }}>
                <AdminIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                Eroare la încărcare
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                Nu am putut încărca datele utilizatorilor. Vă rugăm încercați
                din nou.
              </Typography>
              <Button
                variant="contained"
                size="large"
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
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Export
              </Button>
              <Button variant="contained" startIcon={<PersonAddIcon />}>
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
          />
        </Card>
      </Box>

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
