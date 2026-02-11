# Walkthrough: Spring Boot Project Structure Setup

I have prepared the proper folder structure for your Spring Boot project `PetConnect`, mirroring the architecture of your .NET project `PetConnectAlmost`.

## Created Folder Structure

The following structure was created under `src/main/java/com/petconnect`:

- `controller`: For handling API requests (e.g., [AuthController.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/controller/AuthController.java)).
- `entity`: For database models (e.g., [User.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/entity/User.java), [Pet.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/entity/Pet.java)).
- `dto`: For data transfer objects (e.g., [LoginRequest.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/dto/LoginRequest.java)).
- `repository`: For database access interfaces (e.g., [UserRepository.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/repository/UserRepository.java)).
- `service`: For business logic (e.g., [UserService.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/service/UserService.java)).
- `config`: For application configuration.
- `exception`: For global exception handling headers.

## Placeholder Files
I've added empty class placeholders (with no logic yet) to help you see how the files are organized. This matches the "Controllers", "Models", "DTOs", "Services", and "Repositories" structure from your .NET project.

| Package | Files Created |
| :--- | :--- |
| **controller** | `AuthController`, `PetController` |
| **entity** | `User`, `Pet`, `Post` |
| **dto** | `LoginRequest`, `RegisterRequest` |
| **repository** | `UserRepository`, `PetRepository` |
| **service** | `UserService`, `PetService` |

## Spring Security with JWT

I have implemented a complete Spring Security setup with JWT authentication:

1.  **Dependencies**: Added `jjwt` (Java JWT Library) to [pom.xml](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/pom.xml).
2.  **JWT Utils**: [JwtUtils.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/JwtUtils.java) handles token generation, parsing, and validation.
3.  **Authentication Filter**: [JwtAuthenticationFilter.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/JwtAuthenticationFilter.java) validates tokens on every request.
4.  **User Details**: [UserDetailsImpl.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/UserDetailsImpl.java) and [UserDetailsServiceImpl.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/UserDetailsServiceImpl.java) bridge your DB User to Spring Security.
5.  **Security Config**: [SecurityConfig.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/config/SecurityConfig.java) defines who can access which endpoints (public `/api/auth/**` vs private endpoints).
6.  **Properties**: Configured JWT secret and DB connection in [application.properties](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/resources/application.properties).

> [!IMPORTANT]
> Make sure to update the database credentials (username/password) in your `application.properties` to match your local MySQL setup.

Next, we can implement the registration and login methods in `AuthController`!
