import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 3000;
import dbLinkRouter from './routes/dbLink';
import userRouter from './routes/userRouter';
import projectRouter from './routes/projectRouter';
// import graphqlController from './routes/graphqlRouter';
// import authController from './controllers/authController';
import cookieParser from 'cookie-parser';
import cors from 'cors';


type ServerError = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

//allow cross-origin requests
app.use(cors());

// parse incoming request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// app.use(express.static(path.resolve(__dirname, './src/client')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
//   );
//   res.status(200);
//   next();
// });

// for login/signup
app.use('/user', userRouter);
app.use('/projects', projectRouter);

// send database link to appropriate router
app.use('/db', dbLinkRouter, (req, res) => {
  res.status(200).json('success');
});


// statically serve everything in the build folder on the route '/build'
if(process.env.NODE_ENV === 'production') {
  console.log('made it to server')
  app.use(express.static(path.join(__dirname, '../../dist')));
  // serve index.html on the route '/'
  console.log('made it past build')
  app.get('/*', (req, res) => {
    console.log('made it to app.get')
    res.status(200).sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// catch all error handler
app.use((req, res) => res.status(404).send('This page does not exist.'));

// global error handler
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  const defaultErr = {
    log: 'Global Error handler triggered',
    status: 500,
    message: { err: 'Error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err)
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log('server listening on port ' + PORT));
module.exports = app;
