// src/lib/api.js
import axios from "axios";

export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  try {
    const response = await axios.post(
      "https://api.example.com/process",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_INFERENCE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Image upload failed: " + error.message);
  }
}
