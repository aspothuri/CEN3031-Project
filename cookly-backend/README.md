## Postman Used For Testing: https://.postman.co/workspace/My-Workspace~b962a135-e36c-4cb3-8a94-3438123cbee8/collection/38263930-5b09c21f-bbac-44de-9fbb-fa33bd7138c5?action=share&creator=38263930

# API Docs

## App

### Health Check

**Endpoint:** `/`
**Method:** `GET`
**Request Body:** None
**Description:** Returns a simple greeting.
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

**Description:** Creates a new user. Password is hashed.
**Possible Responses:**

- `201 Created`: Returns the created `User` object.
- `400 Bad Request`: Validation errors.

---

### Delete User

**Endpoint:** `/user/:username`
**Method:** `DELETE`
**Path Params:**

- `username` (string) – The user to delete.

**Description:** Deletes the specified user.
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

**Description:** Authenticates user and returns an access token.
**Possible Responses:**

- `200 OK`: `{ "accessToken": "string", "user": { … } }`
- `401 Unauthorized`: Incorrect password.
- `404 Not Found`: User not found.

---

### Get User Profile

**Endpoint:** `/user/profile/:username`
**Method:** `GET`
**Path Params:**

- `username` (string) – The user to fetch.

**Description:** Returns profile with followers and following lists.
**Possible Responses:**

- `200 OK`:
  ```json
  {
    "user":      { … },
    "followers": ["string", …],
    "following": ["string", …]
  }
  ```
- `404 Not Found`: User not found.

---

### Follow/Unfollow User

**Endpoint:** `/user/profile/:username/:targetUsername`
**Method:** `PATCH`
**Path Params:**

- `username` (string) – Who is following/unfollowing.
- `targetUsername` (string) – Who is being followed/unfollowed.

**Description:** Toggles follow status.

- If not currently following, follows.
- If already following, unfollows.
- Cannot follow yourself.

**Possible Responses:**

- `200 OK`: `{ "message": "Followed" }` or `{ "message": "Unfollowed" }`
- `400 Bad Request`: Cannot follow yourself.
- `404 Not Found`: User(s) not found.

---

### Upload Profile Image

**Endpoint:** `/user/profile/upload`
**Method:** `POST`
**Request Body (multipart/form-data):**

- `file` (file) – Image file.
- `username` (string) – Who uploads.

**Description:** Uploads image to Cloudinary and updates `avatarUrl`.
**Possible Responses:**

- `200 OK`: Updated `User` object.
- `400 Bad Request`: Missing file or username.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Upload failure.

---

### Get Personal Videos

**Endpoint:** `/user/:username/videos`
**Method:** `GET`
**Path Params:**

- `username` (string) – Whose videos to fetch.

**Description:** Returns array of video IDs or URLs uploaded by the user.
**Possible Responses:**

- `200 OK`: `["string", …]`
- `404 Not Found`: User not found.

---

### Unlike Video

**Endpoint:** `/user/:username/:videoId/unlike`
**Method:** `PATCH`
**Path Params:**

- `username` (string) – Who is unliking.
- `videoId` (string) – Video to unlike.

**Description:** Removes like record and decrements video’s like count.
**Possible Responses:**

- `200 OK`: `{ "likes": number }`
- `404 Not Found`: User or video not found.

---

### Get All Users (Testing)

**Endpoint:** `/user`
**Method:** `GET`

**Description:** Returns all users (for testing).
**Possible Responses:**

- `200 OK`: `[{ … }, …]`

---

## Video

### Upload Video

**Endpoint:** `/video/upload`
**Method:** `POST`
**Request Body (multipart/form-data):**

- `file` (file) – Video file.
- `username` (string) – Uploader.
- `description` (string) – Optional caption.

**Description:** Stores video and creates a `Video` record.
**Possible Responses:**

- `200 OK`: `{ "message": "Uploaded", "video": { … } }`
- `400 Bad Request`: Missing file or username.
- `500 Internal Server Error`: Storage error.

---

### Search Videos

**Endpoint:** `/video/search/:query`
**Method:** `GET`
**Path Params:**

- `query` (string) – Search term.

**Description:** Searches videos by title/description.
**Possible Responses:**

- `200 OK`: `[{ … }, …]`

---

### Increment View Count

**Endpoint:** `/video/:id/view`
**Method:** `PATCH`
**Path Params:**

- `id` (string) – Video ID.

**Description:** Increments `views` counter.
**Possible Responses:**

- `200 OK`: `{ "views": number }`
- `404 Not Found`: Video not found.

---

### Get Main Feed

**Endpoint:** `/video/feed`
**Method:** `GET`

**Description:** Returns ranked list of videos for the main feed.
**Possible Responses:**

- `200 OK`: `[{ … }, …]`

---

## Comment

### Create Comment

**Endpoint:** `/comment`
**Method:** `POST`
**Request Body:**

```json
{
  "parentId": "string",
  "author": "string",
  "text": "string"
}
```

**Description:** Creates a new comment under a video or parent comment.
**Possible Responses:**

- `201 Created`: Created `Comment` object.
- `400 Bad Request`: Validation errors.

---

### Get Comment by ID

**Endpoint:** `/comment?id=<commentId>`
**Method:** `GET`
**Query Params:**

- `id` (string) – Comment ID.

**Description:** Retrieves a single comment.
**Possible Responses:**

- `200 OK`: `{ … }`
- `404 Not Found`: Comment not found.

---

### List Comments for Parent

**Endpoint:** `/comment/all?parentId=<parentId>`
**Method:** `GET`
**Query Params:**

- `parentId` (string) – Video or comment ID.

**Description:** Lists all comments under a parent.
**Possible Responses:**

- `200 OK`: `[{ … }, …]`

---

### Update Comment

**Endpoint:** `/comment?id=<commentId>`
**Method:** `PATCH`
**Query Params:**

- `id` (string) – Comment ID.

**Request Body:**

```json
{
  "text": "string"
}
```

**Description:** Updates comment text.
**Possible Responses:**

- `200 OK`: Updated `Comment` object.
- `404 Not Found`: Comment not found.

---

### Delete Comment

**Endpoint:** `/comment?id=<commentId>`
**Method:** `DELETE`
**Query Params:**

- `id` (string) – Comment ID.

**Description:** Deletes the comment.
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
  "parentId": "string"
}
```

**Description:** Retrieves likes for a comment.
**Possible Responses:**

- `200 OK`: `[{ … }, …]`

---

### Add Like to Comment

**Endpoint:** `/comment/like`
**Method:** `POST`
**Request Body:**

```json
{
  "userId": "string",
  "parentId": "string"
}
```

**Description:** Likes a comment and increments its count.
**Possible Responses:**

- `200 OK`: `{ "likes": number }`

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

**Description:** Unlikes a comment and decrements its count.
**Possible Responses:**

- `200 OK`: `{ "likes": number }`

---

## Reply

_These endpoints mirror the Comment routes but operate on replies._

- **Create Reply**
  `POST /reply`
  Body: `{ parentId, author, text }`

- **Get Reply by ID**
  `GET /reply?id=<replyId>`

- **List Replies**
  `GET /reply/all?parentId=<commentId>`

- **Update Reply**
  `PATCH /reply?id=<replyId>`
  Body: `{ text }`

- **Delete Reply**
  `DELETE /reply?id=<replyId>`

- **Get Likes on Reply**
  `GET /reply/likes`
  Body: `{ parentId }`

- **Add Like to Reply**
  `POST /reply/like`
  Body: `{ userId, parentId }`

- **Remove Like from Reply**
  `DELETE /reply/like`
  Body: `{ userId, parentId }`
