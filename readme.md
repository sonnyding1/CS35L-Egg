# CS35L Egg Editor

Egg Editor is a community based Markdown editor, built with the MERN stack.

![alt text](/frontend/public/image.png)

## Table of Contents

- [Features](https://github.com/sonnyding1/CS35L-Egg/#features)
- [Technologies](https://github.com/sonnyding1/CS35L-Egg/#technologies)
- [Installation](https://github.com/sonnyding1/CS35L-Egg/#installation)
- [Authors](https://github.com/sonnyding1/CS35L-Egg/#authors)

## Features

- **Profile page**: Users can create their accounts using either email password or Google OAuth. They can also view file created by the user, files like by the user, and edit user name.
- **Edit page**: Users can edit markdown files with LaTeX support. There is also a menu bar at the top of the page, which contains many useful features and shortcut keys, such as undo/redo, bold, italics, math...
- **File management**: Users can create new files, browse existing files, delete files, and search file content. Users can also toggle file visibility between public and private.
- **Community interaction**: Users can like and comment on other users' files. They can also view the specifics of each file.

## Technologies

- **Frontend**: JavaScript, React, Tailwind CSS, ShadCN UI, React-Router, React-Markdown
- **Backend**: Node.js, Express, MongoDB, Mongoose, Passport, Swagger

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

## Authors

Egg Editor is developed by a group of UCLA students in CS35L Spring 2024. The contributors are:

- Sonny Ding
- Thiha Myat
- Taha El-Halabi
- Wai-Sann
- Emily Pham
- Gabriel Jiang
