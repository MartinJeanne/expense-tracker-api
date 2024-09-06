# expense-tracker-api

## Info
Follow your expenses with this REST API!\
Project to train my back-end skills. Made with Node.js and TypeScript.\
This project idea comes from [Roadmap.sh](https://roadmap.sh/projects/expense-tracker-api)

## Run
With Node.js on your computer, clone the project and:
- Make a MySQL database available locally.
- Rename `.env.example` to `.env`. If needed, modify the value in it (settings for **MySQL** and **JWT**).

Then execute these commands:
```
npm i
```

```
npm run start
```

## How to use
### Easy mode
To test the REST API, my advice is to use Postman and to import the collection: `documentation/postman_collection.json`\
All endpoints are in it, you'll just have to use the **register** endpoint, and then the **login** one before testing the rest of the API.

### Hard mode
Otherwise, you can use curl (for example) to manipulate the endpoints while passing manually the JWT token.\
The list of all available endpoints can be accessed via the Swagger documentation in: `documentation/swagger.yml`\
You can copy and paste the value of this file in the [Swagger website](https://editor.swagger.io/)\
\
Before testing any endpoints, you'll need to register with the **register** one:\
Example:
```bash
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"username": "martin", "password": "123"}' \
http://localhost:3000/api/auth/register
```
\
Then to **login**.\
Example:
```bash
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"username": "martin", "password": "123"}' \
http://localhost:3000/api/auth/login
```
\
For futur requests, save the "token" in the response.\
You'll have to pass it in a header called "Authorization" with value: `Bearer <token_value_here>`\
Now you can start tracking your expenses!\
\
Example of the GET endpoint:
```bash
curl -X GET \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer your_token_here' \
http://localhost:3000/api/expenses
```
