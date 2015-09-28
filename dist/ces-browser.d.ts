declare module CES {
    /**
     * The components is the container of some properties that
     * the entity possesses. It may also contain some methods.
     * @class
     */
    class Component {
        /**
         * Name of this component. It is expected to be overriden and
         * should be unique.
         * @public
         * @readonly
         * @property {String} name
         */
        name: string;
    }
}
declare module CES {
    /**
     * The entity is the container of components.
     * @class
     */
    class Entity {
        private static _id;
        id: number;
        private components;
        onComponentAdded: CES.Signal;
        onComponentRemoved: CES.Signal;
        constructor();
        /**
         * Check if this entity has a component by name.
         * @public
         * @param {String} componentName
         * @return {Boolean}
         */
        hasComponent(componentName: string): boolean;
        /**
         * Get a component of this entity by name.
         * @public
         * @param {String} componentName
         * @return {Component}
         */
        getComponent(componentName: string): Component;
        /**
         * Add a component to this entity.
         * @public
         * @param {Component} component
         */
        addComponent(component: CES.Component): void;
        /**
         * Remove a component from this entity by name.
         * @public
         * @param {String} componentName
         */
        removeComponent(componentName: string): void;
    }
}
declare module CES {
    /**
     * The entity list is a doubly-linked-list which allows the
     * entities to be added and removed efficiently.
     * @class
     */
    class EntityList {
        head: CES.EntityNode;
        tail: CES.EntityNode;
        length: number;
        private entities;
        constructor();
        /**
         * Add an entity into this list.
         * @public
         * @param {Entity} entity
         */
        add(entity: CES.Entity): void;
        /**
         * Remove an entity from this list.
         * @public
         * @param {Entity} entity
         */
        remove(entity: CES.Entity): void;
        /**
         * Check if this list has the entity.
         * @public
         * @param {Entity} entity
         * @return {Boolean}
         */
        has(entity: CES.Entity): boolean;
        /**
         * Remove all the entities from this list.
         * @public
         */
        clear(): void;
        /**
         * Return an array holding all the entities in this list.
         * @public
         * @return {Array}
         */
        toArray(): CES.Entity[];
    }
}
declare module CES {
    /**
     * The entity node is a wrapper around an entity, to be added into
     * the entity list.
     * @class
     */
    class EntityNode {
        entity: CES.Entity;
        next: CES.EntityNode;
        prev: CES.EntityNode;
        constructor(entity: CES.Entity);
    }
}
declare module CES {
    /**
     * The family is a collection of entities having all the specified components.
     * @class
     */
    class Family {
        private componentNames;
        private entities;
        entityAdded: CES.Signal;
        entityRemoved: CES.Signal;
        /**
         * @constructor
         * @param {Array} componentNames
         */
        constructor(componentNames: string[]);
        /**
         * Get the entities of this family.
         * @public
         * @return {Array}
         */
        getEntities(): CES.Entity[];
        /**
         * Add the entity into the family if match.
         * @public
         * @param {Entity} entity
         */
        addEntityIfMatch(entity: CES.Entity): void;
        /**
         * Remove the entity into the family if match.
         * @public
         * @function
         * @param {Entity} entity
         */
        removeEntity(entity: CES.Entity): void;
        /**
         * Handler to be called when a component is added to an entity.
         * @public
         * @param {Entity} entity
         * @param {String} componentName
         */
        onComponentAdded(entity: CES.Entity, componentName: string): void;
        /**
         * Handler to be called when a component is removed from an entity.
         * @public
         * @param {Entity} entity
         * @param {String} componentName
         * @param {Component} removedComponent
         */
        onComponentRemoved(entity: CES.Entity, componentName: string, removedComponent: CES.Component): void;
        /**
         * Check if an entity belongs to this family.
         * @private
         * @param {Entity} entity
         * @return {Boolean}
         */
        private matchEntity(entity);
    }
}
declare module CES {
    interface Listener {
        (...messages: any[]): void;
    }
}
declare module CES {
    /**
     * The signal can register listeners and invoke the listeners with messages.
     * @class
     */
    class Signal {
        private listeners;
        constructor();
        /**
         * Add a listener to this signal.
         * @public
         * @param {Function} listener
         */
        add(listener: CES.Listener): void;
        /**
         * Remove a listener from this signal.
         * @public
         * @param {Function} listener
         */
        remove(listener: CES.Listener): boolean;
        /**
         * Emit a message.
         * @public
         * @param {...*} messages
         */
        emit(...messages: any[]): void;
    }
}
declare module CES {
    /**
     * The system is responsible for updating the entities.
     * @class
     */
    class System {
        world: CES.World;
        constructor();
        addedToWorld(world: CES.World): void;
        removedFromWorld(): void;
        /**
         * Update the entities.
         * @public
         * @param {Number} dt time interval between updates
         */
        update(dt: number): void;
    }
}
declare module CES {
    /**
     * The world is the container of all the entities and systems.
     * @class
     */
    class World {
        private families;
        private systems;
        private entities;
        constructor();
        /**
         * Add a system to this world.
         * @public
         * @param {System} system
         */
        addSystem(system: CES.System): CES.World;
        /**
         * Remove a system from this world.
         * @public
         * @param {System} system
         */
        removeSystem(system: CES.System): void;
        /**
         * Add an entity to this world.
         * @public
         * @param {Entity} entity
         */
        addEntity(entity: CES.Entity): void;
        /**
         * Remove and entity from this world.
         * @public
         * @param {Entity} entity
         */
        removeEntity(entity: CES.Entity): void;
        /**
         * Get the entities having all the specified componets.
         * @public
         * @param {...String} componentNames
         * @return {Array} an array of entities.
         */
        getEntities(...componentNames: string[]): Entity[];
        /**
         * For each system in the world, call its `update` method.
         * @public
         * @param {Number} dt time interval between updates.
         */
        update(dt: number): void;
        /**
         * Returns the signal for entities added with the specified components. The
         * signal is also emitted when a component is added to an entity causing it
         * match the specified component names.
         * @public
         * @param {...String} componentNames
         * @return {Signal} A signal which is emitted every time an entity with
         *     specified components is added.
         */
        entityAdded(...componentNames: string[]): CES.Signal;
        /**
         * Returns the signal for entities removed with the specified components.
         * The signal is also emitted when a component is removed from an entity
         * causing it to no longer match the specified component names.
         * @public
         * @param {...String} componentNames
         * @return {Signal} A signal which is emitted every time an entity with
         *     specified components is removed.
         */
        entityRemoved(...componentNames: string[]): CES.Signal;
        /**
         * Creates a family for the passed array of component names if it does not
         * exist already.
         * @param {Array.<String>} components
         */
        private ensureFamilyExists(components);
        /**
         * Returns the family ID for the passed array of component names. A family
         * ID is a comma separated string of all component names with a '$'
         * prepended.
         * @param {Array.<String>} components
         * @return {String} The family ID for the passed array of components.
         */
        private static getFamilyId(components);
        /**
         * Handler to be called when a component is added to an entity.
         * @private
         * @param {Entity} entity
         * @param {String} componentName
         */
        private onComponentAdded(entity, componentName);
        /**
         * Handler to be called when component is removed from an entity.
         * @private
         * @param {Entity} entity
         * @param {String} componentName
         * @param {Component} component
         */
        private onComponentRemoved(entity, componentName, component);
    }
}
