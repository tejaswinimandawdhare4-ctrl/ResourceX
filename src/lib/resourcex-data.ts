export type ResourceCategory =
  | "Seating"
  | "Tables"
  | "AV Equipment"
  | "Parking"
  | "Kitchen"
  | "Furniture"
  | "Vehicles"
  | "Venue";

export type MatchBreakdown = {
  availability: number;
  distance: number;
  price: number;
  quantity: number;
  rating: number;
};

export type ResourceListing = {
  id: string;
  name: string;
  category: ResourceCategory;
  provider: string;
  city: string;
  area: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  delivery: boolean;
  verified: boolean;
  availableDate: string;
  availableWindow: string;
  minRental: string;
  lat: number;
  lng: number;
  description: string;
  match: MatchBreakdown;
};

export const MATCH_WEIGHTS = [
  { key: "availability", label: "Availability", weight: 30 },
  { key: "distance", label: "Distance", weight: 25 },
  { key: "price", label: "Price", weight: 20 },
  { key: "quantity", label: "Quantity compatibility", weight: 15 },
  { key: "rating", label: "Rating", weight: 10 },
] as const;

export const matchScore = (m: MatchBreakdown) =>
  m.availability + m.distance + m.price + m.quantity + m.rating;

export const matchLabel = (score: number) =>
  score >= 90 ? "Highly Recommended" : score >= 78 ? "Strong Match" : "Possible Match";

