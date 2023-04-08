import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get('/filteredimage', async (req, res, next) => {
  const imageUrl = req.query.image_url

  // Validate the image_url query
  if (!imageUrl) {
    return res.status(400).send('Image_url is required')
  }

  try {
    // Call filterImageFromURL() to filter the image
    const filteredPath = await filterImageFromURL(imageUrl)
    res.status(200).sendFile(filteredPath, () => {
      
      // Delete any files on the server on finish of the response
      deleteLocalFiles(Array.of(filteredPath))
    })
  } catch (err) {
    return res.status(422).send({ message: 'Internal server error in processing image' })
  }
})

// Root Endpoint
// Displays a simple message to the user
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
