const { statSync } = require("fs");
const path = require("path");

const { incoming } = require("./paths");

const supportedVideoFormats = [
  "avi",
  "mp4",
  "mpeg",
  "mpg",
  "wmv",
  "mkv",
  "mov",
];

const isVideo = (fileName) =>
  supportedVideoFormats.some((ext) => fileName.endsWith(ext));

const supportedImageFormats = [
  // "jpg",
  // "jpeg",
  // "png",
  "webp",
];

const isImage = (fileName) =>
  supportedImageFormats.some((ext) => fileName.endsWith(ext));

function getHumanReadableSize(bytes) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(2)} ${sizes[i]}`;
}

const isFile =
  (folder = incoming) =>
  (fileName) =>
    statSync(path.join(folder, fileName)).isFile();

const isDirectory =
  (folder = incoming) =>
  (fileName) =>
    statSync(path.join(folder, fileName)).isDirectory();

module.exports = {
  isFile,
  isDirectory,
  isVideo,
  isImage,
  getHumanReadableSize,
};
