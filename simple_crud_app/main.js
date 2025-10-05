import { config } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { router } from './routes/product.route.js'

config();
const app = express();
const db_url = process.env.DATABASE_URL;
const PORT = 8000;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.use("/api/products", router);


app.get('/', (req, res) => {
    res.send("Hello from Node!!!");
});


mongoose.connect(db_url)
    .then(() => {
        console.log("Connected to database!");

        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`)
        });
    })
    .catch(() => {
        console.log("Connection failed!");
    });
