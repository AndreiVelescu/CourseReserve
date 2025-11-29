"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  TextareaAutosize,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { Button } from "@/components/Button";
import { useCreateCourseMutation } from "@/hooks/api/useCreateCourseMutation";
import { Category } from "@prisma/client";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { Alert } from "@/components/Alert";
import { set } from "lodash";
import { useSnackbar } from "@/context/SnackbarContext";
import { useRouter } from "@/i18n/routing";

export function CreateCourseForm() {
  const router = useRouter();
  const { isLogged } = useIsLoggedIn();
  const { data: currentUser } = useGetCurrentUser({ enabled: isLogged });
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: Category.PROGRAMMING,
    durationMinutes: 40,
    startDate: new Date().toISOString().split("T")[0],
  });
  const createCourseMutation = useCreateCourseMutation();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form values:", form);
    createCourseMutation.mutate(
      {
        instructorId: currentUser!.id,
        title: form.title,
        description: form.description,
        category: form.category,
        durationMinutes: Number(form.durationMinutes),
        startDate: new Date(form.startDate),
      },
      {
        onSuccess: () => {
          setLoading(false);
          showSnackbar({
            message: "Curs creat cu succes!",
            severity: "success",
          });
          setForm({
            title: "",
            description: "",
            category: Category.PROGRAMMING,
            durationMinutes: 40,
            startDate: new Date().toISOString().split("T")[0],
          });
          setTimeout(() => {
            router.push("/courses");
          }, 1500);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          id="title"
          name="title"
          label="Titlu curs"
          variant="outlined"
          value={form.title}
          onChange={handleInputChange}
          required
        />

        <Box>
          <Typography variant="caption">Descriere</Typography>
          <TextareaAutosize
            name="description"
            minRows={4}
            placeholder="Descriere..."
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </Box>

        <Select
          name="category"
          value={form.category}
          onChange={handleSelectChange}
          fullWidth
        >
          <MenuItem value={Category.PROGRAMMING}>Programare</MenuItem>
          <MenuItem value={Category.DESIGN}>Design</MenuItem>
          <MenuItem value={Category.MARKETING}>Marketing</MenuItem>
          <MenuItem value={Category.LANGUAGES}>Limbi străine</MenuItem>
          <MenuItem value={Category.OTHER}>Altele</MenuItem>
        </Select>

        <TextField
          name="durationMinutes"
          type="number"
          label="Durată (minute)"
          value={form.durationMinutes}
          inputProps={{ min: 40 }}
          onChange={handleInputChange}
          required
        />

        <TextField
          name="startDate"
          type="date"
          label="Data începerii"
          InputLabelProps={{ shrink: true }}
          value={form.startDate}
          onChange={handleInputChange}
          required
        />

        <Button type="submit" variant="contained" disabled={loading}>
          Creează curs
        </Button>
      </Box>
    </form>
  );
}
