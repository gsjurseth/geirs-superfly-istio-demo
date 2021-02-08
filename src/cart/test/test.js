var expect = require('chai').expect;
 
var wh = require('../warehouse-schema.js');
 
describe('warehouse-schema', function() {
    it('should be invalid if the dataset is empty', function(done) {
        var m = new wh();
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('warehouse-schema', function() {
    it('should be invalid if the name is empty', function(done) {
        var m = new wh( {"number": 1} );
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('warehouse-schema', function() {
    it('should be invalid if the number is empty', function(done) {
        var m = new wh( {"name": "aName"} );
 
        m.validate(function(err) {
            expect(err.errors.number).to.exist;
            done();
        });
    });
});

describe('warehouse-schema', function() {
    it('should be valid if both name and number are defined', function(done) {
        var m = new wh( {"name": "snarfity", "number": 1} );
 
        m.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});

describe('warehouse-schema', function() {
    it('should be invalid if both name and number are strings', function(done) {
        var m = new wh( {"name": "snarfity", "number": "string"} );
 
        m.validate(function(err) {
            expect(err.errors.number).to.exist;
            done();
        });
    });
});
