FROM maven:3.8.4-openjdk-11 AS build

WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn clean install

FROM ralphgregorio/r-tomcat9:1.0

WORKDIR /usr/local/tomcat/webapps

# Remove default Tomcat webapp
RUN rm -rf ROOT

# Deploy your WAR file
COPY --from=build /app/target/BeaplabEngine-0.0.1-SNAPSHOT.war ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