export const inr = (value: number) =>
  "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const listings: ResourceListing[] = [
  {
    id: "hotel-horizon-banquet-chairs",
    name: "Banquet Chairs",
    category: "Seating",
    provider: "Hotel Horizon",
    city: "Mumbai",
    area: "City Centre, Lower Parel",
    quantity: 200,
    unitPrice: 50,
    totalPrice: 7500,
    distanceKm: 2.4,
    rating: 4.8,
    reviews: 126,
    delivery: true,
    verified: true,
    availableDate: "15 September 2026",
    availableWindow: "5 PM – 11 PM",
    minRental: "4 hours",
    lat: 19.0009,
    lng: 72.8296,
    description:
      "Cushioned banquet chairs with protective covers, stored and maintained in-house at Hotel Horizon. Suitable for conferences, weddings and corporate dinners. Delivery, setup and pickup available within 10 km of Lower Parel.",
    match: { availability: 30, distance: 23, price: 18, quantity: 15, rating: 8 },
  },
  {
    id: "urban-banquets-banquet-chairs",
    name: "Banquet Chairs (Gold Frame)",
    category: "Seating",
    provider: "Urban Banquets",
    city: "Mumbai",
    area: "Dadar East",
    quantity: 180,
    unitPrice: 58,
    totalPrice: 8700,
    distanceKm: 4.1,
    rating: 4.6,
    reviews: 88,
    delivery: true,
    verified: true,
    availableDate: "15 September 2026",
    availableWindow: "4 PM – 12 AM",
    minRental: "6 hours",
    lat: 19.0176,
    lng: 72.8562,
    description:
      "Premium gold-frame banquet chairs, ideal for wedding receptions and gala dinners. Includes seat covers and on-site arrangement crew.",
    match: { availability: 28, distance: 20, price: 15, quantity: 15, rating: 8 },
  },
  {
    id: "grand-vista-round-tables",
    name: "Round Banquet Tables",
    category: "Tables",
    provider: "Grand Vista Resort",
    city: "Navi Mumbai",
    area: "Vashi",
    quantity: 45,
    unitPrice: 320,
    totalPrice: 9600,
    distanceKm: 8.7,
    rating: 4.7,
    reviews: 64,
    delivery: true,
    verified: true,
    availableDate: "15 September 2026",
    availableWindow: "9 AM – 11 PM",
    minRental: "8 hours",
    lat: 19.0771,
    lng: 72.9986,
    description:
      "6-seater round banquet tables with linen options. Frequently paired with chair rentals for full banquet setups.",
    match: { availability: 27, distance: 15, price: 16, quantity: 14, rating: 8 },
  },
  {
    id: "crown-hospitality-projector",
    name: "4K Projector & Screen",
    category: "AV Equipment",
    provider: "Crown Hospitality",
    city: "Pune",
    area: "Kalyani Nagar",
    quantity: 6,
    unitPrice: 2400,
    totalPrice: 4800,
    distanceKm: 3.2,
    rating: 4.9,
    reviews: 51,
    delivery: true,
    verified: true,
    availableDate: "16 September 2026",
    availableWindow: "10 AM – 10 PM",
    minRental: "4 hours",
    lat: 18.5479,
    lng: 73.9046,
    description:
      "6000-lumen 4K projector with 12ft motorised screen, HDMI/USB-C inputs and on-site technician support.",
    match: { availability: 26, distance: 22, price: 17, quantity: 13, rating: 10 },
  },
  {
    id: "cityserve-parking",
    name: "Event Parking Spaces",
    category: "Parking",
    provider: "CityServe Hospitality",
    city: "Hyderabad",
    area: "Banjara Hills",
    quantity: 120,
    unitPrice: 90,
    totalPrice: 10800,
    distanceKm: 1.8,
    rating: 4.4,
    reviews: 37,
    delivery: false,
    verified: true,
    availableDate: "15 September 2026",
    availableWindow: "6 PM – 1 AM",
    minRental: "3 hours",
    lat: 17.4126,
    lng: 78.4392,
    description:
      "Secured basement and surface parking with valet support, ideal for banquet overflow during peak evenings.",
    match: { availability: 24, distance: 24, price: 13, quantity: 12, rating: 7 },
  },
  {
    id: "elite-events-sound-system",
    name: "Line Array Sound System",
    category: "AV Equipment",
    provider: "Elite Events",
    city: "Bengaluru",
    area: "Indiranagar",
    quantity: 4,
    unitPrice: 5600,
    totalPrice: 11200,
    distanceKm: 6.5,
    rating: 4.5,
    reviews: 42,
    delivery: true,
    verified: false,
    availableDate: "17 September 2026",
    availableWindow: "11 AM – 11 PM",
    minRental: "6 hours",
    lat: 12.9719,
    lng: 77.6412,
    description:
      "Complete line array PA setup with mixer, wireless mics and sound engineer for banquet halls up to 800 guests.",
    match: { availability: 22, distance: 18, price: 12, quantity: 12, rating: 7 },
  },
  {
    id: "grand-vista-kitchen",
    name: "Commercial Kitchen Capacity",
    category: "Kitchen",
    provider: "Grand Vista Resort",
    city: "Navi Mumbai",
    area: "Nerul",
    quantity: 2,
    unitPrice: 9500,
    totalPrice: 19000,
    distanceKm: 11.2,
    rating: 4.6,
    reviews: 29,
    delivery: false,
    verified: true,
    availableDate: "18 September 2026",
    availableWindow: "6 AM – 4 PM",
    minRental: "1 day",
    lat: 19.0330,
    lng: 73.0169,
    description:
      "FSSAI-compliant production kitchen lines with cold storage access, available for catering overflow during off-peak hours.",
    match: { availability: 20, distance: 12, price: 11, quantity: 11, rating: 8 },
  },
  {
    id: "crown-hospitality-hall",
    name: "Banquet Hall (400 pax)",
    category: "Venue",
    provider: "Crown Hospitality",
    city: "Delhi",
    area: "Aerocity",
    quantity: 1,
    unitPrice: 68000,
    totalPrice: 68000,
    distanceKm: 5.4,
    rating: 4.8,
    reviews: 73,
    delivery: false,
    verified: true,
    availableDate: "20 September 2026",
    availableWindow: "12 PM – 12 AM",
    minRental: "6 hours",
    lat: 28.5535,
    lng: 77.1207,
    description:
      "Pillarless banquet hall with in-house AV, green rooms and 200-car parking. Shared with partner hotels on idle dates.",
    match: { availability: 24, distance: 19, price: 10, quantity: 10, rating: 9 },
  },
  {
    id: "cityserve-vehicles",
    name: "Guest Shuttle Vehicles",
    category: "Vehicles",
    provider: "CityServe Hospitality",
    city: "Mumbai",
    area: "Andheri East",
    quantity: 8,
    unitPrice: 4200,
    totalPrice: 8400,
    distanceKm: 9.3,
    rating: 4.3,
    reviews: 24,
    delivery: true,
    verified: false,
    availableDate: "15 September 2026",
    availableWindow: "7 AM – 11 PM",
    minRental: "8 hours",
    lat: 19.1136,
    lng: 72.8697,
    description:
      "13-seater guest shuttles with chauffeur, used for airport transfers and inter-venue guest movement.",
    match: { availability: 21, distance: 14, price: 14, quantity: 12, rating: 7 },
  },
  {
    id: "urban-banquets-catering-equipment",
    name: "Catering & Chafing Equipment",
    category: "Kitchen",
    provider: "Urban Banquets",
    city: "Pune",
    area: "Baner",
    quantity: 60,
    unitPrice: 260,
    totalPrice: 7800,
    distanceKm: 3.9,
    rating: 4.5,
    reviews: 40,
    delivery: true,
    verified: true,
    availableDate: "15 September 2026",
    availableWindow: "8 AM – 11 PM",
    minRental: "5 hours",
    lat: 18.5590,
    lng: 73.7868,
    description:
      "Chafing dishes, buffet counters, warmers and serving stations, cleaned and event-ready before dispatch.",
    match: { availability: 26, distance: 21, price: 16, quantity: 13, rating: 8 },
  },
];

