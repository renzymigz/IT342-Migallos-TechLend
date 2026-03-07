import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, IdCard } from "lucide-react"

// Mock user data — will be replaced with real API data later
const mockUser = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  email: "juan.delacruz@cit.edu",
  schoolId: "20-1234-567",
  phone: "09171234567",
  role: "Student",
}

export default function Profile() {
  const user = mockUser

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

        <Card>
          <CardContent className="p-6">
            {/* Avatar + Name Header */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Profile Fields */}
            <div className="flex flex-col gap-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input readOnly value={user.firstName} className="pl-9 bg-muted/50" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input readOnly value={user.lastName} className="pl-9 bg-muted/50" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input readOnly value={user.email} className="pl-9 bg-muted/50" />
                </div>
              </div>

              {/* School ID */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  School ID
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input readOnly value={user.schoolId} className="pl-9 bg-muted/50" />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input readOnly value={user.phone} className="pl-9 bg-muted/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
