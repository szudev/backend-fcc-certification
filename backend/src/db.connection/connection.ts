import mongoose from "mongoose";

export const Connect = async () => {
  await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log({
        status: "Connected",
        message: "Successfully connected to the database.",
      });
    })
    .catch((err) => {
      console.log({
        status: "Error on mongoose connection.",
        error: err instanceof Error ? err.message : "Unkown error.",
      });
    });
};
