import 'app-module-path/register';
import { PORT, WEB_DIRECTORY } from 'constants/config';
import { jwtMiddleware } from 'middleware/jwt';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as Express from 'express';
import { Accownt } from 'types/accownt';
import { resolve } from 'path';

declare module 'express' {
  interface Request {
    jwt?: {
      userId: Accownt.User['id'];
      email: Accownt.User['email'];
    };
  }
}

const app = Express();
app.use('/static', Express.static(resolve(WEB_DIRECTORY, 'dist')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(jwtMiddleware);
app.use(require('./middleware/clean-email'));
app.use('/api', require('./controllers/'));
app.get('/*', (req, res) =>
  res.sendFile(resolve(WEB_DIRECTORY, 'dist', 'index.html'))
);
app.listen(PORT, () => console.log('Listening on', PORT));