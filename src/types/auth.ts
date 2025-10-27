export interface LoginCredentials {
    email: string;
    password: string;
}
  
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
  
export interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
}
  
export interface LoginResponse {
    access_token?: string;
    user?: User;
    [key: string]: any;
}
  
export interface RegisterResponse {
    token?: string;
    user?: User;
    [key: string]: any;
}
  