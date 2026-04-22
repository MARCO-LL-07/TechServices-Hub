const app = require('./app');

const PORT = process.env.BACKEND_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
