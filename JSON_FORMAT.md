# Channel Playlist JSON Format

This document describes the JSON format used to define channel playlists in Linea Streaming. Channel files are stored in the `data/channels/` directory.

## File Naming Convention

To ensure that the channels remain in a consistent order in Linea, my personal filename convention is as follows :

```
XX.YY.channelname.json
```

- `XX`: Category or group number (e.g., `01` for series, `02` for cartoons, `03` for movies)
- `YY`: Channel number within the category (e.g., `01`, `02`, `03`)
- `channelname`: A descriptive name for the channel (lowercase, no spaces)

**Examples:**

```sh
01.01.space-documentaries.json
01.02.physics-documentaries.json
02.01.conspiracy-stuff.json
```

## JSON Structure

### Complete Channel (with Videos)

A standard channel configuration includes channel metadata and a list of videos:

```js
{
  "id": "test",
  "title": "📺 Test Channel",
  "image": "https://picsum.photos/700/500",
  "description": "Test channel with sample videos",
  "startTime": 1726073578,
  "tags": ["en", "test"],
  "videos": [
    {
      "title": "Big Buck Bunny",
      "duration": 596,
      "url": "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      "title": "Elephant's Dream",
      "duration": 654,
      "url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      "title": "Tears of Steel",
      "duration": 734,
      "url": "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    }
  ]
}
```

### External Link Channel

Channels can also reference external streaming , or really any kind of external link :

```json
{
  "id": "neagari",
  "title": "⚔️ Neagari - Hardcore Minecraft",
  "link": "https://www.twitch.tv/neagari",
  "image": "/covers/nea.webp",
  "tags": ["fr", "gaming"],
  "description": "Humongous projects in Minecraft Hardcore"
}
```

## Field Reference

### Channel Metadata Fields

| Field         | Type   | Required | Description                                                                                                         |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`          | string | **Yes**  | Unique identifier for the channel. By convention it should match the filename.                                      |
| `title`       | string | **Yes**  | Display name for the channel.                                                                                       |
| `image`       | string | **Yes**  | URL to the channel cover image. Can be absolute URL or relative path.                                               |
| `description` | string | **Yes**  | Brief description of the channel content. Displayed in the channel list.                                            |
| `startTime`   | number | No       | Unix timestamp (seconds since epoch) indicating when the playlist "started". Used for synchronization calculations. |
| `tags`        | array  | No       | Array of tags for categorization and filtering (e.g., `["fr", "series"]`, `["en", "movies"]`).                      |
| `videos`      | array  | No\*     | Array of video objects (see below). Required if `link` is not provided.                                             |
| `link`        | string | No\*     | External URL for channels hosted elsewhere. Used instead of the `videos` array.                                     |

**Note:** Either `link` or `videos` must be provided, but not both.

### Video Object Fields

Each video in the `videos` array should have the following structure:

| Field      | Type   | Required | Description                                                                                    |
| ---------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| `title`    | string | **Yes**  | Display title for the video. Shown in the player interface.                                    |
| `duration` | number | **Yes**  | Video length in seconds. Must be accurate for proper synchronization.                          |
| `url`      | string | **Yes**  | Full URL to the video file. Can be absolute (e.g., `https://...`) or relative to the web root. |

**Example:**

```json
{
  "title": "Big Buck Bunny",
  "duration": 596,
  "url": "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
```

---

**Need help?** Check existing channel files in `data/channels/` for more examples and patterns.
