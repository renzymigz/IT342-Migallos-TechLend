import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cpu, User, LogOut, ShoppingCart, History } from "lucide-react"

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartCount, openCart } = useCart()
  const isStudentNav = location.pathname === "/dashboard" || location.pathname === "/my-loans"
  const activeStudentTab = location.pathname === "/my-loans" ? "history" : "catalog"

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
    : ""

  const goToStudentTab = (tab) => {
    navigate(tab === "catalog" ? "/dashboard" : "/my-loans")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">TechLend</span>
        </Link>

        {isStudentNav && (
          <nav className="flex min-w-0 flex-1 items-center justify-center gap-1">
            <Button
              type="button"
              size="sm"
              variant={activeStudentTab === "catalog" ? "secondary" : "ghost"}
              className="text-xs sm:text-sm"
              onClick={() => goToStudentTab("catalog")}
            >
              <Cpu className="mr-1.5 h-3.5 w-3.5" />
              Catalog
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeStudentTab === "history" ? "secondary" : "ghost"}
              className="text-xs sm:text-sm"
              onClick={() => goToStudentTab("history")}
            >
              <History className="mr-1.5 h-3.5 w-3.5" />
              My Loans
            </Button>
          </nav>
        )}

        <div className={`flex items-center gap-2 ${isStudentNav ? "" : "ml-auto"}`}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative"
            aria-label="Open cart"
            onClick={openCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Authenticated user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
