FROM maven:3.8.4-openjdk-11 AS build

WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn clean install

FROM tomcat:9.0-jre11

WORKDIR /usr/local/tomcat/webapps

RUN rm -rf ROOT

EXPOSE 8080

COPY --from=build /app/target/BeaplabEngine-0.0.1-SNAPSHOT.war ROOT.war
