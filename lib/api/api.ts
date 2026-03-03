import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);
export const nextServer  = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});
console.log('API URL:', JSON.stringify(process.env.NEXT_PUBLIC_API_URL));