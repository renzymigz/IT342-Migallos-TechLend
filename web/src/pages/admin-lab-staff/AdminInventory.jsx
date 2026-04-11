import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminInventory() {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Equipment inventory management will appear here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
