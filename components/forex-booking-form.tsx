"use client"

import { useState, useEffect } from "react"
import { useStep } from "@/contexts/step-context"
import {
  MapPin,
  Coins,
  Target,
  Plane,
  Banknote,
  User,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Download,
  RefreshCw,
  CalendarIcon,
  Globe,
  FileText,
  Building2,
  GraduationCap,
  Briefcase,
  BadgeCheck,
  IdCard,
  Receipt,
  TrendingUp,
  Lock,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Calendar,
  Send,
  Package,
  Truck,
  AlertCircle,
  BookCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

const locations = [
  { value: "chennai", label: "Chennai, Tamil Nadu", icon: Building2 },
  { value: "bangalore", label: "Bangalore, Karnataka", icon: Building2 },
  { value: "hyderabad", label: "Hyderabad, Telangana", icon: Building2 },
  { value: "mumbai", label: "Mumbai, Maharashtra", icon: Building2 },
  { value: "delhi", label: "Delhi, National Capital", icon: Building2 },
  { value: "kolkata", label: "Kolkata, West Bengal", icon: Building2 },
]

const currencies = [
  { code: "USD", label: "US Dollar (USD)", value: "usd", rate: 83.25 },
  { code: "EUR", label: "Euro (EUR)", value: "eur", rate: 90.15 },
  { code: "GBP", label: "British Pound (GBP)", value: "gbp", rate: 105.5 },
  { code: "AUD", label: "Australian Dollar (AUD)", value: "aud", rate: 55.75 },
  { code: "CAD", label: "Canadian Dollar (CAD)", value: "cad", rate: 61.2 },
  { code: "SGD", label: "Singapore Dollar (SGD)", value: "sgd", rate: 61.8 },
  { code: "JPY", label: "Japanese Yen (JPY)", value: "jpy", rate: 0.56 },
  { code: "CHF", label: "Swiss Franc (CHF)", value: "chf", rate: 92.4 },
]

const serviceTypes = [
  { value: "card", label: "Forex Card", description: "Secure & Convenient", icon: CreditCard, fee: 200 },
  { value: "cash", label: "Cash Currency", description: "Immediate Availability", icon: Banknote, fee: 150 },
]

// Replace the purposes array with only the required purposes and icons
const purposes = [
  { value: "student", label: "Education (Student Travel)", icon: GraduationCap },
  { value: "medical", label: "Medical Treatment", icon: BookCheck },
  { value: "employment", label: "Employment / Job Abroad", icon: Briefcase },
  { value: "emigration", label: "Emigration / Immigration", icon: Globe },
  { value: "business", label: "Business Visit", icon: Building2 },
  { value: "leisure", label: "Leisure / Holiday / Personal Visit", icon: Plane },
]

const gateways = [
  { id: "razorpay", name: "Razorpay", description: "Cards, UPI, Wallets", icon: CreditCard },
  { id: "cashfree", name: "Cashfree", description: "Net Banking, UPI", icon: Wallet },
  { id: "juspay", name: "Juspay", description: "Mobile Payments", icon: Smartphone },
  { id: "pinelabs", name: "Pine Labs", description: "Secure Payments", icon: ShieldCheck },
]

export function ForexBookingForm() {
  const { step, setStep } = useStep()
  const [location, setLocation] = useState("")
  const [currency, setCurrency] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [purpose, setPurpose] = useState("")
  const [amount, setAmount] = useState("")
  // Booking step error state
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({})
  const [paymentOption, setPaymentOption] = useState<"block" | "full">("block")
  const [selectedGateway, setSelectedGateway] = useState("razorpay")
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])

  const [dob, setDob] = useState<Date>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Leisure specific state
  const [destinationCountry, setDestinationCountry] = useState("")

  // Add these new states
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")

  // Animation state for step transitions
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    setAnimate(false)
    const rafId = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(rafId)
  }, [step])

  const progress = Math.round((step / 3) * 100)

  const currentCurrency = currencies.find((c) => c.value === currency)
  const currentService = serviceTypes.find((s) => s.value === serviceType)
  const rate = currentCurrency?.rate || 0
  const fee = currentService?.fee || 0

  const numAmount = Number.parseFloat(amount) || 0
  const baseAmount = numAmount * rate
  const totalAmount = baseAmount + fee

  const blockAmount = totalAmount * 0.02
  const remainingAmount = totalAmount - blockAmount
  const amountToPayNow = paymentOption === "block" ? blockAmount : totalAmount

  const handleUpload = (doc: string) => {
    if (uploadedDocs.includes(doc)) {
      setUploadedDocs(uploadedDocs.filter((d) => d !== doc))
    } else {
      setUploadedDocs([...uploadedDocs, doc])
    }
  }
  const resetForm = () => {
    setStep(0)
    setLocation("")
    setCurrency("")
    setServiceType("")
    setPurpose("")
    setAmount("")
    setPaymentOption("block")
    setSelectedGateway("razorpay")
    setUploadedDocs([])
    setDob(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    setBookingErrors({})
    setPersonalErrors({})
    setFullName("")
    setEmail("")
    setPhone("")
    // Add these
    setBusinessName("")
    setBusinessType("")
  }

  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({})

  const validateBookingStep = () => {
    const errors: Record<string, string> = {}
    if (!location) errors.location = "Please select a location"
    if (!currency) errors.currency = "Please select a currency"
    if (!serviceType) errors.serviceType = "Please select a service type"
    if (!purpose) errors.purpose = "Please select a purpose"
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) errors.amount = "Enter a valid amount"
    setBookingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePersonalStep = () => {
    const errors: Record<string, string> = {}
    // simple checks: placeholder inputs in personal step should be required. We only have inputs without state for name/email/phone.
    // We'll add minimal state for these fields to validate.
    if (!fullName) errors.fullName = "Please enter full name"
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email"
    if (!phone || phone.trim().length < 7) errors.phone = "Enter a valid phone number"
    setPersonalErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add minimal personal info state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // SUCCESS STEP
  if (step === 3) {
    return (
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <div className={animate ? "transition-transform duration-500 ease-out translate-y-0 opacity-100" : "transition-transform duration-500 ease-out -translate-y-2 opacity-0"}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          Order Confirmed Successfully!
        </h2>
        <p className="text-gray-600 text-center mb-8">Your forex booking has been processed</p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl py-4 px-6 mb-8 text-center">
          <div className="text-xs font-semibold text-blue-600 mb-1">Order Reference</div>
          <div className="text-lg font-bold text-blue-700 tracking-wide">ORDER-FX-31BXSBEOIF</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { label: "Location", value: "Bangalore", icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
            {
              label: "Currency & Amount",
              value: `${currentCurrency?.code} ${numAmount} (₹${totalAmount.toLocaleString()})`,
              icon: Coins,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Service Type",
              value: "Cash Currency",
              icon: Target,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Travel Purpose",
              value: purposes.find((p) => p.value === purpose)?.label || "Vacation",
              icon: Plane,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Payment Method",
              value: gateways.find((g) => g.id === selectedGateway)?.name || "Razorpay",
              icon: CreditCard,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Amount Paid",
              value: `₹${amountToPayNow.toLocaleString()}`,
              icon: BadgeCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                <div className={cn("p-2 rounded-lg shrink-0", item.bg)}>
                  <IconComponent className={cn("w-4 h-4", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-500 mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-gray-900 break-words">{item.value}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 font-bold text-sm mb-5 text-gray-900">
            <Package className="w-4 h-4 text-blue-600" />
            What Happens Next?
          </div>
          <div className="space-y-4">
            {[
              { label: "Confirmation Email", text: "Check your inbox for order details", icon: Mail },
              { label: "Verification Call", text: "Our team will contact you within 2 hours", icon: Phone },
              { label: "Delivery/Pickup", text: "Choose your preferred collection method", icon: Truck },
              { label: "Processing Time", text: "2-4 hours for cash, 1-2 days for cards", icon: Clock },
            ].map((step, i) => {
              const IconComponent = step.icon
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="p-1.5 bg-white rounded-lg border border-blue-200 shrink-0">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{step.label}:</span>{" "}
                    <span className="text-gray-600">{step.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Receipt
          </Button>
          <Button
            onClick={() => resetForm()}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Book Another Order
          </Button>
        </div>
        </div>
      </div>
    )
  }

  // PAYMENT STEP
  if (step === 2) {
    return (
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <div className={animate ? "transition-transform duration-500 ease-out translate-y-0 opacity-100" : "transition-transform duration-500 ease-out -translate-y-2 opacity-0"}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Options</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div
            onClick={() => setPaymentOption("block")}
            className={cn(
              "relative border-2 rounded-xl p-6 cursor-pointer transition-all",
              paymentOption === "block"
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Block Current Rate
            </div>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Pay just 2% now to secure today's exchange rate
            </p>
            <div className="space-y-3 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Booking Amount (2%):</span>
                <span className="font-bold text-gray-900">₹{blockAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Remaining to pay later:</span>
                <span className="font-bold text-gray-900">₹{remainingAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
              <ShieldCheck className="w-4 h-4" />
              Rate Protection Guarantee
            </div>
          </div>

          <div
            onClick={() => setPaymentOption("full")}
            className={cn(
              "relative border-2 rounded-xl p-6 cursor-pointer transition-all",
              paymentOption === "full"
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Pay in Full
            </div>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Complete your order with full payment now
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200 h-[76px] flex flex-col justify-center">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-black text-gray-900">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-green-600">
              <TrendingUp className="w-4 h-4" />
              Instant Processing
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <CreditCard className="w-4 h-4 text-gray-600" />
            Select Payment Gateway
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gateways.map((gw) => {
              const IconComponent = gw.icon
              return (
                <div
                  key={gw.id}
                  onClick={() => setSelectedGateway(gw.id)}
                  className={cn(
                    "border-2 rounded-xl p-4 cursor-pointer transition-all text-center",
                    selectedGateway === gw.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">{gw.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium">{gw.description}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-8 text-center">
          <div className="text-sm font-semibold text-blue-600 mb-1">Amount to Pay Now</div>
          <div className="text-3xl font-black text-blue-700">₹{amountToPayNow.toLocaleString()}</div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="h-12 w-12 rounded-xl border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setStep(3)}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm uppercase flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Pay with {gateways.find((g) => g.id === selectedGateway)?.name}
          </Button>
        </div>
        </div>
      </div>
    )
  }

  // PERSONAL INFO STEP
  if (step === 1) {
    return (
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <div className={animate ? "transition-transform duration-500 ease-out translate-y-0 opacity-100" : "transition-transform duration-500 ease-out -translate-y-2 opacity-0"}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-500" />
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={cn(
                "h-11 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4",
                personalErrors.fullName ? "border-red-500" : "border-gray-300 border",
              )}
            />
            {personalErrors.fullName && <div className="text-xs text-red-600 mt-1">{personalErrors.fullName}</div>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              Email Address
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={cn(
                "h-11 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4",
                personalErrors.email ? "border-red-500" : "border-gray-300 border",
              )}
            />
            {personalErrors.email && <div className="text-xs text-red-600 mt-1">{personalErrors.email}</div>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={cn(
                "h-11 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4",
                personalErrors.phone ? "border-red-500" : "border-gray-300 border",
              )}
            />
            {personalErrors.phone && <div className="text-xs text-red-600 mt-1">{personalErrors.phone}</div>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              Date of Birth
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                    !dob && "text-gray-400",
                  )}
                >
                  {dob ? format(dob, "dd-MM-yyyy") : "dd-mm-yyyy"}
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dob} onSelect={setDob} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {purpose === "vacation" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Travel Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !startDate && "text-gray-400",
                      )}
                    >
                      {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Travel End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !endDate && "text-gray-400",
                      )}
                    >
                      {endDate ? format(endDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Destination Country
                </label>
                <Input
                  placeholder="e.g., United States"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
            </>
          )}

          {purpose === "medical" && (
            <>
              {/* <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookCheck className="w-3.5 h-3.5 text-blue-600" />
                  Hospital / Clinic Name
                </label>
                <Input placeholder="Enter hospital or clinic name" className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4" />
              </div> */}
              {/* <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Medical Reference / Case ID
                </label>
                <Input placeholder="Enter reference / case id" className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4" />
              </div> */}
              {/* <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Treatment Date / Appointment
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !startDate && "text-gray-400",
                      )}
                    >
                      {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div> */}
            </>
          )}

          {purpose === "employment" && (
            <>
              {/* <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Employer / Organisation
                </label>
                <Input placeholder="Enter employer name" className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Employment Offer / Contract
                </label>
                <Input placeholder="Offer letter reference" className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Joining Date (if known)
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !startDate && "text-gray-400",
                      )}
                    >
                      {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div> */}
            </>
          )}

          {purpose === "emigration" && (
            <>
              {/* <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  Visa / Immigration Document
                </label>
                <Input placeholder="e.g., PR reference or visa number" className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Expected Travel Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !startDate && "text-gray-400",
                      )}
                    >
                      {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div> */}
            </>
          )}

          {purpose === "leisure" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Travel Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !startDate && "text-gray-400",
                      )}
                    >
                      {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  Travel End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal rounded-lg border-gray-300 bg-white hover:bg-gray-50 px-4",
                        !endDate && "text-gray-400",
                      )}
                    >
                      {endDate ? format(endDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Destination Country
                </label>
                <Input
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  placeholder="e.g., United States"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
            </>
          )}

          {purpose === "student" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  University/Institution
                </label>
                <Input
                  placeholder="Enter university name"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Course Duration
                </label>
                <Input
                  placeholder="e.g., 2 years"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Course/Program
                </label>
                <Input
                  placeholder="e.g., Master's in Computer Science"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
            </>
          )}

          {purpose === "business" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Business Name
                </label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Business Type
                </label>
                <Input
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g., IT Services, Manufacturing"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Company Name
                </label>
                <Input
                  placeholder="Enter company name"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  Employee ID
                </label>
                <Input
                  placeholder="Enter employee ID"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Designation
                </label>
                <Input
                  placeholder="Your job title"
                  className="h-11 rounded-lg border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <FileText className="w-4 h-4 text-gray-600" />
            Upload Required Documents
          </div>
          {(() => {
            // Define purpose-specific document sets
            const documentsByPurpose: Record<string, Array<{ label: string; icon: any; key: string }>> = {
              student: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Student Passport (Front & Back)", icon: BookCheck, key: "student-passport" },
                { label: "Valid Student Visa", icon: FileText, key: "student-visa" },
                { label: "Admission Letter / I-20", icon: GraduationCap, key: "admission-letter" },
                { label: "One-Way Air Ticket", icon: Plane, key: "oneway-ticket" },
              ],
              medical: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Patient Passport (Front & Back)", icon: BookCheck, key: "patient-passport" },
                { label: "Medical Visa (If required)", icon: FileText, key: "medical-visa" },
                { label: "Air Ticket (Within 60 days)", icon: Plane, key: "medical-ticket" },
              ],
              employment: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Passport (Front & Back)", icon: BookCheck, key: "passport" },
                { label: "Employment Offer Letter", icon: FileText, key: "offer-letter" },
                { label: "Valid Work Visa", icon: FileText, key: "work-visa" },
                { label: "One-Way Air Ticket", icon: Plane, key: "employment-ticket" },
              ],
              emigration: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Passport (Front & Back)", icon: BookCheck, key: "passport" },
                { label: "Valid Emigration / Immigration Visa", icon: FileText, key: "emigration-visa" },
                { label: "One-Way Air Ticket", icon: Plane, key: "emigration-ticket" },
              ],
              business: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Passport (Front & Back)", icon: BookCheck, key: "passport" },
                { label: "Valid Business Visa", icon: FileText, key: "business-visa" },
                { label: "Air Ticket", icon: Plane, key: "air-ticket" },
                { label: "Training/Study/Business Invitation Certificate", icon: FileText, key: "invitation-certificate" },
                { label: "Company Address Proof", icon: Building2, key: "company-proof" },
                { label: "Cancelled Current Account Cheque", icon: Receipt, key: "cancelled-cheque" },
                { label: "GST Registration Certificate", icon: FileText, key: "gst-certificate" },
                { label: "Board Resolution / Authorized Signatory Letter", icon: FileText, key: "board-resolution" },
              ],

              leisure: [
                { label: "PAN Card", icon: IdCard, key: "pan" },
                { label: "Passport (Front & Back)", icon: BookCheck, key: "leisure-passport" },
                { label: "Valid Tourist Visa", icon: FileText, key: "tourist-visa" },
                { label: "Air Ticket (Return preferred)", icon: Plane, key: "leisure-ticket" },
              ],
            }

            // Get documents for selected purpose, fallback to empty array
            const documents = documentsByPurpose[purpose] || []

            return documents.map((upload) => {
              const IconComponent = upload.icon
              return (
                <div
                  key={upload.key}
                  onClick={() => handleUpload(upload.key)}
                  className={cn(
                    "flex items-center justify-center gap-2 border-2 border-dashed rounded-lg py-4 transition-all cursor-pointer font-semibold text-sm",
                    uploadedDocs.includes(upload.key)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600",
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {uploadedDocs.includes(upload.key) ? `${upload.label} - Uploaded` : `Upload ${upload.label}`}
                  {uploadedDocs.includes(upload.key) && <CheckCircle2 className="w-4 h-4 ml-1" />}
                </div>
              )
            })
          })()}
        </div>



        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(0)}
            className="h-12 px-5 rounded-xl border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={() => {
              if (validatePersonalStep()) setStep(2)
            }}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2"
          >
            Continue to Payment <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        </div>
      </div>
    )
  }

  // BOOKING STEP (Initial)
  return (
    <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
      <div className={animate ? "transition-transform duration-500 ease-out translate-y-0 opacity-100" : "transition-transform duration-500 ease-out -translate-y-2 opacity-0"}>
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Globe className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Prithvi Forex</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2 w-full">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Select Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              className={cn(
                "w-full h-11 rounded-lg bg-white px-4 focus:ring-2 focus:ring-blue-500",
                bookingErrors.location ? "border-red-500" : "border-gray-300 border",
              )}
            >
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Choose your city</div>
              {locations.map((loc) => {
                const IconComponent = loc.icon
                return (
                  <SelectItem key={loc.value} value={loc.value} className="py-2.5 focus:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{loc.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {bookingErrors.location && <div className="text-xs text-red-600 mt-1">{bookingErrors.location}</div>}
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-purple-600" />
            Select Currency
          </label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              className={cn(
                "w-full h-11 rounded-lg bg-white px-4 focus:ring-2 focus:ring-blue-500",
                bookingErrors.currency ? "border-red-500" : "border-gray-300 border",
              )}
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Choose currency</div>
              {currencies.map((curr) => (
                <SelectItem key={curr.value} value={curr.value} className="py-2.5 focus:bg-gray-100 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase w-10">{curr.code}</span>
                    <span className="text-sm font-medium">{curr.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {bookingErrors.currency && <div className="text-xs text-red-600 mt-1">{bookingErrors.currency}</div>}
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-green-600" />
            Service Type
          </label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger
              className={cn(
                "w-full h-11 rounded-lg bg-white px-4 focus:ring-2 focus:ring-blue-500",
                bookingErrors.serviceType ? "border-red-500" : "border-gray-300 border",
              )}
            >
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">Choose service</div>
              {serviceTypes.map((service) => {
                const IconComponent = service.icon
                return (
                  <SelectItem
                    key={service.value}
                    value={service.value}
                    className="py-2.5 focus:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-semibold">{service.label}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {bookingErrors.serviceType && <div className="text-xs text-red-600 mt-1">{bookingErrors.serviceType}</div>}
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-orange-600" />
            Purpose of Travel
          </label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger
              className={cn(
                "w-full h-11 rounded-lg bg-white px-4 focus:ring-2 focus:ring-blue-500",
                bookingErrors.purpose ? "border-red-500" : "border-gray-300 border",
              )}
            >
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Choose purpose</div>
              {purposes.map((p) => {
                const IconComponent = p.icon
                return (
                  <SelectItem key={p.value} value={p.value} className="py-2.5 focus:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-sm">{p.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {bookingErrors.purpose && <div className="text-xs text-red-600 mt-1">{bookingErrors.purpose}</div>}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">{currentCurrency?.code} - Live Rate</div>
            <div className="text-xs text-gray-600 font-medium">Updated every 5 minutes</div>
          </div>
        </div>
        <div className="text-2xl font-black text-green-600">₹{rate}</div>
      </div>

      <div className="space-y-2 mb-8">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Banknote className="w-3.5 h-3.5 text-orange-600" />
          Enter Amount in Foreign Currency
        </label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          type="number"
          className={cn(
            "h-12 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-blue-500 px-4 text-base",
            bookingErrors.amount ? "border-red-500" : "border-gray-300 border",
          )}
        />
        {bookingErrors.amount && <div className="text-xs text-red-600 mt-1">{bookingErrors.amount}</div>}
      </div>

      {amount && numAmount > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-900">
            <Receipt className="w-4 h-4 text-gray-600" />
            Amount Breakdown
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Foreign Currency:</span>
            <span className="uppercase text-gray-900 font-bold">
              {currentCurrency?.code} {numAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Exchange Rate:</span>
            <span className="text-gray-900 font-bold">₹{rate}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{currentService?.label} Fee:</span>
            <span className="text-gray-900 font-bold">₹{fee.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
            <span className="text-base font-bold text-blue-600">Total Amount:</span>
            <span className="text-xl font-black text-blue-600">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          if (validateBookingStep()) setStep(1)
        }}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center
        justify-center gap-2"
      >
        Proceed to Personal Details <ArrowRight className="w-4 h-4" />
      </Button>
      </div>
    </div>
  )
}