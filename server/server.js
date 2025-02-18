import express from "express";
import cors from 'cors'
import { exec } from 'child_process'
const app = express()
const port = 3002;
app.use(cors());
app.use(express.json());
// post 
app.post('/getInfo',(req,res)=>{
    const url = req.body.msg;
    console.log(msg);
    exec(`yt-dlp ${url}`,(err,stdout,stderr)=>{
        if(err){
            return res.status(500).send({err:"fail"})
        }
        const videoData = JSON.parse(stdout);
        res.send({res:videoData})
    })
    // const videoData = {
    //     duration: '04:00',
    //     thumbnail : 'https://thubnail.jpg',
    //     filename: "Yildiz Geliyor şşşş"
    // }
    console.log(videoData.duration)
    res.send({res: videoData});
});
app.listen(port,()=>{
    console.log('running don\'t worry');
})