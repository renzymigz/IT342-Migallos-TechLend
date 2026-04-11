import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { equipmentAPI } from "@/api/equipment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, PackageCheck } from "lucide-react"

const categoryLabels = {
  MICROCONTROLLERS: "Microcontrollers",
  COMPUTERS_AND_LAPTOPS: "Computers and Laptops",
  PERIPHERALS: "Peripherals",
  NETWORKING: "Networking",
  SENSORS_AND_MODULES: "Sensors and Modules",
  CABLES_AND_ADAPTERS: "Cables and Adapters",
  ROBOTICS: "Robotics",
  AR_VR: "AR/VR",
  AUDIO_VISUAL: "Audio Visual",
  TOOLS_AND_TESTING: "Tools and Testing",
  STORAGE_DEVICES: "Storage Devices",
  OTHERS: "Others",
}

export default function EquipmentDetail() {
  const { modelId } = useParams()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true)
      try {
        const res = await equipmentAPI.getCatalogModelById(modelId)
        setModel(res.data.data)
        setError("")
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load equipment details.")
      } finally {
        setLoading(false)
      }
    }

    if (modelId) {
      loadDetail()
    }
  }, [modelId])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-20">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading equipment details...
        </div>
      )}

      {!loading && error && (
        <Card className="border-destructive/40">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {!loading && !error && model && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{model.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-56 overflow-hidden rounded-lg border border-border bg-secondary/50">
                <img
                  src={model.imageUrl || "/placeholder-equipment.jpg"}
                  alt={model.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {model.description || "No description available for this equipment model yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catalog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="secondary">{categoryLabels[model.category] || model.category}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                <span className="text-muted-foreground">Available Units</span>
                <span className="font-semibold text-foreground">{model.availableCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                <span className="text-muted-foreground">Model ID</span>
                <span className="font-mono text-xs text-muted-foreground">{model.modelId}</span>
              </div>
              <div className="rounded-md border border-border bg-secondary/40 p-3 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <PackageCheck className="mt-0.5 h-4 w-4" />
                  <p>
                    This is a dedicated detail page for equipment models. You can now design this page independently
                    from the dashboard catalog.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
