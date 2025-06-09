## 🚀 Node.js Backend Starter (Docker Dev Setup)

This project is a real-time chat application (chatFlow) built using Node.js, Express, PostgreSQL, and Socket.IO. It is structured for local development using Docker and Docker Compose.

### 📦 Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](for running scripts locally if needed)

## 🛠️ Getting Started

### Step 1: Clone the Repository

```bash
git clone git@github.com:dawit-personal/chatFlow.git
cd chatFlow
```

### Step 2: Ensure Required Ports Are Free

- `4000` - API server
- `5173` - React frontend
- `5000` - Socket.IO (real-time communication)
- `5432` - PostgreSQL database

To check and free up these ports if they’re already in use:

```
make check-kill-port
```

### Step 3: Start the Application

Start all services using Docker Compose:

```
make up
```

### Step 4: Verify Services Are Running

Check the status of all containers:

```
make status
```

You should see something like:

```
chatflow-backend-1    ...   0.0.0.0:4000->4000/tcp
chatflow-db-1         ...   0.0.0.0:5432->5432/tcp
chatflow-frontend-1   ...   0.0.0.0:5173->5173/tcp
chatflow-rtc-1        ...   0.0.0.0:5000->5000/tcp
```

## How To use the app

### Step 1:: Open the App

Visit

```
http://localhost:5173/
```

### Step 2:: Register Users

- Click on `sign up`
- Create three separate user accounts

### Step 3: Login and Simulate Users

- Log in with different credentials using:
  - Separate browsers OR
  - Incognito windows

This simulates multiple users chatting concurrently.

### Access chat page

- After login, you'll land on your profile page
- Click Chat in the top navigation bar

### Start 1:1 Chat

- Use the search bar to find another user by first name
- Partial name matches are supported
- Click the green "Start Chat" button to initiate a private chat
- That user will now appear in your chat list

### Create Group Chat

- Click `Add Group` at the top
- Enter a group name
- Search for members by name
- Click Add on each name to add them to the group
- Click Done to create the group

### Logout

- Click the Logout button at the top right corner

# Additonal Info

- [View Architecture Diagram](docs/ArchitectureOverview/README.md)
- [View Scaling Consideration](docs/ScalingConsideration/README.md)
- [Trade-Offs Decisions](docs/TradeOffsDecisions/README.md)
- [Document Architectural Decisions](docs/DocumentDecisions/README.md)

### Support

Feel free to reach out if you have questions, feedback, or need assistance:

- Email: dawitfisha@gmail.com
- Phone: +1 (613) 501-4835
