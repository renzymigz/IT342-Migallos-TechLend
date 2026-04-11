import { Fragment, useCallback, useMemo, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import {
  Barcode,
  Cable,
  ChevronDown,
  ChevronRight,
  Cpu,
  Monitor,
  Plus,
  Search,
  ServerCog,
  Thermometer,
  Upload,
  Wifi,
} from "lucide-react"

const categories = [
  "All Categories",
  "Microcontrollers",
  "Networking",
  "Sensors & Modules",
  "Computing",
  "Peripherals",
  "Cables & Adapters",
]

const mockEquipmentModels = [
  {
    id: "model-1",
    name: "Arduino Uno R3",
    category: "Microcontrollers",
    description: "ATmega328P board with USB programming.",
    image: "/placeholder-equipment.jpg",
    physicalItems: [
      { id: "pi-1", modelId: "model-1", propertyTag: "CIT-ARD-001", status: "available" },
      { id: "pi-2", modelId: "model-1", propertyTag: "CIT-ARD-002", status: "borrowed" },
    ],
  },
  {
    id: "model-2",
    name: "Raspberry Pi 4 (4GB)",
    category: "Computing",
    description: "Single-board computer with quad-core CPU.",
    image: "/placeholder-equipment.jpg",
    physicalItems: [
      { id: "pi-3", modelId: "model-2", propertyTag: "CIT-RPI-014", status: "reserved" },
      { id: "pi-4", modelId: "model-2", propertyTag: "CIT-RPI-021", status: "available" },
      { id: "pi-5", modelId: "model-2", propertyTag: "CIT-RPI-023", status: "maintenance" },
    ],
  },
  {
    id: "model-3",
    name: "Ubiquiti UniFi AP AC Lite",
    category: "Networking",
    description: "Dual-band access point for lab network setups.",
    image: "/placeholder-equipment.jpg",
    physicalItems: [
      { id: "pi-6", modelId: "model-3", propertyTag: "CIT-UAP-004", status: "available" },
    ],
  },
  {
    id: "model-4",
    name: "HC-SR04 Ultrasonic Sensor",
    category: "Sensors & Modules",
    description: "Distance measurement sensor module.",
    image: "/placeholder-equipment.jpg",
    physicalItems: [
      { id: "pi-7", modelId: "model-4", propertyTag: "CIT-SEN-111", status: "available" },
      { id: "pi-8", modelId: "model-4", propertyTag: "CIT-SEN-118", status: "lost" },
    ],
  },
]

const categoryIcons = {
  Microcontrollers: <Cpu className="h-4 w-4" />,
  Networking: <Wifi className="h-4 w-4" />,
  "Sensors & Modules": <Thermometer className="h-4 w-4" />,
  Computing: <ServerCog className="h-4 w-4" />,
  Peripherals: <Monitor className="h-4 w-4" />,
  "Cables & Adapters": <Cable className="h-4 w-4" />,
}

const statusDots = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  borrowed: "bg-primary",
  maintenance: "bg-muted-foreground",
  lost: "bg-destructive",
}

