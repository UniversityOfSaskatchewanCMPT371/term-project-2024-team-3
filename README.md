# Deliverables
Here are some quick links to our document deliverables!
[Incremental Deliverable 1 (ID1)](/documents/ID1)
[Incremental Deliverable 2 (ID2)](/documents/ID2)
[Incremental Deliverable 3 (ID3)](/documents/ID3)
[Incremental Deliverable 4 (ID4)](/documents/ID4)
[Incremental Deliverable 5 (ID5)](/documents/ID5)

# Getting Started

Access our [Wiki here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-3/wiki)

## Prerequisites

Windows users: [Docker](https://docs.docker.com/desktop/install/windows-install/)

Mac Users: [Docker](https://docs.docker.com/desktop/install/mac-install/) or [Orbstack](https://orbstack.dev/download). Highly recommend Orbstack as its a more lightweight and efficient alternative to docker desktop.

## Local Environment Set Up

  

1. For your first initial setup you would need to run the following:

`docker network create spring`

`docker-compose build`

2. Once that is done you can run either commands:

i. `docker-compose up` <- this runs docker in your current terminal session

ii.`docker-compose up -d` <- this runs docker in the background so you would not need it inside the terminal

3. Everything should be up and running now!

## Containers

**webapp**: [http://localhost:3000](http://localhost:3000/)

Our webapp ui. It is dependent on the backend to handle authentication and processing/predicting files.

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

***My changes in the frontend is not reflected, why is that?***

It actually does hot-reload on your code changes! If you have a slow machine you may have to wait a little while longer...

***My changes in the backend is not reflected when querying the api, why is that?***

Our configuration for running our backend involves producing a WAR file to deploy to our tomcat server. The WAR file contains all the changes and code of our backend app. To see your changes you would have to rebuild the backend container. To do that you can run `docker-compose up --build`

***Can I run the react app locally instead of running in the container?***

Yes you can! You can turn off the container and just do `yarn start` locally. Although you would still need the other containers to be running to interact with our api routes.

***How do I nuke my docker?***

Glad you asked, `docker system prune -a`. **Warning**: this deletes all volumes and containers in your docker, so in this context you will have to do the initial local environment setup all over gain.
  
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