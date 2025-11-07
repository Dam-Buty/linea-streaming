const path = require("path");

const { spawnBlocking } = require("./spawn");

function ffmpegEncode(outputFolder, filePath, resolution) {
  const ffmpegExecutable = "ffmpeg-progressbar-cli";
  const ffmpegArguments = [
    ["-i", filePath],
    ["-vf", `scale=${resolution}:-2,setsar=1:1`],
    ["-c:v", "libx264"],
    ["-crf", "23"],
    ["-c:a", "aac"],
    ["-movflags", "faststart"],
    ["-maxrate", "2M"],
    ["-bufsize", "2M"],
    [`${path.join(outputFolder, filePath.split("/").pop())}.mp4`],
  ].flat();

  return spawnBlocking("npx", [ffmpegExecutable, ffmpegArguments].flat(), {
    stdio: "inherit",
  });
}

function ffmpegConvertToWebp(outputFolder, filePath, fileName) {
  const outputFileName = fileName.replace(
    /\.(jpg|jpeg|png|gif|bmp|tiff|tif)$/i,
    ".webp"
  );
  const outputPath = path.join(outputFolder, outputFileName);

  const ffmpegArguments = [
    ["-loglevel", "quiet"],
    ["-i", filePath],
    ["-c:v", "libwebp"],
    ["-quality", "90"],
    ["-y"],
    [outputPath],
  ].flat();

  return spawnBlocking("ffmpeg", ffmpegArguments, {
    stdio: "inherit",
  });
}

module.exports = { ffmpegEncode, ffmpegConvertToWebp };
