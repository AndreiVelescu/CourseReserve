"use client";

import { useState, useMemo } from "react";
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
  TextField,
  MenuItem,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { Button } from "@/components/Button";
import { useRouter } from "@/i18n/routing";

function CoursesPage() {
  const { isLogged } = useIsLoggedIn();
  const { data: courses, isLoading, error } = useGetCourses();
  const router = useRouter();

  // State pentru filtrare
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("toate");

  // Extrage categoriile unice din cursuri
  const categories = useMemo(() => {
    if (!courses) return ["toate"];
    const uniqueCategories = [...new Set(courses.map((c) => c.category))];
    return ["toate", ...uniqueCategories];
  }, [courses]);

  // Filtrare cursuri
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "toate" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

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

      {/* Card Filtre */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FilterIcon /> Filtrare Cursuri
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Căutare după denumire */}
            <TextField
              fullWidth
              label="Caută după numele cursului"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Introdu numele cursului..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filtrare după categorie */}
            <TextField
              select
              label="Categorie"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 250 } }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Indicator rezultate */}
          {(searchTerm || selectedCategory !== "toate") && (
            <Alert severity="info">
              {filteredCourses.length === 0
                ? "Nu s-au găsit cursuri cu criteriile selectate"
                : `${filteredCourses.length} ${
                    filteredCourses.length === 1
                      ? "curs găsit"
                      : "cursuri găsite"
                  }`}
            </Alert>
          )}
        </Stack>
      </Card>

      {!courses || courses.length === 0 ? (
        <Alert severity="info">Nu există cursuri disponibile momentan.</Alert>
      ) : filteredCourses.length === 0 ? (
        <Alert severity="warning">
          Nu există cursuri care să corespundă criteriilor de filtrare. Încearcă
          să ajustezi filtrele.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
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
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        flex: 1,
                        mr: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "4.5em",
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
