import express from 'express';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static('static'));

app.listen(PORT, () => console.log(`Running on port ${PORT}!`));