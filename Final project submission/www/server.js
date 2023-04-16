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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
// Init the Express application
const app = (0, express_1.default)();
// Set the network port
const port = process.env.PORT || 8082;
// Use the body parser middleware for post requests
app.use(body_parser_1.default.json());
// GET /filteredimage?image_url={{URL}}
//app.get('/filteredimage', async (req, res, next) => {
// const imageUrl = req.query.image_url
app.get('/filteredimage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image_url } = req.query;
    // Validate the image_url query
    if (!image_url) {
        return res.status(400).send({ message: 'image_url is required' });
    }
    try {
        // @ts-ignore
        // Call filterImageFromURL() to filter the image
        const filteredpath = yield (0, util_1.filterImageFromURL)(image_url);
        res.status(200).sendFile(filteredpath, () => __awaiter(void 0, void 0, void 0, function* () {
            // Delete any files on the server on finish of the response
            yield (0, util_1.deleteLocalFiles)([filteredpath]);
        }));
    }
    catch (err) {
        return res.status(422).send({ message: 'Internal server error in processing image' });
    }
}));
// Root Endpoint
// Displays a simple message to the user
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('try GET /filteredimage?image_url={{}}');
}));
// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
//# sourceMappingURL=server.js.map