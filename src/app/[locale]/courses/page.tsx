"use client";

import { useGetCourses } from "@/hooks/api/useGetCourses";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { Button } from "@/components/Button";
import { useRouter } from "@/i18n/routing";

function CoursesPage() {
  const { isLogged } = useIsLoggedIn();
  const { data: courses, isLoading, error } = useGetCourses();
  const router = useRouter();

  // NU ESTE AUTENTIFICAT
  if (!isLogged) {
    return (
      <Box
        sx={{ maxWidth: 800, mx: "auto", mt: 10, px: 2, textAlign: "center" }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Nu ești autentificat
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Trebuie să te autentifici pentru a vedea cursurile disponibile.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
          >
            Autentifică-te
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="outlined"
            size="large"
          >
            Înregistrează-te
          </Button>
        </Box>
      </Box>
    );
  }

  // LOADING
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

  // EROARE
  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 10, px: 2 }}>
        <Alert severity="error">
          Eroare la încărcarea cursurilor: {error.message}
        </Alert>
      </Box>
    );
  }

  // LISTA CURSURILOR
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Cursuri Disponibile
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Alege un curs și vezi detaliile acestuia.
      </Typography>

      {!courses || courses.length === 0 ? (
        <Alert severity="info">Nu există cursuri disponibile momentan.</Alert>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} key={course.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Titlu + badge categorie */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {course.title}
                    </Typography>
                    <Chip
                      label={course.category}
                      color="primary"
                      size="small"
                      sx={{ textTransform: "uppercase", fontWeight: 600 }}
                    />
                  </Box>

                  {/* Descriere */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* Info curs */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Durată:</strong> {course.durationMinutes} minute
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Start:</strong>{" "}
                      {new Date(course.startDate).toLocaleDateString("ro-RO")}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    Vezi detalii & Rezervă
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default CoursesPage;
