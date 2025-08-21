import app from "./app.js"
import dotenv from "dotenv"
import dbConnection from "./db/db_config.js";

dotenv.config({ path:"./.env" });

const port = process.env.PORT || 5000;

//Database Calling
dbConnection()
    .then(() => 
        app.listen(port,() => console.log(`App is running on the port ${port} `))
    )
    .catch((err) => console.log("There is some Error",err));

