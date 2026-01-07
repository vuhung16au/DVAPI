# Technology Stack

This document provides a brief overview of the technologies and frameworks used in the DVAPI project.

## Backend: Node.js with Express

**Node.js** is a JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript execution. It provides an event-driven, non-blocking I/O model that makes it efficient for building scalable network applications.

**Express.js** is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In DVAPI, Express handles:
- HTTP request routing
- Middleware for authentication, file uploads, and cookie parsing
- RESTful API endpoints
- Static file serving
- Template rendering

## Database: MongoDB (Mongoose)

**MongoDB** is a NoSQL document database that stores data in flexible, JSON-like documents. It's schema-less, making it easy to adapt to changing data structures.

**Mongoose** is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides:
- Schema definitions for data validation
- Built-in type casting and validation
- Query building and execution
- Middleware hooks for pre/post operations

In DVAPI, Mongoose is used to model User, Challenge, and Ticket entities with their respective schemas and relationships.

## Authentication: JWT (JSON Web Tokens)

**JWT (JSON Web Tokens)** is a compact, URL-safe token format used for securely transmitting information between parties. JWTs consist of three parts: header, payload, and signature.

In DVAPI, JWTs are used for:
- User authentication and session management
- Stateless authentication (no server-side session storage)
- Token-based authorization for protected API endpoints
- Storing user information (userId, username, isAdmin flag) in the token payload

The application uses the `jsonwebtoken` library to sign and verify tokens.

## Frontend: EJS Templates with Bootstrap

**EJS (Embedded JavaScript)** is a templating engine that lets you generate HTML markup with plain JavaScript. It allows embedding JavaScript code directly in HTML templates.

**Bootstrap** is a popular CSS framework that provides pre-built components and utilities for responsive web design. DVAPI uses Bootstrap 4.1 for:
- Responsive layouts and grid system
- UI components (buttons, forms, cards, modals)
- Navigation bars and menus
- Consistent styling across pages

The frontend also includes various vendor libraries for enhanced functionality:
- jQuery for DOM manipulation
- Chart.js for data visualization
- Font Awesome for icons
- Lightbox2 for image galleries
- And other UI enhancement libraries

## Deployment: Docker Compose (Node.js + MongoDB)

**Docker** is a containerization platform that packages applications and their dependencies into lightweight, portable containers.

**Docker Compose** is a tool for defining and running multi-container Docker applications. The DVAPI project uses Docker Compose to:
- Define the Node.js application container
- Define the MongoDB database container
- Manage container networking and dependencies
- Persist MongoDB data using volumes
- Simplify deployment and development environment setup

The setup allows for easy deployment with a single `docker compose up` command, ensuring consistent environments across different machines.

## Documentation: Swagger/OpenAPI

**Swagger/OpenAPI** is a specification for describing RESTful APIs. It provides a standard format for API documentation that is both human-readable and machine-readable.

DVAPI includes:
- **Swagger UI** integration via `swagger-ui-express` for interactive API documentation
- **Postman Collection** files (JSON and YAML formats) for API testing
- API endpoint documentation accessible at the `/Swagger` endpoint

This allows developers and security researchers to:
- Explore available API endpoints
- Understand request/response formats
- Test API endpoints directly from the documentation interface
- Import the API into Postman for advanced testing

## Additional Technologies

- **express-fileupload**: Middleware for handling file uploads (profile pictures)
- **cookie-parser**: Middleware for parsing HTTP cookies
- **cors**: Middleware for enabling Cross-Origin Resource Sharing
- **yamljs**: Library for parsing YAML files (Swagger documentation)
- **request**: HTTP client library (used for SSRF vulnerability demonstration)
- **crypto**: Node.js built-in module for cryptographic operations (flag encryption/decryption)
