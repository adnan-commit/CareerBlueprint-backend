import mongoose from "mongoose";

const connectToDB = async (retries = 5) => {
    while (retries) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                dbName: process.env.DB_NAME
            });
            console.log(` MongoDB Connected: ${conn.connection.host}`);
            break;
        } catch (error) {
            console.error(` DB connection failed. Retries left: ${retries - 1}`);
            retries--;

            if (retries === 0) {
                console.error(" All retries failed. Exiting...");
                process.exit(1);
            }

            // wait 3 seconds before retry
            await new Promise(res => setTimeout(res, 3000));
        }
    }
};

export default connectToDB;