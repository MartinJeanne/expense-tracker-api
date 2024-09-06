# expense-tracker

## Info
Follow your expenses with this REST API!\
Project to train my back-end skills. Made with Node.js and TypeScript.\
This project idea comes from [Roadmap.sh](https://roadmap.sh/projects/expense-tracker-api)

## Run
With Node.js on your PC, clone the project and:\
Rename the file `.env.example` to `.env`. If you want you can modify the value of the JWT_SECRET in it.\
\
Then execute these commands:
```
npm i
```

```
npm run start
```

## How to use
### Easy mode
To test the REST API, my advice is to use Postman and to import the collection `postman_collection.json`\
All endpoints are listed in it, you'll just have to use the register endoint, and then the login one before testing the rest of the API.\

### Hard mode
Otherwise, you can curl (for example) the endpoints while passing by yourself the JWT token.\
For that you'll need to register with the register endpoint:\
POST: `http://localhost:3000/api/auth/register`\
Example:
```bash
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"username": "martin", "password": "123"}' \
http://localhost:3000/api/auth/register
```
\
Then to log in:
POST: `http://localhost:3000/api/auth/login`\
Example:
```bash
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"username": "martin", "password": "123"}' \
http://localhost:3000/api/auth/login
```
\
For futur requests, save the "token" value and pass it in a header called "Authorization" with the value: `Bearer <token-value-here>`\
Now you can start tracking your expenses!\
Example:
```bash
curl -X GET \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer your_token_here' \
http://localhost:3000/api/expenses
```
The list of all availaible endpoints is available via the Swagger documentation in: `swagger.yml`.\
You can copy and past the value of this file in the [swagger website](https://editor.swagger.io/)
