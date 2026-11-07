import os
import json
import re
from typing import Dict, Any, List, Optional
from config import GEMINI_API_KEY, DEFAULT_GEMINI_MODEL

# Built-in academic knowledge repository for instant, high-fidelity offline/demo mode
KNOWLEDGE_BASE = {
    "quantum": {
        "title": "Engineering Physics: Quantum Wave Mechanics & Tunneling",
        "subject": "Engineering Physics",
        "chapter_summary": "Quantum Mechanics revolutionizes classical physics by establishing that matter and radiation exhibit dual wave-particle properties. Central to this framework is Louis de Broglie's hypothesis that particles possess a characteristic wavelength inversely proportional to their momentum, Werner Heisenberg's Uncertainty Principle demonstrating fundamental limits on concurrent measurement of conjugate variables, and Erwin Schrödinger's wave equation governing quantum state evolution in time and space.",
        "key_points": [
            "Wave-particle duality: Matter displays both corpuscular and wave characteristics depending on the experimental observation.",
            "de Broglie relation: λ = h / p = h / (m * v), connecting microscopic momentum to wave propagation.",
            "Heisenberg Uncertainty Principle: Δx * Δp ≥ ℏ / 2; impossible to measure position and momentum simultaneously with arbitrary precision.",
            "Born Interpretation: The wave function Ψ is not directly observable; |Ψ|² dV represents the probability density of locating the particle.",
            "Schrödinger Time-Independent Wave Equation (1D): ( -ℏ² / 2m ) * (d²Ψ / dx²) + V(x)Ψ = EΨ.",
            "Quantum Tunneling: Finite probability of a quantum particle penetrating a potential energy barrier higher than its kinetic energy.",
            "Boundary Conditions: The wave function Ψ must be continuous, single-valued, and finite everywhere in space."
        ],
        "simple_explanation": "Imagine rolling a tennis ball against a solid concrete wall. In everyday life, the ball always bounces back. But in the microscopic quantum world, an electron acts like a wavy ghost. Sometimes, instead of bouncing back, a fraction of its wave leaks through the wall, and the electron suddenly appears on the other side! This 'quantum magic' is called Quantum Tunneling—and without it, the Sun would not shine and modern USB flash memory chips wouldn't work.",
        "important_definitions": [
            {"term": "de Broglie Wavelength", "definition": "The wavelength associated with a moving particle, given by λ = h/p, demonstrating that all matter has wave properties."},
            {"term": "Wave Function (Ψ)", "definition": "A mathematical complex function describing the quantum state of an isolated quantum system containing all physically knowable information."},
            {"term": "Probability Density (|Ψ|²)", "definition": "The square of the absolute value of the wave function, representing the probability of finding a particle per unit volume at a given point in space."},
            {"term": "Quantum Tunneling", "definition": "A quantum mechanical phenomenon where a particle transitions through a classically forbidden potential energy barrier whose height exceeds the particle's energy."},
            {"term": "Zero-Point Energy", "definition": "The lowest possible energy that a quantum mechanical system may possess, mandated by Heisenberg's Uncertainty Principle."}
        ],
        "formulas": [
            {"name": "de Broglie Wavelength", "formula": "λ = h / p = h / (m · v) = h / √(2mE)", "description": "Relates wavelength λ to Planck's constant h, momentum p, particle mass m, velocity v, and kinetic energy E."},
            {"name": "Heisenberg Uncertainty (Position & Momentum)", "formula": "Δx · Δp ≥ ℏ / 2 = h / (4π)", "description": "Fundamental limit where ℏ = h / (2π) is the reduced Planck constant."},
            {"name": "Heisenberg Uncertainty (Energy & Time)", "formula": "ΔE · Δt ≥ ℏ / 2", "description": "Uncertainty relation between energy states and state lifetime."},
            {"name": "1D Time-Independent Schrödinger Equation", "formula": "- (ℏ² / 2m) · (d²Ψ / dx²) + V(x)Ψ = EΨ", "description": "Kinetic energy operator + Potential energy operator = Total Energy eigenvalue E."},
            {"name": "Particle in 1D Infinite Potential Well Energy", "formula": "E_n = (n² · π² · ℏ²) / (2m · L²) = (n² · h²) / (8m · L²)", "description": "Quantized energy levels where n = 1, 2, 3... and L is well width."}
        ],
        "examples": [
            {
                "title": "Calculate de Broglie Wavelength of an Accelerated Electron",
                "problem": "An electron is accelerated through a potential difference of V = 100 Volts. Calculate its associated de Broglie wavelength.",
                "solution": "Formula: λ = h / √(2 · m · e · V)\nSubstitute constants:\nh = 6.626 × 10⁻³⁴ J·s\nm = 9.109 × 10⁻³¹ kg\ne = 1.602 × 10⁻¹⁹ C\nShortcut formula: λ = 12.27 / √V Å = 12.27 / √100 = 12.27 / 10 = 1.227 Å (or 0.1227 nm).\nAnswer: 1.227 Å (X-ray region)."
            },
            {
                "title": "Quantum Tunneling in Alpha Decay",
                "problem": "Explain why radioactive uranium nuclei can emit alpha particles whose energies are much lower than the Coulomb nuclear barrier.",
                "solution": "Inside the nucleus, the alpha particle has ~4-9 MeV of energy, while the electrostatic Coulomb barrier height is ~25-30 MeV. Under classical mechanics, emission is impossible. Quantum mechanically, the wave function Ψ penetrates into the barrier and emerges with a non-zero transmission coefficient T, allowing the particle to tunnel through."
            }
        ],
        "diagrams": [
            {
                "title": "Quantum Tunneling through a Potential Barrier V₀",
                "type": "svg_and_ascii",
                "ascii_art": """
Energy |
  V₀   |         +-----------------+  <-- Potential Barrier (V₀ > E)
       |         |                 |
   E   | ~~~~~~~~|.................|~~~~~~~~~
       | Wave Ψ₁ | Decaying Wave Ψ₂| Transmitted Wave Ψ₃
       | (Incident)|  (Exponential)| (Reduced Amplitude)
       +---------+-----------------+-------------------> x
                x = 0             x = L
                """,
                "description": "An incident wave Ψ₁ approaches from x < 0. Inside the barrier (0 < x < L), the wave function undergoes exponential decay. At x > L, a transmitted wave Ψ₃ continues with reduced amplitude."
            }
        ],
        "two_mark_qa": [
            {"q": "State de Broglie hypothesis.", "a": "Louis de Broglie hypothesized that dual nature of radiation applies equally to matter: every moving particle is accompanied by a matter wave whose wavelength λ is h/p."},
            {"q": "What is the physical significance of the wave function Ψ?", "a": "Ψ itself has no direct physical meaning as it can be complex. However, |Ψ|² represents the probability density of finding the particle at a given point in space and time."},
            {"q": "Why is Heisenberg's uncertainty principle not noticeable in our daily lives?", "a": "Because Planck's constant h is extremely minute (~6.626 × 10⁻³⁴ J·s), so the product Δx·Δp for macroscopic objects is imperceptible compared to their large mass."}
        ],
        "five_mark_qa": [
            {"q": "Derive the energy eigenvalues for a particle trapped in an infinite 1-dimensional potential well.", "a": "Inside the well (0 < x < L), V(x)=0. The wave equation is d²Ψ/dx² + k²Ψ = 0 where k² = 2mE/ℏ². The general solution is Ψ(x) = A sin(kx) + B cos(kx). Applying boundary condition Ψ(0)=0 gives B=0. Applying Ψ(L)=0 gives A sin(kL)=0, which implies kL = nπ (n=1,2,3...). Hence k = nπ/L. Since k² = 2mE/ℏ², solving for E yields E_n = (n²π²ℏ²)/(2mL²). Energy is strictly quantized!"}
        ],
        "sixteen_mark_qa": [
            {
                "q": "Formulate Schrödinger's 1-Dimensional Time-Independent Wave Equation from first principles and discuss the boundary conditions.",
                "a": "### 1. Introduction & Physical Motivation\nClassical mechanics fails to describe atomic phenomena like blackbody radiation, photoelectric effect, and atomic line spectra. Schrödinger introduced a wave mechanics approach where particles are represented by wave functions Ψ(x).\n\n### 2. Mathematical Formulation\nA standard harmonic plane matter wave moving in the +x direction is expressed as:\nΨ(x, t) = A · e^(i(kx - ωt))\nWhere wave number k = 2π/λ = p/ℏ, and angular frequency ω = 2πν = E/ℏ.\n\nTaking partial derivative with respect to x:\n∂Ψ/∂x = i·k·Ψ\n∂²Ψ/∂x² = (ik)²·Ψ = -k²·Ψ = -(p²/ℏ²)·Ψ\n\nMultiplying by -(ℏ² / 2m):\n-(ℏ² / 2m) · (∂²Ψ / dx²) = (p² / 2m) · Ψ = Kinetic Energy · Ψ\n\n### 3. Incorporating Total Energy\nTotal Energy E = Kinetic Energy (K.E) + Potential Energy V(x):\nE = (p² / 2m) + V(x)\nMultiply both sides by wave function Ψ(x):\nE·Ψ(x) = [-(ℏ² / 2m) · (d²Ψ/dx²)] + V(x)·Ψ(x)\n\nRearranging into standard operator form:\n-(ℏ² / 2m) · (d²Ψ / dx²) + V(x)·Ψ = E·Ψ\nOr in Hamiltonian operator notation: ĤΨ = EΨ, where Ĥ = -(ℏ²/2m)∇² + V.\n\n### 4. Essential Boundary Conditions for Well-Behaved Wave Functions\nTo represent physically realistic probability amplitudes, Ψ(x) must satisfy:\n1. **Finiteness**: Ψ(x) must remain finite everywhere in space so ∫|Ψ|²dx converges.\n2. **Single-Valued**: For each coordinate x, Ψ(x) has exactly one unique value.\n3. **Continuity**: Both Ψ(x) and its spatial derivative dΨ/dx must be continuous across all region boundaries.\n4. **Normalizability**: Total probability over all space must equal 1: ∫₋∞⁺∞ |Ψ(x)|² dx = 1."
            }
        ],
        "flashcards": [
            {"front": "Formula for de Broglie wavelength λ", "back": "λ = h / p = h / (m · v) = 1.227 / √V nm (for electrons)"},
            {"front": "What does |Ψ|² represent?", "back": "Probability Density: the probability per unit volume of finding the particle at coordinate (x, y, z)."},
            {"front": "Heisenberg Uncertainty Relation for position and momentum", "back": "Δx · Δp ≥ ℏ / 2 = h / (4π)"},
            {"front": "Lowest energy state in an infinite well", "back": "E₁ = (π² · ℏ²) / (2m · L²), known as Zero-Point Energy (cannot be zero!)."},
            {"front": "Application of Quantum Tunneling", "back": "Scanning Tunneling Microscopes (STM), Flash NAND memory, Alpha decay, Nuclear fusion in stars."}
        ],
        "mcqs": [
            {
                "question": "If the kinetic energy of a free electron is doubled, how does its de Broglie wavelength change?",
                "options": ["Doubles", "Halves", "Decreases by a factor of √2", "Increases by √2"],
                "correct_index": 2,
                "explanation": "Since λ = h / √(2mE), wavelength is inversely proportional to the square root of energy. If E becomes 2E, λ becomes λ / √2."
            },
            {
                "question": "Which boundary condition must the quantum wave function Ψ satisfy everywhere?",
                "options": ["Must equal zero everywhere", "Must be discontinuous at boundaries", "Must be single-valued, continuous, and finite", "Must always be a real number"],
                "correct_index": 2,
                "explanation": "To represent a valid physical probability distribution, Ψ must be single-valued, continuous, and finite throughout space."
            },
            {
                "question": "Why can the ground state energy of a particle in an infinite potential box NEVER be zero?",
                "options": ["Violates conservation of charge", "Violates Heisenberg's Uncertainty Principle", "Speed of light would be exceeded", "Mass would vanish"],
                "correct_index": 1,
                "explanation": "If energy E=0, momentum p=0 and Δp=0. Since the particle is confined to width L (Δx ≤ L), Δx·Δp = 0, which directly violates Δx·Δp ≥ ℏ/2."
            },
            {
                "question": "In quantum tunneling through a rectangular barrier, how does the wave function behave inside the barrier?",
                "options": ["Sinusoidally oscillates", "Decays exponentially", "Grows exponentially", "Instantly drops to zero"],
                "correct_index": 1,
                "explanation": "Inside the barrier where V₀ > E, the wave number is imaginary, transforming the oscillatory wave into an exponential decay Ψ(x) ∝ e^(-αx)."
            }
        ],
        "revision_sheet": [
            "⚡ de Broglie: λ = h / p (particle behaves as wave).",
            "⚡ Heisenberg: Δx·Δp ≥ ℏ/2 (simultaneous exact measurement prohibited).",
            "⚡ Schrödinger Equation: ĤΨ = EΨ (state evolution in quantum space).",
            "⚡ Normalization: ∫ |Ψ|² dx = 1 (100% certainty particle exists in universe).",
            "⚡ Zero-Point Energy: Particle cannot be at rest in a confined box (E₁ > 0).",
            "⚡ Tunneling: Probability transmission T > 0 even when barrier height V₀ > E."
        ]
    },
    "os": {
        "title": "Operating Systems: CPU Scheduling, Deadlocks & Banker's Algorithm",
        "subject": "Operating Systems & Computer Science",
        "chapter_summary": "Process management lies at the core of multitasking operating systems. This module covers CPU scheduling algorithms designed to maximize throughput and minimize turnaround and waiting times, synchronization mechanisms, the four necessary conditions for system deadlock, and Dijkstra's Banker's Algorithm for deadlock avoidance.",
        "key_points": [
            "Process Life Cycle: New → Ready → Running → Waiting (Blocked) → Terminated.",
            "CPU Scheduling Criteria: Maximize CPU Utilization and Throughput; Minimize Turnaround Time, Waiting Time, and Response Time.",
            "Common Scheduling Algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF/SRTF), Priority Scheduling, and Round Robin (RR).",
            "Convoy Effect: In FCFS, short processes wait behind long CPU-burst processes, drastically increasing average waiting time.",
            "Deadlock Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
            "Banker's Algorithm: A deadlock avoidance algorithm testing for system safety state by allocating resources only if a safe sequence exists.",
            "Context Switch Overhead: Time taken by the CPU to save process PCB state and load another process."
        ],
        "simple_explanation": "Think of a busy hospital emergency room. The doctor is the CPU. If the doctor treats patients purely by whoever arrived first (FCFS), a patient with a minor cold could hold up the doctor while someone with a critical condition waits outside! Round Robin gives every patient 5 minutes before moving to the next. And a Deadlock is like a 4-way traffic intersection where 4 cars all pull halfway in and block each other—nobody can move until a car backs up!",
        "important_definitions": [
            {"term": "Turnaround Time (TAT)", "definition": "The interval from the time of submission of a process to the time of its completion: TAT = Completion Time - Arrival Time."},
            {"term": "Waiting Time (WT)", "definition": "The total amount of time a process has spent waiting in the ready queue: WT = Turnaround Time - Burst Time."},
            {"term": "Preemptive Scheduling", "definition": "A scheduling strategy where the operating system can interrupt a running process and reassign the CPU to a higher priority process."},
            {"term": "Deadlock", "definition": "A state in which every process in a set is waiting for an event that can only be caused by another process in the same set."},
            {"term": "Safe State", "definition": "A state where the operating system can allocate resources to each process in some sequence without encountering a deadlock."}
        ],
        "formulas": [
            {"name": "Turnaround Time", "formula": "TAT = Completion Time (CT) - Arrival Time (AT)", "description": "Measures total lifespan of the process in the system."},
            {"name": "Waiting Time", "formula": "WT = Turnaround Time (TAT) - Burst Time (BT)", "description": "Actual duration spent waiting in ready queue."},
            {"name": "Banker's Algorithm Need Matrix", "formula": "Need[i][j] = Max[i][j] - Allocation[i][j]", "description": "Remaining resources process P_i requires to finish execution."},
            {"name": "Safety Condition", "formula": "Need[i] ≤ Available", "description": "Process P_i can only proceed if its maximum remaining need is covered by currently available resources."},
            {"name": "Work Update after Completion", "formula": "Work = Work + Allocation[i]", "description": "When process P_i finishes, it releases all allocated resources back to the pool."}
        ],
        "examples": [
            {
                "title": "Round Robin Average Waiting Time Calculation",
                "problem": "Given 3 processes with Arrival Time = 0 and Burst Times P1: 24ms, P2: 3ms, P3: 3ms with Time Quantum q = 4ms. Find average waiting time.",
                "solution": "Gantt Chart:\n[0---P1---4][4---P2---7][7---P3---10][10---P1---30]\nCompletion times: P2 finishes at 7ms, P3 at 10ms, P1 at 30ms.\nTurnaround times:\nP1: 30 - 0 = 30ms\nP2: 7 - 0 = 7ms\nP3: 10 - 0 = 10ms\nWaiting times (TAT - BT):\nP1: 30 - 24 = 6ms\nP2: 7 - 3 = 4ms\nP3: 10 - 3 = 7ms\nAverage Waiting Time = (6 + 4 + 7) / 3 = 17 / 3 = 5.66 ms."
            }
        ],
        "diagrams": [
            {
                "title": "Resource Allocation Graph (Circular Wait Deadlock)",
                "type": "svg_and_ascii",
                "ascii_art": """
       +--------------+                    +--------------+
       |  Process P1  | ----- Requests --> |  Resource R1 |
       +--------------+                    +--------------+
             ^                                    |
             |                                 Held By
          Held By                                 |
             |                                    v
       +--------------+                    +--------------+
       |  Resource R2 | <-- Requests ----- |  Process P2  |
       +--------------+                    +--------------+
                """,
                "description": "Process P1 holds R2 and requests R1. Process P2 holds R1 and requests R2. Cycle exists with single-instance resources, proving a Deadlock state!"
            }
        ],
        "two_mark_qa": [
            {"q": "What are the four Coffman conditions for a deadlock?", "a": "1. Mutual Exclusion 2. Hold and Wait 3. No Preemption 4. Circular Wait. All four must hold simultaneously for a deadlock to occur."},
            {"q": "What is the Convoy Effect in CPU scheduling?", "a": "The Convoy effect occurs in FCFS when a long CPU-burst process monopolizes the CPU, forcing many short processes behind it to wait, degrading system throughput."},
            {"q": "Differentiate between preemptive and non-preemptive scheduling.", "a": "Preemptive scheduling allows the OS to interrupt a running process (e.g. Round Robin, SRTF), while in non-preemptive scheduling (e.g. FCFS), a process retains the CPU until it terminates or enters waiting state."}
        ],
        "five_mark_qa": [
            {"q": "Explain the safety algorithm in Banker's Algorithm with data structures used.", "a": "Banker's Algorithm uses 4 vectors/matrices: Available[m], Max[n][m], Allocation[n][m], and Need[n][m] where Need = Max - Allocation. Step 1: Let Work = Available and Finish[i] = False for all i. Step 2: Find index i such that Finish[i] == False and Need[i] <= Work. If no such i exists, go to Step 4. Step 3: Work = Work + Allocation[i], Finish[i] = True, go to Step 2. Step 4: If Finish[i] == True for all i, system is in safe state, and the order of processes forms a Safe Sequence."}
        ],
        "sixteen_mark_qa": [
            {
                "q": "Critically analyze CPU Scheduling algorithms: FCFS, SJF, Priority, and Round Robin. Compare their performance criteria with Gantt charts.",
                "a": "### 1. Introduction\nCPU scheduling is the basis of multiprogrammed operating systems. By switching the CPU among processes, the OS makes the computer more productive.\n\n### 2. Detailed Algorithm Evaluation\n\n#### A. First-Come First-Served (FCFS)\n- **Mechanism**: Simple FIFO queue. First process requesting CPU gets it.\n- **Advantages**: Easy to program, low scheduler overhead.\n- **Drawbacks**: Suffer from Convoy Effect. Not suitable for interactive time-sharing.\n\n#### B. Shortest Job First (SJF & SRTF)\n- **Mechanism**: Associates with each process the length of its next CPU burst. Shortest burst assigned first.\n- **Optimal**: Mathematically gives minimum average waiting time.\n- **Drawbacks**: Impossible to know future burst time in advance. Can cause starvation for lengthy processes.\n\n#### C. Priority Scheduling\n- **Mechanism**: Priority number assigned to each process. Highest priority runs first.\n- **Starvation Solution**: Aging—gradually increasing the priority of processes that wait in the system for a long time.\n\n#### D. Round Robin (RR)\n- **Mechanism**: Designed for time-sharing. Small unit of time (Time Quantum, q, typically 10-100ms) defined. Ready queue treated as circular queue.\n- **Trade-off**: If q is extremely large, RR degenerates to FCFS. If q is very small, context-switch overhead dominates.\n\n### 3. Comprehensive Performance Comparison Table\n| Metric | FCFS | SJF (Preemptive) | Priority | Round Robin |\n|---|---|---|---|---|\n| Avg Waiting Time | High | Minimal (Optimal) | Moderate | Moderate |\n| Starvation | No | Yes (long jobs) | Yes (low priority) | No |\n| Overhead | Very Low | High (prediction) | Moderate | High (context switches) |\n| Interactive Use | Poor | Poor | Moderate | Excellent |"
            }
        ],
        "flashcards": [
            {"front": "Formula: Turnaround Time (TAT)", "back": "TAT = Completion Time - Arrival Time"},
            {"front": "Formula: Waiting Time (WT)", "back": "WT = Turnaround Time - Burst Time"},
            {"front": "4 Necessary Conditions for Deadlock", "back": "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait (Coffman conditions)."},
            {"front": "Banker's Algorithm Need Formula", "back": "Need[i][j] = Max[i][j] - Allocation[i][j]"},
            {"front": "How to prevent starvation in Priority Scheduling?", "back": "Aging: gradually increasing priority of processes waiting in ready queue."}
        ],
        "mcqs": [
            {
                "question": "Which CPU scheduling algorithm gives the mathematically minimum average waiting time for a given set of processes?",
                "options": ["First-Come First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Scheduling"],
                "correct_index": 2,
                "explanation": "Shortest Job First (SJF) is provably optimal because placing shorter jobs before longer jobs minimizes cumulative waiting time."
            },
            {
                "question": "If all four Coffman conditions are present in a system with single-instance resources, what is the consequence?",
                "options": ["High CPU throughput", "Deadlock is guaranteed to exist", "Memory fragmentation", "Round robin speedup"],
                "correct_index": 1,
                "explanation": "For single-instance resource systems, a cycle in the resource allocation graph (circular wait with mutual exclusion, hold-and-wait, and no preemption) is both necessary and sufficient for a deadlock."
            },
            {
                "question": "What happens if the time quantum in a Round Robin scheduling algorithm is set to be extraordinarily large?",
                "options": ["System crashes", "Degenerates into First-Come First-Served (FCFS)", "Context switch rate increases to infinity", "Shortest job runs first"],
                "correct_index": 1,
                "explanation": "If the time quantum exceeds the largest process burst time, each process completes in its first turn, behaving identically to FCFS."
            },
            {
                "question": "In Banker's Algorithm, what does the condition Need[i] ≤ Available verify?",
                "options": ["Process has already terminated", "Process can safely obtain all remaining resources and complete", "Deadlock has already occurred", "Process has maximum priority"],
                "correct_index": 1,
                "explanation": "It checks whether the system currently possesses enough unallocated resources to satisfy the maximum remaining need of process P_i."
            }
        ],
        "revision_sheet": [
            "⚡ TAT = CT - AT; WT = TAT - BT.",
            "⚡ SJF is optimal for average waiting time; suffers from starvation.",
            "⚡ RR performance hinges on time quantum q (balance response vs context switch).",
            "⚡ 4 Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
            "⚡ Deadlock Avoidance: Banker's algorithm checks for Safe State where Need ≤ Available.",
            "⚡ Starvation remedy: Aging technique increases priority over wait duration."
        ]
    },
    "dsa": {
        "title": "Data Structures & Algorithms: Balanced Trees, Graphs & Dijkstra",
        "subject": "Data Structures & Computer Science",
        "chapter_summary": "Advanced data structures enable efficient search, retrieval, and relationship modeling. This module delves into self-balancing binary search trees (AVL Trees and Red-Black Trees), tree balance factors and rotations, graph representations, breadth-first and depth-first traversals, and Dijkstra's single-source shortest path algorithm using priority queues.",
        "key_points": [
            "Binary Search Tree (BST) Invariant: Left subtree keys < root key < right subtree keys.",
            "Degenerate BST: Skewed insertion leads to O(n) worst-case time complexity, equivalent to a linked list.",
            "AVL Tree Invariant: For every node, Balance Factor BF = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, +1}.",
            "AVL Rotations: LL (Right rotation), RR (Left rotation), LR (Left-Right rotation), RL (Right-Left rotation).",
            "Graph Representations: Adjacency Matrix (O(V²) space) vs Adjacency List (O(V + E) space).",
            "Graph Traversals: BFS uses a Queue (finds shortest unweighted path); DFS uses a Stack / Recursion.",
            "Dijkstra's Algorithm: Greedy algorithm finding shortest path from single source to all vertices in non-negative weighted graphs in O((V + E) log V) time."
        ],
        "simple_explanation": "Imagine an address book where you only add friends starting with 'Z', 'Y', 'X'... If you don't reorganize, searching feels like turning every single page in a straight line. An AVL tree is a self-reorganizing bookshelf: the moment one side gets even slightly heavier by two books, it automatically rotates books so the middle letter stays centered. You can find any friend out of a million in just 20 checks!",
        "important_definitions": [
            {"term": "Balance Factor (BF)", "definition": "In an AVL tree, BF = Height(Left Subtree) - Height(Right Subtree). A node is balanced if BF is -1, 0, or +1."},
            {"term": "AVL Tree", "definition": "A strictly height-balanced Binary Search Tree where search, insertion, and deletion guarantee O(log n) time."},
            {"term": "Breadth-First Search (BFS)", "definition": "A graph traversal exploring neighbor vertices layer by layer using a FIFO queue, computing shortest paths in unweighted graphs."},
            {"term": "Depth-First Search (DFS)", "definition": "A graph traversal diving along each branch as deep as possible before backtracking, utilizing recursion or a LIFO stack."},
            {"term": "Greedy Choice Property", "definition": "A problem-solving heuristic making the locally optimal choice at each stage with the goal of reaching a global optimum, as used in Dijkstra's algorithm."}
        ],
        "formulas": [
            {"name": "AVL Tree Balance Factor", "formula": "BF(Node) = Height(Left) - Height(Right)", "description": "Must strictly remain in {-1, 0, 1} for every node."},
            {"name": "Maximum Height of AVL Tree with n nodes", "formula": "h < 1.44 · log₂(n + 2) ≈ O(log n)", "description": "Guarantees logarithmic upper bound on tree height."},
            {"name": "Dijkstra Edge Relaxation Condition", "formula": "if dist[u] + weight(u, v) < dist[v] then dist[v] = dist[u] + weight(u, v)", "description": "Updates tentative distance if a shorter path through u is discovered."},
            {"name": "Dijkstra Time Complexity with Min-Heap", "formula": "O((V + E) · log V)", "description": "V is vertices count, E is edges count."},
            {"name": "BFS / DFS Time Complexity", "formula": "O(V + E)", "description": "Using adjacency list representation."}
        ],
        "examples": [
            {
                "title": "AVL Tree LL and RR Rotations",
                "problem": "Insert keys 30, 20, 10 sequentially into an empty AVL tree and show balance factor correction.",
                "solution": "1. Insert 30: Root node (BF = 0).\n2. Insert 20: Left child of 30. BF(30) = 1 - 0 = +1.\n3. Insert 10: Left child of 20.\nTree: 30 -> Left: 20 -> Left: 10.\nBF(30) = 2 - 0 = +2 (Imbalance at node 30! Left-Left case).\nSolution: Perform Right Rotation on node 30.\nNew Root = 20, Left Child = 10, Right Child = 30.\nNew BF for all nodes = 0. Tree is perfectly balanced!"
            }
        ],
        "diagrams": [
            {
                "title": "AVL Right Rotation (LL Case Resolution)",
                "type": "svg_and_ascii",
                "ascii_art": """
      [30] (BF = +2)                    [20] (BF = 0)
      /                                 /    \\
    [20] (BF = +1)   --- Right Rot --> [10]   [30]
    /
  [10] (BF = 0)
                """,
                "description": "Right rotation elevates child [20] to root, making [30] the right child and maintaining BST ordering while achieving height balance."
            }
        ],
        "two_mark_qa": [
            {"q": "What is the primary advantage of an AVL tree over a standard BST?", "a": "Standard BST can degenerate into an O(n) linked list on sorted input. An AVL tree guarantees O(log n) worst-case time for search, insertion, and deletion by auto-balancing."},
            {"q": "Why does Dijkstra's algorithm fail with negative edge weights?", "a": "Dijkstra's algorithm assumes once a vertex is marked visited (extracted from priority queue), its shortest distance is finalized. Negative edge weights violate this greedy invariant."},
            {"q": "When is an Adjacency List preferred over an Adjacency Matrix?", "a": "Adjacency List is preferred for sparse graphs (E << V²) as it uses O(V + E) memory instead of O(V²), and iterates over adjacent vertices faster."}
        ],
        "five_mark_qa": [
            {"q": "Explain the four rotation types in AVL Trees with suitable examples.", "a": "1. **LL Rotation (Single Right)**: Applied when imbalance occurs due to insertion into left subtree of left child. Node pivots right.\n2. **RR Rotation (Single Left)**: Applied when insertion occurs in right subtree of right child. Node pivots left.\n3. **LR Rotation (Double: Left then Right)**: Applied when insertion is in right subtree of left child. First left-rotates child, then right-rotates parent.\n4. **RL Rotation (Double: Right then Left)**: Applied when insertion is in left subtree of right child. First right-rotates child, then left-rotates parent."}
        ],
        "sixteen_mark_qa": [
            {
                "q": "Formulate Dijkstra's algorithm for finding the single-source shortest path. Trace it on a sample graph and prove its greedy correctness.",
                "a": "### 1. Algorithm Overview\nDijkstra's algorithm solves the single-source shortest path problem on a directed or undirected graph G = (V, E) with non-negative edge weights w(u, v) ≥ 0.\n\n### 2. Pseudocode with Min-Heap Priority Queue\n```\nfunction Dijkstra(Graph G, Source s):\n    for each vertex v in G.V:\n        dist[v] = INFINITY\n        parent[v] = NULL\n    dist[s] = 0\n    \n    PriorityQueue Q = min-heap of vertices keyed by dist[]\n    \n    while Q is not empty:\n        u = Q.extractMin()\n        for each neighbor v of u:\n            weight = w(u, v)\n            // Relaxation Step\n            if dist[u] + weight < dist[v]:\n                dist[v] = dist[u] + weight\n                parent[v] = u\n                Q.decreaseKey(v, dist[v])\n    return dist, parent\n```\n\n### 3. Proof of Correctness (Greedy Invariant)\nWe prove by induction that when vertex u is extracted from Q, dist[u] is the true shortest distance δ(s, u).\n- **Base case**: For source s, dist[s] = 0 = δ(s, s), which is trivial.\n- **Inductive step**: Assume true for set of visited vertices S. Let u be the next vertex chosen with minimum dist[u]. Suppose there exists an alternative path P from s to u shorter than dist[u]. Since path P starts in S and ends outside S, it must cross an edge (x, y) where x ∈ S and y ∉ S.\nSince edge weights are non-negative: length(P) ≥ dist[x] + w(x, y) = dist[y].\nBecause u was chosen with minimal distance: dist[u] ≤ dist[y] ≤ length(P).\nThis contradicts the assumption that P is strictly shorter! Hence dist[u] = δ(s, u).\n\n### 4. Complexity Analysis\n- ExtractMin called V times: O(V log V).\n- Edge Relaxation called E times: O(E log V).\n- Total runtime: **O((V + E) log V)** using a Binary Min-Heap."
            }
        ],
        "flashcards": [
            {"front": "Permissible AVL Balance Factors", "back": "{-1, 0, +1} where BF = Height(Left) - Height(Right)."},
            {"front": "Time complexity of AVL Search, Insert, Delete", "back": "Strictly O(log n) in best, average, and worst cases."},
            {"front": "Data structure driving BFS vs DFS", "back": "BFS uses a FIFO Queue; DFS uses a LIFO Stack or Call Stack recursion."},
            {"front": "Dijkstra's edge relaxation condition", "back": "if dist[u] + w(u, v) < dist[v] then dist[v] = dist[u] + w(u, v)"},
            {"front": "Space complexity: Adjacency List vs Matrix", "back": "List: O(V + E) [best for sparse]; Matrix: O(V²) [dense]."}
        ],
        "mcqs": [
            {
                "question": "What is the maximum allowed difference between the heights of left and right subtrees in an AVL tree?",
                "options": ["0", "1", "2", "log n"],
                "correct_index": 1,
                "explanation": "By definition, the balance factor BF = |Height(Left) - Height(Right)| cannot exceed 1 at any node in an AVL tree."
            },
            {
                "question": "Which rotation is required when a node is inserted into the right subtree of the left child of an unbalanced node?",
                "options": ["Single Right Rotation (LL)", "Single Left Rotation (RR)", "Left-Right Rotation (LR)", "Right-Left Rotation (RL)"],
                "correct_index": 2,
                "explanation": "This is the classic LR case: first a Left rotation on the left child, followed by a Right rotation on the unbalanced parent node."
            },
            {
                "question": "What is the time complexity of Dijkstra's algorithm implemented with a binary min-heap?",
                "options": ["O(V²)", "O((V + E) log V)", "O(V · E)", "O(E²)"],
                "correct_index": 1,
                "explanation": "With a binary min-heap, V extract-min operations take O(V log V) and E decrease-key operations take O(E log V), summing to O((V + E) log V)."
            },
            {
                "question": "Which graph traversal algorithm guarantees finding the shortest path between two vertices in an UNWEIGHTED graph?",
                "options": ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Topological Sort", "Kruskal's Algorithm"],
                "correct_index": 1,
                "explanation": "Because BFS explores vertices in strictly increasing order of edge distance from the start node, the first time a node is reached is via the shortest path."
            }
        ],
        "revision_sheet": [
            "⚡ AVL Tree: Strict height-balance BF ∈ {-1, 0, +1} guarantees O(log n) search.",
            "⚡ 4 Rotations: LL (Right), RR (Left), LR (Left then Right), RL (Right then Left).",
            "⚡ BFS uses Queue (layer by layer, shortest unweighted paths).",
            "⚡ DFS uses Stack/Recursion (cycle detection, topological sort).",
            "⚡ Dijkstra: Greedy shortest path with non-negative weights in O((V + E) log V).",
            "⚡ Relaxation: dist[v] = min(dist[v], dist[u] + w(u, v))."
        ]
    }
}

