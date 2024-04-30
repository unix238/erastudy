import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./db.js";
import Models from "./models/index.js";
import routers from "./router/index.js";

import scms from "./utils/scms_api.js";

import cron from "node-cron";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import session from "express-session";
import MongoStoreFactory from "connect-mongo";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { ComponentLoader } from "adminjs";
import { locale } from "./loaclizationAdminJS.js";
import EmailSender from "./utils/EmailSender.js";
import PhoneSender from "./utils/PhoneSender.js";
import { exec } from "child_process";
import TelegramBot from "node-telegram-bot-api";

dotenv.config({
  path: process.env.NODE_ENV == "development" ? ".env.dev" : ".env.prod",
});

const componentLoader = new ComponentLoader();
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", routers.AuthRouter);
app.use("/property", routers.PropertyRouter);
app.use("/settings", routers.SettingsRouter);
app.use("/payment", routers.PaymentRouter);
app.use("/lot", routers.LotContactFormRouter);

const InitTelegramBot = async () => {
  try {
    console.log("Telegram bot init");
    const bot = await new TelegramBot(process.env.TELEGRAM_BOT_API, {
      polling: true,
    });

    return bot;
  } catch (e) {
    console.log("Telegram bot error");
    console.log(e);
  }
};

export const startAdmin = async () => {
  const DEFAULT_ADMIN = {
    email: "1",
    password: "1",
  };
  const osVersion = process.platform;
  const Components = {
    Dashboard:
      osVersion == "darwin" || osVersion == "linux"
        ? componentLoader.add("Dashboard", "./admin/dashboard")
        : componentLoader.add(
            "Dashboard",
            "C:\\Users\\Assyl\\Desktop\\ERAStudy\\ERAStudy\\server\\admin\\dashboard.jsx"
          ),
  };

  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });

  const adminOptions = {
    resources: [
      ...Object.values(Models).map((model) => ({
        resource: model,
      })),
    ],
    locale,
  };

  const admin = new AdminJS({
    ...adminOptions,
    componentLoader,
    dashboard: {
      component: Components.Dashboard,
    },
    rootPath: "/admin",
  });

  const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
  };

  const MongoStore = new MongoStoreFactory({
    ...session,
    mongoUrl: process.env.MONGO_URI,
  });

  const sessionStore = MongoStore;

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: "sessionsecret",
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: "sessionsecret",
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  return admin;
};

const configureSMS = () => {
  scms.configure({
    login: "info@inlot.kz",
    password: "inlotPassword!",
    ssl: true,
    charset: "utf-8",
  });

  scms.test(function (err) {
    if (err) return console.log("error: " + err);
    console.log("ok");
  });
};

const scheduleBookings = async () => {
  const bookings = await Models.Bookings.find({});
  const today = new Date();
  const thirtyDays = new Date(today.setDate(today.getDate() - 30));
  const bookingsToDelete = bookings.filter(
    (booking) => booking.createdAt < thirtyDays
  );

  bookingsToDelete.forEach(async (booking) => {
    const user = await Models.User.findById(booking.user);
    PhoneSender.sendSMS(user.phone, "Ваша бронь была снята");
  });

  if (bookingsToDelete.length > 0) {
    await Models.Bookings.deleteMany({
      _id: { $in: bookingsToDelete.map((booking) => booking._id) },
    });
  }
};

const makeBackup = () => {
  const timestamp = new Date().toISOString();
  const dumpFileName = `${timestamp}.dump`;
  const command = `mongodump --uri "${process.env.MONGO_URI}" --out backups/${dumpFileName}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Backup successful:", dumpFileName);
    }
  });
};
export const TGBot = await InitTelegramBot();
const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  await startAdmin();
  cron.schedule("0 0 * * *", async () => {
    console.log(`Running cron job ${new Date().toISOString()}`);
    await scheduleBookings();
    // makeBackup();
  });
  configureSMS();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
