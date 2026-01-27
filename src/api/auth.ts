const API_BASE_URL = "http://localhost:8080";

type SignupRequest = {
  email: string;
  password: string;
};

export async function signup(data: SignupRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Signup failed");
  }

  return response.text();
}


type VerifyOtpRequest = {
  email: string;
  otp: string;
};


export async function verifyOtp(data: VerifyOtpRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/verifyotp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.text();

}

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`http://localhost:8080/users/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  // ✅ backend may return JSON or plain text
  const contentType = response.headers.get("content-type") || "";

  // ✅ If JSON → extract token key safely
  if (contentType.includes("application/json")) {
    const json = await response.json();

    const token = json?.token || json?.accessToken || json?.jwt;

    if (!token) {
      throw new Error("Token not found in backend JSON response");
    }

    return { token };
  }

  // ✅ If plain text → treat response as token
  const textToken = (await response.text()).trim();

  if (!textToken) {
    throw new Error("Token not received from backend");
  }

  return { token: textToken };
}



type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export async function changePassword(data: ChangePasswordRequest): Promise<string> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token missing. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/users/auth/changepassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Change password failed (${response.status})`);
  }

  return text;
}

type ForgotPasswordRequest = {
  email: string;
};

export async function sendForgotOtp(data: ForgotPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/forgotpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send OTP");
  }

  return response.text();
}


type ResetPasswordRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export async function resetPassword(data: ResetPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/resetpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Reset password failed");
  }

  return response.text();
}

export const logout = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/users/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Logout failed");
  }

  return res.text();
}
