import mongoose, { Connection } from "mongoose";

let regionDB: Connection | null = null;

export const initializeRegionDB = async () => {
  if (regionDB) {
    console.warn("RegionDB is already initialized");
    return regionDB;
  }

  try {
    regionDB = mongoose.createConnection(process.env.REGION_DB_URI || "");

    // regionDB.on("connected", () => {
    //   console.log("Region DB Connected");
    // });

    // regionDB.on("error", (error) => {
    //   console.error("Region DB Connection Error:", error.toString());
    // });

    await regionDB.asPromise();
    return regionDB;
  } catch (error) {
    // console.error("Failed to initialize RegionDB:", error.toString());
    throw new Error(error.toString());
  }
};

export const getRegionDB = (): Connection => {
  if (!regionDB) {
    throw new Error("Region Database is not connected, did you forgot to initiate ?");
  }

  return regionDB;
};