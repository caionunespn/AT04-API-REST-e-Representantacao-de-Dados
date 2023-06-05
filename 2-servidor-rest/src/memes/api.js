const Meme = require("./model");
const axios = require("axios");

async function getMemes() {
    try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        const formatted = response.data.data.memes.map(meme => {
            return {
                name: meme.name,
                url: meme.url,
                externalId: meme.id,
            }
        });

        const externalIds = formatted.map(meme => meme.externalId);

        const memes = await Meme.findAll({
            where: {
                externalId: externalIds,
            },
            attributes: ['externalId'],
        });

        const existingIds = memes.map(meme => meme.externalId);

        for (const meme of formatted) {
            const memeExists = existingIds.includes(meme.externalId);

            if (memeExists) {
                continue;
            }

            await Meme.create(meme);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getMemes,
}