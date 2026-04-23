import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { equipmentAPI } from "@/api/equipment"
import { useCart } from "@/context/CartContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EquipmentCard } from "@/components/equipment-card"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react"

const categoryOptions = [
  { value: "ALL", label: "All Categories" },
  { value: "MICROCONTROLLERS", label: "Microcontrollers" },
  { value: "COMPUTERS_AND_LAPTOPS", label: "Computers and Laptops" },
  { value: "PERIPHERALS", label: "Peripherals" },
  { value: "NETWORKING", label: "Networking" },
  { value: "SENSORS_AND_MODULES", label: "Sensors and Modules" },
  { value: "CABLES_AND_ADAPTERS", label: "Cables and Adapters" },
  { value: "ROBOTICS", label: "Robotics" },
  { value: "AR_VR", label: "AR/VR" },
  { value: "AUDIO_VISUAL", label: "Audio Visual" },
  { value: "TOOLS_AND_TESTING", label: "Tools and Testing" },
  { value: "STORAGE_DEVICES", label: "Storage Devices" },
  { value: "OTHERS", label: "Others" },
]

const categoryLabels = Object.fromEntries(
  categoryOptions.filter((option) => option.value !== "ALL").map((option) => [option.value, option.label])
)

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("ALL")
  const [catalog, setCatalog] = useState([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState("")
  const { items, addItem } = useCart()

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true)
    try {
      const res = await equipmentAPI.getCatalogItems()
      const mapped = (res.data.data || []).map((item) => ({
        id: item.id,
        modelId: item.modelId,
        image: item.image,
        propertyTag: item.propertyTag || "No property tag",
        name: item.name,
        category: categoryLabels[item.category] || item.category,
        status: (item.status || "AVAILABLE").toLowerCase(),
        description: item.description || "No description provided.",
      }))
      setCatalog(mapped)
      setCatalogError("")
    } catch (err) {
      setCatalogError(err.response?.data?.error?.message || "Failed to load equipment catalog.")
    } finally {
      setLoadingCatalog(false)
    }
  }, [])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  const filtered = useMemo(() => {
    return catalog.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.propertyTag.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "ALL" || item.category === (categoryLabels[category] || category)
      return matchSearch && matchCategory
    })
  }, [catalog, search, category])

  const addToCart = (equipment) => {
    addItem(equipment)
  }

  return (
    <div className="pt-16">
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or property tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between sm:w-52">
                  <span className="truncate">{category}</span>
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                  {categoryOptions.map((cat) => (
                    <DropdownMenuRadioItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {catalogError && (
            <Card className="mb-4 border-destructive/40">
              <CardContent className="p-3 text-sm text-destructive">{catalogError}</CardContent>
            </Card>
          )}

          {loadingCatalog && (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading catalog...
            </div>
          )}

          {!loadingCatalog && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  onAddToCart={addToCart}
                  inCart={items.some((i) => i.id === equipment.id)}
                  onViewDetail={(selected) => navigate(`/catalog/item/${selected.id}`)}
                />
              ))}
            </div>
          )}

          {!loadingCatalog && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No equipment found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
