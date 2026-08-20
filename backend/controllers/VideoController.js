const { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const VIDEO_PREFIX = "movies/";

// 1. Fetch video list grouped by genre from R2 bucket
const getAllVideos = async (req, res) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: VIDEO_PREFIX,
        });

        const response = await s3Client.send(command);

        if (!response.Contents) {
            return res.status(200).json({ status: "success", data: {} });
        }

        // Expected key structure: movies/action/movie_name.mkv
        const categorizedVideos = {};

        response.Contents
            .filter((file) => /\.(mkv|mp4)$/i.test(file.Key))
            .forEach((file) => {
                const relativePath = file.Key.replace(VIDEO_PREFIX, ""); // "action/movie_name.mkv"
                const parts = relativePath.split("/");

                if (parts.length === 2) {
                    const genre = parts[0]; // e.g., "action"
                    const fileWithExt = parts[1]; // e.g., "movie_name.mp4"
                    const rawId = fileWithExt.replace(/\.[^/.]+$/, ""); // "movie_name"
                    
                    const videoItem = {
                        id: `${genre}/${rawId}`, // Pass combined key identifier
                        name: rawId.replace(/_/g, " "),
                        genre: genre,
                    };

                    if (!categorizedVideos[genre]) {
                        categorizedVideos[genre] = [];
                    }
                    categorizedVideos[genre].push(videoItem);
                }
            });

        res.status(200).json({
            status: "success",
            data: categorizedVideos, // Returns: { action: [...], comedy: [...] }
        });
    } catch (err) {
        console.error("Error fetching video list from R2:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch video list" });
    }
};

// 2. Generate Presigned URL for video playback
const getVideoStream = async (req, res) => {
    try {
        const { id } = req.query; // Expects "action/movie_name"
        if (!id) {
            return res.status(400).json({ message: "Video ID is required" });
        }

        let key;
        let contentType;

        for (const candidate of [
            { extension: "mp4", type: "video/mp4" },
            { extension: "mkv", type: "video/x-matroska" },
        ]) {
            const candidateKey = `${VIDEO_PREFIX}${id}.${candidate.extension}`;

            try {
                await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: candidateKey }));
                key = candidateKey;
                contentType = candidate.type;
                break;
            } catch {
                // Try the next supported file extension.
            }
        }

        if (!key) {
            return res.status(404).json({ status: "failure", message: "Video not found" });
        }

        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const streamUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.status(200).json({ status: "success", streamUrl, contentType });
    } catch (err) {
        console.error("Error generating presigned video URL:", err);
        res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// 3. Generate Presigned URL for video thumbnail
const getThumbnail = async (req, res) => {
    try {
        const { videoId } = req.query; // Expects "action/movie_name"

        let key = videoId ? `thumbnails/${videoId}.png` : `thumbnails/no-thumbnail.png`;

        if (videoId) {
            try {
                await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
            } catch (err) {
                key = `thumbnails/no-thumbnail.png`;
            }
        }

        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const thumbnailUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return res.redirect(thumbnailUrl);
    } catch (err) {
        console.error("Thumbnail Controller Error:", err);
        return res.status(500).json({ status: "failure", message: "Failed to process thumbnail" });
    }
};

module.exports = {
    getAllVideos,
    getVideoStream,
    getThumbnail,
};




// const fs = require("fs");
// const fsPromises = fs.promises;
// const path = require("path");

// const getAllVideos = async (req, res) => {
//     try {
//         const videoDirectory = path.join(__dirname, "..", "media", "videos");

//         // 1. Non-blocking read
//         const files = await fsPromises.readdir(videoDirectory);

//         // 2. Filter and Map
//         const videoList = files
//             .filter(file => path.extname(file).toLowerCase() === ".mp4")
//             .map(file => ({
//                 id: path.parse(file).name,
//                 name: file.replace(/\.[^/.]+$/, "").replace(/_/g, " "), // remove extension and replace underscores with spaces
//             }));

//         res.status(200).json({
//             status: "success",
//             results: videoList.length,
//             data: videoList,
//         });

//     } catch (err) {
//         console.error("Error fetching video list:", err);
//         res.status(500).json({
//             status: "error",
//             message: "Failed to fetch video list",
//         });
//     }
// };;


// const getVideoStream = async (req, res) => {
//     try {
//         const { id } = req.query;
//         if (!id) {
//             return res.status(400).json({ message: "Video ID is required" });
//         }

//         const videoPath = path.join(__dirname, "..", "media", "videos", `${id}.mp4`);

//         // 1. Check if file exists and get stats asynchronously
//         let videoStats;
//         try {
//             videoStats = await fsPromises.stat(videoPath);
//         } catch (err) {
//             return res.status(404).json({ message: "Video not found" });
//         }

//         const videoSize = videoStats.size;
//         const range = req.headers.range;

//         // 2. Handle non-range requests (Standard 200 OK)
//         if (!range) {
//             res.writeHead(200, {
//                 "Content-Length": videoSize,
//                 "Content-Type": "video/mp4",
//             });
//             return fs.createReadStream(videoPath).pipe(res);
//         }

//         // 3. Parse Range Header
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

//         // 4. Validate Range
//         if (isNaN(start) || start >= videoSize || end >= videoSize || start > end) {
//             return res.status(416).set({
//                 "Content-Range": `bytes */${videoSize}`,
//             }).end();
//         }

//         // 5. Create Stream for Partial Content
//         const contentLength = end - start + 1;
//         res.writeHead(206, {
//             "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//             "Accept-Ranges": "bytes",
//             "Content-Length": contentLength,
//             "Content-Type": "video/mp4",
//         });

//         const videoStream = fs.createReadStream(videoPath, { start, end });

//         // 6. Handle stream errors and piping
//         videoStream.on('error', (streamErr) => {
//             console.error("Stream error:", streamErr);
//             res.end();
//         });

//         videoStream.pipe(res);

//     } catch (err) {
//         console.error("Video Stream error:", err);
//         if (!res.headersSent) {
//             res.status(500).json({
//                 message: "Internal server error",
//                 status: "failure"
//             });
//         }
//     }
// };

// const getThumbnail = async (req, res) => {
//     try {
//         const { videoId } = req.query;
//         if (!videoId) {
//             return res.status(400).json({ error: 'Video ID is required' });
//         }

//         const thumbnailPath = path.join(__dirname, '..', 'media', 'thumbnails', `${videoId}.png`);

//         const defaultImage = path.join(__dirname, '..', 'media', 'thumbnails', 'no-thumbnail.png');
//         res.sendFile(thumbnailPath, (err) => {
//             if (err) res.sendFile(defaultImage);
//         });

//     } catch (err) {
//         console.error("Thumbnail Controller Error:", err);
//         res.status(500).json({
//             message: 'Failed to process thumbnail',
//             status: "failure"
//         });
//     }
// };


// module.exports = {
//     getAllVideos,
//     getVideoStream,
//     getThumbnail
// };
