#!/usr/bin/env python3
"""
DocLevel Backend API Testing Suite - Simplified
Tests all backend endpoints with proper error handling
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://doclevel-preview.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_EMAIL = "admin@doclevel.com"
ADMIN_PASSWORD = "admin123"

def test_endpoint(name, method, endpoint, data=None, headers=None, expected_status=200, check_func=None):
    """Test a single endpoint"""
    url = f"{API_BASE}{endpoint}"
    
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

def main():
    """Run all backend tests"""
    print("🚀 DocLevel Backend API Tests")
    print(f"Testing: {API_BASE}")
    print("=" * 50)
    
    results = []
    admin_token = None
    created_course_id = None
    
    # 1. Test seed endpoint
    results.append(test_endpoint(
        "POST /api/seed",
        "POST", "/seed",
        check_func=lambda data, resp: data.get('seeded') == True
    ))
    
    # Test seed idempotency
    results.append(test_endpoint(
        "POST /api/seed (idempotent)",
        "POST", "/seed",
        check_func=lambda data, resp: data.get('seeded') == True
    ))
    
    # 2. Test auth login - valid credentials
    def check_login(data, resp):
        global admin_token
        if 'token' in data and 'user' in data:
            admin_token = data['token']
            user = data['user']
            return user.get('email') == ADMIN_EMAIL and user.get('role') == 'admin'
        return False
    
    results.append(test_endpoint(
        "POST /api/auth/login (valid)",
        "POST", "/auth/login",
        data={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        check_func=check_login
    ))
    
    # Test auth login - invalid password
    results.append(test_endpoint(
        "POST /api/auth/login (invalid password)",
        "POST", "/auth/login",
        data={"email": ADMIN_EMAIL, "password": "wrongpassword"},
        expected_status=401,
        check_func=lambda data, resp: data.get('error') == 'Credenciales inválidas'
    ))
    
    # Test auth login - missing fields
    results.append(test_endpoint(
        "POST /api/auth/login (missing fields)",
        "POST", "/auth/login",
        data={"email": ADMIN_EMAIL},
        expected_status=400,
        check_func=lambda data, resp: 'error' in data
    ))
    
    # 3. Test auth/me with token
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        results.append(test_endpoint(
            "GET /api/auth/me (with token)",
            "GET", "/auth/me",
            headers=headers,
            check_func=lambda data, resp: data.get('user', {}).get('email') == ADMIN_EMAIL
        ))
    else:
        print("❌ GET /api/auth/me (with token): No admin token")
        results.append(False)
    
    # Test auth/me without token
    results.append(test_endpoint(
        "GET /api/auth/me (without token)",
        "GET", "/auth/me",
        expected_status=401,
        check_func=lambda data, resp: 'error' in data
    ))
    
    # 4. Test courses listing
    results.append(test_endpoint(
        "GET /api/courses",
        "GET", "/courses",
        check_func=lambda data, resp: isinstance(data.get('courses'), list) and len(data['courses']) >= 10
    ))
    
    # Test courses with search
    results.append(test_endpoint(
        "GET /api/courses?search=fiscal",
        "GET", "/courses?search=fiscal",
        check_func=lambda data, resp: isinstance(data.get('courses'), list) and len(data['courses']) > 0
    ))
    
    # Test courses with category filter
    results.append(test_endpoint(
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
        response = requests.get(f"{API_BASE}/courses")
        if response.status_code == 200:
            courses = response.json().get('courses', [])
            if courses:
                valid_course_id = courses[0].get('id')
    except:
        pass
    
    if valid_course_id:
        results.append(test_endpoint(
            "GET /api/courses/:id (valid)",
            "GET", f"/courses/{valid_course_id}",
            check_func=lambda data, resp: data.get('course', {}).get('id') == valid_course_id
        ))
    else:
        print("❌ GET /api/courses/:id (valid): No valid course ID found")
        results.append(False)
    
    # Test course detail with invalid ID
    results.append(test_endpoint(
        "GET /api/courses/:id (invalid)",
        "GET", "/courses/fake-course-id-12345",
        expected_status=404,
        check_func=lambda data, resp: 'error' in data
    ))
    
    # 6. Test categories
    results.append(test_endpoint(
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
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Test POST without token
        results.append(test_endpoint(
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
            global created_course_id
            course = data.get('course')
            if course and course.get('title') == "Test Course":
                created_course_id = course.get('id')
                return True
            return False
        
        results.append(test_endpoint(
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
        results.append(test_endpoint(
            "POST /api/courses (missing fields)",
            "POST", "/courses",
            data={"title": "Incomplete Course"},
            headers=headers,
            expected_status=400,
            check_func=lambda data, resp: 'error' in data
        ))
        
        # Test PUT operations
        if created_course_id:
            # PUT without token
            results.append(test_endpoint(
                "PUT /api/courses/:id (without token)",
                "PUT", f"/courses/{created_course_id}",
                data={"title": "Updated Title"},
                expected_status=401,
                check_func=lambda data, resp: 'error' in data
            ))
            
            # PUT with token
            results.append(test_endpoint(
                "PUT /api/courses/:id (with token)",
                "PUT", f"/courses/{created_course_id}",
                data={"title": "Updated Title"},
                headers=headers,
                check_func=lambda data, resp: data.get('course', {}).get('title') == "Updated Title"
            ))
            
            # PUT non-existent course
            results.append(test_endpoint(
                "PUT /api/courses/:id (non-existent)",
                "PUT", "/courses/fake-course-id-12345",
                data={"title": "Updated Title"},
                headers=headers,
                expected_status=404,
                check_func=lambda data, resp: 'error' in data
            ))
            
            # DELETE without token
            results.append(test_endpoint(
                "DELETE /api/courses/:id (without token)",
                "DELETE", f"/courses/{created_course_id}",
                expected_status=401,
                check_func=lambda data, resp: 'error' in data
            ))
            
            # DELETE with token
            results.append(test_endpoint(
                "DELETE /api/courses/:id (with token)",
                "DELETE", f"/courses/{created_course_id}",
                headers=headers,
                check_func=lambda data, resp: data.get('success') == True
            ))
            
            # DELETE same course again (should return 404)
            results.append(test_endpoint(
                "DELETE /api/courses/:id (second delete)",
                "DELETE", f"/courses/{created_course_id}",
                headers=headers,
                expected_status=404,
                check_func=lambda data, resp: 'error' in data
            ))
        else:
            print("❌ Course CRUD tests: No created course ID")
            results.extend([False, False, False, False, False, False])
    else:
        print("❌ Course CRUD tests: No admin token")
        results.extend([False, False, False, False, False, False, False, False])
    
    # 8. Test contact form
    results.append(test_endpoint(
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
    results.append(test_endpoint(
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
    
    passed = sum(results)
    total = len(results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)