import { type LoginRequest, type RegisterRequest } from "@shared/schema";

// Auth token management
export const AUTH_TOKEN_KEY = "telemed_auth_token";
export const USER_DATA_KEY = "telemed_user_data";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

// Get user data from localStorage
export function getUserData(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Set user data in localStorage
export function setUserData(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

// API request with auth token
export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Erro de rede" }));
    throw new Error(`${response.status}: ${errorData.error || response.statusText}`);
  }

  return response.json();
}

// Login function
export async function login(credentials: LoginRequest): Promise<{ user: AuthUser; token: string }> {
  const response = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (response.token && response.user) {
    setAuthToken(response.token);
    setUserData(response.user);
  }

  return response;
}

// Register function
export async function register(userData: RegisterRequest): Promise<{ user: AuthUser; token: string }> {
  const response = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (response.token && response.user) {
    setAuthToken(response.token);
    setUserData(response.user);
  }

  return response;
}

// Logout function
export function logout(): void {
  removeAuthToken();
  window.location.href = "/";
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getUserData();
}

// Check if user has specific role
export function hasRole(role: string): boolean {
  const user = getUserData();
  return user?.role === role;
}