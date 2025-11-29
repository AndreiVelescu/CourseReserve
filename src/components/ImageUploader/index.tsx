import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { AddAPhoto } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Grid2 as Grid, IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { InputField } from "../InputField";

import { ImageUploaderProps } from "./types";

export const ImageUploader = ({
  files,
  onChange,
  onRemove,
}: ImageUploaderProps) => {
  const translate = useTranslations("FileUploader");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: "",
      description: "",
    }));

    onChange([...files, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(files[index].preview);

    if (onRemove) {
      onRemove(index);
    } else {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      onChange(updatedFiles);
    }
  };

  const handleDragEnd: OnDragEndResponder<string> = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedFiles = Array.from(files);
    const [reorderedItem] = updatedFiles.splice(result.source.index, 1);
    updatedFiles.splice(result.destination.index, 0, reorderedItem);

    onChange(updatedFiles);
  };

  const handleInputChange = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    const updatedFiles = [...files];
    updatedFiles[index][field] = value;
    onChange(updatedFiles);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-uploader" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              mt={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {files.map((file, index) => (
                <Draggable
                  key={file.preview}
                  draggableId={file.preview}
                  index={index}
                >
                  {(provided) => (
                    <Stack
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...(provided.draggableProps
                          .style as React.CSSProperties),
                      }}
                      bgcolor={"white"}
                      p={1}
                      borderRadius={2}
                      border="1px dashed"
                      borderColor="#235CF3"
                      spacing={1}
                      {...provided.dragHandleProps}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Image
                          src={file.preview}
                          alt={file.file.name}
                          width={246}
                          height={150}
                          style={{
                            width: "246px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            ":hover": { backgroundColor: "background.default" },
                          }}
                          onClick={() => handleRemove(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <InputField
                        label={translate("Title")}
                        size="small"
                        value={file.title}
                        onChange={(val) =>
                          handleInputChange(index, "title", val)
                        }
                      />
                      <InputField
                        multiline
                        label={translate("Description")}
                        rows={3}
                        size="small"
                        value={file.description}
                        onChange={(val) =>
                          handleInputChange(index, "description", val)
                        }
                      />
                    </Stack>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Button
                color="primary"
                component="label"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  height: 160,
                  width: 246,
                  backgroundColor: "background.paper",
                  border: "1px dashed",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <AddAPhoto />
                {translate("Add Photos")}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};