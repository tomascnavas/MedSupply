import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { mockOrders } from "@/data/mockOrders";

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.patientName.toLowerCase().includes(search.toLowerCase()) ||
      o.payer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1>Orders</h1>
            <Badge variant="secondary" className="text-xs font-medium">
              124 Total
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Filter">
              <Filter className="w-4 h-4" />
            </Button>
            <Link to="/orders/new">
              <Button>
                <Plus className="w-4 h-4 mr-1.5" />
                Create Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, patient, or payer..."
            className="pl-10 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Order ID
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Patient Name
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Payer
                </th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Total Billable
                </th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Margin
                </th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Status
                </th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.patientName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.payer}</td>
                  <td className="px-6 py-4 text-sm text-foreground text-right font-medium">
                    ${order.totalBillable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                    {order.margin}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className="text-xs font-medium">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                    {order.createdDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground">1</span> to{" "}
            <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
            <span className="font-medium text-foreground">124</span> results
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
