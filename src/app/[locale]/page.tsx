"use client";

import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { Button } from "@/components/Button";
import Link from "next/link";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter } from "@/i18n/routing";

export default function Home() {
  const { isLogged } = useIsLoggedIn();
  const router = useRouter();

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Bine ai venit la CourseReserve
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Platformă modernă pentru rezervarea și gestionarea cursurilor online
          </Typography>
          {!isLogged ? (
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                onClick={() => router.push("/register")}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Înregistrează-te
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Autentifică-te
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => router.push("/courses")}
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#667eea",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Vezi Cursurile
            </Button>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          De ce CourseReserve?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{ p: 4, height: "100%", textAlign: "center" }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Cursuri Diverse
              </Typography>
              <Typography color="text.secondary">
                Alege din zeci de cursuri în domenii precum programare, design,
                marketing și multe altele
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{ p: 4, height: "100%", textAlign: "center" }}
            >
              <EventIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Rezervare Simplă
              </Typography>
              <Typography color="text.secondary">
                Sistem intuitiv de rezervare cu doar câteva clickuri.
                Gestionează-ți ușor cursurile
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{ p: 4, height: "100%", textAlign: "center" }}
            >
              <PeopleIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Instructori Profesioniști
              </Typography>
              <Typography color="text.secondary">
                Învață de la cei mai buni instructori cu experiență vastă în
                domeniile lor
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      {!isLogged && (
        <Box sx={{ bgcolor: "#f5f5f5", py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Începe astăzi!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Înscrie-te gratuit și descoperă sute de cursuri care te vor ajuta
              să îți dezvolți cariera
            </Typography>
            <Button
              onClick={() => router.push("/register")}
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#667eea",
                "&:hover": { bgcolor: "#5568d3" },
              }}
            >
              Creează cont gratuit
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
}
