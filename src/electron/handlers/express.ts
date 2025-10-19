import express from "express";
import { ObjectId } from "mongodb";
import { getBucket } from "@electron/model/gridfs";

const app = express();

app.use("/:id", async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.setHeader("Allow", "GET, HEAD");
        res.sendStatus(405);
        return;
    }
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "invalid file id" });
        return;
    }

    try {
        const bucket = getBucket();
        const objectId = new ObjectId(id);
        const file = await bucket.find({ _id: objectId }).limit(1).next();

        if (!file) {
            res.sendStatus(404);
            return;
        }

        const inferredType = (() => {
            const preferred = file.contentType ?? (file as any).metadata?.contentType;
            if (preferred && preferred !== "application/octet-stream" && preferred !== "binary/octet-stream") {
                return preferred;
            }

            const name = file.filename?.toLowerCase() ?? (file as any).metadata?.originalName?.toLowerCase() ?? "";
            if (name.endsWith(".pdf")) return "application/pdf";
            if (name.endsWith(".png")) return "image/png";
            if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
            if (name.endsWith(".gif")) return "image/gif";
            if (name.endsWith(".webp")) return "image/webp";
            if (name.endsWith(".svg")) return "image/svg+xml";
            if (name.endsWith(".bmp")) return "image/bmp";
            if (name.endsWith(".mp4")) return "video/mp4";
            if (name.endsWith(".webm")) return "video/webm";
            if (name.endsWith(".mov")) return "video/quicktime";
            if (name.endsWith(".mp3")) return "audio/mpeg";
            if (name.endsWith(".wav")) return "audio/wav";
            if (name.endsWith(".ogg")) return "audio/ogg";
            return "application/octet-stream";
        })();

        res.setHeader("Content-Type", inferredType);
        if (file.filename) {
            const safeName = file.filename.replace(/[\r\n"\\]/g, "_");
            res.setHeader("Content-Disposition", `inline; filename="${safeName}"`);
        }

        const totalLength = typeof file.length === "number" ? file.length : undefined;
        const rangeHeader = req.headers.range;
        res.setHeader("Accept-Ranges", "bytes");

        let start = 0;
        let end = typeof totalLength === "number" ? totalLength - 1 : undefined;
        let statusCode = 200;

        if (rangeHeader && typeof totalLength === "number") {
            const matches = rangeHeader.match(/bytes=(\d*)-(\d*)/i);
            if (matches) {
                if (matches[1]) start = Math.max(0, Number(matches[1]));
                if (matches[2]) end = Math.min(totalLength - 1, Number(matches[2]));
                if (end === undefined || end < start) end = totalLength - 1;
                statusCode = 206;
                res.setHeader("Content-Range", `bytes ${start}-${end}/${totalLength}`);
                res.setHeader("Content-Length", (end - start + 1).toString());
            }
        } else if (typeof totalLength === "number") {
            res.setHeader("Content-Length", totalLength.toString());
        }

        res.status(statusCode);

        if (req.method === "HEAD") {
            res.end();
            return;
        }

        const streamOptions = typeof end === "number" ? { start, end } : { start };
        const stream = bucket.openDownloadStream(objectId, streamOptions);
        stream.once("error", (err) => {
            console.error("gridfs stream error", err);
            if (!res.headersSent) {
                res.sendStatus(500);
            } else {
                res.end();
            }
        });

        stream.pipe(res);
    } catch (error) {
        console.error("gridfs serve error", error);
        if (!res.headersSent) {
            res.sendStatus(500);
        } else {
            res.end();
        }
    }
});

app.listen(4568);
