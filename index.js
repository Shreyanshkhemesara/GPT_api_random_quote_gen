const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi, OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");

//connect to mongodb database
mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("successfully connected to db server"));
//schema of message
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

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
  const filePath = "./client/src/data.json";
  const existing = await fs.readFile(filePath, "utf-8");
  const jsonData = existing ? JSON.parse(existing) : [];
  // console.log(msg);
  // console.log(msg.len);
  var len = msg.len;
  var ix = 0;
  for (var i = 0; i < len; i++) {
    if (msg[i].user == "gpt") {
      ix = i;
      break;
    }
  }
  jsonData.push(msg[ix].content);

  await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
};

// a function to store the data in db using mongoose:
const callEvery20Seconds = async () => {
  msgs.push({
    role: "user",
    content: "Give me a quote you havent sent me before",
  });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0301",
    messages: msgs,
  });

  //creating a message to save in db.
  const newMessage = new Message({
    content: JSON.stringify(response.choices[0].message),
  });

  //saving it in db
  await newMessage
    .save()
    .then(() => console.log("saved in db"))
    .catch((err) => console.log(err));

  console.log(newMessage);
};

const intervalCalls = setInterval(callEvery20Seconds, 2000);

app.post("/msg", async (req, res) => {
  try {
    msgs.push({
      role: "user",
      content: "Give me a quote you havent sent me before",
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0301",
      messages: msgs,
    });
    const current = new Date();
    console.log("Req at: " + current);
    msgs.pop();
    msgs.push({
      role: "gpt",
      content: response.choices[0].message,
    });

    //creating a message to save in db.
    const newMessage = new Message({
      content: JSON.stringify(response.choices[0].message),
    });

    //saving it in db
    await newMessage.save().then(() => console.log("saved in db"));

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
  Message.find({})
    .sort({ _id: -1 })
    .limit(1)
    .then((data) => {
      if (data) {
        res.status(200).json(data[0]);
      } else {
        res.status(404).json({ msg: "data not found in db" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: "internal server error" });
    });
});

app.get("/allmsg", (req, res) => {
  Message.find()
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: "data not found in db" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: "internal server error" });
    });
});

app.get("/", (req, res) => {
  console.log("/ hitted");
  res.send("Hello World2");
});

app.listen(8080, () => {
  console.log("App started at 8080");
});
