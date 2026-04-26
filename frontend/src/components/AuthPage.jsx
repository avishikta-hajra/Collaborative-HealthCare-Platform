import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Home,
  IdCard,
  Lock,
  LogIn as LogInIcon,
  Mail,
  Phone,
  Shield,
  Truck,
  User,
  UserPlus as UserPlusIcon,
} from "lucide-react";
import {
  getFieldErrors,
  login,
  saveAuthSession,
  signupAdmin,
  signupDriver,
  signupPatient,
} from "../services/authApi";

const portalConfig = {
  patient: {
    label: "Patient",
    accountText: "patient account",
    loginButton: "Sign In to Patient Portal",
    signupButton: "Create My Account",
    icon: User,
    iconBg: "bg-blue-600",
    buttonClass: "bg-blue-600",
    accentClass: "text-emerald-400",
    checkboxClass: "accent-emerald-400",
  },
  admin: {
    label: "Admin",
    accountText: "admin account",
    loginButton: "Sign In to Admin Portal",
    signupButton: "Create Admin Account",
    icon: Shield,
    iconBg: "bg-blue-900",
    buttonClass: "bg-blue-900",
    accentClass: "text-blue-900",
    checkboxClass: "accent-blue-600",
  },
  driver: {
    label: "Driver",
    accountText: "driver account",
    loginButton: "Sign In to Driver Portal",
    signupButton: "Create Driver Account",
    icon: Truck,
    iconBg: "bg-cyan-500",
    buttonClass: "bg-cyan-500",
    accentClass: "text-cyan-400",
    checkboxClass: "accent-cyan-400",
  },
};

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  remember: false,
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  homeAddress: "",
  designation: "",
  employeeId: "",
  hospitalId: "",
  licenseNumber: "",
  providerId: "",
};

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function TextInput({ error, icon: Icon, inputClassName = "", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{props.label}</label>
      <div className="relative">
        {Icon && <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />}
        <input
          {...props}
          label={undefined}
          className={`${Icon ? "pl-12" : "pl-4"} pr-4 py-3 border rounded-xl w-full ${inputClassName}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
  );
}

function SelectInput({ error, label, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select {...props} className="w-full pl-4 pr-4 py-3 border rounded-xl bg-white">
        {children}
      </select>
      {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const portal = searchParams.get("portal");
  const portalKey = portalConfig[portal] ? portal : "patient";
  const config = portalConfig[portalKey];
  const Icon = config.icon;

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState("login");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const submitText = useMemo(() => {
    if (loading) return tab === "login" ? "Signing in..." : "Creating account...";
    return tab === "login" ? config.loginButton : config.signupButton;
  }, [config.loginButton, config.signupButton, loading, tab]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    setFormError("");
    setSuccessMessage("");
  };

  const handleLogin = async () => {
    const session = await login({
      email: form.email,
      password: form.password,
    });

    saveAuthSession(session, form.remember);
    navigate("/");
  };

  const handleSignup = async () => {
    let response;

    if (portalKey === "patient") {
      response = await signupPatient({
        email: form.email,
        password: form.password,
        phoneNumber: digitsOnly(form.phoneNumber),
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: digitsOnly(form.emergencyContactPhone),
        homeAddress: form.homeAddress,
      });
    }

    if (portalKey === "admin") {
      response = await signupAdmin({
        email: form.email,
        password: form.password,
        phoneNumber: digitsOnly(form.phoneNumber),
        fullName: form.fullName,
        designation: form.designation,
        employeeId: form.employeeId,
        hospitalId: Number(form.hospitalId),
      });
    }

    if (portalKey === "driver") {
      response = await signupDriver({
        email: form.email,
        password: form.password,
        phoneNumber: digitsOnly(form.phoneNumber),
        fullName: form.fullName,
        licenseNumber: form.licenseNumber,
        providerId: Number(form.providerId),
      });
    }

    setSuccessMessage(response?.message || "Account created successfully. Please sign in.");
    setTab("login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFormError("");
    setFieldErrors({});
    setSuccessMessage("");

    try {
      if (tab === "login") await handleLogin();
      else await handleSignup();
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSignupFields = () => {
    if (tab !== "register") return null;

    return (
      <>
        <TextInput
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={(event) => updateForm("fullName", event.target.value)}
          placeholder="Your full name"
          icon={User}
          error={fieldErrors.fullName}
        />

        {portalKey === "patient" && (
          <>
            <TextInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => updateForm("dateOfBirth", event.target.value)}
              icon={Calendar}
              error={fieldErrors.dateOfBirth}
            />
            <SelectInput
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={(event) => updateForm("gender", event.target.value)}
              error={fieldErrors.gender}
            >
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </SelectInput>
            <SelectInput
              label="Blood Group"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={(event) => updateForm("bloodGroup", event.target.value)}
              error={fieldErrors.bloodGroup}
            >
              <option value="" disabled>Select blood group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </SelectInput>
            <TextInput
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={(event) => updateForm("emergencyContactName", event.target.value)}
              placeholder="Contact person's name"
              icon={User}
              error={fieldErrors.emergencyContactName}
            />
            <TextInput
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={(event) => updateForm("emergencyContactPhone", event.target.value)}
              placeholder="+91 98765 43210"
              icon={Phone}
              error={fieldErrors.emergencyContactPhone}
            />
            <TextInput
              label="Home Address"
              name="homeAddress"
              value={form.homeAddress}
              onChange={(event) => updateForm("homeAddress", event.target.value)}
              placeholder="Your home address"
              icon={Home}
              error={fieldErrors.homeAddress}
            />
          </>
        )}

        {portalKey === "admin" && (
          <>
            <TextInput
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={(event) => updateForm("designation", event.target.value)}
              placeholder="Hospital administrator"
              icon={IdCard}
              error={fieldErrors.designation}
            />
            <TextInput
              label="Employee ID"
              name="employeeId"
              value={form.employeeId}
              onChange={(event) => updateForm("employeeId", event.target.value)}
              placeholder="EMP-1001"
              icon={Hash}
              error={fieldErrors.employeeId}
            />
            <TextInput
              label="Hospital ID"
              name="hospitalId"
              type="number"
              min="1"
              value={form.hospitalId}
              onChange={(event) => updateForm("hospitalId", event.target.value)}
              placeholder="Hospital ID"
              icon={Hash}
              error={fieldErrors.hospitalId}
            />
          </>
        )}

        {portalKey === "driver" && (
          <>
            <TextInput
              label="License Number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={(event) => updateForm("licenseNumber", event.target.value)}
              placeholder="Driving license number"
              icon={IdCard}
              error={fieldErrors.licenseNumber}
            />
            <TextInput
              label="Provider ID"
              name="providerId"
              type="number"
              min="1"
              value={form.providerId}
              onChange={(event) => updateForm("providerId", event.target.value)}
              placeholder="Service provider ID"
              icon={Hash}
              error={fieldErrors.providerId}
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-hidden bg-linear-to-b from-cyan-100 via-indigo-100 to-blue-200 border-t-2 pt-24 pb-16 pl-10 pr-10">
      <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
        <div className="w-full flex justify-between items-center">
          <button onClick={() => navigate("/PortalSelection")} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal selection
          </button>
        </div>
      </div>

      <div className="w-full max-w-md py-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your {config.accountText}</p>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => setTab("login")} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>
              <LogInIcon className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button type="button" onClick={() => setTab("register")} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${tab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>
              <UserPlusIcon className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          )}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600">
              {formError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {renderSignupFields()}

            <TextInput
              label="Email Address"
              name="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              type="email"
              placeholder={portalKey === "admin" ? "admin@hospital.com" : "you@example.com"}
              icon={Mail}
              error={fieldErrors.email}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name="password"
                  value={form.password}
                  onChange={(event) => updateForm("password", event.target.value)}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border rounded-xl"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.password}</p>}
            </div>

            {tab === "register" && (
              <TextInput
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={(event) => updateForm("phoneNumber", event.target.value)}
                placeholder="+91 98765 43210"
                icon={Phone}
                error={fieldErrors.phoneNumber}
              />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" checked={form.remember} onChange={(event) => updateForm("remember", event.target.checked)} className={`w-4 h-4 ${config.checkboxClass}`} />
                <label htmlFor="remember" className="text-sm text-gray-500">Remember me for 30 days</label>
              </div>
              {tab === "login" && <a href="#" className={`${config.accentClass}`}>Forgot password?</a>}
            </div>

            <button type="submit" disabled={loading} className={`w-full ${config.buttonClass} text-white py-3.5 rounded-xl font-semibold disabled:opacity-70`}>
              {submitText}
            </button>

            <div className="text-center text-sm text-gray-500 mt-2">
              {tab === "login" ? (
                <span>Don't have an account? <button type="button" onClick={() => setTab("register")} className={`${config.accentClass} font-semibold`}>Create one</button></span>
              ) : (
                <span>Already have an account? <button type="button" onClick={() => setTab("login")} className={`${config.accentClass} font-semibold`}>Sign in</button></span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