def detect_subject_key(text: str, filename: str = "") -> str:
    """Detects whether text corresponds to quantum, os, dsa, or general."""
    combined = (text + " " + filename).lower()
    if any(k in combined for k in ["quantum", "physics", "wave", "schrodinger", "broglie", "heisenberg", "tunneling"]):
        return "quantum"
    if any(k in combined for k in ["operating system", "os", "process", "scheduling", "deadlock", "banker", "fcfs", "round robin"]):
        return "os"
    if any(k in combined for k in ["data structure", "tree", "avl", "graph", "dijkstra", "bfs", "dfs", "algorithm"]):
        return "dsa"
    return "general"

def is_sample_material(content: str, title: str) -> Optional[str]:
    combined = (content[:500] + " " + title).lower()
    if "quantum wave mechanics" in combined or "quantum mechanics revolutionizes" in combined:
        return "quantum"
    if "cpu scheduling & deadlocks" in combined or "process management lies at the core" in combined:
        return "os"
    if "trees, graphs & dijkstra" in combined or "advanced data structures enable efficient" in combined:
        return "dsa"
    return None

def extract_terms_from_text(text: str, title: str = "Study Topic") -> List[str]:
    candidates = []
    # 1. Terms before colon
    for m in re.finditer(r'(?:^|\n)\s*([A-Za-z0-9_\-\s]{2,30}):\s*', text):
        term = m.group(1).strip()
        if len(term) > 2 and term not in candidates and not term.lower().startswith("http"):
            candidates.append(term)
    # 2. Terms before is/are/refers to/means/defined as
    for m in re.finditer(r'([A-Za-z0-9_\-\s]{2,30})\s+(?:is|are|refers to|means|defined as)\b', text, re.IGNORECASE):
        term = m.group(1).strip().split('\n')[-1].strip()
        words = term.split()
        if len(words) > 3:
            term = ' '.join(words[-3:])
        if len(term) > 2 and term not in candidates and not term.lower().startswith("http"):
            candidates.append(term)
    # 3. Capitalized technical terms
    for w in re.findall(r'\b[A-Z][a-zA-Z0-9_\-]{3,}\b', text):
        if w not in candidates and w not in ["This", "That", "These", "Those", "With", "From", "Here", "There", "When", "What", "Which"]:
            candidates.append(w)
            
    words = [w for w in title.split() if len(w) > 3]
    for w in words:
        if w not in candidates:
            candidates.append(w)
            
    while len(candidates) < 5:
        candidates.append(f"{title} Concept {len(candidates)+1}")
        
    return candidates[:6]

