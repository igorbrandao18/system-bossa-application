#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000/api/auth"

# Function to generate random string
random_string() {
  echo $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${1:-8} | head -n 1)
}

# Function to format JSON
format_json() {
  if [ -z "$1" ]; then
    echo "Empty response"
    return
  fi
  
  echo "$1" | python -m json.tool 2>/dev/null || echo "$1"
}

# Function to check server status
check_server() {
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
  if [ "$status" != "200" ]; then
    echo -e "${RED}Server is not responding. Make sure the API server is running.${NC}"
    exit 1
  fi
}

# Function to test user operations
test_user() {
  local name="User_$(random_string 5)"
  local email="${name}@example.com"
  local password="pass_$(random_string 8)"
  local phone="1234$(random_string 6)"
  local role=$1

  echo -e "\n${BLUE}Testing user: $name ($role)${NC}"
  echo -e "Email: $email"
  echo -e "Password: $password\n"

  # 1. Register Test
  echo -e "${GREEN}1. Testing Register Endpoint${NC}"
  local register_response=$(curl -s -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"email\": \"$email\", \"password\": \"$password\", \"phone\": \"$phone\", \"role\": \"$role\"}")
  
  format_json "$register_response"
  
  # Check if registration was successful
  if [[ "$register_response" == *"error"* ]]; then
    echo -e "${RED}Registration failed. Skipping remaining tests for this user.${NC}"
    return 1
  fi
  echo -e "\n"

  # 2. Login Test
  echo -e "${GREEN}2. Testing Login Endpoint${NC}"
  local login_response=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"$password\"}")
  
  format_json "$login_response"

  # Extract token
  local token=$(echo "$login_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ -z "$token" ]; then
    echo -e "${RED}No token received. Skipping remaining tests for this user.${NC}"
    return 1
  fi
  echo -e "\n"

  # 3. Verify Token Test
  echo -e "${GREEN}3. Testing Verify Token Endpoint${NC}"
  local verify_response=$(curl -s -X GET "$BASE_URL/verify" \
    -H "Authorization: Bearer $token")
  format_json "$verify_response"
  echo -e "\n"

  # 4. Get Profile Test
  echo -e "${GREEN}4. Testing Get Profile Endpoint${NC}"
  local profile_response=$(curl -s -X GET "$BASE_URL/profile" \
    -H "Authorization: Bearer $token")
  format_json "$profile_response"
  echo -e "\n"

  # 5. Update Profile Test
  local new_name="Updated_${name}"
  local new_phone="9876$(random_string 6)"
  echo -e "${GREEN}5. Testing Update Profile Endpoint${NC}"
  local update_response=$(curl -s -X PUT "$BASE_URL/profile" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$new_name\", \"phone\": \"$new_phone\"}")
  format_json "$update_response"
  echo -e "\n"

  # 6. Change Password Test
  local new_password="newpass_$(random_string 8)"
  echo -e "${GREEN}6. Testing Change Password Endpoint${NC}"
  local change_pass_response=$(curl -s -X PUT "$BASE_URL/change-password" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "{\"currentPassword\": \"$password\", \"newPassword\": \"$new_password\"}")
  format_json "$change_pass_response"
  echo -e "\n"

  # 7. Test Login with New Password
  echo -e "${GREEN}7. Testing Login with New Password${NC}"
  local new_login_response=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"$new_password\"}")
  format_json "$new_login_response"
  echo -e "\n"

  # 8. Logout Test
  echo -e "${GREEN}8. Testing Logout Endpoint${NC}"
  local logout_response=$(curl -s -X POST "$BASE_URL/logout" \
    -H "Authorization: Bearer $token")
  format_json "$logout_response"
  echo -e "\n"

  echo -e "${BLUE}Completed testing for user: $name${NC}"
  echo -e "----------------------------------------\n"
}

# Main test sequence
echo -e "${BLUE}Starting Auth Module Tests${NC}"
echo -e "================================\n"

# Check if server is running
echo -e "${YELLOW}Checking server status...${NC}"
check_server

# Test with different user roles
echo -e "${BLUE}Testing Admin User${NC}"
test_user "admin"

echo -e "${BLUE}Testing Regular User${NC}"
test_user "user"

# Test with multiple regular users
for i in {1..3}
do
  echo -e "${BLUE}Testing Additional Regular User $i${NC}"
  test_user "user"
done

echo -e "${BLUE}Auth Module Tests Completed${NC}" 