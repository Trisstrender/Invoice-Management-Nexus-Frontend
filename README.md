# Invoice Management Nexus - Frontend

Invoice Management Nexus is a cutting-edge invoice management system built with React. This frontend application provides an intuitive and responsive user interface for efficiently managing invoices, tracking clients, and visualizing crucial financial statistics.

## Features

- Streamlined creation, viewing, editing, and deletion of invoices
- Comprehensive management of person/client records
- Interactive financial statistics and reports with data visualization
- Fully responsive design ensuring seamless usage across desktop and mobile devices
- Smooth animations for enhanced user experience

## Technologies Used

- React 18 for building a dynamic and efficient user interface
- React Router for seamless navigation and routing
- Tailwind CSS for rapid, responsive UI development
- Recharts for creating interactive and visually appealing charts
- Framer Motion for fluid animations and transitions
- Lucide React for a consistent and scalable icon system

## Prerequisites

Before setting up the project, make sure you have:

- Node.js (v14 or later)
- npm (v6 or later) or yarn

## Getting Started

Follow these steps to get a local copy up and running:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/invoice-management-nexus-frontend.git
   ```

2. Navigate to the project directory:
   ```
   cd invoice-management-nexus-frontend
   ```

3. Install dependencies:
   ```
   npm install
   # or if you're using yarn
   yarn install
   ```

4. Start the development server:
   ```
   npm start
   # or with yarn
   yarn start
   ```

The application will launch and be accessible at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

- `npm start` or `yarn start`: Launches the app in development mode with hot-reloading
- `npm test` or `yarn test`: Runs the test suite with interactive watch mode
- `npm run build` or `yarn build`: Creates a production-ready build in the `build` folder

## Configuration

The application uses environment variables for flexible configuration. Create a `.env` file in the root directory with the following content:

```
REACT_APP_API_URL=http://localhost:8080
```

Adjust the URL to match your backend API endpoint. Remember to restart the development server after making changes to the `.env` file.

## Project Structure

The project is organized into the following key directories:

- `src/components`: Houses reusable React components
- `src/invoices`: Contains components specific to invoice management
- `src/persons`: Includes components for person/client management
- `src/statistics`: Holds components for rendering statistical data and charts
- `src/utils`: Contains utility functions, custom hooks, and helper modules

## Backend Repository

The backend API that powers this frontend application can be found at [Invoice Management Nexus Backend](https://github.com/your-username/invoice-management-nexus-backend).