def generate_dynamic_notes_from_text(content: str, title: str = "Study Material", complexity: str = "Exam-focused") -> Dict[str, Any]:
    """
    Dynamically generates structured 12-part study notes from ANY uploaded text, PDF, video transcript, or document.
    """
    raw = content.strip() if content else ""
    if len(raw) < 20:
        raw = f"{title} covers foundational principles, core structures, working algorithms, and key exam preparation topics."

    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', raw) if len(s.strip()) > 15]
    if not sentences:
        sentences = [raw]
    while len(sentences) < 6:
        sentences.append(f"Essential exam principle: Study the foundational mechanisms and definitions of {title}.")

    paragraphs = [p.strip() for p in raw.split("\n\n") if len(p.strip()) > 30]
    if not paragraphs:
        paragraphs = [raw]

    terms = extract_terms_from_text(raw, title)

    summary_lead = f"This comprehensive study module explores '{title}'. It covers foundational definitions, key mechanisms, practical considerations, and exam-focused takeaways as outlined in the learning resource."
    summary_body = " ".join(sentences[:4])
    if len(sentences) > 4:
        summary_body += "\n\n" + " ".join(sentences[4:8])
    chapter_summary = f"{summary_lead}\n\n{summary_body}"

    key_points = []
    step = max(1, len(sentences) // 8)
    for i in range(0, min(len(sentences), 8 * step), step):
        if len(key_points) < 8 and sentences[i] not in key_points:
            key_points.append(sentences[i])
    while len(key_points) < 6:
        key_points.append(f"Focus on the primary definitions and operational rules of {terms[len(key_points) % len(terms)]}.")

    simple_explanation = (
        f"🌟 To easily understand **{title}**, think of it as an interconnected system. "
        f"Instead of getting overwhelmed by dense technical terminology, focus on the core workflow: "
        f"{terms[0]} provides the foundational inputs, which are processed through {terms[1] if len(terms) > 1 else 'established rules'}, "
        f"ultimately producing the reliable outcomes required in university exams. "
        f"Master the relationship between these key components first, and all questions will become straightforward!"
    )
    if complexity in ["Beginner", "5-Year Old"]:
        simple_explanation = "🌟 Imagine this like your favorite playground! " + simple_explanation
    elif complexity == "Professor Depth":
        simple_explanation = "From a formal axiomatic and analytical perspective: " + chapter_summary[:250] + "..."

    definitions = []
    for i, term in enumerate(terms[:5]):
        def_sent = sentences[i % len(sentences)]
        definitions.append({
            "term": term,
            "definition": def_sent
        })

    formulas = []
    eq_matches = re.findall(r'([A-Za-z0-9_]{1,15}\s*=\s*[^;\n.]{3,35})', raw)
    if eq_matches:
        for i, eq in enumerate(eq_matches[:4]):
            formulas.append({
                "name": f"{title} Equation {i+1}",
                "formula": eq.strip(),
                "description": f"Mathematical relationship governing {terms[i % len(terms)]}."
            })
    while len(formulas) < 3:
        idx = len(formulas)
        formulas.append({
            "name": f"{title} Rule {idx+1}",
            "formula": f"{terms[idx % len(terms)]} -> Principle of Optimal Operation",
            "description": f"Fundamental governing constraint: {sentences[idx % len(sentences)][:80]}"
        })

    examples = [
        {
            "title": f"Practical Application: {title}",
            "problem": f"Explain how to analyze and solve an exam scenario involving '{terms[0]}'.",
            "solution": f"Step 1: Identify given parameters and boundary conditions.\nStep 2: Apply the governing rule: '{sentences[0][:100]}'.\nStep 3: Verify the output against standard theoretical expectations.\nResult: The analysis confirms expected performance parameters."
        }
    ]

    diagrams = [
        {
            "title": f"{title} — Structural Workflow Diagram",
            "type": "svg_and_ascii",
            "ascii_art": (
                f"+--------------------------------------------------+\n"
                f"|            {title[:36]}                     |\n"
                f"+-------------------------+------------------------+\n"
                f"                          |\n"
                f"                          v\n"
                f"    [ {terms[0][:18]} ] ---> [ {terms[1][:18]} ]\n"
                f"                          |\n"
                f"                          v\n"
                f"+--------------------------------------------------+\n"
                f"|        Verified Result & Exam Mastery            |\n"
                f"+--------------------------------------------------+"
            ),
            "description": f"High-level interaction architecture showing the operational relationship between {terms[0]} and {terms[1]}."
        }
    ]

    two_mark_qa = [
        {"q": f"Define {terms[0]} and state its primary significance.", "a": sentences[0]},
        {"q": f"State two key characteristics or principles of {terms[1]}.", "a": sentences[1 % len(sentences)]},
        {"q": f"What is the primary role or mechanism of {terms[2]}?", "a": sentences[2 % len(sentences)]},
        {"q": f"State one key observation or exam rule concerning {title}.", "a": sentences[3 % len(sentences)]}
    ]

    five_mark_qa = [
        {
            "q": f"Explain the architectural working and core mechanisms of {title}.",
            "a": f"1. Foundation: {sentences[0]}\n2. Operational Flow: {sentences[1 % len(sentences)]}\n3. Analysis: {sentences[2 % len(sentences)]}\n4. Conclusion: Consistent application ensures high performance and accuracy."
        },
        {
            "q": f"Discuss the key trade-offs and critical factors in {terms[0]}.",
            "a": f"In university exam evaluation, {terms[0]} is evaluated based on robustness and efficiency. Specifically, '{sentences[3 % len(sentences)]}'. Paying close attention to these constraints ensures full credit."
        }
    ]

    sixteen_mark_qa = [
        {
            "q": f"Discuss in detail the foundational theory, working mechanisms, structural components, and practical applications of {title}.",
            "a": (
                f"### 1. Introduction & Theoretical Background\n"
                f"{chapter_summary[:300]}...\n\n"
                f"### 2. Core Concepts & Definitions\n"
                f"- **{terms[0]}**: {sentences[0]}\n"
                f"- **{terms[1]}**: {sentences[1 % len(sentences)]}\n"
                f"- **{terms[2]}**: {sentences[2 % len(sentences)]}\n\n"
                f"### 3. Step-by-Step Working & Methodology\n"
                f"1. **Initialization**: The system establishes baseline operational parameters.\n"
                f"2. **Processing Phase**: '{sentences[min(3, len(sentences)-1)]}'\n"
                f"3. **Verification**: Constraints and bounds are evaluated systematically.\n\n"
                f"### 4. Practical Implementation & Real-World Context\n"
                f"Applying these principles in real-world scenarios allows engineers and researchers to optimize performance and eliminate errors.\n\n"
                f"### 5. Conclusion & Exam Key Takeaways\n"
                f"In university examinations, always begin with the standard definition, provide the block diagram, and state all underlying assumptions for maximum marks."
            )
        }
    ]

    flashcards = []
    for i in range(5):
        t = terms[i % len(terms)]
        s = sentences[i % len(sentences)]
        flashcards.append({
            "front": f"What is {t}?",
            "back": s[:120]
        })

    mcqs = [
        {
            "question": f"Which of the following best describes '{terms[0]}' according to the material?",
            "options": [
                sentences[0][:80],
                f"It is solely an unverified theoretical hypothesis.",
                f"It requires infinite computational resources with zero output.",
                f"It contradicts standard foundational principles."
            ],
            "correct_index": 0,
            "explanation": f"Correct! As stated in the study material: '{sentences[0]}'."
        },
        {
            "question": f"What primary role does '{terms[1]}' serve in this topic?",
            "options": [
                sentences[1 % len(sentences)][:80],
                "It serves only as a decorative placeholder.",
                "It disables all error checking and verification routines.",
                "It prevents any user interaction from taking place."
            ],
            "correct_index": 0,
            "explanation": f"Correct! Based on the syllabus notes: '{sentences[1 % len(sentences)]}'."
        },
        {
            "question": f"When analyzing '{title}', which factor is considered essential?",
            "options": [
                sentences[2 % len(sentences)][:80],
                "Ignoring all boundary constraints.",
                "Assuming constant zero latency across all media.",
                "Relying entirely on manual human recalculation."
            ],
            "correct_index": 0,
            "explanation": f"Correct! The study notes highlight that: '{sentences[2 % len(sentences)]}'."
        },
        {
            "question": f"What is the recommended approach for answering exam questions on '{title}'?",
            "options": [
                "State core definitions, provide a clear diagram, and cite key governing principles.",
                "Avoid writing any definitions or technical terms.",
                "Submit only random numbers without formulas.",
                "State that the topic cannot be explained."
            ],
            "correct_index": 0,
            "explanation": "Correct! University examiners reward clear structured answers with definitions, diagrams, and principles."
        }
    ]

    revision_sheet = [
        f"⚡ {title}: Focus on the core relationship between {terms[0]} and {terms[1]}.",
        f"⚡ Key Fact: {sentences[0][:90]}.",
        f"⚡ Crucial Concept: {sentences[1 % len(sentences)][:90]}.",
        f"⚡ Examination Tip: Memorize the definitions of {', '.join(terms[:3])}.",
        f"⚡ Working Principle: {sentences[2 % len(sentences)][:90]}.",
        f"⚡ Scoring Rule: Draw the block architecture diagram for full marks in Part B/C."
    ]

    return {
        "title": title,
        "subject": title,
        "complexity": complexity,
        "source": "adaptify_dynamic_engine",
        "chapter_summary": chapter_summary,
        "key_points": key_points,
        "simple_explanation": simple_explanation,
        "important_definitions": definitions,
        "formulas": formulas,
        "examples": examples,
        "diagrams": diagrams,
        "two_mark_qa": two_mark_qa,
        "five_mark_qa": five_mark_qa,
        "sixteen_mark_qa": sixteen_mark_qa,
        "flashcards": flashcards,
        "mcqs": mcqs,
        "revision_sheet": revision_sheet
    }

def generate_study_notes(content: str, title: str = "Study Material", complexity: str = "Exam-focused") -> Dict[str, Any]:
    """
    Generates structured AI study notes for Adaptify AI.
    Uses Gemini API if configured; otherwise dynamically analyzes uploaded text.
    """
    # 1. Check if this is one of the built-in sample materials
    sample_key = is_sample_material(content, title)
    if sample_key and sample_key in KNOWLEDGE_BASE:
        notes = dict(KNOWLEDGE_BASE[sample_key])
        notes["complexity"] = complexity
        notes["source"] = "adaptify_contextual_engine"
        if complexity in ["Beginner", "5-Year Old"]:
            notes["simple_explanation"] = "🌟 Imagine this like your favorite playground! " + notes["simple_explanation"]
        elif complexity == "Professor Depth":
            notes["simple_explanation"] = "From a formal axiomatic perspective: " + notes["chapter_summary"]
        return notes

    # 2. Check if Gemini API is available to generate notes
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(DEFAULT_GEMINI_MODEL)
            
            prompt = f"""
You are the master AI Exam-Prep Tutor for ADAPTIFY AI.
Target Learning Level / Complexity: {complexity}
Study Material Title: {title}
Study Material Content:
\"\"\"{content[:4000]}\"\"\"

Generate comprehensive, structured exam preparation notes formatted as valid JSON with the following exact keys:
1. "title": string
2. "chapter_summary": string (thorough 2-3 paragraph summary)
3. "key_points": list of 6-8 strings
4. "simple_explanation": string (intuitive real-world analogy and simple explanation)
5. "important_definitions": list of objects {{"term": string, "definition": string}} (4-6 terms)
6. "formulas": list of objects {{"name": string, "formula": string, "description": string}} (3-5 items)
7. "examples": list of objects {{"title": string, "problem": string, "solution": string}} (1-2 worked examples)
8. "diagrams": list of objects {{"title": string, "type": "svg_and_ascii", "ascii_art": string, "description": string}}
9. "two_mark_qa": list of objects {{"q": string, "a": string}} (3-4 items)
10. "five_mark_qa": list of objects {{"q": string, "a": string}} (1-2 items)
11. "sixteen_mark_qa": list of objects {{"q": string, "a": string}} (1 comprehensive essay item with headings)
12. "flashcards": list of objects {{"front": string, "back": string}} (5 items)
13. "mcqs": list of objects {{"question": string, "options": [4 strings], "correct_index": 0-3, "explanation": string}} (4 items)
14. "revision_sheet": list of 6 bullet strings

Ensure the output is 100% valid JSON without markdown wrapping.
"""
            response = model.generate_content(prompt)
            if response and response.text:
                cleaned_text = response.text.strip()
                if cleaned_text.startswith("```json"):
                    cleaned_text = cleaned_text[7:]
                if cleaned_text.startswith("```"):
                    cleaned_text = cleaned_text[3:]
                if cleaned_text.endswith("```"):
                    cleaned_text = cleaned_text[:-3]
                parsed = json.loads(cleaned_text.strip())
                parsed["complexity"] = complexity
                parsed["source"] = "gemini_live"
                return parsed
        except Exception as e:
            print(f"Gemini live notes generation fallback triggered: {e}")

    # 3. Dynamic content note generator from the actual uploaded text!
    return generate_dynamic_notes_from_text(content, title, complexity)

def generate_tutor_response(
    question: str,
    context: str = "",
    history: List[Dict[str, str]] = None,
    explanation_level: str = "Simple explanation",
    language: str = "English"
) -> Dict[str, Any]:
    """
    Answers student questions adaptively using context, explanation level, and language preference.
    """
    subject_key = detect_subject_key(question + " " + context)
    base_data = KNOWLEDGE_BASE.get(subject_key, KNOWLEDGE_BASE["os"])
    q_lower = question.lower()
    
    # 1. Check for live Gemini API
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(DEFAULT_GEMINI_MODEL)
            
            sys_prompt = f"""
You are the AI Tutor for ADAPTIFY AI — an adaptive exam-prep platform.
Explanation Level: {explanation_level}
Preferred Language: {language} (If Tamil, respond in Tamil script. If Tanglish, respond in natural Tamil-English blend widely used by students in India, e.g. 'Idhu romba simple concept pa...').
Active Document Context:
\"\"\"{context[:3000]}\"\"\"

Student Question:
{question}

Provide an educational, encouraging, and crystal-clear answer.
If the student asks for 16-mark answer, format with clear sections: Introduction, Architecture/Formulation, Working, and Conclusion.
If the student asks for diagrams, provide an ASCII flowchart or structure diagram.
"""
            resp = model.generate_content(sys_prompt)
            if resp and resp.text:
                return {
                    "answer": resp.text.strip(),
                    "source": "gemini_live",
                    "explanation_level": explanation_level,
                    "language": language,
                    "has_context": bool(context)
                }
        except Exception as e:
            print(f"Gemini chat fallback triggered: {e}")

    # 2. Check if custom material context was provided
    is_sample = is_sample_material(context, "")
    if context and len(context.strip()) > 30 and not is_sample:
        words = [w.lower() for w in re.findall(r'\b\w{3,}\b', q_lower) if w not in ["what", "how", "why", "when", "where", "explain", "describe", "tell", "this", "that", "with", "from", "the", "and", "give", "show"]]
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', context) if len(s.strip()) > 15]
        matched = []
        for s in sentences:
            s_lower = s.lower()
            score = sum(1 for w in words if w in s_lower)
            if score > 0:
                matched.append((score, s))
        matched.sort(key=lambda x: x[0], reverse=True)
        top_sentences = [m[1] for m in matched[:4]] if matched else sentences[:3]
        explanation_body = "\n\n".join([f"• {s}" for s in top_sentences])

        if language == "Tanglish" or "tanglish" in q_lower:
            ans = (
                f"Vanga, unga upload panna notes la irundhu indha question ku simple ah Tanglish la pathuralam! 🚀\n\n"
                f"**Main Concept Breakdown:**\n{explanation_body}\n\n"
                f"💡 **Exam Tip**: Exam hall la indha key points ah underline panni ezhudhina full marks confirm pa! Innum details venuma?"
            )
        elif language == "Tamil" or "tamil" in q_lower:
            ans = (
                f"வணக்கம்! உங்கள் பாடக் குறிப்புகளின் அடிப்படையில் விளக்கம் இதோ: 📚\n\n"
                f"{explanation_body}\n\n"
                f"தேர்வில் இந்த முக்கிய கருத்துக்களை தவறாமல் எழுதுங்கள்!"
            )
        elif "16-mark" in q_lower or "16 mark" in q_lower or "essay" in q_lower:
            ans = (
                f"Here is a comprehensive 16-Mark University Exam-Standard Answer based directly on your uploaded material:\n\n"
                f"### 1. Introduction & Background\n{top_sentences[0] if top_sentences else 'The topic represents a core domain in the curriculum.'}\n\n"
                f"### 2. Core Concepts & Principles\n" + "\n".join([f"- **Key Takeaway {i+1}**: {s}" for i, s in enumerate(top_sentences[:4])]) + "\n\n"
                f"### 3. Detailed Mechanism & Working\n" + explanation_body + "\n\n"
                f"### 4. Exam Summary & Conclusion\n"
                f"Mastering these specific definitions and relationships ensures top performance in descriptive exam evaluations."
            )
        else:
            ans = (
                f"Based on your uploaded material, here is the answer to **'{question}'**:\n\n"
                f"{explanation_body}\n\n"
                f"💡 **Key Exam Focus**: Review these points carefully when answering university exam questions on this topic."
            )
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": explanation_level,
            "language": language,
            "has_context": True
        }

    # 3. High-fidelity contextual tutor response engine for sample topics
    # Handle Tanglish requested
    if language == "Tanglish" or "tanglish" in q_lower:
        if subject_key == "quantum":
            ans = (
                "Vanga, Quantum Mechanics ah simple ah Tanglish la purinjikkalam! 🚀\n\n"
                "**1. Wave-Particle Duality na enna?**\n"
                "Namma everyday life la tennis ball na particle, light na wave nu theriyum. "
                "Aana microscopic electron world la, ore entity rendu mariyum behave pannum! "
                "Adha dhaan de Broglie sonnaru: `λ = h / p`.\n\n"
                "**2. Heisenberg Uncertainty Principle:**\n"
                "Ore nerathula oru electron oda exact position (enga irukku) and momentum (evvalavu speed la pogudhu) "
                "rendathaiyum 100% accurate ah kandupidikka mudiyadhu (`Δx · Δp ≥ ℏ / 2`). Idhu measuring instrument error kedayadhu, nature oda fundamental rule!\n\n"
                "**3. Quantum Tunneling Magic:**\n"
                "Oru wall mela ball potta thirumba varum. Aana electron wave ah irukkaradhala, wall oda thickness thaandi "
                "maru pakkam escape aagi pogum! Idhu dhaan Flash memory and Sun oda energy ku reason.\n\n"
                "Exam tip: 16-mark question vandha Schrödinger derivation kandippa ezhudhanum pa! Need more breakdown?"
            )
        elif subject_key == "os":
            ans = (
                "OS concepts ah sema easy ah Tanglish la paakalam! 💻\n\n"
                "**1. CPU Scheduling na enna?**\n"
                "Hospital la doctor (CPU) irukkaru, pala patients (Processes) wait panranga. Yaaruku eppo treatment tharanum "
                "nu decide panradhu dhaan CPU Scheduling!\n"
                "- **FCFS**: Modhalla vandhavangala modhalla paakuradhu. Aana oru patient ku 2 hours aana, chinna problem irukkavanga waste ah wait panna vendiyirukkum (Convoy Effect!).\n"
                "- **Round Robin**: Ovvoru patient kum correct ah 4 mins (Time Quantum) tharuvom, appadiye queue la rotate aagum.\n\n"
                "**2. Deadlock na enna?**\n"
                "4 cars oru single junction la cross aagum bodhu, ella cars um lock aagi oruthar kooda move aaga mudiyama "
                "ninnukkuradhu dhaan Deadlock! 4 Coffman conditions irukku: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.\n\n"
                "**3. Banker's Algorithm:**\n"
                "Bank manager maari, safe state irundha mattum dhaan resource tharum. Formula: `Need = Max - Allocation`."
            )
        else:
            ans = (
                "Vanga, Data Structures ah sema simple ah paakalam! 🌳\n\n"
                "**AVL Tree na enna?**\n"
                "Normal Binary Search Tree la values sorted ah potta, tree oru straight line linked list maari aagi O(n) worst time kudukum. "
                "Adhuku dhaan AVL Tree auto-balance pannudhu! Balance factor `BF = Height(Left) - Height(Right)` kandippa `-1, 0, +1` kula dhaan irukkanum.\n"
                "2 imbalance vandha udaney rotate pannidum (LL, RR, LR, RL rotations).\n\n"
                "**Dijkstra Shortest Path:**\n"
                "Google Maps maari, lowest travel cost path ah Min-Heap vachi greedy ah kandupidikkum! Negative edges ku idhu work aagadhu pa."
            )
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": explanation_level,
            "language": "Tanglish",
            "has_context": bool(context)
        }

    # Handle 16-mark question request
    if "16-mark" in q_lower or "16 mark" in q_lower or "essay" in q_lower:
        sixteen_item = base_data["sixteen_mark_qa"][0]
        ans = (
            f"Here is a comprehensive 16-Mark University Exam-Standard Answer for **{base_data['title']}**:\n\n"
            f"### Question: {sixteen_item['q']}\n\n"
            f"{sixteen_item['a']}\n\n"
            f"💡 **Exam Scoring Tip**: Draw the architecture diagram clearly, underline key formulas, and box your final eigenvalues for maximum marks!"
        )
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": "Exam-oriented explanation",
            "language": language,
            "has_context": bool(context)
        }

    # Handle diagram explanation
    if "diagram" in q_lower or "flowchart" in q_lower:
        diag = base_data["diagrams"][0]
        ans = (
            f"### Diagram: {diag['title']}\n\n"
            f"```text\n{diag['ascii_art'].strip()}\n```\n\n"
            f"**Detailed Diagram Breakdown:**\n"
            f"{diag['description']}\n\n"
            f"- **Core Concept**: Notice how information or energy flows across the boundaries.\n"
            f"- **Exam Takeaway**: Always label the axes and indicate regional wave/state equations on your exam paper!"
        )
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": explanation_level,
            "language": language,
            "has_context": bool(context)
        }

    # Handle MCQ generation prompt
    if "mcq" in q_lower or "quiz" in q_lower:
        mcqs_list = base_data["mcqs"]
        formatted_mcqs = []
        for i, m in enumerate(mcqs_list, 1):
            opts = "\n".join([f"   {chr(65+j)}. {opt}" for j, opt in enumerate(m["options"])])
            correct_letter = chr(65 + m["correct_index"])
            formatted_mcqs.append(
                f"**Q{i}. {m['question']}**\n{opts}\n*Correct Answer: ({correct_letter})* — {m['explanation']}"
            )
        ans = "Here are curated Exam MCQs with verified answer keys:\n\n" + "\n\n".join(formatted_mcqs)
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": explanation_level,
            "language": language,
            "has_context": bool(context)
        }

    # Handle simple words explanation
    if "simple" in q_lower or "like a beginner" in q_lower or explanation_level == "Explain like a beginner":
        ans = (
            f"### Understanding {base_data['title']} in Everyday Words\n\n"
            f"{base_data['simple_explanation']}\n\n"
            f"**The 3 Golden Rules to Remember:**\n"
            f"1. {base_data['key_points'][0]}\n"
            f"2. {base_data['key_points'][1]}\n"
            f"3. {base_data['key_points'][2]}\n\n"
            f"Would you like a worked exam example or a 2-minute quick quiz on this?"
        )
        return {
            "answer": ans,
            "source": "adaptify_contextual_engine",
            "explanation_level": explanation_level,
            "language": language,
            "has_context": bool(context)
        }

    # Default informative answer
    ans = (
        f"### {base_data['title']} — Key Conceptual Breakdown\n\n"
        f"{base_data['chapter_summary']}\n\n"
        f"**Key Highlights & Exam Focus:**\n"
        f"• {base_data['key_points'][0]}\n"
        f"• {base_data['key_points'][1]}\n"
        f"• {base_data['key_points'][2]}\n\n"
        f"**Core Mathematical Formulation:**\n"
        f"`{base_data['formulas'][0]['formula']}` — {base_data['formulas'][0]['description']}\n\n"
        f"Feel free to ask for step-by-step solutions, 16-mark answers, or a Tanglish summary!"
    )
    return {
        "answer": ans,
        "source": "adaptify_contextual_engine",
        "explanation_level": explanation_level,
        "language": language,
        "has_context": bool(context)
    }

