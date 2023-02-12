const express = require("express")
require("dotenv").config()
const mongoose = require("mongoose")
const path = require("path")

const app = express()

app.use(express.json({extended: true}))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/account", require("./routes/account.routes"))
app.use("/api/notes", require("./routes/note.routes"))

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.NODE_ENV == 'production' ? process.env.PROD_PORT : process.env.DEV_PORT

async function start() {
    try {
      await mongoose.connect(process.env.MONGO_URL)
      app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
      console.log('Server Error', e.message)
      process.exit(1)
    }
  }
  
  start()