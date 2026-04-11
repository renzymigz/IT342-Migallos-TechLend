import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminUsers() {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage admin and borrower accounts here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
