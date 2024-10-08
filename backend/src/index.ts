import express from 'express';

const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello from the backend with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
