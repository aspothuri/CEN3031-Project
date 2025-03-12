# API Docs

## User

### **Create User**

**Endpoint:** `/user/signup`
**Method:** `POST`
**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Description:** Creates user in database. The password is hashed.

---

### **Get All Users**

**Endpoint:** `/user`
**Method:** `GET`
**Request Body:** `None`
**Description:** Fetches all users (testing)

---

### **Login**

**Endpoint:** `/user/login`
**Method:** `GET`
**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Description:** Authenticate with email and password. Returns user if valid.

**Possible Responses:**

- `200 OK`: Login successful.
- `401 Unauthorized`: Password incorrect.
- `404 Not Found`: User does not exist.

---

### **Get User Profile**

**Endpoint:** `/user/profile/:username`
**Method:** `GET`
**Request Params:**

- `username` (string) - User retrieved.

**Description:** Fetch user profile with **followers** and **following** list.

**Possible Responses:**

- `200 OK`: Returns user data.
- `404 Not Found`: User does not exist.

---

### **Follow/Unfollow User**

**Endpoint:** `/user/profile/:username/:targetUsername`
**Method:** `PATCH`
**Request Params:**

- `username` (string) - User following.
- `targetUsername` (string) - User followed.

**Description:**

- (`username`) will follow `targetUsername` if not following.
- (`username`) will unfollow `targetUsername` if following.
- User tries to follow self, `400 Bad Request` error.

**Possible Responses:**

- `200 OK`: Message confirming follow/unfollow action.
- `400 Bad Request`: User cannot follow themselves.
- `404 Not Found`: One or both users not found.
