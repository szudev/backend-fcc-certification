const FILE_UPLOAD_STATES = {
  IDLE: "idle",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
} as const;

export type FileUploadStateType =
  (typeof FILE_UPLOAD_STATES)[keyof typeof FILE_UPLOAD_STATES];
export default FILE_UPLOAD_STATES;
