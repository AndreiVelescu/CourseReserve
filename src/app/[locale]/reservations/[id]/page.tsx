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
  Stack,
  Chip,
} from "@mui/material";
import { Button } from "@/components/Button";
import { useRouter } from "@/i18n/routing";
import { useGetReservationById } from "@/hooks/api/useGetReservationById";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export default function ReservationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLogged } = useIsLoggedIn();

  const {
    data: reservation,
    isLoading,
    error,
  } = useGetReservationById({
    variables: { id: id as string },
    enabled: isLogged,
  });

  if (!isLogged) {
    return (
      <Box
        sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          Nu ești autentificat
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Autentifică-te pentru a vedea detaliile rezervării.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button href="/login" variant="contained">
            Autentifică-te
          </Button>
          <Button href="/register" variant="outlined">
            Înregistrează-te
          </Button>
        </Box>
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
          Eroare la încărcarea rezervării: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!reservation) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2 }}>
        <Alert severity="info">Rezervarea nu a fost găsită.</Alert>
      </Box>
    );
  }

  const { course, reservedAt } = reservation;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
      <Button
        onClick={() => router.push("/reservations")}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Înapoi la rezervări
      </Button>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {course.title}
              </Typography>
              <Chip label={course.category} color="primary" size="small" />
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {course.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={0.5}>
              <Typography variant="body2">
                <strong>Durată curs:</strong> {course.durationMinutes} minute
              </Typography>
              <Typography variant="body2">
                <strong>Data începerii:</strong>{" "}
                {new Date(course.startDate).toLocaleDateString("ro-RO")}
              </Typography>

              <Typography variant="body2">
                <strong>Data rezervării:</strong>{" "}
                {new Date(reservedAt).toLocaleDateString("ro-RO")}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
