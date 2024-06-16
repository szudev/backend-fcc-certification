import urlModel from "../models/urls";
import { findUrlResult, saveNewUrlResult } from "../types/db.services.types";

export async function findUrl(url: string): Promise<findUrlResult> {
  try {
    const searchedUrl = await urlModel.findOne({ originalUrl: url });
    if (!searchedUrl) return [undefined, undefined];
    return [undefined, searchedUrl];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on findUrl service."
      ),
      undefined,
    ];
  }
}

export async function saveNewUrl(url: string): Promise<saveNewUrlResult> {
  try {
    const savedUrl = await urlModel.create({ originalUrl: url });
    await savedUrl.save();
    return [undefined, savedUrl];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on findUrl service."
      ),
      undefined,
    ];
  }
}

export async function findUrlById(id: number): Promise<findUrlResult> {
  try {
    const searchedUrl = await urlModel.findById(id);
    if (!searchedUrl) return [undefined, undefined];
    return [undefined, searchedUrl];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on findUrl service."
      ),
      undefined,
    ];
  }
}
