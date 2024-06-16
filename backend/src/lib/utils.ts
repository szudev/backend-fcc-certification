import { parse, isValid, format } from "date-fns";

type validateUrlResult = {
  valid: boolean;
  urlObject: URL | undefined;
};

export const validateUrl = (urlString: string): validateUrlResult => {
  try {
    const url = new URL(urlString);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return { valid: true, urlObject: url };
    }

    return { valid: false, urlObject: undefined };
  } catch (_) {
    return { valid: false, urlObject: undefined };
  }
};

export function validateExerciseDateFormat(date: string) {
  const newDate = format(new Date(), "yyyy-MM-dd");
  const parsedDate = parse(date, "yyyy-MM-dd", newDate);
  return isValid(parsedDate) && date === format(parsedDate, "yyyy-MM-dd");
}

export function createCurrentDateAndFormat() {
  const currentDate = new Date();
  const formattedDateStr = format(currentDate, "yyyy-MM-dd");
  const formattedDate = parse(formattedDateStr, "yyyy-MM-dd", new Date());
  return formattedDate;
}

export function formatStringToExerciseDate(dateString: string): Date {
  const format = "yyyy-MM-dd";
  const date = parse(dateString, format, new Date());
  return date;
}

export function formatExerciseDateToString(date: Date): string {
  const formatStr = "EEE MMM dd yyyy";
  const formattedDate = format(date, formatStr);
  return formattedDate;
}
