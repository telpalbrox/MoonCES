/*globals describe: true, it: true */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/commonjs.d.ts" />
/// <reference path="../src/Component.ts" />
/// <reference path="../src/Entity.ts" />
/// <reference path="../src/EntityList.ts" />
/// <reference path="../src/EntityNode.ts" />
/// <reference path="../src/Family.ts" />
/// <reference path="../src/Listener.ts" />
/// <reference path="../src/Signal.ts" />
/// <reference path="../src/System.ts" />
/// <reference path="../src/World.ts" />

var expect = require('chai').expect;

describe('entity', function () {
    it('should have unique id', function () {
        var ea = new CES.Entity(),
            eb = new CES.Entity(),
            ec = new CES.Entity();

        expect(ea.id).to.not.equal(eb.id);
        expect(eb.id).to.not.equal(ec.id);
        expect(ea.id).to.not.equal(ec.id);
    });

    it('should return true when checking added components', function () {
        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        entity.addComponent(new CompB());
        entity.addComponent(new CompC());

        expect(entity.hasComponent('a')).to.equal(true);
        expect(entity.hasComponent('b')).to.equal(true);
        expect(entity.hasComponent('c')).to.equal(true);
        expect(entity.hasComponent('d')).to.equal(false);
    });

    it('should return false when checking removed components', function () {
        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        entity.addComponent(new CompB());
        entity.addComponent(new CompC());

        entity.removeComponent('b');
        entity.removeComponent('c');

        expect(entity.hasComponent('a')).to.equal(true);
        expect(entity.hasComponent('b')).to.equal(false);
        expect(entity.hasComponent('c')).to.equal(false);
    });

    it('should return the correct component', function () {
        var entity = new CES.Entity(),
            ca = new CompA(),
            cb = new CompB(),
            cc = new CompC();

        entity.addComponent(ca);
        entity.addComponent(cb);
        entity.addComponent(cc);

        expect(entity.getComponent('a')).equal(ca);
        expect(entity.getComponent('b')).equal(cb);
        expect(entity.getComponent('c')).equal(cc);
        expect(entity.getComponent('d')).equal(undefined);
    });

    it('should emit signals when adding components', function () {
        var entity = new CES.Entity(),
            collections = [];

        entity.onComponentAdded.add(function (entity, componentName) {
            collections.push([entity, componentName]);
        });

        entity.addComponent(new CompA());
        entity.addComponent(new CompB());

        expect(collections[0][0]).equal(entity);
        expect(collections[0][1]).equal('a');
        expect(collections[1][0]).equal(entity);
        expect(collections[1][1]).equal('b');
    });

    it('should emit signals when removing components', function () {
        var entity = new CES.Entity(),
            collections = [];

        entity.onComponentRemoved.add(function (entity, componentName) {
            collections.push([entity, componentName]);
        });
        entity.onComponentRemoved.add(function (entity, componentName) {
            collections.push('removed');
        });

        entity.addComponent(new CompA());
        entity.addComponent(new CompB());
        entity.addComponent(new CompC());

        entity.removeComponent('a');
        entity.removeComponent('b');

        expect(collections).eql([
            [entity, 'a'], 'removed', [entity, 'b'], 'removed'
        ]);
    });
});
