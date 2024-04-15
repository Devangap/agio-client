import axios from "axios";

export const event = axios.create({
    baseURL: "http://localhost:5001"
  });

  // export const featuredCategory = axios.create({
  //   baseURL: "http://localhost:8000/api/category/",
  //   params: {featured: true}
  // });

