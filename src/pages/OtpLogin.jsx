import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function OtpLogin() {
  const navigate = useNavigate()

  const [step, setStep] = useState("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  // Send OTP
  const sendOtp = async () => {
    if (!phone) {
      setError("Please enter a phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user) // 👈 store user for greeting
        setStep("otp")
      } else {
        setError(data.message || "Failed to send OTP")
      }

    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      setError("Please enter complete OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp: otpCode }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setUser(data.user)

        // Small delay so greeting shows (UX polish)
        setTimeout(() => {
          if (!data.profileComplete) {
            navigate("/complete-profile")
          } else {
            navigate("/hero")
          }
        }, 1200)

      } else {
        setError(data.message || "Invalid OTP")
      }

    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">

        {/* PHONE STEP */}
        {step === "phone" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            {/* 👇 Greeting */}
            {user && (
              <p className="text-center text-gray-600 mb-2">
                {user.name
                  ? `Hello, ${user.name}. Good to have you back 👋`
                  : "Welcome to the community. You’ll love it here"}
              </p>
            )}

            <h2 className="text-2xl font-bold mb-4 text-center">
              Enter OTP
            </h2>

            <div className="flex gap-3 justify-center mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center border rounded text-lg"
                  maxLength={1}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setOtp(["", "", "", "", "", ""])
                setError("")
              }}
              className="w-full text-blue-600 text-sm"
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  )
}