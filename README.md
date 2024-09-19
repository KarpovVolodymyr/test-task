# Test Task

The structure of this project is based on [NX][NX] main principles


### Project Structure:
```
└───app
    ├───shared
    │   ├───enum - shared enums used across the app
    │   ├───interface - shared interfaces and types
    │   └───mock-backend
    └───users
        ├───data-access - data-related logic like API services and common data models
        ├───feature 
        │   └───users - smart component responsible for handling the users' feature logic
        ├───shared -  Shared resources within the users feature
        │   ├───components
        │   │   └───base-component - shared component containing reusable logic for users
        │   ├───directives - custom directives related to the users feature
        │   └───services - services specific to the users module
        ├───ui - folder for stateless/dumb components
        │   └───user-form - Component for handling user forms
        └───utils - utility services for the users feature
```

[nx]: https://nx.dev/


### Serve applications:
```bash
npm start
```
