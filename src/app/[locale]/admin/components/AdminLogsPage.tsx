"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Stack,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from "@mui/material";
import {
  BugReport as BugIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTranslations } from "next-intl";

import { useGetAppErrorLogs } from "@/hooks/api/useGetAppErrorLogs";
import { useGetHttpErrorLogs } from "@/hooks/api/useGetHttpErrorLogs";
import { useGetLogStatistics } from "@/hooks/api/useGetLogStatistics";
import { useClearOldLogs } from "@/hooks/api/useClearOldLogs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminLogsPage() {
  const t = useTranslations("AdminLogs");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedError, setSelectedError] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const {
    data: appErrors,
    isLoading: loadingAppErrors,
    refetch: refetchAppErrors,
  } = useGetAppErrorLogs(100);
  const {
    data: httpErrors,
    isLoading: loadingHttpErrors,
    refetch: refetchHttpErrors,
  } = useGetHttpErrorLogs(100);
  const { data: stats, isLoading: loadingStats } = useGetLogStatistics();

  const clearLogsMutation = useClearOldLogs({
    onSuccess: () => {
      showSnackbar({
        message: t("logsDeleted"),
        severity: "success",
      });
      refetchAppErrors();
      refetchHttpErrors();
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || t("errorDeleting"),
        severity: "error",
      });
    },
  });

  const handleViewDetails = (error: any) => {
    setSelectedError(error);
    setDetailsDialogOpen(true);
  };

  const handleRefresh = () => {
    refetchAppErrors();
    refetchHttpErrors();
    showSnackbar({ message: t("logsRefreshed"), severity: "success" });
  };

  const handleClearOldLogs = () => {
    if (confirm(t("confirmDelete"))) {
      clearLogsMutation.mutate(30);
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 500) return "error";
    if (statusCode >= 400) return "warning";
    return "default";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ro-RO");
  };

  // Statistici
  const statsCards = [
    {
      title: t("stats.appErrors24h"),
      value: stats?.appErrors.last24Hours || 0,
      icon: <BugIcon />,
      color: "#d32f2f",
    },
    {
      title: t("stats.httpErrors24h"),
      value: stats?.httpErrors.last24Hours || 0,
      icon: <ErrorIcon />,
      color: "#f57c00",
    },
    {
      title: t("stats.totalAppErrors"),
      value: stats?.appErrors.total || 0,
      icon: <BugIcon />,
      color: "#1976d2",
    },
    {
      title: t("stats.totalHttpErrors"),
      value: stats?.httpErrors.total || 0,
      icon: <ErrorIcon />,
      color: "#388e3c",
    },
  ];

  if (loadingStats) {
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

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "error.main", width: 56, height: 56 }}>
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {t("pageTitle")}
            </Typography>
            <Typography color="text.secondary">{t("pageSubtitle")}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            {t("refresh")}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearOldLogs}
            disabled={clearLogsMutation.isPending}
          >
            {t("deleteOldLogs")}
          </Button>
        </Stack>
      </Stack>

      {/* Statistici */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
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
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
          <Tab
            label={t("tabs.appErrors")}
            icon={<BugIcon />}
            iconPosition="start"
          />
          <Tab
            label={t("tabs.httpErrors")}
            icon={<ErrorIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Card>
        <CardContent>
          {/* TAB 1: APP ERRORS */}
          <TabPanel value={currentTab} index={0}>
            {loadingAppErrors ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !appErrors || appErrors.length === 0 ? (
              <Alert severity="success">{t("alerts.noAppErrors")}</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("table.errorType")}</TableCell>
                      <TableCell>{t("table.message")}</TableCell>
                      <TableCell>{t("table.url")}</TableCell>
                      <TableCell>{t("table.date")}</TableCell>
                      <TableCell>{t("table.actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appErrors.map((error) => (
                      <TableRow key={error.id} hover>
                        <TableCell>
                          <Chip
                            label={error.errorType}
                            size="small"
                            color="error"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 300 }}
                          >
                            {error.message}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {error.url || t("dialog.na")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {formatDate(error.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={t("table.viewDetails")}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(error)}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* TAB 2: HTTP ERRORS */}
          <TabPanel value={currentTab} index={1}>
            {loadingHttpErrors ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !httpErrors || httpErrors.length === 0 ? (
              <Alert severity="success">{t("alerts.noHttpErrors")}</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("table.status")}</TableCell>
                      <TableCell>{t("table.method")}</TableCell>
                      <TableCell>{t("table.url")}</TableCell>
                      <TableCell>{t("table.ip")}</TableCell>
                      <TableCell>{t("table.message")}</TableCell>
                      <TableCell>{t("table.date")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {httpErrors.map((error) => (
                      <TableRow key={error.id} hover>
                        <TableCell>
                          <Chip
                            label={error.statusCode}
                            size="small"
                            color={getStatusColor(error.statusCode) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={error.method}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 250 }}
                          >
                            {error.url}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {error.ipAddress || t("dialog.na")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {error.message || t("dialog.na")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {formatDate(error.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("dialog.title")}</DialogTitle>
        <DialogContent>
          {selectedError && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("dialog.errorType")}
                </Typography>
                <Typography>{selectedError.errorType}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("dialog.message")}
                </Typography>
                <Typography>{selectedError.message}</Typography>
              </Box>
              {selectedError.stackTrace && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("dialog.stackTrace")}
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "grey.100",
                      maxHeight: 300,
                      overflow: "auto",
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedError.stackTrace}
                    </Typography>
                  </Paper>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("dialog.url")}
                </Typography>
                <Typography>{selectedError.url || t("dialog.na")}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("dialog.date")}
                </Typography>
                <Typography>{formatDate(selectedError.createdAt)}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            {t("dialog.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
