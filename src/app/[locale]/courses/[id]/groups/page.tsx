// app/[locale]/courses/[id]/groups/page.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PersonRemove as PersonRemoveIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useGetGroupsByCourseId } from "@/hooks/api/useGetGroupsByCourseId";
import { useCreateGroup } from "@/hooks/api/useCreateGroup";
import { useAddMemberToGroup } from "@/hooks/api/useAddMemberToGroup";
import { useRemoveMemberFromGroup } from "@/hooks/api/useRemoveMemberFromGroup";
import { useUpdateGroup } from "@/hooks/api/useUpdateGroup";
import { useDeleteGroup } from "@/hooks/api/useDeleteGroup";
import { useGetAvailableStudentsForGroup } from "@/hooks/api/useGetAvailableStudentsForGroup";
import { useSnackbar } from "@/context/SnackbarContext";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useRouter } from "@/i18n/routing";

export default function CourseGroupsPage() {
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    maxMembers: 10,
  });

  const [editGroupData, setEditGroupData] = useState({
    name: "",
    description: "",
    maxMembers: 10,
  });

  const {
    data: groups,
    isLoading,
    error,
    refetch,
  } = useGetGroupsByCourseId({ variables: courseId });

  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
  const { data: availableStudents, isLoading: isLoadingStudents } =
    useGetAvailableStudentsForGroup({
      variables: {
        courseId: courseId,
        groupId: selectedGroupId || undefined,
      },
      enabled: addMemberDialogOpen,
    });

  // ✅ DEBUG - verifică ce primește hook-ul
  console.log("=== HOOK DEBUG ===");
  console.log("courseId:", courseId);
  console.log("selectedGroupId:", selectedGroupId);
  console.log("addMemberDialogOpen:", addMemberDialogOpen);
  console.log("availableStudents:", availableStudents);
  console.log("isLoadingStudents:", isLoadingStudents);

  const createGroupMutation = useCreateGroup({
    onSuccess: () => {
      showSnackbar({ message: "Grup creat cu succes!", severity: "success" });
      setCreateDialogOpen(false);
      setNewGroupData({ name: "", description: "", maxMembers: 10 });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la crearea grupului",
        severity: "error",
      });
    },
  });

  const updateGroupMutation = useUpdateGroup({
    onSuccess: () => {
      showSnackbar({
        message: "Grup actualizat cu succes!",
        severity: "success",
      });
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la actualizarea grupului",
        severity: "error",
      });
    },
  });

  const deleteGroupMutation = useDeleteGroup({
    onSuccess: () => {
      showSnackbar({ message: "Grup șters cu succes!", severity: "success" });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la ștergerea grupului",
        severity: "error",
      });
    },
  });

  const addMemberMutation = useAddMemberToGroup({
    onSuccess: () => {
      showSnackbar({
        message: "Membru adăugat cu succes!",
        severity: "success",
      });
      setAddMemberDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", "available-students"],
      });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la adăugarea membrului",
        severity: "error",
      });
    },
  });

  const removeMemberMutation = useRemoveMemberFromGroup({
    onSuccess: () => {
      showSnackbar({
        message: "Membru eliminat cu succes!",
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", "available-students"],
      });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || "Eroare la eliminarea membrului",
        severity: "error",
      });
    },
  });

  const handleCreateGroup = () => {
    createGroupMutation.mutate({
      courseId,
      ...newGroupData,
    });
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroupId(group.id);
    setEditGroupData({
      name: group.name,
      description: group.description || "",
      maxMembers: group.maxMembers || 10,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateGroup = () => {
    if (!selectedGroupId) return;
    updateGroupMutation.mutate({
      groupId: selectedGroupId,
      ...editGroupData,
    });
  };

  const handleDeleteGroup = (groupId: number, groupName: string) => {
    if (confirm(`Sigur vrei să ștergi grupul "${groupName}"?`)) {
      deleteGroupMutation.mutate(groupId);
    }
  };

  const handleAddMember = (userId: number) => {
    if (!selectedGroupId) return;
    addMemberMutation.mutate({
      groupId: selectedGroupId,
      userId,
    });
  };

  const handleRemoveMember = (
    groupId: number,
    userId: number,
    username: string,
  ) => {
    if (
      confirm(
        `Sigur vrei să elimini pe ${username} din grup? Rezervarea la curs va fi restaurată.`,
      )
    ) {
      removeMemberMutation.mutate({
        groupId,
        userId,
        restoreReservation: true,
      });
    }
  };

  const handleArchiveGroup = (groupId: number) => {
    updateGroupMutation.mutate({
      groupId,
      status: "ARCHIVED",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // ✅ Verificare utilizator
  if (isLoadingUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    !currentUser ||
    (currentUser.role !== "INSTRUCTOR" && currentUser.role !== "ADMIN")
  ) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Nu ai permisiunea de a accesa această pagină. Doar instructorii și
          administratorii pot gestiona grupuri.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push(`/courses/${courseId}`)}
        >
          Înapoi la curs
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Eroare la încărcarea grupurilor: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <GroupIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Gestionare Grupuri
            </Typography>
            <Typography color="text.secondary">
              Organizează studenții în grupuri pentru acest curs
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Reîmprospătează
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Creează Grup
          </Button>
        </Stack>
      </Stack>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Grupuri
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {groups?.length || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <GroupIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Membri
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {groups?.reduce((sum, g) => sum + g.members.length, 0) || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <PersonAddIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Studenți Disponibili
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {availableStudents?.length || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                  <PersonAddIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Groups Grid */}
      {groups && groups.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <GroupIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nu există grupuri create
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Creează primul grup pentru a organiza studenții
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Creează Primul Grup
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {groups?.map((group) => (
            <Grid item xs={12} md={6} lg={4} key={group.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    {/* Group Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {group.name}
                        </Typography>
                        {group.description && (
                          <Typography variant="body2" color="text.secondary">
                            {group.description}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Editează">
                          <IconButton
                            size="small"
                            onClick={() => handleEditGroup(group)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Arhivează">
                          <IconButton
                            size="small"
                            onClick={() => handleArchiveGroup(group.id)}
                          >
                            <ArchiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Șterge">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteGroup(group.id, group.name)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>

                    <Divider />

                    {/* Group Stats */}
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={`${group.members.length}/${group.maxMembers || "∞"} membri`}
                        size="small"
                        color={
                          group.members.length >= (group.maxMembers || Infinity)
                            ? "error"
                            : "primary"
                        }
                      />
                      <Chip
                        label={group.status}
                        size="small"
                        color={
                          group.status === "ACTIVE" ? "success" : "default"
                        }
                      />
                    </Stack>

                    {/* Members List */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Membri:
                      </Typography>
                      {group.members.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Niciun membru încă
                        </Typography>
                      ) : (
                        <List dense sx={{ py: 0 }}>
                          {group.members.map((member) => (
                            <ListItem key={member.id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{ width: 32, height: 32, fontSize: 14 }}
                                >
                                  {getInitials(member.user.username)}
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
                                      {member.user.username}
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
                                secondary={member.user.email}
                              />
                              <ListItemSecondaryAction>
                                <Tooltip title="Elimină">
                                  <IconButton
                                    size="small"
                                    edge="end"
                                    onClick={() =>
                                      handleRemoveMember(
                                        group.id,
                                        member.userId,
                                        member.user.username,
                                      )
                                    }
                                  >
                                    <PersonRemoveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                    {/* Add Member Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setAddMemberDialogOpen(true);
                      }}
                      disabled={
                        group.members.length >= (group.maxMembers || Infinity)
                      }
                    >
                      Adaugă Membru
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Group Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Creează Grup Nou</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Nume Grup"
              value={newGroupData.name}
              onChange={(e) =>
                setNewGroupData({ ...newGroupData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Descriere"
              value={newGroupData.description}
              onChange={(e) =>
                setNewGroupData({
                  ...newGroupData,
                  description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Număr maxim de membri"
              type="number"
              value={newGroupData.maxMembers}
              onChange={(e) =>
                setNewGroupData({
                  ...newGroupData,
                  maxMembers: parseInt(e.target.value),
                })
              }
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Anulează</Button>
          <Button
            variant="contained"
            onClick={handleCreateGroup}
            disabled={!newGroupData.name || createGroupMutation.isPending}
          >
            {createGroupMutation.isPending ? "Se creează..." : "Creează"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editează Grup</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Nume Grup"
              value={editGroupData.name}
              onChange={(e) =>
                setEditGroupData({ ...editGroupData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Descriere"
              value={editGroupData.description}
              onChange={(e) =>
                setEditGroupData({
                  ...editGroupData,
                  description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Număr maxim de membri"
              type="number"
              value={editGroupData.maxMembers}
              onChange={(e) =>
                setEditGroupData({
                  ...editGroupData,
                  maxMembers: parseInt(e.target.value),
                })
              }
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Anulează</Button>
          <Button
            variant="contained"
            onClick={handleUpdateGroup}
            disabled={!editGroupData.name || updateGroupMutation.isPending}
          >
            {updateGroupMutation.isPending
              ? "Se actualizează..."
              : "Actualizează"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adaugă Membru în Grup</DialogTitle>
        <DialogContent>
          {availableStudents && availableStudents.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                Nu există studenți disponibili pentru a fi adăugați în grup
              </Typography>
            </Box>
          ) : (
            <List>
              {availableStudents?.map((student) => (
                <ListItem
                  key={student.id}
                  component="button"
                  onClick={() => handleAddMember(student.id)}
                  disabled={addMemberMutation.isPending}
                >
                  <ListItemAvatar>
                    <Avatar>{getInitials(student.username)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.username}
                    secondary={student.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialogOpen(false)}>Închide</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