export const getListing = (id: string) => listings.find((l) => l.id === id);

export const featuredListing = listings[0]!;

export const categories: ResourceCategory[] = [
  "Seating",
  "Tables",
  "AV Equipment",
  "Parking",
  "Kitchen",
  "Furniture",
  "Vehicles",
  "Venue",
];

export const cities = ["Mumbai", "Navi Mumbai", "Pune", "Hyderabad", "Bengaluru", "Delhi"];

export type ParsedRequirement = {
  resource: string;
  quantity: string;
  location: string;
  date: string;
  time: string;
  budget: string;
};

/**
 * Finds the best matching hospitality resource from the actual
 * ResourceX listings.
 */
function findResource(text: string): string | null {
  const t = text.toLowerCase();

  // Common words users may use for each ResourceX listing.
  const aliases: Array<[string[], string]> = [
    [["chair", "chairs", "seat", "seats"], "Banquet Chairs"],
    [["table", "tables"], "Round Banquet Tables"],
    [["projector", "projectors", "screen", "screens"], "4K Projector & Screen"],
    [["parking", "park", "spaces"], "Event Parking Spaces"],
    [["sound", "speaker", "speakers", "audio", "pa"], "Line Array Sound System"],
    [["kitchen"], "Commercial Kitchen Capacity"],
    [["hall", "venue", "banquet hall"], "Banquet Hall (400 pax)"],
    [["vehicle", "vehicles", "shuttle", "shuttles", "bus", "buses", "cab", "cabs"], "Guest Shuttle Vehicles"],
    [["catering", "chafing", "buffet", "warmer", "warmers"], "Catering & Chafing Equipment"],
  ];

  // First check user-friendly aliases.
  for (const [words, resource] of aliases) {
    if (words.some((word) => t.includes(word))) {
      return resource;
    }
  }

  // Then check the actual listing names dynamically.
  const matchingListing = listings.find((listing) => {
    const words = listing.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);

    return words.some((word) => t.includes(word));
  });

  return matchingListing?.name ?? null;
}

/**
 * Extracts all "quantity + resource" combinations from a sentence.
 *
 * Examples:
 * "40 tables and 50 chairs"
 * -> tables: 40
 * -> chairs: 50
 *
 * "2 projectors, 4 speakers and 100 parking spaces"
 * -> projectors: 2
 * -> speakers: 4
 * -> parking spaces: 100
 */
