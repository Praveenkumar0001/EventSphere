import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "react-toastify"

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)

  const userDataString = localStorage.getItem("user")
  let userID

  if (userDataString) {
    const userData = JSON.parse(userDataString)
    userID = userData._id
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }))
    }

    if (passwordChangeSuccess) {
      setPasswordChangeSuccess(false)
    }
  }

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
      isValid = false
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    try {
      setIsChangingPassword(true)

      if (!userID) {
        toast.error("User ID not found. Please log in again.")
        return
      }

      console.log(userID, passwordData, 'userID');

      await axios.post("http://localhost:3002/api/auth/change-password", {
        userID,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setPasswordChangeSuccess(true)
      toast.success("Password changed successfully")
    } catch (error) {
      console.error("Error changing password:", error)

      if (error.response && error.response.status === 401) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: "Current password is incorrect",
        })
      } else {
        toast.error("Failed to change password. Please try again.")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <>
      {passwordChangeSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Your password has been changed successfully.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Change Password
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`h-10 pr-10 ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`h-10 pr-10 ${passwordErrors.newPassword ? "border-red-500" : ""}`}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {passwordErrors.newPassword ? (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`h-10 pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
                placeholder="Confirm your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isChangingPassword} className="gap-2">
            {isChangingPassword ? (
              "Changing Password..."
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

export default ChangePassword
