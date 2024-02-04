system("apt-get update")
system("apt-get install -y r-cran-rjava")
Sys.setenv(LD_LIBRARY_PATH = "/usr/lib/jvm/java-8-openjdk-amd64/jre/lib/amd64/server")

install.packages("RWeka", dependencies=TRUE)
