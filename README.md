# VIVA ANALYSER — Universal Adaptive Cognitive Viva Engine & Learning DNA Platform

> **100% Offline Local AI • Domain-Independent • Zero External APIs • Installable on Any PC, Mobile Phone, or Tablet**
>
> Built for hackathons, institutional examinations, autonomous student mastery, and continuous assessment.

---

## 💻 How to Run on Another PC Using VS Code (Complete Step-by-Step)

When copying this project folder to another PC (via USB drive, ZIP archive, or Git), follow these exact steps to run it in **VS Code**:

### Prerequisites
1. **Node.js** (v18 or higher recommended, includes npm).
   - Check if installed by opening terminal and typing: `node -v` and `npm -v`.
   - If not installed, download the free LTS version from [https://nodejs.org/](https://nodejs.org/).
2. **VS Code** (Visual Studio Code).

---

### Step 1: Open the Project in VS Code
1. Copy or extract the `VIVA ANALYSER` folder onto the new PC.
2. Launch **VS Code**.
3. Click **File** → **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
4. Select the `VIVA ANALYSER` folder.

---

### Step 2: Open the Integrated Terminal in VS Code
1. In VS Code, press `` Ctrl + ` `` (Backtick) or click **Terminal** → **New Terminal**.
2. Ensure the terminal path is inside `VIVA ANALYSER`:
   ```powershell
   # Your terminal prompt should show:
   c:\Users\<YourUser>\...\VIVA ANALYSER>
   ```

---

### Step 3: Install Dependencies
Run the install command to set up all packages (React, Vite, Lucide Icons, Canvas-Confetti, QR Code, etc.):
```bash
npm install
```
*(Takes ~15–30 seconds. All libraries are standard, lightweight dependencies).*

---

### Step 4: Run the Development Server
Launch the server with the `--host` flag so it's accessible to both the PC and mobile phones on your Wi-Fi:
```bash
npm run dev -- --host
```

You will see output in the VS Code terminal like:
```text
  VITE v8.3.1  ready in 420 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/ (or your local IP)
  ➜  press h + enter to show help
```

---

### Step 5: Open in Your Browser
- In VS Code, hold `Ctrl` and click on `http://localhost:5173/`, or open your browser (**Chrome**, **Edge**, **Brave**) and enter:
  ```text
  http://localhost:5173/
  ```
- The app will load with the light background, dark buttons, voice questions, audio synthesizer, and real-time security shield active.

---

### Alternative: Production Build & Standalone Run
If you want to test the optimized production build or run it without Node dev tools:

#### Option A: Vite Production Bundle
```bash
npm run build
npm run preview -- --host
```

#### Option B: Standalone 1-Click Batch File (Windows)
Double-click `run_app.bat` inside the folder. It automatically detects your local IP, starts the offline server, and launches your default browser.

#### Option C: Zero-Dependency Python Server (Runs on Any PC with Python)
```bash
python start_server.py
```
And navigate to `http://localhost:8000/`.

---

## 📱 Mobile Phone & Tablet Access Links (Android & iOS)

You can run and install VIVA ANALYSER on any smartphone or tablet without app store downloads:

### 1. Direct Network URL
1. Ensure your phone is connected to the **same Wi-Fi or laptop mobile hotspot**.
2. Look at the VS Code terminal output or click **"Connect Phone"** in the top navigation bar to view your PC's IP address.
3. Open your mobile browser and enter:
   ```text
   http://<YOUR_PC_IP>:5173/
   ```
   *(Example: `http://10.52.212.218:5173/`)*
4. Or simply point your phone camera at the on-screen **QR Code**.

---

### 2. Install as a Free Native Mobile App (PWA)

#### On Android (Google Chrome)
1. Open the URL in **Chrome**.
2. Tap the **three-dot menu (`⋮`)** in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. An app icon titled **VIVA ANALYSER** will be created on your home screen. It opens full-screen without browser address bars and works 100% offline via the included Service Worker.

#### On iPhone / iPad (Safari)
1. Open the URL in **Safari**.
2. Tap the **Share icon** (`⎋` - square with arrow pointing up) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. The app installs directly on your iOS home screen.

#### On Windows / Mac (Desktop App Mode)
1. Open `http://localhost:5173/` in Chrome or Edge.
2. In the right side of the address bar, click the **Install** monitor icon.
3. VIVA ANALYSER will launch in its own standalone desktop window.

---

## 🌟 Comprehensive Feature Catalog (All Built-in Capabilities)

VIVA ANALYSER contains **all required innovations and assessment engines** built locally with zero external API dependencies:

### 1. Universal Subject & Domain Independence
- **14 Master Domain Categories**:
  - Engineering & Technology (40+ branches: ECE, EEE, CSE, IT, AI/ML, Mech, Civil, Aero, Robotics, Bio, IoT, VLSI, etc.)
  - Pure & Applied Sciences (Physics, Chemistry, Math, Stats, Bio, Astronomy, Material Science)
  - Medical, Healthcare & Life Sciences (Anatomy, Pharmacology, Genetics, Pathology)
  - Management, Business & Finance (Marketing, FinTech, Economics, Supply Chain)
  - Law & Legal Studies (Constitutional Law, Jurisprudence, Cyber Law, Criminal Law)
  - Humanities & Social Sciences (Psychology, Philosophy, Sociology, History)
  - Vocational, ITI & Skill Certifications (Electrician, CNC Machining, Welding, Cloud Ops)
  - Competitive & Professional Exams (GATE, UPSC, JEE, NEET, GRE, CFA, AWS, PMP)
  - Emerging & Future Technologies (Quantum Computing, BCI, Fusion Energy, Nanotechnology)
- **Universal Dynamic Synthesizer**: Type **ANY** custom topic into the search bar, and the offline ontology engine dynamically synthesizes concept graphs, Bloom's questions, 4-tier hints, and rubrics.

### 2. Faculty Quiz Deadline & Total Marks Enforcement
- **Faculty Quiz Deadline Countdown Clock**: Large, prominent countdown timer displaying remaining quiz time with visual warning states (green $\rightarrow$ amber $\rightarrow$ pulsing red).
- **Auto-Submission on Deadline Expiry**: Automatically locks inputs and evaluates all completed questions when the deadline reaches zero.
- **Dynamic Question Marks Assignment**: Dynamically weights questions (e.g. 15, 25, 30, 30 marks) to sum exactly to the total marks set by faculty (e.g. 100 Marks).
- **Configurable Policies**: Faculty can set overall duration (minutes), per-question limits (seconds), passing marks, late submission penalties, and strict auto-submission enforcement.

### 3. Question Attending Time Analysis & Baseline Comparison
- **Per-Question Attending Timer**: Tracks active thinking and typing time for each question in real time (`00:15 / 02:00`).
- **Student Historical Baseline Tracker**: Stores and updates average answering speed across sessions (e.g. `45s avg`).
- **Timing Deviation & Anomaly Detection**:
  - Compares attending time against theoretical human reading & typing minimums (90 WPM / 7.5 CPS).
  - Flags superhuman speed bursts (answering a 50-word question in < 5 seconds).
  - Flags abnormal delays and late timeouts exceeding allocated question limits.

### 4. Zero Copy-Paste & Behavioral Anti-Cheat Authenticity Shield
- **Strict Copy-Paste Prevention**: Intercepts and blocks `Ctrl+C`, `Ctrl+V`, `Ctrl+X`, Right-Click context menus, and drag-and-drop injections.
- **Keystroke Dynamics Cadence Engine**: Measures real-time typing rhythm, words per minute (WPM), characters per second (CPS), and inter-key variance.
- **Window Blur & Focus Breach Monitor**: Logs every tab switch or minimized window.
- **AI Misuse Detection**: Scans natural language answers for stereotypical LLM phrasing and artificial burst dumps.
- **Live Authenticity Meters**:
  - Authenticity Score (`0–100%`)
  - Human Rhythm Confidence (`0–100%`)
  - Interceptions Blocked Counter
  - Focus / Tab Switches Counter
- **⚡ Demo Auto-Answer**: Built-in helper button for testing and demonstration that fills model answers with authentic keystroke cadence without manual typing.

### 5. Multi-Level Adaptive Hint Engine (Levels 1–4)
- Provides progressive scaffolding without revealing direct answers:
  - **Level 1**: Tiny Clue (Subtle reminder)
  - **Level 2**: Concept Direction (Governing formulas/principles)
  - **Level 3**: Structured Guidance (Step-by-step breakdown)
  - **Level 4**: Reasoning Path (Causal logical deduction)

### 6. Multi-Agent AI Architecture (7 Cooperating Local Personas)
- Side drawer displaying 7 autonomous agents working in harmony 100% offline:
  1. **Question Generation Agent**: Bloom's taxonomy & evolution.
  2. **Difficulty Calibration Agent**: Real-time equilibrium formula.
  3. **Knowledge Gap Agent**: Prerequisite dependency monitor.
  4. **Reasoning & Logic Agent**: Step-by-step causal proof analyzer.
  5. **Curiosity & Inquiry Agent**: Exploration profiler.
  6. **Mastery Verification Agent**: 5-threshold evaluator.
  7. **Security & Anti-Cheat Agent**: Keystroke cadence & zero copy-paste.

### 7. Learning DNA Profile & Cognitive Digital Twin
- **Hexagonal Radar Chart**: Visualizes 6 cognitive learning dimensions (Visual, Analytical, Practical, Memory, Research, Learning Velocity).
- **Cognitive Twin Model**: Tracks Adaptive IQ, Reasoning Score, Retention Score, Curiosity Index, and Innovation Index.
- **Ebbinghaus Forgetting Curve**: Predicts memory decay at 1-day, 7-day, 30-day, and 90-day intervals, scheduling spaced review interventions.

### 8. Interactive Knowledge Graph & Prerequisite Dependency Engine
- Visual SVG concept network mapping foundational prerequisites.
- Backward traversal engine automatically isolates weak prerequisite concepts when mistakes occur.

### 9. Autonomous Learning Mode
- 5-stage self-directed learning roadmaps for independent student study with zero faculty required.

### 10. Industry Readiness & Real-World Perspectives
- Switch between **Engineer View** (production constraints, MTBF), **Researcher View** (novel algorithmic limits, IEEE journals), and **Startup Founder View** (unit economics, defensible moats).
- **Innovation Challenge Portal**: Solicits alternative architectural designs to boost creativity.

### 11. Faculty Dashboard & Institutional Control
- Sub-tabs for **Quiz Deadline Setup**, **Timing & Malpractice Analysis Table**, **Knowledge Gap Heatmap**, **Student Roster**, **Anti-Cheat Audit Trail**, and **Password Recovery Queue**.

### 12. Student Authentication & 3-Mode Password Recovery
- Local encrypted authentication (SHA-256 Web Crypto hashing).
- 3 password recovery channels: **Email OTP**, **Mobile SMS OTP**, and **Faculty Recovery Queue**.

### 13. Official Verifiable Assessment Dossier Export
- Generates official evaluation reports with question-by-question timing breakdowns, behavioral integrity certificates, and cryptographic verification hashes.
- Exports to **Print/PDF**, **JSON Data Package**, or downloadable **Self-Contained Standalone HTML Dossier**.

### 14. Inspiring Light Aesthetics & Dark Buttons UI
- Clean, inspiring porcelain light background (`#f8fafc` Slate-50) with soft atmospheric gradients.
- Pristine white cards with subtle borders and shadows.
- Commanding, high-contrast **Midnight Obsidian / Dark Slate-900 buttons** with crisp white text.
- Two-column structured responsive dashboard separating the question workspace from timing & security monitors.

---

## 🔐 Default Demo Login Credentials

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `714022104055` | `password123` | Viva Arena, Learning DNA, Knowledge Graph, Autonomous Mode, Reports |
| **Faculty Admin** | `faculty@viva.edu` | `password123` | Full Access + Faculty Dashboard (Deadlines, Marks, Malpractice Logs, Recovery) |

*(You can also click the quick **"Student"** or **"Faculty"** autofill buttons on the login modal).*

---

## 📁 Repository Directory Structure

```text
VIVA ANALYSER/
├── public/
│   ├── icon-192.png            # PWA Android icon
│   ├── icon-512.png            # PWA splash icon
│   ├── manifest.json           # PWA Web App manifest
│   └── sw.js                   # Offline Service Worker cache
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx             # Login, Registration & 3-Mode OTP Recovery
│   │   ├── AutonomousMode.jsx        # Self-directed 5-step learning roadmaps
│   │   ├── DeviceConnectModal.jsx    # SVG QR code & multi-device instructions
│   │   ├── DomainBrowserModal.jsx    # 14 domains & 120+ disciplines directory
│   │   ├── FacultyDashboard.jsx      # Quiz deadlines, timing audit & recovery
│   │   ├── KnowledgeGraphView.jsx    # Interactive SVG concept dependency graph
│   │   ├── LearningDnaView.jsx       # Hexagonal Radar chart & Ebbinghaus curve
│   │   ├── MultiAgentDrawer.jsx      # 7 cooperating offline AI personas
│   │   ├── Navbar.jsx                # Responsive navbar with dark buttons
│   │   ├── ReportModal.jsx           # Printable PDF & offline HTML dossier
│   │   └── VivaArena.jsx             # 2-column assessment arena & timing engine
│   ├── services/
│   │   ├── adaptiveEngine.js         # Bloom questions, difficulty, marks evaluator
│   │   ├── behavioralEngine.js       # Zero-copy shield, keystrokes, timing audit
│   │   ├── db.js                     # Local storage, SHA-256 crypto, sessions
│   │   ├── soundEffects.js           # Procedural Web Audio synth & Web Speech voice
│   │   └── universalOntology.js      # 14 categories & universal generative engine
│   ├── App.jsx                       # Root router & layout wrapper
│   ├── index.css                     # Light background & dark buttons design system
│   └── main.jsx                      # React 19 root bootstrap
├── index.html                  # HTML5 entry with PWA headers & Google Fonts
├── package.json                # Project dependencies & build scripts
├── run_app.bat                 # Windows 1-click launcher
├── run_app.sh                  # Mac/Linux launcher
├── start_server.py             # Standalone offline Python web server
├── vite.config.js              # Vite configuration
└── README.md                   # Complete documentation & quickstart guide
```

---

## 📄 License & Certification

Built for academic assessment integrity, high-stakes university viva voce examinations, and student learning acceleration. Works 100% offline with zero cloud dependency.
