const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi, OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
    organization: process.env.ORGANIZATION_KEY,
    key: process.env.OPENAI_API_KEY,
});

const msgs = [];
// overall routes modification and making more readable.
const WriteInFIle = async (msg) => {
    const filePath = './client/src/data.json';
    const existing = await fs.readFile(filePath, 'utf-8');
    const jsonData = existing?JSON.parse(existing):[];

    jsonData.push(msg[0].content);

    await fs.writeFile(filePath, JSON.stringify(jsonData,null,2), 'utf-8')
};

app.post("/msg", async (req, res) => {
    try {
        msgs.push({
            role: "user",
            content: "Give me a quote ",
        });
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0301",
            messages: msgs,
        });
        msgs.pop(); 
        msgs.push({
            role: "gpt",
            content: response.choices[0].message,
        });
        console.log(msgs);
        await WriteInFIle(msgs).then(() => {
            console.log("writing done!");
        });

        res.json({ msgs });
        msgs.pop();
    } catch (err) {
        console.log("error: " + err);
    }
});

app.get("/msg", (req, res) => {
    // read and add to add --> next task
    console.log("hitted /msg");
    res.send(msgs);
});

app.get("/", (req, res) => {
    console.log("/ hitted");
    res.send("Hello World2");
});

app.listen(3000, () => {
    console.log("App started at 3000");
});
