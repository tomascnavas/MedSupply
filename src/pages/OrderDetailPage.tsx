import { useParams, Link } from "react-router-dom";
import { User, Shield, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface OrderDetail {
  id: string;
  order_number: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_dob: string | null;
  patient_phone: string | null;
  patient_email: string | null;
  patient_address: string | null;
  payer: string;
  status: string;
  total_billable: number;
  cogs: number;
  margin: number;
  created_at: string;
}

interface LineItem {
  id: string;
  product: string;
  hcpcs: string | null;
  vendor: string | null;
  cost: number;
  msrp: number;
  qty: number;
  total: number;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id!)
        .single() as { data: OrderDetail | null; error: any };

      const { data: items } = await supabase
        .from("order_line_items")
        .select("*")
        .eq("order_id", id!) as { data: LineItem[] | null; error: any };

      if (orderData) setOrder(orderData);
      if (items) setLineItems(items);
      setLoading(false);
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Loading order...</div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Order not found.</div>
      </AppLayout>
    );
  }

  const displayItems = showAll ? lineItems : lineItems.slice(0, 5);
  const subtotal = lineItems.reduce((sum, i) => sum + Number(i.total), 0);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
              <span>›</span>
              <span>Order #{order.order_number}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Order #{order.order_number}</h1>
              <Badge variant="outline" className="text-xs">{order.status}</Badge>
            </div>
          </div>
          <Link to="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient + Payer row */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Patient Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Patient Name</div>
                  <div className="text-sm font-medium mt-0.5">{order.patient_first_name} {order.patient_last_name}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">DOB</div>
                    <div className="text-sm mt-0.5">{order.patient_dob || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</div>
                    <div className="text-sm mt-0.5">{order.patient_phone || "—"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Delivery Address</div>
                  <div className="text-sm mt-0.5 whitespace-pre-line">{order.patient_address || "—"}</div>
                </div>
              </div>
            </div>

            {/* Payer Details */}
            <div className="bg-card rounded-lg border-2 border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Payer Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Primary Payer</div>
                  <div className="text-sm font-medium mt-0.5 capitalize">{order.payer}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Auth Status</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />
                    <span className="text-sm" style={{ color: "hsl(38, 92%, 40%)" }}>{order.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-card rounded-lg border-2 border-primary/20 p-6">
            <h2 className="text-base font-semibold mb-1">Financial Breakdown</h2>
            <p className="text-xs text-muted-foreground mb-5">Summary of charges for this order.</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">COGS</span>
                <span className="font-medium">${Number(order.cogs).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-semibold">Total Billable</span>
                <span className="text-xl font-bold text-primary">
                  ${Number(order.total_billable).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {/* Margin */}
            <div className="mt-5 pt-4 border-t border-border rounded-lg bg-muted/50 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Estimated Margin</span>
                <span className="text-sm font-bold text-success">+{Number(order.margin).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success rounded-full h-2" style={{ width: `${Number(order.margin)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-6 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Line Items</h2>
            <Badge variant="secondary" className="text-xs">{lineItems.length} items</Badge>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Product</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">HCPCS</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Vendor</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Qty</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">MSRP</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-sm font-medium">{item.product}</td>
                  <td className="py-3 text-sm text-muted-foreground">{item.hcpcs || "—"}</td>
                  <td className="py-3 text-sm text-muted-foreground">{item.vendor || "—"}</td>
                  <td className="py-3 text-sm text-right">{item.qty}</td>
                  <td className="py-3 text-sm text-right">${Number(item.msrp).toFixed(2)}</td>
                  <td className="py-3 text-sm text-right font-medium">${Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lineItems.length > 5 && !showAll && (
            <button
              className="w-full text-center text-sm text-primary hover:underline mt-3 flex items-center justify-center gap-1"
              onClick={() => setShowAll(true)}
            >
              Show all items <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
