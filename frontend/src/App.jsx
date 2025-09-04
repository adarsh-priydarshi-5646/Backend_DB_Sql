// import { useState } from "react";

// export default function App() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:3000/contacts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           full_name: fullName,
//           email,
//           phone_no: phone,
//         }),
//       });

//       const data = await res.json();

//       console.log("Response status:", res.status);
//       console.log("Response data:", data);

//       if (res.ok) {
//         setMessage(data.message); // Contact added successfully
//         setIsError(false);
//         setFullName("");
//         setEmail("");
//         setPhone("");
//       } else {
//         setMessage(data.message || "Registration failed");
//         setIsError(true);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setMessage("Registration failed");
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 p-4">
//       <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
//         <h2 className="text-3xl font-bold mb-6 text-white text-center">
//           Registration Form
//         </h2>

//         {message && (
//           <div
//             className={`mb-5 p-3 text-center rounded font-semibold ${
//               isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="p-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             required
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             className="p-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="text"
//             placeholder="Phone Number"
//             className="p-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`p-3 rounded-xl font-bold text-white text-lg transition ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700"
//             }`}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import "./index.css";

function App() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phoneNo) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone_no", phoneNo);
      if (file) formData.append("profile_image", file);

      const res = await fetch("http://localhost:3000/contacts", {
        method: "POST",
        body: formData, // multipart/form-data
      });

      const data = await res.json();
      
      setMessage(data.message);
      setFullName("");
      setEmail("");
      setPhoneNo("");
      setFile(null);
      document.getElementById("fileInput").value = "";
    
    } catch (err) {
      console.error(err);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-800 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">
          Registration Form
        </h2>

        
        {message && (
          <div
            className={`mb-4 p-2 text-center rounded ${message.includes("success")
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="file"
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
