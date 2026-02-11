# 💻 Code Walkthrough: PetConnect (Spring Boot + JWT)

This document explains exactly **what** has been built, **where** it is located, and **why** we did it that way.

---

## 1. The Foundation: Packages & Structure
**Where:** `src/main/java/com/petconnect/`
**What:** Created directories: `controller`, `dto`, `entity`, `repository`, `service`, `config`, `security`, `exception`.
**Why:** Spring Boot uses a **Layered Architecture**.
- **Entity**: Database table mapping.
- **Repository**: Database access (SQL).
- **Service**: Business logic (Calculations, logic).
- **Controller**: API endpoints (URLs).
- **Security**: Specific logic for JWT and Authentication.

---

## 2. The Identity Bridge

### `User.java` (Entity)
- **Where:** [User.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/entity/User.java)
- **What:** Map the `User` class to a database table with `username`, `email`, and `password`.
- **Why:** To store user credentials securely. We use `@Data` (Lombok) to avoid writing getters/setters manually.

### `UserDetailsImpl.java`
- **Where:** [UserDetailsImpl.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/UserDetailsImpl.java)
- **What:** Implements Spring Security's `UserDetails` interface.
- **Why:** Spring Security doesn't know what a `User` entity is. This class acts as a **Translator**. It takes our `User` data and gives it to Spring in a format it understands.

### `UserDetailsServiceImpl.java`
- **Where:** [UserDetailsServiceImpl.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/UserDetailsServiceImpl.java)
- **What:** Implements `UserDetailsService`.
- **Why:** This is the **Clerk**. When a user tries to log in, Spring calls this service to fetch the user from the database. If the user isn't found, it throws an error.

---

## 3. The JWT Mechanism

### `JwtUtils.java`
- **Where:** [JwtUtils.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/JwtUtils.java)
- **What:** Helper methods to Create tokens and Validate them.
- **Why:** It encapsulates all the "math" and "signing" logic.
    - `generateJwtToken`: Called after successful login to give the user their "ID card".
    - `validateJwtToken`: Called for every future request to make sure the card isn't fake.

### `JwtAuthenticationFilter.java`
- **Where:** [JwtAuthenticationFilter.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/security/JwtAuthenticationFilter.java)
- **What:** Extends `OncePerRequestFilter`.
- **Why:** This is the **Security Guard**. It stands at the door and says: "Before you talk to any API, show me your token."
    - It extracts the token from the `Authorization` header.
    - It validates it using `JwtUtils`.
    - It tells Spring Security "This user is okay" by adding them to the `SecurityContext`.

---

## 4. The Configuration

### `SecurityConfig.java`
- **Where:** [SecurityConfig.java](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/java/com/petconnect/config/SecurityConfig.java)
- **What:** Uses `@Bean` to configure the system.
- **Why:** This is the **Command Center**.
    - It tells Spring to use **Stateless** sessions (because we use JWT).
    - It tells Spring which URLs are open to everyone (like `/api/auth/**`) and which are locked.
    - It registers our `JwtAuthenticationFilter` so it actually starts guarding the doors.
    - It sets up `BCryptPasswordEncoder` so passwords are hashed before saving.

---

## 5. Metadata & Tools

### `pom.xml`
- **Where:** [pom.xml](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/pom.xml)
- **What:** Added JJWT (JsonWebToken) dependencies.
- **Why:** Java doesn't naturally know how to create JWTs. We need this library to do the heavy lifting.

### `application.properties`
- **Where:** [application.properties](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/src/main/resources/application.properties)
- **What:** Added `jwtSecret` and database connection strings.
- **Why:** To avoid hardcoding sensitive keys in Java files. This makes the app easier to deploy in different environments.

---

## Summary of the Flow (Interview Point!)
1. **Request** arrives (e.g., `GET /api/pets`).
2. **JwtAuthenticationFilter** catches it.
3. It checks for a token. If valid, it tells Spring "User is authenticated".
4. **SecurityConfig** checks if the user has permission for `/api/pets`.
5. If yes, the **Controller** finally receives the request.
