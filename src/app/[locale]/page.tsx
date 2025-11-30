"use client";

import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { Button } from "@/components/Button";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";

import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const { isLogged } = useIsLoggedIn();
  const router = useRouter();

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            {t("welcomeTitle")}
          </Typography>

          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            {t("welcomeSubtitle")}
          </Typography>

          {!isLogged ? (
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                onClick={() => router.push("/register")}
                variant="contained"
                size="large"
                sx={{ bgcolor: "white", color: "#667eea" }}
              >
                {t("register")}
              </Button>

              <Button
                onClick={() => router.push("/login")}
                variant="outlined"
                size="large"
                sx={{ borderColor: "white", color: "white" }}
              >
                {t("login")}
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => router.push("/courses")}
              variant="contained"
              size="large"
              sx={{ bgcolor: "white", color: "#667eea" }}
            >
              {t("seeCourses")}
            </Button>
          )}
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          {t("whyTitle")}
        </Typography>

        <Grid container spacing={4}>
          {/* FEATURE 1 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <SchoolIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t("feature1Title")}
              </Typography>
              <Typography color="text.secondary">
                {t("feature1Desc")}
              </Typography>
            </Paper>
          </Grid>

          {/* FEATURE 2 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <EventIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t("feature2Title")}
              </Typography>
              <Typography color="text.secondary">
                {t("feature2Desc")}
              </Typography>
            </Paper>
          </Grid>

          {/* FEATURE 3 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <PeopleIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t("feature3Title")}
              </Typography>
              <Typography color="text.secondary">
                {t("feature3Desc")}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CALL-TO-ACTION BOTTOM */}
      {!isLogged && (
        <Box sx={{ bgcolor: "#f5f5f5", py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t("ctaTitle")}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {t("ctaSubtitle")}
            </Typography>

            <Button
              onClick={() => router.push("/register")}
              variant="contained"
              size="large"
              sx={{ bgcolor: "#667eea" }}
            >
              {t("ctaButton")}
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
}
