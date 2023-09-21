# FeatFlag

A feature flag manager built with [Go](https://golang.org/). Manage your feature flags with ease.

## Running Locally  

### Prerequisites

- [Go](https://golang.org/)
- [Node.js](https://nodejs.org/en/)
- [postgres](https://www.postgresql.org/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Giac3/featflag.git
    ```
2. Install NPM packages
    ```sh
    cd app
    npm install
    ```
3. Install Go packages
    ```sh
    // from the root directory
    go mod download
    ```
4. Create a postgres database
    ```sh
    psql -U postgres
    CREATE DATABASE featflag;
    ```
5. Create a `.env` file in the root directory and add the following variables
    ```sh
    DB_HOST="localhost"
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    DB_PORT=5432
    ```
6. Run the app
    ```sh
    // from the root directory
    go run .
    ``` 
7. Run the frontend
    ```sh
    // from the app directory
    npm run dev
    ```

You should now have a local instance of FeatFlag running on `localhost:5173` :smiley:

And thats all there is so far!.

## Contributing

Any PR's will be read and considered. If you have any questions, feel free to open an issue.
Would like to work on getting the npm library up and running, so if you have any experience with that, please reach out!