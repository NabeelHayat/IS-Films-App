# IS-Films-App
## Example film database Assignment using Node/Express, MongoDB, Mongoose and React.
### Installation
Clone it, then get your dependencies with npm install like usual.

Then create an .env file on the root and populate it with your MongoDB connection string in one of two ways:

### Using a local Mongo database
```sh
DB_HOST="localhost:27017/is-films-app";
```
### Using MongoDB Atlas https://www.mongodb.com/cloud/atlas
```sh
DB_HOST="mongodb+srv://<dbuser>:<dbpassword>@<dbbaseurl>/is-films-app?retryWrites=true&w=majority";
```

The package dotenv has already been installed and will allow you to access that .env file.

Run the project
Then start the server with yarn start

The main page will show the list of films, and also create new film into the database.
```sh
localhost:3000
```
If this is your first time running the appliaction, you can add three seeders to the database by hitting the following URL:
```sh
localhost:3000/films/make
```
