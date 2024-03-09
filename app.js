const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
    console.log("GET request successful");
    res.send("Get Req Success!");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});






