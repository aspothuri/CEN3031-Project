# API Docs

## App

### Health Check

**Endpoint:** `/`
**Method:** `GET`
**Request Body:** `None`
**Description:** Returns a simple greeting to verify the server is running.
**Possible Responses:**

- `200 OK`: `"Hello World!"`

---

## User

### Create User

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

**Description:** Creates a new user in the database. Password is hashed before storage.
**Possible Responses:**

- `201 Created`: Returns the created `User` object.
- `400 Bad Request`: Validation errors.

---

### Delete User

**Endpoint:** `/user/:username`
**Method:** `DELETE`
**Path Params:**

- `username` (string) – The username of the user to delete.
  **Description:** Deletes the specified user from the database.
  **Possible Responses:**
- `200 OK`: `{ "message": "User deleted" }`
- `404 Not Found`: User does not exist.

---

### Login

**Endpoint:** `/user/login`
**Method:** `POST`
**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Description:** Authenticates user by email and password, returns an access token if successful.
**Possible Responses:**

- `200 OK`: `{ "accessToken": "string", "user": { … } }`
- `401 Unauthorized`: Incorrect password.
- `404 Not Found`: User not found.

---

### Get User Profile

**Endpoint:** `/user/profile/:username`
**Method:** `GET`
**Path Params:**

- `username` (string) – The username whose profile to fetch.
  **Description:** Retrieves user profile including `followers` and `following` lists.
  **Possible Responses:**
- `200 OK`: `{ "user": { … }, "followers": ["string"], "following": ["string"] }`
- `404 Not Found`: User not found.

---

### Follow/Unfollow User

**Endpoint:** `/user/profile/:username/:targetUsername`
**Method:** `PATCH`
**Path Params:**

- `username` (string) – The acting user.
- `targetUsername` (string) – The user to follow or unfollow.
  **Description:**
- If `username` is not following `targetUsername`, they will follow.
- If already following, they will unfollow.
- Cannot follow oneself.
  **Possible Responses:**
- `200 OK`: `{ "message": "Followed" }` or `{ "message": "Unfollowed" }`
- `400 Bad Request`: Cannot follow yourself.
- `404 Not Found`: One or both users not found.

---

### Upload Profile Image

**Endpoint:** `/user/profile/upload`
**Method:** `POST`
**Request Body (multipart/form-data):**

- `file` (file) – The image file.
- `username` (string) – The username of the user.
  **Description:** Uploads a profile image to Cloudinary and updates the user's `avatarUrl`.
  **Possible Responses:**
- `200 OK`: Returns updated `User` object.
- `400 Bad Request`: Missing file or username.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Image upload failed.

---

### Get Personal Videos

**Endpoint:** `/user/:username/videos`
**Method:** `GET`
**Path Params:**

- `username` (string) – The username whose videos to fetch.
  **Description:** Retrieves an array of video IDs or URLs uploaded by the user.
  **Possible Responses:**
- `200 OK`: `["string"]` (list of video IDs or links)
- `404 Not Found`: User not found.

---

### Unlike Video

**Endpoint:** `/user/:username/:videoId/unlike`
**Method:** `PATCH`
**Path Params:**

- `username` (string) – The user performing the unlike.
- `videoId` (string) – The video to unlike.
  **Description:** Removes the like record for the user/video and decrements the video’s like count.
  **Possible Responses:**
- `200 OK`: `{ "likes": number }` (new total likes)
- `404 Not Found`: User or video not found.

---

### Get All Users (Testing)

**Endpoint:** `/user`
**Method:** `GET`
**Description:** Retrieves all user records (for testing).
**Possible Responses:**

- `200 OK`: `[{ … }]` (list of `User` objects)

---

## Video

### Upload Video

**Endpoint:** `/video/upload`
**Method:** `POST`
**Request Body (multipart/form-data):**

- `file` (file) – The video file.
- `username` (string) – Uploader's username.
- `description` (string) – Optional caption.
  **Description:** Uploads video to storage (e.g., S3/Cloudinary) and creates a `Video` record.
  **Possible Responses:**
- `200 OK`: `{ "message": "Uploaded", "video": { … } }`
- `400 Bad Request`: Missing file or username.
- `500 Internal Server Error`: Upload/storage error.

---

### Search Videos

**Endpoint:** `/video/search/:query`
**Method:** `GET`
**Path Params:**

- `query` (string) – Search keyword for title/description.
  **Description:** Performs full-text or regex search on videos.
  **Possible Responses:**
