export function buildUrl(basePath, params = {}) {
  const query = Object.entries(params)
    // remove undefined or null values
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    // encode both key and value for safety
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

  return query ? `${basePath}?${query}` : basePath;
}
