# DHL AutoSOP Engine (MVP)

An automated system designed for DHL Logistics Operations to transform unstructured, messy data (chats, emails, screenshots, handwritten notes) into standardized Standard Operating Procedures (SOPs) using Generative AI.

## 🏗️ Architecture
The system follows a **Three-Tier/Layered Architecture**:

* **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons. 
* **Backend:** NestJS (Node.js) with TypeScript.
* **Database:** MongoDB Atlas (NoSQL).
* **AI Engine:** Google Gemini 2.0 Flash (Multimodal).
* **Automation (Planned):** UiPath RPA for automatic data fetching.

## 🛠️ Setup and Installation

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local or Atlas account)
* Gemini API Key

### **1.  Clone the repository.**
```bash
git clone https://github.com/Chenxi0331/DHL.git
cd your-repo-name
```
### **2.  Backend Setup:**
1. Navigate to the backend folder:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a .env file in the backend root:
    ```bash
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
4. Start the backend:
     ```bash
    npm run start:dev
    ```

### **3.  Frontend Setup:**
1. Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend:
    ```bash
    npm run dev
    ```
