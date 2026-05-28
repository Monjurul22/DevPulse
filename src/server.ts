

import app from "./app"
import { initDB } from "./db"

const port = 3000

const main = () => {

  app.listen(port, () => {
    initDB()
    console.log(`server is runing port ${port}`);
    
  })
}

main()