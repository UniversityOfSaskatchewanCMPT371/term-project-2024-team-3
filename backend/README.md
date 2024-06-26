# BAEPLabEngine

1. Set the environment variables in postgresql.properties and r_repo.properties files:
    - pg_crypto.key={the encrypt-decrypt key for postgres}
    - r_repo.path={path-to-R-repo}
    - DATABASE_URL={jdbc:postgresql://beapengine-do-user-7277528-0.a.db.ondigitalocean.com:25060/beapengine?sslmode=require&user={the_username}&password={the_password}}
2. Make tomcat as the RCode path directory owner (after tomcat user being created and tomcat is installed)
    -  sudo chown -R tomcat:tomcat RCodeForBeapEngine/

3. Install Redis
4. Install Postgres
    - Create a rule with name "root" and password "root"
    - Create a database with name "beapengine"
    - Restore the database
5. Install tomcat
    - https://linuxize.com/post/how-to-install-tomcat-9-on-ubuntu-18-04/
    - https://www.digitalocean.com/community/tutorials/install-tomcat-9-ubuntu-1804
6. Install R (r-base)
    - Note that the commands in ubuntu are case-sensitive, e.g, in mac we have "RScript" but in ubuntu we have "Rscript"
    - Get the write permission to R so that the required libraries can be installed (in ubuntu the path is: /usr/local/lib/R)
    - I might get some errors related to package version. In this case, install the required R packages separately
       ("Rcpp", "stringi", "lubridate", "xml2", "data.table", "rlang", "tibble", "dplyr", "car") or update all the R packages:
        update.packages(ask = FALSE, checkBuilt=TRUE)
        - install.packages("car", dependencies=TRUE)
    - Some other packages required to be installed for Predictor.R: RWeka => RWeka needs rJava package
        - For installing rJava, the easiest way is: "sudo apt-get install r-cran-rjava" ==> if this says can't find package, do: "sudo add-apt-repository ppa:marutter/c2d4u3.5; sudo apt-get update"
        - On my Ubuntu machine, I also need to set the "LD_LIBRARY_PATH=/usr/lib/jvm/java-8-openjdk-amd64/jre/lib/amd64/server"
            environment path and log off and log in to my machine ("/usr/lib/jvm/java-8-openjdk-amd64" is the JAVA_HOME path).

     - Not a bad idea to look at both Processor.r and Predictor.r files and install all the required packages in command line

7. Make sure all the directories exists on the server:
    - r_repo.path/zips
    - r_repo.path/tmp
    - r_repo.path/fitbit/data/output
    - r_repo.path/fitbit/data/raw
    - r_repo.path/applewatch/data/output
    - r_repo.path/applewatch/data/raw
