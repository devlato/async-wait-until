var waitUntil = require('../src/waitUntil');


describe('waitUntil', function() {
  it('Should apply callback and resolve result', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      return (Date.now() - initialTime > 200);
    })
    .then(function (result) {
      expect(result)
          .toEqual(true);
    });
  });


  it('Should apply callback and resolve non-boolean result', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      return (Date.now() - initialTime > 200)
          ? {a: 10, b: 20}
          : false;
    })
    .then(function (result) {
      expect(result)
          .toEqual({a: 10, b: 20});
    });
  });


  it('Should reject with timeout error if timed out', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      return (Date.now() - initialTime > 500);
    }, 100)
    .catch(function (result) {
      expect(result)
          .toBeInstanceOf(Error);

      expect(result.toString())
          .toEqual('Error: Timed out after waiting for 100ms');
    });
  });


  it('Should not do double reject on timeout', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      return (Date.now() - initialTime > 200);
    }, 200)
    .catch(function (result) {
      expect(result)
          .toBeInstanceOf(Error);

      expect(result.toString())
          .toEqual('Error: Timed out after waiting for 200ms');
    });
  });


  it('Should not do double reject on timeout if error in predicate', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      if (Date.now() - initialTime >= 190) {
        throw new Error('Nooo!');
      }
    }, 200)
    .catch(function (result) {
      expect(result)
          .toBeInstanceOf(Error);

      expect(result.toString())
          .toEqual('Error: Timed out after waiting for 200ms');
    });
  });


  it('Should reject result if error in predicate', function() {
    var initialTime = Date.now();

    return waitUntil(function() {
      throw new Error('Crap!');
    })
    .catch(function (result) {
      expect(result)
          .toBeInstanceOf(Error);

      expect(result.toString())
          .toEqual('Error: Crap!');
    });
  });
});
