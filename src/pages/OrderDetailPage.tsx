import { useParams, Link } from "react-router-dom";
import { User, Shield, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { mockOrders } from "@/data/mockOrders";
import { useState } from "react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? order.lineItems : order.lineItems.slice(0, 5);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
              <span>›</span>
              <span>Order #{order.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
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
                  <div className="text-sm font-medium mt-0.5">{order.patientName}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">DOB</div>
                    <div className="text-sm mt-0.5">{order.dob}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">MRN</div>
                    <div className="text-sm mt-0.5">{order.mrn}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Delivery Address</div>
                  <div className="text-sm mt-0.5 whitespace-pre-line">{order.address}</div>
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
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Primary Insurance</div>
                  <div className="text-sm font-medium mt-0.5">{order.insurance}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Policy Number</div>
                  <div className="text-sm font-mono mt-0.5">{order.policyNumber}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Auth Status</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />
                    <span className="text-sm" style={{ color: "hsl(38, 92%, 40%)" }}>Draft</span>
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
                <span className="font-medium">${order.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping (Standard)</span>
                <span className="font-medium">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {/* Margin */}
            <div className="mt-5 pt-4 border-t border-border rounded-lg bg-muted/50 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Estimated Margin
                </span>
                <span className="text-sm font-bold text-success">+{order.margin}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-success rounded-full h-2"
                  style={{ width: `${order.margin}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Based on current unit costs vs. list price.
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-6 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Line Items</h2>
            <Badge variant="secondary" className="text-xs">{order.lineItems.length} items</Badge>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Product Name</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">SKU</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Qty</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Unit Price</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 text-sm font-medium">{item.product}</td>
                  <td className="py-3 text-sm text-muted-foreground font-mono">{item.sku}</td>
                  <td className="py-3 text-sm text-right">{item.qty}</td>
                  <td className="py-3 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-sm text-right font-medium">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.lineItems.length > 5 && !showAll && (
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