def get_adaptive_progress_profile(user_id: str = "demo-user-id") -> Dict[str, Any]:
    """
    Returns the student's personalized learner model, topic mastery, and weak spots.
    """
    return {
        "user_id": user_id,
        "student_name": "Mrittika",
        "academic_level": "Undergraduate Engineering (Year 2)",
        "overall_comprehension": 84,
        "exam_readiness": 89,
        "study_streak_days": 7,
        "total_study_time_hours": 18.5,
        "completed_topics_count": 14,
        "pending_topics_count": 5,
        "topics": [
            {
                "topic": "Process Scheduling & CPU Utilization",
                "subject": "Operating Systems",
                "mastery_score": 92,
                "status": "Strong",
                "weak_concepts": [],
                "recommended_action": "Mastery confirmed! Advance to Multi-threading."
            },
            {
                "topic": "Deadlock Avoidance & Banker's Algorithm",
                "subject": "Operating Systems",
                "mastery_score": 68,
                "status": "Improving",
                "weak_concepts": ["Safety State Verification", "Resource-Request Matrix Calculation"],
                "recommended_action": "Review Banker's algorithm formula card & solve 2 practice problems."
            },
            {
                "topic": "Quantum Tunneling & Potential Barriers",
                "subject": "Engineering Physics",
                "mastery_score": 58,
                "status": "Needs Practice",
                "weak_concepts": ["Transmission Coefficient Formula", "Boundary Condition Continuity"],
                "recommended_action": "Take targeted 3-minute flashcard quiz on Barrier Potentials."
            },
            {
                "topic": "AVL Trees & Self-Balancing Rotations",
                "subject": "Data Structures",
                "mastery_score": 88,
                "status": "Strong",
                "weak_concepts": [],
                "recommended_action": "Excellent balance factor recognition. Try Red-Black trees next."
            },
            {
                "topic": "Dijkstra's Shortest Path & Priority Queues",
                "subject": "Data Structures",
                "mastery_score": 76,
                "status": "Improving",
                "weak_concepts": ["Min-Heap DecreaseKey Overhead"],
                "recommended_action": "Practice tracing edge relaxation on directed graphs."
            }
        ],
        "learning_recommendations": [
            "⚠️ Attention needed: Quantum Tunneling mastery is below 60%. Recommended 5-minute revision notes ready.",
            "🎯 Great work on CPU Scheduling! Your test accuracy rose 24% after the Round Robin flashcard review.",
            "📅 Exam in 9 days: Operating Systems Midterms. 3 recommended revision tasks scheduled."
        ]
    }
