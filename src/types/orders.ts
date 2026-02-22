export interface LineItem {
  product: string;
  sku: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  patientName: string;
  payer: string;
  totalBillable: number;
  margin: number;
  status: string;
  createdDate: string;
  dob: string;
  mrn: string;
  address: string;
  email: string;
  phone: string;
  insurance: string;
  policyNumber: string;
  lineItems: LineItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
