import app from './app';
import appConfig from './appConfig';
const port = appConfig.prot;

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
