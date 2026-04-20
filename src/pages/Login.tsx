import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Shield
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  // Forgot Password States
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotOtp, setForgotOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isForgotLoading, setIsForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  const navigate = useNavigate()
  const { toast } = useToast()

  // Remember Me: Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password });

      // Store the token
      if (response.data.success && response.data.data) {
        localStorage.setItem('auth_token', response.data.data.access_token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('remembered_email', email);
        } else {
          localStorage.removeItem('remembered_email');
        }
        
        console.log("Authentication successful, token stored.");
      }

      toast({
        title: "Login successful",
        description: "Welcome back to the Dashboard",
        variant: "success",
      })
      navigate("/")
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Invalid email or password")
    } finally {
      setIsLoading(false);
    }
  }


  const handleSendOTP = async () => {
    if (!forgotEmail) {
      setForgotError("Email is required")
      return
    }
    setForgotError("")
    setIsForgotLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail })
      if (response.data.success) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code",
        })
        setForgotStep(2)
        setResendTimer(60)
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (forgotOtp.length < 4) {
      setForgotError("Please enter the 4-digit code")
      return
    }
    setForgotError("")
    setIsForgotLoading(true)
    try {
      const response = await api.post('/auth/verify-otp', {
        email: forgotEmail,
        otp: forgotOtp
      })
      if (response.data.success) {
        setForgotStep(3)
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Invalid OTP")
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match")
      return
    }
    setForgotError("")
    setIsForgotLoading(true)
    try {
      const response = await api.post('/auth/reset-password', {
        email: forgotEmail,
        otp: forgotOtp,
        password: newPassword,
        password_confirmation: confirmPassword
      })
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password reset successfully. You can now login.",
          variant: "success"
        })
        setIsForgotOpen(false)
        setForgotStep(1)
        setForgotEmail("")
        setForgotOtp("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Reset failed")
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    setIsForgotLoading(true)
    try {
      const response = await api.post('/auth/resend-otp', { email: forgotEmail })
      if (response.data.success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email",
        })
        setResendTimer(60)
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Failed to resend OTP")
    } finally {
      setIsForgotLoading(false)
    }
  }

  const openForgotDialog = () => {
    if (email) setForgotEmail(email)
    setIsForgotOpen(true)
    setForgotStep(1)
    setForgotError("")
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md relative bg-background/80 backdrop-blur-xl border-primary/20 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-28 w-28 flex items-center justify-center bg-slate-900 rounded-2xl p-4 shadow-2xl border border-white/10 ring-4 ring-primary/10">
                <img src={logo} alt="ADADA RE" className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your ADADA Real Estate Dashboard account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-slide-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ecomart.com"
                    className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-xs h-auto p-0 text-primary"
                        onClick={openForgotDialog}
                      >
                        Forgot password?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-background/95 backdrop-blur-xl">
                      Password reset link will be sent to your email
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secure login</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>

        </Card>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ADADA RE Dashboard. All rights reserved.
          </p>
        </div>

        {/* Forgot Password Dialog */}
        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {forgotStep === 1 && "Reset Password"}
                {forgotStep === 2 && "Verification Required"}
                {forgotStep === 3 && "Set New Password"}
              </DialogTitle>
              <DialogDescription>
                {forgotStep === 1 && "Enter your email to receive a verification code."}
                {forgotStep === 2 && `We've sent a 4-digit code to ${forgotEmail}.`}
                {forgotStep === 3 && "Please choose a strong password for your account."}
              </DialogDescription>
            </DialogHeader>

            {forgotError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{forgotError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              {forgotStep === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      placeholder="admin@ecomart.com"
                      className="pl-10"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={isForgotLoading}
                    />
                  </div>
                </div>
              )}

              {forgotStep === 2 && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <InputOTP
                    maxLength={4}
                    value={forgotOtp}
                    onChange={setForgotOtp}
                    disabled={isForgotLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-xs p-0 h-auto h-5"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isForgotLoading}
                    >
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive code? Resend"}
                    </Button>
                  </div>
                </div>
              )}

              {forgotStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isForgotLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isForgotLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsForgotOpen(false)}
                disabled={isForgotLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  forgotStep === 1 ? handleSendOTP :
                    forgotStep === 2 ? handleVerifyOTP :
                      handleResetPassword
                }
                disabled={isForgotLoading}
                className="min-w-[120px]"
              >
                {isForgotLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  forgotStep === 1 ? "Send Code" :
                    forgotStep === 2 ? "Verify Code" :
                      "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
