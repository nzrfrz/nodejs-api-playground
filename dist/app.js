"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const router_1 = __importDefault(require("./router"));
const allowedOrigins = [
    "https://666code-react-antd-admin-panel.vercel.app",
    "http://localhost:5173",
    undefined,
];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1)
            callback(null, true);
        else
            callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 204,
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
let dbConnectionStatus = { status: 0, message: "" };
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.set("strictQuery", false).connect(process.env.MONGODB_URI)
    .then(() => {
    dbConnectionStatus = { status: 200, message: "Alive..." };
    console.log("Database Connected");
})
    .catch((error) => {
    dbConnectionStatus = { status: 500, message: error };
    console.log("Can't connect to database: \n", error);
});
app.get("/api", (req, res) => {
    res.status(200).send({
        status: 200,
        message: dbConnectionStatus,
        data: null
    });
});
app.use("/api", (0, router_1.default)());
app.listen(process.env.PORT, () => {
    console.log(`App Running on: http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map