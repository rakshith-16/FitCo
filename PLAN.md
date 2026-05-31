# FitCo — Fitness & Health Tracking Application Plan

## Overview

FitCo is a Spring Boot REST API that tracks a user's complete body health:
fitness activity, diet/nutrition, and overall body condition — all in one place.

**Stack:** Java 21 · Spring Boot 4.x · Spring Data JPA · PostgreSQL · Spring Security

---

## Modules

### 1. User & Profile
Manage user accounts and personal body stats.

- Register / Login (JWT-based auth)
- Profile: name, age, gender, height, weight, goal (lose weight / build muscle / maintain)
- Body stats history (weight, BMI, body fat %)

---

### 2. Fitness Tracking
Log workouts and monitor activity.

- Log a workout session (date, duration, type: cardio / strength / yoga / etc.)
- Add exercises per session (name, sets, reps, weight, distance, calories burned)
- Weekly/monthly workout summary
- Rest day tracking
- Step count / active minutes (manual entry or wearable sync)

---

### 3. Diet & Nutrition Tracking
Monitor food intake and nutrition balance.

- Log meals (breakfast, lunch, dinner, snacks)
- Food items with macros: calories, protein, carbs, fats, fiber, sugar
- Daily calorie goal vs actual intake
- Water intake tracking (glasses/liters per day)
- Weekly nutrition report (average macros)

---

### 4. Health & Body Condition
Track overall health metrics over time.

- Vital signs log: heart rate, blood pressure, SpO2, sleep hours
- Mood & energy level rating (1–10 scale)
- Body measurements: chest, waist, hips, arms, thighs (cm/inches)
- BMI calculator (auto from height + weight)
- Health score — composite score from all logged metrics

---

### 5. Goals & Progress
Set targets and measure progress.

- Create fitness goals (e.g., run 5 km, lose 5 kg in 2 months)
- Track goal progress with deadlines
- Milestones & streaks (consecutive workout days)
- Progress photos (store URL/path)

---

### 6. Reports & Dashboard
Summarize data across all modules.

- Daily summary: calories in vs burned, workout done, water intake, sleep
- Weekly trends (charts-ready JSON data)
- Monthly body condition comparison

---

## API Structure

```
/api/v1/auth          → register, login, refresh token
/api/v1/users         → profile CRUD, body stats
/api/v1/workouts      → log & retrieve workout sessions
/api/v1/exercises     → exercise catalog + per-session entries
/api/v1/diet          → meal logs, food items
/api/v1/nutrition     → daily/weekly nutrition summary
/api/v1/water         → water intake log
/api/v1/health        → vitals, mood, body measurements
/api/v1/goals         → goal CRUD + progress
/api/v1/reports       → daily/weekly/monthly summaries
```

---

## Database Schema (High Level)

| Table | Key Columns |
|---|---|
| `users` | id, email, password, name, dob, gender, height, weight, goal |
| `body_stats` | id, user_id, date, weight, bmi, body_fat_pct |
| `workout_sessions` | id, user_id, date, duration_min, type, notes |
| `exercises` | id, session_id, name, sets, reps, weight_kg, distance_km, calories |
| `meals` | id, user_id, date, meal_type (breakfast/lunch/dinner/snack) |
| `food_items` | id, meal_id, name, quantity, calories, protein, carbs, fats |
| `water_logs` | id, user_id, date, amount_ml |
| `health_vitals` | id, user_id, date, heart_rate, bp_systolic, bp_diastolic, spo2, sleep_hrs |
| `body_measurements` | id, user_id, date, chest, waist, hips, arms, thighs |
| `mood_logs` | id, user_id, date, energy_level, mood_rating |
| `goals` | id, user_id, title, target_value, current_value, deadline, status |

---

## Implementation Phases

---

## Phase 1 — Foundation (Detailed Plan)

> Goal: Get a secured, database-connected Spring Boot app running with user registration and JWT login.

---

### Step 1 — Add Maven Dependencies

Update `pom.xml` with the following:

```xml
<!-- JPA + PostgreSQL -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- OpenAPI Docs -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

---

### Step 2 — Configure application.properties

```properties
# Server
server.port=8080

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/fitco_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# JWT
app.jwt.secret=fitco_super_secret_key_change_in_production
app.jwt.expiration-ms=86400000
```

---

### Step 3 — Project Package Structure

```
src/main/java/com/fitness/FitCo/
│
├── Application.java
│
├── config/
│   ├── SecurityConfig.java          ← Spring Security filter chain
│   └── JwtAuthFilter.java           ← JWT request filter
│
├── user/
│   ├── User.java                    ← @Entity
│   ├── UserRepository.java          ← JpaRepository
│   ├── UserService.java             ← business logic
│   └── UserController.java          ← /api/v1/users
│
├── auth/
│   ├── AuthController.java          ← /api/v1/auth
│   ├── AuthService.java
│   ├── dto/
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   └── AuthResponse.java        ← returns JWT token
│
└── util/
    └── JwtUtil.java                 ← generate & validate JWT
