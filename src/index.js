import "dotenv/config"
import connectDB from "./db/index.db.js"
import {app} from "./app.js"

connectDB().then(() => {

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })

}).catch((err) =>{
    console.log(err, "serve could not connected")
})