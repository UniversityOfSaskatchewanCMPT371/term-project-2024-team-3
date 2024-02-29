FROM maven:3.8.4-openjdk-11 AS build

WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn clean install

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

COPY ./r-requirements/requirements-src.R .
RUN Rscript requirements-src.R

WORKDIR /usr/local/tomcat/webapps

# Remove default Tomcat webapp
RUN rm -rf ROOT

# Deploy your WAR file
COPY --from=build /app/target/BeaplabEngine-0.0.1-SNAPSHOT.war ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
