"use client";

import { useGetAllReservations } from "@/hooks/api/useGetAllReservations";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
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
} from "@mui/material";
import { Button } from "@/components/Button";
import { useRouter } from "@/i18n/routing";
import Link from "next/link";
import { useEffect } from "react";

export default function ReservationsPage() {
  const { isLogged } = useIsLoggedIn();
  useEffect(() => {
    router.refresh();
  }, [isLogged]);
  const { data: reservations, isLoading, error } = useGetAllReservations();
  const router = useRouter();

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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Rezervările tale
      </Typography>

      {!reservations || reservations.length === 0 ? (
        <Alert severity="info">Nu ai rezervări momentan.</Alert>
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
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {res.course.title}
                    </Typography>
                    <Chip
                      label={res.course.category}
                      color="primary"
                      size="small"
                    />
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
