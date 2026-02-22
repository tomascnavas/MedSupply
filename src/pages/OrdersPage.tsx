import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";

interface OrderRow {
  id: string;
  order_number: string;
  patient_first_name: string;
  patient_last_name: string;
  payer: string;
  total_billable: number;
  margin: number;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }) as { data: OrderRow[] | null; error: any };

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      `${o.patient_first_name} ${o.patient_last_name}`.toLowerCase().includes(search.toLowerCase()) ||
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
              {orders.length} Total
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
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Order ID</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Patient Name</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Payer</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Total Billable</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Margin</th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-6 py-3">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    {search ? "No orders match your search." : "No orders yet. Create your first order!"}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        #{order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.patient_first_name} {order.patient_last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.payer}</td>
                    <td className="px-6 py-4 text-sm text-foreground text-right font-medium">
                      ${Number(order.total_billable).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                      {Number(order.margin).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="text-xs font-medium">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                      {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground">{filtered.length}</span> results
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
