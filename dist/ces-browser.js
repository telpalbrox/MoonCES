var CES;
(function (CES) {
    /**
     * The components is the container of some properties that
     * the entity possesses. It may also contain some methods.
     * @class
     */
    var Component = (function () {
        function Component() {
        }
        return Component;
    })();
    CES.Component = Component;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The entity is the container of components.
     * @class
     */
    var Entity = (function () {
        function Entity() {
            /**
             * @public
             * @readonly
             */
            this.id = Entity._id++;
            /**
             * Map from component names to components.
             * @private
             * @property
             */
            this.components = {};
            /**
             * @public
             * @readonly
             */
            this.onComponentAdded = new CES.Signal();
            /**
             * @public
             * @readonly
             */
            this.onComponentRemoved = new CES.Signal();
        }
        /**
         * Check if this entity has a component by name.
         * @public
         * @param {String} componentName
         * @return {Boolean}
         */
        Entity.prototype.hasComponent = function (componentName) {
            return this.components['$' + componentName] !== undefined;
        };
        /**
         * Get a component of this entity by name.
         * @public
         * @param {String} componentName
         * @return {Component}
         */
        Entity.prototype.getComponent = function (componentName) {
            return this.components['$' + componentName];
        };
        /**
         * Add a component to this entity.
         * @public
         * @param {Component} component
         */
        Entity.prototype.addComponent = function (component) {
            this.components['$' + component.name] = component;
            this.onComponentAdded.emit(this, component.name);
        };
        /**
         * Remove a component from this entity by name.
         * @public
         * @param {String} componentName
         */
        Entity.prototype.removeComponent = function (componentName) {
            var removedComponent = this.components['$' + componentName];
            this.components['$' + componentName] = undefined;
            this.onComponentRemoved.emit(this, componentName, removedComponent);
        };
        Entity._id = 0;
        return Entity;
    })();
    CES.Entity = Entity;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The entity list is a doubly-linked-list which allows the
     * entities to be added and removed efficiently.
     * @class
     */
    var EntityList = (function () {
        function EntityList() {
            /**
             * @public
             * @readonly
             */
            this.head = null;
            /**
             * @public
             * @readonly
             */
            this.tail = null;
            /**
             * @public
             * @readonly
             */
            this.length = 0;
            /**
             * Map from entity id to entity node,
             * for O(1) find and deletion.
             * @private
             */
            this.entities = {};
        }
        /**
         * Add an entity into this list.
         * @public
         * @param {Entity} entity
         */
        EntityList.prototype.add = function (entity) {
            var node = new CES.EntityNode(entity);
            if (this.head === null) {
                this.head = this.tail = node;
            }
            else {
                node.prev = this.tail;
                this.tail.next = node;
                this.tail = node;
            }
            this.length++;
            this.entities[entity.id] = node;
        };
        /**
         * Remove an entity from this list.
         * @public
         * @param {Entity} entity
         */
        EntityList.prototype.remove = function (entity) {
            var node = this.entities[entity.id];
            if (node === undefined) {
                return;
            }
            if (node.prev === null) {
                this.head = node.next;
            }
            else {
                node.prev.next = node.next;
            }
            if (node.next === null) {
                this.tail = node.prev;
            }
            else {
                node.next.prev = node.prev;
            }
            this.length--;
            delete this.entities[entity.id];
        };
        /**
         * Check if this list has the entity.
         * @public
         * @param {Entity} entity
         * @return {Boolean}
         */
        EntityList.prototype.has = function (entity) {
            return this.entities[entity.id] !== undefined;
        };
        /**
         * Remove all the entities from this list.
         * @public
         */
        EntityList.prototype.clear = function () {
            this.head = this.tail = null;
            this.length = 0;
            this.entities = {};
        };
        /**
         * Return an array holding all the entities in this list.
         * @public
         * @return {Array}
         */
        EntityList.prototype.toArray = function () {
            var array = [];
            for (var node = this.head; node; node = node.next) {
                array.push(node.entity);
            }
            return array;
        };
        return EntityList;
    })();
    CES.EntityList = EntityList;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The entity node is a wrapper around an entity, to be added into
     * the entity list.
     * @class
     */
    var EntityNode = (function () {
        function EntityNode(entity) {
            this.entity = entity;
            this.next = null;
            this.prev = null;
        }
        return EntityNode;
    })();
    CES.EntityNode = EntityNode;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The family is a collection of entities having all the specified components.
     * @class
     */
    var Family = (function () {
        /**
         * @constructor
         * @param {Array} componentNames
         */
        function Family(componentNames) {
            /**
             * @private
             */
            this.componentNames = componentNames;
            /**
             * A linked list holding the entities;
             * @private
             */
            this.entities = new CES.EntityList();
            /**
             * @public
             * @readonly
             */
            this.entityAdded = new CES.Signal();
            /**
             * @public
             * @readonly
             */
            this.entityRemoved = new CES.Signal();
        }
        /**
         * Get the entities of this family.
         * @public
         * @return {Array}
         */
        Family.prototype.getEntities = function () {
            return this.entities.toArray();
        };
        /**
         * Add the entity into the family if match.
         * @public
         * @param {Entity} entity
         */
        Family.prototype.addEntityIfMatch = function (entity) {
            if (!this.entities.has(entity) && this.matchEntity(entity)) {
                this.entities.add(entity);
                this.entityAdded.emit(entity);
            }
        };
        /**
         * Remove the entity into the family if match.
         * @public
         * @function
         * @param {Entity} entity
         */
        Family.prototype.removeEntity = function (entity) {
            if (this.entities.has(entity)) {
                this.entities.remove(entity);
                this.entityRemoved.emit(entity);
            }
        };
        /**
         * Handler to be called when a component is added to an entity.
         * @public
         * @param {Entity} entity
         * @param {String} componentName
         */
        Family.prototype.onComponentAdded = function (entity, componentName) {
            this.addEntityIfMatch(entity);
        };
        /**
         * Handler to be called when a component is removed from an entity.
         * @public
         * @param {Entity} entity
         * @param {String} componentName
         * @param {Component} removedComponent
         */
        Family.prototype.onComponentRemoved = function (entity, componentName, removedComponent) {
            // return if the entity is not in this family
            if (!this.entities.has(entity)) {
                return;
            }
            // remove the node if the removed component is required by this family
            for (var i = 0; i < this.componentNames.length; ++i) {
                if (this.componentNames[i] === componentName) {
                    this.entities.remove(entity);
                    this.entityRemoved.emit(entity, removedComponent);
                }
            }
        };
        /**
         * Check if an entity belongs to this family.
         * @private
         * @param {Entity} entity
         * @return {Boolean}
         */
        Family.prototype.matchEntity = function (entity) {
            for (var i = 0; i < this.componentNames.length; i++) {
                if (!entity.hasComponent(this.componentNames[i])) {
                    return false;
                }
            }
            return true;
        };
        return Family;
    })();
    CES.Family = Family;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The signal can register listeners and invoke the listeners with messages.
     * @class
     */
    var Signal = (function () {
        function Signal() {
            this.listeners = [];
        }
        /**
         * Add a listener to this signal.
         * @public
         * @param {Function} listener
         */
        Signal.prototype.add = function (listener) {
            this.listeners.push(listener);
        };
        /**
         * Remove a listener from this signal.
         * @public
         * @param {Function} listener
         */
        Signal.prototype.remove = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (listener === this.listeners[i]) {
                    this.listeners.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        /**
         * Emit a message.
         * @public
         * @param {...*} messages
         */
        Signal.prototype.emit = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            for (var _a = 0, _b = this.listeners; _a < _b.length; _a++) {
                var listener = _b[_a];
                listener.apply(null, messages);
            }
        };
        return Signal;
    })();
    CES.Signal = Signal;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The system is responsible for updating the entities.
     * @class
     */
    var System = (function () {
        function System() {
            this.world = null;
        }
        System.prototype.addedToWorld = function (world) {
            this.world = world;
        };
        System.prototype.removedFromWorld = function () {
            this.world = null;
        };
        /**
         * Update the entities.
         * @public
         * @param {Number} dt time interval between updates
         */
        System.prototype.update = function (dt) {
            throw new Error('Subclassed should override this method');
        };
        return System;
    })();
    CES.System = System;
})(CES || (CES = {}));
var CES;
(function (CES) {
    /**
     * The world is the container of all the entities and systems.
     * @class
     */
    var World = (function () {
        function World() {
            /**
             * A map from familyId to family
             * @private
             */
            this.families = {};
            /**
             * @private
             */
            this.systems = [];
            /**
             * @private
             */
            this.entities = new CES.EntityList();
        }
        /**
         * Add a system to this world.
         * @public
         * @param {System} system
         */
        World.prototype.addSystem = function (system) {
            this.systems.push(system);
            system.addedToWorld(this);
            return this;
        };
        /**
         * Remove a system from this world.
         * @public
         * @param {System} system
         */
        World.prototype.removeSystem = function (system) {
            for (var i = 0; i < this.systems.length; i++) {
                if (this.systems[i] === system) {
                    this.systems.splice(i, 1);
                    system.removedFromWorld();
                }
            }
        };
        /**
         * Add an entity to this world.
         * @public
         * @param {Entity} entity
         */
        World.prototype.addEntity = function (entity) {
            var _this = this;
            // try to add the entity into each family
            for (var familyId in this.families) {
                if (this.families.hasOwnProperty(familyId)) {
                    this.families[familyId].addEntityIfMatch(entity);
                }
            }
            // update the entity-family relationship whenever components are
            // added to or removed from the entities
            entity.onComponentAdded.add(function (entity, componentName) {
                _this.onComponentAdded(entity, componentName);
            });
            entity.onComponentRemoved.add(function (entity, componentName, component) {
                _this.onComponentRemoved(entity, componentName, component);
            });
            this.entities.add(entity);
        };
        /**
         * Remove and entity from this world.
         * @public
         * @param {Entity} entity
         */
        World.prototype.removeEntity = function (entity) {
            // try to remove the entity from each family
            for (var familyId in this.families) {
                if (this.families.hasOwnProperty(familyId)) {
                    this.families[familyId].removeEntity(entity);
                }
            }
            this.entities.remove(entity);
        };
        /**
         * Get the entities having all the specified componets.
         * @public
         * @param {...String} componentNames
         * @return {Array} an array of entities.
         */
        World.prototype.getEntities = function () {
            var componentNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                componentNames[_i - 0] = arguments[_i];
            }
            var familyId = CES.World.getFamilyId(componentNames);
            this.ensureFamilyExists(componentNames);
            return this.families[familyId].getEntities();
        };
        /**
         * For each system in the world, call its `update` method.
         * @public
         * @param {Number} dt time interval between updates.
         */
        World.prototype.update = function (dt) {
            for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
                var system = _a[_i];
                system.update(dt);
            }
        };
        /**
         * Returns the signal for entities added with the specified components. The
         * signal is also emitted when a component is added to an entity causing it
         * match the specified component names.
         * @public
         * @param {...String} componentNames
         * @return {Signal} A signal which is emitted every time an entity with
         *     specified components is added.
         */
        World.prototype.entityAdded = function () {
            var componentNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                componentNames[_i - 0] = arguments[_i];
            }
            var familyId = CES.World.getFamilyId(componentNames);
            this.ensureFamilyExists(componentNames);
            return this.families[familyId].entityAdded;
        };
        /**
         * Returns the signal for entities removed with the specified components.
         * The signal is also emitted when a component is removed from an entity
         * causing it to no longer match the specified component names.
         * @public
         * @param {...String} componentNames
         * @return {Signal} A signal which is emitted every time an entity with
         *     specified components is removed.
         */
        World.prototype.entityRemoved = function () {
            var componentNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                componentNames[_i - 0] = arguments[_i];
            }
            var familyId = CES.World.getFamilyId(componentNames);
            this.ensureFamilyExists(componentNames);
            return this.families[familyId].entityRemoved;
        };
        /**
         * Creates a family for the passed array of component names if it does not
         * exist already.
         * @param {Array.<String>} components
         */
        World.prototype.ensureFamilyExists = function (components) {
            var families = this.families;
            var familyId = CES.World.getFamilyId(components);
            if (!families[familyId]) {
                families[familyId] = new CES.Family(Array.prototype.slice.call(components));
                for (var node = this.entities.head; node; node = node.next) {
                    families[familyId].addEntityIfMatch(node.entity);
                }
            }
        };
        /**
         * Returns the family ID for the passed array of component names. A family
         * ID is a comma separated string of all component names with a '$'
         * prepended.
         * @param {Array.<String>} components
         * @return {String} The family ID for the passed array of components.
         */
        World.getFamilyId = function (components) {
            return '$' + Array.prototype.join.call(components, ',');
        };
        /**
         * Handler to be called when a component is added to an entity.
         * @private
         * @param {Entity} entity
         * @param {String} componentName
         */
        World.prototype.onComponentAdded = function (entity, componentName) {
            for (var familyId in this.families) {
                if (this.families.hasOwnProperty(familyId)) {
                    this.families[familyId].onComponentAdded(entity, componentName);
                }
            }
        };
        /**
         * Handler to be called when component is removed from an entity.
         * @private
         * @param {Entity} entity
         * @param {String} componentName
         * @param {Component} component
         */
        World.prototype.onComponentRemoved = function (entity, componentName, component) {
            for (var familyId in this.families) {
                if (this.families.hasOwnProperty(familyId)) {
                    this.families[familyId].onComponentRemoved(entity, componentName, component);
                }
            }
        };
        return World;
    })();
    CES.World = World;
})(CES || (CES = {}));
