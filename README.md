# Linea Streaming

**Linea** is a self-hosted linear streaming platform that allows you to broadcast pre-defined video playlists synchronized across all viewers, emulating the feeling of an old-timey TV channel. Linea is a lightweight alternative to full-featured platforms like [Sync/Cytube](https://github.com/calzoneman/sync), with a static architecture that requires no streaming backend - all synchronization logic is handled on the client side. In fact, Linea can work entirely from storage services such as S3.

A **Linea** instance will consist of a number of `channels`, each containing a playlist of `videos` that will play sequentially in an eternal loop. Every time a user visits a channel, they will be served with the video file that is currently playing, at its current timestamp.

## 📋 Prerequisites

Before getting started, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

While Linea uses `ffmpeg` for some of its features, you don't need to have it installed on your machine as it is already present in the `linea-processor` Docker image.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Dam-Buty/linea-streaming
cd linea-streaming
```

### 2. Bind your content

In the daily operation of your Linea instance, you will work in the following folders :

```
linea-streaming/
├── data/
│   ├── channels/          # Channel playlist JSON files
│   ├── covers/            # Channel cover images (WebP). Is served at http://YOUR_URL/covers
│   └── videos/            # Channel video content. Is served at http://YOUR_URL/videos
├── incoming/              # Source files for the conversion scripts
```

These folders can be anywhere on your machine, for example it is common to store your video content on a different drive or even a different machine. If you don't want to use the local folders you can just bind the relevant folders directly in the `docker-compose.yml` file, in the `volumes` section of each container.

### 3. Prepare Your Content

Here are the basic steps to preparing your content for streaming on Linea :

- Make sure your cover pictures are in WebP format
- Make sure your videos are encoded in a [browser-compatible video format](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)

You don't have to serve the video and image files themselves from Linea. If you already have your content in the correct formats, hosted online and directly accessible with a URL, then you can skip directly to [the next section](#4-channel-playlists).

Before using the content preparation scripts, make sure to set the following environment variables in your `docker-compose.yml` :

- LINEA_STREAMING_BASE_URL : this is the base URL of your Linea instance (leave empty if you use localhost)
- LINEA_VIDEOS_BASE_URL : use this if your videos are hosted on a separate domain name

#### Cover pictures

Linea requires cover images to be in WebP format for optimal performance. If you have images in other formats (JPG, PNG, GIF, BMP, TIFF), you can use the included conversion script to transcode them in batch :

1. Place your images in the `incoming/` directory
2. Run the conversion script:
   ```bash
   docker compose run processor convert-images
   # Alternatively if you use NPM
   npm run script:convert-images
   ```
3. Select the images you want to convert - they will be converted to WebP format in `data/covers`

#### Converting your videos to a browser-compatible format

Linea uses the `<video>` HTML element to read video content in the browser, so your content has to be in a [browser-compatible video format](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs).

If your content is in a different format and you want to avoid the nitty-gritty of installing, configuring and learning to use FFMPeg, Linea comes with helper scripts that can get you going with minimal hassle.

To transcode video content to a browser compatible format :

1. Place your source videos in the `incoming/` directory
2. Run the conversion script:
   ```bash
   docker compose run processor encode
   # Alternatively if you use NPM
   npm run script:encode
   ```
3. Follow the on-screen instructions
4. The transcoded videos will appear in the `/data/videos` folder

The videos will be encoded with `libx264` and reasonable defaults suitable for online streaming. See [ffmpeg.js](src/lib/ffmpeg.js) for the full list of FFMpeg arguments.

### 4. Channel Playlists

Channel playlists are defined as JSON files in the `data/channels/` directory. Each playlist contains information about videos, timing, and playback order.

- Check the existing examples in `data/channels/` for reference
- There is no naming convention all JSON files in the folder will be considered separate channels
- For detailed information on the JSON playlist format, see **[JSON_FORMAT.md](JSON_FORMAT.md)**

When Linea starts up, it will compile all your channel playlists into one JSON file which will be served to the frontend. The channels will appear in the order they have been listed by the file system. To keep a consistent order, my personal convention is to prefix channel files with a category number and an index :

```sh
01.01.space-documentaries.json
01.02.physics-documentaries.json
02.01.conspiracy-stuff.json
```

#### Generating channel playlists

Linea's synchronized play capabilities rely entirely on the correct information being in the channel playlists. At any point in time, the web app can calculate the currently playing video, and its current timestamp, by using :

- The playlist's `startTime` property
- Each video's `duration` property

It is thus critical that the `durations` of your videos be accurate. Linea provides a helper script to generate a playlist for you from a list of video files, using `ffprobe` to get their exact durations.

1. Make sure your videos are in the `/data/videos` folder
2. Run the generation script:
   ```bash
   docker compose run processor playlist
   # Alternatively if you use NPM
   npm run script:playlist
   ```
3. Your JSON playlist is deposited in the `/data/channels` folder

### 5. Launch the Platform

Start the Linea streaming platform using Docker Compose:

```bash
docker compose up
```

At first the bootstrap script will run on the `linea-processor` container, and compile all of your Channel playlists into one data file that will be served to the web app. Then the `lighttpd` server will start serving the Linea web-app at `http://localhost:8066`.

## 📁 Project Structure

Linea's internal configuration and code are exposed as volumes so don't hesitate to tweak and tinker with it !

```
linea-streaming/
├── data/                  # Instance content
├── incoming/              # Files for conversion scripts
├── lighttpd/              # Lighttpd configuration, cache and logs
├── src/                   # Conversion scripts
├── www/                   # Web app
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile.processor   # Dockerfile for the Processor container
└── package.json           # Conversion scripts dependencies
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with 💕 & 🍷 from beautiful Bordeaux
