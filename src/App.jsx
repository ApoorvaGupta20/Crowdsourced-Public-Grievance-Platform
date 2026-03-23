import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import RaiseGrievance from "./pages/RaiseGrievance"
import ViewGrievances from "./pages/ViewGrievance"
import GrievanceDetail from "./pages/GrievanceDetails"
import OtpLogin from "./pages/OtpLogin"
import Home from "./pages/home"
import CompleteProfile from "./pages/CompleteProfile"
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raise" element={<RaiseGrievance />} />
          <Route path="/grievances" element={<ViewGrievances />} />
          <Route path="/grievances/:id" element={<GrievanceDetail />} />
          <Route path="/login" element={<OtpLogin />} />
          <Route path="/hero" element={<Hero/>}/>
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
      </main>
    </div>
  )
}