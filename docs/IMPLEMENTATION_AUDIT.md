# Viva Analyser: Comprehensive Architecture & Implementation Audit

**Audit Date**: October 2026  
**System Status**: 100% Offline, Zero Cloud, Air-Gapped Capable  
**Environment**: Windows 11 / Node.js / React 19 / Vite / Ollama Engine  

---

## 1. Executive Summary & Existing Architecture

The **Viva Analyser** application is designed as a university oral examination and adaptive self-learning platform.
The project operates as an offline-first solution capable of running without external cloud dependencies.

### Architectural Tiers:
1. **Frontend**:
   - Single Page Application built on React 19 and Vite.
   - Component suite in `src/components/` (`VivaArena.jsx`, `FacultyDashboard.jsx`, `HomeDashboard.jsx`, `AuthModal.jsx`, `LearningDnaView.jsx`, etc.).
   - Client-side engines in `src/services/` (`aiQuestionService.js`, `universalOntology.js`, `adaptiveEngine.js`, `behavioralEngine.js`, `db.js`).
2. **Backend Server & Middleware**:
   - Standalone Production Offline Server in `server.cjs` and Vite plugin middleware in `vite.config.js`.
   - Local file-based record storage in `server/fileStorage.cjs` managing `Viva_Records/Students/`, `Viva_Records/Faculty_Consolidated/`, and `Viva_Records/Audit_Logs/`.
   - Modularity transition to `server/src/` providing clean service separation for AI routing, security, auth, and assessment.
3. **Local AI Engine**:
   - Direct integration with local Ollama runtime over `http://127.0.0.1:11434`.
   - Verified local models installed on system:
     - `llama3.2:1b` (1.3 GB) — Fast inference, question classification, progressive hints.
     - `llama3:latest` (4.7 GB) — Deep reasoning, mathematical derivations, misconception analysis.
     - `llama3.2:latest` (2.0 GB) — Intermediate reasoning, independent review.
   - Robust offline ontology fallback with procedural concept synthesis when local Ollama is offline.

---

## 2. Current Working Features vs Missing Features

| Category | Working Status | Current State | Deficiencies & Required Upgrade |
|---|---|---|---|
| **Vite Frontend Build** | Working | Clean production build with Rolldown / Vite 8 | Solved syntax error in ontology expansion; builds cleanly in <1s. |
| **Local File Storage** | Working | JSON reports, CSV summaries, master marklist | Needs cryptographic hash-chaining for tamper-evidence and strict session ownership validation. |
| **Ollama Detection** | Working | Checks `/api/tags` on `127.0.0.1:11434` | Needs formal task-based router, health monitoring, and latency telemetry. |
| **Question Domain Coverage** | Partially Working | Multi-domain templates in ontology | Can lean on generic templates when unfamiliar topics are chosen; must be strictly concept-grounded with reference material across all disciplines (ECE, CSE, Mech, Medicine, Law, etc.). |
| **Answer Evaluation** | Needs Overhaul | Naive keyword and length checks | Susceptible to false-positive scoring on keyword stuffing. Needs layered evaluation: gibberish filter, ontology rubric, concept extraction, misconception detection, and LLM semantic grading. |
| **Hint Progression** | Working | 4 progressive hints | Must guarantee zero answer leakage and match question difficulty dynamically. |
| **Authentication & Sessions** | Incomplete | In-memory / client-stored IDs | Must derive all permissions from verified server-side sessions with PBKDF2/SHA-256 salted hashes, role separation, and offline account recovery. |
| **Multimodal Questions** | Basic | Text and MCQ | Needs LaTeX equations, SVG diagrams/circuits, SVG plots, algorithm tracing, and numerical problem types with separate parameter/unit grading. |
| **Document Grounding** | Primitive | Raw text snippet passing | Needs structured document ingestion (PDF/TXT/MD), chunking, section extraction, and local semantic/keyword passage retrieval. |

---

## 3. Detected AI Models and Task Assignment

Verified via local command `ollama list`:
- `llama3.2:1b` (Fast Engine):
  - Sub-second responses.
  - Generates concept-specific questions, classifies taxonomy levels, formats hints.
- `llama3:latest` (Reasoning Engine):
  - Advanced reasoning, derivation checks, multi-step math verification, complex case study evaluation.
- `llama3.2:latest` (Review & Evaluation Engine):
  - Independent secondary evaluation of high-stakes or ambiguous student responses.
