import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Shield, ClipboardList, Plus, CheckCircle, Info, Phone, Mail, MapPin, Calendar, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";

interface ProductRow {
  id: number;
  product: string;
  hcpcs: string;
  vendor: string;
  cost: number;
  msrp: number;
  qty: number;
}

const availableProducts: ProductRow[] = [
  { id: 0, product: "Oxygen Nasal Cannula", hcpcs: "A4615", vendor: "Salter Labs", cost: 3.50, msrp: 8.00, qty: 1 },
  { id: 0, product: "Glucose Test Strips (50ct)", hcpcs: "A4253", vendor: "Accu-Chek", cost: 18.00, msrp: 35.00, qty: 1 },
  { id: 0, product: "Sterile Wound Dressing", hcpcs: "A6216", vendor: "3M Healthcare", cost: 5.75, msrp: 12.00, qty: 1 },
  { id: 0, product: "Compression Stockings", hcpcs: "A6531", vendor: "Jobst Medical", cost: 22.00, msrp: 45.00, qty: 1 },
  { id: 0, product: "Nebulizer Kit", hcpcs: "A7003", vendor: "Philips Respironics", cost: 35.00, msrp: 70.00, qty: 1 },
];

const defaultProducts: ProductRow[] = [
  { id: 1, product: "Insulin Syringes 1mL", hcpcs: "A4213", vendor: "BD Medical", cost: 12.5, msrp: 25.0, qty: 2 },
  { id: 2, product: "Latex Gloves (Box)", hcpcs: "A4927", vendor: "Medline", cost: 8.2, msrp: 15.0, qty: 5 },
];

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductRow[]>(defaultProducts);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nextId = useRef(3);

  // Form state
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [payer, setPayer] = useState("self-pay");

  const addProduct = (template: ProductRow) => {
    setProducts((prev) => [...prev, { ...template, id: nextId.current++ }]);
    setAddProductOpen(false);
  };

  const totalProducts = products.length;
  const cogs = products.reduce((sum, p) => sum + p.cost * p.qty, 0);
  const subtotal = products.reduce((sum, p) => sum + p.msrp * p.qty, 0);
  const totalBillable = subtotal;
  const profit = totalBillable - cogs;
  const margin = totalBillable > 0 ? (profit / totalBillable) * 100 : 0;

  const updateQty = (id: number, qty: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  };

  const handleSubmit = async () => {
    if (products.length === 0) {
      toast({ title: "No products", description: "Add at least one product to the order.", variant: "destructive" });
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: "Missing info", description: "Patient first and last name are required.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          patient_first_name: firstName,
          patient_last_name: lastName,
          patient_dob: dob || null,
          patient_phone: phone || null,
          patient_email: email || null,
          patient_address: address || null,
          payer,
          status: "Draft",
          total_billable: totalBillable,
          cogs,
          margin: parseFloat(margin.toFixed(1)),
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert line items
      const lineItems = products.map((p) => ({
        order_id: (order as any).id,
        product: p.product,
        hcpcs: p.hcpcs,
        vendor: p.vendor,
        cost: p.cost,
        msrp: p.msrp,
        qty: p.qty,
        total: p.msrp * p.qty,
      }));

      const { error: itemsError } = await supabase
        .from("order_line_items")
        .insert(lineItems as any);

      if (itemsError) throw itemsError;

      toast({ title: "Order created", description: `Order #${orderNumber} has been saved.` });
      navigate("/orders");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create order.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold">Create New Order</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter patient details and product selection below to generate a new invoice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Patient Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="(555) 123-4567" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="john.doe@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>Shipping Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="123 Medical Way, Suite 400, New York, NY 10001" className="pl-10" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Insurance & Payer */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Insurance & Payer</h2>
              </div>
              <div className="space-y-2">
                <Label>Select Payer</Label>
                <p className="text-xs text-muted-foreground">
                  Pricing adjustments will be applied based on the selected payer contract.
                </p>
                <Select value={payer} onValueChange={setPayer}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self-pay">Self-pay</SelectItem>
                    <SelectItem value="blue-cross">Blue Cross</SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="cigna">Cigna</SelectItem>
                    <SelectItem value="unitedhealth">UnitedHealth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Order Details</h2>
                </div>
                <Popover open={addProductOpen} onOpenChange={setAddProductOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Product
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                      Select a product
                    </div>
                    {availableProducts.map((ap, i) => (
                      <button
                        key={i}
                        onClick={() => addProduct(ap)}
                        className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="font-medium">{ap.product}</div>
                        <div className="text-xs text-muted-foreground">{ap.hcpcs} · {ap.vendor}</div>
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Product</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">HCPCS</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Vendor</th>
                    <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Cost</th>
                    <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">MSRP</th>
                    <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">QTY</th>
                    <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Total</th>
                    <th className="w-10 pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {p.product[0]}
                          </span>
                          {p.product}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{p.hcpcs}</td>
                      <td className="py-3 text-sm text-muted-foreground">{p.vendor}</td>
                      <td className="py-3 text-sm text-right">${p.cost.toFixed(2)}</td>
                      <td className="py-3 text-sm text-right">${p.msrp.toFixed(2)}</td>
                      <td className="py-3 text-center">
                        <Input
                          type="number"
                          min={1}
                          value={p.qty}
                          onChange={(e) => updateQty(p.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center mx-auto h-8 text-sm"
                        />
                      </td>
                      <td className="py-3 text-sm text-right font-medium">
                        ${(p.msrp * p.qty).toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => setProducts((prev) => prev.filter((item) => item.id !== p.id))}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                          aria-label={`Remove ${p.product}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border-2 border-primary/20 p-6 sticky top-8">
              <h2 className="text-base font-semibold mb-1">Pricing Summary</h2>
              <p className="text-xs text-muted-foreground mb-5">
                Real-time calculation based on selected payer.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Products</span>
                  <span className="font-medium">{totalProducts} Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost of Goods (COGS)</span>
                  <span className="font-medium">${cogs.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal Billable</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="font-semibold">Total Billable</span>
                  <span className="text-xl font-bold text-primary">${totalBillable.toFixed(2)}</span>
                </div>
              </div>

              {/* Pricing Logic */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 mb-3">
                  <ClipboardList className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pricing Logic Details
                  </span>
                </div>
                {products.map((p) => (
                  <div key={p.id} className="mb-3 text-xs">
                    <div className="flex justify-between font-medium">
                      <span>{p.product}</span>
                      <span>Payer: {payer}</span>
                    </div>
                    <div className="text-muted-foreground mt-0.5">HCPCS: {p.hcpcs}</div>
                    <div className="bg-muted rounded p-1.5 mt-1 text-muted-foreground">
                      Formula: ${p.msrp.toFixed(2)} × {p.qty} units = ${(p.msrp * p.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Margin */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Estimated Margin
                  </span>
                  <span className="text-sm font-bold text-success">+{margin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Profit</span>
                  <span className="font-bold text-success">${profit.toFixed(2)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(margin, 100)}%` }}
                  />
                </div>
              </div>

              <Button className="w-full mt-6" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-1.5" /> Review & Submit</>
                )}
              </Button>
            </div>

            {/* Quick Tip */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold mb-1">Quick Tip</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Self-pay patients require a payment method on file before shipping. Ensure billing
                    address matches card info.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
