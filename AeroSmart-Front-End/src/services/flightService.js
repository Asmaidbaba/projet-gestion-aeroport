const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Flight-related API calls
export const searchFlights = async (searchParams) => {
  const queryParams = new URLSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    date: searchParams.date,
    passengers: searchParams.passengers
  });

  return apiCall(`/flights/search?${queryParams}`);
};

export const getFlightDetails = async (flightId) => {
  return apiCall(`/flights/${flightId}`);
};

export const createBooking = async (bookingData) => {
  return apiCall('/flights/book', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const getAirports = async () => {
  return apiCall('/airports');
};

export const populateSampleFlights = async () => {
  return apiCall('/flights/populate', {
    method: 'POST',
  });
};

// Health check
export const healthCheck = async () => {
  return apiCall('/health');
};