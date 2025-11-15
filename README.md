# Technical Specifications Document

## 1. Title Page
| Project Name: | &#9992;&#65039; Airline Booking System                                                                                 |
|---------------|--------------------------------------------------------------------------------------------------------|
| Version       | 2.0.0                                                                                                  |
| Date          | October 14, 2025                                                                                       |
| Authors       | [Cris Bagotsay](https://github.com/blink1197/)<br>[Richard Delos Trinos](https://github.com/richard-DT)|

## 2. Table of Contents
1. [Title Section](#1-title-page)
2. [Table of Contents](#2-table-of-contents)
3. [Features and Scope (Phase 1)](#3-features-and-scope-phase-1)
4. [Functional Requirements (FR)](#4-functional-requirements-fr)
5. [Non-Functional Requirements (NFR)](#5-non-functional-requirements-nfr)
6. [External Interface Requirements](#6-external-interface-requirements)
7. [Visual Mock-up (Figma) and ERD](#7-visual-mock-up-figma-and-erd)
8. [Data Requirements](#8-data-requirements)
9. [Glossary](#9-glossary)
10. [Appendices](#10-appendices)

## 3. Features and Scope (Phase 1)
This phase focuses only on the Core Search and Display as the Minimum Viable Product (MVP).
| Feature Area    | Description                                       | Scope                                                                                                      |
|-----------------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| Flight Search   | Core logic for finding flights based on criteria. | **IN:** One-way flights, Origin, Destination, Date.<br>**OUT:** Round-trip search is excluded.             |
| Results Display | Presenting the returned flight data to the user.  | **IN:** Dynamic, scrollable cards displaying Price,<br> Times, Duration, Airline, and basic sorting/filtering. |
| Architecture    | The front-end application structure.              | **IN:** Mobile-Responsive Single Page Web Application (SPA).                                               |
| Booking/Account | User accounts and transaction management.         | **OUT:** User Login/Logout, User Profile, Booking/Payment workflow<br> [(See Excluded Features)](#43-fr---excluded-features-phase-1-boundary).                 |

## 4. Functional Requirements (FR)
The technical specifications should cover both Frontend and Backend requirements.
### 4.1 FR - Frontend (User Interface)
| ID          | Requirement            | Description                                                                                                                                          |
|-------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-FE-01    | Search Input           | Display input fields for **Origin**, **Destination**, **Departure Date**, and a **Search** button on the landing screen.                             |
| FR-FE-02    | Results Display Cards  | Display flight results in dynamic cards showing **route**, **times**, **duration**, and **formatted price**.<br> The component must include a cut-off visual element at the bottom to imply scrollable content. |
| FR-FE-03    | Search Options Display | Display buttons for **“Round-trip”** and **“One-way”**, but ensure only **“One-way”** search is functional.                                          |
| FR-FE-04    | Utility Footer         | Include a functional **Footer** element displaying basic contact information.                                                                        |
| FR-FE-05    | Navigation Menu        | Include a **hamburger menu button** on the navigation bar for mobile responsiveness.                                                                 |
#### 4.1.1 Pages Overview
| Page ID | Page Name                       | Description                                                                                                    | 
|---------|---------------------------------|----------------------------------------------------------------------------------------------------------------|
| PG-01   | Landing Page (Flight Search)    | The initial screen where users can search for available flights.                                               | 
| PG-02   | Flight Results Page             | Displays available flight options based on the user’s search criteria.                                         | 
| PG-03   | Booking Page                    | Displays selected flight details and allows users to enter passenger information.                              | 
| PG-04   | Add-Ons Page                    | Allows users to select add-ons (future feature).                                                               |
| PG-05   | Payment Page                    | Allows users to review and select payment method (future feature)                                              |
| PG-06   | Confirmation Page               | Shows booking confirmation and reference number after successful transaction.                                  | 
| PG-07   | Login Page                      | Allows registered users to log into their account.                                                             | 
| PG-08   | Register Page                   | Enables new users to create an account.                                                                        | 
| PG-09   | About Us Page                   | Provides information about the airline booking system, mission, and benefits.                                  | 
| PG-10   | Contact Us Page                 | Displays contact details and a functional inquiry form.                                                        | 
| PG-11   | User Profile                    | Allows logged-in users to view their booking history and check current booking status.                         | 
| PG-12   | Error / Empty State Page        | Displays a user-friendly message when no flights are found or when an error occurs.                            | 



### 4.2 FR - Backend (Core Logic & Data)
| ID          | Requirement          | Description                                                                                |
|-------------|----------------------|--------------------------------------------------------------------------------------------|
| FR-BE-01    | Search API Endpoint  | Expose a stable REST API endpoint (/v1/flights/search) to process one-way search requests. |
| FR-BE-02    | Data Aggregation     | Calculate total flight duration and format the price based on flight data.                 |
| FR-BE-03    | Airport Data Service | Provide an API endpoint (/v1/airports) for the frontend's airport auto-complete feature.   |

### 4.3 FR - Excluded Features (Phase 1 Boundary)
The following pages and features are explicitly excluded from Phase 1:
* Login/Logout
* User Profile
* Booking Confirmation/ltinerary details
* Manage Booking, Check-in, Flight Status
* Round-Trip Search

## 5. Non-Functional Requirements (NFR)
| ID          | Category     | Requirement          | Description                                                                       |
|-------------|--------------|----------------------|-----------------------------------------------------------------------------------|
| NFR-P-01    | Performance  | search Latency       | < 2 seconds (for 95% of searches)                                                 |
| NFR-P-02    | Architecture | Web Application Type | Application must be a Single Page Web Application (SPA).                          |
| NFR-U-01    | Usability    | Device Compatibility | Application must be fully mobile- responsive (including mobile and tablet views). |
| NFR-S-01    | Security     | Input Validation     | Implement comprehensive input sanitation and validation on all API parameters.    |

## 6. External Interface Requirements
This includes descriptions of user interfaces, APIs, and interactions with other systems.
* Design Inspiration: The user experience should draw inspiration from Airline Booking applications<br> such as Cebu Pacific, Philippine Airlines, and Singapore Airlines.

## 7. Visual Mock-up (Figma) and ERD
The document must include a Visual Mock-up and an ERD.

#### 7.1 Figma Mock-up Requirements
* Tool
    * Create a visual mock-up using Figma. You can use the Figma Community for flight booking app templates for guidance.
* Views
    * Must include mobile and tablet views.
* Style Guide
    * The Figma file must include a Style Guide component covering Typography, Color Palette, and Branding.
* Access
    * The link must be Public to allow future employers to view the project.

#### 7.2 TSD Inclusion
* [Public Figma Link](https://www.figma.com/design/CMczN2gNCB3fZ5wZHwscPi/ABS-Mock-Up?node-id=2-311&t=Bitt7Q5CpQQC3nrK-1)
* [ERD Link](https://drive.google.com/file/d/1WNCXU3CTT8dckXDJT_ljm8VHvR5LGH84/view?usp=drive_link)

## 8. Data Requirements
The document must include data models, database schemas, and an ERD (link provided above).

#### 8.1 ERD Database Models and Schemas

#### Airline_info

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| airlineId | PK | STRING | Unique identifier for the airline. |
| name |  | STRING | Name of the airline (e.g., "SkyLink"). |
| logo |  | STRING | URL or path to the airline's logo. |
| email |  | STRING | Contact email for the airline. |
| mobileNumber |  | STRING | Contact phone number. |
| address |  | STRING | Physical address of the airline HQ. |

---

#### User_info

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| userId | PK | STRING | Unique identifier for each registered user. |
| firstName |  | STRING | User's first name. |
| lastName |  | STRING | User's last name. |
| email |  | STRING | User's email address (should be UNIQUE). |
| password |  | STRING | Hashed password. |
| mobileNumber |  | STRING | User's contact number. |
| dateOfBirth |  | STRING | User's date of birth. |
| bookingHistory |  | STRING | Text field for storing historical booking summaries/notes (optional). |
| role |  | STRING | User role (e.g., 'Customer', 'Admin'). |
| createdOn |  | DATETIME | Timestamp for account creation. |
| updatedOn |  | DATETIME | Timestamp for last update. |

---

#### Flight_details

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| flightId | PK | STRING | Unique identifier for the specific flight. |
| airlineId | FK | STRING | Links to the operating airline (Airline_info). |
| fromLocation |  | STRING | Departure city/airport. |
| toLocation |  | STRING | Arrival city/airport. |
| departureDate |  | DATETIME | Scheduled departure date and time. |
| arrivalDate |  | DATETIME | Scheduled arrival date and time. |
| seatsAvailable |  | NUMBER | Number of available seats. |
| price |  | NUMBER | Base price of the flight. |
| createdOn |  | DATETIME | Timestamp for flight record creation. |
| updatedOn |  | DATETIME | Timestamp for last update. |

---

#### Booking_details

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| bookingId | PK | STRING | Unique identifier for the booking/reservation. |
| userId | FK | STRING | Links to the user who made the booking (User_info). |
| flightId | FK | STRING | Links to the specific flight booked (Flight_details). |
| bookingDate |  | DATETIME | Date/time the booking was made. |
| flightType |  | STRING | Type of flight (e.g., 'One-Way', 'Round-Trip'). |
| seatNumber |  | STRING | The specific seat number(s) assigned. |
| totalAmount |  | NUMBER | Total monetary value of the booking. |
| createdOn |  | DATETIME | Timestamp for booking creation. |
| updatedOn |  | DATETIME | Timestamp for last update. |

---

#### Passenger_details

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| passengerId | PK | STRING | Unique identifier for each passenger record. |
| userId | FK | STRING | Links to the user who created this passenger record (User_info). |
| bookingId | FK | STRING | **CRITICAL:** Links the passenger to the specific booking (Booking_details). |
| firstName |  | STRING | Passenger's first name. |
| lastName |  | STRING | Passenger's last name. |
| email |  | STRING | Passenger's email (if different from user). |
| mobileNumber |  | STRING| Passenger's contact number. |
| baggageDetails |  | STRING | Notes on baggage (e.g., weight, number of bags). |
| otherDetails |  | STRING | Miscellaneous details (e.g., special needs). |

---

#### Payment_details

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| paymentId | PK | STRING | Unique identifier for each payment transaction. |
| bookingId | FK | STRING | Links the payment transaction to the relevant booking (Booking_details). |
| amount |  | NUMBER| Monetary amount of the payment. |
| paymentDate |  | DATETIME | Date and time the payment was made. |
| paymentMethod |  | STRING | Method used (e.g., 'Card', 'PayPal'). |
| status |  | STRING | Payment status (e.g., 'Completed', 'Failed'). |
| createdOn |  | DATETIME | Timestamp for payment record creation. |
| updatedOn |  | DATETIME | Timestamp for last update. |

---

#### Ticket_info

| Attribute Name | Key Type | Data Type | Description |
|----------------|-----------|------------|--------------|
| ticketId | PK | STRING| Unique identifier for the generated ticket. |
| passengerId | FK | STRING | Links the ticket to the specific passenger (Passenger_details). |
| firstName |  | STRING | Passenger's first name (redundant but often stored for ticket printing). |
| lastName |  | STRING | Passenger's last name (redundant but often stored for ticket printing). |
| class |  | STRING | Travel class (e.g., 'Economy', 'Business'). |
| fare |  | NUMBER | Final fare price (after discounts, taxes). |

---


## 9. Glossary
Definitions of terms and acronyms used in the document.

| **Term / Acronym** | **Definition** |
|---------------------|----------------|
| **TSD** | **Technical Specifications Document** — a formal document describing the system’s technical and functional details. |
| **MVP** | **Minimum Viable Product** — the simplest version of the product that can be released to validate core functionality. |
| **ERD** | **Entity-Relationship Diagram** — a visual representation of data entities, their attributes, and relationships in a database. |
| **SPA** | **Single Page Application** — a web application that loads a single HTML page and dynamically updates content without reloading. |
| **API** | **Application Programming Interface** — a set of rules that allows one system or component to interact with another programmatically. |
| **Frontend** | The client-side part of the web application that users directly interact with (**UI/UX**). |
| **Backend** | The server-side part of the web application responsible for processing requests, managing logic, and interacting with the database. |
| **REST** | **Representational State Transfer** — an architectural style for designing networked applications, typically using HTTP requests. |
| **UI** | **User Interface** — the visual elements and layout through which a user interacts with a system. |
| **UX** | **User Experience** — the overall feeling and satisfaction users get when interacting with a product. |
| **NFR** | **Non-Functional Requirements** — system qualities such as performance, scalability, security, and usability. |
| **FR** | **Functional Requirements** — specific behaviors, actions, and features the system must implement. |
| **CRUD** | **Create, Read, Update, Delete** — the four basic operations of persistent data storage. |
| **PK** | **Primary Key** — a unique identifier for a record in a database table. |
| **FK** | **Foreign Key** — a field that links one database table to another. |
| **JSON** | **JavaScript Object Notation** — a lightweight data interchange format commonly used for APIs. |
| **Endpoint** | A specific URL or route in an API that allows clients to access or manipulate server resources. |
| **Wireframe** | A low-fidelity visual guide representing the skeletal framework of a web page or app. |
| **Figma** | A collaborative design tool used for creating **UI/UX** mockups and prototypes. |
| **Responsive Design** | A design approach ensuring that web interfaces adapt to different screen sizes and devices. |
| **Repository (Repo)** | A central location where project code, files, and version history are stored (e.g., on **GitHub**). |
| **Version Control** | A system that records changes to files and enables collaboration among multiple developers. |
| **Deployment** | The process of making a web application available for users to access online. |
| **Trello** | A project management tool used for task organization through boards and cards. |

## 10. Appendices

#### 10.1 Revision History
| Version | Date           | Author(s)                                      | Description / Changes Made                          |
|----------|----------------|------------------------------------------------|-----------------------------------------------------|
| 1.0.0    | October 15, 2025 | [Cris Bagotsay](https://github.com/blink1197/),<br> [Richard Delos Trinos](https://github.com/richard-DT) | Initial draft of the Technical Specifications Document. |
| 1.0.1    | October 18, 2025 | [Richard Delos Trinos](https://github.com/richard-DT) | Add ERD data types and public link to the ERD. |
| 1.0.2    | October 20, 2025 | [Cris Bagotsay](https://github.com/blink1197/) | Add new terms and definitions in Glossary section and update ERD link to point directly to draw.io link. |
| 1.0.3    | October 23, 2025 | [Cris Bagotsay](https://github.com/blink1197/) | Add pages overview to list the pages' name and purposes. |
| 2.0.0    | October 26, 2025 | [Richard Delos Trinos](https://github.com/richard-DT) | Add Phase 2 required static pages: Log-in, Register, About Us, Contact Us, User Profile, Error/ Empty State Page . |

#### 10.2 GitHub Repository & Collaboration Guidelines
* Repository: Create a new public GitHub repo called airline-booking-system.
* Document Format: TSD must be a markdown file in the repository.
* Collaboration: The Assigned Group Leader should add members via email invitation and must review updates before merging.

#### 10.3 Project Management (Trello Task Board)
* Deliverable: Create a Trello Task Board (which includes the instructor) to disseminate and assign task cards.
* Task Format: Task cards should follow the naming convention: FEAT000-<feature>.
* [Trello Link](https://trello.com/b/HF3RtK5X/airline-booking-system)

#### 10.4 Project Management (Trello Task Board)
* Duration: Group of 3-5 Bootcampers for a project lasting at least 2 weeks.
* Consultation: Groups must schedule at least three 30-minute consultation sessions (3 days prior) with the instructors/consultants during available work hours.<br> The Group Leader schedules the consultation using the Google Calendar App.
* Check-in: Instructors will check-in regularly via a group chat (created by the instructor).
