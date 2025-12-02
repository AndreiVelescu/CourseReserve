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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("CourseGroups");
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const { showSnackbar } = useSnackbar();
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: errorStudents,
  } = useGetCurrentUser();
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
  const { data: availableStudents, isLoading: isLoadingStudents } =
    useGetAvailableStudentsForGroup({
      variables: {
        courseId: courseId,
      },
      enabled: true,
    });

  const createGroupMutation = useCreateGroup({
    onSuccess: () => {
      showSnackbar({
        message: t("messages.groupCreated"),
        severity: "success",
      });
      setCreateDialogOpen(false);
      setNewGroupData({ name: "", description: "", maxMembers: 10 });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || t("messages.errorCreating"),
        severity: "error",
      });
    },
  });

  const updateGroupMutation = useUpdateGroup({
    onSuccess: () => {
      showSnackbar({
        message: t("messages.groupUpdated"),
        severity: "success",
      });
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || t("messages.errorUpdating"),
        severity: "error",
      });
    },
  });

  const deleteGroupMutation = useDeleteGroup({
    onSuccess: () => {
      showSnackbar({
        message: t("messages.groupDeleted"),
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || t("messages.errorDeleting"),
        severity: "error",
      });
    },
  });

  const addMemberMutation = useAddMemberToGroup({
    onSuccess: () => {
      showSnackbar({
        message: t("messages.memberAdded"),
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
        message: error.message || t("messages.errorAddingMember"),
        severity: "error",
      });
    },
  });

  const removeMemberMutation = useRemoveMemberFromGroup({
    onSuccess: () => {
      showSnackbar({
        message: t("messages.memberRemoved"),
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["groups", "course"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", "available-students"],
      });
    },
    onError: (error) => {
      showSnackbar({
        message: error.message || t("messages.errorRemovingMember"),
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
    if (confirm(t("confirmations.deleteGroup", { name: groupName }))) {
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
    if (confirm(t("confirmations.removeMember", { username }))) {
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

  // ✅ Verificare autorizare - doar INSTRUCTOR și ADMIN
  if (
    !currentUser ||
    (currentUser.role !== "INSTRUCTOR" && currentUser.role !== "ADMIN")
  ) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("noPermission")}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push(`/courses/${courseId}`)}
        >
          {t("backToCourse")}
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
          {t("errorLoading")} {error.message}
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
              {t("pageTitle")}
            </Typography>
            <Typography color="text.secondary">{t("pageSubtitle")}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            {t("buttons.refresh")}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            {t("buttons.createGroup")}
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
                    {t("stats.totalGroups")}
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
                    {t("stats.totalMembers")}
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
                    {t("stats.availableStudents")}
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
                {t("emptyState.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {t("emptyState.subtitle")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                {t("buttons.createFirstGroup")}
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
                        <Tooltip title={t("groupCard.edit")}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditGroup(group)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("groupCard.archive")}>
                          <IconButton
                            size="small"
                            onClick={() => handleArchiveGroup(group.id)}
                          >
                            <ArchiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("groupCard.delete")}>
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
                        label={
                          group.maxMembers
                            ? `${group.members.length}/${group.maxMembers} ${t("groupCard.members").toLowerCase()}`
                            : `${group.members.length}/∞ ${t("groupCard.members").toLowerCase()}`
                        }
                        size="small"
                        color={
                          group.members.length >= (group.maxMembers || Infinity)
                            ? "error"
                            : "primary"
                        }
                      />
                      <Chip
                        label={
                          group.status === "ACTIVE"
                            ? t("status.active")
                            : t("status.archived")
                        }
                        size="small"
                        color={
                          group.status === "ACTIVE" ? "success" : "default"
                        }
                      />
                    </Stack>

                    {/* Members List */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {t("groupCard.members")}
                      </Typography>
                      {group.members.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          {t("groupCard.noMembers")}
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
                                <Tooltip title={t("groupCard.remove")}>
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
                      {t("buttons.addMember")}
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
        <DialogTitle>{t("dialogs.createTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label={t("dialogs.groupName")}
              value={newGroupData.name}
              onChange={(e) =>
                setNewGroupData({ ...newGroupData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label={t("dialogs.description")}
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
              label={t("dialogs.maxMembers")}
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
          <Button onClick={() => setCreateDialogOpen(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateGroup}
            disabled={!newGroupData.name || createGroupMutation.isPending}
          >
            {createGroupMutation.isPending
              ? t("buttons.creating")
              : t("buttons.create")}
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
        <DialogTitle>{t("dialogs.editTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label={t("dialogs.groupName")}
              value={editGroupData.name}
              onChange={(e) =>
                setEditGroupData({ ...editGroupData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label={t("dialogs.description")}
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
              label={t("dialogs.maxMembers")}
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
          <Button onClick={() => setEditDialogOpen(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateGroup}
            disabled={!editGroupData.name || updateGroupMutation.isPending}
          >
            {updateGroupMutation.isPending
              ? t("buttons.updating")
              : t("buttons.update")}
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
        <DialogTitle>{t("dialogs.addMemberTitle")}</DialogTitle>
        <DialogContent>
          {isLoadingStudents ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : errorStudents ? (
            <Alert severity="error">
              {t("dialogs.errorLoadingStudents")} {errorStudents.message}
            </Alert>
          ) : !availableStudents || availableStudents.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                {t("dialogs.noAvailableStudents")}
              </Typography>
            </Box>
          ) : (
            <List>
              {availableStudents.map((student) => (
                <ListItem
                  key={student.id}
                  component="button"
                  onClick={() => handleAddMember(student.id)}
                  disabled={addMemberMutation.isPending}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
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
          <Button onClick={() => setAddMemberDialogOpen(false)}>
            {t("buttons.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