```

---

### Step 4 — User Entity

File: `user/User.java`

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String gender;           // MALE / FEMALE / OTHER
    private LocalDate dateOfBirth;
    private Double heightCm;
    private Double weightKg;
    private String fitnessGoal;      // LOSE_WEIGHT / BUILD_MUSCLE / MAINTAIN

    @CreationTimestamp
    private LocalDateTime createdAt;

    // UserDetails overrides
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isEnabled() { return true; }
}
```

---

### Step 5 — JWT Utility

File: `util/JwtUtil.java`

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractEmail(token).equals(userDetails.getUsername());
    }
}
```

---

### Step 6 — Auth Endpoints

File: `auth/AuthController.java`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Create new user account | No |
| POST | `/api/v1/auth/login` | Login and get JWT token | No |
| GET | `/api/v1/users/me` | Get logged-in user profile | Yes (Bearer token) |

**Register Request body:**
```json
{
  "name": "Rakshith",
  "email": "rakshith@example.com",
  "password": "securePassword123",
  "gender": "MALE",
  "dateOfBirth": "2000-01-15",
  "heightCm": 175.0,
  "weightKg": 70.0,
  "fitnessGoal": "BUILD_MUSCLE"
}
```

**Login Request body:**
```json
{
  "email": "rakshith@example.com",
  "password": "securePassword123"
}
```

**Auth Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "rakshith@example.com",
  "name": "Rakshith"
}
```

---

### Step 7 — Security Configuration

File: `config/SecurityConfig.java`

- Permit all: `POST /api/v1/auth/**`
- Require authentication: all other `/api/v1/**` routes
- Stateless session (no HTTP sessions)
- BCrypt password encoding
- JWT filter runs before `UsernamePasswordAuthenticationFilter`

---

### Phase 1 Checklist

- [ ] Add all Maven dependencies to `pom.xml`
- [ ] Create PostgreSQL database `fitco_db`
- [ ] Configure `application.properties`
- [ ] Create `User` entity
- [ ] Create `UserRepository`
- [ ] Create `JwtUtil`
- [ ] Create `JwtAuthFilter`
- [ ] Create `SecurityConfig`
- [ ] Create `AuthService` (register + login logic)
- [ ] Create `AuthController` with `/register` and `/login`
- [ ] Create `UserController` with `/me` endpoint
- [ ] Test with Postman: register → login → get profile
- [ ] Verify JWT is required for protected routes

---

### Phase 1 — Done When

- A new user can register via `POST /api/v1/auth/register`
- A user can log in and receive a JWT via `POST /api/v1/auth/login`
- Protected endpoints return `401 Unauthorized` without a valid token
- `GET /api/v1/users/me` returns the logged-in user's profile with a valid Bearer token
- User data is persisted in PostgreSQL

---

## Implementation Phases (Summary)

### Phase 1 — Foundation *(detailed above)*
- [ ] Add dependencies: Spring Data JPA, PostgreSQL, Spring Security, Lombok, Validation
- [ ] Configure `application.properties` (DB, JWT secret)
- [ ] User entity + registration + JWT login

### Phase 2 — Core Tracking
- [ ] Workout session + exercise logging APIs
- [ ] Meal + food item logging APIs
- [ ] Water intake API
- [ ] Body stats logging (weight, BMI auto-calculate)

### Phase 3 — Health Metrics
- [ ] Vitals logging (heart rate, BP, SpO2, sleep)
- [ ] Body measurements API
- [ ] Mood & energy logging

### Phase 4 — Goals & Progress
- [ ] Goal creation & progress update
- [ ] Streak tracking
- [ ] Milestone detection

### Phase 5 — Reports
- [ ] Daily summary endpoint
- [ ] Weekly trends endpoint
- [ ] Monthly comparison endpoint
- [ ] Health score calculation

### Phase 6 — Polish
- [ ] Input validation & error handling
- [ ] Swagger/OpenAPI docs
- [ ] Unit + integration tests
- [ ] Docker setup

---

## Dependencies to Add (pom.xml)

```xml
<!-- Database -->
<dependency>spring-boot-starter-data-jpa</dependency>
<dependency>postgresql</dependency>

<!-- Security & JWT -->
<dependency>spring-boot-starter-security</dependency>
<dependency>jjwt-api</dependency>

<!-- Utilities -->
<dependency>lombok</dependency>
<dependency>spring-boot-starter-validation</dependency>

<!-- Docs -->
<dependency>springdoc-openapi-starter-webmvc-ui</dependency>
```

---

## Current State

- Spring Boot 4.x project initialized
- Single `/hello` GET endpoint in `Application.java`
- No database, no security, no domain model yet
- Ready to begin Phase 1