export function parseRequirements(text: string): ParsedRequirement[] {
  const t = text.toLowerCase();

  const budget = t.match(
    /(?:under|below|within|upto|up to|max)?\s*(?:₹|rs\.?|inr)\s*([\d,]+)/
  );

  const locationMatch = t.match(
    /(?:near|in|around|at)\s+(the\s+)?([a-z\s]{3,28}?)(?=\s+(?:tomorrow|today|tonight|next|on|under|below|for|within|by)\b|[,.]|$)/
  );

  const location = locationMatch
    ? locationMatch[2]!
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "City Centre";

  const date = /tomorrow/.test(t)
    ? "Tomorrow"
    : /tonight|today/.test(t)
      ? "Today"
      : /this weekend|weekend/.test(t)
        ? "This weekend"
        : /next week/.test(t)
          ? "Next week"
          : "15 September 2026";

  const time = /evening|night|tonight/.test(t)
    ? "Evening (5 PM – 11 PM)"
    : /morning/.test(t)
      ? "Morning (8 AM – 12 PM)"
      : /afternoon/.test(t)
        ? "Afternoon (12 PM – 5 PM)"
        : "Evening (5 PM – 11 PM)";

  const formattedBudget = budget
    ? "₹" +
      budget[1]!
        .replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "₹10,000";

  const requirements: ParsedRequirement[] = [];

  /*
   * Find every number in the user's sentence.
   *
   * Example:
   * "I need 40 tables and 50 chairs"
   *
   * matches:
   * 40
   * 50
   */
  const quantityMatches = [...t.matchAll(/\b(\d{1,5})\b/g)];

  for (const match of quantityMatches) {
    const quantity = match[1];

    if (!quantity) continue;

    const start = match.index ?? 0;

    // Look at the words immediately following the number.
    const afterNumber = t.slice(start + match[0].length, start + match[0].length + 80);

    const resource = findResource(afterNumber);

    if (!resource) continue;

    requirements.push({
      resource,
      quantity,
      location,
      date,
      time,
      budget: formattedBudget,
    });
  }

  /*
   * Remove duplicates.
   */
  const uniqueRequirements = requirements.filter(
    (req, index, array) =>
      array.findIndex(
        (x) =>
          x.resource.toLowerCase() === req.resource.toLowerCase() &&
          x.quantity === req.quantity,
      ) === index,
  );

  /*
   * If no quantity was found, still try to identify
   * a resource from the sentence.
   */
  if (uniqueRequirements.length === 0) {
    const resource = findResource(t);

    if (resource) {
      uniqueRequirements.push({
        resource,
        quantity: "150",
        location,
        date,
        time,
        budget: formattedBudget,
      });
    }
  }

  /*
   * Final fallback.
   */
  if (uniqueRequirements.length === 0) {
    uniqueRequirements.push({
      resource: "Banquet Chairs",
      quantity: "150",
      location,
      date,
      time,
      budget: formattedBudget,
    });
  }

  return uniqueRequirements;
}

/**
 * Backward-compatible single-resource parser.
 *
 * Existing parts of the website that still call parseRequirement()
 * will continue to work.
 */
export function parseRequirement(text: string): ParsedRequirement {
  return parseRequirements(text)[0]!;
}
export const utilizationSeries = [
  { month: "Apr", utilization: 54, bookings: 18, revenue: 92000 },
  { month: "May", utilization: 61, bookings: 24, revenue: 114000 },
  { month: "Jun", utilization: 58, bookings: 21, revenue: 106000 },
  { month: "Jul", utilization: 69, bookings: 29, revenue: 138000 },
  { month: "Aug", utilization: 74, bookings: 34, revenue: 161000 },
  { month: "Sep", utilization: 78, bookings: 38, revenue: 182000 },
];

export const demandSeries = [
  { resource: "Banquet Chairs", requests: 42 },
  { resource: "Round Tables", requests: 31 },
  { resource: "Projectors", requests: 24 },
  { resource: "Parking", requests: 19 },
  { resource: "Sound Systems", requests: 14 },
];

