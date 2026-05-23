import app from "./app.js"
import config from "./config/index.js"
import { initDB } from "./db/index.js"




const main = () => {
  initDB()
  app.listen(config.database.port, () => {
    console.log(`Example app listening on port ${config.database.port}`)
  })
}

main()

