// Import necessary dependencies
const { expect } = require('chai');

// Import the module to be tested
const exampleModule = require('../example');

// Describe the test suite
describe('Example Module', () => {
  // Test case 1: Verify the functionality of a specific method
  it('should return the correct result', () => {
    // Arrange
    const input = 5;

    // Act
    const result = exampleModule.someMethod(input);

    // Assert
    expect(result).to.equal(10);
  });

  // Test case 2: Verify another functionality
  it('should handle edge cases', () => {
    // Arrange
    const input = 0;

    // Act
    const result = exampleModule.someMethod(input);

    // Assert
    expect(result).to.equal(0);
  });
});
