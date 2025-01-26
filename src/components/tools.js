import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
import axios from "axios";


export {
    EditorJS,
    Header,
    List,
    LinkTool,
  Embed,
  RawTool,
  Quote,
  Table,
  ImageTool,
  //   uploadToCloudinaryByFile,
  //   uploadToCloudinaryByUrl,
};

// // Assuming you have your Cloudinary credentials
// const cloudinaryCloudName = "your-cloud-name";
// const cloudinaryUploadPreset = "your-upload-preset";
// const cloudinaryApiUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;

// const uploadToCloudinaryByFile = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", cloudinaryUploadPreset);

//     const response = await axios.post(cloudinaryApiUrl, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     // Handle Cloudinary response
//     const cloudinaryUrl = response.data.secure_url;
//     console.log("Image uploaded to Cloudinary:", cloudinaryUrl);

//     return cloudinaryUrl;
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     throw error;
//   }
// };

// const uploadToCloudinaryByUrl = async (url) => {
//   try {
//     const response = await axios.post(cloudinaryApiUrl, {
//       file: url,
//       upload_preset: cloudinaryUploadPreset,
//     });

//     // Handle Cloudinary response
//     const cloudinaryUrl = response.data.secure_url;
//     console.log("Image uploaded to Cloudinary:", cloudinaryUrl);

//     return cloudinaryUrl;
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     throw error;
//   }
// };