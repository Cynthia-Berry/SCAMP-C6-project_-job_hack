# AI Application

SheCodes-Africa Project - API Infrastructure to handle clients search for a job that is relevant to their domain or area of interest.

## Available Scripts

Run `node app.js` or `npm run dev` ( that is,`nodemon`) for a dev server. Navigate to [http://localhost:5000](http://localhost:5000).

Important Note:
The app will automatically reload if you run `nodemon` or `npm run dev` (I have configured this command to help run nodemon as my development server) when you change any of the source files.

The application won't automatically reload if you run `node app.js`, so, ensure to stop the application using `ctrl + c` then re-run `node app.js`

## Controlling the job search project
1. Want to quit your running Node.js server?
You can always do that by pressing `ctrl + c` in the terminal/command prompt window where you started your server (i.e. where you ran `npm run dev` or `nodemon`).

2. Create a .env file and make reference to your database information for the below stated constants, so you can run this project seamlessly and test the endpoints.
PORT=5000
MONGODB_USERNAME=***************
MONGODB_PASSWORD=***************
MONGODB_CLUSTER_SUFFIX=@cluster******************
TOKEN_KEY=randomStrings

NB: The asteriks values are to be supplied by you in relation to your MongoDB Atlas set up in your local machine.

3. To successfully make a request on secured endpoints use `JWT ey****************` to set your JWT header before making a request on postman or any other API testing platform.
   (This is exclusive of the registration and login endpoints).

   
## Documentation


