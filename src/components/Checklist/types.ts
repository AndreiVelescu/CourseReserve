export type CheckStatus = "success" | "info" | "warning";

export type ChecklistItem = {
  id: string;
  text: string;
  status?: CheckStatus;
};

export type ChecklistProps = {
  items: ChecklistItem[];
};
