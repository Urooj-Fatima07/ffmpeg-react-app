const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// Convert Video Route
app.post('/convert', upload.single('file'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, `output.${req.body.format}`);

    ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            res.status(500).send('Error converting video.');
        })
        .run();
});

// Extract Audio Route
app.post('/extract-audio', upload.single('file'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, `output.${req.body.format}`);

    ffmpeg(inputPath)
        .noVideo()
        .output(outputPath)
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            res.status(500).send('Error extracting audio.');
        })
        .run();
});

// Compress Video Route
app.post('/compress-video', upload.single('file'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, 'compressed_output.mp4');
    const bitrate = req.body.bitrate || '1M';

    console.log(`Compressing video: Input Path = ${inputPath}, Bitrate = ${bitrate}`);

    // Ensure the provided bitrate is valid
    if (!/^\d+[kKmMgG]?$/.test(bitrate)) {
        return res.status(400).send('Invalid bitrate format.');
    }

    ffmpeg(inputPath)
        .videoBitrate(bitrate)
        .output(outputPath)
        .on('start', (commandLine) => {
            console.log('FFmpeg command: ' + commandLine);
        })
        .on('end', () => {
            console.log(`Compression finished. Output Path = ${outputPath}`);
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    return res.status(500).send('Error downloading compressed video.');
                }
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err, stdout, stderr) => {
            console.error('FFmpeg error:', err.message);
            console.error('FFmpeg stderr:', stderr);
            res.status(500).send('Error compressing video.');
        })
        .run();
});


// Merge Video and Audio Route
app.post('/merge-video-audio', upload.fields([{ name: 'video' }, { name: 'audio' }]), (req, res) => {
    if (!req.files || !req.files.video || !req.files.audio) {
        return res.status(400).send('Missing video or audio file.');
    }

    const videoPath = req.files.video[0].path;
    const audioPath = req.files.audio[0].path;
    const outputPath = path.join(__dirname, `merged_output_${Date.now()}.mp4`);

    // Logging paths
    console.log('Video path:', videoPath);
    console.log('Audio path:', audioPath);
    console.log('Output path:', outputPath);

    ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions('-c:v copy')  // Copy video stream without re-encoding
        .outputOptions('-c:a aac')   // Encode audio to AAC
        .outputOptions('-shortest')  // Ensure the shortest stream (audio/video) defines the duration
        .on('end', () => {
            console.log('Merging finished.');
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Clean up
                fs.unlink(videoPath, (err) => { if (err) console.error('File deletion error:', err); });
                fs.unlink(audioPath, (err) => { if (err) console.error('File deletion error:', err); });
                fs.unlink(outputPath, (err) => { if (err) console.error('File deletion error:', err); });
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            res.status(500).send('Error merging video and audio.');
        })
        .save(outputPath);
});

// Trim Video
app.post('/trim-video', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    const outputPath = `uploads/trimmed_output_${Date.now()}.mp4`;
    const startTime = req.body.startTime || '00:00:00';
    const endTime = req.body.endTime || '00:00:10';

    // Convert time strings to seconds
    const convertToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const startSeconds = convertToSeconds(startTime);
    const endSeconds = convertToSeconds(endTime);
    const duration = endSeconds - startSeconds;

    console.log(`Start Time: ${startSeconds}s`);
    console.log(`End Time: ${endSeconds}s`);
    console.log(`Duration: ${duration}s`);

    // Validate the duration
    if (duration <= 0) {
        return res.status(400).send('End time must be after start time.');
    }

    ffmpeg(videoPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => {
            res.download(outputPath, 'trimmed_output.mp4', (err) => {
                if (err) {
                    console.error('Download error:', err);
                }

                // Clean up the temporary files
                fs.unlink(videoPath, (err) => { if (err) console.error('File deletion error:', err); });
                fs.unlink(outputPath, (err) => { if (err) console.error('File deletion error:', err); });
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            res.status(500).send('Error trimming video.');
        })
        .run();
});

app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});
