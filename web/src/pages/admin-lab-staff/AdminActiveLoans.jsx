import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminActiveLoans() {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Active lending records will appear here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
