-- Add tour fields to existing inventory table
ALTER TABLE inventory 
ADD COLUMN tour_enabled boolean DEFAULT false,
ADD COLUMN tour_category text CHECK (tour_category IN ('twoSeaterConvertible', 'fourFiveSeater')),
ADD COLUMN tour_max_passengers integer DEFAULT 1,
ADD COLUMN tour_durations text[] DEFAULT ARRAY['1h', '2h'],
ADD COLUMN tour_pricing jsonb DEFAULT '{"perHour": {"pax1": 300, "pax2": 225, "pax3": 175, "pax4": 150, "allowPax4": false}}',
ADD COLUMN tour_operating_hours jsonb DEFAULT '{"monday": {"start": "09:00", "end": "18:00"}, "tuesday": {"start": "09:00", "end": "18:00"}, "wednesday": {"start": "09:00", "end": "18:00"}, "thursday": {"start": "09:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "18:00"}, "saturday": {"start": "09:00", "end": "20:00"}, "sunday": {"start": "10:00", "end": "18:00"}}',
ADD COLUMN tour_blackouts jsonb DEFAULT '[]',
ADD COLUMN tour_pickup_location text DEFAULT 'Luxx Brickell, Miami, FL',
ADD COLUMN tour_routes text[] DEFAULT ARRAY[]::text[];

-- Create TourRoute table
CREATE TABLE tour_routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    duration text NOT NULL CHECK (duration IN ('1h', '2h')),
    waypoints jsonb DEFAULT '[]', -- Array of {lat, lng, label}
    has_photo_stop boolean DEFAULT false,
    photo_stop_note text,
    map_embed_url text,
    gallery text[] DEFAULT ARRAY[]::text[], -- Array of image/video URLs
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create TourAddOn table
CREATE TABLE tour_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    price numeric NOT NULL,
    per_booking boolean DEFAULT true,
    per_passenger boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create TourBooking table
CREATE TABLE tour_bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference text UNIQUE NOT NULL,
    car_id uuid REFERENCES inventory(id),
    route_id uuid REFERENCES tour_routes(id),
    date date NOT NULL,
    start_time time NOT NULL,
    duration_minutes integer NOT NULL,
    passengers integer NOT NULL,
    base_price numeric NOT NULL,
    addon_price numeric DEFAULT 0,
    total_price numeric NOT NULL,
    addons jsonb DEFAULT '[]', -- Array of selected add-ons
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')),
    hold_expires_at timestamp with time zone,
    contact jsonb NOT NULL, -- {name, phone, email, passengers: []}
    waiver_signed boolean DEFAULT false,
    waiver_signed_at timestamp with time zone,
    payment_intent_id text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert seed tour routes
INSERT INTO tour_routes (title, description, duration, waypoints, has_photo_stop, photo_stop_note, gallery) VALUES
('Miami Icons - 1 Hour', 'Experience Miami''s most iconic destinations in a thrilling one-hour ride-along tour through South Beach, luxury mansions, and the stunning Key Biscayne Bridge.', '1h', 
'[
  {"lat": 25.7617, "lng": -80.1918, "label": "South Beach"},
  {"lat": 25.7814, "lng": -80.1373, "label": "Star Island Mansions"},
  {"lat": 25.7753, "lng": -80.1669, "label": "Miami Cruise Port"},
  {"lat": 25.7617, "lng": -80.1918, "label": "Brickell Financial District"},
  {"lat": 25.7463, "lng": -80.1651, "label": "Key Biscayne Bridge"}
]', true, 'Perfect photo opportunity with Miami skyline backdrop at Key Biscayne Bridge', ARRAY[]::text[]),

('Ultimate Skyline - 2 Hours', 'The complete Miami experience featuring an extended loop through Rickenbacker Causeway, waterfront vantage points, and all the city''s most photogenic locations.', '2h',
'[
  {"lat": 25.7617, "lng": -80.1918, "label": "South Beach"},
  {"lat": 25.7814, "lng": -80.1373, "label": "Star Island Mansions"},
  {"lat": 25.7463, "lng": -80.1651, "label": "Key Biscayne Bridge"},
  {"lat": 25.7463, "lng": -80.1651, "label": "Rickenbacker Causeway"},
  {"lat": 25.7753, "lng": -80.1669, "label": "Miami Cruise Port"},
  {"lat": 25.7617, "lng": -80.1918, "label": "Brickell Waterfront"},
  {"lat": 25.7814, "lng": -80.1373, "label": "Design District"}
]', true, 'Multiple photo stops including Rickenbacker Causeway panoramic views', ARRAY[]::text[]);

-- Insert seed tour add-ons
INSERT INTO tour_addons (title, price, per_booking, per_passenger) VALUES
('Printed Photo Package', 49.00, true, false),
('Pro Video Clip', 99.00, true, false);

-- Enable tours for sample cars and set categories
UPDATE inventory 
SET 
    tour_enabled = true,
    tour_category = 'twoSeaterConvertible',
    tour_max_passengers = 1,
    tour_routes = ARRAY['miami-icons-1h', 'ultimate-skyline-2h']
WHERE make = 'Lamborghini' AND model LIKE '%Huracán%';

UPDATE inventory 
SET 
    tour_enabled = true,
    tour_category = 'fourFiveSeater', 
    tour_max_passengers = 3,
    tour_pricing = '{"perHour": {"pax1": 300, "pax2": 225, "pax3": 175, "pax4": 150, "allowPax4": false}}',
    tour_routes = ARRAY['miami-icons-1h', 'ultimate-skyline-2h']
WHERE make = 'Rolls-Royce' AND model LIKE '%Cullinan%';

-- Create indexes for performance
CREATE INDEX idx_tour_bookings_car_date ON tour_bookings(car_id, date);
CREATE INDEX idx_tour_bookings_status ON tour_bookings(status);
CREATE INDEX idx_inventory_tour_enabled ON inventory(tour_enabled) WHERE tour_enabled = true;
