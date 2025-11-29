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
import { Button } from "@/components/Button";
import { useGetCourseById } from "@/hooks/api/useGetCourseById";
import { useRouter } from "@/i18n/routing";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useCreateReservationMutation } from "@/hooks/api/useCreateReservationMutation";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useSnackbar } from "@/context/SnackbarContext";

export default function CoursePage() {
  const { isLogged } = useIsLoggedIn();
  const { id } = useParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { data: currentUser } = useGetCurrentUser();
  if (!currentUser) {
    return null;
  }

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseById({
    variables: { id: id as string },
    enabled: isLogged,
  });
  const createReservationMutation = useCreateReservationMutation();

  const handleReserveCourse = (courseId: string) => {
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
          {/* Titlu curs + categorie */}
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

          {/* Descriere */}
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

          {/* Info curs */}
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
          >
            Rezervă cursul
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
