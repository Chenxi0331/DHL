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

## 📖 Usage Guide
### **Manual Ingestion**
1. Open the web dashboard.
2. Use the Manual Ingestion Form on the right sidebar.
3. For Text: Paste a messy email thread or chat log.
4. For Images: Upload a screenshot of an error or a photo of a handwritten instruction.
5. Click Process; the AI will generate a title, summary, and step-by-step guide.

### **Automated Ingestion (UiPath)**
The backend exposes a POST /ingest endpoint. You can configure a UiPath bot to:
* Monitor a shared DHL Google Drive folder.
* Send any new files to: http://localhost:3000/ingest as multipart/form-data.

## 📝 Example Inputs
### **Example 1: Messy Email (Text)**
**Input:** "Hey team, just a reminder that for all customs clearance in Zone B, we now need to check the stamp twice. First at the gate, then at the loading dock. Don't forget to log the ID in the blue folder. This started today."
**System Output:**
* **Title:** Zone B Customs Clearance Verification Procedure
* **Category:** Customs
* **Steps:**
1. Perform initial stamp check at the entry gate.
2. Conduct a second stamp verification at the loading dock.
3. Record the relevant ID into the designated blue folder.

### **Example 2: Screenshot (Image)**
**Input:** A screenshot of a WhatsApp conversation where a supervisor says: "If the scanner blinks red, pull the battery, wait 5 secs, and restart. If it stays red, send it to IT."
**System Output:**
* **Title:** Troubleshooting Red Light Scanner Errors
* **Summary:** Procedure for resolving scanner hardware alerts or escalating to technical support.
* **Steps:**
1. Remove the battery from the scanner.
2. Wait for a duration of 5 seconds.
3. Reinsert the battery and restart the device.
4. Escalate to the IT department if the red light persists.

## ✅ MVP Requirements Status
* [x] **Secured Login:** Placeholder implemented in UI.
* [x] **Raw Information Upload:** Supported (Text/File).
* [x] **Structured Article Conversion:** Fully automated via Gemini.
* [x] **Search & Manage:** Implemented via MongoDB and React List.
