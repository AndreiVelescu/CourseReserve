// app/[locale]/profile/page.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { Button } from "@/components/Button";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "@/i18n/routing";
import { useQueryClient } from "@tanstack/react-query";

import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGetAllReservations } from "@/hooks/api/useGetAllReservations";
import { useDeleteReservation } from "@/hooks/api/useDeleteReservation";
import { useGetUserGroups } from "@/hooks/api/useGetUserGroups";
import { useGetUserStats } from "@/hooks/api/useGetUserStats";
import { useSnackbar } from "@/context/SnackbarContext";
import { Accordion } from "@/components/Accordion";
import { CreateCourseForm } from "./components/CreateCourseForm";

// ✅ Definim interfața pentru grupuri
interface UserGroup {
  id: number;
  groupId: number;
  groupName: string;
  groupDescription: string | null;
  groupStatus: string;
  isLeader: boolean;
  joinedAt: string;
  course: {
    id: number;
    title: string;
    category: string;
    startDate: string;
    durationMinutes: number;
  };
  members: Array<{
    id: number;
    userId: number;
    username: string;
    email: string;
    isLeader: boolean;
    joinedAt: string;
  }>;
  memberCount: number;
  maxMembers: number | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { isLogged } = useIsLoggedIn();
  const { data: currentUser } = useGetCurrentUser({ enabled: isLogged });
  const { data: reservations, isLoading: loadingReservations } =
    useGetAllReservations();

  // ✅ Tipăm explicit datele
  const { data: userGroups, isLoading: loadingGroups } = useGetUserGroups(
    isLogged,
  ) as {
    data: UserGroup[] | undefined;
    isLoading: boolean;
  };

  const { data: userStats } = useGetUserStats(isLogged);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState(0);

  const deleteReservationMutation = useDeleteReservation({
    onSuccess: () => {
      showSnackbar({
        message: "Rezervare ștearsă cu succes!",
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la ștergerea rezervării",
        severity: "error",
      });
    },
  });

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

