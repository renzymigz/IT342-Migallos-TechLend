import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleIcon } from "@/components/google-icon"
import { Cpu, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    schoolId: "",
    contactNumber: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await register(formData)
      navigate("/login")
    } catch (err) {
      const apiError = err.response?.data?.error
      const msg = apiError?.message || "Registration failed. Please try again."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side — Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TechLend</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create your account</h2>
            <p className="text-muted-foreground">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-first-name">First Name</Label>
                <Input id="reg-first-name" name="firstName" placeholder="Juan" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-last-name">Last Name</Label>
                <Input id="reg-last-name" name="lastName" placeholder="Dela Cruz" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email Address</Label>
              <Input id="reg-email" name="email" type="email" placeholder="student@cit.edu" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password (min 8 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-school-id">
                  School ID <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input id="reg-school-id" name="schoolId" placeholder="e.g., 20-1234-567" value={formData.schoolId} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-contact">
                  Contact No. <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input id="reg-contact" name="contactNumber" placeholder="e.g., 09171234567" value={formData.contactNumber} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" className="w-full mt-1" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative my-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                Or continue with
              </span>
            </div>

            <Button type="button" variant="outline" className="w-full" disabled>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-2">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 mb-6">
            <Cpu className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-3">TechLend</h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Join the CIT-U IT Laboratory Equipment Lending System. Get access to microcontrollers, sensors, networking gear, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