export const bookingStatusSeries = [
  { name: "Confirmed", value: 12, color: "var(--color-chart-1)" },
  { name: "Negotiating", value: 5, color: "var(--color-chart-2)" },
  { name: "Pending", value: 7, color: "var(--color-chart-3)" },
  { name: "Completed", value: 22, color: "var(--color-chart-4)" },
];

export const resourcePerformance = [
  { resource: "Banquet Chairs", category: "Seating", quantity: 200, bookings: 18, utilization: 92, revenue: 42000, status: "Active" },
  { resource: "Round Tables", category: "Tables", quantity: 45, bookings: 12, utilization: 76, revenue: 28500, status: "Active" },
  { resource: "4K Projector", category: "AV Equipment", quantity: 6, bookings: 8, utilization: 61, revenue: 18000, status: "Active" },
  { resource: "Parking Spaces", category: "Parking", quantity: 120, bookings: 6, utilization: 44, revenue: 15600, status: "Active" },
  { resource: "Sound System", category: "AV Equipment", quantity: 4, bookings: 4, utilization: 31, revenue: 12400, status: "Paused" },
  { resource: "Guest Shuttles", category: "Vehicles", quantity: 8, bookings: 3, utilization: 22, revenue: 9800, status: "Active" },
];

export type RequestRecord = {
  id: string;
  business: string;
  resource: string;
  quantity: number;
  date: string;
  time: string;
  budget: number;
  status: "Pending" | "Negotiating" | "Accepted" | "Rejected" | "Completed";
};

export const incomingRequests: RequestRecord[] = [
  { id: "RQ-2041", business: "Elite Events", resource: "Banquet Chairs", quantity: 150, date: "15 Sep 2026", time: "5 PM – 11 PM", budget: 10000, status: "Negotiating" },
  { id: "RQ-2038", business: "CityServe Hospitality", resource: "Round Tables", quantity: 30, date: "16 Sep 2026", time: "6 PM – 12 AM", budget: 9600, status: "Pending" },
  { id: "RQ-2036", business: "Grand Vista Resort", resource: "4K Projector", quantity: 2, date: "18 Sep 2026", time: "10 AM – 6 PM", budget: 5200, status: "Accepted" },
  { id: "RQ-2030", business: "Urban Banquets", resource: "Parking Spaces", quantity: 80, date: "20 Sep 2026", time: "7 PM – 1 AM", budget: 7200, status: "Pending" },
  { id: "RQ-2024", business: "Crown Hospitality", resource: "Sound System", quantity: 1, date: "22 Sep 2026", time: "4 PM – 11 PM", budget: 6000, status: "Rejected" },
  { id: "RQ-2011", business: "Elite Events", resource: "Catering Equipment", quantity: 40, date: "02 Sep 2026", time: "9 AM – 9 PM", budget: 8400, status: "Completed" },
];

export type BookingRecord = {
  id: string;
  resource: string;
  business: string;
  date: string;
  time: string;
  amount: number;
  status: "Confirmed" | "Upcoming" | "In Progress" | "Completed" | "Cancelled";
};

export const bookings: BookingRecord[] = [
  { id: "BK-5192", resource: "150 Banquet Chairs", business: "Elite Events", date: "15 Sep 2026", time: "5 PM – 11 PM", amount: 7500, status: "Confirmed" },
  { id: "BK-5188", resource: "30 Round Tables", business: "CityServe Hospitality", date: "16 Sep 2026", time: "6 PM – 12 AM", amount: 9600, status: "Upcoming" },
  { id: "BK-5180", resource: "2 Projectors", business: "Grand Vista Resort", date: "07 Sep 2026", time: "10 AM – 6 PM", amount: 4800, status: "In Progress" },
  { id: "BK-5171", resource: "80 Parking Spaces", business: "Urban Banquets", date: "28 Aug 2026", time: "7 PM – 1 AM", amount: 7200, status: "Completed" },
  { id: "BK-5164", resource: "1 Sound System", business: "Crown Hospitality", date: "21 Aug 2026", time: "4 PM – 11 PM", amount: 5600, status: "Cancelled" },
];

