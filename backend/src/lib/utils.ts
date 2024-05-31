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
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  return formattedDate;
}
