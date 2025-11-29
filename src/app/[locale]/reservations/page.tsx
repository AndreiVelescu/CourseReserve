"use client";

import { useGetAllReservations } from "@/hooks/api/useGetAllReservations";
import { useDeleteReservation } from "@/hooks/api/useDeleteReservation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useSnackbar } from "@/context/SnackbarContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function ReservationsPage() {
  const { isLogged } = useIsLoggedIn();
  const { data: reservations, isLoading, error } = useGetAllReservations();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLogged) {
      router.refresh();
    }
  }, [isLogged, router]);

  const deleteReservationMutation = useDeleteReservation({
    onSuccess: () => {
      showSnackbar({
        message: "Rezervare ștearsă cu succes!",
        severity: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["getReservations"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la ștergerea rezervării",
        severity: "error",
      });
    },
  });

  const handleDeleteReservation = (
    reservationId: number,
    courseTitle: string,
  ) => {
    if (
      confirm(
        `Sigur vrei să ștergi rezervarea pentru cursul "${courseTitle}"? Această acțiune este ireversibilă.`,
      )
    ) {
      deleteReservationMutation.mutate(reservationId);
    }
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
          Eroare la încărcarea rezervărilor: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!isLogged) {
    return (
      <Box
        sx={{ maxWidth: 800, mx: "auto", mt: 8, px: 2, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          Nu ești autentificat
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Autentifică-te pentru a vedea rezervările tale.
        </Typography>

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            onClick={() => router.push("/login")}
            variant="contained"
            size="large"
          >
            Autentifică-te
          </Button>
          <Button
            onClick={() => router.push("/register")}
            variant="outlined"
            size="large"
          >
            Înregistrează-te
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 6, px: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Rezervările tale
        </Typography>
        <Button variant="outlined" onClick={() => router.push("/courses")}>
          Explorează cursuri
        </Button>
      </Stack>

      {!reservations || reservations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nu ai rezervări momentan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explorează cursurile disponibile și rezervă locul tău!
            </Typography>
            <Button variant="contained" onClick={() => router.push("/courses")}>
              Vezi cursurile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {reservations.map((res) => (
            <Grid item xs={12} sm={6} key={res.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {res.course.title}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={res.course.category}
                        color="primary"
                        size="small"
                      />
                      <Tooltip title="Șterge rezervarea">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteReservation(res.id, res.course.title)
                          }
                          disabled={deleteReservationMutation.isPending}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {res.course.description}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Stack spacing={0.5} mb={2}>
                    <Typography variant="caption">
                      <strong>Durată:</strong> {res.course.durationMinutes}{" "}
                      minute
                    </Typography>
                    <Typography variant="caption">
                      <strong>Start:</strong>{" "}
                      {new Date(res.course.startDate).toLocaleDateString(
                        "ro-RO",
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Rezervat:</strong>{" "}
                      {new Date(res.reservedAt).toLocaleDateString("ro-RO")}
                    </Typography>
                  </Stack>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push(`/reservations/${res.id}`)}
                    >
                      Vezi detalii
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