export type NotificationRecord = {
  id: string;
  title: string;
  time: string;
  kind: "request" | "booking" | "match" | "negotiation";
};

export const notifications: NotificationRecord[] = [
  { id: "n1", title: "Hotel Horizon responded to your booking request.", time: "4 minutes ago", kind: "negotiation" },
  { id: "n2", title: "Your booking for 150 chairs has been confirmed.", time: "26 minutes ago", kind: "booking" },
  { id: "n3", title: "A new resource matches your saved requirement.", time: "2 hours ago", kind: "match" },
  { id: "n4", title: "New request received for Banquet Chairs.", time: "5 hours ago", kind: "request" },
  { id: "n5", title: "Your counter-offer was accepted.", time: "Yesterday", kind: "negotiation" },
];

export type DayStatus = "available" | "partial" | "booked" | "unavailable";

export const septemberAvailability: Record<number, { status: DayStatus; note: string }> = {
  15: { status: "booked", note: "150 chairs booked" },
  16: { status: "available", note: "200 chairs available" },
  17: { status: "available", note: "200 chairs available" },
  18: { status: "partial", note: "100 chairs booked" },
  19: { status: "partial", note: "60 chairs booked" },
  20: { status: "unavailable", note: "Maintenance — unavailable" },
  22: { status: "partial", note: "40 chairs booked" },
  25: { status: "booked", note: "200 chairs booked" },
  26: { status: "unavailable", note: "Blocked by provider" },
};

export const reviews = [
  { business: "Elite Events", rating: 5, text: "Chairs arrived an hour early and setup crew handled the full banquet layout. Repeat booking for sure.", date: "Aug 2026" },
  { business: "Grand Vista Resort", rating: 5, text: "Clean inventory, transparent pricing and quick negotiation over ResourceX. Saved us a last-minute crisis.", date: "Jul 2026" },
  { business: "Urban Banquets", rating: 4, text: "Good condition and on-time delivery. Pickup was slightly delayed but communication was clear.", date: "Jul 2026" },
];

// ─────────────────────────────────────────────
// Multi-requirement matching & fulfillment logic
// ─────────────────────────────────────────────

export type MatchedListing = ResourceListing & { requestedQuantity: number };

export type RequestedRequirement = { resource: string; quantity: number };

export type RequirementGroup = {
  requirement: RequestedRequirement;
  matches: MatchedListing[];
};

export type FulfillmentItem = {
  requirement: RequestedRequirement;
  listing: MatchedListing;
};

export type FulfillmentPlan = {
  items: FulfillmentItem[];
  total: number;
};

export type ListingFilters = {
  maxDistance: number;
  maxPrice: number;
  minRating: number;
  deliveryOnly: boolean;
  selectedCats: string[];
};

export type SortOption = "Best Match" | "Closest" | "Lowest Price" | "Highest Rated";

/**
 * Price for a listing scaled to the quantity actually requested,
 * rather than the fixed `totalPrice` in the mock data (which assumes
 * a default booking size). Falls back to `totalPrice` if no quantity
 * is given.
 */
export function computeListingPrice(listing: ResourceListing, requestedQuantity?: number) {
  if (typeof requestedQuantity === "number" && requestedQuantity > 0) {
    return requestedQuantity * listing.unitPrice;
  }
  return listing.totalPrice;
}

