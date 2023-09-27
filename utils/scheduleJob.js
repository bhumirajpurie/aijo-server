import cron from "node-cron";
import catchAsync from "./catchAsync.js";
import User from "../models/User.js";

// Asynchronous function to check and delete the user
const checkAndDeleteUser = catchAsync(async (newUserEmail) => {
  const user = await User.findOne({ email: newUserEmail });

  if (user && user.verify === false) {
    await User.findOneAndDelete({ email: user.email });
    console.log(`User ${user.email} has been deleted successfully.`);
  }
});

// Schedule the job
export default (cronExpression, newUserEmail) => {
  return cron.schedule(
    cronExpression,
    async () => {
      await checkAndDeleteUser(newUserEmail);
    },
    { scheduled: false }
  );
};
