#!/usr/bin/env python3
"""
DocLevel Backend API Testing Suite - Final Version
Tests all backend endpoints comprehensively
"""

import requests
import json
import sys

class DocLevelTester:
    def __init__(self):
        self.base_url = "https://doclevel-preview.preview.emergentagent.com"
        self.api_base = f"{self.base_url}/api"
        self.admin_email = "admin@doclevel.com"
        self.admin_password = "admin123"
        self.admin_token = None
        self.created_course_id = None
        self.results = []
    
    def test_endpoint(self, name, method, endpoint, data=None, headers=None, expected_status=200, check_func=None):
        """Test a single endpoint"""
        url = f"{self.api_base}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers or {})
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers or {})
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers or {})
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers or {})
            else:
                print(f"❌ {name}: Unsupported method {method}")
                return False
            
            # Check status code
            if response.status_code != expected_status:
                print(f"❌ {name}: Expected {expected_status}, got {response.status_code}")
                return False
            
            # Parse JSON response
            try:
                json_data = response.json()
            except:
                print(f"❌ {name}: Invalid JSON response")
                return False
            
            # Run custom check function if provided
            if check_func:
                result = check_func(json_data, response)
                if not result:
                    print(f"❌ {name}: Custom check failed")
                    return False
            
            print(f"✅ {name}")
            return True
            
        except Exception as e:
            print(f"❌ {name}: Exception - {e}")
            return False
    
    def run_tests(self):
        """Run all backend tests"""
        print("🚀 DocLevel Backend API Tests")
        print(f"Testing: {self.api_base}")
        print("=" * 50)
        
        # 1. Test seed endpoint
        self.results.append(self.test_endpoint(
            "POST /api/seed",
            "POST", "/seed",
            check_func=lambda data, resp: data.get('seeded') == True
        ))
        
        # Test seed idempotency
        self.results.append(self.test_endpoint(
            "POST /api/seed (idempotent)",
            "POST", "/seed",
            check_func=lambda data, resp: data.get('seeded') == True
        ))
        
        # 2. Test auth login - valid credentials
        def check_login(data, resp):
            if 'token' in data and 'user' in data:
                self.admin_token = data['token']
                user = data['user']
                return user.get('email') == self.admin_email and user.get('role') == 'admin'
            return False
        
        self.results.append(self.test_endpoint(
            "POST /api/auth/login (valid)",
            "POST", "/auth/login",
            data={"email": self.admin_email, "password": self.admin_password},
            check_func=check_login
        ))
        
        # Test auth login - invalid password
        self.results.append(self.test_endpoint(
            "POST /api/auth/login (invalid password)",
            "POST", "/auth/login",
            data={"email": self.admin_email, "password": "wrongpassword"},
            expected_status=401,
            check_func=lambda data, resp: data.get('error') == 'Credenciales inválidas'
        ))
        
        # Test auth login - missing fields
        self.results.append(self.test_endpoint(
            "POST /api/auth/login (missing fields)",
            "POST", "/auth/login",
            data={"email": self.admin_email},
            expected_status=400,
            check_func=lambda data, resp: 'error' in data
        ))
        
        # 3. Test auth/me with token
        if self.admin_token:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            self.results.append(self.test_endpoint(
                "GET /api/auth/me (with token)",
                "GET", "/auth/me",
                headers=headers,
                check_func=lambda data, resp: data.get('user', {}).get('email') == self.admin_email
            ))
        else:
            print("❌ GET /api/auth/me (with token): No admin token")
            self.results.append(False)
        
        # Test auth/me without token
        self.results.append(self.test_endpoint(
            "GET /api/auth/me (without token)",
            "GET", "/auth/me",
            expected_status=401,
            check_func=lambda data, resp: 'error' in data
        ))
        
        # 4. Test courses listing
        self.results.append(self.test_endpoint(
            "GET /api/courses",
            "GET", "/courses",
            check_func=lambda data, resp: isinstance(data.get('courses'), list) and len(data['courses']) >= 10
        ))
        
        # Test courses with search
        self.results.append(self.test_endpoint(
            "GET /api/courses?search=fiscal",
            "GET", "/courses?search=fiscal",
            check_func=lambda data, resp: isinstance(data.get('courses'), list) and len(data['courses']) > 0
        ))
        
        # Test courses with category filter
        self.results.append(self.test_endpoint(
            "GET /api/courses?category=Fiscal",
            "GET", "/courses?category=Fiscal",
            check_func=lambda data, resp: (
                isinstance(data.get('courses'), list) and 
                all(course.get('category') == 'Fiscal' for course in data['courses'])
            )
        ))
        
        # 5. Test course detail - get a valid course ID first
        valid_course_id = None
        try:
            response = requests.get(f"{self.api_base}/courses")
            if response.status_code == 200:
                courses = response.json().get('courses', [])
                if courses:
                    valid_course_id = courses[0].get('id')
        except:
            pass
        
        if valid_course_id:
            self.results.append(self.test_endpoint(
                "GET /api/courses/:id (valid)",
                "GET", f"/courses/{valid_course_id}",
                check_func=lambda data, resp: data.get('course', {}).get('id') == valid_course_id
            ))
        else:
            print("❌ GET /api/courses/:id (valid): No valid course ID found")
            self.results.append(False)
        
        # Test course detail with invalid ID
        self.results.append(self.test_endpoint(
            "GET /api/courses/:id (invalid)",
            "GET", "/courses/fake-course-id-12345",
            expected_status=404,
            check_func=lambda data, resp: 'error' in data
        ))
        
        # 6. Test categories
        self.results.append(self.test_endpoint(
            "GET /api/categories",
            "GET", "/categories",
            check_func=lambda data, resp: (
                isinstance(data.get('categories'), list) and 
                len(data['categories']) >= 5 and
                'Contabilidad' in data['categories'] and
                'Fiscal' in data['categories']
            )
        ))
        
        # 7. Test course CRUD operations
        if self.admin_token:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test POST without token
            self.results.append(self.test_endpoint(
                "POST /api/courses (without token)",
                "POST", "/courses",
                data={
                    "title": "Test Course",
                    "description": "Test Description",
                    "category": "Tecnología",
                    "video_url": "https://www.youtube.com/watch?v=test",
                    "banner_url": "https://images.unsplash.com/photo-test"
                },
                expected_status=401,
                check_func=lambda data, resp: 'error' in data
            ))
            
            # Test POST with token
            def check_course_creation(data, resp):
                course = data.get('course')
                if course and course.get('title') == "Test Course":
                    self.created_course_id = course.get('id')
                    return True
                return False
            
            self.results.append(self.test_endpoint(
                "POST /api/courses (with token)",
                "POST", "/courses",
                data={
                    "title": "Test Course",
                    "description": "Test Description",
                    "category": "Tecnología",
                    "video_url": "https://www.youtube.com/watch?v=test",
                    "banner_url": "https://images.unsplash.com/photo-test"
                },
                headers=headers,
                expected_status=201,
                check_func=check_course_creation
            ))
            
            # Test POST with missing fields
            self.results.append(self.test_endpoint(
                "POST /api/courses (missing fields)",
                "POST", "/courses",
                data={"title": "Incomplete Course"},
                headers=headers,
                expected_status=400,
                check_func=lambda data, resp: 'error' in data
            ))
            
            # Test PUT operations
            if self.created_course_id:
                # PUT without token
                self.results.append(self.test_endpoint(
                    "PUT /api/courses/:id (without token)",
                    "PUT", f"/courses/{self.created_course_id}",
                    data={"title": "Updated Title"},
                    expected_status=401,
                    check_func=lambda data, resp: 'error' in data
                ))
                
                # PUT with token
                self.results.append(self.test_endpoint(
                    "PUT /api/courses/:id (with token)",
                    "PUT", f"/courses/{self.created_course_id}",
                    data={"title": "Updated Title"},
                    headers=headers,
                    check_func=lambda data, resp: data.get('course', {}).get('title') == "Updated Title"
                ))
                
                # PUT non-existent course
                self.results.append(self.test_endpoint(
                    "PUT /api/courses/:id (non-existent)",
                    "PUT", "/courses/fake-course-id-12345",
                    data={"title": "Updated Title"},
                    headers=headers,
                    expected_status=404,
                    check_func=lambda data, resp: 'error' in data
                ))
                
                # DELETE without token
                self.results.append(self.test_endpoint(
                    "DELETE /api/courses/:id (without token)",
                    "DELETE", f"/courses/{self.created_course_id}",
                    expected_status=401,
                    check_func=lambda data, resp: 'error' in data
                ))
                
                # DELETE with token
                self.results.append(self.test_endpoint(
                    "DELETE /api/courses/:id (with token)",
                    "DELETE", f"/courses/{self.created_course_id}",
                    headers=headers,
                    check_func=lambda data, resp: data.get('success') == True
                ))
                
                # DELETE same course again (should return 404)
                self.results.append(self.test_endpoint(
                    "DELETE /api/courses/:id (second delete)",
                    "DELETE", f"/courses/{self.created_course_id}",
                    headers=headers,
                    expected_status=404,
                    check_func=lambda data, resp: 'error' in data
                ))
            else:
                print("❌ Course CRUD tests: No created course ID")
                self.results.extend([False, False, False, False, False, False])
        else:
            print("❌ Course CRUD tests: No admin token")
            self.results.extend([False, False, False, False, False, False, False, False])
        
        # 8. Test contact form
        self.results.append(self.test_endpoint(
            "POST /api/contact (valid)",
            "POST", "/contact",
            data={
                "name": "Juan Pérez",
                "email": "juan.perez@example.com",
                "message": "Mensaje de prueba"
            },
            check_func=lambda data, resp: data.get('success') == True and 'id' in data
        ))
        
        # Test contact with missing fields
        self.results.append(self.test_endpoint(
            "POST /api/contact (missing fields)",
            "POST", "/contact",
            data={"name": "Juan Pérez", "email": "juan.perez@example.com"},
            expected_status=400,
            check_func=lambda data, resp: 'error' in data
        ))
        
        # Summary
        print("\n" + "=" * 50)
        print("🏁 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(self.results)
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        return passed == total

def main():
    tester = DocLevelTester()
    success = tester.run_tests()
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)