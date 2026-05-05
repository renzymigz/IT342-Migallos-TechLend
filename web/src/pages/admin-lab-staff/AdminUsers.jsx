/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { userAPI } from "@/api/user"
import {
  MoreHorizontal,
  Shield,
  Search,
  Ban,
  CheckCircle2,
  Users,
  UserX,
  Loader2,
} from "lucide-react"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [suspendReason, setSuspendReason] = useState("")
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: "",
    action: "suspend",
    newRole: null,
    userName: "",
    processing: false,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userAPI.getAllUsers()
      setUsers(data || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.schoolId?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const activeCount = users.filter((u) => u.status === "ACTIVE").length
  const suspendedCount = users.filter((u) => u.status === "SUSPENDED").length

  const handleConfirm = async () => {
    const { userId, action, newRole } = confirmDialog
    setConfirmDialog((prev) => ({ ...prev, processing: true }))

    try {
      if (action === "suspend") {
        if (!suspendReason.trim()) {
          alert("Please provide a suspension reason")
          setConfirmDialog((prev) => ({ ...prev, processing: false }))
          return
        }
        await userAPI.suspendUser(userId, suspendReason)
        setSuspendReason("")
      } else if (action === "unsuspend") {
        await userAPI.unsuspendUser(userId)
      } else if (action === "role_change" && newRole) {
        // Map lab_staff to ADMIN for backend
        const roleToSend = newRole === "lab_staff" ? "ADMIN" : newRole.toUpperCase()
        await userAPI.updateUserRole(userId, roleToSend)
      }

      await fetchUsers()
      setConfirmDialog((prev) => ({ ...prev, open: false }))
    } catch (error) {
      console.error("Operation failed:", error)
      alert("Operation failed. Please try again.")
    } finally {
      setConfirmDialog((prev) => ({ ...prev, processing: false }))
    }
  }

  const getRoleLabel = (role) => {
    const map = {
      STUDENT: "Student",
      INSTRUCTOR: "Instructor",
      ADMIN: "Lab Staff",
      admin: "Lab Staff",
      lab_staff: "Lab Staff",
      instructor: "Instructor",
      student: "Student",
    }
    return map[role] || role
  }

  const openSuspendDialog = (user) => {
    setConfirmDialog({
      open: true,
      userId: user.userId,
      action: "suspend",
      userName: user.name,
      processing: false,
    })
    setSuspendReason("")
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{suspendedCount}</p>
              <p className="text-xs text-muted-foreground">Suspended</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">School ID</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading && filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">No users found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try adjusting your search term
                    </p>
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading &&
                filteredUsers.length > 0 &&
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.userId}
                    className={
                      user.status === "SUSPENDED"
                        ? "bg-destructive/5 hover:bg-destructive/8"
                        : ""
                    }
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.schoolId}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.role?.toLowerCase()} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status === "ACTIVE" ? "active" : "suspended"} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions for {user.name}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Change Role
                          </DropdownMenuLabel>
                          {user.role !== "INSTRUCTOR" && (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  userId: user.userId,
                                  action: "role_change",
                                  newRole: "instructor",
                                  userName: user.name,
                                  processing: false,
                                })
                              }
                            >
                              <Shield className="mr-2 h-4 w-4 text-primary" />
                              Upgrade to Instructor
                            </DropdownMenuItem>
                          )}
                          {user.role !== "ADMIN" && (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  userId: user.userId,
                                  action: "role_change",
                                  newRole: "lab_staff",
                                  userName: user.name,
                                  processing: false,
                                })
                              }
                            >
                              <Shield className="mr-2 h-4 w-4 text-primary" />
                              Make Lab Staff
                            </DropdownMenuItem>
                          )}
                          {user.role !== "STUDENT" && (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  userId: user.userId,
                                  action: "role_change",
                                  newRole: "student",
                                  userName: user.name,
                                  processing: false,
                                })
                              }
                            >
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              Downgrade to Student
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {user.status === "ACTIVE" ? (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => openSuspendDialog(user)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-success focus:text-success"
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  userId: user.userId,
                                  action: "unsuspend",
                                  userName: user.name,
                                  processing: false,
                                })
                              }
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Remove Suspension
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Confirmation dialog */}
        <Dialog
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setSuspendReason("")
            }
            setConfirmDialog((prev) => ({ ...prev, open }))
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {confirmDialog.action === "suspend" && "Suspend Account"}
                {confirmDialog.action === "unsuspend" && "Remove Suspension"}
                {confirmDialog.action === "role_change" &&
                  `Change Role to ${getRoleLabel(confirmDialog.newRole)}`}
              </DialogTitle>
              <DialogDescription>
                {confirmDialog.action === "suspend" && (
                  <div>
                    Please provide a reason for suspending{" "}
                    <span className="inline font-semibold text-foreground">
                      {confirmDialog.userName}
                    </span>
                    {". "}
                    This will be visible to the student.
                  </div>
                )}
                {confirmDialog.action === "unsuspend" && (
                  <div>
                    Remove the suspension on{" "}
                    <span className="inline font-semibold text-foreground">
                      {confirmDialog.userName}
                    </span>
                    {" "}
                    They will regain full access to the loan system.
                  </div>
                )}
                {confirmDialog.action === "role_change" && (
                  <div>
                    Change{" "}
                    <span className="inline font-semibold text-foreground">
                      {confirmDialog.userName}
                    </span>
                    {`'s `}
                    role to{" "}
                    <span className="inline font-semibold text-foreground">
                      {getRoleLabel(confirmDialog.newRole)}
                    </span>
                    {" "}
                    This will update their permissions across the system.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            {confirmDialog.action === "suspend" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="suspension-reason"
                    className="text-sm font-medium text-foreground"
                  >
                    Suspension Reason <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="suspension-reason"
                    placeholder="e.g., Argumentative with lab staff and attempted to bypass the checkout system."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="4"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDialog((prev) => ({ ...prev, open: false }))
                  setSuspendReason("")
                }}
                disabled={confirmDialog.processing}
              >
                Cancel
              </Button>
              <Button
                variant={confirmDialog.action === "suspend" ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={confirmDialog.processing}
              >
                {confirmDialog.processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmDialog.action === "suspend" && "Suspend"}
                    {confirmDialog.action === "unsuspend" && "Remove Suspension"}
                    {confirmDialog.action === "role_change" && "Confirm Change"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
