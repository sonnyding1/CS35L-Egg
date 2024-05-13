# CS35L Egg

This project is UCLA's CS35L final project.

## Installation

Follow these steps to install and run this project:

### Clone the repository

```bash
git clone git@github.com:sonnyding1/CS35L-Egg.git
```

### Navigate to the directory

```bash
cd CS35L-Egg
```

### Install the dependencies

Starting from this step, you will need to open two terminal windows, one for the backend and one for the frontend. For all the backend commands, you will need to navigate to the `backend` directory. For all the frontend commands, you will need to navigate to the `frontend` directory.

For the backend:

```bash
cd backend
npm install
```

For the frontend:

```bash
cd frontend
npm install
```

### Set up the environment variables

If you are a contributor, visit our Google Drive to get the `.env` files for frontend and backend. If you are not a contributor, you will need to create your own `.env` files. The backend `.env` file should be placed in the `backend` directory, the frontend `.env` file should be placed in the `frontend` directory.

For the backend:

```bash
GOOGLE_CLIENT_ID=[your Google client ID from Google Cloud Platform]
GOOGLE_CLIENT_SECRET=[your Google client secret from Google Cloud Platform]
SESSION_SECRET=[your session secret]
MONGO_URI=[your MongoDB URI]
```

### Run the project

For the backend:

```bash
npm run dev
```

For the frontend:

```bash
npm run dev
```
