import mongoose from "mongoose";

const dbConnection = async() => {
    try {
        await mongoose.connect("mongodb+srv://gohelbhargav401:gohel02bhargav@megaproject-cluster.hlk9pse.mongodb.net");
        console.log("Database is connected");
    } catch (error) {
        console.error("Error in connecting Database", error);
        // process.exit(1);
    }
}

export default dbConnection;