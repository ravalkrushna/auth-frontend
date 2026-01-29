const API_BASE_URL = "";


/* ---------------------------------- Signup --------------------------------- */
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
    credentials: "include", 
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Signup failed");
  }

  return response.text();
}

/* -------------------------------- Verify OTP -------------------------------- */
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
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "OTP verification failed");
  }

  return response.text();
}

/* ----------------------------------- Login ---------------------------------- */
type LoginRequest = {
  email: string;
  password: string;
};

export async function login(data: LoginRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return response.text();
}

/* ------------------------------------ ME ------------------------------------ */
export type MeResponse = {
  email: string;
};

export async function me(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/users/auth/me`, {
    method: "GET",
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
}

/* ------------------------------ Change Password ------------------------------ */
type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export async function changePassword(
  data: ChangePasswordRequest
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/changepassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(data),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Change password failed (${response.status})`);
  }

  return text;
}

/* ------------------------------ Forgot Password ------------------------------ */
type ForgotPasswordRequest = {
  email: string;
};

export async function sendForgotOtp(data: ForgotPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/users/auth/forgotpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send OTP");
  }

  return response.text();
}

/* ------------------------------ Reset Password ------------------------------ */
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
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Reset password failed");
  }

  return response.text();
}

/* ---------------------------------- Logout ---------------------------------- */
export async function logout(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/users/auth/logout`, {
    method: "POST",
    credentials: "include", 
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Logout failed");
  }

  return res.text();
}
