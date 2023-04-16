import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
//app.get('/filteredimage', async (req, res, next) => {
 // const imageUrl = req.query.image_url
 app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // Validate the image_url query
  if (!image_url) {
    return res.status(400).send({ message: 'image_url is required' });
  }

  try {
    // @ts-ignore
    // Call filterImageFromURL() to filter the image
    const filteredpath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredpath, async () => {
            
      // Delete any files on the server on finish of the response
      await deleteLocalFiles([filteredpath]);
    });
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
