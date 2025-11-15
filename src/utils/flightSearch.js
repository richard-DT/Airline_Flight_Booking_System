export function getTotalPassengers(pax) {
  return Object.values(pax).reduce((a, b) => a + b, 0);
}
