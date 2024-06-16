import { API_HOST } from "../config";

export type FileReturnFormat = { name: string; type: string; size: number };
type UploadFileReturnType = [Error?, FileReturnFormat?];

export default async function UploadFile(
  file: File
): Promise<UploadFileReturnType> {
  try {
    const formData = new FormData();
    formData.append("upfile", file);
    const response = await fetch(`${API_HOST}/api/fileanalyse`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok)
      return [
        new Error(`Error uploading file: ${response.statusText}`),
        undefined,
      ];
    const json = (await response.json()) as FileReturnFormat;

    return [undefined, json];
  } catch (error) {
    return [
      new Error(error instanceof Error ? error.message : "Unkown error."),
      undefined,
    ];
  }
}