- `200 OK`: `[{ … }]` (list of matching `Video` objects)
- `404 Not Found`: No matches found.

---

### Increment View Count

**Endpoint:** `/video/:id/view`
**Method:** `PATCH`
**Path Params:**

- `id` (string) – The video ID.
  **Description:** Increments the video’s `views` count by one.
  **Possible Responses:**
- `200 OK`: `{ "views": number }` (new total views)
- `404 Not Found`: Video not found.

---

### Get Main Feed

**Endpoint:** `/video/feed`
**Method:** `GET`
**Description:** Retrieves a ranked list of videos for the main feed (e.g., sorted by popularity or recency).
**Possible Responses:**

- `200 OK`: `[{ … }]` (list of `Video` objects)

---

## Comment

### Create Comment

**Endpoint:** `/comment`
**Method:** `POST`
**Request Body:**

```json
{
  "parentId": "string", // ID of video or parent comment
  "author": "string", // username
  "text": "string"
}
```

**Description:** Adds a new comment under the specified parent.
**Possible Responses:**

- `201 Created`: Returns the created `Comment` object.
- `400 Bad Request`: Validation errors.

---

### Get Comment by ID

**Endpoint:** `/comment?id=<commentId>`
**Method:** `GET`
**Query Params:**

- `id` (string) – The comment ID.
  **Description:** Retrieves a single comment by its ID.
  **Possible Responses:**
- `200 OK`: `{ … }` (`Comment` object)
- `404 Not Found`: Comment not found.

---

### List Comments for Parent

**Endpoint:** `/comment/all?parentId=<parentId>`
**Method:** `GET`
**Query Params:**

- `parentId` (string) – ID of the video or comment.
  **Description:** Lists all comments under the given parent.
  **Possible Responses:**
- `200 OK`: `[{ … }]` (list of `Comment` objects)

---

### Update Comment

**Endpoint:** `/comment?id=<commentId>`
**Method:** `PATCH`
**Query Params:**

- `id` (string) – The comment ID.
  **Request Body:**

```json
{
  "text": "string"
}
```

**Description:** Updates the comment’s text.
**Possible Responses:**

- `200 OK`: Returns the updated `Comment` object.
- `404 Not Found`: Comment not found.

---

### Delete Comment

**Endpoint:** `/comment?id=<commentId>`
**Method:** `DELETE`
**Query Params:**

- `id` (string) – The comment ID.
  **Description:** Deletes the specified comment.
  **Possible Responses:**
- `200 OK`: `{ "message": "Comment deleted" }`
- `404 Not Found`: Comment not found.

---

### Get Likes for Comment

**Endpoint:** `/comment/likes`
**Method:** `GET`
**Request Body:**

```json
{
  "parentId": "string" // Comment ID
}
```

**Description:** Retrieves all like records for a given comment.
**Possible Responses:**

- `200 OK`: `[{ … }]` (list of `Like` objects)

---

### Add Like to Comment

**Endpoint:** `/comment/like`
**Method:** `POST`
**Request Body:**

```json
{
  "userId": "string",
  "parentId": "string" // Comment ID
}
```

**Description:** Creates a like record and increments the comment’s like count.
**Possible Responses:**

- `200 OK`: `{ "likes": number }` (new like count)

---

### Remove Like from Comment

**Endpoint:** `/comment/like`
**Method:** `DELETE`
**Request Body:**

```json
{
  "userId": "string",
  "parentId": "string"
}
```

**Description:** Deletes the like record and decrements the comment’s like count.
**Possible Responses:**

- `200 OK`: `{ "likes": number }` (new like count)

---

## Reply

_Endpoints mirror `/comment` but operate on replies._

- **Create Reply:**

  - `POST /reply`
  - Body: `{ parentId, author, text }`
  - Returns created `Reply`.

- **Get Reply by ID:**

  - `GET /reply?id=<replyId>`

- **List Replies:**

  - `GET /reply/all?parentId=<commentId>`

- **Update Reply:**

  - `PATCH /reply?id=<replyId>`
  - Body: `{ text }`

- **Delete Reply:**

  - `DELETE /reply?id=<replyId>`

- **Get Likes on Reply:**

  - `GET /reply/likes`
  - Body: `{ parentId }`

- **Add Like to Reply:**

  - `POST /reply/like`
  - Body: `{ userId, parentId }`

- **Remove Like from Reply:**
  - `DELETE /reply/like`
  - Body: `{ userId, parentId }`
