import express from 'express';
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = "Here goes the API KEY";
const URL = "https://api.openai.com/v1/images/generations"

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hola mundo!");
})

app.post("/gen-image", async(req, res) => {    
    const prompt = req.body.prompt;
    console.log(prompt)
    const headers = {
        'Content-Type':"application/json",
        Authorization:`Bearer ${API_KEY}`,        
    }

    try{
        if (!prompt){
            throw Error('No prompt found');            
        }
        const response = await fetch(URL, {
            method : "POST",
            headers : headers,
            body : JSON.stringify({prompt, size:'256x256'})
        });

        const data = await response.json();
        //console.log({data});
        
        const imageURL = data.data[0].url;
        //console.log({imageURL})

        const imageResponse = await fetch(imageURL);
        const imageBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);

        const id = crypto.randomBytes(20).toString('hex');
        const filename = `${id}.jpg`;
        const pathname = 'public/images/';

        fs.writeFileSync(`${pathname}${filename}`, buffer);
        console.log('image saved locally');

        res.setHeader('Content-Type', 'application/json');
        res.json({filename});

    }catch(error){
        console.error('Error generating image', error.message);
        res.sendStatus(500);
    }
})

app.post("/gen-name", async(req, res) => {   
   
    const prompt = req.body.prompt;
    console.log(prompt)    
    const headers = {
        'Content-Type':"application/json",
        Authorization:`Bearer ${API_KEY}`,        
    }

    try{
        if (!prompt){
            throw Error('No prompt found');            
        }
        const response = await fetch(URL, {
            method : "POST",
            headers : headers,
            body : JSON.stringify({prompt, size:'256x256'})
        });

        const data = await response.json();
        console.log({data});
        
        
        //const imageURL = data.data[0].url;
        const newName = "New Name";
        console.log(newName)

        //const imageResponse = await fetch(imageURL);
        //const imageBuffer = await imageResponse.arrayBuffer();
        //const buffer = Buffer.from(imageBuffer);

        //const id = crypto.randomBytes(20).toString('hex');
        //const filename = `${id}.jpg`;
        //const pathname = 'public/images/';

        //fs.writeFileSync(`${pathname}${filename}`, buffer);
        console.log('Name generated: ' + newName);

        res.setHeader('Content-Type', 'application/json');
        res.json({newName});

    }catch(error){
        console.error('Error generating image', error.message);
        res.sendStatus(500);
    }

})

app.listen(port, ()=> {
    console.log("Starting server...")
})