import express from 'express';
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World how are you?')
});

app.listen(3000);
