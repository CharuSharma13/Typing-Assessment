# Typing Assessment

## About
Typing Assessment is a web-based application designed to evaluate and improve your typing skills. It provides various tests and metrics to help users enhance their typing speed and accuracy.

## Features
- Real-time typing tests for desktop users
- Accuracy and speed metrics
- User-friendly interface
- Tests can be taken by anonymous users
- Logged-in users have their progress and historical performance tracked
  
## Installation

### Prerequisites
- Node.js
- npm
- MySQL

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/CharuSharma13/Typing-Assessment.git
    cd Typing-Assessment
    ```
    
2. ### Database Setup
 - Set up a MySQL server.
 - Create the following tables:

   ```sql
    CREATE TABLE `users` (
      `id` int unsigned NOT NULL AUTO_INCREMENT,
      `name` varchar(255) NOT NULL,
      `email` varchar(255) NOT NULL,
      `password` varchar(255) NOT NULL,
      `created_at` datetime DEFAULT NULL,
      `updated_at` datetime DEFAULT NULL,
      PRIMARY KEY (`id`,`email`),
      UNIQUE KEY `email_UNIQUE` (`email`),
      UNIQUE KEY `id_UNIQUE` (`id`)
    );

    CREATE TABLE `typinginfo` (
      `id` int NOT NULL AUTO_INCREMENT,
      `user_id` int NOT NULL,
      `chars_per_min` int NOT NULL,
      `words_per_min` int NOT NULL,
      `accuracy_percent` int NOT NULL,
      `completed_on` datetime NOT NULL,
      `total_score` float NOT NULL,
      PRIMARY KEY (`id`),
      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    );
    ```

3. Navigate to the `server` directory and install dependencies:
    ```bash
    cd server
    npm install
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. Navigate to the `client` directory and install dependencies:
    ```bash
    cd ../client
    npm install
    ```

6. Start the client:
    ```bash
    npm start
    ```

7. Open your browser and go to `http://localhost:3000` to use the application.

## Usage
1. Open the application in your browser.
2. Complete the test by typing the displayed text as quickly and accurately as possible.
3. If you are logged in, navigate to the /profile page from the navbar to track your current and historical progress.
4. Review your results and track your progress over time.


## Contact
For any questions or support, please contact Charu Sharma at [charusharmak26@gmail.com](mailto:charusharmak26@gmail.com).

