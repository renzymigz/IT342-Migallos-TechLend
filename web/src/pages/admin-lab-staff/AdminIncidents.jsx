import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminIncidents() {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Incident reports and flags will appear here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
