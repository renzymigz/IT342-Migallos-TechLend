# Part 4 — Full Regression Testing

**Project:** TechLend — Equipment Lending Management System  
**Branch:** `refactor/vertical-slice-architecture`  
**Tested by:** Group [No.] | IT342  
**Test Execution Date:** May 6, 2026  
**Environment:** Local development (Backend: localhost:8080, Frontend: localhost:5173)

---

## 1. Regression Testing Objective

The purpose of this regression test is to validate that the migration from a **layered architecture** to a **Vertical Slice Architecture (VSA)** did not introduce any regressions, break any existing functionality, or alter any API contracts. All features that were working before the refactor must continue to work after it.

---

## 2. Pre-Test Verification — Build Status

Before running functional tests, all three layers were compiled/built to confirm structural integrity.

### 2.1 Backend Build Verification

**Command:** `./mvnw compile`

```
[INFO] --- compiler:3.14.1:compile (default-compile) @ techlend ---
[INFO] Recompiling the module because of added or removed source files.
[INFO] Compiling 66 source files with javac [debug parameters release 17] to target\classes
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.840 s
[INFO] Finished at: 2026-05-06T12:17:45+08:00
```

**Result:** ✅ PASS — 66 source files, zero compilation errors

---

### 2.2 Frontend Build Verification

**Command:** `npm run build` (Vite)

```
vite v7.3.2 building client environment for production...
transforming...
✓ 1955 modules transformed.
dist/assets/index-DGwajDTS.css    79.24 kB │ gzip:  13.07 kB
dist/assets/index-Brtxsu5Y.js    521.11 kB │ gzip: 158.19 kB
✓ built in 7.27s
```

**Result:** ✅ PASS — Zero build errors. Chunk size warning is pre-existing and non-critical.

---

### 2.3 Mobile Build Verification

**Command:** `gradlew assembleDebug`

```
> Task :app:compileDebugKotlin
> Task :app:compileDebugJavaWithJavac
> Task :app:dexBuilderDebug
> Task :app:packageDebug
> Task :app:assembleDebug

BUILD SUCCESSFUL in 2m
34 actionable tasks: 13 executed, 21 up-to-date
```

**Result:** ✅ PASS — APK generated successfully. Java 8 source warnings are pre-existing, non-blocking.

---

## 3. Regression Test Execution Results

### 3.1 AUTH MODULE

| TC-ID | Test Case | Method | Endpoint | Expected | Actual | Status | Notes |
|-------|-----------|--------|----------|----------|--------|--------|-------|
| TC-AUTH-01 | Register new user | POST | `/api/v1/auth/register` | 200, tokens returned | 200, tokens returned | ✅ PASS | |
| TC-AUTH-02 | Register duplicate email | POST | `/api/v1/auth/register` | 400, error | 400, error message | ✅ PASS | |
| TC-AUTH-03 | Login valid credentials | POST | `/api/v1/auth/login` | 200, tokens | 200, tokens | ✅ PASS | |
| TC-AUTH-04 | Login invalid password | POST | `/api/v1/auth/login` | 401, error | 401, error | ✅ PASS | |
| TC-AUTH-05 | Logout + blacklist | POST | `/api/v1/auth/logout` | Token invalidated | Token invalidated | ✅ PASS | |
| TC-AUTH-06 | No token on protected route | GET | `/api/v1/users/me` | 401 | 401 | ✅ PASS | |
| TC-AUTH-07 | Student access admin route | GET | `/api/v1/admin/loans/pending` | 403 | 403 | ✅ PASS | |

**Module Result: 7/7 PASS ✅**

---

### 3.2 USER MODULE

| TC-ID | Test Case | Method | Endpoint | Expected | Actual | Status | Notes |
|-------|-----------|--------|----------|----------|--------|--------|-------|
| TC-USER-01 | Get own profile | GET | `/api/v1/users/me` | 200, profile data | 200, profile data | ✅ PASS | |
| TC-USER-02 | Admin list all users | GET | `/api/v1/users` | 200, user list | 200, user list | ✅ PASS | |
| TC-USER-03 | Admin update role | PUT | `/api/v1/users/{id}/role` | 200, role updated | 200, role updated | ✅ PASS | |
| TC-USER-04 | Admin suspend user | POST | `/api/v1/users/{id}/suspend` | 200, SUSPENDED | 200, SUSPENDED | ✅ PASS | |
| TC-USER-05 | Admin unsuspend user | POST | `/api/v1/users/{id}/unsuspend` | 200, ACTIVE | 200, ACTIVE | ✅ PASS | |

**Module Result: 5/5 PASS ✅**

---

### 3.3 EQUIPMENT MODULE

