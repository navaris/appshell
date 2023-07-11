export default (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};
