const express = require('express');
const {json2xml} = require('xml-js');
const authMiddleware = require('../middleware');
const router = express.Router();

const User = require('../users/model');
const Meme = require('../memes/model');
const Favorite = require('./model');

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { memeExternalId, userId } = req.body;
        const { format } = req.query;
        if (!memeExternalId) {
            res.status(400).json({
                error: "Meme external ID is required"
            });
        } else {
            const meme = await Meme.findOne({
                where: {
                    externalId: memeExternalId,
                }
            });

            if (!meme) {
                res.status(400).json({
                    error: "Meme not found"
                });
            }
        }

        if (!userId) {
            res.status(400).json({
                error: "User ID is required"
            });
        } else {
            const user = await User.findOne({
                where: {
                    id: userId,
                }
            });

            if (!user) {
                res.status(400).json({
                    error: "User not found"
                });
            }
        }

        const favoriteExists = await Favorite.findOne({
            where: {
                memeId: memeExternalId,
                userId,
            }
        });

        if (!favoriteExists) {
            const favorite = await Favorite.create({
                memeId: memeExternalId,
                userId,
            });
            
            if (format === "xml") {
                const xml = json2xml({ favorite: favorite.dataValues }, {compact: true, ignoreComment: true, spaces: 4});
                const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
                res.setHeader('Content-Type', 'application/xml');
                return res.status(201).send(finalXml);
            } else {
                return res.status(201).json(favorite.dataValues);
            }

        } else {
            return res.status(400).json({
                error: "Favorite already exists"
            });
        }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { userId, format } = req.query;
        const filters = {};
        const where = {};

        if (userId) {
            where.userId = userId;
        }

        if (Object.keys(where).length > 0) {
            filters.where = where;
        }

        const favorites = await Favorite.findAll(filters);
        if (format === "xml") {
            const favoritesJson = favorites.map(favorite => favorite.toJSON());
            const xml = json2xml({ favorite: favoritesJson }, {compact: true, ignoreComment: true, spaces: 4});
            const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
            res.setHeader('Content-Type', 'application/xml');
            return res.status(200).send(finalXml);
        } else {
            return res.status(200).json(favorites);
        }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query;

        const favorite = await Favorite.findOne({
            where: {
                id,
            }
        });

        if (!favorite) {
            res.status(400).json({
                error: "Favorite not found"
            });
        }

        await favorite.destroy();

        if (format === "xml") {
            const xml = json2xml({ root: {
                ok: true,
            } }, {compact: true, ignoreComment: true, spaces: 4});
            const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
            res.setHeader('Content-Type', 'application/xml');
            return res.status(204).send(finalXml);
        } else {
            return res.status(204).json({
                ok: true
            });
        }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

module.exports = router;