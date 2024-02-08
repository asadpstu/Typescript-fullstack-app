import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './route';

const app: Application = express();
const PORT: number = 4050;
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', router);

app.listen(PORT, () => {
  console.log(`Backend running on port : ${PORT}`);
});
