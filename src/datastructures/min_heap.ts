export type HeapNode = {
  row: number;
  col: number;
  dist: number;
};

export class MinHeap {
  private heap: HeapNode[];

  constructor() {
    this.heap = [];
  }

  insert(node: HeapNode): void {
    this.heap.push(node);
    this.bubbleUp();
  }

  extractMin(): HeapNode {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.sinkDown();
    }
    return min;
  }

  private bubbleUp(): void {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];

      if (element.dist >= parent.dist) break;

      this.heap[idx] = parent;
      this.heap[parentIdx] = element;
      idx = parentIdx;
    }
  }

  private sinkDown(): void {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let swap: number | null = null;

      if (leftIdx < length && this.heap[leftIdx].dist < element.dist) {
        swap = leftIdx;
      }

      if (
        rightIdx < length &&
        this.heap[rightIdx].dist <
          (swap === null ? element.dist : this.heap[leftIdx].dist)
      ) {
        swap = rightIdx;
      }

      if (swap === null) break;

      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