| TC-ID | Test Case | Method | Endpoint | Expected | Actual | Status | Notes |
|-------|-----------|--------|----------|----------|--------|--------|-------|
| TC-EQUIP-01 | Browse catalog | GET | `/api/v1/equipment-models/catalog-items` | 200, items list | 200, items list | ✅ PASS | |
| TC-EQUIP-02 | Item detail | GET | `/api/v1/equipment-models/catalog-items/{id}` | 200, detail | 200, detail | ✅ PASS | |
| TC-EQUIP-03 | Create model | POST | `/api/v1/admin/equipment-models` | 200, model | 200, model | ✅ PASS | |
| TC-EQUIP-04 | Add items | POST | `/api/v1/admin/equipment-models/{id}/items` | 200, items | 200, items | ✅ PASS | |
| TC-EQUIP-05 | Update item status | PATCH | `/api/v1/admin/equipment-models/items/{id}/status` | 200, updated | 200, updated | ✅ PASS | |
| TC-EQUIP-06 | Upload image | POST | `/api/v1/admin/equipment-models/{id}/upload-image` | 200, url | 200, Cloudinary url | ✅ PASS | |

**Module Result: 6/6 PASS ✅**

---

### 3.4 LOAN MODULE

| TC-ID | Test Case | Method | Endpoint | Expected | Actual | Status | Notes |
|-------|-----------|--------|----------|----------|--------|--------|-------|
| TC-LOAN-01 | Submit loan request | POST | `/api/v1/loans` | 201, PENDING | 201, PENDING | ✅ PASS | |
| TC-LOAN-02 | Get my loans | GET | `/api/v1/loans/mine` | 200, own loans | 200, own loans | ✅ PASS | ⚠ Fixed during regression (see Issue #1) |
| TC-LOAN-03 | Admin pending loans | GET | `/api/v1/admin/loans/pending` | 200, pending list | 200, pending list | ✅ PASS | |
| TC-LOAN-04 | Approve loan | PATCH | `/api/v1/admin/loans/{id}/decision` | 200, APPROVED | 200, APPROVED | ✅ PASS | ⚠ Fixed during regression (see Issue #2) |
| TC-LOAN-05 | Reject loan | PATCH | `/api/v1/admin/loans/{id}/decision` | 200, REJECTED | 200, REJECTED | ✅ PASS | |
| TC-LOAN-06 | Process checkout | PATCH | `/api/v1/admin/loans/{id}/checkout` | 200, ACTIVE | 200, ACTIVE | ✅ PASS | |
| TC-LOAN-07 | Process return | POST | `/api/v1/admin/loans/{id}/return` | 200, COMPLETED | 200, COMPLETED | ✅ PASS | |

**Module Result: 7/7 PASS ✅** (2 issues found and fixed — see Section 4)

---

### 3.5 PENALTY MODULE

| TC-ID | Test Case | Method | Endpoint | Expected | Actual | Status | Notes |
|-------|-----------|--------|----------|----------|--------|--------|-------|
| TC-PEN-01 | Get all penalties | GET | `/api/v1/incidents` | 200, list | 200, list | ✅ PASS | |
| TC-PEN-02 | Create penalty | POST | `/api/v1/incidents` | 201, created | 201, created | ✅ PASS | |
| TC-PEN-03 | Resolve penalty | PATCH | `/api/v1/incidents/{id}/resolve` | 200, RESOLVED | 200, RESOLVED | ✅ PASS | |

**Module Result: 3/3 PASS ✅**

---

### 3.6 FRONTEND UI MODULE

| TC-ID | Test Case | Screen/Route | Expected | Actual | Status |
|-------|-----------|-------------|----------|--------|--------|
| TC-FE-01 | Student login | `/login` | Redirect to `/dashboard` | Redirect to `/dashboard` | ✅ PASS |
| TC-FE-02 | Student register | `/register` | Account created, dashboard | Account created, dashboard | ✅ PASS |
| TC-FE-03 | Catalog display | `/dashboard` | Equipment cards rendered | Cards rendered | ✅ PASS |
| TC-FE-04 | Equipment detail | `/catalog/item/:id` | Detail page | Detail page | ✅ PASS |
| TC-FE-05 | Cart & loan submit | Cart sheet | Loan submitted, cart cleared | Loan submitted, cart cleared | ✅ PASS |
| TC-FE-06 | My Loans page | `/my-loans` | Loan history shown | Loan history shown | ✅ PASS |
| TC-FE-07 | Admin approval queue | `/admin/approval-queue` | Pending loans listed | Pending loans listed | ✅ PASS |
| TC-FE-08 | Admin active loans | `/admin/active-loans` | Active loans listed | Active loans listed | ✅ PASS |
| TC-FE-09 | Admin inventory | `/admin/inventory` | Equipment management | Equipment management | ✅ PASS |
| TC-FE-10 | Admin users | `/admin/users` | User management | User management | ✅ PASS |
| TC-FE-11 | Admin incidents | `/admin/incidents` | Incidents listed | Incidents listed | ✅ PASS |
| TC-FE-12 | Route guard (unauth) | `/dashboard` | Redirect to `/login` | Redirect to `/login` | ✅ PASS |
| TC-FE-13 | Route guard (student→admin) | `/admin/approval-queue` | Redirect to `/dashboard` | Redirect to `/dashboard` | ✅ PASS |

**Module Result: 13/13 PASS ✅**

---

### 3.7 MOBILE MODULE

| TC-ID | Test Case | Screen | Expected | Actual | Status |
|-------|-----------|--------|----------|--------|--------|
| TC-MOB-01 | Login screen display | LoginActivity | Login UI shown | Login UI shown | ✅ PASS |
| TC-MOB-02 | Mobile login valid | LoginActivity | Navigate to Dashboard | Navigate to Dashboard | ✅ PASS |
| TC-MOB-03 | Mobile login invalid | LoginActivity | Toast error shown | Toast error shown | ✅ PASS |
| TC-MOB-04 | Mobile register | RegisterActivity | Account created, Dashboard | Account created, Dashboard | ✅ PASS |
| TC-MOB-05 | Mobile logout | DashboardActivity | Return to Login | Return to Login | ✅ PASS |
| TC-MOB-06 | Session persistence | LoginActivity | Auto-login on reopen | Auto-login on reopen | ✅ PASS |
| TC-MOB-07 | Profile navigation | DashboardActivity | Navigate to Profile | Navigate to Profile | ✅ PASS |

**Module Result: 7/7 PASS ✅**

---

## 4. Issues Found During Regression Testing

### Issue #1 — My Loans Page Returns HTTP 500

| Field | Detail |
|-------|--------|
| **Issue ID** | REG-001 |
| **Severity** | High |
| **Affected TC** | TC-LOAN-02, TC-FE-06 |
| **Symptom** | `GET /api/v1/loans/mine` returned 500 Internal Server Error |
| **Root Cause** | During refactoring, the endpoint path was inadvertently renamed from `/mine` to `/my-loans` in `LoanController.java` |
| **Detected By** | Frontend console error: `GET http://localhost:5173/api/v1/loans/mine 500` |

**Fix Applied:**
```java
// BEFORE (incorrect after refactor):
@GetMapping("/my-loans")

// AFTER (restored to match frontend contract):
@GetMapping("/mine")
```

**File:** `features/loan/LoanController.java` line 40  
**Status:** ✅ Fixed and verified

---

### Issue #2 — Admin Loan Decision Returns HTTP 500

| Field | Detail |
|-------|--------|
| **Issue ID** | REG-002 |
| **Severity** | High |
| **Affected TC** | TC-LOAN-04, TC-LOAN-05, TC-FE-07 |
| **Symptom** | `PATCH /api/v1/admin/loans/{id}/decision` returned 500 |
| **Root Cause** | During refactoring, endpoint path renamed from `/decision` to `/decide` in `AdminLoanController.java` |
| **Detected By** | Browser network tab: `Failed to load resource: 500 (Internal Server Error)` |

**Fix Applied:**
```java
// BEFORE (incorrect after refactor):
@PatchMapping("/{transactionId}/decide")

// AFTER (restored):
@PatchMapping("/{transactionId}/decision")
```

**File:** `features/loan/AdminLoanController.java` line 52  
**Status:** ✅ Fixed and verified

---

## 5. Re-Test After Fixes

Both issues were fixed and the affected endpoints re-tested:

| Issue | TC-ID | Re-Test Result |
|-------|-------|---------------|
| REG-001 | TC-LOAN-02 | ✅ PASS — 200 returned, loans listed |
| REG-001 | TC-FE-06 | ✅ PASS — My Loans page renders correctly |
| REG-002 | TC-LOAN-04 | ✅ PASS — Loan APPROVED successfully |
| REG-002 | TC-LOAN-05 | ✅ PASS — Loan REJECTED successfully |
| REG-002 | TC-FE-07 | ✅ PASS — Approval queue functional |

---

## 6. Regression Testing Summary

| Module | Total TCs | Passed | Failed | Fixed | Final |
|--------|-----------|--------|--------|-------|-------|
| Auth | 7 | 7 | 0 | — | ✅ All Pass |
| User | 5 | 5 | 0 | — | ✅ All Pass |
| Equipment | 6 | 6 | 0 | — | ✅ All Pass |
| Loan | 7 | 5 | 2 | 2 | ✅ All Pass |
| Penalty | 3 | 3 | 0 | — | ✅ All Pass |
| Frontend UI | 13 | 11 | 2 | 2 | ✅ All Pass |
| Mobile | 7 | 7 | 0 | — | ✅ All Pass |
| **TOTAL** | **48** | **44** | **4** | **4** | **✅ 48/48 Pass** |

> All regressions identified during testing were successfully diagnosed, fixed, and verified. The system is stable and fully functional after the VSA refactoring.

---

*End of Part 4 — Full Regression Testing*
