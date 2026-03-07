import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { ShoppingCart, Cpu, Wifi, Thermometer, Monitor, Cable, ServerCog } from "lucide-react"

const categoryIcons = {
  Microcontrollers: <Cpu className="h-8 w-8" />,
  Networking: <Wifi className="h-8 w-8" />,
  "Sensors & Modules": <Thermometer className="h-8 w-8" />,
  Computing: <ServerCog className="h-8 w-8" />,
  Peripherals: <Monitor className="h-8 w-8" />,
  "Cables & Adapters": <Cable className="h-8 w-8" />,
}

export function EquipmentCard({ equipment, onAddToCart, inCart, onViewDetail }) {
  const isAvailable = equipment.status === "available"

  return (
    <Card className="group flex flex-col overflow-hidden border-border transition-shadow hover:shadow-md">
      <button
        type="button"
        className="flex h-36 cursor-pointer items-center justify-center bg-secondary transition-colors hover:bg-secondary/80"
        onClick={() => onViewDetail?.(equipment)}
        aria-label={`View details for ${equipment.name}`}
      >
        <div className="text-muted-foreground/50">
          {categoryIcons[equipment.category] || <Cpu className="h-8 w-8" />}
        </div>
      </button>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              className="truncate text-left text-sm font-semibold text-foreground hover:text-primary hover:underline cursor-pointer"
              onClick={() => onViewDetail?.(equipment)}
            >
              {equipment.name}
            </button>
            <p className="font-mono text-xs text-muted-foreground">{equipment.propertyTag}</p>
          </div>
          <StatusBadge status={equipment.status} />
        </div>
        <p className="text-xs text-muted-foreground">{equipment.category}</p>
        <div className="mt-auto pt-2">
          <Button
            size="sm"
            className="w-full"
            variant={inCart ? "secondary" : "default"}
            disabled={!isAvailable || inCart}
            onClick={() => onAddToCart(equipment)}
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            {inCart ? "In Cart" : (isAvailable ? "Add to Cart" : "Unavailable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
