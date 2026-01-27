export const getEmailFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null; 

    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload?.sub || decodedPayload?.email || null;
  } catch (err) {
    console.error(" Invalid JWT token:", err);
    return null;
  }
};
