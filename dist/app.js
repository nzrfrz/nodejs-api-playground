"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
mongoose_1.default.Promise = global.Promise;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.set("strictQuery", false).connect(process.env.MONGODB_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server Running on:\n http://localhost:${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log("Server Error: \n", error.toString());
    }
});
startServer();
app.get("/api", (_, res) => {
    res.status(200).send({
        status: 200,
        message: "Server up and running, all database connected successfully...",
        data: null
    });
});
app.use("/api", (0, router_1.default)());
//# sourceMappingURL=app.js.map