export function listingSatisfiesRequirement(
  l: ResourceListing,
  requirement: RequestedRequirement,
  filters: ListingFilters,
) {
  const listingName = l.name.toLowerCase().trim();
  const requirementName = requirement.resource.toLowerCase().trim();

  const resourceMatches =
    listingName === requirementName ||
    listingName.includes(requirementName) ||
    requirementName.includes(listingName);

  const quantityMatches = l.quantity >= requirement.quantity;

  const passesDistance = l.distanceKm <= filters.maxDistance + 4;
  const passesPrice = computeListingPrice(l, requirement.quantity) <= filters.maxPrice;
  const passesRating = l.rating >= filters.minRating;
  const passesDelivery = !filters.deliveryOnly || l.delivery;
  const passesCategory =
    filters.selectedCats.length === 0 || filters.selectedCats.includes(l.category);

  return (
    resourceMatches &&
    quantityMatches &&
    passesDistance &&
    passesPrice &&
    passesRating &&
    passesDelivery &&
    passesCategory
  );
}

export function sortListings<T extends ResourceListing>(items: T[], sort: SortOption): T[] {
  const sorted = [...items];
  if (sort === "Best Match") sorted.sort((a, b) => matchScore(b.match) - matchScore(a.match));
  if (sort === "Closest") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "Lowest Price") sorted.sort((a, b) => a.totalPrice - b.totalPrice);
  if (sort === "Highest Rated") sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}

/**
 * Option B: for each requirement, find every provider that can
 * individually satisfy it (enough quantity + passes filters).
 */
export function buildRequirementGroups(
  requirements: RequestedRequirement[],
  filters: ListingFilters,
  sort: SortOption,
): RequirementGroup[] {
  return requirements.map((requirement) => {
    const matches: MatchedListing[] = listings
      .filter((l) => listingSatisfiesRequirement(l, requirement, filters))
      .map((l) => ({ ...l, requestedQuantity: requirement.quantity }));

    return { requirement, matches: sortListings(matches, sort) };
  });
}

/**
 * Option C: build the best complete combination that fulfills every
 * requirement. Prefers bundling into fewer providers when a provider
 * can cover more than one requirement, but only if doing so doesn't
 * drop the average match score by more than BUNDLE_TOLERANCE points.
 */
export function buildFulfillmentPlan(groups: RequirementGroup[]): FulfillmentPlan | null {
  if (groups.length === 0 || groups.some((g) => g.matches.length === 0)) {
    return null;
  }

  const bestByRequirement = groups.map((g) =>
    [...g.matches].sort((a, b) => matchScore(b.match) - matchScore(a.match)),
  );

  const independentPlan = bestByRequirement.map((list) => list[0]!);
  const independentAvgScore =
    independentPlan.reduce((sum, l) => sum + matchScore(l.match), 0) / independentPlan.length;

  const providerAppearances = new Map<string, number>();
  bestByRequirement.forEach((list) => {
    const providers = new Set(list.map((l) => l.provider));
    providers.forEach((p) => providerAppearances.set(p, (providerAppearances.get(p) ?? 0) + 1));
  });

  let bestPlan = independentPlan;
  let bestProviderCount = new Set(independentPlan.map((l) => l.provider)).size;

  const BUNDLE_TOLERANCE = 10; // max acceptable average match-score drop

  for (const [provider, appearances] of providerAppearances) {
    if (appearances < 2) continue;

    const candidatePlan = bestByRequirement.map((list) => {
      const providerMatch = list.find((l) => l.provider === provider);
      return providerMatch ?? list[0]!;
    });

    const candidateAvgScore =
      candidatePlan.reduce((sum, l) => sum + matchScore(l.match), 0) / candidatePlan.length;

    const candidateProviderCount = new Set(candidatePlan.map((l) => l.provider)).size;

    const withinTolerance = independentAvgScore - candidateAvgScore <= BUNDLE_TOLERANCE;
    const isMoreBundled = candidateProviderCount < bestProviderCount;

    if (withinTolerance && isMoreBundled) {
      bestPlan = candidatePlan;
      bestProviderCount = candidateProviderCount;
    }
  }

  const items: FulfillmentItem[] = bestPlan.map((listing, i) => ({
    requirement: groups[i]!.requirement,
    listing,
  }));

  const total = items.reduce(
    (sum, item) => sum + computeListingPrice(item.listing, item.listing.requestedQuantity),
    0,
  );

  return { items, total };
}