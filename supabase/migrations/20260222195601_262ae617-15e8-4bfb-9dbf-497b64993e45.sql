
-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  patient_first_name TEXT NOT NULL,
  patient_last_name TEXT NOT NULL,
  patient_dob DATE,
  patient_phone TEXT,
  patient_email TEXT,
  patient_address TEXT,
  payer TEXT NOT NULL DEFAULT 'self-pay',
  status TEXT NOT NULL DEFAULT 'Draft',
  total_billable NUMERIC(12,2) NOT NULL DEFAULT 0,
  cogs NUMERIC(12,2) NOT NULL DEFAULT 0,
  margin NUMERIC(5,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order line items table
CREATE TABLE public.order_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  hcpcs TEXT,
  vendor TEXT,
  cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  msrp NUMERIC(10,2) NOT NULL DEFAULT 0,
  qty INTEGER NOT NULL DEFAULT 1,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_line_items ENABLE ROW LEVEL SECURITY;

-- For now, allow all access (auth not wired up yet)
CREATE POLICY "Allow all access to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to order_line_items" ON public.order_line_items FOR ALL USING (true) WITH CHECK (true);

-- Sequence for order numbers
CREATE SEQUENCE public.order_number_seq START 1;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_order_line_items_order_id ON public.order_line_items(order_id);
