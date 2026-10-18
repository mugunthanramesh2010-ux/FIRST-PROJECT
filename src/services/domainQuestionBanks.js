// src/services/domainQuestionBanks.js
// Dedicated, authentic, subject-pure oral viva question banks for engineering disciplines and syllabus presets.
// 100% OFFLINE, ZERO PLACEHOLDERS, ACCURATE TECHNICAL CONCEPTS.

export const DOMAIN_QUESTION_BANKS = {
  // 1. QuickSort & Algorithm Complexity (CSE / DSA)
  quicksort_algorithms: {
    matchKeywords: [
      'quicksort', 'quick sort', 'algorithm complexity', 'quicksort & algorithm complexity',
      'sorting algorithms', 'divide and conquer', 'pivot', 'lomuto', 'hoare',
      'sorting complexity', 'introsort'
    ],
    questions: [
      {
        questionText: 'What is the worst-case and average-case time complexity of QuickSort, and under what specific input arrangement does the worst-case O(N²) manifest?',
        type: 'mcq',
        options: [
          'Average O(N log N), Worst O(N²) when the selected pivot is repeatedly the extreme (smallest or largest) element in sorted/reverse-sorted data',
          'Average O(N), Worst O(N log N) when the input array has duplicate keys',
          'Average O(N²), Worst O(N³) when recursion depth exceeds CPU L1 cache limits',
          'Uniformly O(N log N) regardless of pivot selection or initial ordering'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Recall how partitioning subdivides an array around the pivot.',
          'When every partition splits the array into sizes 0 and N - 1, the recursion tree height becomes N.',
          'Sum of operations: (N - 1) + (N - 2) + ... + 1 = N(N - 1)/2 = O(N²).',
          'Average-case splits remain roughly balanced, yielding O(N log N).'
        ],
        modelAnswer: 'QuickSort exhibits O(N log N) average-case time complexity because random or balanced pivots partition the array into roughly equal subproblems of depth log N. The worst-case O(N²) occurs when the pivot is consistently the smallest or largest element (such as choosing the first or last element of an already-sorted array), degrading the recursion depth to N with O(N) comparisons at each level.',
        expectedKeywords: ['quicksort', 'time complexity', 'worst case', 'o(n^2)', 'o(n log n)', 'pivot', 'sorted array']
      },
      {
        questionText: 'Contrast the Lomuto partitioning scheme with the Hoare partitioning scheme in QuickSort implementation. Why is Hoare partitioning generally more efficient?',
        type: 'mcq',
        options: [
          'Hoare uses two converging pointers from both ends, performing approximately three times fewer swaps than Lomuto and handling duplicate keys more symmetrically',
          'Lomuto partitions in O(log N) time while Hoare takes O(N²)',
          'Hoare requires an auxiliary array of size O(N) whereas Lomuto is strictly in-place',
          'Lomuto is stable for all inputs while Hoare is non-deterministic'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Consider pointer traversal directions: Lomuto moves one forward pointer (i and j); Hoare moves two pointers inward from left and right.',
          'Count the expected number of swaps when elements are already in order.',
          'Hoare does on average ~N/6 swaps compared to Lomuto’s ~N/2 swaps.',
          'Hoare also terminates earlier on elements equal to the pivot.'
        ],
        modelAnswer: 'Hoare partitioning initializes two indices at opposite ends of the subarray and moves them inward until elements violating the pivot condition are found, swapping them. On average, Hoare performs three times fewer swaps than Lomuto and stops early when encountering values equal to the pivot, preventing deep recursion on duplicate keys.',
        expectedKeywords: ['lomuto', 'hoare', 'partitioning', 'pointers', 'swaps', 'efficiency', 'duplicate keys']
      },
      {
        questionText: 'How does Median-of-Three pivot selection mitigate the worst-case degradation of QuickSort on sorted or nearly sorted arrays?',
        type: 'mcq',
        options: [
          'It chooses the median of the first, middle, and last elements, guaranteeing that the pivot cannot be the absolute minimum or maximum in monotonic inputs',
          'It calculates the true statistical median of the entire array in O(1) time',
          'It forces the recursion depth to be strictly limited to exactly 3 levels',
          'It converts QuickSort into MergeSort whenever inversions fall below N/2'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Examine the three sampled candidates: array[low], array[mid], array[high].',
          'If the array is sorted (e.g. [1, 2, 3, 4, 5]), the samples are 1, 3, and 5.',
          'The median of {1, 3, 5} is 3, which is the perfect central pivot.',
          'This guarantees a balanced partition and eliminates the O(N²) trap for sorted sequences.'
        ],
        modelAnswer: 'Median-of-three inspects array[low], array[mid], and array[high], and selects the median value as the pivot. For sorted, reverse-sorted, or ramp sequences, this ensures the pivot is close to the middle of the range, preventing 0-to-(N-1) splits and avoiding O(N²) worst-case behavior without expensive random number generation.',
        expectedKeywords: ['median-of-three', 'pivot selection', 'sorted array', 'worst case mitigation', 'balanced partition']
      },
      {
        questionText: 'What is the auxiliary space complexity of QuickSort when optimized with tail recursion elimination, and why does an unoptimized implementation risk O(N) stack overflow?',
        type: 'mcq',
        options: [
          'O(log N) auxiliary stack space when recursing on the smaller partition first and looping on the larger; unoptimized naive recursion can reach O(N) call frames on degenerate trees',
          'O(1) auxiliary space under all circumstances because sorting occurs in-place',
          'O(N) auxiliary space strictly required to store the pivot permutation array',
          'O(N log N) auxiliary space due to memoization of partition boundaries'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Differentiate between auxiliary array memory (which is O(1) in-place) and the function call stack.',
          'Each recursive call pushes return address and local variables onto the call stack.',
          'By always recursing on the smaller subarray (size <= N/2), stack depth is bounded by log2(N).',
          'Naive implementations recursing on both sides can push up to N frames on degenerate inputs.'
        ],
        modelAnswer: 'While QuickSort is an in-place algorithm requiring O(1) extra data storage, its recursive call stack consumes memory. Under naive recursion, an unbalanced tree requires O(N) stack frames. By always making the recursive call on the smaller partition (at most N/2 elements) and transforming the second call into an iterative while-loop (tail call elimination), the stack space is strictly bounded to O(log N).',
        expectedKeywords: ['space complexity', 'auxiliary space', 'call stack', 'tail recursion', 'o(log n)', 'stack overflow']
      },
      {
        questionText: 'Why is standard QuickSort classified as an "Unstable" sorting algorithm?',
        type: 'mcq',
        options: [
          'Because partitioning swaps non-adjacent elements over long distances across the pivot, potentially altering the relative order of duplicate keys',
          'Because its execution time fluctuates non-deterministically based on CPU clock jitter',
          'Because it cannot sort floating-point numbers containing NaN or infinity',
          'Because memory corruption occurs when array length exceeds 2^31 - 1'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Stability means equal keys maintain their original relative input order.',
          'Consider an array with two identical keys: [3a, 2, 3b, 1] with pivot 2.',
          'During swapping, 3a may be swapped with 1 past 3b, reversing their relative order to [1, 2, 3b, 3a].',
          'Because swaps skip over intervening elements, relative stability is lost.'
        ],
        modelAnswer: 'A sorting algorithm is stable if elements with equal keys appear in the same order in the output as in the input. Standard QuickSort is unstable because during the partitioning phase, elements on opposite sides of the pivot are swapped across arbitrary distances, which can invert the original relative positions of identical keys.',
        expectedKeywords: ['stability', 'unstable sort', 'relative order', 'duplicate keys', 'partitioning swap']
      },
      {
        questionText: 'Solve the recurrence relation for the average case of QuickSort: T(N) = 2/N * sum_{k=0}^{N-1} T(k) + c*N. What analytical solution emerges?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'Multiply both sides by N: N * T(N) = 2 * sum_{k=0}^{N-1} T(k) + c * N².',
          'Subtract the corresponding equation for (N-1): (N-1)*T(N-1) = 2 * sum_{k=0}^{N-2} T(k) + c * (N-1)².',
          'This eliminates the summation, yielding: N*T(N) - (N-1)*T(N-1) = 2*T(N-1) + 2cN.',
          'Divide by N(N+1) to telescope the series into harmonic numbers, yielding T(N) ≈ 2N ln N ≈ 1.39 N log2 N.'
        ],
        modelAnswer: 'By multiplying the recurrence by N, subtracting the (N-1) relation, and dividing by N(N+1), the recurrence telescopes into a harmonic series sum: T(N)/(N+1) = T(0) + 2c * sum_{k=1}^N (1/(k+1)). Since the harmonic series H_N ≈ ln N, multiplying back by N gives T(N) = 2c N ln N = 2c ln(2) * N log2(N) ≈ 1.386 C N log2 N, proving average-case O(N log N) complexity.',
        expectedKeywords: ['recurrence relation', 'telescoping', 'harmonic series', 'average case', 'o(n log n)', 'integration']
      },
      {
        questionText: 'Explain the Dutch National Flag (3-way partitioning) variation of QuickSort devised by Edsger Dijkstra. When does it outperform standard 2-way QuickSort?',
        type: 'text',
        bloomLevel: 'Application',
        hints: [
          'Dijkstra’s 3-way partition divides the array into three sections: elements < pivot, elements == pivot, and elements > pivot.',
          'Three pointers are maintained: lt (less than), i (current), and gt (greater than).',
          'Subsequent recursive calls are performed ONLY on the (< pivot) and (> pivot) slices, skipping the (== pivot) middle slice.',
          'For arrays with few unique keys (e.g. all 0s and 1s), this runs in linear O(N) time compared to standard QuickSort’s O(N²).'
        ],
        modelAnswer: 'Dijkstra’s 3-way partitioning divides the array into three continuous regions: elements strictly less than pivot [low..lt-1], elements equal to pivot [lt..gt], and elements greater than pivot [gt+1..high]. Only the subarrays less-than and greater-than are sorted recursively. On inputs with high key duplication, 2-way QuickSort degrades toward O(N²), while 3-way QuickSort achieves linear O(N) time.',
        expectedKeywords: ['dutch national flag', '3-way partitioning', 'duplicate keys', 'dijkstra', 'linear time', 'o(n)']
      },
      {
        questionText: 'What is Introsort (Introspective Sort), and how does it guarantee O(N log N) worst-case time complexity while preserving QuickSort’s average speed?',
        type: 'mcq',
        options: [
          'It begins with QuickSort and monitors recursion depth; if depth exceeds 2 * floor(log2 N), it switches the current partition to HeapSort, and switches to InsertionSort for small sub-arrays',
          'It runs MergeSort and QuickSort simultaneously on dual CPU cores and picks whichever finishes first',
          'It runs BubbleSort on the first half and QuickSort on the second half',
          'It eliminates recursive branching by converting arrays into B-trees in memory'
        ],
        correctIndex: 0,
        bloomLevel: 'Evaluation',
        hints: [
          'Introsort was designed by David Musser in 1997 and is the default sorting algorithm in C++ std::sort.',
          'QuickSort has excellent cache performance but a theoretical O(N²) worst-case.',
          'HeapSort has guaranteed O(N log N) worst-case but poorer cache locality.',
          'By switching to HeapSort when recursion depth exceeds 2 * log2(N), O(N log N) worst-case is mathematically guaranteed.'
        ],
        modelAnswer: 'Introsort combines QuickSort, HeapSort, and InsertionSort. It begins with QuickSort for optimal cache speed. It maintains a recursion depth limit (typically 2 * floor(log2 N)). If the depth exceeds this limit (indicating pathological partitioning), it immediately switches that branch to HeapSort, guaranteeing O(N log N) worst case. For small partitions (N < 16), it switches to InsertionSort.',
        expectedKeywords: ['introsort', 'heapsort', 'recursion depth', 'worst case guarantee', 'c++ std::sort', 'insertionsort']
      },
      {
        questionText: 'Why does QuickSort practically outperform HeapSort and MergeSort on modern CPU hardware despite having the same or worse theoretical asymptotic upper bounds?',
        type: 'mcq',
        options: [
          'QuickSort exhibits high spatial cache locality because partitioning sequentially scans contiguous memory lines, whereas HeapSort jumps across memory following heap tree indices (2i, 2i+1)',
          'HeapSort requires external disk swap space while QuickSort runs entirely in CPU registers',
          'MergeSort requires exponential O(2^N) comparison trees on 64-bit architectures',
          'QuickSort uses hardware GPU acceleration instructions not available to HeapSort'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Consider CPU L1/L2 cache lines (typically 64 bytes).',
          'In QuickSort, pointers increment/decrement sequentially, causing cache line prefetching hits.',
          'In HeapSort, accessing child nodes at 2*i and 2*i+1 causes non-contiguous memory jumps, resulting in high cache miss rates.',
          'MergeSort requires allocating an auxiliary array of size O(N), incurring memory allocation and copying overhead.'
        ],
        modelAnswer: 'QuickSort’s inner partitioning loop sequentially iterates through contiguous memory addresses, maximizing CPU cache line utilization and prefetching efficiency. In contrast, HeapSort traverses binary tree nodes by doubling indices (i -> 2i), jumping across large memory offsets and incurring frequent cache misses. MergeSort also incurs O(N) auxiliary memory allocation and memory-copy overhead.',
        expectedKeywords: ['cache locality', 'spatial locality', 'cache misses', 'prefetching', 'heapsort comparison', 'mergesort overhead']
      },
      {
        questionText: 'Using the Decision Tree model for comparison-based sorting, prove why no comparison sort can have a worst-case time complexity better than Omega(N log N).',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'Any comparison algorithm can be represented as a binary decision tree where internal nodes are comparisons (a_i < a_j) and leaves are permutations.',
          'A set of N distinct elements has N! possible permutations.',
          'A binary tree of height h has at most 2^h leaves, so 2^h >= N!.',
          'Apply Stirling’s approximation: log2(N!) ≈ N log2 N - N log2 e = Omega(N log N).'
        ],
        modelAnswer: 'A comparison sort of N elements must distinguish between all N! possible input permutations. In a binary decision tree where each comparison branches into at most two outcomes, a tree of height h has at most 2^h leaves. Therefore, 2^h >= N!, meaning h >= log2(N!). Using Stirling’s approximation, log2(N!) = Theta(N log N). Since tree height represents the worst-case number of comparisons, any comparison-based sort must make at least Omega(N log N) comparisons.',
        expectedKeywords: ['decision tree', 'lower bound', 'omega(n log n)', 'permutations', 'n factorial', 'stirling approximation']
      }
    ]
  },

  // 2. Mohr's Circle & Principal Stresses (Mechanical / Civil)
  mohrs_circle_principal_stresses: {
    matchKeywords: [
      'mohr', 'mohr’s circle', 'mohr circle', 'principal stresses', 'principal stress',
      'principal strain', 'maximum shear stress', 'stress transformation', 'plane stress'
    ],
    questions: [
      {
        questionText: 'In two-dimensional plane stress analysis, what are the coordinates of the center and the radius of Mohr’s Circle for normal stresses σx, σy and shear stress τxy?',
        type: 'mcq',
        options: [
          'Center = ((σx + σy)/2, 0), Radius R = sqrt(((σx - σy)/2)² + τxy²)',
          'Center = (0, (σx + σy)/2), Radius R = (σx - σy)/2',
          'Center = ((σx - σy)/2, τxy), Radius R = sqrt(σx² + σy²)',
          'Center = (σx, σy), Radius R = τxy / 2'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'The horizontal axis represents normal stress σ and vertical axis represents shear stress τ.',
          'The center lies on the horizontal axis at the average normal stress σ_avg = (σx + σy)/2.',
          'The radius corresponds to the maximum in-plane shear stress τ_max.',
          'Pythagorean formulation: R = sqrt(((σx - σy)/2)² + τxy²).'
        ],
        modelAnswer: 'On Mohr’s circle, the horizontal axis represents normal stress (σ) and the vertical axis represents shear stress (τ). The center is located at the average normal stress ((σx + σy)/2, 0). The radius R is calculated using the stress transformation circle equation: R = sqrt(((σx - σy)/2)² + τxy²), which represents the maximum in-plane shear stress.',
        expectedKeywords: ['mohr circle', 'center', 'radius', 'average stress', 'shear stress', 'normal stress']
      },
      {
        questionText: 'What is the physical definition of a Principal Plane, and what is the value of shear stress on that plane?',
        type: 'mcq',
        options: [
          'A plane on which shear stress is strictly zero; normal stresses on these planes are the Principal Stresses (σ1, σ2)',
          'A plane oriented at 45 degrees where normal stress is zero and shear stress is maximum',
          'A plane parallel to the yield surface where plastic deformation begins',
          'A plane where hydrostatic pressure equals atmospheric pressure'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Look at where Mohr’s circle intersects the horizontal normal stress axis.',
          'At the horizontal axis intercepts, the vertical coordinate (shear stress τ) is 0.',
          'The normal stresses at these points are σ1 (maximum) and σ2 (minimum).',
          'By definition, principal planes carry zero shear stress.'
        ],
        modelAnswer: 'Principal planes are defined as planes of zero shear stress (τ = 0). The normal stresses acting on these planes are the principal stresses (σ1 and σ2). They represent the maximum and minimum normal stresses experienced by the material element at that point under all possible orientations.',
        expectedKeywords: ['principal plane', 'shear stress zero', 'principal stress', 'sigma 1', 'sigma 2']
      },
      {
        questionText: 'How is the orientation angle of the principal planes (θp) mathematically related to the orientation angle of maximum in-plane shear stress planes (θs)?',
        type: 'mcq',
        options: [
          'They differ by 45° in the physical element (which corresponds to 90° on Mohr’s Circle): θs = θp ± 45°',
          'They are perfectly parallel and identical: θs = θp',
          'They are perpendicular at 90° in the physical element',
          'They differ by 60° based on octahedral plane geometry'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Recall that angles on Mohr’s circle are double the physical orientation angle (2θ).',
          'On Mohr’s circle, the principal stresses (horizontal axis) and maximum shear stress (highest/lowest points) are 90° apart.',
          'Dividing by 2 gives the angle in physical space: 90° / 2 = 45°.',
          'Therefore, planes of maximum shear stress are oriented at 45° to the principal planes.'
        ],
        modelAnswer: 'On Mohr’s circle, the points of maximum shear stress (the top and bottom peaks) are separated by 90° from the principal stress points (horizontal intercepts). Because angles on Mohr’s circle are 2θ relative to physical space, the physical planes are separated by 45°: θs = θp ± 45°.',
        expectedKeywords: ['angle', '45 degrees', '90 degrees', 'mohrs circle', 'principal planes', 'maximum shear']
      },
      {
        questionText: 'In a state of Pure Shear (where σx = 0, σy = 0, and τxy = τ0), describe the resulting Mohr’s Circle and state the principal stresses.',
        type: 'text',
        bloomLevel: 'Application',
        hints: [
          'Calculate center: σ_avg = (0 + 0)/2 = 0.',
          'Calculate radius: R = sqrt(((0 - 0)/2)² + τ0²) = τ0.',
          'The circle is centered exactly at the origin (0, 0) with radius τ0.',
          'The circle intersects the normal stress axis at +τ0 and -τ0, meaning σ1 = +τ0 (tensile) and σ2 = -τ0 (compressive).'
        ],
        modelAnswer: 'Under pure shear (σx = 0, σy = 0, τxy = τ0), the center of Mohr’s circle is at the origin (0, 0) and the radius is R = τ0. The principal stresses are σ1 = +τ0 (tensile) and σ2 = -τ0 (compressive). This explains why brittle materials under torsion (such as chalk or cast iron) fail along a 45° helical plane due to principal tensile stress.',
        expectedKeywords: ['pure shear', 'origin center', 'principal stresses', 'plus minus tau', 'torsion failure', '45 degrees']
      },
      {
        questionText: 'Explain the concept of Absolute Maximum Shear Stress in a 3D stress state with principal stresses σ1 > σ2 > σ3. How does it differ from in-plane maximum shear stress?',
        type: 'mcq',
        options: [
          'Absolute maximum shear stress is τ_abs,max = (σ1 - σ3)/2 across all three spatial dimensions, whereas in-plane maximum shear stress considers only (σ1 - σ2)/2',
          'Absolute maximum shear stress is the vector dot product of all three principal stresses',
          'In-plane shear stress is always larger than 3D absolute maximum shear stress',
          'Absolute maximum shear stress is strictly zero under plane stress conditions'
        ],
        correctIndex: 0,
        bloomLevel: 'Evaluation',
        hints: [
          '3D Mohr’s stress representation consists of three circles drawn between (σ1, σ2), (σ2, σ3), and (σ1, σ3).',
          'The largest circle is spanned between the maximum principal stress σ1 and minimum principal stress σ3.',
          'Its radius is (σ1 - σ3)/2.',
          'In plane stress where σ3 = 0 and both σ1, σ2 > 0, τ_abs,max = σ1/2, which is larger than (σ1 - σ2)/2.'
        ],
        modelAnswer: 'In three-dimensional stress analysis, the full state of stress is bounded by three Mohr’s circles constructed between principal stresses σ1, σ2, and σ3 (with σ1 >= σ2 >= σ3). The absolute maximum shear stress is the radius of the outer bounding circle: τ_abs,max = (σ1 - σ3)/2. In plane stress where σ3 = 0, if σ1 and σ2 have the same sign, the out-of-plane shear stress can exceed the in-plane shear stress.',
        expectedKeywords: ['absolute maximum shear', '3d mohr circle', 'sigma1 minus sigma3', 'out of plane', 'tresca']
      }
    ]
  },

  // 3. Stress in Strength of Materials (Mechanical / Civil)
  stress_strength_of_materials: {
    matchKeywords: [
      'stress in strength of materials', 'strength of materials', 'hooke', 'hooke’s law',
      'young modulus', 'stress strain', 'shear modulus', 'bulk modulus', 'poisson', 'torsion equation', 'euler buckling'
    ],
    questions: [
      {
        questionText: 'On the engineering stress-strain curve for mild structural steel under uniaxial tension, identify the key sequential transition points from origin to rupture.',
        type: 'text',
        bloomLevel: 'Understanding',
        hints: [
          'Point 1: Proportional Limit (Hooke’s law applies linearly).',
          'Point 2: Elastic Limit (material returns to zero permanent strain upon unloading).',
          'Point 3 & 4: Upper and Lower Yield Points (yielding occurs at constant or dropping load).',
          'Point 5: Ultimate Tensile Strength (UTS, maximum engineering stress).',
          'Point 6: Necking initiation and Fracture/Rupture point.'
        ],
        modelAnswer: 'The sequential transition points on the mild steel stress-strain curve are: 1. Proportional Limit (linear elastic region where σ = E·ε); 2. Elastic Limit (limit of reversible deformation); 3. Upper Yield Point (instability before plastic slip); 4. Lower Yield Point (continuous plastic yielding under constant stress); 5. Ultimate Tensile Strength (maximum load-carrying capacity where strain hardening peaks); 6. Necking and Fracture (localized reduction of area leading to ductile rupture).',
        expectedKeywords: ['proportional limit', 'elastic limit', 'yield point', 'ultimate tensile strength', 'necking', 'fracture', 'strain hardening']
      },
      {
        questionText: 'What is the relationship between Young’s Modulus (E), Shear Modulus (G), Bulk Modulus (K), and Poisson’s Ratio (ν) for an isotropic elastic solid?',
        type: 'mcq',
        options: [
          'E = 2G(1 + ν) = 3K(1 - 2ν) and E = 9KG / (3K + G)',
          'E = G(1 - ν) = K(1 + 2ν)',
          'E = 3G(1 + 2ν) = 2K(1 - ν)',
          'G = 2E(1 + ν) = 3E(1 - 2ν)'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Recall the relation between shear and tensile elasticity: E = 2G(1 + ν).',
          'Recall volumetric dilation under hydrostatic pressure: E = 3K(1 - 2ν).',
          'Eliminating ν yields the combined harmonic form: E = 9KG / (3K + G).',
          'Notice that for an incompressible material (ν = 0.5), K approaches infinity and E = 3G.'
        ],
        modelAnswer: 'For a homogeneous, isotropic elastic material, the four elastic constants are interrelated by the constitutive equations: E = 2G(1 + ν) and E = 3K(1 - 2ν). Combining these equations to eliminate Poisson’s ratio yields E = 9KG / (3K + G), and ν = (3K - 2G) / (6K + 2G).',
        expectedKeywords: ['elastic constants', 'young modulus', 'shear modulus', 'bulk modulus', 'poisson ratio', 'isotropic']
      },
      {
        questionText: 'In the pure torsion formula T/J = τ/r = Gθ/L, what does J represent for a solid circular shaft of diameter D, and how does shear stress distribute across the radius?',
        type: 'mcq',
        options: [
          'J is the Polar Moment of Inertia (J = π D⁴ / 32); shear stress varies linearly from zero at the center to maximum τ_max at the outer surface (r = D/2)',
          'J is the cross-sectional area (J = π D² / 4); shear stress is uniform across the entire face',
          'J is the torsional rigidity (J = G·L); shear stress is parabolic with peak at center',
          'J is the plastic section modulus; shear stress is zero at the outer perimeter'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Torsion causes shear strain proportional to distance r from the axis of twist: γ = r θ / L.',
          'By Hooke’s law in shear, τ = G γ = (G θ / L) * r.',
          'At the geometric center r = 0, shear stress is 0.',
          'Polar moment of inertia of a circular cross-section is J = π D⁴ / 32.'
        ],
        modelAnswer: 'In the torsion equation T/J = τ/r = Gθ/L, J represents the polar second moment of area, given by J = π D⁴ / 32 for a solid circular cross-section. Because shear strain increases linearly with radial distance from the neutral axis of rotation, shear stress τ = (T·r) / J varies linearly from zero at the center to a maximum at the outer surface r = D/2.',
        expectedKeywords: ['torsion', 'polar moment of inertia', 'pi d4 / 32', 'linear shear stress', 'outer radius']
      },
      {
        questionText: 'State Euler’s Critical Buckling Load formula for an ideal slender column. What is the effective length (Le) for a column fixed at one end and free at the other?',
        type: 'mcq',
        options: [
          'P_cr = π² E I / Le²; for a fixed-free cantilever column, effective length Le = 2 L (reducing buckling capacity by a factor of 4)',
          'P_cr = 2 π E I / L; effective length Le = 0.5 L',
          'P_cr = π² E I / L; effective length is independent of support boundary conditions',
          'P_cr = E I / (π Le); effective length Le = 0.7 L'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Euler buckling load depends inversely on the square of the effective length Le².',
          'A fixed-free column deflects in a quarter-sine wave, equivalent to half of a pinned-pinned column of length 2L.',
          'Therefore, effective length Le = 2L.',
          'P_cr = π² E I / (2L)² = π² E I / (4L²).'
        ],
        modelAnswer: 'Euler’s column buckling equation is P_cr = π² E I / Le², where E is elastic modulus, I is the minimum area moment of inertia, and Le is effective length. For a column fixed at the base and free at the tip (flagpole/cantilever), the deflection mode mirrors half of a pinned column, giving Le = 2L. This reduces its buckling capacity to one-fourth of an equivalent pinned-pinned column.',
        expectedKeywords: ['euler buckling', 'critical load', 'effective length', 'fixed-free', '2L', 'moment of inertia']
      }
    ]
  },

  // 4. Bernoulli's Fluid Dynamics (Mechanical / Civil / Aero)
  bernoulli_fluid_dynamics: {
    matchKeywords: [
      'bernoulli', 'bernoulli’s fluid dynamics', 'fluid dynamics', 'bernoulli equation',
      'venturi', 'pitot tube', 'reynolds number', 'pipe flow', 'boundary layer separation', 'darcy'
    ],
    questions: [
      {
        questionText: 'Under what four fundamental physical assumptions is Bernoulli’s equation (P/ρg + v²/2g + z = constant) strictly derived from Euler’s equation of motion?',
        type: 'mcq',
        options: [
          'Steady flow, Incompressible fluid (constant density), Inviscid/Frictionless fluid (zero viscosity), and along a Streamline',
          'Unsteady flow, Compressible supersonic flow, Turbulent boundary layer, and across Vortex lines',
          'High-viscosity non-Newtonian flow with significant thermal dissipation',
          'Hydrostatic equilibrium under zero gravity in a sealed container'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Euler’s equation integrates Newton’s second law for fluids without viscous shear stresses.',
          'Time derivatives must vanish (steady).',
          'Density ρ must remain constant throughout the stream (incompressible, Mach < 0.3).',
          'Energy losses from friction must be zero (inviscid).'
        ],
        modelAnswer: 'Bernoulli’s equation is derived by integrating Euler’s momentum equation along a streamline under four strict assumptions: 1. Steady flow (∂v/∂t = 0); 2. Incompressible fluid (constant density ρ); 3. Inviscid fluid (viscosity μ = 0, zero viscous dissipation); 4. Flow along a single streamline (or throughout irrotational flow fields).',
        expectedKeywords: ['bernoulli', 'steady', 'incompressible', 'inviscid', 'frictionless', 'streamline', 'euler equation']
      },
      {
        questionText: 'How does a Pitot-Static tube measure fluid velocity, and what is the difference between Static Pressure, Dynamic Pressure, and Stagnation (Total) Pressure?',
        type: 'mcq',
        options: [
          'Stagnation pressure P0 is measured at the forward tip where fluid decelerates to zero velocity; Static pressure P is measured at flush side ports; Dynamic pressure is 1/2 ρ v² = P0 - P, yielding v = sqrt(2(P0 - P)/ρ)',
          'Static pressure measures kinetic energy while dynamic pressure measures gravitational potential',
          'The Pitot tube accelerates fluid through an orifice to supersonic speeds to measure Mach number directly',
          'Velocity is measured by electrical resistance changes of a heated platinum wire'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'At the tip of the tube, fluid hits the dead-end and comes to a complete stop (stagnation point: v = 0).',
          'By Bernoulli: P_static + 1/2 ρ v² = P_stagnation.',
          'Subtract static pressure from total stagnation pressure to obtain dynamic pressure 1/2 ρ v².',
          'Solve for velocity: v = sqrt(2 ΔP / ρ).'
        ],
        modelAnswer: 'A Pitot-static tube measures flow velocity by comparing total stagnation pressure with static pressure. The forward-facing port brings fluid to zero velocity isentropically, recording stagnation pressure P0 = P + 1/2 ρ v². Side ports perpendicular to flow measure ambient static pressure P. The differential pressure ΔP = P0 - P equals dynamic pressure 1/2 ρ v², giving velocity v = sqrt(2(P0 - P) / ρ).',
        expectedKeywords: ['pitot tube', 'stagnation pressure', 'static pressure', 'dynamic pressure', 'velocity measurement', 'bernoulli']
      },
      {
        questionText: 'Explain the phenomenon of Cavitation in hydraulic machines (such as pumps, turbines, or venturi throats) in terms of Bernoulli’s principle and vapor pressure.',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'According to Bernoulli, when fluid velocity increases through a restriction, static pressure drops.',
          'If velocity becomes high enough that local static pressure drops below the fluid’s saturation vapor pressure (P_vap) at that temperature, the liquid boils locally, forming vapor cavities (bubbles).',
          'When these vapor bubbles travel into downstream regions of higher pressure, they collapse violently.',
          'Collapse generates micro-jets and extreme localized shock pressures (> 1000 MPa), pitting and eroding metal surfaces.'
        ],
        modelAnswer: 'According to Bernoulli’s principle, an increase in fluid velocity (such as in a venturi constriction or pump impeller eye) results in a corresponding reduction in static pressure. If local pressure drops below the saturation vapor pressure (P_sat) of the liquid at that operating temperature, vapor bubbles form spontaneously. When these bubbles travel into higher-pressure downstream regions, they collapse instantaneously, creating localized shock waves and micro-jets that cause severe pitting, noise, vibration, and material erosion.',
        expectedKeywords: ['cavitation', 'vapor pressure', 'static pressure drop', 'bubble collapse', 'venturi', 'pitting erosion', 'impeller']
      },
      {
        questionText: 'What is the physical interpretation of the Reynolds Number (Re = ρ v D / μ), and what are the critical transition thresholds for flow in circular commercial pipes?',
        type: 'mcq',
        options: [
          'Ratio of Inertial Forces to Viscous Forces; laminar flow occurs for Re < 2000, transitional flow between 2000 and 4000, and turbulent flow for Re > 4000',
          'Ratio of Pressure Forces to Surface Tension; laminar flow occurs for Re > 100,000',
          'Ratio of Thermal Convection to Molecular Conduction; turbulent for Re < 500',
          'Ratio of Acoustic Wave Velocity to Fluid Stream Velocity'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Inertial force scale: ρ v² / D.',
          'Viscous shear force scale: μ v / D².',
          'Divide inertial by viscous: (ρ v² / D) / (μ v / D²) = ρ v D / μ.',
          'In internal pipe flow, disturbance damping by viscosity breaks down above Re ≈ 2000–2300.'
        ],
        modelAnswer: 'The Reynolds number (Re = ρ v D / μ) nondimensionalizes the Navier-Stokes equations, representing the ratio of convective inertial forces to viscous resistive forces. In circular pipe flow, viscous damping keeps fluid in parallel streamlines (laminar) when Re < 2000. Above critical Reynolds number ~2000–2300, destabilizing inertial forces amplify perturbations, leading to fully turbulent flow for Re > 4000.',
        expectedKeywords: ['reynolds number', 'inertial forces', 'viscous forces', 'laminar', 'turbulent', 'pipe flow', 'critical threshold']
      }
    ]
  },

  // 5. Carnot Thermodynamics (Mechanical / Thermal)
  carnot_thermodynamics: {
    matchKeywords: [
      'carnot', 'carnot thermodynamics', 'carnot cycle', 'second law of thermodynamics',
      'heat engine', 'thermal efficiency', 'entropy', 'clausius', 'rankine cycle', 'reversibility'
    ],
    questions: [
      {
        questionText: 'State the four reversible thermodynamic processes that comprise the idealized Carnot Heat Engine Cycle in sequence.',
        type: 'mcq',
        options: [
          '1. Reversible Isothermal Expansion (heat absorption at TH), 2. Reversible Isentropic/Adiabatic Expansion, 3. Reversible Isothermal Compression (heat rejection at TC), 4. Reversible Isentropic/Adiabatic Compression',
          '1. Constant Pressure Heating, 2. Constant Volume Expansion, 3. Constant Pressure Cooling, 4. Constant Volume Compression',
          '1. Polytropic Expansion, 2. Isobaric Compression, 3. Throttle Valve Expansion, 4. Flash Evaporation',
          '1. Shock Wave Compression, 2. Constant Temperature Detonation, 3. Supersonic Expansion, 4. Radiative Cooling'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Carnot cycle alternates between constant temperature (isothermal) and zero heat transfer (isentropic/adiabatic) processes.',
          'Heat Q_H enters reversibly during isothermal expansion at high temperature T_H.',
          'Work continues adiabatically, lowering temperature from T_H to T_C.',
          'Heat Q_C exits reversibly during isothermal compression at low temperature T_C, followed by adiabatic compression back to T_H.'
        ],
        modelAnswer: 'The Carnot cycle consists of four reversible processes: 1. Isothermal Expansion at constant high temperature TH (absorbing heat QH from source); 2. Isentropic/Reversible Adiabatic Expansion (doing work while temperature drops from TH to TC); 3. Isothermal Compression at constant low temperature TC (rejecting heat QC to sink); 4. Isentropic/Reversible Adiabatic Compression (doing work on fluid to restore temperature to TH).',
        expectedKeywords: ['carnot cycle', 'isothermal expansion', 'isentropic expansion', 'isothermal compression', 'isentropic compression', 'reversible']
      },
      {
        questionText: 'What is Carnot’s Theorem, and why is it impossible for any heat engine operating between temperatures TH and TC to have an efficiency greater than η = 1 - TC/TH?',
        type: 'mcq',
        options: [
          'Because any engine with efficiency greater than Carnot’s would violate the Second Law of Thermodynamics (Kelvin-Planck statement) by creating a net flow of heat from cold to hot without work input',
          'Because mechanical friction in pistons always consumes at least 50% of the energy',
          'Because ideal gas molecules dissociate at temperatures above 1000 K',
          'Because Carnot efficiency is defined as 100% and cannot be exceeded by definition'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Consider a hypothetical engine with efficiency η_hyp > η_carnot.',
          'Couple this engine to run a reversed Carnot refrigerator between the same two thermal reservoirs.',
          'The combined system would produce positive net work while drawing net heat from a single reservoir, or transfer heat from cold to hot with zero net work.',
          'This directly violates the Second Law of Thermodynamics.'
        ],
        modelAnswer: 'Carnot’s theorem states that no heat engine operating between two thermal reservoirs can be more efficient than a reversible Carnot engine operating between the same reservoirs. If an engine were more efficient, it could drive a Carnot refrigerator in reverse, producing net mechanical work while exchanging heat with only a single reservoir, directly violating the Kelvin-Planck and Clausius statements of the Second Law.',
        expectedKeywords: ['carnot theorem', 'thermal efficiency', 'second law', 'kelvin-planck', 'reversibility', 'clausius statement']
      },
      {
        questionText: 'State Clausius’ Inequality for an arbitrary thermodynamic cycle. How does it distinguish between a reversible cycle, an irreversible cycle, and an impossible cycle?',
        type: 'mcq',
        options: [
          'oint (dQ/T) <= 0: exactly equals 0 for a reversible cycle, strictly less than 0 for an irreversible cycle, and greater than 0 for an impossible cycle',
          'oint (dQ/T) >= 0: always positive for real engines and zero for ideal cycles',
          'oint (dQ/T) = constant independent of entropy generation',
          'oint (dQ/T) equals total enthalpy change divided by pressure'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Recall entropy definition: dS = dQ_rev / T.',
          'For any cycle: S_gen = oint dS - oint (dQ/T) = 0 - oint (dQ/T) >= 0.',
          'Therefore: oint (dQ/T) = - S_gen <= 0.',
          'When S_gen = 0 (reversible), integral = 0; when S_gen > 0 (irreversible), integral < 0; if integral > 0, it is physically impossible.'
        ],
        modelAnswer: 'Clausius’ Inequality states that for any closed thermodynamic cycle, the cyclic integral of dQ/T is less than or equal to zero: oint (dQ/T) <= 0. If oint (dQ/T) = 0, the cycle is internally and externally reversible. If oint (dQ/T) < 0, the cycle is irreversible (involving entropy generation). If oint (dQ/T) > 0, the cycle violates the Second Law and is impossible.',
        expectedKeywords: ['clausius inequality', 'cyclic integral', 'entropy generation', 'reversible cycle', 'irreversible', 'impossible']
      }
    ]
  },

  // 6. Machine Design Fatigue & Goodman Criterion
  machine_design_fatigue: {
    matchKeywords: [
      'machine design fatigue', 'goodman', 'fatigue', 'soderberg', 'gerber',
      'endurance limit', 'sn curve', 'marin factor', 'miner rule', 'mean stress', 'alternating stress'
    ],
    questions: [
      {
        questionText: 'In fatigue design under fluctuating stress with mean stress (σm) and alternating stress (σa), compare the Goodman, Soderberg, and Gerber failure criteria.',
        type: 'mcq',
        options: [
          'Goodman connects endurance limit Se to ultimate tensile strength Sut linearly; Soderberg connects Se to yield strength Sy linearly (most conservative); Gerber connects Se to Sut parabolically (best fit for ductile metals)',
          'Goodman is quadratic while Gerber is purely exponential',
          'Soderberg ignores alternating stress completely while Goodman ignores mean stress',
          'All three lines are identical for ductile carbon steels'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Horizontal axis is Mean Stress σm, Vertical axis is Alternating Stress σa.',
          'Soderberg uses yield strength Sy on the mean stress axis: σa/Se + σm/Sy = 1.',
          'Goodman uses ultimate tensile strength Sut: σa/Se + σm/Sut = 1.',
          'Gerber uses a parabolic curve: σa/Se + (σm/Sut)² = 1.',
          'Because Sy < Sut, Soderberg lies inside Goodman and is the most conservative.'
        ],
        modelAnswer: 'On the mean stress (σm) versus alternating stress (σa) diagram: 1. Goodman line connects Se to Sut linearly: (σa / Se) + (σm / Sut) = 1/n; 2. Soderberg line connects Se to Sy linearly: (σa / Se) + (σm / Sy) = 1/n, preventing any localized static yielding and making it the most conservative; 3. Gerber parabola connects Se to Sut via (σa / Se) + (σm / Sut)² = 1/n, providing the closest empirical fit for ductile metals under tensile mean stress.',
        expectedKeywords: ['goodman line', 'soderberg line', 'gerber parabola', 'endurance limit', 'yield strength', 'ultimate strength', 'fatigue design']
      },
      {
        questionText: 'What is the Endurance Limit (Se) on an S-N curve, and how do Marin modification factors (ka, kb, kc, kd, ke, kf) convert test specimen endurance limit (Se\') into operational component endurance limit (Se)?',
        type: 'text',
        bloomLevel: 'Application',
        hints: [
          'Endurance limit is the stress amplitude below which a ferrous material can endure infinite fatigue cycles (N > 10^6) without failure.',
          'Standard R.R. Moore test specimens are highly polished, mirror-finished, miniature, and tested at room temperature under pure bending.',
          'Real machine components have rougher surfaces (ka), larger diameters (kb), axial or torsional loading (kc), elevated temperatures (kd), and stress concentrations/notches (kf).',
          'Se = ka * kb * kc * kd * ke * kf * Se\'.'
        ],
        modelAnswer: 'The endurance limit Se\' is the stress threshold below which a material can withstand infinite loading cycles (N > 10^6) without fracture. Because standard laboratory R.R. Moore test specimens are polished and tiny, real-world components experience lower fatigue strength due to Marin factors: Se = ka · kb · kc · kd · ke · kf · Se\', where ka is surface condition factor, kb is size factor, kc is load factor (bending vs axial vs torsion), kd is temperature factor, ke is reliability factor, and kf is miscellaneous/notch sensitivity factor.',
        expectedKeywords: ['endurance limit', 's-n curve', 'marin factors', 'surface factor', 'size factor', 'load factor', 'notch sensitivity']
      },
      {
        questionText: 'State Miner’s Rule (Palmgren-Miner Linear Damage Hypothesis) for cumulative fatigue damage under variable amplitude loading.',
        type: 'mcq',
        options: [
          'Cumulative damage sum D = sum (ni / Ni) = 1.0, where ni is the number of cycles experienced at stress level i, and Ni is the fatigue life to failure at that stress level',
          'D = sum (sigma_i * N_i) / E must not exceed yield stress',
          'Damage accumulates exponentially as D = exp(sum ni / Ni)',
          'Miner’s rule states fatigue damage heals completely during idle resting periods'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Each stress cycle consumes a fraction of the component’s total fatigue life.',
          'If a component undergoes n1 cycles at a stress where life is N1, it consumes n1/N1 of its life.',
          'Sum up all cycle fractions across all stress levels: sum (ni / Ni).',
          'Failure is predicted when total accumulated damage D reaches 1.0.'
        ],
        modelAnswer: 'Miner’s Rule assumes linear fatigue damage accumulation: D = sum_{i=1}^k (n_i / N_i) = 1.0, where n_i is the number of applied cycles at stress amplitude σ_i, and N_i is the total number of cycles to failure at that stress amplitude from the S-N curve. Fatigue failure occurs when the cumulative damage fraction D equals or exceeds 1.0.',
        expectedKeywords: ['miner rule', 'cumulative damage', 'palmgren miner', 'fatigue life', 'cycle ratio', 'variable amplitude']
      }
    ]
  },

  // 7. Virtual Memory Paging & Deadlocks (Operating Systems)
  virtual_memory_deadlocks: {
    matchKeywords: [
      'virtual memory paging & deadlocks', 'virtual memory', 'paging', 'deadlock', 'deadlocks',
      'coffman', 'banker algorithm', 'tlb', 'page replacement', 'thrashing', 'belady'
    ],
    questions: [
      {
        questionText: 'Enumerate the four Coffman Conditions necessary and sufficient for a Deadlock to occur in a concurrent operating system. How does Deadlock Prevention differ from Deadlock Avoidance?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'Condition 1: Mutual Exclusion (non-shareable resources).',
          'Condition 2: Hold and Wait (process holding resources requests more).',
          'Condition 3: No Preemption (resources cannot be forcibly confiscated).',
          'Condition 4: Circular Wait (closed loop of processes waiting for each other).',
          'Prevention statically breaks one of the four conditions; Avoidance dynamically evaluates states using algorithms like Banker’s.'
        ],
        modelAnswer: 'The four Coffman conditions are: 1. Mutual Exclusion (at least one resource is held in a non-shareable mode); 2. Hold and Wait (a process holds resources while waiting for additional ones); 3. No Preemption (resources cannot be confiscated by force); 4. Circular Wait (a closed chain P0->P1->...->Pn->P0 exists where each process waits for a resource held by the next). Deadlock Prevention invalidates at least one of these four conditions statically by protocol design. Deadlock Avoidance dynamically inspects resource allocation requests (e.g., Dijkstra’s Banker’s Algorithm) to guarantee the system stays in a Safe State.',
        expectedKeywords: ['coffman conditions', 'mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'deadlock prevention', 'deadlock avoidance']
      },
      {
        questionText: 'What is Belady’s Anomaly in Virtual Memory page replacement, and which page replacement algorithms are mathematically immune to it?',
        type: 'mcq',
        options: [
          'Belady’s anomaly occurs when increasing the number of physical page frames results in an increased number of page faults; FIFO is vulnerable, whereas Stack Algorithms (LRU and Optimal) are immune',
          'Belady’s anomaly is when memory fragmentation exceeds total swap space; Round-Robin is immune',
          'It refers to CPU cache line contention; TLB caching is immune',
          'It is a deadlock condition occurring when page tables exceed 4GB; LRU is vulnerable'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Intuitively, giving a process more RAM frames should reduce page faults.',
          'With FIFO (First-In, First-Out), certain reference strings (e.g. 1,2,3,4,1,2,5,1,2,3,4,5) generate 9 faults with 3 frames, but 10 faults with 4 frames!',
          'Stack algorithms satisfy the inclusion property: the set of pages in k frames is always a subset of pages in k+1 frames.',
          'LRU (Least Recently Used) and Optimal replacement are stack algorithms and never exhibit Belady’s Anomaly.'
        ],
        modelAnswer: 'Belady’s Anomaly is the counter-intuitive phenomenon where increasing the number of allocated physical page frames causes an increase in the number of page faults for a given memory reference string. FIFO page replacement suffers from Belady’s anomaly. In contrast, "Stack Algorithms" like LRU (Least Recently Used) and OPT (Optimal) satisfy the inclusion property—where the set of pages in a cache of size k is strictly a subset of the pages in size k+1—making them mathematically immune.',
        expectedKeywords: ['belady anomaly', 'fifo', 'page faults', 'page frames', 'lru', 'stack algorithm', 'inclusion property']
      },
      {
        questionText: 'Calculate the Effective Memory Access Time (EMAT) given a memory access time of 100 ns, a TLB access time of 20 ns, and a TLB hit ratio of 95% in a single-level page table system.',
        type: 'mcq',
        options: [
          '125 ns (EMAT = 0.95 * (20 + 100) + 0.05 * (20 + 100 + 100) = 0.95 * 120 + 0.05 * 220 = 114 + 11 = 125 ns)',
          '100 ns because TLB lookups occur in parallel with RAM access',
          '220 ns due to double memory penalty on every cycle',
          '95 ns because 95% of requests bypass physical memory'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'On a TLB Hit (probability α = 0.95): Time = TLB time + RAM data access time = 20 + 100 = 120 ns.',
          'On a TLB Miss (probability 1 - α = 0.05): Time = TLB time + Page Table lookup in RAM + RAM data access = 20 + 100 + 100 = 220 ns.',
          'EMAT = α * (TLB + RAM) + (1 - α) * (TLB + 2 * RAM).',
          'EMAT = 0.95 * 120 + 0.05 * 220 = 114 + 11 = 125 ns.'
        ],
        modelAnswer: 'Effective Memory Access Time (EMAT) is computed as EMAT = α · (T_tlb + T_ram) + (1 - α) · (T_tlb + 2 · T_ram), where α is the TLB hit ratio. For α = 0.95, T_tlb = 20 ns, and T_ram = 100 ns: On TLB hit (95%): 20 + 100 = 120 ns. On TLB miss (5%): 20 + 100 (page table lookup) + 100 (actual data) = 220 ns. EMAT = 0.95(120) + 0.05(220) = 114 + 11 = 125 ns.',
        expectedKeywords: ['effective memory access time', 'emat', 'tlb hit ratio', 'page table lookup', 'memory access time', 'calculation']
      },
      {
        questionText: 'What is Thrashing in virtual memory systems, and how does Peter Denning’s Working Set Model resolve it?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'Thrashing occurs when the operating system spends more time paging (swapping pages in and out of disk) than executing user instructions.',
          'It happens when the sum of locality working sets across all active processes exceeds available physical RAM.',
          'Denning’s Working Set Model defines W(t, Δ) as the set of pages referenced in the most recent Δ time units.',
          'If total working set demand D = sum |W_i| > Total Frames, the OS suspends one or more processes to free frames, stopping thrashing.'
        ],
        modelAnswer: 'Thrashing is a state of severe system performance collapse where the operating system spends virtually all its time servicing page faults (swapping pages between RAM and swap disk) rather than executing application code. This occurs when the multiprogramming degree is too high and processes lack sufficient frames to hold their active working sets. Denning’s Working Set Model tracks the set of pages referenced by each process over a sliding time window Δ. If total demand D = sum |W_i| exceeds total available physical frames, the OS suspends a low-priority process, reallocating its frames to eliminate thrashing.',
        expectedKeywords: ['thrashing', 'working set model', 'denning', 'page fault frequency', 'multiprogramming degree', 'locality of reference']
      }
    ]
  },

  // 8. Kirchhoff's Laws & Op-Amp Circuits (EEE / ECE)
  kirchhoff_opamp_circuits: {
    matchKeywords: [
      'kirchhoff’s laws & op-amp circuits', 'kirchhoff', 'op-amp', 'op amp', 'operational amplifier',
      'kcl', 'kvl', 'virtual ground', 'inverting amplifier', 'non-inverting amplifier', 'slew rate', 'cmrr'
    ],
    questions: [
      {
        questionText: 'State the Two Ideal Op-Amp "Golden Rules" under negative feedback, and explain their physical origins in terms of open-loop gain and input impedance.',
        type: 'text',
        bloomLevel: 'Understanding',
        hints: [
          'Rule 1: Virtual Short / Virtual Ground — The differential input voltage Vd = (V+ - V-) = 0, so V+ = V-.',
          'Physical origin: Ideal open-loop gain A_OL approaches infinity, so for finite output Vout = A_OL * (V+ - V-), (V+ - V-) must equal Vout / infinity = 0.',
          'Rule 2: Zero Input Current — Current flowing into the inverting (I-) and non-inverting (I+) input terminals is strictly zero.',
          'Physical origin: Ideal input impedance R_in approaches infinity (typically FET/MOS inputs with gigohms to teraohms resistance).'
        ],
        modelAnswer: 'The two ideal op-amp rules under negative feedback are: 1. Virtual Short / Virtual Ground (V+ = V-): Because the open-loop voltage gain A_OL is infinite, negative feedback drives the differential input voltage Vd = V+ - V- = Vout / A_OL to zero, forcing both terminals to the same potential; 2. Zero Input Current (I+ = I- = 0): Because the internal input resistance Rin is infinite, no current enters either input pin.',
        expectedKeywords: ['golden rules', 'virtual ground', 'virtual short', 'infinite gain', 'infinite input impedance', 'negative feedback', 'zero input current']
      },
      {
        questionText: 'Derive the closed-loop voltage gain (Av = Vout / Vin) of an Inverting Operational Amplifier circuit with input resistor R1 and feedback resistor Rf.',
        type: 'mcq',
        options: [
          'Av = - Rf / R1 (derived by applying KCL at the inverting node where V- = 0 V virtual ground)',
          'Av = 1 + Rf / R1',
          'Av = - R1 / (R1 + Rf)',
          'Av = Rf * R1 / (Rf + R1)'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'The non-inverting terminal V+ is connected to ground (0 V).',
          'By the virtual ground rule, the inverting terminal V- = V+ = 0 V.',
          'Apply KCL at node V-: (Vin - 0)/R1 + (Vout - 0)/Rf = 0 (since no current enters op-amp).',
          'Vin/R1 = - Vout/Rf, therefore Vout/Vin = - Rf/R1.'
        ],
        modelAnswer: 'In an inverting op-amp configuration, the non-inverting pin is grounded (V+ = 0 V). By the virtual ground concept, V- = 0 V. Applying Kirchhoff’s Current Law (KCL) at node V-: I_in + I_f = 0 => (Vin - 0)/R1 + (Vout - 0)/Rf = 0. Rearranging terms gives Vout / Rf = - Vin / R1, yielding closed-loop gain Av = Vout / Vin = - Rf / R1. The negative sign denotes a 180° phase inversion.',
        expectedKeywords: ['inverting amplifier', 'gain', 'av = -rf/r1', 'kcl', 'virtual ground', 'feedback resistor']
      },
      {
        questionText: 'What is Slew Rate (SR) of an operational amplifier, and what happens to a high-frequency sine wave input when the required dVout/dt exceeds the amplifier’s slew rate?',
        type: 'mcq',
        options: [
          'Slew rate is the maximum rate of change of output voltage (SR = max |dVout/dt|, measured in V/μs); exceeding it causes non-linear triangular distortion and severe phase lag',
          'Slew rate is the DC input offset voltage drift measured in mV/°C',
          'Slew rate is the thermal noise power density measured in nV/sqrt(Hz)',
          'Exceeding slew rate causes negative resistance oscillation into a square wave'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Slew rate is limited by internal compensation capacitors and tail current sources: SR = I_tail / C_comp.',
          'For a sine wave Vout(t) = Vp * sin(2π f t), maximum slope occurs at zero crossings: (dVout/dt)_max = 2π f Vp.',
          'If 2π f Vp > SR, the output cannot rise fast enough, degenerating from a sine wave into a triangle wave.',
          'This condition defines the Full-Power Bandwidth (f_max = SR / (2π Vp)).'
        ],
        modelAnswer: 'Slew rate (SR) is the maximum rate of change of output voltage that an op-amp can produce, defined as SR = |dVout/dt|_max, typically specified in V/μs. It is physically constrained by the internal compensation capacitor charging from a finite tail current source (SR = I_tail / C_c). For a sinusoidal output Vout = Vp sin(2π f t), the peak slope is 2π f Vp. If 2π f Vp > SR, the amplifier slew-rate limits, distorting the clean sinusoidal wave into a triangle wave and causing severe non-linear attenuation.',
        expectedKeywords: ['slew rate', 'dv/dt', 'triangular distortion', 'full-power bandwidth', 'compensation capacitor', 'tail current']
      },
      {
        questionText: 'Explain the purpose and architecture of a Three-Op-Amp Instrumentation Amplifier. Why does it achieve significantly higher Common-Mode Rejection Ratio (CMRR) than a single difference amplifier?',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'A single difference amplifier has low, unequal input impedances that load the source and degrade CMRR when source impedances are mismatched.',
          'The 3-op-amp topology places two non-inverting buffer/amplifiers at the input stage, providing ultra-high input impedance (gigohms).',
          'The input stage amplifies differential signals with gain (1 + 2R1/Rg) while passing common-mode signals with unity gain.',
          'The second difference stage then rejects common-mode noise, yielding exceptionally high CMRR (> 100 dB).'
        ],
        modelAnswer: 'The 3-op-amp instrumentation amplifier consists of two input buffer amplifiers cross-coupled through a gain-setting resistor Rg, followed by a unity-gain difference amplifier. Unlike a basic subtractor whose input impedance is low and dependent on resistor matching, the instrumentation amplifier provides near-infinite input impedance on both inputs, preventing source loading. The input stage amplifies the differential signal by A_d = 1 + 2R1/Rg while providing unity gain for common-mode signals, dramatically boosting the overall Common-Mode Rejection Ratio (CMRR = A_d / A_cm).',
        expectedKeywords: ['instrumentation amplifier', 'three op-amp', 'cmrr', 'common-mode rejection', 'input impedance', 'gain resistor']
      }
    ]
  },

  // 9. Machine Learning Bias-Variance (AI & Data Science)
  machine_learning_bias_variance: {
    matchKeywords: [
      'machine learning bias-variance', 'bias-variance', 'bias variance', 'overfitting',
      'underfitting', 'regularization', 'lasso', 'ridge', 'l1 regularization', 'l2 regularization', 'cross validation', 'roc auc'
    ],
    questions: [
      {
        questionText: 'Formulate the Bias-Variance Decomposition of expected prediction error for a regression model with target y = f(x) + ε where noise ε ~ N(0, σ²).',
        type: 'mcq',
        options: [
          'Expected Mean Squared Error = Bias[f_hat(x)]² + Variance[f_hat(x)] + Irreducible Noise Error (σ²)',
          'Expected Error = Bias + Variance - Covariance(x, y)',
          'Expected Error = Loss Function Gradient divided by Learning Rate',
          'Expected Error = Cross-Entropy Loss multiplied by Model Complexity'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'E[(y - f_hat(x))²] can be algebraically expanded.',
          'Bias measures the difference between average model prediction and the true function: (E[f_hat(x)] - f(x))².',
          'Variance measures how much predictions fluctuate across different training datasets: E[(f_hat(x) - E[f_hat(x)])²].',
          'Irreducible error σ² is the inherent noise in data that no model can eliminate.'
        ],
        modelAnswer: 'The expected mean squared test error of a regression estimator decomposes into three additive components: E[(y - f_hat)²] = (Bias[f_hat])² + Var[f_hat] + σ², where Bias² = (E[f_hat(x)] - f(x))² represents errors from overly simplistic model assumptions (underfitting), Variance = E[(f_hat(x) - E[f_hat(x)])²] represents sensitivity to random training fluctuations (overfitting), and σ² is irreducible noise in the true data generating distribution.',
        expectedKeywords: ['bias-variance tradeoff', 'expected error', 'bias squared', 'variance', 'irreducible error', 'overfitting', 'underfitting']
      },
      {
        questionText: 'How does L1 Regularization (Lasso) differ from L2 Regularization (Ridge) in terms of geometric penalty contour, and why does L1 perform automatic feature selection?',
        type: 'mcq',
        options: [
          'L1 penalty has sharp diamond/octahedral corners (sum |w_i| <= t) that intersect the elliptical loss contours along the coordinate axes, forcing non-essential weights to exact zero; L2 has spherical contours (sum w_i² <= t) that shrink weights smoothly without zeroing them',
          'L1 is used strictly for classification while L2 is used strictly for clustering',
          'L2 regularization causes gradient explosion in deep neural networks',
          'L1 regularization requires computing the matrix Hessian inverse whereas L2 does not'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Look at the geometric constraint boundaries in parameter space.',
          'L1 norm constraint ||w||_1 <= C creates a diamond (rhombus in 2D, polytope in nD) with sharp vertices on the coordinate axes.',
          'Elliptical unregularized loss contours are most likely to hit these sharp corner vertices first.',
          'At a coordinate axis intercept, one or more feature weights w_i are exactly 0, yielding sparse models.'
        ],
        modelAnswer: 'In constrained optimization space, L1 regularization adds a diamond-shaped L1 norm constraint (|w1| + |w2| <= C) with sharp corners aligned along the parameter axes. The elliptical contours of the objective loss function typically intersect these sharp vertices, setting non-informative feature coefficients to exactly zero, producing a sparse model with automatic feature selection. In contrast, the L2 constraint is a smooth circle/hypersphere (w1² + w2² <= C), which shrinks weights proportionally toward zero but rarely sets them exactly to zero.',
        expectedKeywords: ['l1 regularization', 'l2 regularization', 'lasso', 'ridge', 'sparsity', 'feature selection', 'geometric contour']
      },
      {
        questionText: 'Contrast Bagging (Bootstrap Aggregation, e.g. Random Forest) with Boosting (e.g. Gradient Boosted Decision Trees / XGBoost) in terms of how they alter the Bias and Variance of the base learners.',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'Bagging trains multiple deep, high-variance, low-bias decision trees independently in parallel on bootstrap samples.',
          'Averaging M independent models with variance σ² reduces variance to σ²/M + covariance terms, substantially decreasing Variance without increasing Bias.',
          'Boosting trains shallow, high-bias, low-variance weak learners sequentially.',
          'Each new tree fits the residual errors/gradient of the previous ensemble, systematically reducing Bias.'
        ],
        modelAnswer: 'Bagging and Boosting target opposite components of the bias-variance tradeoff: 1. Bagging (Random Forest) trains fully grown, deep decision trees (low bias, high variance) in parallel on bootstrap resamples with random feature subsets. Averaging their predictions dramatically reduces variance without affecting bias; 2. Boosting (GBDT, XGBoost, AdaBoost) trains shallow decision trees/stumps (high bias, low variance) sequentially. Each tree fits the pseudo-residuals (negative gradient) of the preceding ensemble, systematically reducing ensemble bias while controlling variance via learning rate shrinkage.',
        expectedKeywords: ['bagging', 'boosting', 'random forest', 'xgboost', 'variance reduction', 'bias reduction', 'ensemble learning']
      }
    ]
  },

  // 10. Eigenvalues & Linear Algebra (Mathematics)
  eigenvalues_linear_algebra: {
    matchKeywords: [
      'eigenvalues & linear algebra', 'eigenvalue', 'eigenvalues', 'eigenvector',
      'linear algebra', 'characteristic equation', 'diagonalization', 'spectral theorem', 'singular value decomposition', 'svd'
    ],
    questions: [
      {
        questionText: 'What is the geometric and algebraic definition of an Eigenvector (v) and its corresponding Eigenvalue (λ) for an n x n square matrix A?',
        type: 'mcq',
        options: [
          'A non-zero vector v whose direction is invariant under linear transformation A, being scaled only by the scalar factor λ: A v = λ v, derived from det(A - λ I) = 0',
          'A vector perpendicular to the matrix kernel that maximizes trace trace(A)',
          'The diagonal elements of any arbitrary upper-triangular permutation matrix',
          'The determinant of matrix A divided by its condition number'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'In matrix multiplication, A v typically rotates and stretches vector v.',
          'For an eigenvector, matrix A acts simply as a scalar multiplier: A v = λ v.',
          'Rearranging: (A - λ I) v = 0.',
          'For non-trivial solutions (v != 0), the matrix (A - λ I) must be singular, meaning det(A - λ I) = 0.'
        ],
        modelAnswer: 'An eigenvector of an n x n matrix A is a non-zero vector v that, when transformed by A, changes only in magnitude by scalar factor λ without changing its direction: A v = λ v. This can be expressed as the homogeneous linear system (A - λ I) v = 0. For a non-trivial solution (v != 0) to exist, the transformation must have a non-trivial null space, requiring det(A - λ I) = 0, which yields the characteristic polynomial.',
        expectedKeywords: ['eigenvalue', 'eigenvector', 'a v = lambda v', 'characteristic equation', 'determinant', 'linear transformation']
      },
      {
        questionText: 'Under what necessary and sufficient condition can an n x n square matrix A be Diagonalized into the form A = P D P⁻¹?',
        type: 'mcq',
        options: [
          'Matrix A possesses n linearly independent eigenvectors (meaning the geometric multiplicity of every eigenvalue equals its algebraic multiplicity)',
          'Matrix A has an absolute determinant strictly greater than 1.0',
          'Matrix A contains zero complex entries in its upper triangular decomposition',
          'All diagonal elements of matrix A are strictly prime numbers'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'D is a diagonal matrix of eigenvalues, and P is the matrix whose columns are the eigenvectors.',
          'To invert P (P⁻¹), P must have full column rank.',
          'Full column rank requires n linearly independent column vectors.',
          'If an eigenvalue has algebraic multiplicity > geometric multiplicity (defective matrix), A cannot be diagonalized.'
        ],
        modelAnswer: 'A square matrix A of size n x n is diagonalizable (A = P D P⁻¹) if and only if it possesses n linearly independent eigenvectors. Matrix P is formed by placing these n eigenvectors as columns, and D is the diagonal matrix of corresponding eigenvalues. A matrix fails to diagonalize (is defective) if the geometric multiplicity (dimension of eigenspace) of any eigenvalue is strictly less than its algebraic multiplicity (multiplicity as root of characteristic polynomial).',
        expectedKeywords: ['diagonalization', 'linearly independent eigenvectors', 'algebraic multiplicity', 'geometric multiplicity', 'defective matrix']
      },
      {
        questionText: 'State the Spectral Theorem for Real Symmetric Matrices (A = A^T). What guarantees does it provide regarding eigenvalues and eigenvectors?',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'Property 1: All eigenvalues of a real symmetric matrix are guaranteed to be real numbers (no imaginary parts).',
          'Property 2: Eigenvectors corresponding to distinct eigenvalues are mutually orthogonal.',
          'Property 3: There exists an orthonormal basis of R^n consisting of eigenvectors of A.',
          'Property 4: Matrix A can always be orthogonally diagonalized: A = Q D Q^T where Q is an orthogonal matrix (Q^T = Q⁻¹).'
        ],
        modelAnswer: 'The Spectral Theorem states that every real symmetric matrix (A = A^T) has: 1. Exclusively real eigenvalues; 2. Mutually orthogonal eigenvectors for distinct eigenvalues; 3. A complete orthonormal basis of eigenvectors in R^n (it is never defective); 4. Orthogonal diagonalizability into A = Q D Q^T, where Q is an orthogonal matrix (Q Q^T = I) and D is real diagonal matrix of eigenvalues. This theorem forms the mathematical foundation of Principal Component Analysis (PCA) and SVD.',
        expectedKeywords: ['spectral theorem', 'real symmetric matrix', 'orthogonal eigenvectors', 'real eigenvalues', 'orthogonal diagonalization', 'pca']
      },
      {
        questionText: 'In Singular Value Decomposition (SVD), how is any arbitrary m x n real matrix A decomposed, and what do the singular values (σi) represent geometrically?',
        type: 'mcq',
        options: [
          'A = U Σ V^T, where U is m x m orthogonal, V is n x n orthogonal, and Σ contains the non-negative singular values σi = sqrt(λi(A^T A)) representing the semi-axis lengths of the hyperellipsoid mapped from the unit sphere',
          'A = L U where L is lower triangular and U is upper triangular',
          'A = Q R where Q is orthogonal and R is diagonal',
          'A = P D P⁻¹ where D contains the imaginary roots of det(A)'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'SVD applies to any matrix, including rectangular (m x n) matrices.',
          'A maps a unit sphere in R^n into a hyperellipsoid in R^m.',
          'The singular values σ1 >= σ2 >= ... >= 0 represent the lengths of the principal semi-axes of this hyperellipsoid.',
          'Right singular vectors V are eigenvectors of A^T A; left singular vectors U are eigenvectors of A A^T.'
        ],
        modelAnswer: 'Singular Value Decomposition factors any real m x n matrix A into A = U Σ V^T, where U (m x m) and V (n x n) are orthogonal matrices and Σ (m x n) is a diagonal matrix containing non-negative singular values σi in descending order. The singular values are the square roots of the non-negative eigenvalues of A^T A (σi = sqrt(λi)). Geometrically, A maps the unit sphere in R^n into a hyperellipsoid in R^m, whose principal semi-axis directions are given by the columns of U and semi-axis lengths equal σi.',
        expectedKeywords: ['singular value decomposition', 'svd', 'u sigma v transpose', 'singular values', 'hyperellipsoid', 'unit sphere']
      }
    ]
  }
};
