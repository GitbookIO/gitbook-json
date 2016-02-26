var should = require('should');
var gitbookJson = require('../')

var VERSION1 = require('./fixtures/version1');
var VERSION2 = require('./fixtures/version2');

describe('Detection', function() {
    it('should detect version 1', function() {
        gitbookJson.detectVersion(VERSION1).should.equal(1);
    });

    it('should detect version 2', function() {
        gitbookJson.detectVersion(VERSION2).should.equal(2);
    });
});

describe('Convert', function() {
    describe('To Version 2', function() {
        var version2 = gitbookJson.toVersion2(VERSION1);

        it('should not convert json already in version 2', function() {
            gitbookJson.toVersion2(VERSION2).should.equal(VERSION2);
        });

        it('should export page.content', function() {
            version2.page.should.be.an.Object();
            version2.page.content.should.be.a.String();
            version2.page.content.should.startWith('<h1');
        });
    });

    describe('To Version 1', function() {
        var version1 = gitbookJson.toVersion1(VERSION2);

        it('should not convert json already in version 1', function() {
            gitbookJson.toVersion1(VERSION1).should.equal(VERSION1);
        });

        it('should export sections', function() {
            version1.sections.should.be.an.Array();
            version1.sections.should.have.lengthOf(1);
            version1.sections[0].should.be.an.Object();
            version1.sections[0].content.should.be.a.String();
            version1.sections[0].content.should.startWith('<h1');
        });

        it('should export progress.chapters', function() {
            version1.progress.should.be.an.Object();
            version1.progress.should.have.property('chapters').which.is.an.Array();
            version1.progress.chapters.should.have.lengthOf(21);
            version1.progress.chapters[0].title.should.equal('Introduction');
            version1.progress.chapters[20].title.should.equal('Lua interpreter');
        });

        it('should export progress.current', function() {
            version1.progress.should.be.an.Object();
            version1.progress.should.have.property('current').which.is.an.Object();
            version1.progress.current.title.should.equal('Introduction');
        });

        it('should export progress.percent and progress.prevPercent', function() {
            version1.progress.should.have.property('percent').which.is.an.Number();
            version1.progress.should.have.property('prevPercent').which.is.an.Number();
            version1.progress.percent.should.equal(0);
            version1.progress.prevPercent.should.equal(0);
        });
    });
});
