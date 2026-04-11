import { useState, useMemo } from "react"
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
import { StatusBadge } from "@/components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockEquipment, categories, mockTransactions } from "@/lib/mock-data"
import {
  Search,
  ShoppingCart,
  Cpu,
  ChevronDown,
  History,
  Package,
  Clock,
  CheckCircle2,
} from "lucide-react"

export default function Dashboard() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [cart, setCart] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [activeTab, setActiveTab] = useState("catalog")

  const filtered = useMemo(() => {
    return mockEquipment.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.propertyTag.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "All Categories" || item.category === category
      return matchSearch && matchCategory
    })
  }, [search, category])

  const addToCart = (equipment) => {
    if (!cart.some((i) => i.id === equipment.id)) {
      setCart([...cart, equipment])
    }
  }

  const myTransactions = mockTransactions.filter((t) => t.borrowerId === "u1")

  return (
    <div className="pt-16">
      {/* Sub-navigation for Dashboard */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <nav className="flex items-center gap-1">
            <Button
              variant={activeTab === "catalog" ? "secondary" : "ghost"}
              size="sm"
              className="text-sm"
              onClick={() => {
                setActiveTab("catalog")
                setSelectedEquipment(null)
              }}
            >
              <Cpu className="mr-1.5 h-3.5 w-3.5" />
              Catalog
            </Button>
            <Button
              variant={activeTab === "history" ? "secondary" : "ghost"}
              size="sm"
              className="text-sm"
              onClick={() => {
                setActiveTab("history")
                setSelectedEquipment(null)
              }}
            >
              <History className="mr-1.5 h-3.5 w-3.5" />
              My Loans
            </Button>
          </nav>

          <Button variant="outline" size="icon" className="relative" aria-label="Open cart">
            <ShoppingCart className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {selectedEquipment ? (
          /* --- Equipment Detail View --- */
          <div className="mx-auto max-w-3xl px-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setSelectedEquipment(null)}
            >
              &larr; Back to catalog
            </Button>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedEquipment.name}</CardTitle>
                    <p className="font-mono text-sm text-muted-foreground mt-1">
                      {selectedEquipment.propertyTag}
                    </p>
                  </div>
                  <StatusBadge status={selectedEquipment.status} />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{selectedEquipment.description}</p>
                {selectedEquipment.specs && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Specifications</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {selectedEquipment.specs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button
                  className="w-full sm:w-auto"
                  disabled={selectedEquipment.status !== "available" || cart.some((i) => i.id === selectedEquipment.id)}
                  onClick={() => addToCart(selectedEquipment)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {(() => {
                    if (cart.some((i) => i.id === selectedEquipment.id)) return "In Cart"
                    if (selectedEquipment.status === "available") return "Add to Cart"
                    return "Unavailable"
                  })()}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* --- Tabs: Catalog & History --- */
          <div className="mx-auto max-w-7xl px-4 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Mobile tabs */}
              <TabsList className="sm:hidden">
                <TabsTrigger value="catalog">
                  <Cpu className="mr-1.5 h-3.5 w-3.5" />
                  Catalog
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-1.5 h-3.5 w-3.5" />
                  My Loans
                </TabsTrigger>
              </TabsList>

              {/* --- Catalog Tab --- */}
              <TabsContent value="catalog" className="mt-6">
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
                        {categories.map((cat) => (
                          <DropdownMenuRadioItem key={cat} value={cat}>
                            {cat}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((equipment) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      onAddToCart={addToCart}
                      inCart={cart.some((i) => i.id === equipment.id)}
                      onViewDetail={setSelectedEquipment}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">No equipment found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* --- History Tab --- */}
              <TabsContent value="history" className="mt-6">
                <div className="flex flex-col gap-4">
                  {myTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No loan history yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your borrowing history will appear here
                      </p>
                    </div>
                  ) : (
                    myTransactions.map((tx) => (
                      <Card key={tx.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {tx.status === "active" && <Clock className="h-4 w-4 text-primary" />}
                              {tx.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                              {tx.status === "pending" && <Clock className="h-4 w-4 text-amber-500" />}
                              <span className="text-sm font-semibold">{tx.id}</span>
                            </div>
                            <StatusBadge status={tx.status} />
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {tx.date} &mdash; Due: {tx.dueDate}
                          </div>
                          <div className="flex flex-col gap-1">
                            {tx.items.map((item) => (
                              <div
                                key={item.equipmentId}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>{item.equipmentName}</span>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {item.propertyTag}
                                </span>
                              </div>
                            ))}
                          </div>
                          {tx.borrowerNote && (
                            <p className="mt-2 text-xs text-muted-foreground italic">
                              &quot;{tx.borrowerNote}&quot;
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}
