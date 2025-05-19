import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserRound, CalendarDays, MapPin, Phone, Mail, ImagePlus, Save, Shield, Sun, Moon, Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify"
import { useSpring, animated } from "@react-spring/web";

import { Alert, AlertDescription } from "@/components/ui/alert"

import NavSidebar from "../../components/ui/HomeNavbarandSidebar"
import ChangePassword from "./change-password"

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    dob: "",
    addressLine: "",
    city: "",
    state: "",
    mobileNo: "",
    email: "",
    profilePhoto: "",
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState("light")
  const [dataSaved, setDataSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const fileInputRef = useRef(null)

  // Animation configurations
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const slideIn = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  const saveButtonProps = useSpring({
    scale: isLoading ? 0.95 : 1,
    config: { tension: 300, friction: 10 }
  })

  const profilePicAnimation = useSpring({
    to: { scale: profileImage || profile.profilePhoto ? 1 : 0.95 },
    from: { scale: 0.9 },
    config: { tension: 200, friction: 12 }
  })

  const tabAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const userDataString = localStorage.getItem("user")
        let userID
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          userID = userData._id
          if (userData.name && userData.email) {
            setProfile((prev) => ({
              ...prev,
              name: userData.name,
              email: userData.email,
            }))
          }
        }

        if (userID) {
          const res = await axios.post("http://localhost:3002/api/profile/getProfileData", {
            userID,
          }, {withCredentials: true})

          if (res.data && res.data.success) {
            const profileData = res.data.profile
            if (profileData) {
              setProfile((prev) => ({
                ...prev,
                gender: profileData.gender || "",
                dob: profileData.dob || "",
                addressLine: profileData.addressLine || "",
                city: profileData.city || "",
                state: profileData.state || "",
                mobileNo: profileData.mobileNo || "",
                profilePhoto: profileData.profilePhoto || "",
              }))
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        toast.error("Could not load your profile information.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value) => {
    setProfile((prev) => ({ ...prev, gender: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please select an image under 5MB.")
        return
      }

      setSelectedFile(file)
      setFileName(file.name)
      setProfileImage(URL.createObjectURL(file))
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const dataToSend = new FormData()
      const userDataString = localStorage.getItem("user")
      let userID
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        if (userData._id) {
          userID = userData._id
          dataToSend.append("userID", userID)
        }
      }

      if (!userID) {
        toast.error("User information not found. Please log in again.")
        return
      }

      dataToSend.append("gender", profile.gender || "")
      dataToSend.append("dob", profile.dob || "")
      dataToSend.append("addressLine", profile.addressLine || "")
      dataToSend.append("city", profile.city || "")
      dataToSend.append("state", profile.state || "")
      dataToSend.append("mobileNo", profile.mobileNo || "")
      if (selectedFile) {
        dataToSend.append("file", selectedFile)
      }

      const response = await axios.post("http://localhost:3002/api/profile/updateProfile", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })

      if (response.data && response.data.success) {
        setDataSaved(true)
        toast.success("Profile updated successfully!")
        
        // Reset the success message after 3 seconds
        setTimeout(() => {
          setDataSaved(false)
        }, 3000)
      } else {
        toast.error(response.data?.message || "Failed to update profile.")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("There was a problem updating your profile.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
    // In a real implementation, you would apply dark mode to the entire app
    // This is just for demonstration purposes
    document.body.classList.toggle("dark-theme")
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "U"
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Background pattern style for aesthetic enhancement
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50"}`} style={patternStyle}>
      <NavSidebar />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container py-10 px-4 md:px-6 max-w-5xl mx-auto mt-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <motion.h1 
            className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            variants={slideIn}
          >
            Account Settings
          </motion.h1>
          
          <motion.div 
            variants={slideIn}
            className="flex items-center mt-4 md:mt-0 space-x-2"
          >
            <Sun className="h-4 w-4" />
            <Switch 
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-indigo-600"
            />
            <Moon className="h-4 w-4" />
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <motion.div variants={slideIn}>
            <TabsList className="mb-6 p-1 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl w-full md:w-auto">
              <TabsTrigger 
                value="profile" 
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${activeTab === "profile" ? "bg-indigo-600 text-white shadow-lg" : ""}`}
              >
                <UserRound className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${activeTab === "security" ? "bg-indigo-600 text-white shadow-lg" : ""}`}
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabAnimation}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="profile">
                <Card className={`w-full shadow-lg border-0 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-md"} rounded-xl overflow-hidden`}>
                  <CardHeader className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"} py-6`}>
                    <CardTitle className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>My Profile</CardTitle>
                    <CardDescription className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-slate-500"}`}>
                      Manage your personal information and contact details
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Profile Picture Section */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-gray-700">
                        <div className="relative">
                          <animated.div style={profilePicAnimation}>
                            <Avatar className="h-28 w-28 border-4 border-white dark:border-gray-700 shadow-xl ring-2 ring-indigo-100 dark:ring-indigo-900">
                              {profileImage || profile.profilePhoto ? (
                                <AvatarImage 
                                  src={profileImage || profile.profilePhoto} 
                                  alt={profile.name} 
                                  className="object-cover"
                                />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                                  {getInitials(profile.name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </animated.div>
                          <Button
                            type="button"
                            size="icon"
                            className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-white dark:border-gray-800"
                            onClick={handleBrowseClick}
                          >
                            <ImagePlus className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <h3 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{profile.name || "Your Name"}</h3>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-slate-600"}`}>{profile.email || "your.email@example.com"}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              type="button"
                              onClick={handleBrowseClick}
                              variant="outline"
                              size="sm"
                              className={`text-xs ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white"} transition-all duration-300 hover:shadow-md`}
                            >
                              Change Photo
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                          {fileName && (
                            <motion.p 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-slate-500"} mt-1 flex items-center`}
                            >
                              <Check className="h-3 w-3 mr-1 text-green-500" /> Selected: {fileName}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Personal Info Section */}
                      <div className="space-y-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                          <h3 className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"} flex items-center`}>
                            <UserRound className="h-5 w-5 mr-2 text-indigo-500" />
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <UserRound className="h-4 w-4 text-indigo-400" />
                                Full Name
                              </Label>
                              <Input 
                                id="name" 
                                name="name" 
                                value={profile.name || ""} 
                                onChange={handleChange} 
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`} 
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dob" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <CalendarDays className="h-4 w-4 text-indigo-400" />
                                Date of Birth
                              </Label>
                              <Input
                                id="dob"
                                type="date"
                                name="dob"
                                value={profile.dob || ""}
                                onChange={handleChange}
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`}
                              />
                            </div>

                            <div className="space-y-3 md:col-span-2">
                              <Label className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <UserRound className="h-4 w-4 text-indigo-400" />
                                Gender
                              </Label>
                              <RadioGroup 
                                value={profile.gender || ""} 
                                onValueChange={handleGenderChange} 
                                className="flex flex-wrap gap-4"
                              >
                                {["Male", "Female", "Other"].map((gender) => (
                                  <div 
                                    key={gender} 
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border ${profile.gender === gender 
                                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm" 
                                      : "border-gray-200 dark:border-gray-700"} transition-all duration-200 cursor-pointer`}
                                    onClick={() => handleGenderChange(gender)}
                                  >
                                    <RadioGroupItem value={gender} id={`gender-${gender}`} className="text-indigo-600" />
                                    <Label htmlFor={`gender-${gender}`} className={`text-sm cursor-pointer ${profile.gender === gender ? "font-medium" : ""}`}>
                                      {gender}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        </motion.div>

                        <Separator className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"} />

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                          <h3 className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"} flex items-center`}>
                            <Phone className="h-5 w-5 mr-2 text-indigo-500" />
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="email" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <Mail className="h-4 w-4 text-indigo-400" />
                                Email Address
                              </Label>
                              <Input 
                                id="email" 
                                name="email" 
                                value={profile.email || ""} 
                                readOnly 
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-500"}`} 
                              />
                              <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>Your email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mobileNo" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <Phone className="h-4 w-4 text-indigo-400" />
                                Mobile Number
                              </Label>
                              <Input
                                id="mobileNo"
                                type="tel"
                                name="mobileNo"
                                value={profile.mobileNo || ""}
                                onChange={handleChange}
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`}
                                placeholder="Enter your mobile number"
                              />
                            </div>
                          </div>
                        </motion.div>

                        <Separator className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"} />

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                          <h3 className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"} flex items-center`}>
                            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                            Address
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="addressLine" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                Street Address
                              </Label>
                              <Input
                                id="addressLine"
                                name="addressLine"
                                value={profile.addressLine || ""}
                                onChange={handleChange}
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`}
                                placeholder="Enter your street address"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="city" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                City
                              </Label>
                              <Input
                                id="city"
                                name="city"
                                value={profile.city || ""}
                                onChange={handleChange}
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`}
                                placeholder="Enter your city"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="state" className={`text-sm font-medium flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                State
                              </Label>
                              <Input
                                id="state"
                                name="state"
                                value={profile.state || ""}
                                onChange={handleChange}
                                className={`h-11 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500" : "bg-white focus:border-indigo-500"} focus:ring-2 focus:ring-indigo-200 transition-all`}
                                placeholder="Enter your state"
                              />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </form>
                  </CardContent>

                  <CardFooter className={`flex justify-between py-6 ${theme === "dark" ? "bg-gray-700/50" : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"} border-t border-slate-200 dark:border-gray-700`}>
                    <AnimatePresence>
                      {dataSaved && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-100 border-green-200 dark:border-green-800 py-2 px-3 rounded-md">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <AlertDescription>
                              Profile saved successfully!
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="ml-auto flex gap-4">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => window.location.reload()}
                        className={`${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" : "bg-white"} transition-all`}
                      >
                        Cancel
                      </Button>
                      <animated.div style={saveButtonProps}>
                        <Button 
                          type="submit" 
                          onClick={handleSubmit} 
                          disabled={isLoading} 
                          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </animated.div>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className={`w-full shadow-lg border-0 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-md"} rounded-xl overflow-hidden`}>
                  <CardHeader className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"} py-6`}>
                    <CardTitle className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Security Settings</CardTitle>
                    <CardDescription className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-slate-500"}`}>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <ChangePassword theme={theme} />
                  
                  </CardContent>
                  <CardFooter className={`flex justify-between py-6 ${theme === "dark" ? "bg-gray-700/50" : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"} border-t border-slate-200 dark:border-gray-700`}>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                      Last security check: {new Date().toLocaleDateString()}
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default Profile