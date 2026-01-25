"use client";
import React, { useState } from "react";
import {
  Shield,
  Mail,
  Lock,
  Phone,
  MapPin,
  Users,
  Truck,
  Ship,
  Activity,
  Eye,
  EyeOff,
  ChevronDown,
  User,
} from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const regions = [
  "Sujanagar",
  "Jajpur border",
  "Fakirabad",
  "Purusottampur",
  "Ayaba",
  "Badajaria",
  "Nayakot",
  "Saanta pur",
  "jajpur road",
  "Trilochanpur",
  "Itipur",
  "Panturi",
  "Dihapada",
  "Khadianta",
  "Osangara",
  "Mulagain",
  "Jamara",
  "Palakana",
  "Bharsing",
  "Pattamundai",
  "Gandakul College Rd",
  "narendrapur",
  "Malipur",
  "DhumatSasan",
  "Indupur",
  "Dakhina Musadia",
  "Nilakanthapur",
  "Bilikana",
  "Palapatana",
];

interface inputElementField {
  name: string;
  value: string;
  files?: FileList | null;
}

interface RegisterData {
  teamName: string;
  email: string;
  phone: string;
  address: string;
  avatar: File | null;
  rescueBoats: number;
  ambulances: number;
  humanRescueTeamSize: number;
  supplyTrucks: number;
  password: string;
  confirmPassword: string;
  centralRegion: string;
}

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const {saveUserData} = useUserContext()
  const router = useRouter();

  const [registerData, setRegisterData] = useState<RegisterData>({
    teamName: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    rescueBoats: 0,
    ambulances: 0,
    humanRescueTeamSize: 0,
    supplyTrucks: 0,
    password: "",
    confirmPassword: "",
    centralRegion: "",
  });

  const handleRegisterChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, files }: inputElementField = e.target;
    setRegisterData((prev) => ({
      ...registerData,
      [name]: name === "avatar" && files ? files[0] : value,
    }));
  };

  const handleRegisterSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Creating your account, please wait...");
  
    if (registerData.password !== registerData.confirmPassword) {
      toast.dismiss(toastId);
      toast.error("Passwords do not match");
      setFormStep(1);
      return;
    }
   

    const formdata = new FormData();

    for (const key in registerData) {
      const typedKey = key as keyof  RegisterData;
      const value = registerData[typedKey];

      if (value instanceof File) {
        formdata.append(key, value);
      } else if (value !== null) {
        formdata.append(key, String(value));
      }
    };

    try {
      const result = await fetch("api/auth/register",{
        method:"POST",
        body:formdata
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Login failed');
      }
  
      const response = await result.json();
      saveUserData(response.data);
      toast.dismiss(toastId);
      toast.success("Account created successfully! Welcome aboard");
      router.push("/dashboard");
      
      
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Team
          </h1>
          <p className="text-gray-600">
            Join the Guardian Eye disaster management network
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  formStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  formStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  formStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  formStep >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                formStep >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>

          {formStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Team Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team/Organization Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={registerData.teamName}
                  onChange={handleRegisterChange}
                  className="text-slate-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter team or organization name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="text-slate-700 w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
                      placeholder="team@organization.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className="text-slate-700 w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="10-digit phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      name="avatar"
                      onChange={handleRegisterChange}
                      className="text-slate-700 w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="10-digit phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setFormStep(2)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Next: Location Details
                </button>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Location & Coverage Area
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Central Region *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="centralRegion"
                    value={registerData.centralRegion}
                    onChange={handleRegisterChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">Select your central region</option>
                    {regions.map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Address *
                </label>
                <textarea
                  name="address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setFormStep(1)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setFormStep(3)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Next: Resources
                </button>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Team Resources & Capacity
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Please provide accurate resource counts to help coordinate
                  effective disaster response operations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Ship className="w-5 h-5 text-blue-600" />
                      Rescue Boats
                    </div>
                  </label>
                  <input
                    type="number"
                    name="rescueBoats"
                    value={registerData.rescueBoats}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Number of boats"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-600" />
                      Ambulances
                    </div>
                  </label>
                  <input
                    type="number"
                    name="ambulances"
                    value={registerData.ambulances}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Number of ambulances"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Human Rescue Team Size *
                    </div>
                  </label>
                  <input
                    type="number"
                    name="humanRescueTeamSize"
                    value={registerData.humanRescueTeamSize}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Minimum 10 members"
                    min="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-orange-600" />
                      Supply Trucks *
                    </div>
                  </label>
                  <input
                    type="number"
                    name="supplyTrucks"
                    value={registerData.supplyTrucks}
                    onChange={handleRegisterChange}
                    className="text-slate-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Minimum 1 truck"
                    min="1"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Resource Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rescue Boats:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {registerData.rescueBoats}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ambulances:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {registerData.ambulances}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team Members:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {registerData.humanRescueTeamSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Supply Trucks:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {registerData.supplyTrucks}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I confirm that the information provided is accurate and agree
                  to participate in the Guardian Eye disaster management
                  network. I understand this system is for emergency response
                  coordination.
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setFormStep(2)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleRegisterSubmit}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already registered?{" "}
            <Link href="/login">
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in here
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
