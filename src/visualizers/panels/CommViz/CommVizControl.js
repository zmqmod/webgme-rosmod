/*globals define, WebGMEGlobal*/
/*jshint browser: true*/
/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Tue Sep 27 2016 23:15:32 GMT-0500 (Central Daylight Time).
 */

 define([
    'js/Constants',
    'js/Utils/GMEConcepts',
    'js/NodePropertyNames'
], function (
    CONSTANTS,
    GMEConcepts,
    nodePropertyNames
) {

    'use strict';

    var CommVizControl;

    CommVizControl = function (options) {

        this._logger = options.logger.fork('Control');

        this._client = options.client;

        // Initialize core collections and variables
        this._widget = options.widget;

        this.currentNodeInfo = {id: null, children: [], parentId: null};

        this._initWidgetEventHandlers();

        this._logger.debug('ctor finished');
    };

    CommVizControl.prototype._initWidgetEventHandlers = function () {
        this._widget.onNodeClick = function (id) {
            // Change the current active object
            WebGMEGlobal.State.registerActiveObject(id);
        };
    };

    /* * * * * * * * Visualizer content update callbacks * * * * * * * */
    // One major concept here is with managing the territory. The territory
    // defines the parts of the project that the visualizer is interested in
    // (this allows the browser to then only load those relevant parts).
    CommVizControl.prototype.selectedObjectChanged = function (nodeId) {
        var self = this,
	desc,
	nodeName;

        self._logger.debug('activeObject nodeId \'' + nodeId + '\'');

        if (nodeId && nodeId != this.currentNodeInfo.id) {
            // Remove current territory patterns
            if (self._territoryId) {
		self._client.removeUI(self._territoryId);
            }
	    if (this.currentNodeInfo.id) {
		this._widget._initialize();
	    }

            // Put new node's info into territory rules
            self._selfPatterns = {};

            this.currentNodeInfo.id = nodeId;
            this.currentNodeInfo.parentId = undefined;

            desc = this._getObjectDescriptor(nodeId);
	    if (!desc) {
		self._client.updateTerritory(self._territoryId, self._selfPatterns);
		return;
	    }
            nodeName = (desc && desc.name);
            if (desc) {
                this.currentNodeInfo.parentId = desc.parentId;
            }

            this._refreshBtnModelHierarchyUp();

            self._selfPatterns[nodeId] = {children: 4};  // Territory "rule"
            self._territoryId = self._client.addUI(self, function (events) {
                self._eventCallback(events);
            });

            // Update the territory
            self._client.updateTerritory(self._territoryId, self._selfPatterns);
        }
    };

    CommVizControl.prototype._refreshBtnModelHierarchyUp = function () {
        if (this.currentNodeInfo.id) {
            this.$btnModelHierarchyUp.show();
        } else {
            this.$btnModelHierarchyUp.hide();
        }
    };

    var validObjects = [
	'Deployment',
	'Container',
	'Node',
	'Component',
	'Publisher',
	'Subscriber',
	'Client',
	'Server',
	'Message',
	'Service'
    ];

    var connectionTypes = [
	'Publisher',
	'Subscriber',
	'Client',
	'Server'
    ];

    var srcConnTypes = [
	'Publisher',
	'Client'
    ];
    var dstConnTypes = [
	'Subscriber',
	'Server'
    ];

    var connectionToPtrMap = {
	'Publisher': 'Message',
	'Subscriber': 'Message',
	'Client': 'Service',
	'Server': 'Service'
    };

    CommVizControl.prototype._nodeToEdge = function (desc) {
	if (srcConnTypes.indexOf(desc.type) > -1) {
	    desc.from = desc.parentId;
	    desc.to = desc.connection;
	}
	else {
	    desc.from = desc.connection;
	    desc.to = desc.parentId;
	}
    };

    // This next function retrieves the relevant node information for the widget
    CommVizControl.prototype._getObjectDescriptor = function (nodeId) {
        var node = this._client.getNode(nodeId),
            objDescriptor = null;
        if (node) {
	    var metaObj = this._client.getNode(node.getMetaTypeId()),
		metaName = undefined;
	    if (metaObj) {
		metaName = metaObj.getAttribute(nodePropertyNames.Attributes.name);
	    }
	    if (validObjects.indexOf(metaName) == -1)
		return null;
            objDescriptor = {
                id: node.getId(),
		type: metaName,
                name: node.getAttribute(nodePropertyNames.Attributes.name),
                childrenIds: node.getChildrenIds(),
                parentId: node.getParentId(),
                isConnection: GMEConcepts.isConnection(nodeId)
            };
	    if (connectionTypes.indexOf(objDescriptor.type) > -1) {
		objDescriptor.pointerName = connectionToPtrMap[objDescriptor.type];
		objDescriptor.connection = node.getPointer(objDescriptor.pointerName).to;
		this._nodeToEdge(objDescriptor);
		this._selfPatterns[objDescriptor.connection] = {children: 0};
		this._client.updateTerritory(this._territoryId, this._selfPatterns)
	    }
	    if (objDescriptor.type == 'Container' ||
		objDescriptor.type == 'Deployment' ||
		objDescriptor.type == 'Message' ||
		objDescriptor.type == 'Service') {
		objDescriptor.parentId = null;
	    }
        }

        return objDescriptor;
    };

    /* * * * * * * * Node Event Handling * * * * * * * */
    CommVizControl.prototype._eventCallback = function (events) {
        var i = events ? events.length : 0,
            event;

        this._logger.debug('_eventCallback \'' + i + '\' items');

        while (i--) {
            event = events[i];
            switch (event.etype) {

            case CONSTANTS.TERRITORY_EVENT_LOAD:
                this._onLoad(event.eid);
                break;
            case CONSTANTS.TERRITORY_EVENT_UPDATE:
                this._onUpdate(event.eid);
                break;
            case CONSTANTS.TERRITORY_EVENT_UNLOAD:
                this._onUnload(event.eid);
                break;
            default:
                break;
            }
        }

        this._logger.debug('_eventCallback \'' + events.length + '\' items - DONE');
    };

    CommVizControl.prototype._onLoad = function (gmeId) {
        var description = this._getObjectDescriptor(gmeId);
	if (description)
            this._widget.addNode(description);
    };

    CommVizControl.prototype._onUpdate = function (gmeId) {
        var description = this._getObjectDescriptor(gmeId);
	if (description)
            this._widget.updateNode(description);
    };

    CommVizControl.prototype._onUnload = function (gmeId) {
        this._widget.removeNode(gmeId);
    };

    CommVizControl.prototype._stateActiveObjectChanged = function (model, activeObjectId) {
        if (this._currentNodeId === activeObjectId) {
            // The same node selected as before - do not trigger
        } else {
            this.selectedObjectChanged(activeObjectId);
        }
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    CommVizControl.prototype.destroy = function () {
        this._detachClientEventListeners();
        this._removeToolbarItems();
    };

    CommVizControl.prototype._attachClientEventListeners = function () {
        this._detachClientEventListeners();
        WebGMEGlobal.State.on('change:' + CONSTANTS.STATE_ACTIVE_OBJECT, this._stateActiveObjectChanged, this);
    };

    CommVizControl.prototype._detachClientEventListeners = function () {
        WebGMEGlobal.State.off('change:' + CONSTANTS.STATE_ACTIVE_OBJECT, this._stateActiveObjectChanged);
    };

    CommVizControl.prototype.onActivate = function () {
        this._attachClientEventListeners();
        this._displayToolbarItems();

        if (typeof this._currentNodeId === 'string') {
            WebGMEGlobal.State.registerSuppressVisualizerFromNode(true);
            WebGMEGlobal.State.registerActiveObject(this._currentNodeId);
            WebGMEGlobal.State.registerSuppressVisualizerFromNode(false);
        }
    };

    CommVizControl.prototype.onDeactivate = function () {
        this._detachClientEventListeners();
        this._hideToolbarItems();
    };

    /* * * * * * * * * * Updating the toolbar * * * * * * * * * */
    CommVizControl.prototype._displayToolbarItems = function () {

        if (this._toolbarInitialized === true) {
            for (var i = this._toolbarItems.length; i--;) {
                this._toolbarItems[i].show();
            }
        } else {
            this._initializeToolbar();
        }
    };

    CommVizControl.prototype._hideToolbarItems = function () {

        if (this._toolbarInitialized === true) {
            for (var i = this._toolbarItems.length; i--;) {
                this._toolbarItems[i].hide();
            }
        }
    };

    CommVizControl.prototype._removeToolbarItems = function () {

        if (this._toolbarInitialized === true) {
            for (var i = this._toolbarItems.length; i--;) {
                this._toolbarItems[i].destroy();
            }
        }
    };

    CommVizControl.prototype._initializeToolbar = function () {
        var self = this,
            toolBar = WebGMEGlobal.Toolbar;

        this._toolbarItems = [];

        this._toolbarItems.push(toolBar.addSeparator());

        /************** Go to hierarchical parent button ****************/
        this.$btnModelHierarchyUp = toolBar.addButton({
            title: 'Go to parent',
            icon: 'glyphicon glyphicon-circle-arrow-up',
            clickFn: function (/*data*/) {
                WebGMEGlobal.State.registerActiveObject(self._currentNodeParentId);
            }
        });
        this._toolbarItems.push(this.$btnModelHierarchyUp);
        this.$btnModelHierarchyUp.hide();

        /************** Checkbox example *******************/

        this.$cbShowConnection = toolBar.addCheckBox({
            title: 'toggle checkbox',
            icon: 'gme icon-gme_diagonal-arrow',
            checkChangedFn: function (data, checked) {
                self._logger.debug('Checkbox has been clicked!');
            }
        });
        this._toolbarItems.push(this.$cbShowConnection);

        this._toolbarInitialized = true;
    };

    return CommVizControl;
});