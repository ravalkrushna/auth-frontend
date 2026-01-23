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
    throw new Error(errorText);
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
