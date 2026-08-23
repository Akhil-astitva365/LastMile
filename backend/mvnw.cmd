@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.2.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

set DIRNAME=%~dp0
set MAVEN_DIR=%DIRNAME%.mvn\apache-maven-3.9.6
set MVN_CMD=%MAVEN_DIR%\bin\mvn.cmd

if exist "%MVN_CMD%" (
    call "%MVN_CMD%" %*
    exit /b %ERRORLEVEL%
)

echo Apache Maven not found. Downloading Apache Maven 3.9.6...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $zip = '%DIRNAME%.mvn\maven.zip'; (New-Object Net.WebClient).DownloadFile('https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip', $zip); Expand-Archive -Path $zip -DestinationPath '%DIRNAME%.mvn' -Force; Remove-Item $zip -Force"

if exist "%MVN_CMD%" (
    echo Maven installed successfully! Starting Spring Boot backend...
    call "%MVN_CMD%" %*
    exit /b %ERRORLEVEL%
) else (
    echo Failed to initialize Maven. Please ensure internet access or install Maven.
    exit /b 1
)
