export function validateFile(file, maxSizeKB = 200) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG,JPG, PNG, and GIF images are allowed.";
  }

  if (file.size > maxSizeKB * 1024) {
    return `File size should not exceed ${maxSizeKB}KB.`;
  }

  return null;
}
