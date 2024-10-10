# Stellar Notification System for Decaf Wallet

## Overview

The Stellar Notification System is a microservice-based application designed to monitor Stellar blockchain transactions and notify Decaf Wallet users of relevant activities. This system ensures that users are promptly informed about their transaction statuses and other important events on the Stellar network.

## Features

- **Real-time Monitoring**: Continuously listens for new transactions on the Stellar network.
- **User Identification**: Matches transactions to Decaf Wallet users based on predefined criteria.
- **Custom Notifications**: Sends personalized notifications to users regarding their transactions.
- **Scalable Architecture**: Built using microservices to ensure scalability and maintainability.

## Architecture

The system is composed of several key components, each responsible for specific tasks:

- **Transaction Parser**:

  - Continuously monitors the Stellar network for new transactions.
  - Parses transaction data to identify those relevant to Decaf Wallet users.
  - Triggers notifications for identified transactions.

- **User Service**:

  - Interfaces with the Decaf Users API to retrieve user information.
  - Ensures that notifications are sent to the correct users based on transaction details.

- **Notification Service**:
  - Responsible for sending notifications to users.
  - Utilizes various communication channels (e.g., email, push notifications) to ensure timely delivery.
  - Configurable notification templates to personalize user messages.

## Prerequisites

Before running the system, ensure you have the following installed:

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

## Running the System

To set up and run the Stellar Notification System, follow these steps:

```bash
git clone https://github.com/renathomas/stellar-notification-system.git
cd stellar-notification-system
npm install
nom run build
npm run dev
```

## How to Test

Testing is an essential part of ensuring the functionality and reliability of the Stellar Notification System. Follow these steps to run the tests:

### Running Unit Tests

**Ensure Dependencies are Installed**: Before running the tests, make sure all dependencies are installed by executing:

```bash
npm run test
```
