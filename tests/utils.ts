export function isArraySame(array1: any[], array2: any[]): boolean {
  if (array1.length === array2.length) {
    return array1.every((element, index) => {
      if (element === array2[index]) {
        return true;
      }

      return false;
    });
  }
  return false;
}

export function subArray(arr: any[], start: number, end: number): any[] {
  if (!end) {
    end = -1;
  }
  return arr.slice(start, end);
}
