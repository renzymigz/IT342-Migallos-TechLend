import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminApprovalQueue() {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pending requests will appear here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
