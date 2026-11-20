# GTU OS 3140702 Banker's Algorithm checker: Need matrix, Work column and a safe sequence

GTU Hero's OS guide counts Banker's Algorithm in W2022, S2023 and W2024, each time as a full numerical with Allocation, Max and Available, usually 4 to 5 processes and 3 resource types. Unit 5 (Deadlock) is 8% of 3140702, but the 4 deadlock conditions plus one Banker's numerical is easy scoring. Matrices daalo: this page writes the Need matrix, the Work column after every success, and whether the state is safe. Practice values are my own, not from a GTU paper. Need matrix skip mat karna, uske alag marks hote hain.

Live page: https://princeadvant.github.io/gtu-os-bankers-algorithm-checker/

## Facts used

- Need = Max minus Allocation, written as a full matrix. The guide says this is usually worth marks on its own.
- Work starts as Available. A process may run if it is not finished and every column of its Need is <= current Work.
- When it runs, Work becomes Work + its Allocation, and it is added to the sequence. If every process finishes, the state is safe.
- Self-check: the final Work must equal Available plus the column sums of Allocation (the total instances of each resource).
- The default practice set (5 processes, Available = (1, 1, 1)) is safe, with one valid sequence <P1, P2, P3, P4, P0> and final Work (5, 4, 6).

## Test

`node test.js` checks the calculations against hand-worked values and prints `All checks passed`.

## Tips

- Compare Need with the current Work, not with Max or the original Available.
- Write the 4 deadlock conditions with one-line definitions if the question asks for them (mutual exclusion, hold and wait, no preemption, circular wait). The guide counted those in 5 of 6 papers.
- A request question is different: first check Request <= Need and Request <= Available, pretend to grant it, then run the safety check on the new state.
- More than one safe sequence can exist. Any valid one gets marks if the Need matrix and the Work column are shown.

Repeat table, unit weights and the 7-day OS plan (Day 4 is Banker's without notes): [GTU Hero](https://gtuhero.com/blogs/gtu-os-paper-operating-system-pyq) (GTU Hero is my project).
