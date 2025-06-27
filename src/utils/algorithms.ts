export default function getUniqueRandomNumbers(n: number, start: number, end: number): number[] {
    const range = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = range.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [range[i], range[j]] = [range[j], range[i]];
    }

    return range.slice(0, n);
}