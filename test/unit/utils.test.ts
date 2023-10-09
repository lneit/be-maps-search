import { fixedEncodeURIComponent, isValidLimit } from '../../src/utils';

describe('fixedEncodeURIComponent', () => {
  it('should escape the given string', () => {
    const result = fixedEncodeURIComponent('rm *');
    expect(result).toBe('rm%20%2a');
  });
});

describe('isValidLimit', () => {
  it('should be undefined or in the range of 0-100', () => {
    expect(isValidLimit(undefined)).toBeTruthy();
    expect(isValidLimit(-300)).not.toBeTruthy();
    expect(isValidLimit(300)).not.toBeTruthy();
    expect(isValidLimit(100)).toBeTruthy();
    expect(isValidLimit(0)).toBeTruthy();
  });
});
