import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";

import puppeteer from "puppeteer";
import chromium from 'chrome-aws-lambda';

import router from "./router";

const allowedOrigins = [
  "https://666code-react-antd-admin-panel.vercel.app",
  "http://localhost:5173",
  undefined,
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 204,
}));
app.use(compression());
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

const startServer = async () => {
  try {
    // await mongoose.set("strictQuery", false).connect(process.env.MONGODB_URI);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running on:\n http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server Error: \n", error.toString());
  }
};

startServer();

app.get("/api", (_, res) => {
  res.status(200).send({
    status: 200,
    message: "Server up and running, all database connected successfully...",
    data: null
  });
});

app.use("/api", router());

app.use("/proxying", async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = req.query.url as string;

    if (!targetUrl) {
      res.status(400).send({ message: 'Missing URL parameter' });
      return;
    }

    const browser = await chromium.puppeteer.launch({
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--host-resolver-rules=MAP * 8.8.8.8',
      ],
    });

    const page = await browser.newPage();

    const fullTargetUrl = `https://${targetUrl}`;
    await page.goto(fullTargetUrl, { waitUntil: 'domcontentloaded' });


    /*
    let document: any = await page.evaluate(() => document.documentElement.outerHTML);
    const proxyBase = `${req.protocol}://${req.get('host')}/?url=`;
    document = document
      .replace(/href="\/([^"]*)"/g, `href="${proxyBase}${targetUrl}/$1"`)
      .replace(/src="\/([^"]*)"/g, `src="${proxyBase}${targetUrl}/$1"`)
      .replace(/href="https:\/\/([^"]*)"/g, `href="${proxyBase}$1"`)
      .replace(/src="https:\/\/([^"]*)"/g, `src="${proxyBase}$1"`);
    */
    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Failed to load the requested URL.');
  }
});