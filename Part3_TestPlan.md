# Part 3 — Software Test Plan
**Project:** TechLend — Equipment Lending Management System  
**Branch:** `refactor/vertical-slice-architecture`  
**Architecture:** Vertical Slice Architecture (VSA)  
**Prepared by:** Group [No.] | IT342  
**Date:** May 2026

---

## 1. Test Plan Overview

### 1.1 Purpose
This test plan defines the testing strategy, scope, test cases, and acceptance criteria for the TechLend system after its refactoring to Vertical Slice Architecture. It ensures all functional requirements are met and no regressions were introduced.

### 1.2 Scope
Testing covers three application layers:
- **Backend** — Spring Boot REST API (`/api/v1/**`)
- **Frontend** — React/Vite Web Application
- **Mobile** — Android/Kotlin Application

### 1.3 Test Approach

| Type | Method | Tools |
|------|--------|-------|
| API Testing | Automated (simulated) | Postman / REST Client |
| Backend Build | Automated | `mvnw compile` |
| Frontend Build | Automated | `npm run build` (Vite) |
| Mobile Build | Automated | `gradlew assembleDebug` |
| UI Testing | Manual | Browser, Android Emulator |
| Regression Testing | Manual + Build Verification | All above |

### 1.4 Features Under Test

| Feature Module | Backend | Frontend | Mobile |
|---------------|---------|----------|--------|
| Authentication (auth) | ✓ | ✓ | ✓ |
| User Management (user) | ✓ | ✓ | ✓ |
| Equipment Catalog (equipment) | ✓ | ✓ | — |
| Loan Management (loan) | ✓ | ✓ | — |
| Penalty/Incidents (penalty) | ✓ | ✓ | — |
| Admin Shell (admin) | — | ✓ | — |

---

## 2. Functional Requirements Coverage

| FR-ID | Functional Requirement | Feature | Priority |
|-------|------------------------|---------|----------|
| FR-01 | User can register with email, name, school ID | auth | High |
| FR-02 | User can log in with email or school ID | auth | High |
| FR-03 | User can log out and invalidate token | auth | High |
| FR-04 | System validates JWT on every protected request | auth/shared | High |
| FR-05 | Admin-only endpoints reject non-admin users | auth/shared | High |
| FR-06 | User can view their own profile | user | Medium |
| FR-07 | Admin can list all users | user | Medium |
| FR-08 | Admin can update user role | user | Medium |
| FR-09 | Admin can suspend/unsuspend a user | user | Medium |
| FR-10 | User can browse equipment catalog | equipment | High |
| FR-11 | User can view equipment item details | equipment | High |
| FR-12 | Admin can create equipment model | equipment | High |
| FR-13 | Admin can add equipment items to a model | equipment | High |
| FR-14 | Admin can update equipment item status | equipment | Medium |
| FR-15 | Admin can upload equipment model image | equipment | Low |
| FR-16 | User can submit a loan request | loan | High |
| FR-17 | User can view their own loan history | loan | High |
| FR-18 | Admin can view pending loan requests | loan | High |
| FR-19 | Admin can approve or reject a loan request | loan | High |
| FR-20 | Admin can process equipment checkout | loan | High |
| FR-21 | Admin can process equipment return | loan | High |
| FR-22 | Admin can create a penalty/incident | penalty | Medium |
| FR-23 | Admin can view all penalties/incidents | penalty | Medium |
| FR-24 | Admin can resolve a penalty | penalty | Medium |

---

## 3. Test Cases

### 3.1 AUTH MODULE

#### TC-AUTH-01: User Registration — Happy Path
- **Type:** Manual + API
- **Priority:** High
- **Precondition:** User does not already exist

**Steps:**
1. `POST /api/v1/auth/register`
2. Body: `{ "email": "test@cit.edu", "password": "Test1234!", "firstName": "Jane", "lastName": "Doe", "schoolId": "21-0001" }`

**Expected Result:**
```json
{ "success": true, "data": { "user": { ... }, "tokens": { "accessToken": "...", "refreshToken": "..." } } }
```
**Pass Criteria:** HTTP 200, `success: true`, tokens present  
**Fail Criteria:** HTTP 4xx/5xx, missing tokens

