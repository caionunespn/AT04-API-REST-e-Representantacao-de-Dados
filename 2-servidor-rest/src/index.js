require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

(async () => {
    const database = require('./database');
    const User = require('./users/model');
    const Meme = require('./memes/model');
    const Favorite = require('./favorites/model');
    const { getMemes } = require('./memes/api');
 
    try {
      await database.sync();
      await getMemes();
    } catch (err) {
      console.log(err);
    }
})();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));


const userRoutes = require("./users/routes");
const memeRoutes = require("./memes/routes");
const favoriteRoutes = require("./favorites/routes");
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", userRoutes);
app.use("/api/meme", memeRoutes);
app.use("/api/favorite", favoriteRoutes);

app.listen(PORT, () => {
  console.log("listening on port 3001");
});
