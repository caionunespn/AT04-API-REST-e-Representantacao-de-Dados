const express = require('express');
const protobuf = require('protobufjs');
const authMiddleware = require('../middleware');
const {json2xml} = require('xml-js');

const router = express.Router();

const Meme = require('./model');

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { format } = req.query;

        const memes = await Meme.findAll();
        
        if (format === "xml") {
            const memesJson = memes.map(meme => meme.toJSON());
            const xml = json2xml({ meme: memesJson }, {compact: true, ignoreComment: true, spaces: 4});
            const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${xml}</root>`;
            res.setHeader('Content-Type', 'application/xml');
            return res.status(201).send(finalXml);
        } else {
            return res.status(201).json(memes);
        }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

router.get("/proto", authMiddleware, async (req, res) => {
    try {
        const memes = await Meme.findAll();
        
        const root = await protobuf.load('src/memes/meme.proto');
        const ProtoMeme = root.lookupType('Meme');
        const ProtoMemeList = root.lookupType('MemeList');
        
        const memeInstances = memes.map((meme) => ProtoMeme.fromObject(meme));
        const message = ProtoMemeList.fromObject({ memes: memeInstances });
        const buffer = ProtoMemeList.encode(message).finish();

        res.setHeader('Content-Type', 'application/protobuf');
        res.setHeader('Content-Disposition', 'attachment; filename="memes.pb"');
      
        res.send(buffer);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

module.exports = router;