---

#### TC-AUTH-02: User Registration — Duplicate Email
- **Type:** API  
- **Steps:** Submit registration with already-registered email  
- **Expected:** HTTP 400, `success: false`, error message about duplicate  
- **Pass Criteria:** Proper error returned, no duplicate user created

---

#### TC-AUTH-03: User Login — Valid Credentials
- **Type:** Manual + API
- **Steps:**
  1. `POST /api/v1/auth/login`
  2. Body: `{ "identifier": "test@cit.edu", "password": "Test1234!" }`
- **Expected:** HTTP 200, tokens returned
- **Pass Criteria:** `accessToken` and `refreshToken` present in response

---

#### TC-AUTH-04: User Login — Invalid Password
- **Steps:** Login with wrong password  
- **Expected:** HTTP 401, `success: false`
- **Pass Criteria:** Error returned, no token issued

---

#### TC-AUTH-05: Logout — Blacklist Token
- **Steps:**
  1. Login to get token
  2. `POST /api/v1/auth/logout` with `Authorization: Bearer <token>`
  3. Attempt `GET /api/v1/users/me` with same token
- **Expected:** Step 3 returns HTTP 401 (token blacklisted)
- **Pass Criteria:** Token is invalidated after logout

---

#### TC-AUTH-06: Access Protected Route Without Token
- **Steps:** `GET /api/v1/users/me` with no Authorization header
- **Expected:** HTTP 401
- **Pass Criteria:** Request rejected

---

#### TC-AUTH-07: Non-Admin Access to Admin Route
- **Steps:** Login as student, call `GET /api/v1/admin/loans/pending`
- **Expected:** HTTP 403
- **Pass Criteria:** Access denied with appropriate error

---

### 3.2 USER MODULE

#### TC-USER-01: Get Current User Profile
- **Steps:** `GET /api/v1/users/me` with valid student token
- **Expected:** HTTP 200, `UserProfileResponse` with userId, email, role, status
- **Pass Criteria:** Profile data matches logged-in user

---

#### TC-USER-02: Admin — Get All Users
- **Steps:** `GET /api/v1/users` with admin token
- **Expected:** HTTP 200, array of `UserResponse`
- **Pass Criteria:** List contains registered users

---

#### TC-USER-03: Admin — Update User Role
- **Steps:** `PUT /api/v1/users/{userId}/role` body `{ "role": "LAB_STAFF" }` with admin token
- **Expected:** HTTP 200, user role updated
- **Pass Criteria:** Role field reflects new value in response

---

#### TC-USER-04: Admin — Suspend User
- **Steps:** `POST /api/v1/users/{userId}/suspend` body `{ "suspensionReason": "Policy violation" }`
- **Expected:** HTTP 200, user status = `SUSPENDED`
- **Pass Criteria:** User cannot login while suspended

---

#### TC-USER-05: Admin — Unsuspend User
- **Steps:** `POST /api/v1/users/{userId}/unsuspend` with admin token
- **Expected:** HTTP 200, user status = `ACTIVE`

---

### 3.3 EQUIPMENT MODULE

#### TC-EQUIP-01: Browse Equipment Catalog
- **Steps:** `GET /api/v1/equipment-models/catalog-items` (authenticated)
- **Expected:** HTTP 200, list of catalog items with name, category, availableCount
- **Pass Criteria:** Response contains equipment data

---

#### TC-EQUIP-02: View Equipment Item Detail
- **Steps:** `GET /api/v1/equipment-models/catalog-items/{equipmentId}`
- **Expected:** HTTP 200, detailed item info with available units
- **Pass Criteria:** Item details accurate

---

#### TC-EQUIP-03: Admin — Create Equipment Model
- **Steps:** `POST /api/v1/admin/equipment-models` body `{ "name": "Arduino Uno", "category": "MICROCONTROLLER", "description": "..." }`
- **Expected:** HTTP 200, model created with ID

---

#### TC-EQUIP-04: Admin — Add Items to Model
- **Steps:** `POST /api/v1/admin/equipment-models/{modelId}/items` body `{ "quantity": 5 }`
- **Expected:** HTTP 200, list of 5 new item entries

