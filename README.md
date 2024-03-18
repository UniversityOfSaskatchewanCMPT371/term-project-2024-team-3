# Deliverables

Here are some quick links to our document deliverables!

- [Incremental Deliverable 1 (ID1)](/documents/ID1)
- [Incremental Deliverable 2 (ID2)](/documents/ID2)
- [Incremental Deliverable 3 (ID3)](/documents/ID3)
- [Incremental Deliverable 4 (ID4)](/documents/ID4)
- [Incremental Deliverable 5 (ID5)](/documents/ID5)

# Getting Started

Access our [Wiki here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-3/wiki)

## Prerequisites

Windows users: [Docker](https://docs.docker.com/desktop/install/windows-install/)

Mac Users: [Docker](https://docs.docker.com/desktop/install/mac-install/) or [Orbstack](https://orbstack.dev/download). Highly recommend Orbstack as its a more lightweight and efficient alternative to docker desktop.

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

---

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

# Branch Naming Convention

## Naming Convention

`issuetype/##-name`

Issue types currently known:

- feature

- document

- hotfix

- build

- spike

- release

- qa

example branch names:

- document/71-branch-name-guide

- feature/22-setup-home-page

## Workflow example for creating a new branch on Github

1. Find the issue number that relates to the branch you are creating

![Alt text](/documents/assets/image.png)

2. On the main page (code) set the branch you are looking at to development

![Alt text](/documents/assets/image-1.png)

3. In the search bar type in the name of the branch you would like to create (following the naming conventions specified above) and click the create branch button

![Alt text](/documents/assets/image-2.png)
