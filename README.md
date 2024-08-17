# Invotriss Frontend

Invotriss is a modern invoice management system built with React. This frontend application provides a user-friendly interface for managing invoices, persons, and viewing financial statistics.

## Features

- Create, view, edit, and delete invoices
- Manage person records (clients/customers)
- View financial statistics and reports
- Responsive design for desktop and mobile devices

## Technologies Used

- React 18
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Framer Motion for animations
- Lucide React for icons

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/invotriss-frontend.git
   ```

2. Navigate to the project directory:
   ```
   cd invotriss-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (note: this is a one-way operation)

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory and add the following:

```
REACT_APP_API_URL=http://localhost:8080
```

Adjust the URL as needed to match your backend API endpoint.

## Folder Structure

- `src/components`: Reusable React components
- `src/pages`: Main page components
- `src/utils`: Utility functions and helpers
- `src/services`: API service functions
- `src/styles`: Global styles and Tailwind CSS configuration