---

#### TC-EQUIP-05: Admin — Update Item Status
- **Steps:** `PATCH /api/v1/admin/equipment-models/items/{equipmentId}/status` body `{ "status": "UNDER_MAINTENANCE" }`
- **Expected:** HTTP 200, item status updated

---

#### TC-EQUIP-06: Admin — Upload Model Image
- **Steps:** `POST /api/v1/admin/equipment-models/{modelId}/upload-image` multipart file
- **Expected:** HTTP 200, `{ "image_url": "https://..." }`
- **Pass Criteria:** Cloudinary URL returned

---

### 3.4 LOAN MODULE

#### TC-LOAN-01: Submit Loan Request
- **Steps:** `POST /api/v1/loans` with student token, body listing equipment item IDs and dates
- **Expected:** HTTP 201, loan transaction created with status `PENDING`
- **Pass Criteria:** `transactionId` present in response

---

#### TC-LOAN-02: Get My Loans
- **Steps:** `GET /api/v1/loans/mine` with student token
- **Expected:** HTTP 200, list of student's loan transactions
- **Pass Criteria:** Returns only the authenticated user's loans

---

#### TC-LOAN-03: Admin — View Pending Loans
- **Steps:** `GET /api/v1/admin/loans/pending`
- **Expected:** HTTP 200, all PENDING transactions
- **Pass Criteria:** Only PENDING status loans returned

---

#### TC-LOAN-04: Admin — Approve Loan
- **Steps:** `PATCH /api/v1/admin/loans/{transactionId}/decision` body `{ "status": "APPROVED", "staffRemark": "Approved" }`
- **Expected:** HTTP 200, loan status = `APPROVED`

---

#### TC-LOAN-05: Admin — Reject Loan
- **Steps:** Same as TC-LOAN-04 with `status: "REJECTED"`
- **Expected:** HTTP 200, loan status = `REJECTED`, items released back to available

---

#### TC-LOAN-06: Admin — Process Checkout
- **Steps:** `PATCH /api/v1/admin/loans/{transactionId}/checkout`
- **Expected:** HTTP 200, status = `ACTIVE`, equipment items marked `BORROWED`

---

#### TC-LOAN-07: Admin — Process Return
- **Steps:** `POST /api/v1/admin/loans/{transactionId}/return` with return condition data
- **Expected:** HTTP 200, status = `COMPLETED`, items returned to `AVAILABLE`

---

### 3.5 PENALTY MODULE

#### TC-PEN-01: Admin — Get All Penalties
- **Steps:** `GET /api/v1/incidents`
- **Expected:** HTTP 200, list of all `PenaltyResponse`

---

#### TC-PEN-02: Admin — Create Penalty
- **Steps:** `POST /api/v1/incidents` body `{ "loanDetailId": "...", "penaltyType": "DAMAGED", "remarks": "Screen cracked" }`
- **Expected:** HTTP 201, penalty created, user suspension triggered if threshold reached

---

#### TC-PEN-03: Admin — Resolve Penalty
- **Steps:** `PATCH /api/v1/incidents/{penaltyId}/resolve`
- **Expected:** HTTP 200, penalty status = `RESOLVED`

---

### 3.6 FRONTEND UI TEST CASES

#### TC-FE-01: Student Login Flow
- **Steps:** Navigate to `/login`, enter credentials, submit
- **Expected:** Redirect to `/dashboard`

#### TC-FE-02: Student Register Flow
- **Steps:** Navigate to `/register`, fill form, submit
- **Expected:** Account created, redirect to `/dashboard`

#### TC-FE-03: Equipment Catalog Display
- **Steps:** Navigate to `/dashboard` as student
- **Expected:** Grid of equipment cards rendered

#### TC-FE-04: Equipment Detail View
- **Steps:** Click an equipment card → `/catalog/item/:id`
- **Expected:** Detail page with model info, available units, add-to-cart button

#### TC-FE-05: Cart and Loan Submission
- **Steps:** Add items to cart → open cart sheet → submit loan request
- **Expected:** Loan created, cart cleared, confirmation shown