- `Deterministic Procedural Fallback`:
  - Activates when Ollama is stopped or unavailable. Ensures complete functionality with zero cloud calls.

---

## 4. API Endpoints: Existing & Proposed

### Existing Endpoints:
- `GET /api/health` — Offline server status.
- `GET /api/lan-info` — Host IP and LAN access URLs.
- `GET /api/ollama/status` — Checks Ollama reachable and lists models.
- `POST /api/ollama/generate` — Raw Ollama text generation proxy.
- `POST /api/assessment/evaluate` — Authoritative scoring endpoint.
- `POST /api/ai/generate` — Question generation endpoint.
- `POST /api/save-record` — Persists viva report to `Viva_Records/`.
- `GET /api/open-folder` — Opens records folder in Windows Explorer.
- `GET /api/records-summary` — Summarizes saved records.

### Upgraded / Proposed Endpoints:
- `POST /api/auth/register` — User registration with salted hashing.
- `POST /api/auth/login` — Secure session creation with HTTP-only cookies / token header.
- `POST /api/auth/logout` — Session revocation.
- `GET /api/auth/session` — Authoritative identity verification.
- `POST /api/auth/recovery/request` — Offline faculty-assisted account recovery token generation.
- `POST /api/auth/recovery/reset` — One-time token password reset with session invalidation.
- `GET /api/ai/models/status` — Comprehensive AI model health, roles, latency, and routing metrics.
- `POST /api/documents/upload` — Ingests and indexes faculty reference documents locally.
- `GET /api/documents/list` — Lists uploaded reference documents for authenticated faculty.
- `POST /api/ai/viva/grounded-question` — Fully grounded multimodal question generation.
- `POST /api/ai/viva/evaluate-layered` — Multi-layered semantic answer evaluation.
- `POST /api/anti-cheat/event` — Tamper-evident behavioral telemetry logging.

---

## 5. Security & Data Isolation Analysis

1. **Client Identity Spoofing Prevention**:
   - The server must never trust client-supplied `studentId` or `facultyId`. Every request must derive identity from a verified cryptographically random session token.
2. **Access Control**:
   - Students can only view their own viva records.
   - Faculty can only access records for their assigned subjects and enrolled students.
3. **Storage Isolation**:
   - Faculty documents and student assessment records are stored in isolated file paths with path-traversal prevention.
4. **Air-Gap Guarantee**:
   - Zero outbound requests to cloud APIs or analytics services. All AI generation happens locally on `127.0.0.1:11434`.

---

## 6. Implementation & Testing Roadmap

1. **Phase 1: Architecture Audit & Documentation** — Complete `IMPLEMENTATION_AUDIT.md`.
2. **Phase 2: Local AI Model Router & Orchestrator** — Implement `server/src/ai/modelRouter.js`, `modelRegistry.js`, `modelHealth.js`, `taskClassifier.js`, and `modelPolicy.js`.
3. **Phase 3: Domain-Grounded Question Pipeline** — Implement `contextBuilder.js`, `questionGenerator.js`, `questionSchemas.js`, and `outputValidator.js`.
4. **Phase 4: Local Document Ingestion & Reference Grounding** — Implement `documentProcessor.js` and `referenceRetriever.js`.
5. **Phase 5: Layered Evaluation Engine** — Implement `answerAnalyser.js` removing false-positive keyword bias.
6. **Phase 6: Concept-Specific Adaptive Hints** — Implement `hintGenerator.js` with anti-leak verification.
7. **Phase 7: Adaptive Difficulty & Mastery State** — Implement `masteryEngine.js` and `difficultyEngine.js`.
8. **Phase 8: Hardened Authentication, Offline Recovery & Isolation** — Implement secure session auth, password show/hide, offline reset tokens.
9. **Phase 9: Integrity, Anti-Malpractice & Tamper-Evident Storage** — Implement audit event logging with SHA-256 hash chaining.
10. **Phase 10: Server Integration** — Unify `server.cjs` and `vite.config.js` with new modular services.
11. **Phase 11: Frontend Multimodal & UI Enhancements** — Upgrade KaTeX math rendering, SVG diagrams, show/hide passwords, and AI telemetry panel.
12. **Phase 12: Automated Integration Testing & Verification** — Comprehensive automated tests across diverse disciplines.
