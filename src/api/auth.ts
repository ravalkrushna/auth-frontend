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

type loginRequest = {
  email: string;
  password: string;
};

type loginResponse = {
  token: string;
};

export async function login(data: loginRequest): Promise<loginResponse> {
  const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
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
  return response.json();
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
