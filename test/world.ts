/*globals describe: true, it: true */
/// <reference path="../src/commonjs.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
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
var sinon = require('sinon');

class CompA extends CES.Component {
    name: string = 'a';
}
class CompB extends CES.Component {
    name: string = 'b';
}
class CompC extends CES.Component {
    name: string = 'c';
}

function createEntityA() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompB());
    entity.addComponent(new CompC());
    return entity;
}

function createEntityB() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompB());
    return entity;
}

function createEntityC() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompC());
    return entity;
}

describe('world', function () {
    it('should get correct entities for each family', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityA();
            world.addEntity(e);
        }
        for (i = 0; i < 100; ++i) {
            e = createEntityB();
            world.addEntity(e);
        }
        for (i = 0; i < 100; ++i) {
            e = createEntityC();
            world.addEntity(e);
        }

        expect(world.getEntities('a').length).equal(300);
        expect(world.getEntities('b').length).equal(200);
        expect(world.getEntities('c').length).equal(200);
        expect(world.getEntities('a', 'b', 'c').length).equal(100);
        expect(world.getEntities('a', 'b').length).equal(200);
        expect(world.getEntities('a', 'c').length).equal(200);
        expect(world.getEntities('a', 'b', 'c', 'd').length).equal(0);
    });

    it('should update entity-family relationship when adding components', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityB();
            world.addEntity(e);
        }

        expect(world.getEntities('a', 'b').length).equal(100);
        expect(world.getEntities('a', 'b', 'c').length).equal(0);

        e.addComponent(new CompC());
        expect(world.getEntities('a', 'b', 'c').length).equal(1);
    });

    it('should update entity-family relationship when removing components', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityA();
            world.addEntity(e);
        }
        expect(world.getEntities('a', 'b', 'c').length).equal(100);
        expect(world.getEntities('a', 'b').length).equal(100);

        e.removeComponent('c');

        expect(world.getEntities('a', 'b', 'c').length).equal(99);
        expect(world.getEntities('a', 'b').length).equal(100);
    });

    it('should emit signal when entity with one component is added', function() {
        var world = new CES.World();

        var aListener = sinon.spy();
        var bListener = sinon.spy();
        world.entityAdded('a').add(aListener);
        world.entityAdded('b').add(bListener);

        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        world.addEntity(entity);

        expect(aListener.calledOnce).equals(true);
        expect(bListener.calledOnce).equals(false);
    });

    it('should emit signal when entity with two components is added', function() {
        var world = new CES.World();

        var aListener = sinon.spy();
        var abListener = sinon.spy();
        var cListener = sinon.spy();

        world.entityAdded('a').add(aListener);
        world.entityAdded('a', 'b').add(abListener);
        world.entityAdded('c').add(abListener);

        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        entity.addComponent(new CompB());
        world.addEntity(entity);

        expect(aListener.calledOnce).equals(true);
        expect(abListener.calledOnce).equals(true);
        expect(cListener.calledOnce).equals(false);
    });

    it('should emit signal when entity is removed', function() {
        var world = new CES.World();

        var aListener = sinon.spy();
        var bListener = sinon.spy();
        world.entityRemoved('a').add(aListener);
        world.entityRemoved('b').add(bListener);

        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        world.addEntity(entity);

        expect(aListener.calledOnce).equals(false);
        expect(bListener.calledOnce).equals(false);

        world.removeEntity(entity);

        expect(aListener.calledOnce).equals(true);
        expect(bListener.calledOnce).equals(false);
    });

    it('should emit signal when entity has component added', function() {
        var world = new CES.World();

        var abListener = sinon.spy();
        var bListener = sinon.spy();
        world.entityAdded('a', 'b').add(abListener);

        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        world.addEntity(entity);

        expect(abListener.calledOnce).equals(false);

        entity.addComponent(new CompB());

        expect(abListener.calledOnce).equals(true);
    });

    it('should emit signal when entity has component removed', function() {
        var world = new CES.World();

        var abListener = sinon.spy();
        var bListener = sinon.spy();
        world.entityRemoved('a', 'b').add(abListener);

        var entity = new CES.Entity();
        entity.addComponent(new CompA());
        entity.addComponent(new CompB());
        world.addEntity(entity);

        expect(abListener.calledOnce).equals(false);

        entity.removeComponent('b');

        expect(abListener.calledOnce).equals(true);
    });

    describe('with system', function() {
        it('addToWorld should be called when system is added', function() {
            var world = new CES.World();
            var system = new CES.System();
            var addedToWorld = sinon.spy(system, 'addedToWorld');

            world.addSystem(system);

            expect(addedToWorld.calledOnce).equals(true);
        });

        it('addToWorld should be called when system is removed', function() {
            var world = new CES.World();
            var system = new CES.System();
            var removedFromWorld = sinon.spy(system, 'removedFromWorld');

            world.addSystem(system);

            expect(removedFromWorld.calledOnce).equals(false);

            world.removeSystem(system);

            expect(removedFromWorld.calledOnce).equals(true);
        });
    })
});