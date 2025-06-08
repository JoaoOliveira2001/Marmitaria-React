# Marmitaria React + Node

This repository contains a React application and a small Node backend used to registrar pedidos.

## Getting started

Install dependencies for the frontend:

```bash
npm install
```

Run the React development server:

```bash
npm start
```

### Backend

The backend code resides in `backEnd`. Install dependencies and start the server with:

```bash
cd backEnd
npm install
npm start
```

The backend expects the environment variable `CREDENTIALS_JSON` to contain the Google service account credentials. The file `backEnd/credentials.json` was removed from version control and should not be committed.
