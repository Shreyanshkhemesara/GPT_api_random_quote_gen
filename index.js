const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi, OpenAI } = require("openai");
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(bodyParser.json());

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

const WriteInFIle = async (msg) => {
    fs.appendFile(
        "./data.txt",
        JSON.stringify(msg[0].content) + "\n",
        (err) => {
            if (err) {
                console.log("error writing: " + err);
            }
        }
    );
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
