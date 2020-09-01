var expect = require('chai').expect;
 
var md = require('../md-schema.js');
 
describe('masterdata-schema', function() {
    it('should be invalid if the dataset is empty', function(done) {
        var m = new md();
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('masterdata-schema', function() {
    it('should be invalid if the name is empty', function(done) {
        var m = new md( {"number": 1} );
 
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});

describe('masterdata-schema', function() {
    it('should be invalid if the imgUrl is empty', function(done) {
        var m = new md( {"name": "aName", "desc": "this describes nothing"} );
 
        m.validate(function(err) {
            expect(err.errors.imgUrl).to.exist;
            done();
        });
    });
});

describe('masterdata-schema', function() {
    it('should be invalid if the desc is empty', function(done) {
        var m = new md( {"name": "aName", "imgUrl": "http://foo.com/img"} );
 
        m.validate(function(err) {
            expect(err.errors.desc).to.exist;
            done();
        });
    });
});

describe('masterdata-schema', function() {
    it('should be valid if both name,imgUrl, and desc are defined', function(done) {
        var m = new md( {"name": "snarfity", "imgUrl": "http://foo.com/img.png", "desc": "This describes nothing"} );
 
        m.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});
