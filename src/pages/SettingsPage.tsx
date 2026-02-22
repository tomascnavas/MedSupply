import { Mail, LogOut, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Manage your account settings and preferences.
        </p>

        {/* Profile Card */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          {/* Avatar & name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
              TC
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold">Tom Cook</div>
              <div className="text-sm text-muted-foreground">Administrator</div>
            </div>
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              Active Account
            </Badge>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Tom Cook" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="admin">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Operations Manager</SelectItem>
                  <SelectItem value="billing">Billing Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <Label>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input defaultValue="tom@medsupply.co" className="pl-10" readOnly />
            </div>
          </div>

          {/* Account Actions */}
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Last login: Today at 9:41 AM from IP 192.168.1.1
            </span>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5">
              <LogOut className="w-4 h-4 mr-1.5" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Password & Security */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Password & Security</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Password</div>
              <div className="text-sm text-muted-foreground">••••••••••••••••</div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
