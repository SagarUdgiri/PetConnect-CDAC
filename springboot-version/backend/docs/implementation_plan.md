# Spring Boot Structure Setup for PetConnect

This plan establishes the core package structure for the `PetConnect` Spring Boot application, transitioning from the .NET project structure.

## Proposed Changes

### [Spring Boot Backend]

Summary of package creation under `src/main/java/com/petconnect`.

#### [NEW] controller
Package for REST Controllers (equivalent to .NET `Controllers`).

#### [NEW] entity
Package for JPA Entities (equivalent to database-related classes in .NET `Models`).

#### [NEW] dto
Package for Data Transfer Objects (equivalent to .NET `DTOs` and request/response models).

#### [NEW] repository
Package for Spring Data Repositories (equivalent to .NET `Repositories`).

#### [NEW] service
Package for Business Logic Services (equivalent to .NET `Services`).

#### [NEW] config
Package for Configuration classes (Security, Bean definitions, etc.).

#### [NEW] exception
Package for Global Exception Handling.

---

### [Spring Security & JWT]

Summary of security implementation.

#### [MODIFY] [pom.xml](file:///c:/Users/hp/Desktop/New%20folder%20%283%29/PetConnect/pom.xml)
Add `jjwt-api`, `jjwt-impl`, and `jjwt-jackson` dependencies.

#### [NEW] security/JwtUtils.java
Utility class to generate, parse, and validate JWT tokens.

#### [NEW] security/JwtAuthenticationFilter.java
Filter that executes once per request to validate JWT from the Authorization header.

#### [NEW] security/UserDetailsImpl.java
Implementation of Spring Security `UserDetails`.

#### [NEW] security/UserDetailsServiceImpl.java
Implementation of `UserDetailsService` to load user from database.

#### [NEW] config/SecurityConfig.java
Main security configuration class to enable Web Security, configure CORS/CSRF, and define the security filter chain.

## Verification Plan

### Manual Verification
- Verify that the directories are created successfully in the file system.
- Check that the `PetConnectApplication.java` remains the root of the project.
