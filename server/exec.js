import { exec } from 'child_process';

const url = 'https://youtu.be/jSGpKwOQzug?si=y1ljISzDcgBgwNGU';
exec(`yt-dlp -F ${url}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  const commonResolutions = ['144', '240', '360', '480', '720', '1080', '1440', '2160'];

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

  console.log(formatEntries);
});