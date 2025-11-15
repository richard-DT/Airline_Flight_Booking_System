// Generate array of days (1–31)
export const days = Array.from({ length: 31 }, (_, i) => i + 1)

// Generate birth years (e.g., 1900–current year)
const currentYear = new Date().getFullYear()
export const birthYears = Array.from({ length: 120 }, (_, i) => currentYear - i)
