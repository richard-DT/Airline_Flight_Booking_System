export const sampleBooking = {
  _id: "BKG-20251103-0001",
  flightId: "FL-1689",
  flightPriceId: "FP-1689-ECO",
  bookingDate: "2025-11-03T09:15:00Z",
  seatNumber: "12A",
  flightType: "Domestic",
  departureTerminal: "Terminal 3",
  departureGate: "A5",
  arrivalTerminal: "Terminal 1",
  arrivalGate: "B6",
  status: "Confirmed",
  paymentStatus: "Paid",
  paymentMethod: "Credit Card",
  currency: "PHP",
  totalAmount: 8920.78,
  passengers: [
    {
      passengerId: "PAX-0001",
      title: "Mr.",
      firstName: "Juan",
      lastName: "Dela Cruz",
      birthdate: "1990-04-18",
      nationality: "PH",
      contactInformation: {
        mobileNumber: "+639171234567",
        email: "juan.delacruz@example.com"
      },
      baggageAllowance: {
        checkedIn: 20,
        handCarry: 7
      },
      seatPreference: "Window"
    }
  ],
  flight: {
    flightId: "FL-1689",
    airlineId: "AL-001",
    flightNumber: "5J 321",
    origin: {
      _id: "MNL",
      name: "Ninoy Aquino International Airport",
      city: "Manila",
      country: "Philippines",
      timezone: "Asia/Manila"
    },
    destination: {
      _id: "ILO",
      name: "Iloilo International Airport",
      city: "Iloilo",
      country: "Philippines",
      timezone: "Asia/Manila"
    },
    departureTime: "2025-11-10T00:00:00Z",
    arrivalTime: "2025-11-10T01:15:00Z",
    flightDuration: 75,
    flightType: "Domestic"
  },
  flightPrice: {
    flightPriceId: "FP-1689-ECO",
    cabinClass: "Economy",
    seatNumber: '17A',
    basePrice: 3500.02,
    taxesAndFees: {
      adminFee: 150.43,
      fuelSurcharge: 400.65,
      adminFeeVAT: 18.60,
      domesticPassengerServiceCharge: 200.11,
      airportDomesticPassengerServiceCharge: 100.46,
      valueAddedTax: 252.43,
      subtotal: 4620.67
    },
    travelInsuranceFee: 800.11,
    total: 4620
  },
  airline: {
    airlineId: "AL-001",
    name: "Cebu Pacific Air"
  },
  createdAt: "2025-11-03T09:15:00Z",
  updatedAt: "2025-11-03T09:15:00Z"
}
