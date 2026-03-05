import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="User details and preferences">
      <div className="p-6 md:p-8 space-y-6">
        <Card className="border-border/60">
          <CardContent className="pt-6 flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">UD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">User Demo</p>
              <p className="text-sm text-muted-foreground">user@openbusiness.ai</p>
              <p className="text-xs text-muted-foreground">Administrator • OpenBusiness.ai</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input defaultValue="User Demo" />
              <Input defaultValue="user@openbusiness.ai" />
              <Input defaultValue="+91 90000 00000" />
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="font-semibold">Two-factor authentication</p>
                <p className="text-muted-foreground">Enabled for this account.</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="font-semibold">Password</p>
                <p className="text-muted-foreground">Last changed 14 days ago.</p>
              </div>
              <Button variant="outline">Manage Security</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Plan and Billing</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-border/60 p-4">
              <p className="font-semibold">Enterprise Plan</p>
              <p className="text-muted-foreground">Next billing date: 12 Apr 2026</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="font-semibold">Payment Method</p>
              <p className="text-muted-foreground">Visa ending in 4242</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
