const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const getAllVideos = async (req, res) => {
    try {
        const videoDirectory = path.join(__dirname, "..", "videos");
        
        // 1. Non-blocking read
        const files = await fsPromises.readdir(videoDirectory);

        // 2. Filter and Map
        const videoList = files
            .filter(file => path.extname(file).toLowerCase() === ".mp4")
            .map(file => ({
                id: path.parse(file).name,
                name: file,
                // add a thumbnail URL here too!
                thumbnail: `/api/thumbnail?videoId=${path.parse(file).name}`
            }));

        res.status(200).json({
            status: "success",
            results: videoList.length,
            data: videoList,
        });

    } catch (err) {
        console.error("Error fetching video list:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch video list",
        });
    }
};;


const getVideoStream = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Video ID is required" });
        }

        const videoPath = path.join(__dirname, "..", "videos", `${id}.mp4`);

        // 1. Check if file exists and get stats asynchronously
        let videoStats;
        try {
            videoStats = await fsPromises.stat(videoPath);
        } catch (err) {
            return res.status(404).json({ message: "Video not found" });
        }

        const videoSize = videoStats.size;
        const range = req.headers.range;

        // 2. Handle non-range requests (Standard 200 OK)
        if (!range) {
            res.writeHead(200, {
                "Content-Length": videoSize,
                "Content-Type": "video/mp4",
            });
            return fs.createReadStream(videoPath).pipe(res);
        }

        // 3. Parse Range Header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

        // 4. Validate Range
        if (isNaN(start) || start >= videoSize || end >= videoSize || start > end) {
            return res.status(416).set({
                "Content-Range": `bytes */${videoSize}`,
            }).end();
        }

        // 5. Create Stream for Partial Content
        const contentLength = end - start + 1;
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        });

        const videoStream = fs.createReadStream(videoPath, { start, end });

        // 6. Handle stream errors and piping
        videoStream.on('error', (streamErr) => {
            console.error("Stream error:", streamErr);
            res.end();
        });

        videoStream.pipe(res);

    } catch (err) {
        console.error("Controller error:", err);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: "Internal server error",
                status: "failure"
            });
        }
    }
};

const getThumbnail = async (req, res) => {
    try {
        const { videoId } = req.query;
        if (!videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        const thumbnailPath = path.join(__dirname, '..', 'thumbnails', `${videoId}.png`);       
        
        const defaultImage = path.join(__dirname, '..', 'thumbnails', 'no-thumbnail.png');
        res.sendFile(thumbnailPath, (err) => {
            if (err) res.sendFile(defaultImage);
        });

    } catch (err) {
        console.error("Thumbnail Controller Error:", err);
        res.status(500).json({ 
            message: 'Failed to process thumbnail',
            status: "failure"
        });
    }
};


module.exports = {
    getAllVideos,
    getVideoStream,
    getThumbnail
};
