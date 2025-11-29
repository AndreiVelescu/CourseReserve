"use client";

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Input,
  InputLabel,
  TextareaAutosize,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Button } from "@/components/Button";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import { useRouter } from "@/i18n/routing";

import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { Accordion } from "@/components/Accordion";
import { CreateCourseForm } from "./components/CreateCourseForm";

export default function ProfilePage() {
  const { isLogged } = useIsLoggedIn();
  const { data: currentUser } = useGetCurrentUser({ enabled: isLogged });
  const router = useRouter();

  if (!isLogged) {
    router.push("/login");
    return null;
  }

  if (!currentUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "Student";
      case "INSTRUCTOR":
        return "Instructor";
      case "ADMIN":
        return "Administrator";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "primary";
      case "INSTRUCTOR":
        return "success";
      case "ADMIN":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* HEADER CU GRADIENT */}

      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
        <Grid container spacing={4}>
          {/* CARD PROFIL */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#667eea",
                  fontSize: 48,
                  mx: "auto",
                  mb: 2,
                }}
              >
                {currentUser.email[0].toUpperCase()}
              </Avatar>

              <Typography variant="h5" fontWeight="bold">
                {currentUser.email}
              </Typography>

              <Chip
                label={getRoleLabel(currentUser.role)}
                color={getRoleColor(currentUser.role) as any}
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>

          {/* DETALII UTILIZATOR */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Detalii Cont
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                <EmailIcon sx={{ color: "#667eea" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{currentUser.email}</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                <PersonIcon sx={{ color: "#667eea" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nume utilizator
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.username}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <BadgeIcon sx={{ color: "#667eea" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rol
                  </Typography>
                  <Typography variant="body1">
                    {getRoleLabel(currentUser.role)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/courses")}
                >
                  Vezi cursuri
                </Button>

                {(currentUser.role === "INSTRUCTOR" ||
                  currentUser.role === "ADMIN") && (
                  <Button
                    variant="contained"
                    onClick={() => router.push("/admin")}
                  >
                    Panou Admin
                  </Button>
                )}
              </Box>
            </Paper>

            {/* CREARE CURS */}
            {(currentUser.role === "INSTRUCTOR" ||
              currentUser.role === "ADMIN") && (
              <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Creează un curs
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Accordion title="Formular Creare Curs">
                  <CreateCourseForm />
                </Accordion>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