  const handleDeleteReservation = (
    reservationId: number,
    courseTitle: string,
  ) => {
    if (
      confirm(
        `Sigur vrei să ștergi rezervarea pentru "${courseTitle}"? Această acțiune este ireversibilă.`,
      )
    ) {
      deleteReservationMutation.mutate(reservationId);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Statistici cu date reale
  const stats = [
    {
      title: "Rezervări Active",
      value: userStats?.reservations || 0,
      icon: <BookmarkIcon />,
      color: "#667eea",
    },
    {
      title: "Cursuri Viitoare",
      value: userStats?.upcomingCourses || 0,
      icon: <SchoolIcon />,
      color: "#2ecc71",
    },
    {
      title: "Grupuri",
      value: userStats?.groups || 0,
      icon: <GroupIcon />,
      color: "#f39c12",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 6 }}>
      {/* HEADER CU GRADIENT */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 6,
          mb: -4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: 42,
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              {currentUser.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {currentUser.username}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={getRoleLabel(currentUser.role)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {currentUser.email}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pt: 6 }}>
        {/* STATISTICI */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        gutterBottom
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* TABS */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tab
              icon={<BookmarkIcon />}
              iconPosition="start"
              label="Rezervări"
            />
            <Tab icon={<GroupIcon />} iconPosition="start" label="Grupuri" />
            {(currentUser.role === "INSTRUCTOR" ||
              currentUser.role === "ADMIN") && (
              <Tab
                icon={<SchoolIcon />}
                iconPosition="start"
                label="Gestionare Cursuri"
              />
            )}
          </Tabs>
        </Paper>

        {/* TAB PANELS */}
        <Paper sx={{ p: 3 }}>
          {/* TAB 1: REZERVĂRI */}
          <TabPanel value={currentTab} index={0}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Rezervările tale
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {loadingReservations ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !reservations || reservations.length === 0 ? (
              <Box textAlign="center" py={6}>
                <BookmarkIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nu ai rezervări momentan
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Explorează cursurile disponibile și rezervă locul tău!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/courses")}
                >
                  Vezi cursurile
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {reservations.map((reservation) => (
                  <Grid item xs={12} md={6} key={reservation.id}>
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                fontWeight="600"
                                gutterBottom
                              >
                                {reservation.course.title}
                              </Typography>
                              <Chip
                                label={reservation.course.category}
                                size="small"
                                color="primary"
                              />
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Vezi detalii">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    router.push(
                                      `/courses/${reservation.courseId}`,
                                    )
                                  }
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Șterge rezervarea">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDeleteReservation(
                                      reservation.id,
                                      reservation.course.title,
                                    )
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
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {reservation.course.description}
                          </Typography>

                          <Divider />

                          <Stack spacing={0.5}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <CalendarTodayIcon
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography variant="caption">
                                <strong>Start:</strong>{" "}
                                {new Date(
                                  reservation.course.startDate,
                                ).toLocaleDateString("ro-RO")}
                              </Typography>
                            </Stack>
                            <Typography variant="caption">
                              <strong>Durată:</strong>{" "}
                              {reservation.course.durationMinutes} minute
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <strong>Rezervat:</strong>{" "}
                              {new Date(
                                reservation.reservedAt,
                              ).toLocaleDateString("ro-RO")}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* TAB 2: GRUPURI */}
          <TabPanel value={currentTab} index={1}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Grupurile tale
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {loadingGroups ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !userGroups || userGroups.length === 0 ? (
              <Box textAlign="center" py={6}>
                <GroupIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nu ești membru în niciun grup
                </Typography>
                <Typography color="text.secondary">
                  Vei fi adăugat în grupuri de către instructori
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {userGroups.map((group) => (
                  <Grid item xs={12} md={6} key={group.id}>
                    <Card>
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={1}
                              >
                                <Typography variant="h6" fontWeight="600">
                                  {group.groupName}
                                </Typography>
                                {group.isLeader && (
                                  <Chip
                                    label="Leader"
                                    size="small"
                                    color="warning"
                                    icon={<StarIcon />}
                                  />
                                )}
                              </Stack>
                              {group.groupDescription && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {group.groupDescription}
                                </Typography>
                              )}
                            </Box>
                            <Chip
                              label={group.groupStatus}
                              size="small"
                              color={
                                group.groupStatus === "ACTIVE"
                                  ? "success"
                                  : "default"
                              }
                            />
                          </Stack>

                          <Divider />

                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Curs: {group.course.title}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={group.course.category}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${group.memberCount}/${group.maxMembers || "∞"} membri`}
                                size="small"
                              />
                            </Stack>
                          </Box>

                          <Divider />

                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Membri ({group.memberCount}):
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {group.members.slice(0, 3).map((member) => (
                                <ListItem key={member.id} sx={{ px: 0 }}>
                                  <ListItemAvatar>
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: 14,
                                      }}
                                    >
                                      {getInitials(member.username)}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Typography variant="body2">
                                          {member.username}
                                        </Typography>
                                        {member.isLeader && (
                                          <StarIcon
                                            sx={{
                                              fontSize: 16,
                                              color: "warning.main",
                                            }}
                                          />
                                        )}
                                      </Stack>
                                    }
                                  />
                                </ListItem>
                              ))}
                              {group.memberCount > 3 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  +{group.memberCount - 3} membri
                                </Typography>
                              )}
                            </List>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* TAB 3: GESTIONARE CURSURI (doar pentru INSTRUCTOR/ADMIN) */}
          {(currentUser.role === "INSTRUCTOR" ||
            currentUser.role === "ADMIN") && (
            <TabPanel value={currentTab} index={2}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Gestionare Cursuri
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {/* Butoane rapide */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => router.push("/admin")}
                      startIcon={<BadgeIcon />}
                    >
                      Panou Admin
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => router.push("/courses")}
                      startIcon={<SchoolIcon />}
                    >
                      Vezi toate cursurile
                    </Button>
                  </Grid>
                </Grid>

                <Divider />

                {/* Formular creare curs */}
                <Accordion title="📝 Creează un curs nou">
                  <CreateCourseForm />
                </Accordion>
              </Stack>
            </TabPanel>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
