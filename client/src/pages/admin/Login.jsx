import { useState } from "react";
import { useAppContext } from "../../hook/useContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {adminLogin} = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await adminLogin(email, password); 
    } catch (error) {
        console.error(error);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium">
          <span className="text-indigo-500">User</span> Login
        </p>

        <div className="w-full">
          <p className="text-sm mb-1">Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            placeholder="email@example.com" 
            className="border border-gray-200 rounded w-full p-2 outline-indigo-500" 
            type="email" 
            required 
          />
        </div>

        <div className="w-full">
          <p className="text-sm mb-1">Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            placeholder="••••••••" 
            className="border border-gray-200 rounded w-full p-2 outline-indigo-500" 
            type="password" 
            required 
          />
        </div>

        <button 
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 mt-2 rounded-md cursor-pointer font-medium"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 mt-2">
          Forgot password? <span className="text-indigo-400 cursor-pointer hover:underline">Reset here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;