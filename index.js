const loader = require("./loader")
const express = require("express")
const app = express()
const PORT = 3000

app.get("/", async (req, res) => {
    res.send("Paths: /gamepass?userId=<userId>, /clothing?userId=<userId>")
})

app.get("/gamepasses", async (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.send({ "message": "Invalid Id!" });
    const gamepasses = await loader.loadGamepasses(userId);
    res.send({ "message": "success", "data": gamepasses })
})

app.get("/clothing", async (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.send({ "message": "Invalid Id!" });
    const clothing = await loader.loadClothing(userId)
    res.send({ "message": "success", "data": clothing})
})

app.listen(PORT, () => {
    console.log(`App at port ${PORT}`)
})