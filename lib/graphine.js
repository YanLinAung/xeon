/* * * * * * * * * * * * * * * * * * * * * *
 * @example
 * var g = new Graph();
 * g.addNode('A');
 * g.addEdge('A', 'B');
 * g.addEdge('A', 'C');
 * g.addEdge('B', 'C');
 * g.addEdge('B', 'D');
 *
 * resolve(g.getNode('A')); => 
 * will resolve it as [ 'C', 'D', 'B', 'A' ]
 * * * * * * * * * * * * * * * * * * * * * */

/**
 * @private
 * helper for printing object to string
 * @param  {Object} object 
 * @return {String} transformed object
 */
function toCorrectString(val) {
	return ({}).toString.call(val);
}

/**
 * @private
 * helper for checking if value is object
 * @param  {?} value
 * @return {Boolean} `true` if it is object
 */
function isOject(value) {
	return ( (typeof value === 'object') && (toCorrectString(value) === '[object Object]') );
}

/**
 * @private
 * helper for more secure hasOwnProperty
 * @param  {Object}  obj
 * @param  {String}  prop - object key
 * @return {Boolean}
 */
function hasProperty(obj, prop) {
	return ({}).hasOwnProperty.call(obj, prop);
}

/**
 * @constructor
 * Represent single node of graph
 * @param {String} key
 */
function Node(key, params) {
	if (!key || typeof key !== 'string') throw new Error('uncorrect key of node');
	this.params = (isOject(params)) ? params : {};
	this.id = key;
	this.edges = []; // node connections
}

/**
 * @public
 * Add connection to current node
 * @param {Node} node
 */
Node.prototype.addEdge = function (node) {
	if (!node || !(node instanceof Node)) throw new Error('uncorrect node');
	if (this.edges.indexOf(node) > -1) return;
	this.edges.push(node);
};

/**
 * @public
 * Get list of all node neighbors
 * @return {Array} Array of neighbors
 */
Node.prototype.getConnections = function () {
	return this.edges;
};

/**
 * @public
 * Get key of current node
 * @return {String}
 */
Node.prototype.getId = function () {
	return this.id;
};

/**
 * @constructor
 * Represent graph data structure
 */
function Graph() {
	this._graph = {};
}

/**
 * @public
 * Add new node to curr graph
 * @param {String} key - key for new node
 */
Graph.prototype.addNode = function (key) {
	if (hasProperty(this._graph, key)) return;
	this._graph[key] = new Node(key);
};

/**
 * @public
 * get node instance by key
 * @param  {String} key [description]
 * @return {Node} node object
 */
Graph.prototype.getNode = function (key) {
	if (!hasProperty(this._graph, key)) return;
	return this._graph[key];
};

/**
 * @public
 * add edge between two nodes,
 * if nodes not presented, create it
 * @param {String} start - key of start node
 * @param {String} end   - key of end node
 */
Graph.prototype.addEdge = function (start, end) {
	var proto = this.constructor.prototype
		
	proto.addNode.call(this, start);
	proto.addNode.call(this, end);

	this._graph[start].addEdge(this._graph[end]);
};

/**
 * [getConnection description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Graph.prototype.getConnection = function (key) {
	return (hasProperty(this._graph, key))
		? this._graph[key].getConnections()
		: null
	;
};

/**
 * [resolveDependencyOrder description]
 * @param  {[type]} node       [description]
 * @param  {[type]} resolved   [description]
 * @param  {[type]} unresolved [description]
 * @return {[type]}            [description]
 */
function resolve(node) {
	if (!(node instanceof Node) || !node) throw new TypeError('uncorrect value of node');

	return (function walker(node, resolved, unresolved) {
			unresolved.push(node.id);
			var allEdges = node.getConnections();

			allEdges.forEach(function (edge) {
				if (resolved.indexOf(edge.id) < 0) {
					if (unresolved.indexOf(edge.id) > -1) return;
					walker(edge, resolved, unresolved);
				}
			});

			resolved.push(node.id);
			unresolved.slice(unresolved.indexOf(node.id), 1);

			return resolved;
	})(node, [], []);
}

function DFS() {
	//implement
}

function BFS() {
	//implement
}

module.exports = {
	Graph: Graph,
	resolve: resolve,
};