#!/usr/bin/env python3
"""
DocLevel Backend API Testing Suite
Tests all backend endpoints thoroughly with real-world scenarios
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://doclevel-preview.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_EMAIL = "admin@doclevel.com"
ADMIN_PASSWORD = "admin123"

class DocLevelAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        self.created_course_id = None
        
    def log_result(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "PASS" if passed else "FAIL"
        result = f"[{status}] {test_name}"
        if details:
            result += f" - {details}"
        print(result)
        self.test_results.append({
            'test': test_name,
            'passed': passed,
            'details': details
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None, expect_status: int = 200) -> tuple:
        """Make HTTP request and return (success, response, status_code)"""
        url = f"{API_BASE}{endpoint}"
        req_headers = headers or {}
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=req_headers)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=req_headers)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=req_headers)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=req_headers)
            else:
                return False, None, 0
                
            success = response.status_code == expect_status
            return success, response, response.status_code
            
        except Exception as e:
            print(f"Request error: {e}")
            return False, None, 0
    
    def test_seed_endpoint(self):
        """Test POST /api/seed - Should be idempotent"""
        print("\n=== Testing Seed Endpoint ===")
        
        # First seed call
        success, response, status = self.make_request('POST', '/seed')
        if success and response:
            try:
                data = response.json()
                if data.get('seeded') == True:
                    self.log_result("POST /api/seed - First call", True, "Returns {seeded: true}")
                else:
                    self.log_result("POST /api/seed - First call", False, f"Unexpected response: {data}")
            except:
                self.log_result("POST /api/seed - First call", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/seed - First call", False, f"Status: {status}")
            
        # Second seed call (should be idempotent)
        success, response, status = self.make_request('POST', '/seed')
        if success and response:
            try:
                data = response.json()
                if data.get('seeded') == True:
                    self.log_result("POST /api/seed - Idempotent call", True, "Still returns {seeded: true}")
                else:
                    self.log_result("POST /api/seed - Idempotent call", False, f"Unexpected response: {data}")
            except:
                self.log_result("POST /api/seed - Idempotent call", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/seed - Idempotent call", False, f"Status: {status}")
    
    def test_auth_login(self):
        """Test POST /api/auth/login"""
        print("\n=== Testing Auth Login ===")
        
        # Valid credentials
        login_data = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        success, response, status = self.make_request('POST', '/auth/login', login_data)
        
        if success and response:
            try:
                data = response.json()
                if 'token' in data and 'user' in data:
                    self.admin_token = data['token']
                    user = data['user']
                    if user.get('email') == ADMIN_EMAIL and user.get('role') == 'admin':
                        self.log_result("POST /api/auth/login - Valid credentials", True, 
                                      f"Returns JWT token and user info")
                    else:
                        self.log_result("POST /api/auth/login - Valid credentials", False, 
                                      f"Invalid user data: {user}")
                else:
                    self.log_result("POST /api/auth/login - Valid credentials", False, 
                                  f"Missing token or user: {data}")
            except:
                self.log_result("POST /api/auth/login - Valid credentials", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/auth/login - Valid credentials", False, f"Status: {status}")
        
        # Invalid password
        invalid_data = {"email": ADMIN_EMAIL, "password": "wrongpassword"}
        success, response, status = self.make_request('POST', '/auth/login', invalid_data, expect_status=401)
        
        if success and response:
            try:
                data = response.json()
                if data.get('error') == 'Credenciales inválidas':
                    self.log_result("POST /api/auth/login - Invalid password", True, "Returns 401 with correct error")
                else:
                    self.log_result("POST /api/auth/login - Invalid password", False, f"Wrong error: {data}")
            except:
                self.log_result("POST /api/auth/login - Invalid password", False, "Invalid JSON response")
        else:
            # Status code was correct (401) but response handling failed
            if status == 401:
                self.log_result("POST /api/auth/login - Invalid password", True, "Returns 401 as expected")
            else:
                self.log_result("POST /api/auth/login - Invalid password", False, f"Status: {status}")
        
        # Missing fields
        missing_data = {"email": ADMIN_EMAIL}
        success, response, status = self.make_request('POST', '/auth/login', missing_data, expect_status=400)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("POST /api/auth/login - Missing fields", True, "Returns 400 with error")
                else:
                    self.log_result("POST /api/auth/login - Missing fields", False, f"No error field: {data}")
            except:
                self.log_result("POST /api/auth/login - Missing fields", False, "Invalid JSON response")
        else:
            # Status code was correct (400) but response handling failed
            if status == 400:
                self.log_result("POST /api/auth/login - Missing fields", True, "Returns 400 as expected")
            else:
                self.log_result("POST /api/auth/login - Missing fields", False, f"Status: {status}")
    
    def test_auth_me(self):
        """Test GET /api/auth/me"""
        print("\n=== Testing Auth Me ===")
        
        if not self.admin_token:
            self.log_result("GET /api/auth/me - With token", False, "No admin token available")
            self.log_result("GET /api/auth/me - Without token", False, "Skipped due to missing token")
            return
        
        # With valid token
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        success, response, status = self.make_request('GET', '/auth/me', headers=headers)
        
        if success and response:
            try:
                data = response.json()
                user = data.get('user', {})
                if user.get('email') == ADMIN_EMAIL and user.get('role') == 'admin':
                    self.log_result("GET /api/auth/me - With token", True, "Returns user info")
                else:
                    self.log_result("GET /api/auth/me - With token", False, f"Invalid user: {user}")
            except:
                self.log_result("GET /api/auth/me - With token", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/auth/me - With token", False, f"Status: {status}")
        
        # Without token
        success, response, status = self.make_request('GET', '/auth/me', expect_status=401)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("GET /api/auth/me - Without token", True, "Returns 401 with error")
                else:
                    self.log_result("GET /api/auth/me - Without token", False, f"No error field: {data}")
            except:
                self.log_result("GET /api/auth/me - Without token", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/auth/me - Without token", False, f"Status: {status}")
    
    def test_courses_listing(self):
        """Test GET /api/courses with filtering"""
        print("\n=== Testing Courses Listing ===")
        
        # Basic listing
        success, response, status = self.make_request('GET', '/courses')
        
        if success and response:
            try:
                data = response.json()
                courses = data.get('courses', [])
                if isinstance(courses, list) and len(courses) >= 10:
                    self.log_result("GET /api/courses - Basic listing", True, 
                                  f"Returns {len(courses)} courses")
                    
                    # Check for expected categories
                    categories = set(course.get('category') for course in courses)
                    expected_cats = {'Contabilidad', 'Fiscal', 'Innovación', 'Marketing', 'Tecnología'}
                    if expected_cats.issubset(categories):
                        self.log_result("GET /api/courses - Expected categories", True, 
                                      f"Found categories: {sorted(categories)}")
                    else:
                        self.log_result("GET /api/courses - Expected categories", False, 
                                      f"Missing categories. Found: {sorted(categories)}")
                else:
                    self.log_result("GET /api/courses - Basic listing", False, 
                                  f"Expected ~10 courses, got {len(courses) if isinstance(courses, list) else 'invalid'}")
            except:
                self.log_result("GET /api/courses - Basic listing", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/courses - Basic listing", False, f"Status: {status}")
        
        # Search filtering
        success, response, status = self.make_request('GET', '/courses?search=fiscal')
        
        if success and response:
            try:
                data = response.json()
                courses = data.get('courses', [])
                if isinstance(courses, list):
                    # Check if results contain "fiscal" in title, description, or category
                    fiscal_found = any(
                        'fiscal' in course.get('title', '').lower() or 
                        'fiscal' in course.get('description', '').lower() or 
                        'fiscal' in course.get('category', '').lower()
                        for course in courses
                    )
                    if fiscal_found:
                        self.log_result("GET /api/courses - Search filter", True, 
                                      f"Found {len(courses)} courses with 'fiscal'")
                    else:
                        self.log_result("GET /api/courses - Search filter", False, 
                                      "No courses contain 'fiscal' in search results")
                else:
                    self.log_result("GET /api/courses - Search filter", False, "Invalid courses array")
            except:
                self.log_result("GET /api/courses - Search filter", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/courses - Search filter", False, f"Status: {status}")
        
        # Category filtering
        success, response, status = self.make_request('GET', '/courses?category=Fiscal')
        
        if success and response:
            try:
                data = response.json()
                courses = data.get('courses', [])
                if isinstance(courses, list):
                    all_fiscal = all(course.get('category') == 'Fiscal' for course in courses)
                    if all_fiscal and len(courses) > 0:
                        self.log_result("GET /api/courses - Category filter", True, 
                                      f"Found {len(courses)} Fiscal courses")
                    else:
                        self.log_result("GET /api/courses - Category filter", False, 
                                      f"Category filter failed. Courses: {len(courses)}, All Fiscal: {all_fiscal}")
                else:
                    self.log_result("GET /api/courses - Category filter", False, "Invalid courses array")
            except:
                self.log_result("GET /api/courses - Category filter", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/courses - Category filter", False, f"Status: {status}")
        
        # Combined search + category
        success, response, status = self.make_request('GET', '/courses?search=impuestos&category=Fiscal')
        
        if success and response:
            try:
                data = response.json()
                courses = data.get('courses', [])
                if isinstance(courses, list):
                    self.log_result("GET /api/courses - Combined filters", True, 
                                  f"Combined search+category returned {len(courses)} courses")
                else:
                    self.log_result("GET /api/courses - Combined filters", False, "Invalid courses array")
            except:
                self.log_result("GET /api/courses - Combined filters", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/courses - Combined filters", False, f"Status: {status}")
    
    def test_course_detail(self):
        """Test GET /api/courses/:id"""
        print("\n=== Testing Course Detail ===")
        
        # First get a valid course ID
        success, response, status = self.make_request('GET', '/courses')
        valid_course_id = None
        
        if success and response:
            try:
                data = response.json()
                courses = data.get('courses', [])
                if courses:
                    valid_course_id = courses[0].get('id')
            except:
                pass
        
        if valid_course_id:
            # Valid course ID
            success, response, status = self.make_request('GET', f'/courses/{valid_course_id}')
            
            if success and response:
                try:
                    data = response.json()
                    course = data.get('course')
                    if course and course.get('id') == valid_course_id:
                        self.log_result("GET /api/courses/:id - Valid ID", True, 
                                      f"Returns course: {course.get('title', 'Unknown')}")
                    else:
                        self.log_result("GET /api/courses/:id - Valid ID", False, 
                                      f"Invalid course data: {course}")
                except:
                    self.log_result("GET /api/courses/:id - Valid ID", False, "Invalid JSON response")
            else:
                self.log_result("GET /api/courses/:id - Valid ID", False, f"Status: {status}")
        else:
            self.log_result("GET /api/courses/:id - Valid ID", False, "No valid course ID found")
        
        # Invalid course ID
        fake_id = "fake-course-id-12345"
        success, response, status = self.make_request('GET', f'/courses/{fake_id}', expect_status=404)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("GET /api/courses/:id - Invalid ID", True, "Returns 404 with error")
                else:
                    self.log_result("GET /api/courses/:id - Invalid ID", False, f"No error field: {data}")
            except:
                self.log_result("GET /api/courses/:id - Invalid ID", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/courses/:id - Invalid ID", False, f"Status: {status}")
    
    def test_categories(self):
        """Test GET /api/categories"""
        print("\n=== Testing Categories ===")
        
        success, response, status = self.make_request('GET', '/categories')
        
        if success and response:
            try:
                data = response.json()
                categories = data.get('categories', [])
                expected_cats = {'Contabilidad', 'Fiscal', 'Innovación', 'Marketing', 'Tecnología'}
                
                if isinstance(categories, list) and len(categories) >= 5:
                    found_cats = set(categories)
                    if expected_cats.issubset(found_cats):
                        # Check if sorted
                        is_sorted = categories == sorted(categories)
                        self.log_result("GET /api/categories", True, 
                                      f"Returns {len(categories)} sorted categories: {categories}")
                        if not is_sorted:
                            self.log_result("GET /api/categories - Sorting", False, "Categories not sorted")
                    else:
                        self.log_result("GET /api/categories", False, 
                                      f"Missing expected categories. Found: {found_cats}")
                else:
                    self.log_result("GET /api/categories", False, 
                                  f"Expected >=5 categories, got {len(categories) if isinstance(categories, list) else 'invalid'}")
            except:
                self.log_result("GET /api/categories", False, "Invalid JSON response")
        else:
            self.log_result("GET /api/categories", False, f"Status: {status}")
    
    def test_course_crud(self):
        """Test POST/PUT/DELETE /api/courses (admin protected)"""
        print("\n=== Testing Course CRUD ===")
        
        if not self.admin_token:
            self.log_result("Course CRUD tests", False, "No admin token available")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test POST without token
        course_data = {
            "title": "Curso de Prueba",
            "description": "Descripción del curso de prueba",
            "category": "Tecnología",
            "video_url": "https://www.youtube.com/watch?v=test123",
            "banner_url": "https://images.unsplash.com/photo-test",
            "content": "Contenido del curso"
        }
        
        success, response, status = self.make_request('POST', '/courses', course_data, expect_status=401)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("POST /api/courses - Without token", True, "Returns 401 with error")
                else:
                    self.log_result("POST /api/courses - Without token", False, f"No error field: {data}")
            except:
                self.log_result("POST /api/courses - Without token", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/courses - Without token", False, f"Status: {status}")
        
        # Test POST with token and all required fields
        success, response, status = self.make_request('POST', '/courses', course_data, headers, expect_status=201)
        
        if success and response:
            try:
                data = response.json()
                course = data.get('course')
                if course and course.get('title') == course_data['title']:
                    self.created_course_id = course.get('id')
                    self.log_result("POST /api/courses - With token", True, 
                                  f"Created course with ID: {self.created_course_id}")
                else:
                    self.log_result("POST /api/courses - With token", False, f"Invalid course: {course}")
            except:
                self.log_result("POST /api/courses - With token", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/courses - With token", False, f"Status: {status}")
        
        # Test POST with missing fields
        incomplete_data = {"title": "Incomplete Course"}
        success, response, status = self.make_request('POST', '/courses', incomplete_data, headers, expect_status=400)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("POST /api/courses - Missing fields", True, "Returns 400 with error")
                else:
                    self.log_result("POST /api/courses - Missing fields", False, f"No error field: {data}")
            except:
                self.log_result("POST /api/courses - Missing fields", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/courses - Missing fields", False, f"Status: {status}")
        
        # Test PUT without token
        if self.created_course_id:
            update_data = {"title": "Título Actualizado"}
            success, response, status = self.make_request('PUT', f'/courses/{self.created_course_id}', 
                                                        update_data, expect_status=401)
            
            if success and response:
                try:
                    data = response.json()
                    if 'error' in data:
                        self.log_result("PUT /api/courses/:id - Without token", True, "Returns 401 with error")
                    else:
                        self.log_result("PUT /api/courses/:id - Without token", False, f"No error field: {data}")
                except:
                    self.log_result("PUT /api/courses/:id - Without token", False, "Invalid JSON response")
            else:
                self.log_result("PUT /api/courses/:id - Without token", False, f"Status: {status}")
            
            # Test PUT with token
            success, response, status = self.make_request('PUT', f'/courses/{self.created_course_id}', 
                                                        update_data, headers)
            
            if success and response:
                try:
                    data = response.json()
                    course = data.get('course')
                    if course and course.get('title') == update_data['title']:
                        self.log_result("PUT /api/courses/:id - With token", True, "Updated course successfully")
                    else:
                        self.log_result("PUT /api/courses/:id - With token", False, f"Update failed: {course}")
                except:
                    self.log_result("PUT /api/courses/:id - With token", False, "Invalid JSON response")
            else:
                self.log_result("PUT /api/courses/:id - With token", False, f"Status: {status}")
            
            # Test PUT with non-existent ID
            fake_id = "fake-course-id-12345"
            success, response, status = self.make_request('PUT', f'/courses/{fake_id}', 
                                                        update_data, headers, expect_status=404)
            
            if success and response:
                try:
                    data = response.json()
                    if 'error' in data:
                        self.log_result("PUT /api/courses/:id - Non-existent ID", True, "Returns 404 with error")
                    else:
                        self.log_result("PUT /api/courses/:id - Non-existent ID", False, f"No error field: {data}")
                except:
                    self.log_result("PUT /api/courses/:id - Non-existent ID", False, "Invalid JSON response")
            else:
                self.log_result("PUT /api/courses/:id - Non-existent ID", False, f"Status: {status}")
        
        # Test DELETE without token
        if self.created_course_id:
            success, response, status = self.make_request('DELETE', f'/courses/{self.created_course_id}', 
                                                        expect_status=401)
            
            if success and response:
                try:
                    data = response.json()
                    if 'error' in data:
                        self.log_result("DELETE /api/courses/:id - Without token", True, "Returns 401 with error")
                    else:
                        self.log_result("DELETE /api/courses/:id - Without token", False, f"No error field: {data}")
                except:
                    self.log_result("DELETE /api/courses/:id - Without token", False, "Invalid JSON response")
            else:
                self.log_result("DELETE /api/courses/:id - Without token", False, f"Status: {status}")
            
            # Test DELETE with token
            success, response, status = self.make_request('DELETE', f'/courses/{self.created_course_id}', 
                                                        headers=headers)
            
            if success and response:
                try:
                    data = response.json()
                    if data.get('success') == True:
                        self.log_result("DELETE /api/courses/:id - With token", True, "Deleted course successfully")
                        
                        # Test second DELETE on same ID (should return 404)
                        success2, response2, status2 = self.make_request('DELETE', f'/courses/{self.created_course_id}', 
                                                                       headers=headers, expect_status=404)
                        
                        if success2 and response2:
                            try:
                                data2 = response2.json()
                                if 'error' in data2:
                                    self.log_result("DELETE /api/courses/:id - Second delete", True, 
                                                  "Returns 404 on second delete")
                                else:
                                    self.log_result("DELETE /api/courses/:id - Second delete", False, 
                                                  f"No error field: {data2}")
                            except:
                                self.log_result("DELETE /api/courses/:id - Second delete", False, 
                                              "Invalid JSON response")
                        else:
                            self.log_result("DELETE /api/courses/:id - Second delete", False, f"Status: {status2}")
                    else:
                        self.log_result("DELETE /api/courses/:id - With token", False, f"Delete failed: {data}")
                except:
                    self.log_result("DELETE /api/courses/:id - With token", False, "Invalid JSON response")
            else:
                self.log_result("DELETE /api/courses/:id - With token", False, f"Status: {status}")
    
    def test_contact_form(self):
        """Test POST /api/contact"""
        print("\n=== Testing Contact Form ===")
        
        # Valid contact submission
        contact_data = {
            "name": "Juan Pérez",
            "email": "juan.perez@example.com",
            "message": "Estoy interesado en sus cursos de contabilidad. ¿Podrían enviarme más información?"
        }
        
        success, response, status = self.make_request('POST', '/contact', contact_data)
        
        if success and response:
            try:
                data = response.json()
                if data.get('success') == True and 'id' in data:
                    self.log_result("POST /api/contact - Valid data", True, 
                                  f"Contact saved with ID: {data['id']}")
                else:
                    self.log_result("POST /api/contact - Valid data", False, f"Invalid response: {data}")
            except:
                self.log_result("POST /api/contact - Valid data", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/contact - Valid data", False, f"Status: {status}")
        
        # Missing fields
        incomplete_data = {"name": "Juan Pérez", "email": "juan.perez@example.com"}
        success, response, status = self.make_request('POST', '/contact', incomplete_data, expect_status=400)
        
        if success and response:
            try:
                data = response.json()
                if 'error' in data:
                    self.log_result("POST /api/contact - Missing fields", True, "Returns 400 with error")
                else:
                    self.log_result("POST /api/contact - Missing fields", False, f"No error field: {data}")
            except:
                self.log_result("POST /api/contact - Missing fields", False, "Invalid JSON response")
        else:
            self.log_result("POST /api/contact - Missing fields", False, f"Status: {status}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting DocLevel Backend API Tests")
        print(f"Base URL: {BASE_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Run tests in order
        self.test_seed_endpoint()
        self.test_auth_login()
        self.test_auth_me()
        self.test_courses_listing()
        self.test_course_detail()
        self.test_categories()
        self.test_course_crud()
        self.test_contact_form()
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['passed'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if result['passed']:
                print(f"  - {result['test']}")
        
        return passed == total

if __name__ == "__main__":
    tester = DocLevelAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)