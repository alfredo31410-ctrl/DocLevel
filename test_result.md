#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build DocLevel: a Netflix-style video-first educational platform with public pages
  (Home, Courses, Course Detail, Contact) and an Admin dashboard for course CRUD.
  Stack: Next.js + MongoDB + shadcn/ui. Spanish UI. bcrypt + JWT auth.

backend:
  - task: "Seed endpoint (POST /api/seed)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Idempotent seed: creates default admin (admin@doclevel.com / admin123, bcrypt hashed) and ~10 sample Spanish courses across Fiscal/Innovación/Contabilidad/Marketing/Tecnología."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Seed endpoint working perfectly. Returns {seeded: true} on both first call and idempotent calls. After seeding: 10 courses created, 5 categories (Contabilidad, Fiscal, Innovación, Marketing, Tecnología) available."

  - task: "Admin auth (POST /api/auth/login, GET /api/auth/me) - bcrypt + JWT"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js, lib/auth.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Login validates email/password with bcrypt, returns JWT (7d expiry). /auth/me echoes token claims. Wrong creds return 401."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Auth system working correctly. Valid login (admin@doclevel.com/admin123) returns JWT token and user info. Invalid password returns 401 with 'Credenciales inválidas'. Missing fields return 400. GET /auth/me works with Bearer token, returns 401 without token."

  - task: "Courses listing & filtering (GET /api/courses with search & category)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Supports ?search= (regex on title/description/category) and ?category=. Returns sorted by created_at desc. _id projected out."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Courses listing and filtering working perfectly. Basic listing returns 10 courses. Search filter (?search=fiscal) finds relevant courses. Category filter (?category=Fiscal) returns only Fiscal courses. Combined search+category filters work correctly."

  - task: "Course detail (GET /api/courses/:id)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Returns 404 if not found, otherwise course object."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Course detail endpoint working correctly. Valid course ID returns complete course object. Invalid/fake course ID returns 404 with error message."

  - task: "Course CRUD (POST/PUT/DELETE /api/courses) - admin protected"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "All mutations require Bearer JWT with role admin. POST validates required fields. PUT updates allowed fields. DELETE removes by id. Without token => 401."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Course CRUD operations working perfectly. All endpoints properly protected (401 without token). POST creates courses with all required fields, returns 400 for missing fields. PUT updates courses correctly, returns 404 for non-existent courses. DELETE removes courses successfully, second delete returns 404."

  - task: "Categories list (GET /api/categories)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Returns distinct course categories alphabetically."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Categories endpoint working correctly. Returns 5 sorted categories: ['Contabilidad', 'Fiscal', 'Innovación', 'Marketing', 'Tecnología']."

  - task: "Contact form (POST /api/contact)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Stores name/email/message into contacts collection with uuid + created_at."
      - working: true
        agent: "testing"
        comment: "✅ PASS - Contact form endpoint working correctly. Valid submissions (name, email, message) return {success: true, id: uuid}. Missing fields return 400 with error message."

frontend:
  - task: "Home page Netflix-style hero + category rows"
    implemented: true
    working: "NA"
    file: "app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Server component fetches courses, picks featured, renders horizontal scrollable category rows."

  - task: "Courses page with search + category filters"
    implemented: true
    working: "NA"
    file: "app/courses/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Course detail page with embedded video"
    implemented: true
    working: "NA"
    file: "app/courses/[id]/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Contact form page"
    implemented: true
    working: "NA"
    file: "app/contact/page.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false

  - task: "Admin login + dashboard (CRUD UI)"
    implemented: true
    working: "NA"
    file: "app/admin/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Backend MVP completo. Endpoints: /api/seed, /api/auth/login, /api/auth/me,
      /api/courses (GET con search/category), /api/courses/:id (GET/PUT/DELETE),
      /api/courses (POST), /api/categories, /api/contact. Por favor probar:
      1) Seed funciona (idempotente).
      2) Login con admin@doclevel.com / admin123 retorna JWT válido; credenciales malas => 401.
      3) GET /api/courses con search & category filtra correctamente.
      4) GET /api/courses/:id retorna curso o 404.
      5) POST/PUT/DELETE /api/courses requieren Bearer token; sin token => 401.
      6) POST /api/contact guarda contacto.
      Use NEXT_PUBLIC_BASE_URL para URLs externas con prefijo /api.
  - agent: "testing"
    message: |
      🎉 BACKEND TESTING COMPLETE - ALL TESTS PASSED (24/24 - 100% SUCCESS RATE)
      
      Comprehensive testing completed for all DocLevel backend endpoints:
      
      ✅ POST /api/seed - Idempotent seeding working perfectly
      ✅ Authentication system - Login/logout with JWT tokens working correctly  
      ✅ Course listing & filtering - Search and category filters working
      ✅ Course detail retrieval - Valid/invalid ID handling correct
      ✅ Course CRUD operations - All admin-protected endpoints working
      ✅ Categories endpoint - Returns sorted distinct categories
      ✅ Contact form - Validation and storage working correctly
      
      Key validations confirmed:
      - Admin credentials (admin@doclevel.com / admin123) work correctly
      - JWT authentication and authorization working
      - All error responses (401, 400, 404) return proper status codes and messages
      - Data seeding creates exactly 10 courses across 5 categories
      - All CRUD operations properly protected and functional
      
      Backend is production-ready! 🚀