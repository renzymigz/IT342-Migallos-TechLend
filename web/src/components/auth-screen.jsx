import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Cpu, Eye, EyeOff, LogIn, UserPlus, Shield } from "lucide-react"

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function AuthScreen({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Card className="relative z-10 w-full max-w-md border-border shadow-lg">
        {/* Header */}
        <CardHeader className="items-center text-center pb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            TechLend
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Access the IT Laboratory Inventory
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>

            {/* ─── Sign In Tab ─── */}
            <TabsContent value="login" className="mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onLogin("student")
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email" className="text-foreground">
                    Email or School ID
                  </Label>
                  <Input
                    id="login-email"
                    placeholder="20-1234-567 or student@cit.edu"
                    defaultValue="juan.delacruz@cit.edu"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 hover:underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      defaultValue="password123"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-1">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>

                {/* Divider */}
                <div className="relative my-1">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                {/* Google OAuth */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onLogin("student")}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
              </form>
            </TabsContent>

            {/* ─── Register Tab ─── */}
            <TabsContent value="register" className="mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onLogin("student")
                }}
                className="flex flex-col gap-4"
              >
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-first-name" className="text-foreground">
                      First Name
                    </Label>
                    <Input id="reg-first-name" placeholder="Juan" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-last-name" className="text-foreground">
                      Last Name
                    </Label>
                    <Input id="reg-last-name" placeholder="Dela Cruz" />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="student@cit.edu"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Optional Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-school-id" className="text-foreground">
                      School ID{" "}
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input id="reg-school-id" placeholder="e.g., 20-1234-567" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-contact" className="text-foreground">
                      Contact No.{" "}
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input id="reg-contact" placeholder="e.g., 09171234567" />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-1">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Button>

                {/* Divider */}
                <div className="relative my-1">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                {/* Google OAuth */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onLogin("student")}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          
        </CardContent>
      </Card>
    </div>
  )
}
