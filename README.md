
# Finax

Finax is a comprehensive banking application designed for efficient account management, transactional operations, and currency exchange. It was built using Spring Boot for server-side logic, React for client-side interface, and PostgreSQL for data storage. The application supports secure and smooth transactional operations and uses Spring Security with JWT, ensuring effective user authentication and authorization. Google Cloud Storage is used for file storage. Finax combines these technologies to deliver a seamless and secure user experience.




## Features

- Account Management: View and manage your bank accounts, including balances and account details.
- Transaction Tracking: Record and track all transactions, including deposits and transfers.
- Exchange Tracking: Monitor currency exchanges, including rates, fees, and total amounts.
- Secure Authentication: Protect user data with Spring Security, ensuring robust authentication and authorization.
- Search and Filter: Efficiently search and filter transactions and exchanges based on various criteria.

## Tech Stack

- Spring Boot (Spring Security, Spring Data, Spring Web)
- React
- PostgreSQL
- Google Cloud Storage

## Demo

You can explore the functionality of Finax by trying out the live demo at [this link](https://hidden-dawn-97378-6a91585445bb.herokuapp.com). If you prefer to run the project locally, follow the installation guide provided below to set it up on your own computer.


## Installation

To set up the **Finax** project locally, follow these steps:

1. **Clone the Repository**
   - Clone the repository to your local machine:
     ```bash
     git clone https://github.com/yourusername/finax.git
     cd finax
     ```

2. **Set Up the Server**
   - Navigate to the server directory:
     ```bash
     cd server
     ```
   - Ensure you have [Java Development Kit (JDK) 22](https://www.oracle.com/java/technologies/downloads/#java22) installed.
   - Open the `application.properties` file located in `server/src/main/resources` and fill in the necessary information:
     ```properties
     spring.datasource.url=jdbc:postgresql://<YOUR_DB_URL>
     spring.datasource.username=<YOUR_DB_USERNAME>
     spring.datasource.password=<YOUR_DB_PASSWORD>

     finax.app.gcpConfigFile=gcp-key.json
     finax.app.gcpProjectId=<YOUR_GCP_PROJECT_ID>
     finax.app.gcpBucketId=<YOUR_GCP_BUCKET_NAME>
     finax.app.gcpDirectoryName=<YOUR_GCP_DIRECTORY_NAME>

     finax.app.uiUrl=<YOUR_CLIENT_URL>
     ```
   - Create a GCP key file and save it as `gcp-key.json` in the `server/src/main/resources` directory.
   - Build and run the server:
     ```bash
     ./gradlew build
     ./gradlew bootRun
     ```

3. **Set Up the Client**
   - Navigate to the client directory:
     ```bash
     cd ../client
     ```
   - Ensure you have [Node.js](https://nodejs.org/) installed.
   - Create a `.env` file in the `client` directory with the following content:
     ```env
     REACT_APP_API_URL=http://localhost:8080
     ```
   - Install client dependencies:
     ```bash
     npm install
     ```
   - Run the client application:
     ```bash
     npm start
     ```

4. **Verify the Setup**
   - Start the server if it’s not running:
     ```bash
     cd server
     ./gradlew bootRun
     ```
   - Start the client if it’s not running:
     ```bash
     cd client
     npm start
     ```
   - Open your browser and navigate to `http://localhost:3000` to view the application.
# API Reference

## 📁 Collection: Auth 

## End-point: Sign Up
### Method: POST
>```
>{{BASE_URL}}/auth/signup
>```
### Body (**raw**)

```json
{
    "email": "",
    "fullName": "",
    "username": "",
    "password": ""
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Sign In
### Method: POST
>```
>{{BASE_URL}}/auth/signin
>```
### Body (**raw**)

```json
{
    "username": "",
    "password": ""
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Sign out
### Method: POST
>```
>{{BASE_URL}}/auth/signout
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
## 📁 Collection: Accounts 


## End-point: Get Accounts
### Method: GET
>```
>{{BASE_URL}}/accounts
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Account
### Method: GET
>```
>{{BASE_URL}}/accounts/:id
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
## 📁 Collection: Users 


## End-point: Get User By Session
### Method: GET
>```
>{{BASE_URL}}/users
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Upload Profile Picture
### Method: POST
>```
>{{BASE_URL}}/users/profile-picture
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|file||file|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
## 📁 Collection: Transactions 


## End-point: Deposit
### Method: POST
>```
>{{BASE_URL}}/transaction/deposit/:accountNumber
>```
### Body (**raw**)

```json
{
    "currency": "USD",
    "amount": 100000.0
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Transfer
### Method: POST
>```
>{{BASE_URL}}/transaction/transfer
>```
### Body (**raw**)

```json
{
    "fromAccountNumber": 123123123123123,
    "toAccountNumber": 123123123123123,
    "currency": "USD",
    "amount": 1234.56,
    "reason": "Reason"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: History
### Method: GET
>```
>{{BASE_URL}}/transaction/history?size=10&page=0&startDate=2023-01-01T00:00:00&endDate=2024-07-21T00:00:00&currencies=USD&transactionTypes=DEPOSIT
>```
### Query Params

|Param|value|
|---|---|
|size|10|
|page|0|
|startDate|2023-01-01T00:00:00|
|endDate|2024-07-21T00:00:00|
|currencies|USD|
|transactionTypes|DEPOSIT|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
## 📁 Collection: Exchange 


## End-point: Exchange
### Method: POST
>```
>{{BASE_URL}}/exchange
>```
### Body (**raw**)

```json
{
    "fromAccountNumber": 123123123123123,
    "toAccountNumber": 123123123123123,
    "fromCurrency": "EUR",
    "toCurrency": "CAD",
    "amount": 5000
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: History
### Method: GET
>```
>{{BASE_URL}}/exchange/history?page=0&size=10
>```
### Query Params

|Param|value|
|---|---|
|page|0|
|size|10|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
