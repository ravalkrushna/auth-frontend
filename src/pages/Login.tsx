import { useState } from "react";

function Login() {

    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");

    return (
        <>
        <div>Login Page</div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
        </>
    );
}

export default Login;