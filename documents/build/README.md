# Troubleshooting for Deployment

---

1. `File was unable to be removed Error: EACCES: permission denied, scandir '/home/autodeploy/actions-runner/_work/term-project-2024-team-3/term-project-2024-team-3/services/ml-service/fitbit/data'`
     - Reason: This is a known error during the deployment which is due 
       to java creating new folders and files and having permissions assigned to root instead of autodeployment user
     - How to fix: You will have to manually ssh into the specified directory and manually remove the folder using sudo, `sudo rm -r data`
2. The build hangs during automated deployment
     - Due to the lack of ram in our production environment (2gb ram), our build often hangs with github actions. 
       We can solve this by manually going into our server and manually running the build and up commands. 
       Which are `docker compose -f docker-compose-prod.yml build` and `docker compose -f docker-compose-prod.yml up -d` 
       inside `/home/autodeploy/actions-runner/_work/term-project-2024-team-3/term-project-2024-team-3`
3. Github actions is not picking up our deployment runnner
     - This is due to svc.sh being down. We can start this up again by running `sudo ./svc.sh start` 
       inside `/home/autodeploy/actions-runner`

## Github Secrets Needed For Deployment

---

**POSTGRESQL_URL** - Url containing username and password for db connection\
**PG_CRYPTO_KEY** - Crypto key for encryption/decryption of our database\
**ROLLBAR_ACCESS_TOKEN** - Access token for our multi level logging framework

# Production Build Details

---
## Environment details
**R version:** 4.1.2 (2021-11-01)\
**Tomcat version:** 9\
**Java Version:** OpenJDK 11 \
**Node Version:** Node 18

## R repository Dependencies
Our tomcat server and R repository dependencies base images are stored in [dockerhub](https://hub.docker.com/layers/ralphgregorio/r-tomcat9/1.0/images/sha256-bfbd6bf7d1b945f9539fb7c182a2b3538b0844b47b4d4ce40f8cea6b75119436?context=repo)
This image has our base tomcat image and all R dependencies needed to run our DataProcessors and Predictors. 
The base image in dockerhub is built from the following:

```dockerfile
FROM tomcat:9.0-jre11

RUN apt-get update && \
    apt-get install -y r-base && \
    apt-get install -y r-cran-rjava && \
    apt-get install -y libssl-dev libxml2-dev

RUN apt-get update && \
    apt-get install -y -qq \
        r-cran-stringi \
        r-cran-lubridate \
        r-cran-xml2 \
        r-cran-dplyr \
        r-cran-lubridate \
        r-cran-dplyr \
        r-cran-tm \
        r-cran-mice \
        r-cran-zoo \
        r-cran-mlbench \
        r-cran-e1071 \
        r-cran-caret \
        r-cran-rpart \
        r-cran-tidyverse

COPY requirements-src.R .
RUN Rscript requirements-src.R
```
While requirements-src.R contains the following
```
pkgs <- c(
    "Rcpp",
    "stats",
    "imputeTS",
    "randomForest",
    "RWeka"
)

install.packages(pkgs)
```

If we need to update our R dependencies/R version we would need to create a new version for our image using the above code as a 
starting point. We would also need to make sure our other Dockerfiles are using the correct version of our docker image.

More info on creating docker images [here](https://docs.docker.com/get-started/04_sharing_app/)

## Production Environment (Digital Ocean)

All deployment is handled by `autodeploy` user in digital ocean.

Our production environment is running inside docker in digital ocean. 
The corresponding docker run can be found in docker-compose-prod.yml.\
Our frontend is minified and stored inside our tomcat server root. 
While our backend is built as a WAR file and stored inside the api folder in tomcat.\
All backend routes are prefixed with `/api`.

With that frontend and backend are containerzied within the tomcat container, with redis also being containerized with it.
The PostgreSQL db lives in a separate server within Digital Ocean.

# Local Development Build Details

---
Local development runs the same versions and dependencies as production. Local development is completely separate from the
production build. Thus we can trust that our local environment is consistent and safe from messing with our production environment.

## Local Environment Set Up

1. For your first initial setup you would need to run `docker-compose build`

2. Once that is done you can run either commands:

   i. `docker-compose up` <- this runs docker in your current terminal session

   ii.`docker-compose up -d` <- this runs docker in the background so you would not need it inside the terminal

3. The react app (webapp) has been removed from the containers, so make sure t manually install and start it on your own
4. Make sure react app is up to date by `cd frontend && yarn install`
5. Get it up and running by doing `yarn start`
6. Everything should be up and running now!

## Backend Testing Setup

#### Preqrequisites

1. Install Maven:

   - Windows:
      - Follow this guide on how to install maven https://mkyong.com/maven/how-to-install-maven-in-windows/
      - Make sure you download apache maven 3.9.6
   - Mac:
      - Just do `brew install maven`

2. After installing maven make sure to run `mvn dependency:resolve` from the backend directory. You should always run this if there are new dependencies installed on the backend

3. Make sure you have JDK11 installed and thats the version your IDE/Maven is using

#### How To Run backend Tests:

You have 2 options:

1. You should be able to press the run button directly on which classes you want to test for test files located in `backend/src/test/java`
2. You can just type mvn test but this will run every single test there is

If you are creating new tests make sure they live in `backend/src/test/java`. Creating tests should be formatted as `TheClassNameTest.java`. If we are testing a class called `HelloService.java`, the test file should be called `HelloServiceTest.java`

Make sure the tests are organized the same way as it is in source, so if the class you are testing lives in controller in the src then the test should have the same structure.

**For example:**
Testing `HomeController.java`, we create a test file in `backend/src/test/controllers` and name the file as `HomeControllerTest.java`

Testing `UserService.java`, we create a test file in `backend/src/test/service` and name the file as `UserServiceTest.java`


## Containers

**webapp**: [http://localhost:3000](http://localhost:3000/)

Removed as a container! Our webapp ui. It is dependent on the backend to handle authentication and processing/predicting files.

**backend**: [http://localhost:8080](http://localhost:8080/)

Running Java SpringMVC. Contains the routes and logic we need to handle authentication and data processing/predicting. Dependent on Tomcat, Redis, PostgreSQL and the R repository to function.

**adminer**: [http://localhost:8082](http://localhost:8082/)

You can use adminer to check what data is stored inside our database. As well as you can write/read data into it.

```
System: PostgreSQL

Server: postgres-db

Username: root

Password: root

Database: beapengine
```

**cache**: [http://localhost:6379](http://localhost:6379/)

Running our Redis instance. No protection on local, can access without password.

**postgres-db**: [http://localhost:5432](http://localhost:5432/)

PostgreSQL database running on version 15. Username is `root` and password is `root`

## FAQS

**_My changes in the frontend is not reflected, why is that?_**

It actually does hot-reload on your code changes! If you have a slow machine you may have to wait a little while longer...

**_My changes in the backend is not reflected when querying the api, why is that?_**

Our configuration for running our backend involves producing a WAR file to deploy to our tomcat server. The WAR file contains all the changes and code of our backend app. To see your changes you would have to rebuild the backend container. To do that you can run `docker-compose up --build`

**_Can I run the react app locally instead of running in the container?_**

Yes you can! You can turn off the container and just do `yarn start` locally. Although you would still need the other containers to be running to interact with our api routes.

**_How do I nuke my docker?_**

Glad you asked, `docker system prune -a`. **Warning**: this deletes all volumes and containers in your docker, so in this context you will have to do the initial local environment setup all over gain.

---