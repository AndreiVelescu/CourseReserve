export type UploadedFile = {
  file: File;
  preview: string;
  title: string;
  description: string;
};

export type ImageUploaderProps = {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onRemove?: (index: number) => void;
};
