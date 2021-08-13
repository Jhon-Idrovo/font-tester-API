import mongoose from "mongoose";

export async function initDatabaseConnection() {
  try {
    await mongoose
      .connect(process.env.DB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    
      console.log("Connection with database stablished");
  } catch (err) {
    console.log("Unable to connecto to database", err)
    process.exit(1)
  }

}
