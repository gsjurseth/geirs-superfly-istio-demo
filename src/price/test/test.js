var expect = require('chai').expect;
 
var wh = require('../price-schema.js');
 
describe('price-schema', function() {
    it('should be invalid if the dataset is empty', function(done) {
        var m = new wh();
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('price-schema', function() {
    it('should be invalid if the name is empty', function(done) {
        var m = new wh( {"price": 1} );
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('price-schema', function() {
    it('should be invalid if the price is empty', function(done) {
        var m = new wh( {"name": "aName"} );
 
        m.validate(function(err) {
            expect(err.errors.price).to.exist;
            done();
        });
    });
});

describe('price-schema', function() {
    it('should be valid if both name and price are defined', function(done) {
        var m = new wh( {"name": "snarfity", "price": 1} );
 
        m.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});

describe('price-schema', function() {
    it('should be invalid if both name and price are strings', function(done) {
        var m = new wh( {"name": "snarfity", "price": "string"} );
 
        m.validate(function(err) {
            expect(err.errors.price).to.exist;
            done();
        });
    });
});
