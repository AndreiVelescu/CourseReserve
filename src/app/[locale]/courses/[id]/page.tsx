"use client";

import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { Group as GroupIcon } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { useGetCourseById } from "@/hooks/api/useGetCourseById";
import { useRouter } from "@/i18n/routing";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useCreateReservationMutation } from "@/hooks/api/useCreateReservationMutation";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useSnackbar } from "@/context/SnackbarContext";

export default function CoursePage() {
  const { isLogged } = useIsLoggedIn();
  const params = useParams();
  const id = params.id as string; // ✅ Folosim id
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { data: currentUser } = useGetCurrentUser();

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseById({
    variables: { id },
    enabled: isLogged,
  });

  const createReservationMutation = useCreateReservationMutation();

  const handleReserveCourse = (courseId: string) => {
    if (!currentUser) {
      showSnackbar({
        message: "Trebuie să fii autentificat pentru a rezerva un curs",
        severity: "error",
      });
      return;
    }

    createReservationMutation.mutate(
      {
        courseId: Number(courseId),
        userId: currentUser.id,
        reservedAt: new Date(),
      },
      {
        onSuccess: () => {
          showSnackbar({
            message: "Rezervare creată cu succes!",
            severity: "success",
          });
          router.push("/reservations");
        },
        onError: (error) => {
          showSnackbar({
            message: `${error.message}`,
            severity: "error",
          });
        },
      },
    );
  };

  if (!isLogged) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2 }}>
        <Alert severity="warning">
          Trebuie să fii autentificat pentru a vizualiza cursurile.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2 }}>
        <Alert severity="error">
          Eroare la încărcarea cursului: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2 }}>
        <Alert severity="info">Cursul nu a fost găsit.</Alert>
      </Box>
    );
  }

  const canManageGroups =
    currentUser &&
    (currentUser.role === "INSTRUCTOR" || currentUser.role === "ADMIN");

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      {/* Buton Înapoi */}
      <Button
        onClick={() => router.push("/courses")}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Înapoi la cursuri
      </Button>

      {/* Card detalii curs */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0px 6px 24px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {course.title}
            </Typography>
            <Chip label={course.category} color="primary" />
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          >
            {course.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1} mb={3}>
            <Typography variant="body2">
              <strong>Durată:</strong> {course.durationMinutes} minute
            </Typography>
            <Typography variant="body2">
              <strong>Data începerii:</strong>{" "}
              {new Date(course.startDate).toLocaleDateString("ro-RO")}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            size="large"
            sx={{
              width: { xs: "100%", sm: "auto" },
              fontWeight: 600,
              py: 1.5,
              px: 4,
            }}
            onClick={() => handleReserveCourse(course.id.toString())}
            disabled={createReservationMutation.isPending}
          >
            {createReservationMutation.isPending
              ? "Se rezervă..."
              : "Rezervă cursul"}
          </Button>
        </CardContent>
      </Card>

      {/* Card Grupuri - doar pentru instructori și admini */}
      {canManageGroups && course.allowGroups && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack spacing={1}>
                <Typography variant="h6">Grupuri de lucru</Typography>
                <Typography variant="body2" color="text.secondary">
                  Organizează studenții în grupuri pentru acest curs
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<GroupIcon />}
                onClick={() => router.push(`/courses/${id}/groups`)}
              >
                Gestionează Grupuri
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Mesaj dacă cursul nu permite grupuri */}
      {canManageGroups && !course.allowGroups && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Alert severity="info">
              Acest curs nu permite formarea de grupuri. Pentru a activa
              grupurile, editează setările cursului.
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
