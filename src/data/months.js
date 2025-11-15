// src/data/months.js

export const months = [
  { name: 'January', short: 'Jan', number: 1 },
  { name: 'February', short: 'Feb', number: 2 },
  { name: 'March', short: 'Mar', number: 3 },
  { name: 'April', short: 'Apr', number: 4 },
  { name: 'May', short: 'May', number: 5 },
  { name: 'June', short: 'Jun', number: 6 },
  { name: 'July', short: 'Jul', number: 7 },
  { name: 'August', short: 'Aug', number: 8 },
  { name: 'September', short: 'Sep', number: 9 },
  { name: 'October', short: 'Oct', number: 10 },
  { name: 'November', short: 'Nov', number: 11 },
  { name: 'December', short: 'Dec', number: 12 }
]

export const monthNames = months.map(m => m.name)
export const monthShortNames = months.map(m => m.short)
export const monthNumbers = months.map(m => m.number)

export function getMonthName(num, short = false) {
  const month = months.find(m => m.number === num)
  return short ? month?.short : month?.name
}
