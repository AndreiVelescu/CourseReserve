import { Cancel, CheckCircle } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Modal } from "../Modal";

export default function ConfirmEmailModal({
  open,
  handleClose,
  body,
}: {
  open: boolean;
  handleClose: () => void;
  body: string;
}) {
  const translateContent = useTranslations("EmailConfirmation");
  const translateButton = useTranslations("Buttons");

  const isInvalid = body.toLowerCase().includes("invalid");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="email-confirmation-title"
    >
      <Box>
        <Stack alignItems="center" gap={1}>
          {isInvalid ? (
            <Cancel color="error" fontSize="large" />
          ) : (
            <CheckCircle color="success" fontSize="large" />
          )}
          <Typography
            id="email-confirmation-title"
            variant="h6"
            component="h2"
            fontWeight={700}
          >
            {body
              ? translateContent(body)
              : translateContent("Email confirmed, close this modal to login")}
          </Typography>
        </Stack>
        <Box textAlign="center" mt={2}>
          <Button onClick={handleClose} variant="contained" color="primary">
            {translateButton(isInvalid ? "Close" : "Close and Login")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
