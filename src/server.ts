

import app from "./app"
import { initDB } from "./db"

const port = 3000

const main = () => {
  initDB()
  app.listen(port, () => {
    
    console.log(`server is runing port ${port}`);
    
  })
}

main()