export default function AdminInventory() {
  const [models, setModels] = useState(mockEquipmentModels)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
  const [expandedIds, setExpandedIds] = useState(new Set())

  const [addModelOpen, setAddModelOpen] = useState(false)
  const [newModelName, setNewModelName] = useState("")
  const [newModelCategory, setNewModelCategory] = useState("")
  const [newModelDescription, setNewModelDescription] = useState("")

  const [addItemModelId, setAddItemModelId] = useState(null)
  const [newItemTag, setNewItemTag] = useState("")

  const [statusChangeTarget, setStatusChangeTarget] = useState(null)

  const filtered = useMemo(() => {
    return models.filter((model) => {
      const matchSearch = model.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory =
        filterCategory === "All Categories" || model.category === filterCategory
      return matchSearch && matchCategory
    })
  }, [models, search, filterCategory])

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleAddModel = () => {
    if (!newModelName || !newModelCategory) return
    const newModel = {
      id: `model-${Date.now()}`,
      name: newModelName,
      category: newModelCategory,
      description: newModelDescription,
      image: "/placeholder-equipment.jpg",
      physicalItems: [],
    }
    setModels([...models, newModel])
    setAddModelOpen(false)
    setNewModelName("")
    setNewModelCategory("")
    setNewModelDescription("")
  }

  const handleAddPhysicalItem = () => {
    if (!addItemModelId || !newItemTag) return
    const newItem = {
      id: `pi-${Date.now()}`,
      modelId: addItemModelId,
      propertyTag: newItemTag,
      status: "available",
    }
    setModels((prev) =>
      prev.map((m) =>
        m.id === addItemModelId
          ? { ...m, physicalItems: [...m.physicalItems, newItem] }
          : m
      )
    )
    setAddItemModelId(null)
    setNewItemTag("")
  }

  const handleStatusChange = (newStatus) => {
    if (!statusChangeTarget) return
    setModels((prev) =>
      prev.map((m) =>
        m.id === statusChangeTarget.modelId
          ? {
              ...m,
              physicalItems: m.physicalItems.map((pi) =>
                pi.id === statusChangeTarget.item.id
                  ? { ...pi, status: newStatus }
                  : pi
              ),
            }
          : m
      )
    )
    setStatusChangeTarget(null)
  }

  const totalModels = filtered.length
  const totalItems = filtered.reduce((sum, m) => sum + m.physicalItems.length, 0)
  const totalAvailable = filtered.reduce(
    (sum, m) => sum + m.physicalItems.filter((i) => i.status === "available").length,
    0
  )

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Equipment Models</p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">{totalModels}</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Total Physical Items</p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">{totalItems}</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Available Now</p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-600">
              {totalAvailable}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setAddModelOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Equipment Model
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-muted-foreground">
                <th className="w-10 px-3 py-3 text-left" />
                <th className="w-12 px-2 py-3 text-left" />
                <th className="px-3 py-3 text-left">Model Name</th>
                <th className="hidden px-3 py-3 text-left md:table-cell">Category</th>
                <th className="px-3 py-3 text-center">Total</th>
                <th className="px-3 py-3 text-center">Available</th>
              </tr>
            </thead>
            <tbody> 
              {filtered.map((model) => {
                const isExpanded = expandedIds.has(model.id)
                const availCount = model.physicalItems.filter((i) => i.status === "available").length
                const totalCount = model.physicalItems.length

                return (
                  <Fragment key={model.id}>
                    <tr
                      className="cursor-pointer transition-colors hover:bg-accent/40"
                      onClick={() => toggleExpand(model.id)}
                    >
                      <td className="w-10 px-3 py-5">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="w-12 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                          {categoryIcons[model.category] || <Cpu className="h-4 w-4" />}
                        </div>
                      </td>
                      <td className="px-3">
                        <div className="font-medium text-foreground">{model.name}</div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {model.description}
                        </p>
                      </td>
                      <td className="hidden px-3 md:table-cell">
                        <span className="text-xs text-muted-foreground">{model.category}</span>
                      </td>
                      <td className="px-3 text-center font-medium text-foreground">
                        {totalCount}
                      </td>
                      <td className="px-3 text-center font-medium text-foreground">
                        {availCount}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={6} className="p-0">
                          <div className="px-8 py-5">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground">
                                    Physical Items
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {model.physicalItems.length} registered unit(s)
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setAddItemModelId(model.id)
                                  }}
                                >
                                  <Plus className="mr-2 h-3.5 w-3.5" />
                                  Add Physical Item
                                </Button>
                              </div>

                              <div className="rounded-md border border-border bg-card">
                                <table className="w-full text-xs">
                                  <thead className="border-b border-border text-muted-foreground">
                                    <tr>
                                      <th className="px-3 py-2 text-left">Property Tag</th>
                                      <th className="px-3 py-2 text-left">Status</th>
                                      <th className="px-3 py-2 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {model.physicalItems.map((item) => (
                                      <tr key={item.id} className="border-t border-border/60">
                                        <td className="px-3 py-2 font-mono text-foreground">
                                          {item.propertyTag}
                                        </td>
                                        <td className="px-3 py-2">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`h-2.5 w-2.5 rounded-full ${statusDots[item.status]}`}
                                            />
                                            <StatusBadge status={item.status} />
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setStatusChangeTarget({ modelId: model.id, item })
                                            }}
                                          >
                                            Change Status
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No equipment models found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Add New Equipment Model</h2>
              <p className="text-sm text-muted-foreground">
                Register a new equipment model to the catalog.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <Label className="mb-2 block text-foreground">Model Image</Label>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/30 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-accent/50">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Drag and drop an image here</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or click to browse. PNG, JPG up to 5MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" type="button">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="model-name" className="text-foreground">Model Name</Label>
                <Input
                  id="model-name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g., Asus Zephyrus G14"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="model-category" className="text-foreground">Category</Label>
                <Select value={newModelCategory} onValueChange={setNewModelCategory}>
                  <SelectTrigger id="model-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All Categories")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="model-desc" className="text-foreground">Description / Specs</Label>
                <textarea
                  id="model-desc"
                  value={newModelDescription}
                  onChange={(e) => setNewModelDescription(e.target.value)}
                  placeholder="Enter a brief description, specifications, and notes about this equipment model..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setAddModelOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModel} disabled={!newModelName || !newModelCategory}>
                Save Model
              </Button>
            </div>
          </div>
        </div>
      )}

      {!!addItemModelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Add Physical Barcode</h2>
              <p className="text-sm text-muted-foreground">
                Register a new physical unit for{" "}
                <span className="font-semibold text-foreground">
                  {models.find((m) => m.id === addItemModelId)?.name}
                </span>
                . Enter its unique property tag.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="barcode-tag" className="text-foreground">Property Tag</Label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="barcode-tag"
                    value={newItemTag}
                    onChange={(e) => setNewItemTag(e.target.value.toUpperCase())}
                    placeholder="e.g., CIT-LAP-001"
                    className="pl-9 font-mono uppercase"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This tag must be unique and match the physical barcode sticker.
                </p>
              </div>
              <div className="rounded-md bg-secondary/70 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  Default status: <StatusBadge status="available" className="ml-1" />
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setAddItemModelId(null)
                  setNewItemTag("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPhysicalItem} disabled={!newItemTag}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {!!statusChangeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Change Status</h2>
              <p className="text-sm text-muted-foreground">
                Update the status of{" "}
                <span className="font-mono font-semibold text-foreground">
                  {statusChangeTarget?.item.propertyTag}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                "available",
                "borrowed",
                "reserved",
                "maintenance",
                "lost",
              ].map((status) => {
                const isActive = statusChangeTarget?.item.status === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={
                      "flex items-center gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors " +
                      (isActive
                        ? "border-primary bg-primary/5 font-medium text-foreground"
                        : "border-border bg-card text-foreground hover:bg-accent/50")
                    }
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`} />
                    <span className="capitalize">{status}</span>
                    {isActive && (
                      <span className="ml-auto text-xs text-primary">Current</span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" type="button" onClick={() => setStatusChangeTarget(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
