import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export const uploadImage = async (file: File) => {
  try {
    if (!file) {
      throw new Error("file not found");
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<cloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-Guardian-Eye-uploads",
            resource_type:"auto"
           },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as cloudinaryUploadResult);
          }
        );

        uploadStream.end(buffer);
      }
    );

    return result.url;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      let errMsg = error instanceof Error ? error.message : error;
      console.error("Image Upload Failed::", errMsg);
    }
    return null;
  }
};
