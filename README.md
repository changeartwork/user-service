
# User Service

This is a microservice for user registeration, login and profile management. JWT is used for authorization and authentication, Below are the list of endpoints for this service.


## API Reference

#### Get user profile

```http
  Swagger /v1/api/user/spec
```



## Development

Install user-service with npm

```bash
  git clone https://github.com/changeartwork/user-service.git
  cd user-service
  npm install 
  npm start
  Run the APIs using postman collection
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file and mongodb installed

`APP_PORT=5000`
`MONGO_SERVER=mongodb://0.0.0.0`
`MONGO_PORT=27017`
`MONGO_DB=changeartworkdb`
`TOKEN_KEY=changeartworkauth`


## Deployment

To deploy this microservice in AWS

* Open putty and login with SSH and secret key
* Direct to user-service 
```bash
    cd /code/user-service
```
* Pull the latest code 
```bash
    git pull upstream <branch-name>
```
* Restart the service with PM2
```bash
    pm2 restart user-service
```  
