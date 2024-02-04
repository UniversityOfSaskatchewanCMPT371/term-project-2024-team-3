FROM maven:3.8.4-openjdk-11 AS build

WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn clean install

FROM rocker/r-apt:bionic

# Install R and necessary dependencies
RUN apt-get update && \
    apt-get install -y r-base && \
    apt-get install -y libssl-dev libxml2-dev libcurl4-openssl-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set write permission to R library path
RUN chmod -R 777 /usr/local/lib/R

# Install R packages from precompiled binaries
COPY ./services/ml-service/requirements-bin.txt .
RUN cat requirements-bin.txt | xargs apt-get install -y -qq

# Install remaining packages from source using Rscript
COPY ./services/ml-service/requirements-src.R .
RUN Rscript requirements-src.R

# Install rJava
RUN apt-get update && \
    apt-get install -y r-cran-rjava && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set LD_LIBRARY_PATH for rJava
ENV LD_LIBRARY_PATH /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/amd64/server

FROM tomcat:9.0-jre11

WORKDIR /usr/local/tomcat/webapps

# Remove default Tomcat webapp
RUN rm -rf ROOT

# Create required directories for R repo
RUN mkdir -p /zips \
             /tmp \
             /fitbit/data/output \
             /fitbit/data/raw \
             /applewatch/data/output \
             /applewatch/data/raw

# Deploy your WAR file
COPY --from=build /app/target/BeaplabEngine-0.0.1-SNAPSHOT.war ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
