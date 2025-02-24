import express from "express";
import cors from 'cors'
import { exec } from 'child_process'
const app = express()
const port = 3002;
app.use(cors());
app.use(express.json());
const commonResolutions = ['144', '240', '360', '480', '720', '1080', '1440', '2160'];
app.post('/getInfo',(req,res)=>{
    const url = req.body.msg;
    console.log(url);
    exec(`yt-dlp --get-thumbnail --get-duration --get-title -F ${url}`,(err,stdout,stderr)=>{
        if(err){
            return res.status(500).send({err:"fail"})
        }
       
        const lines = stdout.split('\n').filter(line => line.trim());
        let title = '';
        let duration = '';
        let thumbnail = '';

        lines.forEach(line => {
            // Check if line contains time format (xx:xx or xx:xx:xx)
            if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(line.trim())) {
                duration = line.trim();
            }
            // Check if line contains image URL
            else if (line.includes('.jpg') || line.includes('.webp') || line.includes('.png')) {
                thumbnail = line.trim();
            }
            // Otherwise it's probably the title
            else {
                title = line.trim();
            }
        });



        const formatEntries = stdout
    .split('\n')
    .filter(line => {
      // Match lines that start with a format ID
      return /^[a-z0-9-]+\s/.test(line.trim());
    })
    .map(line => {
      const [id, ext, resolution, ...rest] = line.trim().split(/\s+/);
      return { id, ext, resolution, details: rest.join(' ') };
    })
    .filter(format => {
      // Filter only MP4 video formats with common resolutions
      const height = format.resolution?.split('x')[1];
      return format.ext === 'mp4' && 
             commonResolutions.includes(height) &&
             !format.details.includes('audio only');
    })
    // Group by resolution and take the first format for each resolution
    .reduce((unique, format) => {
      const height = format.resolution.split('x')[1];
      if (!unique.some(f => f.resolution.split('x')[1] === height)) {
        unique.push(format);
      }
      return unique;
    }, [])
    .sort((a, b) => {
      // Sort by resolution (height) in ascending order
      const heightA = parseInt(a.resolution.split('x')[1]);
      const heightB = parseInt(b.resolution.split('x')[1]);
      return heightA - heightB;
    });



        const videoData = {
            title,
            duration,
            thumbnail
        };
        
        res.send({res: videoData,formatEntries, url: url});
    });
});
// Add this after your existing /getInfo route

let clients = [];

// SSE endpoint for progress updates
app.get('/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

app.post('/download', (req, res) => {
    const { formatId, url } = req.body;
    console.log('Starting download:', { formatId, url });

    if (!formatId || !url) {
        return res.status(400).send({ error: 'Missing formatId or url' });
    }

    res.json({ status: 'download started' });

    // Send initial progress to all clients
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify({ progress: 0 })}\n\n`);
    });

    const process = exec(`yt-dlp -f ${formatId}+ba ${url} --progress-template "[download] %(progress._percent_str)s" --newline`);

    // Handle stdout for progress updates
    process.stdout.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/\[download\]\s+(\d+\.\d+)%/);
        if (match) {
            const percentage = Math.round(parseFloat(match[1]));
            clients.forEach(client => {
                client.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`);
            });
        }
    });

    // Handle stderr for progress updates as well
    process.stderr.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/\[download\]\s+(\d+\.\d+)%/);
        if (match) {
            const percentage = Math.round(parseFloat(match[1]));
            clients.forEach(client => {
                client.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`);
            });
        }
    });

    process.on('close', (code) => {
        if (code === 0) {
            // Send completion event
            clients.forEach(client => {
                client.write(`data: ${JSON.stringify({ 
                    progress: 100,
                    complete: true 
                })}\n\n`);
            });
        }
    });
});


app.listen(port,()=>{
    console.log('running don\'t worry');
});