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