#### TC-FE-06: My Loans Page
- **Steps:** Navigate to `/my-loans`
- **Expected:** Table of the student's loan history with status badges

#### TC-FE-07: Admin Approval Queue
- **Steps:** Log in as admin → `/admin/approval-queue`
- **Expected:** List of pending loans, approve/reject buttons functional

#### TC-FE-08: Admin Active Loans
- **Steps:** Navigate to `/admin/active-loans`
- **Expected:** Active loans listed, checkout/return actions available

#### TC-FE-09: Admin Inventory
- **Steps:** Navigate to `/admin/inventory`
- **Expected:** Equipment models listed, add model/items, status update functional

#### TC-FE-10: Admin User Management
- **Steps:** Navigate to `/admin/users`
- **Expected:** User list, role update, suspend/unsuspend actions functional

#### TC-FE-11: Admin Incidents
- **Steps:** Navigate to `/admin/incidents`
- **Expected:** Penalty list, create and resolve actions functional

#### TC-FE-12: Route Guard — Unauthenticated Access
- **Steps:** Access `/dashboard` without login
- **Expected:** Redirect to `/login`

#### TC-FE-13: Route Guard — Student Access Admin Route
- **Steps:** Access `/admin/approval-queue` as student
- **Expected:** Redirect to `/dashboard`

---

### 3.7 MOBILE TEST CASES

#### TC-MOB-01: Login Screen Display
- **Steps:** Launch app on emulator
- **Expected:** Login screen shown (email, password, sign-in button)

#### TC-MOB-02: Mobile Login — Valid Credentials
- **Steps:** Enter valid credentials, tap Sign In
- **Expected:** Navigate to Dashboard screen

#### TC-MOB-03: Mobile Login — Invalid Credentials
- **Steps:** Enter wrong password, tap Sign In
- **Expected:** Error toast message shown

#### TC-MOB-04: Mobile Register
- **Steps:** Tap "Register", fill fields, tap Create Account
- **Expected:** Account created, navigate to Dashboard

#### TC-MOB-05: Mobile Logout
- **Steps:** Tap logout icon on Dashboard
- **Expected:** Session cleared, return to Login screen

#### TC-MOB-06: Session Persistence
- **Steps:** Login, close app, reopen
- **Expected:** Dashboard shown (auto-login with saved token)

#### TC-MOB-07: Mobile Profile Navigation
- **Steps:** Tap Profile nav item on Dashboard
- **Expected:** Navigate to Profile screen

---

## 4. Automated Test Cases (Build Verification)

### 4.1 Backend Compilation Test

| Test ID | Command | Expected Output | Category |
|---------|---------|----------------|----------|
| AUTO-BE-01 | `./mvnw compile` | `BUILD SUCCESS`, 66 source files | Smoke |
| AUTO-BE-02 | `./mvnw compile` | Zero compilation errors | Regression |

### 4.2 Frontend Build Test

| Test ID | Command | Expected Output | Category |
|---------|---------|----------------|----------|
| AUTO-FE-01 | `npm run build` | `✓ built in Xs` | Smoke |
| AUTO-FE-02 | `npm run build` | Zero build errors | Regression |

### 4.3 Mobile Build Test

| Test ID | Command | Expected Output | Category |
|---------|---------|----------------|----------|
| AUTO-MOB-01 | `gradlew assembleDebug` | `BUILD SUCCESSFUL` | Smoke |
| AUTO-MOB-02 | `gradlew assembleDebug` | APK generated, zero errors | Regression |

---

## 5. Pass/Fail Criteria

### Pass Criteria
- HTTP response codes match expected (200/201 for success, 400/401/403/404 for error cases)
- Response body contains `"success": true` for successful operations
- Response body contains `"success": false` with error details for failures
- UI renders correct components without console errors
- Navigation redirects work as expected per route guard logic
- Build commands complete with zero errors

### Fail Criteria
- Any unexpected HTTP 500 response
- Missing or incorrect fields in API response body
- UI page fails to render or shows blank screen
- Navigation guard fails to redirect appropriately
- Build command exits with error code and compilation failures
- Any feature present before refactoring that no longer functions after refactoring

---

*End of Part 3 — Software Test Plan*
