FROM openjdk:8

COPY /build/libs/*.jar /app/rent/app.jar
WORKDIR /app/rent
ENTRYPOINT ["java", "-jar", "app.jar"]
