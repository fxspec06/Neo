
// minifier: path aliases

enyo.path.addPaths({layout: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/layout/", onyx: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/onyx/", onyx: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/onyx/source/", notification: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/notification/", selectorbar: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/selectorbar/", spazcore: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/spazcore/", other: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/other/", cufon: "C://Users/Bryan/Dropbox/Jake-Bryan/Neo/enyo/../lib/cufon/", themes: "source/themes/", javascript: "source/javascript/", blackberry: "source/blackberry/"});

// TODO.js

function uiImprovements() {
enyo.log("UI IMPROVEMENTS STATUS: ", neo.ui.done ? "COMPLETE." : "INCOMPLETE...");
}

function themes() {
enyo.log("THEMES STATUS: ", neo.themes.done ? "COMPLETE." : "INCOMPLETE...");
}

function bugs() {
enyo.log("BUGS STATUS: ", neo.bugs.fixed ? "FIXED." : "BROKEN...");
}

var neo = {};

neo.ui = {}, neo.themes = {}, neo.bugs = {};

var priorities = [];

priorities.push("pre 3 white notifications"), neo.ui.done = !1, priorities.push("make view license work"), neo.themes.done = !1, priorities.push("create standard neo kickass looking themes. maybe a few of them"), neo.bugs.fixed = !1, priorities.push("notifications for tweets show as 'mentions'");

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
swipeableComponents: [],
enableSwipe: !0,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
ondrag: "drag",
onup: "dragfinish",
onholdpulse: "holdpulse",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
onflick: "flick"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
initHoldCounter: 3,
holdCounter: 3,
holding: !1,
draggingRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPage: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
flicked: !0,
percentageDraggedThreshold: .2,
importProps: function(e) {
e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.holding) return;
if (this.holdCounter <= 0) {
this.resetHoldCounter(), this.hold(e, t);
return;
}
this.holdCounter--;
},
resetHoldCounter: function() {
this.holdCounter = this.initHoldCounter;
},
hold: function(e, t) {
t.preventDefault();
if (this.shouldDoReorderHold(e, t)) return this.holding = !0, this.reorderHold(t), !1;
},
dragstart: function(e, t) {
return this.swipeDragStart(e, t);
},
drag: function(e, t) {
return t.preventDefault(), this.shouldDoReorderDrag(t) ? (this.reorderDrag(t), !0) : this.shouldDoSwipeDrag() ? (this.swipeDrag(e, t), !0) : this.preventDragPropagation;
},
flick: function(e, t) {
this.shouldDoSwipeFlick() && this.swipeFlick(e, t);
},
dragfinish: function(e, t) {
this.getReorderable() && (this.resetHoldCounter(), this.finishReordering(e, t)), this.swipeDragFinish(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
getPageRowHeights: function(e) {
var t = [], n = document.querySelectorAll("#" + e.id + " div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t.push({
height: s.height,
width: s.width,
index: parseInt(i, 10)
}));
return t;
},
updateRowBounds: function(e) {
var t = this.getRowBoundsUpdateIndex(e, this.p0RowBounds);
if (t > -1) {
this.updateRowBoundsAtIndex(t, this.p0RowBounds, this.$.page0);
return;
}
t = this.getRowBoundsUpdateIndex(e, this.p1RowBounds);
if (t > -1) {
this.updateRowBoundsAtIndex(t, this.p1RowBounds, this.$.page1);
return;
}
},
getRowBoundsUpdateIndex: function(e, t) {
for (var n = 0; n < t.length; n++) if (t[n].index == e) return n;
return -1;
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = document.querySelectorAll("#" + n.id + ' div[data-enyo-index="' + t[e].index + '"]'), i = enyo.dom.getBounds(r[0]);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), this.shouldDoPinnedReorderScroll() && this.reorderScroll(e, t), n;
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
shouldDoReorderHold: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
reorderHold: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = Math.floor(e.rowIndex / this.rowsPerPage), this.currentPage = this.currentPageNumber % 2, this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = this.getNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
var e = this;
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(function() {
e.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), e.clearPositionReorderContainerTimeout();
}, 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function(e) {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e);
var t = this.getRowIndexFromCoordinate(e.pageY);
t !== -1 && t != this.placeholderRowIndex && this.movePlaceholderToIndex(t);
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.hasNode().style, n = parseInt(t.left, 10) + e.ddx, r = parseInt(t.top, 10) + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = this.getNodePosition(this.hasNode()), n = this.getBounds(), r;
e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setTimeout(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.startAutoScrolling();
},
movePlaceholderToIndex: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
var n = e > this.draggingRowIndex ? e + 1 : e, r = Math.floor(n / this.rowsPerPage), i = r % 2;
r >= this.pageCount && (r = this.currentPageNumber, i = this.currentPage), this.currentPage == i ? this.$["page" + this.currentPage].hasNode().insertBefore(this.placeholderNode, this.$.generator.fetchRowNode(n)) : (this.$["page" + i].hasNode().insertBefore(this.placeholderNode, this.$.generator.fetchRowNode(n)), this.updatePageHeight(this.currentPageNumber, this.$["page" + this.currentPage]), this.updatePageHeight(r, this.$["page" + i]), this.updatePagePositions(r, i)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.currentPage = i, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (this.draggingRowIndex < 0 || this.pinnedReorderMode) return;
var n = this;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), setTimeout(function() {
n.completeFinishReordering(t);
}, 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
if (this.draggingRowIndex == this.placeholderRowIndex && !this.pinnedReorderMode) {
if (!this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.dropReorderedRow(e);
}
this.removePlaceholderNode(), this.dropReorderedRow(e), this.reorderRows(e), this.resetReorderState(), this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
dropReorderedRow: function(e) {
this.emptyAndHideReorderContainer(), this.positionReorderedNode();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.shouldMoveItemtoDiffPage() && this.moveItemToDiffPage(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
shouldMoveItemtoDiffPage: function() {
return this.currentPageNumber != this.initialPageNumber;
},
moveItemToDiffPage: function() {
var e, t, n = this.currentPage == 1 ? 0 : 1;
this.initialPageNumber < this.currentPageNumber ? (e = this.$["page" + this.currentPage].hasNode().firstChild, this.$["page" + n].hasNode().appendChild(e)) : (e = this.$["page" + this.currentPage].hasNode().lastChild, t = this.$["page" + n].hasNode().firstChild, this.$["page" + n].hasNode().insertBefore(e, t)), this.updatePagePositions(this.initialPageNumber, n);
},
positionReorderedNode: function() {
var e = this.placeholderRowIndex > this.draggingRowIndex ? this.placeholderRowIndex + 1 : this.placeholderRowIndex, t = this.$.generator.fetchRowNode(e);
this.$["page" + this.currentPage].hasNode().insertBefore(this.hiddenNode, t), this.showNode(this.hiddenNode);
},
resetReorderState: function() {
this.draggingRowIndex = this.placeholderRowIndex = -1, this.holding = !1, this.pinnedReorderMode = !1;
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) {
enyo.log("No node - " + i);
continue;
}
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = document.querySelectorAll('[data-enyo-index="reordered"]')[0], r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) {
enyo.log("No node - " + i);
continue;
}
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
var n = this.getRelativeOffset(t, this.hasNode()), r = this.getDimensions(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
getDimensions: function(e) {
var t = window.getComputedStyle(e, null);
return {
height: parseInt(t.getPropertyValue("height"), 10),
width: parseInt(t.getPropertyValue("width"), 10)
};
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t), this.$["page" + this.currentPage].hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = this.getDimensions(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeHiddenNode: function() {
this.removeNode(this.hiddenNode), this.hiddenNode = null;
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e, t) {
var n = t.getBounds().height;
this.pageHeights[e] = n;
},
updatePagePositions: function(e, t) {
this.positionPage(this.currentPageNumber, this.$["page" + this.currentPage]), this.positionPage(e, this.$["page" + t]);
},
correctPageHeights: function() {
var e = this.initialPageNumber % 2;
this.updatePageHeight(this.currentPageNumber, this.$["page" + this.currentPage]), e != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber, this.$["page" + e]);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
var t = this;
this.moveReorderedContainerToDroppedPosition(e), setTimeout(function() {
t.completeFinishReordering(e);
}, 100);
return;
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - this.getNodePosition(this.hasNode()).top, n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return -1;
var i = n.pos, s = parseInt(window.getComputedStyle(this.placeholderNode).height, 10);
for (var o = 0, u = 0; o < r.length; o++) {
u += r[o].height > 0 ? r[o].height : s;
if (u >= i) return r[o].index;
}
return -1;
},
getIndexPosition: function(e) {
return this.getNodePosition(this.$.generator.fetchRowNode(e));
},
getNodePosition: function(e) {
var t = e, n = 0, r = 0;
while (e && e.offsetParent) n += e.offsetTop, r += e.offsetLeft, e = e.offsetParent;
e = t;
var i = enyo.dom.getCssTransformProp();
while (e && e.getAttribute) {
var s = enyo.dom.getComputedStyleValue(e, i);
if (s && s != "none") {
var o = s.lastIndexOf(","), u = s.lastIndexOf(",", o - 1);
o >= 0 && u >= 0 && (n += parseFloat(s.substr(o + 1, s.length - o)), r += parseFloat(s.substr(u + 1, o - u)));
}
e = e.parentNode;
}
return {
top: n,
left: r
};
},
cloneRowNode: function(e) {
return this.$.generator.fetchRowNode(e).cloneNode(!0);
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
shouldDoPinnedReorderScroll: function() {
return !this.getReorderable() || !this.pinnedReorderMode ? !1 : !0;
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;");
var n = this.getRowIndexFromCoordinate(this.initialPinPosition);
n != this.placeholderRowIndex && this.movePlaceholderToIndex(n);
},
hideReorderingRow: function() {
var e = document.querySelectorAll('[data-enyo-index="' + this.draggingRowIndex + '"]')[0];
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
swipeDragStart: function(e, t) {
return !this.hasSwipeableComponents() || t.vertical || this.draggingRowIndex > -1 ? !1 : (this.setSwipeDirection(t.xDirection), this.completeSwipeTimeout && this.completeSwipe(t), this.setFlicked(!1), this.setSwipeComplete(!1), this.swipeIndexChanged(t.index) && (this.clearSwipeables(), this.setSwipeIndex(t.index)), this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
shouldDoSwipeDrag: function() {
return this.getEnableSwipe() && !this.isReordering();
},
swipeDrag: function(e, t) {
return this.draggedOutOfBounds(t) ? (this.swipeDragFinish(t), this.preventDragPropagation) : this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, this.preventDragPropagation);
},
shouldDoSwipeFlick: function() {
return !this.isReordering();
},
swipeFlick: function(e, t) {
return this.getEnableSwipe() ? Math.abs(t.xVelocity) < Math.abs(t.yVelocity) ? !1 : (this.setFlicked(!0), this.persistentItemVisible ? (this.flickPersistentItem(t), !0) : (this.swipe(this.normalSwipeSpeedMS), !0)) : !1;
},
swipeDragFinish: function(e, t) {
return this.getEnableSwipe() ? this.wasFlicked() ? this.preventDragPropagation : (this.persistentItemVisible ? this.dragFinishPersistentItem(t) : this.calcPercentageDragged(this.draggedXDistance) > this.percentageDraggedThreshold ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t), this.preventDragPropagation) : this.preventDragPropagation;
},
hasSwipeableComponents: function() {
return this.$.swipeableComponents.controls.length !== 0;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = this.getDimensions(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
setSwipeDirection: function(e) {
this.swipeDirection = e;
},
setFlicked: function(e) {
this.flicked = e;
},
wasFlicked: function() {
return this.flicked;
},
setSwipeComplete: function(e) {
this.swipeComplete = e;
},
swipeIndexChanged: function(e) {
return this.swipeIndex === null ? !0 : e === undefined ? !1 : e !== this.swipeIndex;
},
setSwipeIndex: function(e) {
this.swipeIndex = e === undefined ? this.swipeIndex : e;
},
calcNewDragPosition: function(e) {
var t = window.getComputedStyle(this.$.swipeableComponents.hasNode());
if (!t) return !1;
var n = parseInt(t.left, 10), r = this.getDimensions(this.$.swipeableComponents.node), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
draggedOutOfBounds: function(e) {
var t = this.getNodePosition(this.hasNode()), n = this.getBounds(), r = e.pageY - t.top < 0, i = e.pageY - t.top > n.height, s = e.pageX - t.left < 0, o = e.pageX - t.left > n.width;
return r || i || s || o;
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
flickPersistentItem: function(e) {
e.xVelocity > 0 ? this.persistentItemOrigin == "left" ? this.bounceItem(e) : this.slideAwayItem() : e.xVelocity < 0 && (this.persistentItemOrigin == "right" ? this.bounceItem(e) : this.slideAwayItem());
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / parseInt(window.getComputedStyle(this.$.swipeableComponents.hasNode()).width, 10));
},
swipe: function(e) {
this.setSwipeComplete(!0), this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.getDimensions(this.$.swipeableComponents.node), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.setSwipeDirection(null), this.setFlicked(!0);
},
bounceItem: function(e) {
var t = window.getComputedStyle(this.$.swipeableComponents.node);
parseInt(t.left, 10) != parseInt(t.width, 10) && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = parseInt(window.getComputedStyle(e.node).width, 10), n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.setSwipeDirection(null);
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// Badged.js

enyo.kind({
name: "notification.Badged",
kind: "enyo.Control",
published: {
defaultDuration: 2e3
},
events: {
onTap: "",
onClose: ""
},
pending: [],
fifo: !1,
components: [ {
kind: "enyo.Control",
ontap: "notifTap",
name: "bubble",
classes: "notification-badged-bubble",
showing: !1,
components: [ {
kind: "enyo.Control",
name: "icon",
classes: "notification-badged-icon"
}, {
kind: "enyo.Control",
name: "title",
classes: "notification-badged-title"
}, {
kind: "enyo.Control",
name: "message",
classes: "notification-badged-message"
}, {
kind: "enyo.Control",
name: "badge",
classes: "notification-badged-badge",
showing: !1
} ]
} ],
create: function() {
this.inherited(arguments), this.render();
},
newNotification: function(e, t) {
this.pending.push({
uid: t,
notification: e
}), this.pending.length == 1 && this.$.bubble.show(), this.displayNotification();
},
displayNotification: function() {
if (this.pending.length == 0) return;
var e = this.upNotif().notification;
this.fifo || enyo.job.stop("hideNotification-Badged"), this.$.badge.setContent(this.pending.length), this.$.badge.setShowing(this.pending.length > 1), this.$.title.setContent(e.title), this.$.message.setContent(e.message), this.$.icon.applyStyle("background-image", "url('" + e.icon + "')"), e.stay || enyo.job("hideNotification-Badged", enyo.bind(this, "hideNotification"), e.duration ? e.duration * 1e3 : this.defaultDuration);
},
hideNotification: function(e) {
enyo.job.stop("hideNotification-Badged"), e || this.doClose({
notification: this.upNotif().notification,
uid: this.upNotif().uid
}), enyo.remove(this.upNotif(), this.pending), this.pending.length > 0 ? this.displayNotification() : this.$.bubble.hide();
},
notifTap: function() {
this.doTap({
notification: this.upNotif().notification,
uid: this.upNotif().uid
}), this.hideNotification();
},
upNotif: function() {
return this.fifo ? this.pending[0] : this.pending[this.pending.length - 1];
}
});

// Bezel.js

enyo.kind({
name: "notification.Bezel",
kind: "enyo.Control",
published: {
defaultDuration: 2e3
},
events: {
onTap: "",
onClose: ""
},
pending: [],
isShow: !0,
components: [ {
kind: "enyo.Control",
classes: "notification-bezel-main",
name: "bubble",
showing: !1,
components: [ {
kind: "enyo.Control",
name: "icon",
classes: "notification-bezel-icon"
}, {
kind: "enyo.Control",
name: "title",
classes: "notification-bezel-title",
allowHtml: !0
}, {
kind: "enyo.Control",
name: "message",
classes: "notification-bezel-message",
allowHtml: !0
} ],
ontap: "notifTap"
}, {
kind: "enyo.Animator",
duration: 1e3,
endValue: 1,
onStep: "fadeAnimation",
onEnd: "animationEnd",
name: "animator"
} ],
create: function() {
this.inherited(arguments), this.render(), this.$.bubble.applyStyle("opacity", 0);
},
newNotification: function(e, t) {
this.pending.push({
uid: t,
notification: e
}), this.pending.length == 1 && (this.$.bubble.show(), this.displayNotification());
},
displayNotification: function() {
if (this.pending.length == 0) {
this.$.bubble.hide();
return;
}
var e = this.pending[0].notification;
this.$.title.setContent(e.title), this.$.message.setContent(e.message), this.$.icon.applyStyle("background-image", "url('" + e.icon + "')"), this.$.animator.stop(), this.isShow = !0, this.$.animator.play();
},
hideNotification: function(e) {
enyo.job.stop("hideNotification-Bezel"), e || this.doClose({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.$.animator.stop(), this.isShow = !1, this.$.animator.play();
},
notifTap: function() {
this.doTap({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.hideNotification();
},
fadeAnimation: function(e) {
var t;
this.isShow ? t = e.value : t = 1 - e.value, this.$.bubble.applyStyle("opacity", t.toFixed(8));
},
animationEnd: function() {
this.isShow ? this.pending[0].notification.stay || enyo.job("hideNotification-Bezel", enyo.bind(this, "hideNotification"), this.pending[0].notification.duration ? this.pending[0].notification.duration * 1e3 : this.defaultDuration) : (this.pending.shift(), enyo.asyncMethod(this, "displayNotification"));
}
});

// MessageBar.js

enyo.kind({
name: "notification.MessageBar",
kind: "enyo.Control",
published: {
defaultDuration: 2e3
},
events: {
onTap: "",
onClose: ""
},
pending: [],
hasDisplayedNotif: !1,
inShow: null,
inHide: null,
components: [ {
kind: "enyo.Animator",
duration: 500,
endValue: 1,
onStep: "msgStep",
onEnd: "animationEnd",
name: "showNotif"
}, {
kind: "enyo.Animator",
duration: 700,
startValue: 1,
endValue: 0,
onStep: "msgStep",
onEnd: "animationEnd",
name: "hideNotif"
}, {
kind: "enyo.Animator",
duration: 500,
endValue: 30,
onStep: "barStep",
onEnd: "animationEnd",
name: "barAnimator"
}, {
kind: "enyo.Control",
name: "bar",
classes: "notification-messagebar-bar"
} ],
create: function() {
this.inherited(arguments), this.render();
},
newNotification: function(e, t) {
this.pending.push({
uid: t,
notification: e,
node: null
}), this.pending.length == 1 && this.$.barAnimator.play();
},
displayNotification: function() {
if (this.pending.length == 0) return;
var e = this.inShow.notification;
this.inShow.node = this.$.bar.createComponent({
kind: "enyo.Control",
classes: "notification-messagebar-notification",
components: [ {
kind: "enyo.Control",
classes: "notification-messagebar-icon",
style: "background-image: url('" + e.icon + "')"
}, {
kind: "enyo.Control",
classes: "notification-messagebar-title",
content: e.title
}, {
kind: "enyo.Control",
classes: "notification-messagebar-message",
content: e.message
} ],
ontap: "notifTap"
}, {
owner: this
}), this.inShow.node.applyStyle("top", "30px"), this.inShow.node.applyStyle("opacity", "0"), this.inShow.node.render(), this.hasDisplayedNotif = !0, this.$.showNotif.play();
},
hideNotification: function(e) {
enyo.job.stop("hideNotification-MessageBar"), e || this.doClose({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.pending.length > 1 ? (this.inShow = this.pending[1], this.displayNotification()) : this.hasDisplayedNotif = !1, this.inHide = this.pending[0], this.$.hideNotif.play();
},
notifTap: function() {
this.doTap({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.hideNotification();
},
msgStep: function(e) {
var t, n;
e.name == "showNotif" ? n = this.inShow.node : n = this.inHide.node, t = e.value, n.applyStyle("opacity", t.toFixed(8)), n.applyStyle("top", (30 - t * 30).toFixed(8) + "px");
},
barStep: function(e) {
var t, n;
this.pending.length == 0 ? t = -e.value : t = -30 + e.value, this.$.bar.applyStyle("bottom", t.toFixed(8) + "px");
},
animationEnd: function(e) {
e.name == "hideNotif" ? (this.inHide.node.destroy(), this.pending.shift(), this.inHide = null, this.pending.length == 0 ? this.$.barAnimator.play() : this.hasDisplayedNotif || (this.inShow = this.pending[0], this.displayNotification())) : e.name == "barAnimator" && this.pending.length ? (this.inShow = this.pending[0], this.displayNotification()) : e.name == "showNotif" && (this.inShow.notification.stay || enyo.job("hideNotification-MessageBar", enyo.bind(this, "hideNotification"), this.inShow.notification.duration ? this.inShow.notification.duration * 1e3 : this.defaultDuration));
}
});

// Pop.js

enyo.kind({
name: "notification.Pop",
kind: "enyo.Control",
published: {
defaultDuration: 2e3
},
events: {
onTap: "",
onClose: ""
},
pending: [],
components: [ {
kind: "enyo.Control",
ontap: "notifTap",
showing: !1,
name: "bubble",
classes: "notification-pop-bubble",
components: [ {
kind: "enyo.Control",
name: "master",
components: [ {
kind: "enyo.Control",
name: "title",
classes: "notification-pop-title"
}, {
kind: "enyo.Control",
name: "message",
classes: "notification-pop-message"
}, {
kind: "enyo.Control",
name: "icon",
classes: "notification-pop-icon"
} ]
} ]
}, {
kind: "enyo.Animator",
easingFunction: enyo.easing.cubicIn,
name: "popUp1",
startValue: 0,
endValue: 1.1,
duration: 900,
onStep: "zoomEffect",
onEnd: "endEffect"
}, {
kind: "enyo.Animator",
name: "popUp2",
startValue: 1.1,
endValue: 1,
duration: 300,
onStep: "zoomEffect",
onEnd: "endEffect"
}, {
kind: "enyo.Animator",
easingFunction: enyo.easing.cubicIn,
name: "zoom",
startValue: 0,
endValue: 1,
duration: 750,
onStep: "zoomOutEffect",
onEnd: "endEffect"
} ],
create: function() {
this.inherited(arguments), this.render(), this.$.bubble.applyStyle("opacity", 0);
},
newNotification: function(e, t) {
this.pending.push({
uid: t,
notification: e
}), this.pending.length == 1 && (this.$.bubble.show(), this.displayNotification());
},
displayNotification: function() {
if (this.pending.length == 0) return;
var e = this.pending[0].notification;
this.$.title.setContent(e.title), this.$.message.setContent(e.message), this.$.icon.applyStyle("background-image", "url('" + e.icon + "')"), this.$.popUp1.play();
},
hideNotification: function(e) {
enyo.job.stop("hideNotification-Pop"), e || this.doClose({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.$.zoom.play();
},
zoomEffect: function(e) {
var t = e.value.toFixed(8);
this.$.bubble.applyStyle("opacity", t), enyo.Layout.transform ? enyo.Layout.transform(this.$.bubble, {
scale: t
}) : enyo.dom.transformValue && enyo.dom.transformValue(this.$.bubble, "scale", t);
},
zoomOutEffect: function(e) {
var t = e.value.toFixed(8);
this.$.bubble.applyStyle("opacity", 1 - t), enyo.Layout.transform ? enyo.Layout.transform(this.$.bubble, {
scale: 1 + t * 5
}) : enyo.dom.transformValue && enyo.dom.transformValue(this.$.bubble, "scale", 1 + t * 5);
var n = 1 - t * 2;
n < 0 && (n = 0), this.$.master.applyStyle("opacity", n.toFixed(8));
},
notifTap: function() {
this.doTap({
notification: this.pending[0].notification,
uid: this.pending[0].uid
}), this.hideNotification();
},
endEffect: function(e) {
if (e.name == "popUp1") this.$.popUp2.play(); else if (e.name == "popUp2") {
var t = this.pending[0].notification;
t.stay || enyo.job("hideNotification-Pop", enyo.bind(this, "hideNotification"), t.duration ? t.duration * 1e3 : this.defaultDuration);
} else this.pending.shift(), this.$.master.applyStyle("opacity", 1), this.pending.length == 0 ? this.$.bubble.hide() : this.displayNotification();
}
});

// Notification.js

enyo.kind({
name: "enyo.Notification",
kind: "enyo.Control",
published: {
defaultTheme: "notification.Bezel"
},
events: {
onNotify: "",
onTap: ""
},
pending: [],
themes: [],
uid: 0,
sendNotification: function(e, t) {
this.pending.push({
uid: this.uid,
notification: e,
callback: typeof t != "function" ? enyo.nop : t
}), this.getTheme(e.theme || this.defaultTheme).newNotification(e, this.uid), this.doNotify(e), this.uid++;
},
getTheme: function(e) {
for (var t = 0, n = this.themes.length; t < n; t++) if (this.themes[t].name == e) return this.themes[t].component;
var r = this.createComponent({
kind: e,
onTap: "notifTap",
onClose: "notifClose"
}, {
owner: this
});
return this.themes.push({
name: e,
component: r
}), this.themes[this.themes.length - 1].component;
},
notifTap: function(e, t) {
for (var n = 0, r = this.pending.length; n < r; n++) if (this.pending[n].uid == t.uid) return this.pending[n].callback(this.pending[n].notification), this.doTap(this.pending[n].notification), enyo.remove(this.pending[n], this.pending), !0;
},
notifClose: function(e, t) {
for (var n = 0, r = this.pending.length; n < r; n++) if (this.pending[n].uid == t.uid) {
enyo.remove(this.pending[n], this.pending);
return;
}
}
});

// SelectorBar.js

enyo.kind({
name: "GTS.SelectorBar",
kind: "onyx.Item",
style: "border:1px solid grey",
classes: "gts-selectorBar",
published: {
label: "Select One",
sublabel: "",
choices: [],
value: "",
disabled: !1
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
classes: "onyx-toolbar-inline",
components: [ {
name: "valueIcon",
kind: "enyo.Image",
style: "margin-right: 1em;"
}, {
name: "valueDisplay",
tag: "i",
fit: !0
}, {
kind: "onyx.PickerDecorator",
components: [ {
name: "labelButton",
kind: "onyx.Button",
classes: "label arrow"
}, {
name: "picker",
kind: "onyx.Picker",
onSelect: "selectionChanged",
components: []
} ]
} ]
}, {
name: "sublabel",
classes: "sub-label"
} ],
rendered: function() {
this.inherited(arguments), this.labelChanged(), this.sublabelChanged(), this.choicesChanged(), this.valueChanged(), this.disabledChanged();
},
reflow: function() {
this.$.base.reflow();
},
labelChanged: function() {
this.$.labelButton.setContent(this.label);
},
sublabelChanged: function() {
this.$.sublabel.setContent(this.sublabel), this.sublabel === "" ? this.$.sublabel.hide() : this.$.sublabel.show();
},
choicesChanged: function() {
this.$.picker.destroyClientControls(), this.$.picker.createComponents(this.choices), this.valueChanged();
},
disabledChanged: function() {
this.$.labelButton.setDisabled(this.disabled);
},
setValue: function(e) {
this.value = e, this.valueChanged();
},
valueChanged: function() {
if (this.choices.length === 0) return;
this.value === null && (this.value = this._getValue(this.choices[0]));
for (var e = 0; e < this.choices.length; e++) if (this.value === this._getValue(this.choices[e])) {
this.$.valueDisplay.setContent(this.choices[e].content), this.choices[e].icon ? (this.$.valueIcon.setSrc(this.choices[e].icon), this.$.valueIcon.show()) : this.$.valueIcon.hide();
break;
}
this.reflow();
},
_getValue: function(e) {
return e.hasOwnProperty("value") ? e.value : e.content;
},
selectionChanged: function(e, t) {
return this.value = t.selected.hasOwnProperty("value") ? t.selected.value : t.content, this.valueChanged(), this.doChange(t), !0;
}
});

// webOSExt.js

enyo.webOS = {}, enyo.requiresWindow(function() {
window.PalmSystem && (PalmSystem.stageReady(), enyo.webOS = {
identifier: function() {
var e = PalmSystem.identifier.split(" ");
return {
appID: e[0],
process: e[1]
};
},
launchParams: function() {
return enyo.json.parse(PalmSystem.launchParams) || {};
},
deviceInfo: function() {
return enyo.json.parse(PalmSystem.deviceInfo);
},
localeInfo: function() {
return {
locale: PalmSystem.locale,
localeRegion: PalmSystem.localeRegion,
phoneRegion: PalmSystem.phoneRegion
};
},
isTwelveHourFormat: function() {
return PalmSystem.timeFormat === "HH12";
},
pasteClipboard: function() {
PalmSystem.paste();
},
getWindowOrientation: function() {
return PalmSystem.screenOrientation;
},
setWindowOrientation: function(e) {
PalmSystem.setWindowOrientation(e);
},
setFullScreen: function(e) {
PalmSystem.enableFullScreenMode(e);
},
indicateNewContent: function(e) {
enyo.webOS._throbId && (PalmSystem.removeNewContentIndicator(enyo.webOS._throbId), enyo.webOS._throbId = undefined), e && (enyo.webOS._throbId = PalmSystem.addNewContentIndicator());
},
isActivated: function(e) {
return e = e || window, e.PalmSystem ? e.PalmSystem.isActivated : !1;
},
activate: function(e) {
e = e || window, e.PalmSystem && e.PalmSystem.activate();
},
deactivate: function(e) {
e = e || window, e.PalmSystem && e.PalmSystem.deactivate();
},
addBannerMessage: function() {
return PalmSystem.addBannerMessage.apply(PalmSystem, arguments);
},
removeBannerMessage: function(e) {
PalmSystem.removeBannerMessage.apply(PalmSystem, arguments);
},
setWindowProperties: function(e, t) {
arguments.length == 1 && (t = e, e = window), e.PalmSystem && e.PalmSystem.setWindowProperties(t);
},
runTextIndexer: function(e, t) {
return e && e.length > 0 && PalmSystem.runTextIndexer ? PalmSystem.runTextIndexer(e, t) : e;
},
keyboard: undefined
}, Mojo = window.Mojo || {}, Mojo.keyboardShown = function(e) {
enyo.webOS.keyboard._isShowing = e, enyo.dispatch({
type: "keyboardShown",
showing: e
});
}, enyo.webOS.keyboard = {
types: {
text: 0,
password: 1,
search: 2,
range: 3,
email: 4,
number: 5,
phone: 6,
url: 7,
color: 8
},
isShowing: function() {
return enyo.webOS.keyboard._isShowing || !1;
},
show: function(e) {
enyo.webOS.keyboard.isManualMode() && PalmSystem.keyboardShow(e || 0);
},
hide: function() {
enyo.webOS.keyboard.isManualMode() && PalmSystem.keyboardHide();
},
setManualMode: function(e) {
enyo.webOS.keyboard._manual = e, PalmSystem.setManualKeyboardEnabled(e);
},
isManualMode: function() {
return enyo.webOS.keyboard._manual || !1;
},
forceShow: function(e) {
enyo.webOS.keyboard.setManualMode(!0), PalmSystem.keyboardShow(e || 0);
},
forceHide: function() {
enyo.webOS.keyboard.setManualMode(!0), PalmSystem.keyboardHide();
}
}), enyo.webos = enyo.webOS;
});

// ServiceRequest.js

enyo.kind({
name: "enyo.webOS.ServiceRequest",
kind: enyo.Async,
resubscribeDelay: 1e4,
published: {
service: "",
method: "",
subscribe: !1,
resubscribe: !1
},
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments), enyo.webOS._serviceCounter == undefined ? enyo.webOS._serviceCounter = 1 : enyo.webOS._serviceCounter++, this.id = enyo.webOS._serviceCounter;
},
go: function(e) {
if (!PalmServiceBridge) return this.fail({
errorCode: -1,
errorText: "Invalid device for Palm services. PalmServiceBridge not found."
}), undefined;
this.params = e || {}, this.bridge = new PalmServiceBridge, this.bridge.onservicecallback = this.clientCallback = enyo.bind(this, "serviceCallback");
var t = this.service;
return this.method.length > 0 && (t.charAt(t.length - 1) != "/" && (t += "/"), t += this.method), this.subscribe && (this.params.subscribe = this.subscribe), this.bridge.call(t, enyo.json.stringify(this.params)), this;
},
cancel: function() {
this.cancelled = !0, this.responders = [], this.errorHandlers = [], this.resubscribeJob && enyo.job.stop(this.resubscribeJob), this.bridge && (this.bridge.cancel(), this.bridge = undefined);
},
serviceCallback: function(e) {
var t, n;
if (this.cancelled) return;
try {
t = enyo.json.parse(e);
} catch (r) {
var n = {
errorCode: -1,
errorText: e
};
this.serviceFailure(n);
return;
}
t.errorCode || t.returnValue === !1 ? this.serviceFailure(t) : this.serviceSuccess(t);
},
serviceSuccess: function(e) {
var t = undefined;
this.responders.length > 0 && (t = this.responders[0]), this.respond(e), this.subscribe && t && this.response(t);
},
serviceFailure: function(e) {
var t = undefined;
this.errorHandlers.length > 0 && (t = this.errorHandlers[0]), this.fail(e), this.resubscribe && this.subscribe && (t && this.error(t), this.resubscribeJob = this.id + "resubscribe", enyo.job(this.resubscribeJob, enyo.bind(this, "goAgain"), this.resubscribeDelay));
},
resubscribeIfNeeded: function() {},
goAgain: function() {
this.go(this.params);
}
});

// humane.js

(function(e, t) {
function c() {
o = t.createElement("div"), o.id = "humane", o.classes = "humane", t.body.appendChild(o), a && (o.filters.item("DXImageTransform.Microsoft.Alpha").Opacity = 0), f = !0;
}
function h() {
r(t.body, "mousemove", h), r(t.body, "click", h), r(t.body, "keypress", h), i = !1, s && d(0);
}
function p() {
if (s && !e.humane.forceNew) return;
if (!l.length) {
h();
return;
}
s = !0, u && (clearTimeout(u), u = null), u = setTimeout(function() {
i || (n(t.body, "mousemove", h), n(t.body, "click", h), n(t.body, "keypress", h), i = !0, e.humane.waitForMove || h());
}, e.humane.timeout), o.innerHTML = l.shift(), d(1);
}
function d(e) {
e === 1 ? o.classes = "humane humane-show" : (o.classes = "humane", v());
}
function v() {
s = !1, setTimeout(p, 500);
}
function g(t, n) {
var r, i;
t === 1 ? (i = 0, e.humane.forceNew && (i = a ? o.filters.item("DXImageTransform.Microsoft.Alpha").Opacity / 100 | 0 : o.style.opacity | 0), o.style.visibility = "visible", r = setInterval(function() {
i < 1 ? (i += .1, i > 1 && (i = 1), m(i)) : clearInterval(r);
}, 25)) : (i = 1, r = setInterval(function() {
i > 0 ? (i -= .1, i < 0 && (i = 0), m(i)) : (clearInterval(r), o.style.visibility = "hidden", v());
}, 25));
}
function y(e) {
l.push(e), f && p();
}
var n, r;
e.addEventListener ? (n = function(e, t, n) {
e.addEventListener(t, n, !1);
}, r = function(e, t, n) {
e.removeEventListener(t, n, !1);
}) : (n = function(e, t, n) {
e.attachEvent("on" + t, n);
}, r = function(e, t, n) {
e.detachEvent("on" + t, n);
});
var i = !1, s = !1, o = null, u = null, a = /msie [678]/i.test(navigator.userAgent), f = !1, l = [];
n(e, "load", function() {
var e = function(e) {
var t = [ "MozT", "WebkitT", "OT", "msT", "KhtmlT", "t" ];
for (var n = 0, r; r = t[n]; n++) if (r + "ransition" in e) return !0;
return !1;
}(t.body.style);
e || (d = g), c(), p();
});
var m = function() {
return a ? function(e) {
o.filters.item("DXImageTransform.Microsoft.Alpha").Opacity = e * 100;
} : function(e) {
o.style.opacity = String(e);
};
}();
e.humane = y, e.humane.timeout = 2e3, e.humane.waitForMove = !0, e.humane.forceNew = !1;
})(window, document);

// cache.js

function Cache(e) {
this.items = {}, this.count = 0, e == null && (e = -1), this.maxSize = e, this.fillFactor = .75, this.purgeSize = Math.round(this.maxSize * this.fillFactor), this.stats = {}, this.stats.hits = 0, this.stats.misses = 0;
}

var CachePriority = {
Low: 1,
Normal: 2,
High: 4
};

Cache.prototype.getItem = function(e, t) {
var n = this.items[e];
n != null && (this._isExpired(n) ? (this._removeItem(e), n = null) : n.lastAccessed = (new Date).getTime());
var r = null;
return n != null ? (r = n.value, this.stats.hits++) : this.stats.misses++, r;
}, Cache.prototype.setItem = function(e, t, n) {
function r(e, t, n) {
if (e == null || e == "") throw new Error("key cannot be null or empty");
this.key = e, this.value = t, n == null && (n = {}), n.expirationAbsolute != null && (n.expirationAbsolute = n.expirationAbsolute.getTime()), n.priority == null && (n.priority = CachePriority.Normal), this.options = n, this.lastAccessed = (new Date).getTime();
}
this.items[e] != null && this._removeItem(e), this._addItem(new r(e, t, n)), this.maxSize > 0 && this.count > this.maxSize && this._purge();
}, Cache.prototype.clear = function() {
for (var e in this.items) this._removeItem(e);
}, Cache.prototype._purge = function() {
var e = new Array;
for (var t in this.items) {
var n = this.items[t];
this._isExpired(n) ? this._removeItem(t) : e.push(n);
}
if (e.length > this.purgeSize) {
e = e.sort(function(e, t) {
return e.options.priority != t.options.priority ? t.options.priority - e.options.priority : t.lastAccessed - e.lastAccessed;
});
while (e.length > this.purgeSize) {
var r = e.pop();
this._removeItem(r.key);
}
}
}, Cache.prototype._addItem = function(e) {
this.items[e.key] = e, this.count++;
}, Cache.prototype._removeItem = function(e) {
var t = this.items[e];
delete this.items[e], this.count--;
if (t.options.callback != null) {
var n = function() {
t.options.callback(t.key, t.value);
};
setTimeout(n, 0);
}
}, Cache.prototype._isExpired = function(e) {
var t = (new Date).getTime(), n = !1;
e.options.expirationAbsolute && e.options.expirationAbsolute < t && (n = !0);
if (!n && e.options.expirationSliding) {
var r = e.lastAccessed + e.options.expirationSliding * 1e3;
r < t && (n = !0);
}
return n;
}, Cache.prototype.toHtmlString = function() {
var e = this.count + " item(s) in cache<br /><ul>";
for (var t in this.items) {
var n = this.items[t];
e = e + "<li>" + n.key.toString() + " = " + n.value.toString() + "</li>";
}
return e += "</ul>", e;
};

// jsOAuth-1.3.4.js

var exports = exports || this;

exports.OAuth = function(e) {
function t(e) {
var t = arguments, n = t.callee, r = t.length, i, s = this;
if (this instanceof n) {
for (i in e) e.hasOwnProperty(i) && (s[i] = e[i]);
return s;
}
return new n(e);
}
function n() {}
function r(e) {
var t = arguments, n = t.callee, r, s, o, u, a, f, l, c = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/, h = this;
if (!(this instanceof n)) return new n(e);
h.scheme = "", h.host = "", h.port = "", h.path = "", h.query = new i, h.anchor = "";
if (e !== null) {
r = e.match(c), s = r[1], o = r[2], u = r[3], a = r[4], f = r[5], l = r[6], s = s !== undefined ? s.replace("://", "").toLowerCase() : "http", u = u ? u.replace(":", "") : s === "https" ? "443" : "80", s = s == "http" && u === "443" ? "https" : s, f = f ? f.replace("?", "") : "", l = l ? l.replace("#", "") : "";
if (s === "https" && u !== "443" || s === "http" && u !== "80") o = o + ":" + u;
h.scheme = s, h.host = o, h.port = u, h.path = a || "/", h.query.setQueryParams(f), h.anchor = l || "";
}
}
function i(e) {
var t = arguments, n = t.callee, r = t.length, i, s = this;
if (this instanceof n) {
if (e != undefined) for (i in e) e.hasOwnProperty(i) && (s[i] = e[i]);
return s;
}
return new n(e);
}
function o(e) {
return this instanceof o ? this.init(e) : new o(e);
}
function u(e) {
var t = [], n, r;
for (n in e) e[n] && e[n] !== undefined && e[n] !== "" && (n === "realm" ? r = n + '="' + e[n] + '"' : t.push(n + '="' + o.urlEncode(e[n] + "") + '"'));
return t.sort(), r && t.unshift(r), t.join(", ");
}
function a(e, t, n, r) {
var i = [], s, u = o.urlEncode;
for (s in n) n[s] !== undefined && n[s] !== "" && i.push([ o.urlEncode(s), o.urlEncode(n[s] + "") ]);
for (s in r) r[s] !== undefined && r[s] !== "" && (n[s] || i.push([ u(s), u(r[s] + "") ]));
return i = i.sort(function(e, t) {
return e[0] < t[0] ? -1 : e[0] > t[0] ? 1 : e[1] < t[1] ? -1 : e[1] > t[1] ? 1 : 0;
}).map(function(e) {
return e.join("=");
}), [ e, u(t), u(i.join("&")) ].join("&");
}
function f() {
return parseInt(+(new Date) / 1e3, 10);
}
function l(e) {
function t() {
return Math.floor(Math.random() * u.length);
}
e = e || 64;
var n = e / 8, r = "", i = n / 4, s = n % 4, o, u = [ "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2A", "2B", "2C", "2D", "2E", "2F", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3A", "3B", "3C", "3D", "3E", "3F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7A", "7B", "7C", "7D", "7E" ];
for (o = 0; o < i; o++) r += u[t()] + u[t()] + u[t()] + u[t()];
for (o = 0; o < s; o++) r += u[t()];
return r;
}
function c() {
var t;
if (typeof e.Titanium != "undefined" && typeof e.Titanium.Network.createHTTPClient != "undefined") t = e.Titanium.Network.createHTTPClient(); else if (typeof require != "undefined") try {
t = (new require("xhr")).XMLHttpRequest();
} catch (n) {
if (typeof e.XMLHttpRequest == "undefined") throw "No valid request transport found.";
t = new e.XMLHttpRequest;
} else {
if (typeof e.XMLHttpRequest == "undefined") throw "No valid request transport found.";
t = new e.XMLHttpRequest;
}
return t;
}
function h(e) {
var t = new Array(++e);
return t.join(0).split("");
}
function p(e) {
var t = [], n, r;
for (r = 0; r < e.length; r++) n = e.charCodeAt(r), n < 128 ? t.push(n) : n < 2048 ? t.push(192 + (n >> 6), 128 + (n & 63)) : n < 65536 ? t.push(224 + (n >> 12), 128 + (n >> 6 & 63), 128 + (n & 63)) : n < 2097152 && t.push(240 + (n >> 18), 128 + (n >> 12 & 63), 128 + (n >> 6 & 63), 128 + (n & 63));
return t;
}
function d(e) {
var t = [], n;
for (n = 0; n < e.length * 32; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
return t;
}
function v(e) {
var t = [], n = e.length, r;
for (r = 0; r < n; r++) t.push((e[r] >>> 4).toString(16)), t.push((e[r] & 15).toString(16));
return t.join("");
}
function m(e) {
var t = "", n = e.length, r;
for (r = 0; r < n; r++) t += String.fromCharCode(e[r]);
return t;
}
function g(e, t) {
return e << t | e >>> 32 - t;
}
function y(e) {
if (e !== undefined) {
var t = e, n, r;
return t.constructor === String && (t = p(t)), this instanceof y ? n = this : n = new y(e), r = n.hash(t), v(r);
}
return this instanceof y ? this : new y;
}
function b(e, t, n, r) {
var i = p(t), s = p(n), o = i.length, u, a, f, l;
o > e.blocksize && (i = e.hash(i), o = i.length), i = i.concat(h(e.blocksize - o)), a = i.slice(0), f = i.slice(0);
for (l = 0; l < e.blocksize; l++) a[l] ^= 92, f[l] ^= 54;
return u = e.hash(a.concat(e.hash(f.concat(s)))), r ? v(u) : m(u);
}
n.prototype = {
join: function(e) {
return e = e || "", this.values().join(e);
},
keys: function() {
var e, t = [], n = this;
for (e in n) n.hasOwnProperty(e) && t.push(e);
return t;
},
values: function() {
var e, t = [], n = this;
for (e in n) n.hasOwnProperty(e) && t.push(n[e]);
return t;
},
shift: function() {
throw "not implimented";
},
unshift: function() {
throw "not implimented";
},
push: function() {
throw "not implimented";
},
pop: function() {
throw "not implimented";
},
sort: function() {
throw "not implimented";
},
ksort: function(e) {
var t = this, n = t.keys(), r, i, s;
e == undefined ? n.sort() : n.sort(e);
for (r = 0; r < n.length; r++) s = n[r], i = t[s], delete t[s], t[s] = i;
return t;
},
toObject: function() {
var e = {}, t, n = this;
for (t in n) n.hasOwnProperty(t) && (e[t] = n[t]);
return e;
}
}, t.prototype = new n, r.prototype = {
scheme: "",
host: "",
port: "",
path: "",
query: "",
anchor: "",
toString: function() {
var e = this, t = e.query + "";
return e.scheme + "://" + e.host + e.path + (t != "" ? "?" + t : "") + (e.anchor !== "" ? "#" + e.anchor : "");
}
}, i.prototype = new t, i.prototype.toString = function() {
var e, t = this, n = [], r = "", i = "", s = o.urlEncode;
t.ksort();
for (e in t) t.hasOwnProperty(e) && e != undefined && t[e] != undefined && (i = s(e) + "=" + s(t[e]), n.push(i));
return n.length > 0 && (r = n.join("&")), r;
}, i.prototype.setQueryParams = function(e) {
var t = arguments, n = t.length, r, i, s, o = this, u;
if (n == 1) {
if (typeof e == "object") for (r in e) e.hasOwnProperty(r) && (o[r] = e[r]); else if (typeof e == "string") {
i = e.split("&");
for (r = 0, s = i.length; r < s; r++) u = i[r].split("="), o[u[0]] = u[1];
}
} else for (r = 0; r < n; r += 2) o[t[r]] = t[r + 1];
};
var s = "1.0";
return o.prototype = {
realm: "",
requestTokenUrl: "",
authorizationUrl: "",
accessTokenUrl: "",
init: function(e) {
var t = "", n = {
enablePrivilege: e.enablePrivilege || !1,
proxyUrl: e.proxyUrl,
callbackUrl: e.callbackUrl || "oob",
consumerKey: e.consumerKey,
consumerSecret: e.consumerSecret,
accessTokenKey: e.accessTokenKey || t,
accessTokenSecret: e.accessTokenSecret || t,
verifier: t,
signatureMethod: e.signatureMethod || "HMAC-SHA1"
};
return this.realm = e.realm || t, this.requestTokenUrl = e.requestTokenUrl || t, this.authorizationUrl = e.authorizationUrl || t, this.accessTokenUrl = e.accessTokenUrl || t, this.getAccessToken = function() {
return [ n.accessTokenKey, n.accessTokenSecret ];
}, this.getAccessTokenKey = function() {
return n.accessTokenKey;
}, this.getAccessTokenSecret = function() {
return n.accessTokenSecret;
}, this.setAccessToken = function(e, t) {
t && (e = [ e, t ]), n.accessTokenKey = e[0], n.accessTokenSecret = e[1];
}, this.getVerifier = function() {
return n.verifier;
}, this.setVerifier = function(e) {
n.verifier = e;
}, this.setCallbackUrl = function(e) {
n.callbackUrl = e;
}, this.request = function(e) {
var t, i, h, p, d, v, m, g, y, b, w, E, S = [], x, T = {}, N, C;
t = e.method || "GET", i = r(e.url), h = e.data || {}, p = e.headers || {}, d = e.success || function() {}, v = e.failure || function() {}, C = function() {
var e = !1;
for (var t in h) typeof h[t].fileName != "undefined" && (e = !0);
return e;
}(), x = e.appendQueryString ? e.appendQueryString : !1, n.enablePrivilege && netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead UniversalBrowserWrite"), m = c(), m.onreadystatechange = function() {
if (m.readyState === 4) {
var e = /^(.*?):\s*(.*?)\r?$/mg, t = p, n = {}, r = "", i;
if (!m.getAllResponseHeaders) {
if (!!m.getResponseHeaders) {
r = m.getResponseHeaders();
for (var s = 0, o = r.length; s < o; ++s) n[r[s][0]] = r[s][1];
}
} else {
r = m.getAllResponseHeaders();
while (i = e.exec(r)) n[i[1]] = i[2];
}
var u = !1;
"Content-Type" in n && n["Content-Type"] == "text/xml" && (u = !0);
var a = {
text: m.responseText,
xml: u ? m.responseXML : "",
requestHeaders: t,
responseHeaders: n
};
m.status >= 200 && m.status <= 226 || m.status == 304 || m.status === 0 ? d(a) : m.status >= 400 && m.status !== 0 && v(a);
}
}, y = {
oauth_callback: n.callbackUrl,
oauth_consumer_key: n.consumerKey,
oauth_token: n.accessTokenKey,
oauth_signature_method: n.signatureMethod,
oauth_timestamp: f(),
oauth_nonce: l(),
oauth_verifier: n.verifier,
oauth_version: s
}, b = n.signatureMethod, N = i.query.toObject();
for (g in N) T[g] = N[g];
if ((!("Content-Type" in p) || p["Content-Type"] == "application/x-www-form-urlencoded") && !C) for (g in h) T[g] = h[g];
urlString = i.scheme + "://" + i.host + i.path, w = a(t, urlString, y, T), E = o.signatureMethod[b](n.consumerSecret, n.accessTokenSecret, w), y.oauth_signature = E, this.realm && (y.realm = this.realm), n.proxyUrl && (i = r(n.proxyUrl + i.path));
if (x || t == "GET") i.query.setQueryParams(h), S = null; else if (!C) if (typeof h == "string") S = h, "Content-Type" in p || (p["Content-Type"] = "text/plain"); else {
for (g in h) S.push(o.urlEncode(g) + "=" + o.urlEncode(h[g] + ""));
S = S.sort().join("&"), "Content-Type" in p || (p["Content-Type"] = "application/x-www-form-urlencoded");
} else if (C) {
S = new FormData;
for (g in h) S.append(g, h[g]);
}
m.open(t, i + "", !0), m.setRequestHeader("Authorization", "OAuth " + u(y)), m.setRequestHeader("X-Requested-With", "XMLHttpRequest");
for (g in p) m.setRequestHeader(g, p[g]);
m.send(S);
}, this;
},
get: function(e, t, n) {
this.request({
url: e,
success: t,
failure: n
});
},
post: function(e, t, n, r) {
this.request({
method: "POST",
url: e,
data: t,
success: n,
failure: r
});
},
getJSON: function(e, t, n) {
this.get(e, function(e) {
t(JSON.parse(e.text));
}, n);
},
postJSON: function(e, t, n, r) {
this.request({
method: "POST",
url: e,
data: JSON.stringify(t),
success: function(e) {
n(JSON.parse(e.text));
},
failure: r,
headers: {
"Content-Type": "application/json"
}
});
},
parseTokenRequest: function(e, t) {
switch (t) {
case "text/xml":
var n = e.xml.getElementsByTagName("token"), r = e.xml.getElementsByTagName("secret");
a[o.urlDecode(n[0])] = o.urlDecode(r[0]);
break;
default:
var i = 0, s = e.text.split("&"), u = s.length, a = {};
for (; i < u; ++i) {
var f = s[i].split("=");
a[o.urlDecode(f[0])] = o.urlDecode(f[1]);
}
}
return a;
},
fetchRequestToken: function(e, t) {
var n = this;
n.setAccessToken("", "");
var r = n.authorizationUrl;
this.get(this.requestTokenUrl, function(t) {
var i = n.parseTokenRequest(t, t.responseHeaders["Content-Type"] || undefined);
n.setAccessToken([ i.oauth_token, i.oauth_token_secret ]), e(r + "?" + t.text);
}, t);
},
fetchAccessToken: function(e, t) {
var n = this;
this.get(this.accessTokenUrl, function(t) {
var r = n.parseTokenRequest(t, t.responseHeaders["Content-Type"] || undefined);
n.setAccessToken([ r.oauth_token, r.oauth_token_secret ]), n.setVerifier(""), e(t);
}, t);
}
}, o.signatureMethod = {
"HMAC-SHA1": function(t, n, r) {
var i, s, u = o.urlEncode;
return t = u(t), n = u(n || ""), i = t + "&" + n, s = b(y.prototype, i, r), e.btoa(s);
}
}, o.urlEncode = function(e) {
function t(e) {
var t = e.toString(16).toUpperCase();
return t.length < 2 && (t = 0 + t), "%" + t;
}
if (!e) return "";
e += "";
var n = /[ \r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/, r = e.length, i, s = e.split(""), o;
for (i = 0; i < r; i++) if (o = s[i].match(n)) o = o[0].charCodeAt(0), o < 128 ? s[i] = t(o) : o < 2048 ? s[i] = t(192 + (o >> 6)) + t(128 + (o & 63)) : o < 65536 ? s[i] = t(224 + (o >> 12)) + t(128 + (o >> 6 & 63)) + t(128 + (o & 63)) : o < 2097152 && (s[i] = t(240 + (o >> 18)) + t(128 + (o >> 12 & 63)) + t(128 + (o >> 6 & 63)) + t(128 + (o & 63)));
return s.join("");
}, o.urlDecode = function(e) {
return e ? e.replace(/%[a-fA-F0-9]{2}/ig, function(e) {
return String.fromCharCode(parseInt(e.replace("%", ""), 16));
}) : "";
}, y.prototype = new y, y.prototype.blocksize = 64, y.prototype.hash = function(e) {
function C(e, t, n, r) {
switch (e) {
case 0:
return t & n | ~t & r;
case 1:
case 3:
return t ^ n ^ r;
case 2:
return t & n | t & r | n & r;
}
return -1;
}
var t = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ], n = [ 1518500249, 1859775393, 2400959708, 3395469782 ], r, i, s, o, u, a, f, l, c, v, m, y, b, w, E, S, x, T, N;
e.constructor === String && (e = p(e.encodeUTF8())), s = e.length, o = Math.ceil((s + 9) / this.blocksize) * this.blocksize - (s + 9), i = Math.floor(s / 4294967296), r = Math.floor(s % 4294967296), u = [ i * 8 >> 24 & 255, i * 8 >> 16 & 255, i * 8 >> 8 & 255, i * 8 & 255, r * 8 >> 24 & 255, r * 8 >> 16 & 255, r * 8 >> 8 & 255, r * 8 & 255 ], e = e.concat([ 128 ], h(o), u), a = Math.ceil(e.length / this.blocksize);
for (f = 0; f < a; f++) {
l = e.slice(f * this.blocksize, (f + 1) * this.blocksize), c = l.length, v = [];
for (m = 0; m < c; m++) v[m >>> 2] |= l[m] << 24 - (m - (m >> 2) * 4) * 8;
y = t[0], b = t[1], w = t[2], E = t[3], S = t[4];
for (x = 0; x < 80; x++) x >= 16 && (v[x] = g(v[x - 3] ^ v[x - 8] ^ v[x - 14] ^ v[x - 16], 1)), T = Math.floor(x / 20), N = g(y, 5) + C(T, b, w, E) + S + n[T] + v[x], S = E, E = w, w = g(b, 30), b = y, y = N;
t[0] += y, t[1] += b, t[2] += w, t[3] += E, t[4] += S;
}
return d(t);
}, o;
}(exports), function(e) {
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
e.btoa = e.btoa || function(e) {
var n = 0, r = e.length, i, s, o = "";
for (; n < r; n += 3) i = [ e.charCodeAt(n), e.charCodeAt(n + 1), e.charCodeAt(n + 2) ], s = [ i[0] >> 2, (i[0] & 3) << 4 | i[1] >> 4, (i[1] & 15) << 2 | i[2] >> 6, i[2] & 63 ], isNaN(i[1]) && (s[2] = 64), isNaN(i[2]) && (s[3] = 64), o += t.charAt(s[0]) + t.charAt(s[1]) + t.charAt(s[2]) + t.charAt(s[3]);
return o;
};
}(this);

// jquery.min.js

(function(e, t) {
function n(e) {
return A.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1;
}
function r(e) {
if (!nn[e]) {
var t = A("<" + e + ">").appendTo("body"), n = t.css("display");
t.remove();
if (n === "none" || n === "") n = "block";
nn[e] = n;
}
return nn[e];
}
function i(e, t) {
var n = {};
return A.each(un.concat.apply([], un.slice(0, t)), function() {
n[this] = e;
}), n;
}
function s() {
try {
return new e.ActiveXObject("Microsoft.XMLHTTP");
} catch (t) {}
}
function o() {
try {
return new e.XMLHttpRequest;
} catch (t) {}
}
function u() {
A(e).unload(function() {
for (var e in en) en[e](0, 1);
});
}
function a(e, n) {
e.dataFilter && (n = e.dataFilter(n, e.dataType));
var r = e.dataTypes, i = {}, s, o, u = r.length, a, f = r[0], l, c, h, p, d;
for (s = 1; s < u; s++) {
if (s === 1) for (o in e.converters) typeof o == "string" && (i[o.toLowerCase()] = e.converters[o]);
l = f, f = r[s];
if (f === "*") f = l; else if (l !== "*" && l !== f) {
c = l + " " + f, h = i[c] || i["* " + f];
if (!h) {
d = t;
for (p in i) {
a = p.split(" ");
if (a[0] === l || a[0] === "*") {
d = i[a[1] + " " + f];
if (d) {
p = i[p], p === !0 ? h = d : d === !0 && (h = p);
break;
}
}
}
}
!h && !d && A.error("No conversion from " + c.replace(" ", " to ")), h !== !0 && (n = h ? h(n) : d(p(n)));
}
}
return n;
}
function f(e, n, r) {
var i = e.contents, s = e.dataTypes, o = e.responseFields, u, a, f, l;
for (a in o) a in r && (n[o[a]] = r[a]);
while (s[0] === "*") s.shift(), u === t && (u = e.mimeType || n.getResponseHeader("content-type"));
if (u) for (a in i) if (i[a] && i[a].test(u)) {
s.unshift(a);
break;
}
if (s[0] in r) f = s[0]; else {
for (a in r) {
if (!s[0] || e.converters[a + " " + s[0]]) {
f = a;
break;
}
l || (l = a);
}
f = f || l;
}
if (f) return f !== s[0] && s.unshift(f), r[f];
}
function l(e, t, n, r) {
if (A.isArray(t) && t.length) A.each(t, function(t, i) {
n || At.test(e) ? r(e, i) : l(e + "[" + (typeof i == "object" || A.isArray(i) ? t : "") + "]", i, n, r);
}); else if (n || t == null || typeof t != "object") r(e, t); else if (A.isArray(t) || A.isEmptyObject(t)) r(e, ""); else for (var i in t) l(e + "[" + i + "]", t[i], n, r);
}
function c(e, n, r, i, s, o) {
s = s || n.dataTypes[0], o = o || {}, o[s] = !0;
var u = e[s], a = 0, f = u ? u.length : 0, l = e === Vt, h;
for (; a < f && (l || !h); a++) h = u[a](n, r, i), typeof h == "string" && (!l || o[h] ? h = t : (n.dataTypes.unshift(h), h = c(e, n, r, i, h, o)));
return (l || !h) && !o["*"] && (h = c(e, n, r, i, "*", o)), h;
}
function h(e) {
return function(t, n) {
typeof t != "string" && (n = t, t = "*");
if (A.isFunction(n)) {
var r = t.toLowerCase().split(qt), i = 0, s = r.length, o, u, a;
for (; i < s; i++) o = r[i], a = /^\+/.test(o), a && (o = o.substr(1) || "*"), u = e[o] = e[o] || [], u[a ? "unshift" : "push"](n);
}
};
}
function p(e, t, n) {
var r = t === "width" ? St : xt, i = t === "width" ? e.offsetWidth : e.offsetHeight;
return n === "border" ? i : (A.each(r, function() {
n || (i -= parseFloat(A.css(e, "padding" + this)) || 0), n === "margin" ? i += parseFloat(A.css(e, "margin" + this)) || 0 : i -= parseFloat(A.css(e, "border" + this + "Width")) || 0;
}), i);
}
function d(e, t) {
t.src ? A.ajax({
url: t.src,
async: !1,
dataType: "script"
}) : A.globalEval(t.text || t.textContent || t.innerHTML || ""), t.parentNode && t.parentNode.removeChild(t);
}
function v(e) {
return "getElementsByTagName" in e ? e.getElementsByTagName("*") : "querySelectorAll" in e ? e.querySelectorAll("*") : [];
}
function m(e, t) {
if (t.nodeType === 1) {
var n = t.nodeName.toLowerCase();
t.clearAttributes(), t.mergeAttributes(e);
if (n === "object") t.outerHTML = e.outerHTML; else if (n !== "input" || e.type !== "checkbox" && e.type !== "radio") {
if (n === "option") t.selected = e.defaultSelected; else if (n === "input" || n === "textarea") t.defaultValue = e.defaultValue;
} else e.checked && (t.defaultChecked = t.checked = e.checked), t.value !== e.value && (t.value = e.value);
t.removeAttribute(A.expando);
}
}
function g(e, t) {
if (t.nodeType === 1 && A.hasData(e)) {
var n = A.expando, r = A.data(e), i = A.data(t, r);
if (r = r[n]) {
var s = r.events;
i = i[n] = A.extend({}, r);
if (s) {
delete i.handle, i.events = {};
for (var o in s) for (var u = 0, a = s[o].length; u < a; u++) A.event.add(t, o + (s[o][u].namespace ? "." : "") + s[o][u].namespace, s[o][u], s[o][u].data);
}
}
}
}
function y(e, t) {
return A.nodeName(e, "table") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e;
}
function b(e, t, n) {
if (A.isFunction(t)) return A.grep(e, function(e, r) {
var i = !!t.call(e, r, e);
return i === n;
});
if (t.nodeType) return A.grep(e, function(e, r) {
return e === t === n;
});
if (typeof t == "string") {
var r = A.grep(e, function(e) {
return e.nodeType === 1;
});
if (nt.test(t)) return A.filter(t, r, !n);
t = A.filter(t, r);
}
return A.grep(e, function(e, r) {
return A.inArray(e, t) >= 0 === n;
});
}
function w(e) {
return !e || !e.parentNode || e.parentNode.nodeType === 11;
}
function E(e, t) {
return (e && e !== "*" ? e + "." : "") + t.replace(z, "`").replace(W, "&");
}
function S(e) {
var t, n, r, i, s, o, u, a, f, l, c, h, p, d = [], v = [], m = A._data(this, "events");
if (e.liveFired !== this && m && m.live && !e.target.disabled && (!e.button || e.type !== "click")) {
e.namespace && (h = new RegExp("(^|\\.)" + e.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)")), e.liveFired = this;
var g = m.live.slice(0);
for (u = 0; u < g.length; u++) s = g[u], s.origType.replace(R, "") === e.type ? v.push(s.selector) : g.splice(u--, 1);
i = A(e.target).closest(v, e.currentTarget);
for (a = 0, f = i.length; a < f; a++) {
c = i[a];
for (u = 0; u < g.length; u++) {
s = g[u];
if (c.selector === s.selector && (!h || h.test(s.namespace)) && !c.elem.disabled) {
o = c.elem, r = null;
if (s.preType === "mouseenter" || s.preType === "mouseleave") e.type = s.preType, r = A(e.relatedTarget).closest(s.selector)[0];
(!r || r !== o) && d.push({
elem: o,
handleObj: s,
level: c.level
});
}
}
}
for (a = 0, f = d.length; a < f; a++) {
i = d[a];
if (n && i.level > n) break;
e.currentTarget = i.elem, e.data = i.handleObj.data, e.handleObj = i.handleObj, p = i.handleObj.origHandler.apply(i.elem, arguments);
if (p === !1 || e.isPropagationStopped()) {
n = i.level, p === !1 && (t = !1);
if (e.isImmediatePropagationStopped()) break;
}
}
return t;
}
}
function x(e, n, r) {
var i = A.extend({}, r[0]);
i.type = e, i.originalEvent = {}, i.liveFired = t, A.event.handle.call(n, i), i.isDefaultPrevented() && r[0].preventDefault();
}
function T() {
return !0;
}
function N() {
return !1;
}
function C(e) {
for (var t in e) if (t !== "toJSON") return !1;
return !0;
}
function k(e, n, r) {
if (r === t && e.nodeType === 1) {
r = e.getAttribute("data-" + n);
if (typeof r == "string") {
try {
r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : A.isNaN(r) ? _.test(r) ? A.parseJSON(r) : r : parseFloat(r);
} catch (i) {}
A.data(e, n, r);
} else r = t;
}
return r;
}
var L = e.document, A = function() {
function n() {
if (!r.isReady) {
try {
L.documentElement.doScroll("left");
} catch (e) {
setTimeout(n, 1);
return;
}
r.ready();
}
}
var r = function(e, t) {
return new r.fn.init(e, t, o);
}, i = e.jQuery, s = e.$, o, u = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/, a = /\S/, f = /^\s+/, l = /\s+$/, c = /\d/, h = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, p = /^[\],:{}\s]*$/, d = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, v = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, m = /(?:^|:|,)(?:\s*\[)+/g, g = /(webkit)[ \/]([\w.]+)/, y = /(opera)(?:.*version)?[ \/]([\w.]+)/, b = /(msie) ([\w.]+)/, w = /(mozilla)(?:.*? rv:([\w.]+))?/, E = navigator.userAgent, S, x, T, N = Object.prototype.toString, C = Object.prototype.hasOwnProperty, k = Array.prototype.push, A = Array.prototype.slice, O = String.prototype.trim, M = Array.prototype.indexOf, _ = {};
return r.fn = r.prototype = {
constructor: r,
init: function(e, n, i) {
var s, o, a, f;
if (!e) return this;
if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
if (e === "body" && !n && L.body) return this.context = L, this[0] = L.body, this.selector = "body", this.length = 1, this;
if (typeof e == "string") {
s = u.exec(e);
if (!s || !s[1] && n) return !n || n.jquery ? (n || i).find(e) : this.constructor(n).find(e);
if (s[1]) return n = n instanceof r ? n[0] : n, f = n ? n.ownerDocument || n : L, a = h.exec(e), a ? r.isPlainObject(n) ? (e = [ L.createElement(a[1]) ], r.fn.attr.call(e, n, !0)) : e = [ f.createElement(a[1]) ] : (a = r.buildFragment([ s[1] ], [ f ]), e = (a.cacheable ? r.clone(a.fragment) : a.fragment).childNodes), r.merge(this, e);
o = L.getElementById(s[2]);
if (o && o.parentNode) {
if (o.id !== s[2]) return i.find(e);
this.length = 1, this[0] = o;
}
return this.context = L, this.selector = e, this;
}
return r.isFunction(e) ? i.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), r.makeArray(e, this));
},
selector: "",
jquery: "1.5.2",
length: 0,
size: function() {
return this.length;
},
toArray: function() {
return A.call(this, 0);
},
get: function(e) {
return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e];
},
pushStack: function(e, t, n) {
var i = this.constructor();
return r.isArray(e) ? k.apply(i, e) : r.merge(i, e), i.prevObject = this, i.context = this.context, t === "find" ? i.selector = this.selector + (this.selector ? " " : "") + n : t && (i.selector = this.selector + "." + t + "(" + n + ")"), i;
},
each: function(e, t) {
return r.each(this, e, t);
},
ready: function(e) {
return r.bindReady(), x.done(e), this;
},
eq: function(e) {
return e === -1 ? this.slice(e) : this.slice(e, +e + 1);
},
first: function() {
return this.eq(0);
},
last: function() {
return this.eq(-1);
},
slice: function() {
return this.pushStack(A.apply(this, arguments), "slice", A.call(arguments).join(","));
},
map: function(e) {
return this.pushStack(r.map(this, function(t, n) {
return e.call(t, n, t);
}));
},
end: function() {
return this.prevObject || this.constructor(null);
},
push: k,
sort: [].sort,
splice: [].splice
}, r.fn.init.prototype = r.fn, r.extend = r.fn.extend = function() {
var e, n, i, s, o, u, a = arguments[0] || {}, f = 1, l = arguments.length, c = !1;
typeof a == "boolean" && (c = a, a = arguments[1] || {}, f = 2), typeof a != "object" && !r.isFunction(a) && (a = {}), l === f && (a = this, --f);
for (; f < l; f++) if ((e = arguments[f]) != null) for (n in e) {
i = a[n], s = e[n];
if (a === s) continue;
c && s && (r.isPlainObject(s) || (o = r.isArray(s))) ? (o ? (o = !1, u = i && r.isArray(i) ? i : []) : u = i && r.isPlainObject(i) ? i : {}, a[n] = r.extend(c, u, s)) : s !== t && (a[n] = s);
}
return a;
}, r.extend({
noConflict: function(t) {
return e.$ = s, t && (e.jQuery = i), r;
},
isReady: !1,
readyWait: 1,
ready: function(e) {
e === !0 && r.readyWait--;
if (!r.readyWait || e !== !0 && !r.isReady) {
if (!L.body) return setTimeout(r.ready, 1);
r.isReady = !0;
if (e !== !0 && --r.readyWait > 0) return;
x.resolveWith(L, [ r ]), r.fn.trigger && r(L).trigger("ready").unbind("ready");
}
},
bindReady: function() {
if (!x) {
x = r._Deferred();
if (L.readyState === "complete") return setTimeout(r.ready, 1);
if (L.addEventListener) L.addEventListener("DOMContentLoaded", T, !1), e.addEventListener("load", r.ready, !1); else if (L.attachEvent) {
L.attachEvent("onreadystatechange", T), e.attachEvent("onload", r.ready);
var t = !1;
try {
t = e.frameElement == null;
} catch (i) {}
L.documentElement.doScroll && t && n();
}
}
},
isFunction: function(e) {
return r.type(e) === "function";
},
isArray: Array.isArray || function(e) {
return r.type(e) === "array";
},
isWindow: function(e) {
return e && typeof e == "object" && "setInterval" in e;
},
isNaN: function(e) {
return e == null || !c.test(e) || isNaN(e);
},
type: function(e) {
return e == null ? String(e) : _[N.call(e)] || "object";
},
isPlainObject: function(e) {
if (!e || r.type(e) !== "object" || e.nodeType || r.isWindow(e)) return !1;
if (e.constructor && !C.call(e, "constructor") && !C.call(e.constructor.prototype, "isPrototypeOf")) return !1;
var n;
for (n in e) ;
return n === t || C.call(e, n);
},
isEmptyObject: function(e) {
for (var t in e) return !1;
return !0;
},
error: function(e) {
throw e;
},
parseJSON: function(t) {
if (typeof t != "string" || !t) return null;
t = r.trim(t);
if (p.test(t.replace(d, "@").replace(v, "]").replace(m, ""))) return e.JSON && e.JSON.parse ? e.JSON.parse(t) : (new Function("return " + t))();
r.error("Invalid JSON: " + t);
},
parseXML: function(t, n, i) {
return e.DOMParser ? (i = new DOMParser, n = i.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t)), i = n.documentElement, (!i || !i.nodeName || i.nodeName === "parsererror") && r.error("Invalid XML: " + t), n;
},
noop: function() {},
globalEval: function(e) {
if (e && a.test(e)) {
var t = L.head || L.getElementsByTagName("head")[0] || L.documentElement, n = L.createElement("script");
r.support.scriptEval() ? n.appendChild(L.createTextNode(e)) : n.text = e, t.insertBefore(n, t.firstChild), t.removeChild(n);
}
},
nodeName: function(e, t) {
return e.nodeName && e.nodeName.toUpperCase() === t.toUpperCase();
},
each: function(e, n, i) {
var s, o = 0, u = e.length, a = u === t || r.isFunction(e);
if (i) {
if (a) {
for (s in e) if (n.apply(e[s], i) === !1) break;
} else for (; o < u; ) if (n.apply(e[o++], i) === !1) break;
} else if (a) {
for (s in e) if (n.call(e[s], s, e[s]) === !1) break;
} else for (var f = e[0]; o < u && n.call(f, o, f) !== !1; f = e[++o]) ;
return e;
},
trim: O ? function(e) {
return e == null ? "" : O.call(e);
} : function(e) {
return e == null ? "" : (e + "").replace(f, "").replace(l, "");
},
makeArray: function(e, t) {
var n = t || [];
if (e != null) {
var i = r.type(e);
e.length == null || i === "string" || i === "function" || i === "regexp" || r.isWindow(e) ? k.call(n, e) : r.merge(n, e);
}
return n;
},
inArray: function(e, t) {
if (t.indexOf) return t.indexOf(e);
for (var n = 0, r = t.length; n < r; n++) if (t[n] === e) return n;
return -1;
},
merge: function(e, n) {
var r = e.length, i = 0;
if (typeof n.length == "number") for (var s = n.length; i < s; i++) e[r++] = n[i]; else while (n[i] !== t) e[r++] = n[i++];
return e.length = r, e;
},
grep: function(e, t, n) {
var r = [], i;
n = !!n;
for (var s = 0, o = e.length; s < o; s++) i = !!t(e[s], s), n !== i && r.push(e[s]);
return r;
},
map: function(e, t, n) {
var r = [], i;
for (var s = 0, o = e.length; s < o; s++) i = t(e[s], s, n), i != null && (r[r.length] = i);
return r.concat.apply([], r);
},
guid: 1,
proxy: function(e, n, i) {
return arguments.length === 2 && (typeof n == "string" ? (i = e, e = i[n], n = t) : n && !r.isFunction(n) && (i = n, n = t)), !n && e && (n = function() {
return e.apply(i || this, arguments);
}), e && (n.guid = e.guid = e.guid || n.guid || r.guid++), n;
},
access: function(e, n, i, s, o, u) {
var a = e.length;
if (typeof n == "object") {
for (var f in n) r.access(e, f, n[f], s, o, i);
return e;
}
if (i !== t) {
s = !u && s && r.isFunction(i);
for (var l = 0; l < a; l++) o(e[l], n, s ? i.call(e[l], l, o(e[l], n)) : i, u);
return e;
}
return a ? o(e[0], n) : t;
},
now: function() {
return (new Date).getTime();
},
uaMatch: function(e) {
e = e.toLowerCase();
var t = g.exec(e) || y.exec(e) || b.exec(e) || e.indexOf("compatible") < 0 && w.exec(e) || [];
return {
browser: t[1] || "",
version: t[2] || "0"
};
},
sub: function() {
function e(t, n) {
return new e.fn.init(t, n);
}
r.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.subclass = this.subclass, e.fn.init = function n(n, i) {
return i && i instanceof r && !(i instanceof e) && (i = e(i)), r.fn.init.call(this, n, i, t);
}, e.fn.init.prototype = e.fn;
var t = e(L);
return e;
},
browser: {}
}), r.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
_["[object " + t + "]"] = t.toLowerCase();
}), S = r.uaMatch(E), S.browser && (r.browser[S.browser] = !0, r.browser.version = S.version), r.browser.webkit && (r.browser.safari = !0), M && (r.inArray = function(e, t) {
return M.call(t, e);
}), a.test("\u00a0") && (f = /^[\s\xA0]+/, l = /[\s\xA0]+$/), o = r(L), L.addEventListener ? T = function() {
L.removeEventListener("DOMContentLoaded", T, !1), r.ready();
} : L.attachEvent && (T = function() {
L.readyState === "complete" && (L.detachEvent("onreadystatechange", T), r.ready());
}), r;
}(), O = "then done fail isResolved isRejected promise".split(" "), M = [].slice;
A.extend({
_Deferred: function() {
var e = [], t, n, r, i = {
done: function() {
if (!r) {
var n = arguments, s, o, u, a, f;
t && (f = t, t = 0);
for (s = 0, o = n.length; s < o; s++) u = n[s], a = A.type(u), a === "array" ? i.done.apply(i, u) : a === "function" && e.push(u);
f && i.resolveWith(f[0], f[1]);
}
return this;
},
resolveWith: function(i, s) {
if (!r && !t && !n) {
s = s || [], n = 1;
try {
while (e[0]) e.shift().apply(i, s);
} finally {
t = [ i, s ], n = 0;
}
}
return this;
},
resolve: function() {
return i.resolveWith(this, arguments), this;
},
isResolved: function() {
return n || t;
},
cancel: function() {
return r = 1, e = [], this;
}
};
return i;
},
Deferred: function(e) {
var t = A._Deferred(), n = A._Deferred(), r;
return A.extend(t, {
then: function(e, n) {
return t.done(e).fail(n), this;
},
fail: n.done,
rejectWith: n.resolveWith,
reject: n.resolve,
isRejected: n.isResolved,
promise: function(e) {
if (e == null) {
if (r) return r;
r = e = {};
}
var n = O.length;
while (n--) e[O[n]] = t[O[n]];
return e;
}
}), t.done(n.cancel).fail(t.cancel), delete t.cancel, e && e.call(t, t), t;
},
when: function(e) {
function t(e) {
return function(t) {
n[e] = arguments.length > 1 ? M.call(arguments, 0) : t, --s || o.resolveWith(o, M.call(n, 0));
};
}
var n = arguments, r = 0, i = n.length, s = i, o = i <= 1 && e && A.isFunction(e.promise) ? e : A.Deferred();
if (i > 1) {
for (; r < i; r++) n[r] && A.isFunction(n[r].promise) ? n[r].promise().then(t(r), o.reject) : --s;
s || o.resolveWith(o, n);
} else o !== e && o.resolveWith(o, i ? [ e ] : []);
return o.promise();
}
}), function() {
A.support = {};
var t = L.createElement("div");
t.style.display = "none", t.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
var n = t.getElementsByTagName("*"), r = t.getElementsByTagName("a")[0], i = L.createElement("select"), s = i.appendChild(L.createElement("option")), o = t.getElementsByTagName("input")[0];
if (n && n.length && r) {
A.support = {
leadingWhitespace: t.firstChild.nodeType === 3,
tbody: !t.getElementsByTagName("tbody").length,
htmlSerialize: !!t.getElementsByTagName("link").length,
style: /red/.test(r.getAttribute("style")),
hrefNormalized: r.getAttribute("href") === "/a",
opacity: /^0.55$/.test(r.style.opacity),
cssFloat: !!r.style.cssFloat,
checkOn: o.value === "on",
optSelected: s.selected,
deleteExpando: !0,
optDisabled: !1,
checkClone: !1,
noCloneEvent: !0,
noCloneChecked: !0,
boxModel: null,
inlineBlockNeedsLayout: !1,
shrinkWrapBlocks: !1,
reliableHiddenOffsets: !0,
reliableMarginRight: !0
}, o.checked = !0, A.support.noCloneChecked = o.cloneNode(!0).checked, i.disabled = !0, A.support.optDisabled = !s.disabled;
var u = null;
A.support.scriptEval = function() {
if (u === null) {
var t = L.documentElement, n = L.createElement("script"), r = "script" + A.now();
try {
n.appendChild(L.createTextNode("window." + r + "=1;"));
} catch (i) {}
t.insertBefore(n, t.firstChild), e[r] ? (u = !0, delete e[r]) : u = !1, t.removeChild(n);
}
return u;
};
try {
delete t.test;
} catch (a) {
A.support.deleteExpando = !1;
}
!t.addEventListener && t.attachEvent && t.fireEvent && (t.attachEvent("onclick", function c() {
A.support.noCloneEvent = !1, t.detachEvent("onclick", c);
}), t.cloneNode(!0).fireEvent("onclick")), t = L.createElement("div"), t.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
var f = L.createDocumentFragment();
f.appendChild(t.firstChild), A.support.checkClone = f.cloneNode(!0).cloneNode(!0).lastChild.checked, A(function() {
var e = L.createElement("div"), t = L.getElementsByTagName("body")[0];
if (t) {
e.style.width = e.style.paddingLeft = "1px", t.appendChild(e), A.boxModel = A.support.boxModel = e.offsetWidth === 2, "zoom" in e.style && (e.style.display = "inline", e.style.zoom = 1, A.support.inlineBlockNeedsLayout = e.offsetWidth === 2, e.style.display = "", e.innerHTML = "<div style='width:4px;'></div>", A.support.shrinkWrapBlocks = e.offsetWidth !== 2), e.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
var n = e.getElementsByTagName("td");
A.support.reliableHiddenOffsets = n[0].offsetHeight === 0, n[0].style.display = "", n[1].style.display = "none", A.support.reliableHiddenOffsets = A.support.reliableHiddenOffsets && n[0].offsetHeight === 0, e.innerHTML = "", L.defaultView && L.defaultView.getComputedStyle && (e.style.width = "1px", e.style.marginRight = "0", A.support.reliableMarginRight = (parseInt(L.defaultView.getComputedStyle(e, null).marginRight, 10) || 0) === 0), t.removeChild(e).style.display = "none", e = n = null;
}
});
var l = function(e) {
var t = L.createElement("div");
e = "on" + e;
if (!t.attachEvent) return !0;
var n = e in t;
return n || (t.setAttribute(e, "return;"), n = typeof t[e] == "function"), n;
};
A.support.submitBubbles = l("submit"), A.support.changeBubbles = l("change"), t = n = r = null;
}
}();
var _ = /^(?:\{.*\}|\[.*\])$/;
A.extend({
cache: {},
uuid: 0,
expando: "jQuery" + (A.fn.jquery + Math.random()).replace(/\D/g, ""),
noData: {
embed: !0,
object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
applet: !0
},
hasData: function(e) {
return e = e.nodeType ? A.cache[e[A.expando]] : e[A.expando], !!e && !C(e);
},
data: function(e, n, r, i) {
if (A.acceptData(e)) {
var s = A.expando, o = typeof n == "string", u, a = e.nodeType, f = a ? A.cache : e, l = a ? e[A.expando] : e[A.expando] && A.expando;
if ((!l || i && l && !f[l][s]) && o && r === t) return;
l || (a ? e[A.expando] = l = ++A.uuid : l = A.expando), f[l] || (f[l] = {}, a || (f[l].toJSON = A.noop));
if (typeof n == "object" || typeof n == "function") i ? f[l][s] = A.extend(f[l][s], n) : f[l] = A.extend(f[l], n);
return u = f[l], i && (u[s] || (u[s] = {}), u = u[s]), r !== t && (u[n] = r), n === "events" && !u[n] ? u[s] && u[s].events : o ? u[n] : u;
}
},
removeData: function(t, n, r) {
if (A.acceptData(t)) {
var i = A.expando, s = t.nodeType, o = s ? A.cache : t, u = s ? t[A.expando] : A.expando;
if (!o[u]) return;
if (n) {
var a = r ? o[u][i] : o[u];
if (a) {
delete a[n];
if (!C(a)) return;
}
}
if (r) {
delete o[u][i];
if (!C(o[u])) return;
}
var f = o[u][i];
A.support.deleteExpando || o != e ? delete o[u] : o[u] = null, f ? (o[u] = {}, s || (o[u].toJSON = A.noop), o[u][i] = f) : s && (A.support.deleteExpando ? delete t[A.expando] : t.removeAttribute ? t.removeAttribute(A.expando) : t[A.expando] = null);
}
},
_data: function(e, t, n) {
return A.data(e, t, n, !0);
},
acceptData: function(e) {
if (e.nodeName) {
var t = A.noData[e.nodeName.toLowerCase()];
if (t) return t !== !0 && e.getAttribute("classid") === t;
}
return !0;
}
}), A.fn.extend({
data: function(e, n) {
var r = null;
if (typeof e == "undefined") {
if (this.length) {
r = A.data(this[0]);
if (this[0].nodeType === 1) {
var i = this[0].attributes, s;
for (var o = 0, u = i.length; o < u; o++) s = i[o].name, s.indexOf("data-") === 0 && (s = s.substr(5), k(this[0], s, r[s]));
}
}
return r;
}
if (typeof e == "object") return this.each(function() {
A.data(this, e);
});
var a = e.split(".");
return a[1] = a[1] ? "." + a[1] : "", n === t ? (r = this.triggerHandler("getData" + a[1] + "!", [ a[0] ]), r === t && this.length && (r = A.data(this[0], e), r = k(this[0], e, r)), r === t && a[1] ? this.data(a[0]) : r) : this.each(function() {
var t = A(this), r = [ a[0], n ];
t.triggerHandler("setData" + a[1] + "!", r), A.data(this, e, n), t.triggerHandler("changeData" + a[1] + "!", r);
});
},
removeData: function(e) {
return this.each(function() {
A.removeData(this, e);
});
}
}), A.extend({
queue: function(e, t, n) {
if (e) {
t = (t || "fx") + "queue";
var r = A._data(e, t);
return n ? (!r || A.isArray(n) ? r = A._data(e, t, A.makeArray(n)) : r.push(n), r) : r || [];
}
},
dequeue: function(e, t) {
t = t || "fx";
var n = A.queue(e, t), r = n.shift();
r === "inprogress" && (r = n.shift()), r && (t === "fx" && n.unshift("inprogress"), r.call(e, function() {
A.dequeue(e, t);
})), n.length || A.removeData(e, t + "queue", !0);
}
}), A.fn.extend({
queue: function(e, n) {
return typeof e != "string" && (n = e, e = "fx"), n === t ? A.queue(this[0], e) : this.each(function(t) {
var r = A.queue(this, e, n);
e === "fx" && r[0] !== "inprogress" && A.dequeue(this, e);
});
},
dequeue: function(e) {
return this.each(function() {
A.dequeue(this, e);
});
},
delay: function(e, t) {
return e = A.fx ? A.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function() {
var n = this;
setTimeout(function() {
A.dequeue(n, t);
}, e);
});
},
clearQueue: function(e) {
return this.queue(e || "fx", []);
}
});
var D = /[\n\t\r]/g, P = /\s+/, H = /\r/g, B = /^(?:href|src|style)$/, j = /^(?:button|input)$/i, F = /^(?:button|input|object|select|textarea)$/i, I = /^a(?:rea)?$/i, q = /^(?:radio|checkbox)$/i;
A.props = {
"for": "htmlFor",
"class": "classes",
readonly: "readOnly",
maxlength: "maxLength",
cellspacing: "cellSpacing",
rowspan: "rowSpan",
colspan: "colSpan",
tabindex: "tabIndex",
usemap: "useMap",
frameborder: "frameBorder"
}, A.fn.extend({
attr: function(e, t) {
return A.access(this, e, t, !0, A.attr);
},
removeAttr: function(e, t) {
return this.each(function() {
A.attr(this, e, ""), this.nodeType === 1 && this.removeAttribute(e);
});
},
addClass: function(e) {
if (A.isFunction(e)) return this.each(function(t) {
var n = A(this);
n.addClass(e.call(this, t, n.attr("class")));
});
if (e && typeof e == "string") {
var t = (e || "").split(P);
for (var n = 0, r = this.length; n < r; n++) {
var i = this[n];
if (i.nodeType === 1) if (i.classes) {
var s = " " + i.classes + " ", o = i.classes;
for (var u = 0, a = t.length; u < a; u++) s.indexOf(" " + t[u] + " ") < 0 && (o += " " + t[u]);
i.classes = A.trim(o);
} else i.classes = e;
}
}
return this;
},
removeClass: function(e) {
if (A.isFunction(e)) return this.each(function(t) {
var n = A(this);
n.removeClass(e.call(this, t, n.attr("class")));
});
if (e && typeof e == "string" || e === t) {
var n = (e || "").split(P);
for (var r = 0, i = this.length; r < i; r++) {
var s = this[r];
if (s.nodeType === 1 && s.classes) if (e) {
var o = (" " + s.classes + " ").replace(D, " ");
for (var u = 0, a = n.length; u < a; u++) o = o.replace(" " + n[u] + " ", " ");
s.classes = A.trim(o);
} else s.classes = "";
}
}
return this;
},
toggleClass: function(e, t) {
var n = typeof e, r = typeof t == "boolean";
return A.isFunction(e) ? this.each(function(n) {
var r = A(this);
r.toggleClass(e.call(this, n, r.attr("class"), t), t);
}) : this.each(function() {
if (n === "string") {
var i, s = 0, o = A(this), u = t, a = e.split(P);
while (i = a[s++]) u = r ? u : !o.hasClass(i), o[u ? "addClass" : "removeClass"](i);
} else if (n === "undefined" || n === "boolean") this.classes && A._data(this, "__classes__", this.classes), this.classes = this.classes || e === !1 ? "" : A._data(this, "__classes__") || "";
});
},
hasClass: function(e) {
var t = " " + e + " ";
for (var n = 0, r = this.length; n < r; n++) if ((" " + this[n].classes + " ").replace(D, " ").indexOf(t) > -1) return !0;
return !1;
},
val: function(e) {
if (!arguments.length) {
var n = this[0];
if (n) {
if (A.nodeName(n, "option")) {
var r = n.attributes.value;
return !r || r.specified ? n.value : n.text;
}
if (A.nodeName(n, "select")) {
var i = n.selectedIndex, s = [], o = n.options, u = n.type === "select-one";
if (i < 0) return null;
for (var a = u ? i : 0, f = u ? i + 1 : o.length; a < f; a++) {
var l = o[a];
if (l.selected && (A.support.optDisabled ? !l.disabled : l.getAttribute("disabled") === null) && (!l.parentNode.disabled || !A.nodeName(l.parentNode, "optgroup"))) {
e = A(l).val();
if (u) return e;
s.push(e);
}
}
return u && !s.length && o.length ? A(o[i]).val() : s;
}
return q.test(n.type) && !A.support.checkOn ? n.getAttribute("value") === null ? "on" : n.value : (n.value || "").replace(H, "");
}
return t;
}
var c = A.isFunction(e);
return this.each(function(t) {
var n = A(this), r = e;
if (this.nodeType === 1) {
c && (r = e.call(this, t, n.val())), r == null ? r = "" : typeof r == "number" ? r += "" : A.isArray(r) && (r = A.map(r, function(e) {
return e == null ? "" : e + "";
}));
if (A.isArray(r) && q.test(this.type)) this.checked = A.inArray(n.val(), r) >= 0; else if (A.nodeName(this, "select")) {
var i = A.makeArray(r);
A("option", this).each(function() {
this.selected = A.inArray(A(this).val(), i) >= 0;
}), i.length || (this.selectedIndex = -1);
} else this.value = r;
}
});
}
}), A.extend({
attrFn: {
val: !0,
css: !0,
html: !0,
text: !0,
data: !0,
width: !0,
height: !0,
offset: !0
},
attr: function(e, n, r, i) {
if (!e || e.nodeType === 3 || e.nodeType === 8 || e.nodeType === 2) return t;
if (i && n in A.attrFn) return A(e)[n](r);
var s = e.nodeType !== 1 || !A.isXMLDoc(e), o = r !== t;
n = s && A.props[n] || n;
if (e.nodeType === 1) {
var u = B.test(n);
if (n === "selected" && !A.support.optSelected) {
var a = e.parentNode;
a && (a.selectedIndex, a.parentNode && a.parentNode.selectedIndex);
}
if ((n in e || e[n] !== t) && s && !u) {
o && (n === "type" && j.test(e.nodeName) && e.parentNode && A.error("type property can't be changed"), r === null ? e.nodeType === 1 && e.removeAttribute(n) : e[n] = r);
if (A.nodeName(e, "form") && e.getAttributeNode(n)) return e.getAttributeNode(n).nodeValue;
if (n === "tabIndex") {
var f = e.getAttributeNode("tabIndex");
return f && f.specified ? f.value : F.test(e.nodeName) || I.test(e.nodeName) && e.href ? 0 : t;
}
return e[n];
}
if (!A.support.style && s && n === "style") return o && (e.style.cssText = "" + r), e.style.cssText;
o && e.setAttribute(n, "" + r);
if (!e.attributes[n] && e.hasAttribute && !e.hasAttribute(n)) return t;
var l = !A.support.hrefNormalized && s && u ? e.getAttribute(n, 2) : e.getAttribute(n);
return l === null ? t : l;
}
return o && (e[n] = r), e[n];
}
});
var R = /\.(.*)$/, U = /^(?:textarea|input|select)$/i, z = /\./g, W = / /g, X = /[^\w\s.|`]/g, V = function(e) {
return e.replace(X, "\\$&");
};
A.event = {
add: function(n, r, i, s) {
if (n.nodeType !== 3 && n.nodeType !== 8) {
try {
A.isWindow(n) && n !== e && !n.frameElement && (n = e);
} catch (o) {}
if (i === !1) i = N; else if (!i) return;
var u, a;
i.handler && (u = i, i = u.handler), i.guid || (i.guid = A.guid++);
var f = A._data(n);
if (!f) return;
var l = f.events, c = f.handle;
l || (f.events = l = {}), c || (f.handle = c = function(e) {
return typeof A != "undefined" && A.event.triggered !== e.type ? A.event.handle.apply(c.elem, arguments) : t;
}), c.elem = n, r = r.split(" ");
var h, p = 0, d;
while (h = r[p++]) {
a = u ? A.extend({}, u) : {
handler: i,
data: s
}, h.indexOf(".") > -1 ? (d = h.split("."), h = d.shift(), a.namespace = d.slice(0).sort().join(".")) : (d = [], a.namespace = ""), a.type = h, a.guid || (a.guid = i.guid);
var v = l[h], m = A.event.special[h] || {};
if (!v) {
v = l[h] = [];
if (!m.setup || m.setup.call(n, s, d, c) === !1) n.addEventListener ? n.addEventListener(h, c, !1) : n.attachEvent && n.attachEvent("on" + h, c);
}
m.add && (m.add.call(n, a), a.handler.guid || (a.handler.guid = i.guid)), v.push(a), A.event.global[h] = !0;
}
n = null;
}
},
global: {},
remove: function(e, n, r, i) {
if (e.nodeType !== 3 && e.nodeType !== 8) {
r === !1 && (r = N);
var s, o, u, a, f = 0, l, c, h, p, d, v, m, g = A.hasData(e) && A._data(e), y = g && g.events;
if (!g || !y) return;
n && n.type && (r = n.handler, n = n.type);
if (!n || typeof n == "string" && n.charAt(0) === ".") {
n = n || "";
for (o in y) A.event.remove(e, o + n);
return;
}
n = n.split(" ");
while (o = n[f++]) {
m = o, v = null, l = o.indexOf(".") < 0, c = [], l || (c = o.split("."), o = c.shift(), h = new RegExp("(^|\\.)" + A.map(c.slice(0).sort(), V).join("\\.(?:.*\\.)?") + "(\\.|$)")), d = y[o];
if (!d) continue;
if (!r) {
for (a = 0; a < d.length; a++) {
v = d[a];
if (l || h.test(v.namespace)) A.event.remove(e, m, v.handler, a), d.splice(a--, 1);
}
continue;
}
p = A.event.special[o] || {};
for (a = i || 0; a < d.length; a++) {
v = d[a];
if (r.guid === v.guid) {
if (l || h.test(v.namespace)) i == null && d.splice(a--, 1), p.remove && p.remove.call(e, v);
if (i != null) break;
}
}
if (d.length === 0 || i != null && d.length === 1) (!p.teardown || p.teardown.call(e, c) === !1) && A.removeEvent(e, o, g.handle), s = null, delete y[o];
}
if (A.isEmptyObject(y)) {
var b = g.handle;
b && (b.elem = null), delete g.events, delete g.handle, A.isEmptyObject(g) && A.removeData(e, t, !0);
}
}
},
trigger: function(e, n, r) {
var i = e.type || e, s = arguments[3];
if (!s) {
e = typeof e == "object" ? e[A.expando] ? e : A.extend(A.Event(i), e) : A.Event(i), i.indexOf("!") >= 0 && (e.type = i = i.slice(0, -1), e.exclusive = !0), r || (e.stopPropagation(), A.event.global[i] && A.each(A.cache, function() {
var t = A.expando, r = this[t];
r && r.events && r.events[i] && A.event.trigger(e, n, r.handle.elem);
}));
if (!r || r.nodeType === 3 || r.nodeType === 8) return t;
e.result = t, e.target = r, n = A.makeArray(n), n.unshift(e);
}
e.currentTarget = r;
var o = A._data(r, "handle");
o && o.apply(r, n);
var u = r.parentNode || r.ownerDocument;
try {
r && r.nodeName && A.noData[r.nodeName.toLowerCase()] || r["on" + i] && r["on" + i].apply(r, n) === !1 && (e.result = !1, e.preventDefault());
} catch (a) {}
if (!e.isPropagationStopped() && u) A.event.trigger(e, n, u, !0); else if (!e.isDefaultPrevented()) {
var f, l = e.target, c = i.replace(R, ""), h = A.nodeName(l, "a") && c === "click", p = A.event.special[c] || {};
if ((!p._default || p._default.call(r, e) === !1) && !h && !(l && l.nodeName && A.noData[l.nodeName.toLowerCase()])) {
try {
l[c] && (f = l["on" + c], f && (l["on" + c] = null), A.event.triggered = e.type, l[c]());
} catch (d) {}
f && (l["on" + c] = f), A.event.triggered = t;
}
}
},
handle: function(n) {
var r, i, s, o, u, a = [], f = A.makeArray(arguments);
n = f[0] = A.event.fix(n || e.event), n.currentTarget = this, r = n.type.indexOf(".") < 0 && !n.exclusive, r || (s = n.type.split("."), n.type = s.shift(), a = s.slice(0).sort(), o = new RegExp("(^|\\.)" + a.join("\\.(?:.*\\.)?") + "(\\.|$)")), n.namespace = n.namespace || a.join("."), u = A._data(this, "events"), i = (u || {})[n.type];
if (u && i) {
i = i.slice(0);
for (var l = 0, c = i.length; l < c; l++) {
var h = i[l];
if (r || o.test(h.namespace)) {
n.handler = h.handler, n.data = h.data, n.handleObj = h;
var p = h.handler.apply(this, f);
p !== t && (n.result = p, p === !1 && (n.preventDefault(), n.stopPropagation()));
if (n.isImmediatePropagationStopped()) break;
}
}
}
return n.result;
},
props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix: function(e) {
if (e[A.expando]) return e;
var n = e;
e = A.Event(n);
for (var r = this.props.length, i; r; ) i = this.props[--r], e[i] = n[i];
e.target || (e.target = e.srcElement || L), e.target.nodeType === 3 && (e.target = e.target.parentNode), !e.relatedTarget && e.fromElement && (e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement);
if (e.pageX == null && e.clientX != null) {
var s = L.documentElement, o = L.body;
e.pageX = e.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = e.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0);
}
return e.which == null && (e.charCode != null || e.keyCode != null) && (e.which = e.charCode != null ? e.charCode : e.keyCode), !e.metaKey && e.ctrlKey && (e.metaKey = e.ctrlKey), !e.which && e.button !== t && (e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0), e;
},
guid: 1e8,
proxy: A.proxy,
special: {
ready: {
setup: A.bindReady,
teardown: A.noop
},
live: {
add: function(e) {
A.event.add(this, E(e.origType, e.selector), A.extend({}, e, {
handler: S,
guid: e.handler.guid
}));
},
remove: function(e) {
A.event.remove(this, E(e.origType, e.selector), e);
}
},
beforeunload: {
setup: function(e, t, n) {
A.isWindow(this) && (this.onbeforeunload = n);
},
teardown: function(e, t) {
this.onbeforeunload === t && (this.onbeforeunload = null);
}
}
}
}, A.removeEvent = L.removeEventListener ? function(e, t, n) {
e.removeEventListener && e.removeEventListener(t, n, !1);
} : function(e, t, n) {
e.detachEvent && e.detachEvent("on" + t, n);
}, A.Event = function(e) {
if (!this.preventDefault) return new A.Event(e);
e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? T : N) : this.type = e, this.timeStamp = A.now(), this[A.expando] = !0;
}, A.Event.prototype = {
preventDefault: function() {
this.isDefaultPrevented = T;
var e = this.originalEvent;
e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
},
stopPropagation: function() {
this.isPropagationStopped = T;
var e = this.originalEvent;
e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
},
stopImmediatePropagation: function() {
this.isImmediatePropagationStopped = T, this.stopPropagation();
},
isDefaultPrevented: N,
isPropagationStopped: N,
isImmediatePropagationStopped: N
};
var $ = function(e) {
var t = e.relatedTarget;
try {
if (t && t !== L && !t.parentNode) return;
while (t && t !== this) t = t.parentNode;
t !== this && (e.type = e.data, A.event.handle.apply(this, arguments));
} catch (n) {}
}, J = function(e) {
e.type = e.data, A.event.handle.apply(this, arguments);
};
A.each({
mouseenter: "mouseover",
mouseleave: "mouseout"
}, function(e, t) {
A.event.special[e] = {
setup: function(n) {
A.event.add(this, t, n && n.selector ? J : $, e);
},
teardown: function(e) {
A.event.remove(this, t, e && e.selector ? J : $);
}
};
}), A.support.submitBubbles || (A.event.special.submit = {
setup: function(e, t) {
if (!this.nodeName || this.nodeName.toLowerCase() === "form") return !1;
A.event.add(this, "click.specialSubmit", function(e) {
var t = e.target, n = t.type;
(n === "submit" || n === "image") && A(t).closest("form").length && x("submit", this, arguments);
}), A.event.add(this, "keypress.specialSubmit", function(e) {
var t = e.target, n = t.type;
(n === "text" || n === "password") && A(t).closest("form").length && e.keyCode === 13 && x("submit", this, arguments);
});
},
teardown: function(e) {
A.event.remove(this, ".specialSubmit");
}
});
if (!A.support.changeBubbles) {
var K, Q = function(e) {
var t = e.type, n = e.value;
return t === "radio" || t === "checkbox" ? n = e.checked : t === "select-multiple" ? n = e.selectedIndex > -1 ? A.map(e.options, function(e) {
return e.selected;
}).join("-") : "" : e.nodeName.toLowerCase() === "select" && (n = e.selectedIndex), n;
}, G = function(n) {
var r = n.target, i, s;
if (U.test(r.nodeName) && !r.readOnly) {
i = A._data(r, "_change_data"), s = Q(r), (n.type !== "focusout" || r.type !== "radio") && A._data(r, "_change_data", s);
if (i === t || s === i) return;
if (i != null || s) n.type = "change", n.liveFired = t, A.event.trigger(n, arguments[1], r);
}
};
A.event.special.change = {
filters: {
focusout: G,
beforedeactivate: G,
click: function(e) {
var t = e.target, n = t.type;
(n === "radio" || n === "checkbox" || t.nodeName.toLowerCase() === "select") && G.call(this, e);
},
keydown: function(e) {
var t = e.target, n = t.type;
(e.keyCode === 13 && t.nodeName.toLowerCase() !== "textarea" || e.keyCode === 32 && (n === "checkbox" || n === "radio") || n === "select-multiple") && G.call(this, e);
},
beforeactivate: function(e) {
var t = e.target;
A._data(t, "_change_data", Q(t));
}
},
setup: function(e, t) {
if (this.type === "file") return !1;
for (var n in K) A.event.add(this, n + ".specialChange", K[n]);
return U.test(this.nodeName);
},
teardown: function(e) {
return A.event.remove(this, ".specialChange"), U.test(this.nodeName);
}
}, K = A.event.special.change.filters, K.focus = K.beforeactivate;
}
L.addEventListener && A.each({
focus: "focusin",
blur: "focusout"
}, function(e, t) {
function n(e) {
var n = A.event.fix(e);
n.type = t, n.originalEvent = {}, A.event.trigger(n, null, n.target), n.isDefaultPrevented() && e.preventDefault();
}
var r = 0;
A.event.special[t] = {
setup: function() {
r++ === 0 && L.addEventListener(e, n, !0);
},
teardown: function() {
--r === 0 && L.removeEventListener(e, n, !0);
}
};
}), A.each([ "bind", "one" ], function(e, n) {
A.fn[n] = function(e, r, i) {
if (typeof e == "object") {
for (var s in e) this[n](s, r, e[s], i);
return this;
}
if (A.isFunction(r) || r === !1) i = r, r = t;
var o = n === "one" ? A.proxy(i, function(e) {
return A(this).unbind(e, o), i.apply(this, arguments);
}) : i;
if (e === "unload" && n !== "one") this.one(e, r, i); else for (var u = 0, a = this.length; u < a; u++) A.event.add(this[u], e, o, r);
return this;
};
}), A.fn.extend({
unbind: function(e, t) {
if (typeof e != "object" || e.preventDefault) for (var n = 0, r = this.length; n < r; n++) A.event.remove(this[n], e, t); else for (var i in e) this.unbind(i, e[i]);
return this;
},
delegate: function(e, t, n, r) {
return this.live(t, n, r, e);
},
undelegate: function(e, t, n) {
return arguments.length === 0 ? this.unbind("live") : this.die(t, null, n, e);
},
trigger: function(e, t) {
return this.each(function() {
A.event.trigger(e, t, this);
});
},
triggerHandler: function(e, t) {
if (this[0]) {
var n = A.Event(e);
return n.preventDefault(), n.stopPropagation(), A.event.trigger(n, t, this[0]), n.result;
}
},
toggle: function(e) {
var t = arguments, n = 1;
while (n < t.length) A.proxy(e, t[n++]);
return this.click(A.proxy(e, function(r) {
var i = (A._data(this, "lastToggle" + e.guid) || 0) % n;
return A._data(this, "lastToggle" + e.guid, i + 1), r.preventDefault(), t[i].apply(this, arguments) || !1;
}));
},
hover: function(e, t) {
return this.mouseenter(e).mouseleave(t || e);
}
});
var Y = {
focus: "focusin",
blur: "focusout",
mouseenter: "mouseover",
mouseleave: "mouseout"
};
A.each([ "live", "die" ], function(e, n) {
A.fn[n] = function(e, r, i, s) {
var o, u = 0, a, f, l, c = s || this.selector, h = s ? this : A(this.context);
if (typeof e == "object" && !e.preventDefault) {
for (var p in e) h[n](p, r, e[p], c);
return this;
}
A.isFunction(r) && (i = r, r = t), e = (e || "").split(" ");
while ((o = e[u++]) != null) {
a = R.exec(o), f = "", a && (f = a[0], o = o.replace(R, ""));
if (o === "hover") {
e.push("mouseenter" + f, "mouseleave" + f);
continue;
}
l = o, o === "focus" || o === "blur" ? (e.push(Y[o] + f), o += f) : o = (Y[o] || o) + f;
if (n === "live") for (var d = 0, v = h.length; d < v; d++) A.event.add(h[d], "live." + E(o, c), {
data: r,
selector: c,
handler: i,
origType: o,
origHandler: i,
preType: l
}); else h.unbind("live." + E(o, c), i);
}
return this;
};
}), A.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function(e, t) {
A.fn[t] = function(e, n) {
return n == null && (n = e, e = null), arguments.length > 0 ? this.bind(t, e, n) : this.trigger(t);
}, A.attrFn && (A.attrFn[t] = !0);
}), function() {
function e(e, t, n, r, i, s) {
for (var o = 0, u = r.length; o < u; o++) {
var a = r[o];
if (a) {
var f = !1;
a = a[e];
while (a) {
if (a.sizcache === n) {
f = r[a.sizset];
break;
}
if (a.nodeType === 1) {
s || (a.sizcache = n, a.sizset = o);
if (typeof t != "string") {
if (a === t) {
f = !0;
break;
}
} else if (l.filter(t, [ a ]).length > 0) {
f = a;
break;
}
}
a = a[e];
}
r[o] = f;
}
}
}
function n(e, t, n, r, i, s) {
for (var o = 0, u = r.length; o < u; o++) {
var a = r[o];
if (a) {
var f = !1;
a = a[e];
while (a) {
if (a.sizcache === n) {
f = r[a.sizset];
break;
}
a.nodeType === 1 && !s && (a.sizcache = n, a.sizset = o);
if (a.nodeName.toLowerCase() === t) {
f = a;
break;
}
a = a[e];
}
r[o] = f;
}
}
}
var r = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, i = 0, s = Object.prototype.toString, o = !1, u = !0, a = /\\/g, f = /\W/;
[ 0, 0 ].sort(function() {
return u = !1, 0;
});
var l = function(e, t, n, i) {
n = n || [], t = t || L;
var o = t;
if (t.nodeType !== 1 && t.nodeType !== 9) return [];
if (!e || typeof e != "string") return n;
var u, a, f, p, d, m, g, y, w = !0, E = l.isXML(t), S = [], x = e;
do {
r.exec(""), u = r.exec(x);
if (u) {
x = u[3], S.push(u[1]);
if (u[2]) {
p = u[3];
break;
}
}
} while (u);
if (S.length > 1 && h.exec(e)) if (S.length === 2 && c.relative[S[0]]) a = b(S[0] + S[1], t); else {
a = c.relative[S[0]] ? [ t ] : l(S.shift(), t);
while (S.length) e = S.shift(), c.relative[e] && (e += S.shift()), a = b(e, a);
} else {
!i && S.length > 1 && t.nodeType === 9 && !E && c.match.ID.test(S[0]) && !c.match.ID.test(S[S.length - 1]) && (d = l.find(S.shift(), t, E), t = d.expr ? l.filter(d.expr, d.set)[0] : d.set[0]);
if (t) {
d = i ? {
expr: S.pop(),
set: v(i)
} : l.find(S.pop(), S.length !== 1 || S[0] !== "~" && S[0] !== "+" || !t.parentNode ? t : t.parentNode, E), a = d.expr ? l.filter(d.expr, d.set) : d.set, S.length > 0 ? f = v(a) : w = !1;
while (S.length) m = S.pop(), g = m, c.relative[m] ? g = S.pop() : m = "", g == null && (g = t), c.relative[m](f, g, E);
} else f = S = [];
}
f || (f = a), f || l.error(m || e);
if (s.call(f) === "[object Array]") if (w) if (t && t.nodeType === 1) for (y = 0; f[y] != null; y++) f[y] && (f[y] === !0 || f[y].nodeType === 1 && l.contains(t, f[y])) && n.push(a[y]); else for (y = 0; f[y] != null; y++) f[y] && f[y].nodeType === 1 && n.push(a[y]); else n.push.apply(n, f); else v(f, n);
return p && (l(p, o, n, i), l.uniqueSort(n)), n;
};
l.uniqueSort = function(e) {
if (g) {
o = u, e.sort(g);
if (o) for (var t = 1; t < e.length; t++) e[t] === e[t - 1] && e.splice(t--, 1);
}
return e;
}, l.matches = function(e, t) {
return l(e, null, null, t);
}, l.matchesSelector = function(e, t) {
return l(t, null, null, [ e ]).length > 0;
}, l.find = function(e, t, n) {
var r;
if (!e) return [];
for (var i = 0, s = c.order.length; i < s; i++) {
var o, u = c.order[i];
if (o = c.leftMatch[u].exec(e)) {
var f = o[1];
o.splice(1, 1);
if (f.substr(f.length - 1) !== "\\") {
o[1] = (o[1] || "").replace(a, ""), r = c.find[u](o, t, n);
if (r != null) {
e = e.replace(c.match[u], "");
break;
}
}
}
}
return r || (r = typeof t.getElementsByTagName != "undefined" ? t.getElementsByTagName("*") : []), {
set: r,
expr: e
};
}, l.filter = function(e, n, r, i) {
var s, o, u = e, a = [], f = n, h = n && n[0] && l.isXML(n[0]);
while (e && n.length) {
for (var p in c.filter) if ((s = c.leftMatch[p].exec(e)) != null && s[2]) {
var d, v, m = c.filter[p], g = s[1];
o = !1, s.splice(1, 1);
if (g.substr(g.length - 1) === "\\") continue;
f === a && (a = []);
if (c.preFilter[p]) {
s = c.preFilter[p](s, f, r, a, i, h);
if (s) {
if (s === !0) continue;
} else o = d = !0;
}
if (s) for (var y = 0; (v = f[y]) != null; y++) if (v) {
d = m(v, s, y, f);
var b = i ^ !!d;
r && d != null ? b ? o = !0 : f[y] = !1 : b && (a.push(v), o = !0);
}
if (d !== t) {
r || (f = a), e = e.replace(c.match[p], "");
if (!o) return [];
break;
}
}
if (e === u) {
if (o != null) break;
l.error(e);
}
u = e;
}
return f;
}, l.error = function(e) {
throw "Syntax error, unrecognized expression: " + e;
};
var c = l.selectors = {
order: [ "ID", "NAME", "TAG" ],
match: {
ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
},
leftMatch: {},
attrMap: {
"class": "classes",
"for": "htmlFor"
},
attrHandle: {
href: function(e) {
return e.getAttribute("href");
},
type: function(e) {
return e.getAttribute("type");
}
},
relative: {
"+": function(e, t) {
var n = typeof t == "string", r = n && !f.test(t), i = n && !r;
r && (t = t.toLowerCase());
for (var s = 0, o = e.length, u; s < o; s++) if (u = e[s]) {
while ((u = u.previousSibling) && u.nodeType !== 1) ;
e[s] = i || u && u.nodeName.toLowerCase() === t ? u || !1 : u === t;
}
i && l.filter(t, e, !0);
},
">": function(e, t) {
var n, r = typeof t == "string", i = 0, s = e.length;
if (r && !f.test(t)) {
t = t.toLowerCase();
for (; i < s; i++) {
n = e[i];
if (n) {
var o = n.parentNode;
e[i] = o.nodeName.toLowerCase() === t ? o : !1;
}
}
} else {
for (; i < s; i++) n = e[i], n && (e[i] = r ? n.parentNode : n.parentNode === t);
r && l.filter(t, e, !0);
}
},
"": function(t, r, s) {
var o, u = i++, a = e;
typeof r == "string" && !f.test(r) && (r = r.toLowerCase(), o = r, a = n), a("parentNode", r, u, t, o, s);
},
"~": function(t, r, s) {
var o, u = i++, a = e;
typeof r == "string" && !f.test(r) && (r = r.toLowerCase(), o = r, a = n), a("previousSibling", r, u, t, o, s);
}
},
find: {
ID: function(e, t, n) {
if (typeof t.getElementById != "undefined" && !n) {
var r = t.getElementById(e[1]);
return r && r.parentNode ? [ r ] : [];
}
},
NAME: function(e, t) {
if (typeof t.getElementsByName != "undefined") {
var n = [], r = t.getElementsByName(e[1]);
for (var i = 0, s = r.length; i < s; i++) r[i].getAttribute("name") === e[1] && n.push(r[i]);
return n.length === 0 ? null : n;
}
},
TAG: function(e, t) {
if (typeof t.getElementsByTagName != "undefined") return t.getElementsByTagName(e[1]);
}
},
preFilter: {
CLASS: function(e, t, n, r, i, s) {
e = " " + e[1].replace(a, "") + " ";
if (s) return e;
for (var o = 0, u; (u = t[o]) != null; o++) u && (i ^ (u.classes && (" " + u.classes + " ").replace(/[\t\n\r]/g, " ").indexOf(e) >= 0) ? n || r.push(u) : n && (t[o] = !1));
return !1;
},
ID: function(e) {
return e[1].replace(a, "");
},
TAG: function(e, t) {
return e[1].replace(a, "").toLowerCase();
},
CHILD: function(e) {
if (e[1] === "nth") {
e[2] || l.error(e[0]), e[2] = e[2].replace(/^\+|\s*/g, "");
var t = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
e[2] = t[1] + (t[2] || 1) - 0, e[3] = t[3] - 0;
} else e[2] && l.error(e[0]);
return e[0] = i++, e;
},
ATTR: function(e, t, n, r, i, s) {
var o = e[1] = e[1].replace(a, "");
return !s && c.attrMap[o] && (e[1] = c.attrMap[o]), e[4] = (e[4] || e[5] || "").replace(a, ""), e[2] === "~=" && (e[4] = " " + e[4] + " "), e;
},
PSEUDO: function(e, t, n, i, s) {
if (e[1] === "not") {
if (!((r.exec(e[3]) || "").length > 1 || /^\w/.test(e[3]))) {
var o = l.filter(e[3], t, n, !0 ^ s);
return n || i.push.apply(i, o), !1;
}
e[3] = l(e[3], null, null, t);
} else if (c.match.POS.test(e[0]) || c.match.CHILD.test(e[0])) return !0;
return e;
},
POS: function(e) {
return e.unshift(!0), e;
}
},
filters: {
enabled: function(e) {
return e.disabled === !1 && e.type !== "hidden";
},
disabled: function(e) {
return e.disabled === !0;
},
checked: function(e) {
return e.checked === !0;
},
selected: function(e) {
return e.parentNode && e.parentNode.selectedIndex, e.selected === !0;
},
parent: function(e) {
return !!e.firstChild;
},
empty: function(e) {
return !e.firstChild;
},
has: function(e, t, n) {
return !!l(n[3], e).length;
},
header: function(e) {
return /h\d/i.test(e.nodeName);
},
text: function(e) {
var t = e.getAttribute("type"), n = e.type;
return "text" === n && (t === n || t === null);
},
radio: function(e) {
return "radio" === e.type;
},
checkbox: function(e) {
return "checkbox" === e.type;
},
file: function(e) {
return "file" === e.type;
},
password: function(e) {
return "password" === e.type;
},
submit: function(e) {
return "submit" === e.type;
},
image: function(e) {
return "image" === e.type;
},
reset: function(e) {
return "reset" === e.type;
},
button: function(e) {
return "button" === e.type || e.nodeName.toLowerCase() === "button";
},
input: function(e) {
return /input|select|textarea|button/i.test(e.nodeName);
}
},
setFilters: {
first: function(e, t) {
return t === 0;
},
last: function(e, t, n, r) {
return t === r.length - 1;
},
even: function(e, t) {
return t % 2 === 0;
},
odd: function(e, t) {
return t % 2 === 1;
},
lt: function(e, t, n) {
return t < n[3] - 0;
},
gt: function(e, t, n) {
return t > n[3] - 0;
},
nth: function(e, t, n) {
return n[3] - 0 === t;
},
eq: function(e, t, n) {
return n[3] - 0 === t;
}
},
filter: {
PSEUDO: function(e, t, n, r) {
var i = t[1], s = c.filters[i];
if (s) return s(e, n, t, r);
if (i === "contains") return (e.textContent || e.innerText || l.getText([ e ]) || "").indexOf(t[3]) >= 0;
if (i === "not") {
var o = t[3];
for (var u = 0, a = o.length; u < a; u++) if (o[u] === e) return !1;
return !0;
}
l.error(i);
},
CHILD: function(e, t) {
var n = t[1], r = e;
switch (n) {
case "only":
case "first":
while (r = r.previousSibling) if (r.nodeType === 1) return !1;
if (n === "first") return !0;
r = e;
case "last":
while (r = r.nextSibling) if (r.nodeType === 1) return !1;
return !0;
case "nth":
var i = t[2], s = t[3];
if (i === 1 && s === 0) return !0;
var o = t[0], u = e.parentNode;
if (u && (u.sizcache !== o || !e.nodeIndex)) {
var a = 0;
for (r = u.firstChild; r; r = r.nextSibling) r.nodeType === 1 && (r.nodeIndex = ++a);
u.sizcache = o;
}
var f = e.nodeIndex - s;
return i === 0 ? f === 0 : f % i === 0 && f / i >= 0;
}
},
ID: function(e, t) {
return e.nodeType === 1 && e.getAttribute("id") === t;
},
TAG: function(e, t) {
return t === "*" && e.nodeType === 1 || e.nodeName.toLowerCase() === t;
},
CLASS: function(e, t) {
return (" " + (e.classes || e.getAttribute("class")) + " ").indexOf(t) > -1;
},
ATTR: function(e, t) {
var n = t[1], r = c.attrHandle[n] ? c.attrHandle[n](e) : e[n] != null ? e[n] : e.getAttribute(n), i = r + "", s = t[2], o = t[4];
return r == null ? s === "!=" : s === "=" ? i === o : s === "*=" ? i.indexOf(o) >= 0 : s === "~=" ? (" " + i + " ").indexOf(o) >= 0 : o ? s === "!=" ? i !== o : s === "^=" ? i.indexOf(o) === 0 : s === "$=" ? i.substr(i.length - o.length) === o : s === "|=" ? i === o || i.substr(0, o.length + 1) === o + "-" : !1 : i && r !== !1;
},
POS: function(e, t, n, r) {
var i = t[2], s = c.setFilters[i];
if (s) return s(e, n, t, r);
}
}
}, h = c.match.POS, p = function(e, t) {
return "\\" + (t - 0 + 1);
};
for (var d in c.match) c.match[d] = new RegExp(c.match[d].source + /(?![^\[]*\])(?![^\(]*\))/.source), c.leftMatch[d] = new RegExp(/(^(?:.|\r|\n)*?)/.source + c.match[d].source.replace(/\\(\d+)/g, p));
var v = function(e, t) {
return e = Array.prototype.slice.call(e, 0), t ? (t.push.apply(t, e), t) : e;
};
try {
Array.prototype.slice.call(L.documentElement.childNodes, 0)[0].nodeType;
} catch (m) {
v = function(e, t) {
var n = 0, r = t || [];
if (s.call(e) === "[object Array]") Array.prototype.push.apply(r, e); else if (typeof e.length == "number") for (var i = e.length; n < i; n++) r.push(e[n]); else for (; e[n]; n++) r.push(e[n]);
return r;
};
}
var g, y;
L.documentElement.compareDocumentPosition ? g = function(e, t) {
return e === t ? (o = !0, 0) : !e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition ? -1 : 1 : e.compareDocumentPosition(t) & 4 ? -1 : 1;
} : (g = function(e, t) {
var n, r, i = [], s = [], u = e.parentNode, a = t.parentNode, f = u;
if (e === t) return o = !0, 0;
if (u === a) return y(e, t);
if (!u) return -1;
if (!a) return 1;
while (f) i.unshift(f), f = f.parentNode;
f = a;
while (f) s.unshift(f), f = f.parentNode;
n = i.length, r = s.length;
for (var l = 0; l < n && l < r; l++) if (i[l] !== s[l]) return y(i[l], s[l]);
return l === n ? y(e, s[l], -1) : y(i[l], t, 1);
}, y = function(e, t, n) {
if (e === t) return n;
var r = e.nextSibling;
while (r) {
if (r === t) return -1;
r = r.nextSibling;
}
return 1;
}), l.getText = function(e) {
var t = "", n;
for (var r = 0; e[r]; r++) n = e[r], n.nodeType === 3 || n.nodeType === 4 ? t += n.nodeValue : n.nodeType !== 8 && (t += l.getText(n.childNodes));
return t;
}, function() {
var e = L.createElement("div"), n = "script" + (new Date).getTime(), r = L.documentElement;
e.innerHTML = "<a name='" + n + "'/>", r.insertBefore(e, r.firstChild), L.getElementById(n) && (c.find.ID = function(e, n, r) {
if (typeof n.getElementById != "undefined" && !r) {
var i = n.getElementById(e[1]);
return i ? i.id === e[1] || typeof i.getAttributeNode != "undefined" && i.getAttributeNode("id").nodeValue === e[1] ? [ i ] : t : [];
}
}, c.filter.ID = function(e, t) {
var n = typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id");
return e.nodeType === 1 && n && n.nodeValue === t;
}), r.removeChild(e), r = e = null;
}(), function() {
var e = L.createElement("div");
e.appendChild(L.createComment("")), e.getElementsByTagName("*").length > 0 && (c.find.TAG = function(e, t) {
var n = t.getElementsByTagName(e[1]);
if (e[1] === "*") {
var r = [];
for (var i = 0; n[i]; i++) n[i].nodeType === 1 && r.push(n[i]);
n = r;
}
return n;
}), e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute != "undefined" && e.firstChild.getAttribute("href") !== "#" && (c.attrHandle.href = function(e) {
return e.getAttribute("href", 2);
}), e = null;
}(), L.querySelectorAll && function() {
var e = l, t = L.createElement("div"), n = "__sizzle__";
t.innerHTML = "<p class='TEST'></p>";
if (!t.querySelectorAll || t.querySelectorAll(".TEST").length !== 0) {
l = function(t, r, i, s) {
r = r || L;
if (!s && !l.isXML(r)) {
var o = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(t);
if (o && (r.nodeType === 1 || r.nodeType === 9)) {
if (o[1]) return v(r.getElementsByTagName(t), i);
if (o[2] && c.find.CLASS && r.getElementsByClassName) return v(r.getElementsByClassName(o[2]), i);
}
if (r.nodeType === 9) {
if (t === "body" && r.body) return v([ r.body ], i);
if (o && o[3]) {
var u = r.getElementById(o[3]);
if (!u || !u.parentNode) return v([], i);
if (u.id === o[3]) return v([ u ], i);
}
try {
return v(r.querySelectorAll(t), i);
} catch (a) {}
} else if (r.nodeType === 1 && r.nodeName.toLowerCase() !== "object") {
var f = r, h = r.getAttribute("id"), p = h || n, d = r.parentNode, m = /^\s*[+~]/.test(t);
h ? p = p.replace(/'/g, "\\$&") : r.setAttribute("id", p), m && d && (r = r.parentNode);
try {
if (!m || d) return v(r.querySelectorAll("[id='" + p + "'] " + t), i);
} catch (g) {} finally {
h || f.removeAttribute("id");
}
}
}
return e(t, r, i, s);
};
for (var r in e) l[r] = e[r];
t = null;
}
}(), function() {
var e = L.documentElement, t = e.matchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.msMatchesSelector;
if (t) {
var n = !t.call(L.createElement("div"), "div"), r = !1;
try {
t.call(L.documentElement, "[test!='']:sizzle");
} catch (i) {
r = !0;
}
l.matchesSelector = function(e, i) {
i = i.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
if (!l.isXML(e)) try {
if (r || !c.match.PSEUDO.test(i) && !/!=/.test(i)) {
var s = t.call(e, i);
if (s || !n || e.document && e.document.nodeType !== 11) return s;
}
} catch (o) {}
return l(i, null, null, [ e ]).length > 0;
};
}
}(), function() {
var e = L.createElement("div");
e.innerHTML = "<div class='test e'></div><div class='test'></div>";
if (e.getElementsByClassName && e.getElementsByClassName("e").length !== 0) {
e.lastChild.classes = "e";
if (e.getElementsByClassName("e").length === 1) return;
c.order.splice(1, 0, "CLASS"), c.find.CLASS = function(e, t, n) {
if (typeof t.getElementsByClassName != "undefined" && !n) return t.getElementsByClassName(e[1]);
}, e = null;
}
}(), L.documentElement.contains ? l.contains = function(e, t) {
return e !== t && (e.contains ? e.contains(t) : !0);
} : L.documentElement.compareDocumentPosition ? l.contains = function(e, t) {
return !!(e.compareDocumentPosition(t) & 16);
} : l.contains = function() {
return !1;
}, l.isXML = function(e) {
var t = (e ? e.ownerDocument || e : 0).documentElement;
return t ? t.nodeName !== "HTML" : !1;
};
var b = function(e, t) {
var n, r = [], i = "", s = t.nodeType ? [ t ] : t;
while (n = c.match.PSEUDO.exec(e)) i += n[0], e = e.replace(c.match.PSEUDO, "");
e = c.relative[e] ? e + "*" : e;
for (var o = 0, u = s.length; o < u; o++) l(e, s[o], r);
return l.filter(i, r);
};
A.find = l, A.expr = l.selectors, A.expr[":"] = A.expr.filters, A.unique = l.uniqueSort, A.text = l.getText, A.isXMLDoc = l.isXML, A.contains = l.contains;
}();
var Z = /Until$/, et = /^(?:parents|prevUntil|prevAll)/, tt = /,/, nt = /^.[^:#\[\.,]*$/, rt = Array.prototype.slice, it = A.expr.match.POS, st = {
children: !0,
contents: !0,
next: !0,
prev: !0
};
A.fn.extend({
find: function(e) {
var t = this.pushStack("", "find", e), n = 0;
for (var r = 0, i = this.length; r < i; r++) {
n = t.length, A.find(e, this[r], t);
if (r > 0) for (var s = n; s < t.length; s++) for (var o = 0; o < n; o++) if (t[o] === t[s]) {
t.splice(s--, 1);
break;
}
}
return t;
},
has: function(e) {
var t = A(e);
return this.filter(function() {
for (var e = 0, n = t.length; e < n; e++) if (A.contains(this, t[e])) return !0;
});
},
not: function(e) {
return this.pushStack(b(this, e, !1), "not", e);
},
filter: function(e) {
return this.pushStack(b(this, e, !0), "filter", e);
},
is: function(e) {
return !!e && A.filter(e, this).length > 0;
},
closest: function(e, t) {
var n = [], r, i, s = this[0];
if (A.isArray(e)) {
var o, u, a = {}, f = 1;
if (s && e.length) {
for (r = 0, i = e.length; r < i; r++) u = e[r], a[u] || (a[u] = A.expr.match.POS.test(u) ? A(u, t || this.context) : u);
while (s && s.ownerDocument && s !== t) {
for (u in a) o = a[u], (o.jquery ? o.index(s) > -1 : A(s).is(o)) && n.push({
selector: u,
elem: s,
level: f
});
s = s.parentNode, f++;
}
}
return n;
}
var l = it.test(e) ? A(e, t || this.context) : null;
for (r = 0, i = this.length; r < i; r++) {
s = this[r];
while (s) {
if (l ? l.index(s) > -1 : A.find.matchesSelector(s, e)) {
n.push(s);
break;
}
s = s.parentNode;
if (!s || !s.ownerDocument || s === t) break;
}
}
return n = n.length > 1 ? A.unique(n) : n, this.pushStack(n, "closest", e);
},
index: function(e) {
return !e || typeof e == "string" ? A.inArray(this[0], e ? A(e) : this.parent().children()) : A.inArray(e.jquery ? e[0] : e, this);
},
add: function(e, t) {
var n = typeof e == "string" ? A(e, t) : A.makeArray(e), r = A.merge(this.get(), n);
return this.pushStack(w(n[0]) || w(r[0]) ? r : A.unique(r));
},
andSelf: function() {
return this.add(this.prevObject);
}
}), A.each({
parent: function(e) {
var t = e.parentNode;
return t && t.nodeType !== 11 ? t : null;
},
parents: function(e) {
return A.dir(e, "parentNode");
},
parentsUntil: function(e, t, n) {
return A.dir(e, "parentNode", n);
},
next: function(e) {
return A.nth(e, 2, "nextSibling");
},
prev: function(e) {
return A.nth(e, 2, "previousSibling");
},
nextAll: function(e) {
return A.dir(e, "nextSibling");
},
prevAll: function(e) {
return A.dir(e, "previousSibling");
},
nextUntil: function(e, t, n) {
return A.dir(e, "nextSibling", n);
},
prevUntil: function(e, t, n) {
return A.dir(e, "previousSibling", n);
},
siblings: function(e) {
return A.sibling(e.parentNode.firstChild, e);
},
children: function(e) {
return A.sibling(e.firstChild);
},
contents: function(e) {
return A.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : A.makeArray(e.childNodes);
}
}, function(e, t) {
A.fn[e] = function(n, r) {
var i = A.map(this, t, n), s = rt.call(arguments);
return Z.test(e) || (r = n), r && typeof r == "string" && (i = A.filter(r, i)), i = this.length > 1 && !st[e] ? A.unique(i) : i, (this.length > 1 || tt.test(r)) && et.test(e) && (i = i.reverse()), this.pushStack(i, e, s.join(","));
};
}), A.extend({
filter: function(e, t, n) {
return n && (e = ":not(" + e + ")"), t.length === 1 ? A.find.matchesSelector(t[0], e) ? [ t[0] ] : [] : A.find.matches(e, t);
},
dir: function(e, n, r) {
var i = [], s = e[n];
while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !A(s).is(r))) s.nodeType === 1 && i.push(s), s = s[n];
return i;
},
nth: function(e, t, n, r) {
t = t || 1;
var i = 0;
for (; e; e = e[n]) if (e.nodeType === 1 && ++i === t) break;
return e;
},
sibling: function(e, t) {
var n = [];
for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
return n;
}
});
var ot = / jQuery\d+="(?:\d+|null)"/g, ut = /^\s+/, at = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, ft = /<([\w:]+)/, lt = /<tbody/i, ct = /<|&#?\w+;/, ht = /<(?:script|object|embed|option|style)/i, pt = /checked\s*(?:[^=]|=\s*.checked.)/i, dt = {
option: [ 1, "<select multiple='multiple'>", "</select>" ],
legend: [ 1, "<fieldset>", "</fieldset>" ],
thead: [ 1, "<table>", "</table>" ],
tr: [ 2, "<table><tbody>", "</tbody></table>" ],
td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
area: [ 1, "<map>", "</map>" ],
_default: [ 0, "", "" ]
};
dt.optgroup = dt.option, dt.tbody = dt.tfoot = dt.colgroup = dt.caption = dt.thead, dt.th = dt.td, A.support.htmlSerialize || (dt._default = [ 1, "div<div>", "</div>" ]), A.fn.extend({
text: function(e) {
return A.isFunction(e) ? this.each(function(t) {
var n = A(this);
n.text(e.call(this, t, n.text()));
}) : typeof e != "object" && e !== t ? this.empty().append((this[0] && this[0].ownerDocument || L).createTextNode(e)) : A.text(this);
},
wrapAll: function(e) {
if (A.isFunction(e)) return this.each(function(t) {
A(this).wrapAll(e.call(this, t));
});
if (this[0]) {
var t = A(e, this[0].ownerDocument).eq(0).clone(!0);
this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
var e = this;
while (e.firstChild && e.firstChild.nodeType === 1) e = e.firstChild;
return e;
}).append(this);
}
return this;
},
wrapInner: function(e) {
return A.isFunction(e) ? this.each(function(t) {
A(this).wrapInner(e.call(this, t));
}) : this.each(function() {
var t = A(this), n = t.contents();
n.length ? n.wrapAll(e) : t.append(e);
});
},
wrap: function(e) {
return this.each(function() {
A(this).wrapAll(e);
});
},
unwrap: function() {
return this.parent().each(function() {
A.nodeName(this, "body") || A(this).replaceWith(this.childNodes);
}).end();
},
append: function() {
return this.domManip(arguments, !0, function(e) {
this.nodeType === 1 && this.appendChild(e);
});
},
prepend: function() {
return this.domManip(arguments, !0, function(e) {
this.nodeType === 1 && this.insertBefore(e, this.firstChild);
});
},
before: function() {
if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(e) {
this.parentNode.insertBefore(e, this);
});
if (arguments.length) {
var e = A(arguments[0]);
return e.push.apply(e, this.toArray()), this.pushStack(e, "before", arguments);
}
},
after: function() {
if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(e) {
this.parentNode.insertBefore(e, this.nextSibling);
});
if (arguments.length) {
var e = this.pushStack(this, "after", arguments);
return e.push.apply(e, A(arguments[0]).toArray()), e;
}
},
remove: function(e, t) {
for (var n = 0, r; (r = this[n]) != null; n++) if (!e || A.filter(e, [ r ]).length) !t && r.nodeType === 1 && (A.cleanData(r.getElementsByTagName("*")), A.cleanData([ r ])), r.parentNode && r.parentNode.removeChild(r);
return this;
},
empty: function() {
for (var e = 0, t; (t = this[e]) != null; e++) {
t.nodeType === 1 && A.cleanData(t.getElementsByTagName("*"));
while (t.firstChild) t.removeChild(t.firstChild);
}
return this;
},
clone: function(e, t) {
return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
return A.clone(this, e, t);
});
},
html: function(e) {
if (e === t) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(ot, "") : null;
if (typeof e != "string" || ht.test(e) || !A.support.leadingWhitespace && ut.test(e) || dt[(ft.exec(e) || [ "", "" ])[1].toLowerCase()]) A.isFunction(e) ? this.each(function(t) {
var n = A(this);
n.html(e.call(this, t, n.html()));
}) : this.empty().append(e); else {
e = e.replace(at, "<$1></$2>");
try {
for (var n = 0, r = this.length; n < r; n++) this[n].nodeType === 1 && (A.cleanData(this[n].getElementsByTagName("*")), this[n].innerHTML = e);
} catch (i) {
this.empty().append(e);
}
}
return this;
},
replaceWith: function(e) {
return this[0] && this[0].parentNode ? A.isFunction(e) ? this.each(function(t) {
var n = A(this), r = n.html();
n.replaceWith(e.call(this, t, r));
}) : (typeof e != "string" && (e = A(e).detach()), this.each(function() {
var t = this.nextSibling, n = this.parentNode;
A(this).remove(), t ? A(t).before(e) : A(n).append(e);
})) : this.length ? this.pushStack(A(A.isFunction(e) ? e() : e), "replaceWith", e) : this;
},
detach: function(e) {
return this.remove(e, !0);
},
domManip: function(e, n, r) {
var i, s, o, u, a = e[0], f = [];
if (!A.support.checkClone && arguments.length === 3 && typeof a == "string" && pt.test(a)) return this.each(function() {
A(this).domManip(e, n, r, !0);
});
if (A.isFunction(a)) return this.each(function(i) {
var s = A(this);
e[0] = a.call(this, i, n ? s.html() : t), s.domManip(e, n, r);
});
if (this[0]) {
u = a && a.parentNode, A.support.parentNode && u && u.nodeType === 11 && u.childNodes.length === this.length ? i = {
fragment: u
} : i = A.buildFragment(e, this, f), o = i.fragment, o.childNodes.length === 1 ? s = o = o.firstChild : s = o.firstChild;
if (s) {
n = n && A.nodeName(s, "tr");
for (var l = 0, c = this.length, h = c - 1; l < c; l++) r.call(n ? y(this[l], s) : this[l], i.cacheable || c > 1 && l < h ? A.clone(o, !0, !0) : o);
}
f.length && A.each(f, d);
}
return this;
}
}), A.buildFragment = function(e, t, n) {
var r, i, s, o = t && t[0] ? t[0].ownerDocument || t[0] : L;
return e.length === 1 && typeof e[0] == "string" && e[0].length < 512 && o === L && e[0].charAt(0) === "<" && !ht.test(e[0]) && (A.support.checkClone || !pt.test(e[0])) && (i = !0, s = A.fragments[e[0]], s && s !== 1 && (r = s)), r || (r = o.createDocumentFragment(), A.clean(e, o, r, n)), i && (A.fragments[e[0]] = s ? r : 1), {
fragment: r,
cacheable: i
};
}, A.fragments = {}, A.each({
appendTo: "append",
prependTo: "prepend",
insertBefore: "before",
insertAfter: "after",
replaceAll: "replaceWith"
}, function(e, t) {
A.fn[e] = function(n) {
var r = [], i = A(n), s = this.length === 1 && this[0].parentNode;
if (s && s.nodeType === 11 && s.childNodes.length === 1 && i.length === 1) return i[t](this[0]), this;
for (var o = 0, u = i.length; o < u; o++) {
var a = (o > 0 ? this.clone(!0) : this).get();
A(i[o])[t](a), r = r.concat(a);
}
return this.pushStack(r, e, i.selector);
};
}), A.extend({
clone: function(e, t, n) {
var r = e.cloneNode(!0), i, s, o;
if ((!A.support.noCloneEvent || !A.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !A.isXMLDoc(e)) {
m(e, r), i = v(e), s = v(r);
for (o = 0; i[o]; ++o) m(i[o], s[o]);
}
if (t) {
g(e, r);
if (n) {
i = v(e), s = v(r);
for (o = 0; i[o]; ++o) g(i[o], s[o]);
}
}
return r;
},
clean: function(e, t, n, r) {
t = t || L, typeof t.createElement == "undefined" && (t = t.ownerDocument || t[0] && t[0].ownerDocument || L);
var i = [];
for (var s = 0, o; (o = e[s]) != null; s++) {
typeof o == "number" && (o += "");
if (!o) continue;
if (typeof o != "string" || ct.test(o)) {
if (typeof o == "string") {
o = o.replace(at, "<$1></$2>");
var u = (ft.exec(o) || [ "", "" ])[1].toLowerCase(), a = dt[u] || dt._default, f = a[0], l = t.createElement("div");
l.innerHTML = a[1] + o + a[2];
while (f--) l = l.lastChild;
if (!A.support.tbody) {
var c = lt.test(o), h = u === "table" && !c ? l.firstChild && l.firstChild.childNodes : a[1] === "<table>" && !c ? l.childNodes : [];
for (var p = h.length - 1; p >= 0; --p) A.nodeName(h[p], "tbody") && !h[p].childNodes.length && h[p].parentNode.removeChild(h[p]);
}
!A.support.leadingWhitespace && ut.test(o) && l.insertBefore(t.createTextNode(ut.exec(o)[0]), l.firstChild), o = l.childNodes;
}
} else o = t.createTextNode(o);
o.nodeType ? i.push(o) : i = A.merge(i, o);
}
if (n) for (s = 0; i[s]; s++) !r || !A.nodeName(i[s], "script") || i[s].type && i[s].type.toLowerCase() !== "text/javascript" ? (i[s].nodeType === 1 && i.splice.apply(i, [ s + 1, 0 ].concat(A.makeArray(i[s].getElementsByTagName("script")))), n.appendChild(i[s])) : r.push(i[s].parentNode ? i[s].parentNode.removeChild(i[s]) : i[s]);
return i;
},
cleanData: function(e) {
var t, n, r = A.cache, i = A.expando, s = A.event.special, o = A.support.deleteExpando;
for (var u = 0, a; (a = e[u]) != null; u++) {
if (a.nodeName && A.noData[a.nodeName.toLowerCase()]) continue;
n = a[A.expando];
if (n) {
t = r[n] && r[n][i];
if (t && t.events) {
for (var f in t.events) s[f] ? A.event.remove(a, f) : A.removeEvent(a, f, t.handle);
t.handle && (t.handle.elem = null);
}
o ? delete a[A.expando] : a.removeAttribute && a.removeAttribute(A.expando), delete r[n];
}
}
}
});
var vt = /alpha\([^)]*\)/i, mt = /opacity=([^)]*)/, gt = /-([a-z])/ig, yt = /([A-Z]|^ms)/g, bt = /^-?\d+(?:px)?$/i, wt = /^-?\d/, Et = {
position: "absolute",
visibility: "hidden",
display: "block"
}, St = [ "Left", "Right" ], xt = [ "Top", "Bottom" ], Tt, Nt, Ct, kt = function(e, t) {
return t.toUpperCase();
};
A.fn.css = function(e, n) {
return arguments.length === 2 && n === t ? this : A.access(this, e, n, !0, function(e, n, r) {
return r !== t ? A.style(e, n, r) : A.css(e, n);
});
}, A.extend({
cssHooks: {
opacity: {
get: function(e, t) {
if (t) {
var n = Tt(e, "opacity", "opacity");
return n === "" ? "1" : n;
}
return e.style.opacity;
}
}
},
cssNumber: {
zIndex: !0,
fontWeight: !0,
opacity: !0,
zoom: !0,
lineHeight: !0
},
cssProps: {
"float": A.support.cssFloat ? "cssFloat" : "styleFloat"
},
style: function(e, n, r, i) {
if (e && e.nodeType !== 3 && e.nodeType !== 8 && e.style) {
var s, o = A.camelCase(n), u = e.style, a = A.cssHooks[o];
n = A.cssProps[o] || o;
if (r === t) return a && "get" in a && (s = a.get(e, !1, i)) !== t ? s : u[n];
if (typeof r == "number" && isNaN(r) || r == null) return;
typeof r == "number" && !A.cssNumber[o] && (r += "px");
if (!a || !("set" in a) || (r = a.set(e, r)) !== t) try {
u[n] = r;
} catch (f) {}
}
},
css: function(e, n, r) {
var i, s = A.camelCase(n), o = A.cssHooks[s];
n = A.cssProps[s] || s;
if (o && "get" in o && (i = o.get(e, !0, r)) !== t) return i;
if (Tt) return Tt(e, n, s);
},
swap: function(e, t, n) {
var r = {};
for (var i in t) r[i] = e.style[i], e.style[i] = t[i];
n.call(e);
for (i in t) e.style[i] = r[i];
},
camelCase: function(e) {
return e.replace(gt, kt);
}
}), A.curCSS = A.css, A.each([ "height", "width" ], function(e, t) {
A.cssHooks[t] = {
get: function(e, n, r) {
var i;
if (n) {
e.offsetWidth !== 0 ? i = p(e, t, r) : A.swap(e, Et, function() {
i = p(e, t, r);
});
if (i <= 0) {
i = Tt(e, t, t), i === "0px" && Ct && (i = Ct(e, t, t));
if (i != null) return i === "" || i === "auto" ? "0px" : i;
}
return i < 0 || i == null ? (i = e.style[t], i === "" || i === "auto" ? "0px" : i) : typeof i == "string" ? i : i + "px";
}
},
set: function(e, t) {
if (!bt.test(t)) return t;
t = parseFloat(t);
if (t >= 0) return t + "px";
}
};
}), A.support.opacity || (A.cssHooks.opacity = {
get: function(e, t) {
return mt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : t ? "1" : "";
},
set: function(e, t) {
var n = e.style;
n.zoom = 1;
var r = A.isNaN(t) ? "" : "alpha(opacity=" + t * 100 + ")", i = n.filter || "";
n.filter = vt.test(i) ? i.replace(vt, r) : n.filter + " " + r;
}
}), A(function() {
A.support.reliableMarginRight || (A.cssHooks.marginRight = {
get: function(e, t) {
var n;
return A.swap(e, {
display: "inline-block"
}, function() {
t ? n = Tt(e, "margin-right", "marginRight") : n = e.style.marginRight;
}), n;
}
});
}), L.defaultView && L.defaultView.getComputedStyle && (Nt = function(e, n, r) {
var i, s, o;
r = r.replace(yt, "-$1").toLowerCase();
if (!(s = e.ownerDocument.defaultView)) return t;
if (o = s.getComputedStyle(e, null)) i = o.getPropertyValue(r), i === "" && !A.contains(e.ownerDocument.documentElement, e) && (i = A.style(e, r));
return i;
}), L.documentElement.currentStyle && (Ct = function(e, t) {
var n, r = e.currentStyle && e.currentStyle[t], i = e.runtimeStyle && e.runtimeStyle[t], s = e.style;
return !bt.test(r) && wt.test(r) && (n = s.left, i && (e.runtimeStyle.left = e.currentStyle.left), s.left = t === "fontSize" ? "1em" : r || 0, r = s.pixelLeft + "px", s.left = n, i && (e.runtimeStyle.left = i)), r === "" ? "auto" : r;
}), Tt = Nt || Ct, A.expr && A.expr.filters && (A.expr.filters.hidden = function(e) {
var t = e.offsetWidth, n = e.offsetHeight;
return t === 0 && n === 0 || !A.support.reliableHiddenOffsets && (e.style.display || A.css(e, "display")) === "none";
}, A.expr.filters.visible = function(e) {
return !A.expr.filters.hidden(e);
});
var Lt = /%20/g, At = /\[\]$/, Ot = /\r?\n/g, Mt = /#.*$/, _t = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, Dt = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, Pt = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/, Ht = /^(?:GET|HEAD)$/, Bt = /^\/\//, jt = /\?/, Ft = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, It = /^(?:select|textarea)/i, qt = /\s+/, Rt = /([?&])_=[^&]*/, Ut = /(^|\-)([a-z])/g, zt = function(e, t, n) {
return t + n.toUpperCase();
}, Wt = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, Xt = A.fn.load, Vt = {}, $t = {}, Jt, Kt;
try {
Jt = L.location.href;
} catch (Qt) {
Jt = L.createElement("a"), Jt.href = "", Jt = Jt.href;
}
Kt = Wt.exec(Jt.toLowerCase()) || [], A.fn.extend({
load: function(e, n, r) {
if (typeof e != "string" && Xt) return Xt.apply(this, arguments);
if (!this.length) return this;
var i = e.indexOf(" ");
if (i >= 0) {
var s = e.slice(i, e.length);
e = e.slice(0, i);
}
var o = "GET";
n && (A.isFunction(n) ? (r = n, n = t) : typeof n == "object" && (n = A.param(n, A.ajaxSettings.traditional), o = "POST"));
var u = this;
return A.ajax({
url: e,
type: o,
dataType: "html",
data: n,
complete: function(e, t, n) {
n = e.responseText, e.isResolved() && (e.done(function(e) {
n = e;
}), u.html(s ? A("<div>").append(n.replace(Ft, "")).find(s) : n)), r && u.each(r, [ n, t, e ]);
}
}), this;
},
serialize: function() {
return A.param(this.serializeArray());
},
serializeArray: function() {
return this.map(function() {
return this.elements ? A.makeArray(this.elements) : this;
}).filter(function() {
return this.name && !this.disabled && (this.checked || It.test(this.nodeName) || Dt.test(this.type));
}).map(function(e, t) {
var n = A(this).val();
return n == null ? null : A.isArray(n) ? A.map(n, function(e, n) {
return {
name: t.name,
value: e.replace(Ot, "\r\n")
};
}) : {
name: t.name,
value: n.replace(Ot, "\r\n")
};
}).get();
}
}), A.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
A.fn[t] = function(e) {
return this.bind(t, e);
};
}), A.each([ "get", "post" ], function(e, n) {
A[n] = function(e, r, i, s) {
return A.isFunction(r) && (s = s || i, i = r, r = t), A.ajax({
type: n,
url: e,
data: r,
success: i,
dataType: s
});
};
}), A.extend({
getScript: function(e, n) {
return A.get(e, t, n, "script");
},
getJSON: function(e, t, n) {
return A.get(e, t, n, "json");
},
ajaxSetup: function(e, t) {
t ? A.extend(!0, e, A.ajaxSettings, t) : (t = e, e = A.extend(!0, A.ajaxSettings, t));
for (var n in {
context: 1,
url: 1
}) n in t ? e[n] = t[n] : n in A.ajaxSettings && (e[n] = A.ajaxSettings[n]);
return e;
},
ajaxSettings: {
url: Jt,
isLocal: Pt.test(Kt[1]),
global: !0,
type: "GET",
contentType: "application/x-www-form-urlencoded",
processData: !0,
async: !0,
accepts: {
xml: "application/xml, text/xml",
html: "text/html",
text: "text/plain",
json: "application/json, text/javascript",
"*": "*/*"
},
contents: {
xml: /xml/,
html: /html/,
json: /json/
},
responseFields: {
xml: "responseXML",
text: "responseText"
},
converters: {
"* text": e.String,
"text html": !0,
"text json": A.parseJSON,
"text xml": A.parseXML
}
},
ajaxPrefilter: h(Vt),
ajaxTransport: h($t),
ajax: function(e, n) {
function r(e, n, r, c) {
if (w !== 2) {
w = 2, y && clearTimeout(y), g = t, v = c || "", x.readyState = e ? 4 : 0;
var d, m, b, S = r ? f(i, x, r) : t, T, N;
if (e >= 200 && e < 300 || e === 304) {
if (i.ifModified) {
if (T = x.getResponseHeader("Last-Modified")) A.lastModified[p] = T;
if (N = x.getResponseHeader("Etag")) A.etag[p] = N;
}
if (e === 304) n = "notmodified", d = !0; else try {
m = a(i, S), n = "success", d = !0;
} catch (C) {
n = "parsererror", b = C;
}
} else {
b = n;
if (!n || e) n = "error", e < 0 && (e = 0);
}
x.status = e, x.statusText = n, d ? u.resolveWith(s, [ m, n, x ]) : u.rejectWith(s, [ x, n, b ]), x.statusCode(h), h = t, E && o.trigger("ajax" + (d ? "Success" : "Error"), [ x, i, d ? m : b ]), l.resolveWith(s, [ x, n ]), E && (o.trigger("ajaxComplete", [ x, i ]), --A.active || A.event.trigger("ajaxStop"));
}
}
typeof e == "object" && (n = e, e = t), n = n || {};
var i = A.ajaxSetup({}, n), s = i.context || i, o = s !== i && (s.nodeType || s instanceof A) ? A(s) : A.event, u = A.Deferred(), l = A._Deferred(), h = i.statusCode || {}, p, d = {}, v, m, g, y, b, w = 0, E, S, x = {
readyState: 0,
setRequestHeader: function(e, t) {
return w || (d[e.toLowerCase().replace(Ut, zt)] = t), this;
},
getAllResponseHeaders: function() {
return w === 2 ? v : null;
},
getResponseHeader: function(e) {
var n;
if (w === 2) {
if (!m) {
m = {};
while (n = _t.exec(v)) m[n[1].toLowerCase()] = n[2];
}
n = m[e.toLowerCase()];
}
return n === t ? null : n;
},
overrideMimeType: function(e) {
return w || (i.mimeType = e), this;
},
abort: function(e) {
return e = e || "abort", g && g.abort(e), r(0, e), this;
}
};
u.promise(x), x.success = x.done, x.error = x.fail, x.complete = l.done, x.statusCode = function(e) {
if (e) {
var t;
if (w < 2) for (t in e) h[t] = [ h[t], e[t] ]; else t = e[x.status], x.then(t, t);
}
return this;
}, i.url = ((e || i.url) + "").replace(Mt, "").replace(Bt, Kt[1] + "//"), i.dataTypes = A.trim(i.dataType || "*").toLowerCase().split(qt), i.crossDomain == null && (b = Wt.exec(i.url.toLowerCase()), i.crossDomain = b && (b[1] != Kt[1] || b[2] != Kt[2] || (b[3] || (b[1] === "http:" ? 80 : 443)) != (Kt[3] || (Kt[1] === "http:" ? 80 : 443)))), i.data && i.processData && typeof i.data != "string" && (i.data = A.param(i.data, i.traditional)), c(Vt, i, n, x);
if (w === 2) return !1;
E = i.global, i.type = i.type.toUpperCase(), i.hasContent = !Ht.test(i.type), E && A.active++ === 0 && A.event.trigger("ajaxStart");
if (!i.hasContent) {
i.data && (i.url += (jt.test(i.url) ? "&" : "?") + i.data), p = i.url;
if (i.cache === !1) {
var T = A.now(), N = i.url.replace(Rt, "$1_=" + T);
i.url = N + (N === i.url ? (jt.test(i.url) ? "&" : "?") + "_=" + T : "");
}
}
if (i.data && i.hasContent && i.contentType !== !1 || n.contentType) d["Content-Type"] = i.contentType;
i.ifModified && (p = p || i.url, A.lastModified[p] && (d["If-Modified-Since"] = A.lastModified[p]), A.etag[p] && (d["If-None-Match"] = A.etag[p])), d.Accept = i.dataTypes[0] && i.accepts[i.dataTypes[0]] ? i.accepts[i.dataTypes[0]] + (i.dataTypes[0] !== "*" ? ", */*; q=0.01" : "") : i.accepts["*"];
for (S in i.headers) x.setRequestHeader(S, i.headers[S]);
if (!i.beforeSend || i.beforeSend.call(s, x, i) !== !1 && w !== 2) {
for (S in {
success: 1,
error: 1,
complete: 1
}) x[S](i[S]);
g = c($t, i, n, x);
if (g) {
x.readyState = 1, E && o.trigger("ajaxSend", [ x, i ]), i.async && i.timeout > 0 && (y = setTimeout(function() {
x.abort("timeout");
}, i.timeout));
try {
w = 1, g.send(d, r);
} catch (C) {
status < 2 ? r(-1, C) : A.error(C);
}
} else r(-1, "No Transport");
return x;
}
return x.abort(), !1;
},
param: function(e, n) {
var r = [], i = function(e, t) {
t = A.isFunction(t) ? t() : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
};
n === t && (n = A.ajaxSettings.traditional);
if (A.isArray(e) || e.jquery && !A.isPlainObject(e)) A.each(e, function() {
i(this.name, this.value);
}); else for (var s in e) l(s, e[s], n, i);
return r.join("&").replace(Lt, "+");
}
}), A.extend({
active: 0,
lastModified: {},
etag: {}
});
var Gt = A.now(), Yt = /(\=)\?(&|$)|\?\?/i;
A.ajaxSetup({
jsonp: "callback",
jsonpCallback: function() {
return A.expando + "_" + Gt++;
}
}), A.ajaxPrefilter("json jsonp", function(t, n, r) {
var i = typeof t.data == "string";
if (t.dataTypes[0] === "jsonp" || n.jsonpCallback || n.jsonp != null || t.jsonp !== !1 && (Yt.test(t.url) || i && Yt.test(t.data))) {
var s, o = t.jsonpCallback = A.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, u = e[o], a = t.url, f = t.data, l = "$1" + o + "$2", c = function() {
e[o] = u, s && A.isFunction(u) && e[o](s[0]);
};
return t.jsonp !== !1 && (a = a.replace(Yt, l), t.url === a && (i && (f = f.replace(Yt, l)), t.data === f && (a += (/\?/.test(a) ? "&" : "?") + t.jsonp + "=" + o))), t.url = a, t.data = f, e[o] = function(e) {
s = [ e ];
}, r.then(c, c), t.converters["script json"] = function() {
return s || A.error(o + " was not called"), s[0];
}, t.dataTypes[0] = "json", "script";
}
}), A.ajaxSetup({
accepts: {
script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
},
contents: {
script: /javascript|ecmascript/
},
converters: {
"text script": function(e) {
return A.globalEval(e), e;
}
}
}), A.ajaxPrefilter("script", function(e) {
e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1);
}), A.ajaxTransport("script", function(e) {
if (e.crossDomain) {
var n, r = L.head || L.getElementsByTagName("head")[0] || L.documentElement;
return {
send: function(i, s) {
n = L.createElement("script"), n.async = "async", e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, i) {
if (!n.readyState || /loaded|complete/.test(n.readyState)) n.onload = n.onreadystatechange = null, r && n.parentNode && r.removeChild(n), n = t, i || s(200, "success");
}, r.insertBefore(n, r.firstChild);
},
abort: function() {
n && n.onload(0, 1);
}
};
}
});
var Zt = A.now(), en, tn;
A.ajaxSettings.xhr = e.ActiveXObject ? function() {
return !this.isLocal && o() || s();
} : o, tn = A.ajaxSettings.xhr(), A.support.ajax = !!tn, A.support.cors = tn && "withCredentials" in tn, tn = t, A.support.ajax && A.ajaxTransport(function(e) {
if (!e.crossDomain || A.support.cors) {
var n;
return {
send: function(r, i) {
var s = e.xhr(), o, a;
e.username ? s.open(e.type, e.url, e.async, e.username, e.password) : s.open(e.type, e.url, e.async);
if (e.xhrFields) for (a in e.xhrFields) s[a] = e.xhrFields[a];
e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), !e.crossDomain && !r["X-Requested-With"] && (r["X-Requested-With"] = "XMLHttpRequest");
try {
for (a in r) s.setRequestHeader(a, r[a]);
} catch (f) {}
s.send(e.hasContent && e.data || null), n = function(r, u) {
var a, f, l, c, h;
try {
if (n && (u || s.readyState === 4)) {
n = t, o && (s.onreadystatechange = A.noop, delete en[o]);
if (u) s.readyState !== 4 && s.abort(); else {
a = s.status, l = s.getAllResponseHeaders(), c = {}, h = s.responseXML, h && h.documentElement && (c.xml = h), c.text = s.responseText;
try {
f = s.statusText;
} catch (p) {
f = "";
}
a || !e.isLocal || e.crossDomain ? a === 1223 && (a = 204) : a = c.text ? 200 : 404;
}
}
} catch (d) {
u || i(-1, d);
}
c && i(a, f, c, l);
}, e.async && s.readyState !== 4 ? (en || (en = {}, u()), o = Zt++, s.onreadystatechange = en[o] = n) : n();
},
abort: function() {
n && n(0, 1);
}
};
}
});
var nn = {}, rn = /^(?:toggle|show|hide)$/, sn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, on, un = [ [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ], [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ], [ "opacity" ] ];
A.fn.extend({
show: function(e, t, n) {
var s, o;
if (e || e === 0) return this.animate(i("show", 3), e, t, n);
for (var u = 0, a = this.length; u < a; u++) s = this[u], o = s.style.display, !A._data(s, "olddisplay") && o === "none" && (o = s.style.display = ""), o === "" && A.css(s, "display") === "none" && A._data(s, "olddisplay", r(s.nodeName));
for (u = 0; u < a; u++) {
s = this[u], o = s.style.display;
if (o === "" || o === "none") s.style.display = A._data(s, "olddisplay") || "";
}
return this;
},
hide: function(e, t, n) {
if (e || e === 0) return this.animate(i("hide", 3), e, t, n);
for (var r = 0, s = this.length; r < s; r++) {
var o = A.css(this[r], "display");
o !== "none" && !A._data(this[r], "olddisplay") && A._data(this[r], "olddisplay", o);
}
for (r = 0; r < s; r++) this[r].style.display = "none";
return this;
},
_toggle: A.fn.toggle,
toggle: function(e, t, n) {
var r = typeof e == "boolean";
return A.isFunction(e) && A.isFunction(t) ? this._toggle.apply(this, arguments) : e == null || r ? this.each(function() {
var t = r ? e : A(this).is(":hidden");
A(this)[t ? "show" : "hide"]();
}) : this.animate(i("toggle", 3), e, t, n), this;
},
fadeTo: function(e, t, n, r) {
return this.filter(":hidden").css("opacity", 0).show().end().animate({
opacity: t
}, e, n, r);
},
animate: function(e, t, n, i) {
var s = A.speed(t, n, i);
return A.isEmptyObject(e) ? this.each(s.complete) : this[s.queue === !1 ? "each" : "queue"](function() {
var t = A.extend({}, s), n, i = this.nodeType === 1, o = i && A(this).is(":hidden"), u = this;
for (n in e) {
var a = A.camelCase(n);
n !== a && (e[a] = e[n], delete e[n], n = a);
if (e[n] === "hide" && o || e[n] === "show" && !o) return t.complete.call(this);
if (i && (n === "height" || n === "width")) {
t.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];
if (A.css(this, "display") === "inline" && A.css(this, "float") === "none") if (A.support.inlineBlockNeedsLayout) {
var f = r(this.nodeName);
f === "inline" ? this.style.display = "inline-block" : (this.style.display = "inline", this.style.zoom = 1);
} else this.style.display = "inline-block";
}
A.isArray(e[n]) && ((t.specialEasing = t.specialEasing || {})[n] = e[n][1], e[n] = e[n][0]);
}
return t.overflow != null && (this.style.overflow = "hidden"), t.curAnim = A.extend({}, e), A.each(e, function(n, r) {
var i = new A.fx(u, t, n);
if (rn.test(r)) i[r === "toggle" ? o ? "show" : "hide" : r](e); else {
var s = sn.exec(r), a = i.cur();
if (s) {
var f = parseFloat(s[2]), l = s[3] || (A.cssNumber[n] ? "" : "px");
l !== "px" && (A.style(u, n, (f || 1) + l), a = (f || 1) / i.cur() * a, A.style(u, n, a + l)), s[1] && (f = (s[1] === "-=" ? -1 : 1) * f + a), i.custom(a, f, l);
} else i.custom(a, r, "");
}
}), !0;
});
},
stop: function(e, t) {
var n = A.timers;
return e && this.queue([]), this.each(function() {
for (var e = n.length - 1; e >= 0; e--) n[e].elem === this && (t && n[e](!0), n.splice(e, 1));
}), t || this.dequeue(), this;
}
}), A.each({
slideDown: i("show", 1),
slideUp: i("hide", 1),
slideToggle: i("toggle", 1),
fadeIn: {
opacity: "show"
},
fadeOut: {
opacity: "hide"
},
fadeToggle: {
opacity: "toggle"
}
}, function(e, t) {
A.fn[e] = function(e, n, r) {
return this.animate(t, e, n, r);
};
}), A.extend({
speed: function(e, t, n) {
var r = e && typeof e == "object" ? A.extend({}, e) : {
complete: n || !n && t || A.isFunction(e) && e,
duration: e,
easing: n && t || t && !A.isFunction(t) && t
};
return r.duration = A.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in A.fx.speeds ? A.fx.speeds[r.duration] : A.fx.speeds._default, r.old = r.complete, r.complete = function() {
r.queue !== !1 && A(this).dequeue(), A.isFunction(r.old) && r.old.call(this);
}, r;
},
easing: {
linear: function(e, t, n, r) {
return n + r * e;
},
swing: function(e, t, n, r) {
return (-Math.cos(e * Math.PI) / 2 + .5) * r + n;
}
},
timers: [],
fx: function(e, t, n) {
this.options = t, this.elem = e, this.prop = n, t.orig || (t.orig = {});
}
}), A.fx.prototype = {
update: function() {
this.options.step && this.options.step.call(this.elem, this.now, this), (A.fx.step[this.prop] || A.fx.step._default)(this);
},
cur: function() {
if (this.elem[this.prop] == null || !!this.elem.style && this.elem.style[this.prop] != null) {
var e, t = A.css(this.elem, this.prop);
return isNaN(e = parseFloat(t)) ? !t || t === "auto" ? 0 : t : e;
}
return this.elem[this.prop];
},
custom: function(e, t, n) {
function r(e) {
return i.step(e);
}
var i = this, s = A.fx;
this.startTime = A.now(), this.start = e, this.end = t, this.unit = n || this.unit || (A.cssNumber[this.prop] ? "" : "px"), this.now = this.start, this.pos = this.state = 0, r.elem = this.elem, r() && A.timers.push(r) && !on && (on = setInterval(s.tick, s.interval));
},
show: function() {
this.options.orig[this.prop] = A.style(this.elem, this.prop), this.options.show = !0, this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), A(this.elem).show();
},
hide: function() {
this.options.orig[this.prop] = A.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0);
},
step: function(e) {
var t = A.now(), n = !0;
if (e || t >= this.options.duration + this.startTime) {
this.now = this.end, this.pos = this.state = 1, this.update(), this.options.curAnim[this.prop] = !0;
for (var r in this.options.curAnim) this.options.curAnim[r] !== !0 && (n = !1);
if (n) {
if (this.options.overflow != null && !A.support.shrinkWrapBlocks) {
var i = this.elem, s = this.options;
A.each([ "", "X", "Y" ], function(e, t) {
i.style["overflow" + t] = s.overflow[e];
});
}
this.options.hide && A(this.elem).hide();
if (this.options.hide || this.options.show) for (var o in this.options.curAnim) A.style(this.elem, o, this.options.orig[o]);
this.options.complete.call(this.elem);
}
return !1;
}
var u = t - this.startTime;
this.state = u / this.options.duration;
var a = this.options.specialEasing && this.options.specialEasing[this.prop], f = this.options.easing || (A.easing.swing ? "swing" : "linear");
return this.pos = A.easing[a || f](this.state, u, 0, 1, this.options.duration), this.now = this.start + (this.end - this.start) * this.pos, this.update(), !0;
}
}, A.extend(A.fx, {
tick: function() {
var e = A.timers;
for (var t = 0; t < e.length; t++) e[t]() || e.splice(t--, 1);
e.length || A.fx.stop();
},
interval: 13,
stop: function() {
clearInterval(on), on = null;
},
speeds: {
slow: 600,
fast: 200,
_default: 400
},
step: {
opacity: function(e) {
A.style(e.elem, "opacity", e.now);
},
_default: function(e) {
e.elem.style && e.elem.style[e.prop] != null ? e.elem.style[e.prop] = (e.prop === "width" || e.prop === "height" ? Math.max(0, e.now) : e.now) + e.unit : e.elem[e.prop] = e.now;
}
}
}), A.expr && A.expr.filters && (A.expr.filters.animated = function(e) {
return A.grep(A.timers, function(t) {
return e === t.elem;
}).length;
});
var an = /^t(?:able|d|h)$/i, fn = /^(?:body|html)$/i;
"getBoundingClientRect" in L.documentElement ? A.fn.offset = function(e) {
var t = this[0], r;
if (e) return this.each(function(t) {
A.offset.setOffset(this, e, t);
});
if (!t || !t.ownerDocument) return null;
if (t === t.ownerDocument.body) return A.offset.bodyOffset(t);
try {
r = t.getBoundingClientRect();
} catch (i) {}
var s = t.ownerDocument, o = s.documentElement;
if (!r || !A.contains(o, t)) return r ? {
top: r.top,
left: r.left
} : {
top: 0,
left: 0
};
var u = s.body, a = n(s), f = o.clientTop || u.clientTop || 0, l = o.clientLeft || u.clientLeft || 0, c = a.pageYOffset || A.support.boxModel && o.scrollTop || u.scrollTop, h = a.pageXOffset || A.support.boxModel && o.scrollLeft || u.scrollLeft, p = r.top + c - f, d = r.left + h - l;
return {
top: p,
left: d
};
} : A.fn.offset = function(e) {
var t = this[0];
if (e) return this.each(function(t) {
A.offset.setOffset(this, e, t);
});
if (!t || !t.ownerDocument) return null;
if (t === t.ownerDocument.body) return A.offset.bodyOffset(t);
A.offset.initialize();
var n, r = t.offsetParent, i = t, s = t.ownerDocument, o = s.documentElement, u = s.body, a = s.defaultView, f = a ? a.getComputedStyle(t, null) : t.currentStyle, l = t.offsetTop, c = t.offsetLeft;
while ((t = t.parentNode) && t !== u && t !== o) {
if (A.offset.supportsFixedPosition && f.position === "fixed") break;
n = a ? a.getComputedStyle(t, null) : t.currentStyle, l -= t.scrollTop, c -= t.scrollLeft, t === r && (l += t.offsetTop, c += t.offsetLeft, A.offset.doesNotAddBorder && (!A.offset.doesAddBorderForTableAndCells || !an.test(t.nodeName)) && (l += parseFloat(n.borderTopWidth) || 0, c += parseFloat(n.borderLeftWidth) || 0), i = r, r = t.offsetParent), A.offset.subtractsBorderForOverflowNotVisible && n.overflow !== "visible" && (l += parseFloat(n.borderTopWidth) || 0, c += parseFloat(n.borderLeftWidth) || 0), f = n;
}
if (f.position === "relative" || f.position === "static") l += u.offsetTop, c += u.offsetLeft;
return A.offset.supportsFixedPosition && f.position === "fixed" && (l += Math.max(o.scrollTop, u.scrollTop), c += Math.max(o.scrollLeft, u.scrollLeft)), {
top: l,
left: c
};
}, A.offset = {
initialize: function() {
var e = L.body, t = L.createElement("div"), n, r, i, s, o = parseFloat(A.css(e, "marginTop")) || 0, u = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
A.extend(t.style, {
position: "absolute",
top: 0,
left: 0,
margin: 0,
border: 0,
width: "1px",
height: "1px",
visibility: "hidden"
}), t.innerHTML = u, e.insertBefore(t, e.firstChild), n = t.firstChild, r = n.firstChild, s = n.nextSibling.firstChild.firstChild, this.doesNotAddBorder = r.offsetTop !== 5, this.doesAddBorderForTableAndCells = s.offsetTop === 5, r.style.position = "fixed", r.style.top = "20px", this.supportsFixedPosition = r.offsetTop === 20 || r.offsetTop === 15, r.style.position = r.style.top = "", n.style.overflow = "hidden", n.style.position = "relative", this.subtractsBorderForOverflowNotVisible = r.offsetTop === -5, this.doesNotIncludeMarginInBodyOffset = e.offsetTop !== o, e.removeChild(t), A.offset.initialize = A.noop;
},
bodyOffset: function(e) {
var t = e.offsetTop, n = e.offsetLeft;
return A.offset.initialize(), A.offset.doesNotIncludeMarginInBodyOffset && (t += parseFloat(A.css(e, "marginTop")) || 0, n += parseFloat(A.css(e, "marginLeft")) || 0), {
top: t,
left: n
};
},
setOffset: function(e, t, n) {
var r = A.css(e, "position");
r === "static" && (e.style.position = "relative");
var i = A(e), s = i.offset(), o = A.css(e, "top"), u = A.css(e, "left"), a = (r === "absolute" || r === "fixed") && A.inArray("auto", [ o, u ]) > -1, f = {}, l = {}, c, h;
a && (l = i.position()), c = a ? l.top : parseInt(o, 10) || 0, h = a ? l.left : parseInt(u, 10) || 0, A.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using" in t ? t.using.call(e, f) : i.css(f);
}
}, A.fn.extend({
position: function() {
if (!this[0]) return null;
var e = this[0], t = this.offsetParent(), n = this.offset(), r = fn.test(t[0].nodeName) ? {
top: 0,
left: 0
} : t.offset();
return n.top -= parseFloat(A.css(e, "marginTop")) || 0, n.left -= parseFloat(A.css(e, "marginLeft")) || 0, r.top += parseFloat(A.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(A.css(t[0], "borderLeftWidth")) || 0, {
top: n.top - r.top,
left: n.left - r.left
};
},
offsetParent: function() {
return this.map(function() {
var e = this.offsetParent || L.body;
while (e && !fn.test(e.nodeName) && A.css(e, "position") === "static") e = e.offsetParent;
return e;
});
}
}), A.each([ "Left", "Top" ], function(e, r) {
var i = "scroll" + r;
A.fn[i] = function(r) {
var s = this[0], o;
return s ? r !== t ? this.each(function() {
o = n(this), o ? o.scrollTo(e ? A(o).scrollLeft() : r, e ? r : A(o).scrollTop()) : this[i] = r;
}) : (o = n(s), o ? "pageXOffset" in o ? o[e ? "pageYOffset" : "pageXOffset"] : A.support.boxModel && o.document.documentElement[i] || o.document.body[i] : s[i]) : null;
};
}), A.each([ "Height", "Width" ], function(e, n) {
var r = n.toLowerCase();
A.fn["inner" + n] = function() {
return this[0] ? parseFloat(A.css(this[0], r, "padding")) : null;
}, A.fn["outer" + n] = function(e) {
return this[0] ? parseFloat(A.css(this[0], r, e ? "margin" : "border")) : null;
}, A.fn[r] = function(e) {
var i = this[0];
if (!i) return e == null ? null : this;
if (A.isFunction(e)) return this.each(function(t) {
var n = A(this);
n[r](e.call(this, t, n[r]()));
});
if (A.isWindow(i)) {
var s = i.document.documentElement["client" + n];
return i.document.compatMode === "CSS1Compat" && s || i.document.body["client" + n] || s;
}
if (i.nodeType === 9) return Math.max(i.documentElement["client" + n], i.body["scroll" + n], i.documentElement["scroll" + n], i.body["offset" + n], i.documentElement["offset" + n]);
if (e === t) {
var o = A.css(i, r), u = parseFloat(o);
return A.isNaN(u) ? o : u;
}
return this.css(r, typeof e == "string" ? e : e + "px");
};
}), e.jQuery = e.$ = A;
})(window);

// jquery.embedly.js

(function(e) {
window.embedlyURLre = /http:\/\/(.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|youtu\.be\/.*|.*\.youtube\.com\/user\/.*|.*\.youtube\.com\/.*#.*\/.*|m\.youtube\.com\/watch.*|m\.youtube\.com\/index.*|.*\.youtube\.com\/profile.*|.*justin\.tv\/.*|.*justin\.tv\/.*\/b\/.*|.*justin\.tv\/.*\/w\/.*|www\.ustream\.tv\/recorded\/.*|www\.ustream\.tv\/channel\/.*|www\.ustream\.tv\/.*|qik\.com\/video\/.*|qik\.com\/.*|qik\.ly\/.*|.*revision3\.com\/.*|.*\.dailymotion\.com\/video\/.*|.*\.dailymotion\.com\/.*\/video\/.*|www\.collegehumor\.com\/video:.*|.*twitvid\.com\/.*|www\.break\.com\/.*\/.*|vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|www\.metacafe\.com\/watch\/.*|www\.metacafe\.com\/w\/.*|blip\.tv\/file\/.*|.*\.blip\.tv\/file\/.*|video\.google\.com\/videoplay\?.*|.*revver\.com\/video\/.*|video\.yahoo\.com\/watch\/.*\/.*|video\.yahoo\.com\/network\/.*|.*viddler\.com\/explore\/.*\/videos\/.*|liveleak\.com\/view\?.*|www\.liveleak\.com\/view\?.*|animoto\.com\/play\/.*|dotsub\.com\/view\/.*|www\.overstream\.net\/view\.php\?oid=.*|www\.livestream\.com\/.*|www\.worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|teachertube\.com\/viewVideo\.php.*|www\.teachertube\.com\/viewVideo\.php.*|www1\.teachertube\.com\/viewVideo\.php.*|www2\.teachertube\.com\/viewVideo\.php.*|bambuser\.com\/v\/.*|bambuser\.com\/channel\/.*|bambuser\.com\/channel\/.*\/broadcast\/.*|www\.schooltube\.com\/video\/.*\/.*|bigthink\.com\/ideas\/.*|bigthink\.com\/series\/.*|sendables\.jibjab\.com\/view\/.*|sendables\.jibjab\.com\/originals\/.*|www\.xtranormal\.com\/watch\/.*|socialcam\.com\/v\/.*|www\.socialcam\.com\/v\/.*|dipdive\.com\/media\/.*|dipdive\.com\/member\/.*\/media\/.*|dipdive\.com\/v\/.*|.*\.dipdive\.com\/media\/.*|.*\.dipdive\.com\/v\/.*|v\.youku\.com\/v_show\/.*\.html|v\.youku\.com\/v_playlist\/.*\.html|www\.snotr\.com\/video\/.*|snotr\.com\/video\/.*|video\.jardenberg\.se\/.*|.*yfrog\..*\/.*|tweetphoto\.com\/.*|www\.flickr\.com\/photos\/.*|flic\.kr\/.*|twitpic\.com\/.*|www\.twitpic\.com\/.*|twitpic\.com\/photos\/.*|www\.twitpic\.com\/photos\/.*|.*imgur\.com\/.*|.*\.posterous\.com\/.*|post\.ly\/.*|twitgoo\.com\/.*|i.*\.photobucket\.com\/albums\/.*|s.*\.photobucket\.com\/albums\/.*|phodroid\.com\/.*\/.*\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.xkcd\.com\/.*|imgs\.xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.asofterworld\.com\/.*\.jpg|asofterworld\.com\/.*\.jpg|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|emberapp\.com\/.*\/images\/.*|emberapp\.com\/.*\/images\/.*\/sizes\/.*|emberapp\.com\/.*\/collections\/.*\/.*|emberapp\.com\/.*\/categories\/.*\/.*\/.*|embr\.it\/.*|picasaweb\.google\.com.*\/.*\/.*#.*|picasaweb\.google\.com.*\/lh\/photo\/.*|picasaweb\.google\.com.*\/.*\/.*|dailybooth\.com\/.*\/.*|brizzly\.com\/pic\/.*|pics\.brizzly\.com\/.*\.jpg|img\.ly\/.*|www\.tinypic\.com\/view\.php.*|tinypic\.com\/view\.php.*|www\.tinypic\.com\/player\.php.*|tinypic\.com\/player\.php.*|www\.tinypic\.com\/r\/.*\/.*|tinypic\.com\/r\/.*\/.*|.*\.tinypic\.com\/.*\.jpg|.*\.tinypic\.com\/.*\.png|meadd\.com\/.*\/.*|meadd\.com\/.*|.*\.deviantart\.com\/art\/.*|.*\.deviantart\.com\/gallery\/.*|.*\.deviantart\.com\/#\/.*|fav\.me\/.*|.*\.deviantart\.com|.*\.deviantart\.com\/gallery|.*\.deviantart\.com\/.*\/.*\.jpg|.*\.deviantart\.com\/.*\/.*\.gif|.*\.deviantart\.net\/.*\/.*\.jpg|.*\.deviantart\.net\/.*\/.*\.gif|plixi\.com\/p\/.*|plixi\.com\/profile\/home\/.*|plixi\.com\/.*|www\.fotopedia\.com\/.*\/.*|fotopedia\.com\/.*\/.*|photozou\.jp\/photo\/show\/.*\/.*|photozou\.jp\/photo\/photo_only\/.*\/.*|instagr\.am\/p\/.*|instagram\.com\/p\/.*|skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|https:\/\/skitch\.com\/.*\/.*\/.*|https:\/\/img\.skitch\.com\/.*|share\.ovi\.com\/media\/.*\/.*|www\.questionablecontent\.net\/|questionablecontent\.net\/|www\.questionablecontent\.net\/view\.php.*|questionablecontent\.net\/view\.php.*|questionablecontent\.net\/comics\/.*\.png|www\.questionablecontent\.net\/comics\/.*\.png|picplz\.com\/user\/.*\/pic\/.*\/|twitrpix\.com\/.*|.*\.twitrpix\.com\/.*|www\.someecards\.com\/.*\/.*|someecards\.com\/.*\/.*|some\.ly\/.*|www\.some\.ly\/.*|pikchur\.com\/.*|achewood\.com\/.*|www\.achewood\.com\/.*|achewood\.com\/index\.php.*|www\.achewood\.com\/index\.php.*|www\.whosay\.com\/content\/.*|www\.whosay\.com\/photos\/.*|www\.whosay\.com\/videos\/.*|say\.ly\/.*|www\.whitehouse\.gov\/photos-and-video\/video\/.*|www\.whitehouse\.gov\/video\/.*|wh\.gov\/photos-and-video\/video\/.*|wh\.gov\/video\/.*|www\.hulu\.com\/watch.*|www\.hulu\.com\/w\/.*|hulu\.com\/watch.*|hulu\.com\/w\/.*|.*crackle\.com\/c\/.*|www\.fancast\.com\/.*\/videos|www\.funnyordie\.com\/videos\/.*|www\.funnyordie\.com\/m\/.*|funnyordie\.com\/videos\/.*|funnyordie\.com\/m\/.*|www\.vimeo\.com\/groups\/.*\/videos\/.*|www\.vimeo\.com\/.*|vimeo\.com\/groups\/.*\/videos\/.*|vimeo\.com\/.*|vimeo\.com\/m\/#\/.*|www\.ted\.com\/talks\/.*\.html.*|www\.ted\.com\/talks\/lang\/.*\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/lang\/.*\/.*\.html.*|.*nfb\.ca\/film\/.*|www\.thedailyshow\.com\/watch\/.*|www\.thedailyshow\.com\/full-episodes\/.*|www\.thedailyshow\.com\/collection\/.*\/.*\/.*|movies\.yahoo\.com\/movie\/.*\/video\/.*|movies\.yahoo\.com\/movie\/.*\/trailer|movies\.yahoo\.com\/movie\/.*\/video|www\.colbertnation\.com\/the-colbert-report-collections\/.*|www\.colbertnation\.com\/full-episodes\/.*|www\.colbertnation\.com\/the-colbert-report-videos\/.*|www\.comedycentral\.com\/videos\/index\.jhtml\?.*|www\.theonion\.com\/video\/.*|theonion\.com\/video\/.*|wordpress\.tv\/.*\/.*\/.*\/.*\/|www\.traileraddict\.com\/trailer\/.*|www\.traileraddict\.com\/clip\/.*|www\.traileraddict\.com\/poster\/.*|www\.escapistmagazine\.com\/videos\/.*|www\.trailerspy\.com\/trailer\/.*\/.*|www\.trailerspy\.com\/trailer\/.*|www\.trailerspy\.com\/view_video\.php.*|www\.atom\.com\/.*\/.*\/|fora\.tv\/.*\/.*\/.*\/.*|www\.spike\.com\/video\/.*|www\.gametrailers\.com\/video\/.*|gametrailers\.com\/video\/.*|www\.koldcast\.tv\/video\/.*|www\.koldcast\.tv\/#video:.*|techcrunch\.tv\/watch.*|techcrunch\.tv\/.*\/watch.*|mixergy\.com\/.*|video\.pbs\.org\/video\/.*|www\.zapiks\.com\/.*|tv\.digg\.com\/diggnation\/.*|tv\.digg\.com\/diggreel\/.*|tv\.digg\.com\/diggdialogg\/.*|www\.trutv\.com\/video\/.*|www\.nzonscreen\.com\/title\/.*|nzonscreen\.com\/title\/.*|app\.wistia\.com\/embed\/medias\/.*|https:\/\/app\.wistia\.com\/embed\/medias\/.*|hungrynation\.tv\/.*\/episode\/.*|www\.hungrynation\.tv\/.*\/episode\/.*|hungrynation\.tv\/episode\/.*|www\.hungrynation\.tv\/episode\/.*|indymogul\.com\/.*\/episode\/.*|www\.indymogul\.com\/.*\/episode\/.*|indymogul\.com\/episode\/.*|www\.indymogul\.com\/episode\/.*|channelfrederator\.com\/.*\/episode\/.*|www\.channelfrederator\.com\/.*\/episode\/.*|channelfrederator\.com\/episode\/.*|www\.channelfrederator\.com\/episode\/.*|tmiweekly\.com\/.*\/episode\/.*|www\.tmiweekly\.com\/.*\/episode\/.*|tmiweekly\.com\/episode\/.*|www\.tmiweekly\.com\/episode\/.*|99dollarmusicvideos\.com\/.*\/episode\/.*|www\.99dollarmusicvideos\.com\/.*\/episode\/.*|99dollarmusicvideos\.com\/episode\/.*|www\.99dollarmusicvideos\.com\/episode\/.*|ultrakawaii\.com\/.*\/episode\/.*|www\.ultrakawaii\.com\/.*\/episode\/.*|ultrakawaii\.com\/episode\/.*|www\.ultrakawaii\.com\/episode\/.*|barelypolitical\.com\/.*\/episode\/.*|www\.barelypolitical\.com\/.*\/episode\/.*|barelypolitical\.com\/episode\/.*|www\.barelypolitical\.com\/episode\/.*|barelydigital\.com\/.*\/episode\/.*|www\.barelydigital\.com\/.*\/episode\/.*|barelydigital\.com\/episode\/.*|www\.barelydigital\.com\/episode\/.*|threadbanger\.com\/.*\/episode\/.*|www\.threadbanger\.com\/.*\/episode\/.*|threadbanger\.com\/episode\/.*|www\.threadbanger\.com\/episode\/.*|vodcars\.com\/.*\/episode\/.*|www\.vodcars\.com\/.*\/episode\/.*|vodcars\.com\/episode\/.*|www\.vodcars\.com\/episode\/.*|confreaks\.net\/videos\/.*|www\.confreaks\.net\/videos\/.*|video\.allthingsd\.com\/video\/.*|aniboom\.com\/animation-video\/.*|www\.aniboom\.com\/animation-video\/.*|clipshack\.com\/Clip\.aspx\?.*|www\.clipshack\.com\/Clip\.aspx\?.*|grindtv\.com\/.*\/video\/.*|www\.grindtv\.com\/.*\/video\/.*|ifood\.tv\/recipe\/.*|ifood\.tv\/video\/.*|ifood\.tv\/channel\/user\/.*|www\.ifood\.tv\/recipe\/.*|www\.ifood\.tv\/video\/.*|www\.ifood\.tv\/channel\/user\/.*|logotv\.com\/video\/.*|www\.logotv\.com\/video\/.*|lonelyplanet\.com\/Clip\.aspx\?.*|www\.lonelyplanet\.com\/Clip\.aspx\?.*|streetfire\.net\/video\/.*\.htm.*|www\.streetfire\.net\/video\/.*\.htm.*|trooptube\.tv\/videos\/.*|www\.trooptube\.tv\/videos\/.*|www\.godtube\.com\/featured\/video\/.*|godtube\.com\/featured\/video\/.*|www\.godtube\.com\/watch\/.*|godtube\.com\/watch\/.*|www\.tangle\.com\/view_video.*|mediamatters\.org\/mmtv\/.*|www\.clikthrough\.com\/theater\/video\/.*|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*|www\.last\.fm\/music\/.*|www\.last\.fm\/music\/+videos\/.*|www\.last\.fm\/music\/+images\/.*|www\.last\.fm\/music\/.*\/_\/.*|www\.last\.fm\/music\/.*\/.*|www\.mixcloud\.com\/.*\/.*\/|www\.radionomy\.com\/.*\/radio\/.*|radionomy\.com\/.*\/radio\/.*|www\.entertonement\.com\/clips\/.*|www\.rdio\.com\/#\/artist\/.*\/album\/.*|www\.rdio\.com\/artist\/.*\/album\/.*|www\.zero-inch\.com\/.*|.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*|freemusicarchive\.org\/music\/.*|www\.freemusicarchive\.org\/music\/.*|freemusicarchive\.org\/curator\/.*|www\.freemusicarchive\.org\/curator\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/templates\/story\/story\.php.*|huffduffer\.com\/.*\/.*|www\.audioboo\.fm\/boos\/.*|audioboo\.fm\/boos\/.*|boo\.fm\/b.*|www\.xiami\.com\/song\/.*|xiami\.com\/song\/.*|www\.saynow\.com\/playMsg\.html.*|www\.saynow\.com\/playMsg\.html.*|listen\.grooveshark\.com\/s\/.*|radioreddit\.com\/songs.*|www\.radioreddit\.com\/songs.*|radioreddit\.com\/\?q=songs.*|www\.radioreddit\.com\/\?q=songs.*|espn\.go\.com\/video\/clip.*|espn\.go\.com\/.*\/story.*|abcnews\.com\/.*\/video\/.*|abcnews\.com\/video\/playerIndex.*|washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.boston\.com\/video.*|boston\.com\/video.*|www\.facebook\.com\/photo\.php.*|www\.facebook\.com\/video\/video\.php.*|www\.facebook\.com\/v\/.*|cnbc\.com\/id\/.*\?.*video.*|www\.cnbc\.com\/id\/.*\?.*video.*|cnbc\.com\/id\/.*\/play\/1\/video\/.*|www\.cnbc\.com\/id\/.*\/play\/1\/video\/.*|cbsnews\.com\/video\/watch\/.*|www\.google\.com\/buzz\/.*\/.*\/.*|www\.google\.com\/buzz\/.*|www\.google\.com\/profiles\/.*|google\.com\/buzz\/.*\/.*\/.*|google\.com\/buzz\/.*|google\.com\/profiles\/.*|www\.cnn\.com\/video\/.*|edition\.cnn\.com\/video\/.*|money\.cnn\.com\/video\/.*|today\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/ns\/.*|today\.msnbc\.msn\.com\/id\/.*\/ns\/.*|multimedia\.foxsports\.com\/m\/video\/.*\/.*|msn\.foxsports\.com\/video.*|www\.globalpost\.com\/video\/.*|www\.globalpost\.com\/dispatch\/.*|guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|www\.guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|bravotv\.com\/.*\/.*\/videos\/.*|www\.bravotv\.com\/.*\/.*\/videos\/.*|video\.nationalgeographic\.com\/.*\/.*\/.*\.html|dsc\.discovery\.com\/videos\/.*|animal\.discovery\.com\/videos\/.*|health\.discovery\.com\/videos\/.*|investigation\.discovery\.com\/videos\/.*|military\.discovery\.com\/videos\/.*|planetgreen\.discovery\.com\/videos\/.*|science\.discovery\.com\/videos\/.*|tlc\.discovery\.com\/videos\/.*|.*amazon\..*\/gp\/product\/.*|.*amazon\..*\/.*\/dp\/.*|.*amazon\..*\/dp\/.*|.*amazon\..*\/o\/ASIN\/.*|.*amazon\..*\/gp\/offer-listing\/.*|.*amazon\..*\/.*\/ASIN\/.*|.*amazon\..*\/gp\/product\/images\/.*|.*amazon\..*\/gp\/aw\/d\/.*|www\.amzn\.com\/.*|amzn\.com\/.*|www\.shopstyle\.com\/browse.*|www\.shopstyle\.com\/action\/apiVisitRetailer.*|api\.shopstyle\.com\/action\/apiVisitRetailer.*|www\.shopstyle\.com\/action\/viewLook.*|gist\.github\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.twitter\.com\/.*\/status\/.*|www\.twitter\.com\/.*\/statuses\/.*|mobile\.twitter\.com\/.*\/status\/.*|mobile\.twitter\.com\/.*\/statuses\/.*|https:\/\/twitter\.com\/.*\/status\/.*|https:\/\/twitter\.com\/.*\/statuses\/.*|https:\/\/www\.twitter\.com\/.*\/status\/.*|https:\/\/www\.twitter\.com\/.*\/statuses\/.*|https:\/\/mobile\.twitter\.com\/.*\/status\/.*|https:\/\/mobile\.twitter\.com\/.*\/statuses\/.*|www\.crunchbase\.com\/.*\/.*|crunchbase\.com\/.*\/.*|www\.slideshare\.net\/.*\/.*|www\.slideshare\.net\/mobile\/.*\/.*|slidesha\.re\/.*|scribd\.com\/doc\/.*|www\.scribd\.com\/doc\/.*|scribd\.com\/mobile\/documents\/.*|www\.scribd\.com\/mobile\/documents\/.*|screenr\.com\/.*|polldaddy\.com\/community\/poll\/.*|polldaddy\.com\/poll\/.*|answers\.polldaddy\.com\/poll\/.*|www\.5min\.com\/Video\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|www\.scrapblog\.com\/viewer\/viewer\.aspx.*|ping\.fm\/p\/.*|chart\.ly\/symbols\/.*|chart\.ly\/.*|maps\.google\.com\/maps\?.*|maps\.google\.com\/\?.*|maps\.google\.com\/maps\/ms\?.*|.*\.craigslist\.org\/.*\/.*|my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|www\.polleverywhere\.com\/polls\/.*|www\.polleverywhere\.com\/multiple_choice_polls\/.*|www\.polleverywhere\.com\/free_text_polls\/.*|www\.quantcast\.com\/wd:.*|www\.quantcast\.com\/.*|siteanalytics\.compete\.com\/.*|statsheet\.com\/statplot\/charts\/.*\/.*\/.*\/.*|statsheet\.com\/statplot\/charts\/e\/.*|statsheet\.com\/.*\/teams\/.*\/.*|statsheet\.com\/tools\/chartlets\?chart=.*|.*\.status\.net\/notice\/.*|identi\.ca\/notice\/.*|brainbird\.net\/notice\/.*|shitmydadsays\.com\/notice\/.*|www\.studivz\.net\/Profile\/.*|www\.studivz\.net\/l\/.*|www\.studivz\.net\/Groups\/Overview\/.*|www\.studivz\.net\/Gadgets\/Info\/.*|www\.studivz\.net\/Gadgets\/Install\/.*|www\.studivz\.net\/.*|www\.meinvz\.net\/Profile\/.*|www\.meinvz\.net\/l\/.*|www\.meinvz\.net\/Groups\/Overview\/.*|www\.meinvz\.net\/Gadgets\/Info\/.*|www\.meinvz\.net\/Gadgets\/Install\/.*|www\.meinvz\.net\/.*|www\.schuelervz\.net\/Profile\/.*|www\.schuelervz\.net\/l\/.*|www\.schuelervz\.net\/Groups\/Overview\/.*|www\.schuelervz\.net\/Gadgets\/Info\/.*|www\.schuelervz\.net\/Gadgets\/Install\/.*|www\.schuelervz\.net\/.*|myloc\.me\/.*|pastebin\.com\/.*|pastie\.org\/.*|www\.pastie\.org\/.*|redux\.com\/stream\/item\/.*\/.*|redux\.com\/f\/.*\/.*|www\.redux\.com\/stream\/item\/.*\/.*|www\.redux\.com\/f\/.*\/.*|cl\.ly\/.*|cl\.ly\/.*\/content|speakerdeck\.com\/u\/.*\/p\/.*|www\.kiva\.org\/lend\/.*|www\.timetoast\.com\/timelines\/.*|storify\.com\/.*\/.*|.*meetup\.com\/.*|meetu\.ps\/.*|www\.dailymile\.com\/people\/.*\/entries\/.*|.*\.kinomap\.com\/.*|www\.metacdn\.com\/api\/users\/.*\/content\/.*|www\.metacdn\.com\/api\/users\/.*\/media\/.*|prezi\.com\/.*\/.*|.*\.uservoice\.com\/.*\/suggestions\/.*|formspring\.me\/.*|www\.formspring\.me\/.*|formspring\.me\/.*\/q\/.*|www\.formspring\.me\/.*\/q\/.*|twitlonger\.com\/show\/.*|www\.twitlonger\.com\/show\/.*|tl\.gd\/.*|www\.qwiki\.com\/q\/.*|crocodoc\.com\/.*|.*\.crocodoc\.com\/.*|https:\/\/crocodoc\.com\/.*|https:\/\/.*\.crocodoc\.com\/.*)/i, e.embedly = e.embedly || {};
if (e.embedly.version) return;
e.embedly.version = "2.0.0", e.extend({
embedly: function(t, n, r) {
var i = [], s = {
maxWidth: null,
maxHeight: null,
wmode: "opaque",
method: "replace",
addImageStyles: !0,
wrapElement: "div",
classes: "embed",
urlRe: null,
key: null,
elems: [],
success: null
}, o;
typeof n != "undefined" ? o = e.extend(s, n) : o = s, o.urlRe == null && (o.urlRe = window.embedlyURLre), typeof t == "string" && (t = new Array(t)), typeof r != "undefined" && (o.success = r), o.success == null && (o.success = function(t, n) {
var r, i = e(n.node);
if (!t) return null;
if ((r = o.method) === "replace") return i.replaceWith(t.code);
if (r === "after") return i.after(t.code);
if (r === "afterParent") return i.parent().after(t.code);
});
var u = function(e) {
return e.match(o.urlRe) !== null;
}, a = function(e) {
var t = "urls=" + e;
return o.maxWidth != null ? t += "&maxwidth=" + o.maxWidth : typeof dimensions != "undefined" && (t += "&maxwidth=" + dimensions.width), o.maxHeight != null && (t += "&maxheight=" + o.maxHeight), t += "&wmode=" + o.wmode, typeof o.key == "string" && (t += "&key=" + o.key), t;
}, f = function() {
return typeof o.key == "string" ? "http://pro.embed.ly/1/oembed" : "http://api.embed.ly/1/oembed";
}, l = function(t, n) {
var r, i, s, u;
return (r = t.type) === "photo" ? (u = t.title || "", s = [], o.addImageStyles && (o.maxWidth && (units = isNaN(parseInt(o.maxWidth)) ? "" : "px", s.push("max-width: " + o.maxWidth + units)), o.maxHeight && (units = isNaN(parseInt(o.maxHeight)) ? "" : "px", s.push("max-height: " + o.maxHeight + units))), s = s.join(";"), i = "<a href='" + n.url + "' target='_blank'><img style='" + s + "' src='" + t.url + "' alt='" + u + "' /></a>") : r === "video" ? i = t.html : r === "rich" ? i = t.html : (u = t.title || n.url, thumb = t.thumbnail_url ? '<img src="' + t.thumbnail_url + '" class="thumb" />' : "", description = t.description, provider = t.provider_name ? '<a href="' + t.provider_url + '" class="provider">' + t.provider_name + "</a> - " : "", i = thumb + "<a href='" + n.url + "'>" + u + "</a>", i += provider, i += description), o.wrapElement && (i = "<" + o.wrapElement + ' class="' + o.classes + '">' + i + "</" + o.wrapElement + ">"), t.code = i, typeof n.node != "undefined" && e(n.node).data("oembed", t).trigger("embedly-oembed", [ t ]), o.success(t, n);
}, c = function(t) {
var n, r, i, s;
i = e.map(t, function(t, n) {
return n == 0 && t.node !== null && (node = e(t.node), s = {
width: node.parent().width(),
height: node.parent().height()
}), encodeURIComponent(t.url);
}).join(","), e.ajax({
url: f(),
dataType: "jsonp",
data: a(i),
success: function(n) {
return e.each(n, function(e, n) {
return n.type != "error" ? l(n, t[e]) : null;
});
}
});
};
e.each(t, function(t, n) {
return node = typeof o.elems != "undefined" ? o.elems[t] : null, typeof node != "undefined" && !u(n) && !o.key && e(node).data("oembed", !1), n && (u(n) || o.key) ? i.push({
url: n,
node: node
}) : null;
});
var h = [], p = i.length;
for (var d = 0; 0 <= p ? d < p : d > p; d += 20) h = h.concat(c(i.slice(d, d + 20)));
return o.elems ? o.elems : this;
}
}), e.fn.embedly = function(t, n) {
var r = typeof t != "undefined" ? t : {}, i = typeof r.key == "string" ? /(https?:\/\/.*)/i : window.embedlyURLre;
typeof n != "undefined" && (t.success = n);
var s = new Array, o = new Array;
this.each(function() {
typeof e(this).attr("href") != "undefined" ? i.test(e(this).attr("href")) && (s.push(e(this).attr("href")), o.push(e(this))) : e(this).find("a").each(function() {
typeof e(this).attr("href") != "undefined" && i.test(e(this).attr("href")) && (s.push(e(this).attr("href")), o.push(e(this)));
}), r.elems = o;
});
var u = e.embedly(s, r);
return this;
};
})(jQuery);

// showdown.js

var Showdown = {};

Showdown.converter = function() {
var e, t, n, r = 0;
this.makeHtml = function(r) {
return e = new Array, t = new Array, n = new Array, r = r.replace(/~/g, "~T"), r = r.replace(/\$/g, "~D"), r = r.replace(/\r\n/g, "\n"), r = r.replace(/\r/g, "\n"), r = "\n\n" + r + "\n\n", r = O(r), r = r.replace(/^[ \t]+$/mg, ""), r = s(r), r = i(r), r = u(r), r = L(r), r = r.replace(/~D/g, "$$"), r = r.replace(/~T/g, "~"), r;
};
var i = function(n) {
var n = n.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm, function(n, r, i, s, o) {
return r = r.toLowerCase(), e[r] = T(i), s ? s + o : (o && (t[r] = o.replace(/"/g, "&quot;")), "");
});
return n;
}, s = function(e) {
e = e.replace(/\n/g, "\n\n");
var t = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del", n = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";
return e = e.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, o), e = e.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, o), e = e.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, o), e = e.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g, o), e = e.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, o), e = e.replace(/\n\n/g, "\n"), e;
}, o = function(e, t) {
var r = t;
return r = r.replace(/\n\n/g, "\n"), r = r.replace(/^\n/, ""), r = r.replace(/\n+$/g, ""), r = "\n\n~K" + (n.push(r) - 1) + "K\n\n", r;
}, u = function(e) {
e = d(e);
var t = y("<hr />");
return e = e.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm, t), e = m(e), e = g(e), e = S(e), e = s(e), e = x(e), e;
}, a = function(e) {
return e = b(e), e = f(e), e = N(e), e = h(e), e = l(e), e = C(e), e = T(e), e = E(e), e = e.replace(/  +\n/g, " <br />\n"), e;
}, f = function(e) {
var t = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
return e = e.replace(t, function(e) {
var t = e.replace(/(.)<\/?code>(?=.)/g, "$1`");
return t = M(t, "\\`*_"), t;
}), e;
}, l = function(e) {
return e = e.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, c), e = e.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, c), e = e.replace(/(\[([^\[\]]+)\])()()()()()/g, c), e;
}, c = function(n, r, i, s, o, u, a, f) {
f == undefined && (f = "");
var l = r, c = i, h = s.toLowerCase(), p = o, d = f;
if (p == "") {
h == "" && (h = c.toLowerCase().replace(/ ?\n/g, " ")), p = "#" + h;
if (e[h] != undefined) p = e[h], t[h] != undefined && (d = t[h]); else {
if (!(l.search(/\(\s*\)$/m) > -1)) return l;
p = "";
}
}
p = M(p, "*_");
var v = '<a href="' + p + '"';
return d != "" && (d = d.replace(/"/g, "&quot;"), d = M(d, "*_"), v += ' title="' + d + '"'), v += ">" + c + "</a>", v;
}, h = function(e) {
return e = e.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, p), e = e.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, p), e;
}, p = function(n, r, i, s, o, u, a, f) {
var l = r, c = i, h = s.toLowerCase(), p = o, d = f;
d || (d = "");
if (p == "") {
h == "" && (h = c.toLowerCase().replace(/ ?\n/g, " ")), p = "#" + h;
if (e[h] == undefined) return l;
p = e[h], t[h] != undefined && (d = t[h]);
}
c = c.replace(/"/g, "&quot;"), p = M(p, "*_");
var v = '<img src="' + p + '" alt="' + c + '"';
return d = d.replace(/"/g, "&quot;"), d = M(d, "*_"), v += ' title="' + d + '"', v += " />", v;
}, d = function(e) {
return e;
}, v, m = function(e) {
return e;
};
v = function(e) {
return r++, e = e.replace(/\n{2,}$/, "\n"), e += "~0", e = e.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, function(e, t, n, r, i) {
var s = i, o = t, f = n;
return o || s.search(/\n{2,}/) > -1 ? s = u(A(s)) : (s = m(A(s)), s = s.replace(/\n$/, ""), s = a(s)), "<li>" + s + "</li>\n";
}), e = e.replace(/~0/g, ""), r--, e;
};
var g = function(e) {
return e += "~0", e = e.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function(e, t, n) {
var r = t, i = n;
return r = w(A(r)), r = O(r), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, ""), r = "<pre><code>" + r + "\n</code></pre>", y(r) + i;
}), e = e.replace(/~0/, ""), e;
}, y = function(e) {
return e = e.replace(/(^\n+|\n+$)/g, ""), "\n\n~K" + (n.push(e) - 1) + "K\n\n";
}, b = function(e) {
return e = e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(e, t, n, r, i) {
var s = r;
return s = s.replace(/^([ \t]*)/g, ""), s = s.replace(/[ \t]*$/g, ""), s = w(s), t + "<code>" + s + "</code>";
}), e;
}, w = function(e) {
return e = e.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = M(e, "*_{}[]\\", !1), e;
}, E = function(e) {
return e = e.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>"), e = e.replace(/(\*)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>"), e;
}, S = function(e) {
return e = e.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(e, t) {
var n = t;
return n = n.replace(/^[ \t]*>[ \t]?/gm, "~0"), n = n.replace(/~0/g, ""), n = n.replace(/^[ \t]+$/gm, ""), n = u(n), n = n.replace(/(^|\n)/g, "$1  "), n = n.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(e, t) {
var n = t;
return n = n.replace(/^  /mg, "~0"), n = n.replace(/~0/g, ""), n;
}), y("<blockquote>\n" + n + "\n</blockquote>");
}), e;
}, x = function(e) {
e = e.replace(/^\n+/g, ""), e = e.replace(/\n+$/g, "");
var t = e.split(/\n{2,}/g), r = new Array, i = t.length;
for (var s = 0; s < i; s++) {
var o = t[s];
o.search(/~K(\d+)K/g) >= 0 ? r.push(o) : o.search(/\S/) >= 0 && (o = a(o), r.push(o));
}
i = r.length;
for (var s = 0; s < i; s++) while (r[s].search(/~K(\d+)K/) >= 0) {
var u = n[RegExp.$1];
u = u.replace(/\$/g, "$$$$"), r[s] = r[s].replace(/~K\d+K/, u);
}
return r.join("\n\n");
}, T = function(e) {
return e = e.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), e = e.replace(/<(?![a-z\/?\$!])/gi, "&lt;"), e;
}, N = function(e) {
return e = e.replace(/\\(\\)/g, _), e = e.replace(/\\([`*_{}\[\]()>#+-.!])/g, _), e;
}, C = function(e) {
return e = e.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi, '<a href="$1">$1</a>'), e = e.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, function(e, t) {
return k(L(t));
}), e;
}, k = function(e) {
function t(e) {
var t = "0123456789ABCDEF", n = e.charCodeAt(0);
return t.charAt(n >> 4) + t.charAt(n & 15);
}
var n = [ function(e) {
return "&#" + e.charCodeAt(0) + ";";
}, function(e) {
return "&#x" + t(e) + ";";
}, function(e) {
return e;
} ];
return e = "mailto:" + e, e = e.replace(/./g, function(e) {
if (e == "@") e = n[Math.floor(Math.random() * 2)](e); else if (e != ":") {
var t = Math.random();
e = t > .9 ? n[2](e) : t > .45 ? n[1](e) : n[0](e);
}
return e;
}), e = '<a href="' + e + '">' + e + "</a>", e = e.replace(/">.+:/g, '">'), e;
}, L = function(e) {
return e = e.replace(/~E(\d+)E/g, function(e, t) {
var n = parseInt(t);
return String.fromCharCode(n);
}), e;
}, A = function(e) {
return e = e.replace(/^(\t|[ ]{1,4})/gm, "~0"), e = e.replace(/~0/g, ""), e;
}, O = function(e) {
return e = e.replace(/\t(?=\t)/g, "    "), e = e.replace(/\t/g, "~A~B"), e = e.replace(/~B(.+?)~A/g, function(e, t, n) {
var r = t, i = 4 - r.length % 4;
for (var s = 0; s < i; s++) r += " ";
return r;
}), e = e.replace(/~A/g, "    "), e = e.replace(/~B/g, ""), e;
}, M = function(e, t, n) {
var r = "([" + t.replace(/([\[\]\\])/g, "\\$1") + "])";
n && (r = "\\\\" + r);
var i = new RegExp(r, "g");
return e = e.replace(i, _), e;
}, _ = function(e, t) {
var n = t.charCodeAt(0);
return "~E" + n + "E";
};
};

// spazcore.js

function hex_sha1(e) {
return rstr2hex(rstr_sha1(str2rstr_utf8(e)));
}

function b64_sha1(e) {
return rstr2b64(rstr_sha1(str2rstr_utf8(e)));
}

function any_sha1(e, t) {
return rstr2any(rstr_sha1(str2rstr_utf8(e)), t);
}

function hex_hmac_sha1(e, t) {
return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(e), str2rstr_utf8(t)));
}

function b64_hmac_sha1(e, t) {
return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(e), str2rstr_utf8(t)));
}

function any_hmac_sha1(e, t, n) {
return rstr2any(rstr_hmac_sha1(str2rstr_utf8(e), str2rstr_utf8(t)), n);
}

function sha1_vm_test() {
return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

function rstr_sha1(e) {
return binb2rstr(binb_sha1(rstr2binb(e), e.length * 8));
}

function rstr_hmac_sha1(e, t) {
var n = rstr2binb(e);
n.length > 16 && (n = binb_sha1(n, e.length * 8));
var r = Array(16), i = Array(16);
for (var s = 0; s < 16; s++) r[s] = n[s] ^ 909522486, i[s] = n[s] ^ 1549556828;
var o = binb_sha1(r.concat(rstr2binb(t)), 512 + t.length * 8);
return binb2rstr(binb_sha1(i.concat(o), 672));
}

function rstr2hex(e) {
try {
hexcase;
} catch (t) {
hexcase = 0;
}
var n = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", r = "", i;
for (var s = 0; s < e.length; s++) i = e.charCodeAt(s), r += n.charAt(i >>> 4 & 15) + n.charAt(i & 15);
return r;
}

function rstr2b64(e) {
try {
b64pad;
} catch (t) {
b64pad = "";
}
var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = "", i = e.length;
for (var s = 0; s < i; s += 3) {
var o = e.charCodeAt(s) << 16 | (s + 1 < i ? e.charCodeAt(s + 1) << 8 : 0) | (s + 2 < i ? e.charCodeAt(s + 2) : 0);
for (var u = 0; u < 4; u++) s * 8 + u * 6 > e.length * 8 ? r += b64pad : r += n.charAt(o >>> 6 * (3 - u) & 63);
}
return r;
}

function rstr2any(e, t) {
var n = t.length, r = Array(), i, s, o, u, a = Array(Math.ceil(e.length / 2));
for (i = 0; i < a.length; i++) a[i] = e.charCodeAt(i * 2) << 8 | e.charCodeAt(i * 2 + 1);
while (a.length > 0) {
u = Array(), o = 0;
for (i = 0; i < a.length; i++) {
o = (o << 16) + a[i], s = Math.floor(o / n), o -= s * n;
if (u.length > 0 || s > 0) u[u.length] = s;
}
r[r.length] = o, a = u;
}
var f = "";
for (i = r.length - 1; i >= 0; i--) f += t.charAt(r[i]);
var l = Math.ceil(e.length * 8 / (Math.log(t.length) / Math.log(2)));
for (i = f.length; i < l; i++) f = t[0] + f;
return f;
}

function str2rstr_utf8(e) {
var t = "", n = -1, r, i;
while (++n < e.length) r = e.charCodeAt(n), i = n + 1 < e.length ? e.charCodeAt(n + 1) : 0, 55296 <= r && r <= 56319 && 56320 <= i && i <= 57343 && (r = 65536 + ((r & 1023) << 10) + (i & 1023), n++), r <= 127 ? t += String.fromCharCode(r) : r <= 2047 ? t += String.fromCharCode(192 | r >>> 6 & 31, 128 | r & 63) : r <= 65535 ? t += String.fromCharCode(224 | r >>> 12 & 15, 128 | r >>> 6 & 63, 128 | r & 63) : r <= 2097151 && (t += String.fromCharCode(240 | r >>> 18 & 7, 128 | r >>> 12 & 63, 128 | r >>> 6 & 63, 128 | r & 63));
return t;
}

function str2rstr_utf16le(e) {
var t = "";
for (var n = 0; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) & 255, e.charCodeAt(n) >>> 8 & 255);
return t;
}

function str2rstr_utf16be(e) {
var t = "";
for (var n = 0; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) >>> 8 & 255, e.charCodeAt(n) & 255);
return t;
}

function rstr2binb(e) {
var t = Array(e.length >> 2);
for (var n = 0; n < t.length; n++) t[n] = 0;
for (var n = 0; n < e.length * 8; n += 8) t[n >> 5] |= (e.charCodeAt(n / 8) & 255) << 24 - n % 32;
return t;
}

function binb2rstr(e) {
var t = "";
for (var n = 0; n < e.length * 32; n += 8) t += String.fromCharCode(e[n >> 5] >>> 24 - n % 32 & 255);
return t;
}

function binb_sha1(e, t) {
e[t >> 5] |= 128 << 24 - t % 32, e[(t + 64 >> 9 << 4) + 15] = t;
var n = Array(80), r = 1732584193, i = -271733879, s = -1732584194, o = 271733878, u = -1009589776;
for (var a = 0; a < e.length; a += 16) {
var f = r, l = i, c = s, h = o, p = u;
for (var d = 0; d < 80; d++) {
d < 16 ? n[d] = e[a + d] : n[d] = bit_rol(n[d - 3] ^ n[d - 8] ^ n[d - 14] ^ n[d - 16], 1);
var v = safe_add(safe_add(bit_rol(r, 5), sha1_ft(d, i, s, o)), safe_add(safe_add(u, n[d]), sha1_kt(d)));
u = o, o = s, s = bit_rol(i, 30), i = r, r = v;
}
r = safe_add(r, f), i = safe_add(i, l), s = safe_add(s, c), o = safe_add(o, h), u = safe_add(u, p);
}
return Array(r, i, s, o, u);
}

function sha1_ft(e, t, n, r) {
return e < 20 ? t & n | ~t & r : e < 40 ? t ^ n ^ r : e < 60 ? t & n | t & r | n & r : t ^ n ^ r;
}

function sha1_kt(e) {
return e < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514;
}

function safe_add(e, t) {
var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
return r << 16 | n & 65535;
}

function bit_rol(e, t) {
return e << t | e >>> 32 - t;
}

function SpazAuth(e) {
var t = SPAZAUTH_SERVICES[e];
if (t == undefined) return sch.error("Invalid authentication service: " + e), null;
switch (t.authType) {
case SPAZCORE_AUTHTYPE_OAUTH:
return new SpazOAuth(e, t);
case SPAZCORE_AUTHTYPE_BASIC:
return new SpazBasicAuth;
default:
return new SpazBasicAuth;
}
}

function SpazBasicAuth() {}

function SpazOAuth(e, t) {
this.realm = e, this.opts = t;
}

function SpazImageURL(e) {
this.apis = {}, this.initAPIs();
}

function SpazPhotoMailer(e) {
this.apis = this.getAPIs();
}

function SpazPrefs(e, t, n) {
this._prefs = {}, this._sanity_methods = {}, n && (sch.debug("adding sanity methods to prefs"), this._sanity_methods = n), t && (this.id = t), e && (this.setDefaults(e), this._applyDefaults()), this.loaded = !1;
}

function SpazShortText() {
this.map = {}, this.genBaseMaps(), this.processBaseMaps();
}

function SpazShortURL(e) {
this.api = this.getAPIObj(e), this.expanded_cache = {};
}

function SpazTemplate() {
this._tpls = {};
}

function SpazTMDB(e) {
e = sch.defaults({
apikey: null,
lang: "en",
format: "json",
eventTarget: document
}, e), this.apikey = e.apikey, this.lang = e.lang, this.format = e.format, this.eventTarget = e.eventTarget, this.baseURL = "http://api.themoviedb.org/2.1/";
}

function SpazTwit(e) {
this.opts = sch.defaults({
auth: null,
username: null,
event_mode: "DOM",
event_target: document,
timeout: this.DEFAULT_TIMEOUT
}, e), this.auth = this.opts.auth, this.setSource("SpazCore"), this.initializeData(), this.initializeCombinedTracker(), this.cache = {
users: {},
posts: {}
}, this.me = {}, this.setBaseURL(SPAZCORE_SERVICEURL_TWITTER);
if (sc && sc.helpers && sc.helpers.dump) window.dump = sc.helpers.dump; else var t = function(e) {
return;
};
}

var sc = {};

sc.app = {}, sc.helpers = {}, sc.dumplevel = 1, sc.setDumpLevel = function(e) {
sc.dumplevel = parseInt(e, 10);
};

var sch = sc.helpers;

sc.events = {};

var SPAZCORE_SERVICE_TWITTER = "twitter", SPAZCORE_SERVICE_IDENTICA = "identi.ca", SPAZCORE_SERVICE_FREELISHUS = "freelish.us", SPAZCORE_SERVICE_WORDPRESS_TWITTER = "wordpress-twitter", SPAZCORE_SERVICE_TUMBLR_TWITTER = "tumblr-twitter", SPAZCORE_SERVICE_CUSTOM = "custom", SPAZCORE_BASEURL_TWITTER = "https://twitter.com/", SPAZCORE_BASEURL_IDENTICA = "https://identi.ca/", SPAZCORE_BASEURL_FREELISHUS = "http://freelish.us/";

Date.CultureInfo = {
name: "en-US",
englishName: "English (United States)",
nativeName: "English (United States)",
dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
abbreviatedDayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
shortestDayNames: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
firstLetterDayNames: [ "S", "M", "T", "W", "T", "F", "S" ],
monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
abbreviatedMonthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
amDesignator: "AM",
pmDesignator: "PM",
firstDayOfWeek: 0,
twoDigitYearMax: 2029,
dateElementOrder: "mdy",
formatPatterns: {
shortDate: "M/d/yyyy",
longDate: "dddd, MMMM dd, yyyy",
shortTime: "h:mm tt",
longTime: "h:mm:ss tt",
fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
monthDay: "MMMM dd",
yearMonth: "MMMM, yyyy"
},
regexPatterns: {
jan: /^jan(uary)?/i,
feb: /^feb(ruary)?/i,
mar: /^mar(ch)?/i,
apr: /^apr(il)?/i,
may: /^may/i,
jun: /^jun(e)?/i,
jul: /^jul(y)?/i,
aug: /^aug(ust)?/i,
sep: /^sep(t(ember)?)?/i,
oct: /^oct(ober)?/i,
nov: /^nov(ember)?/i,
dec: /^dec(ember)?/i,
sun: /^su(n(day)?)?/i,
mon: /^mo(n(day)?)?/i,
tue: /^tu(e(s(day)?)?)?/i,
wed: /^we(d(nesday)?)?/i,
thu: /^th(u(r(s(day)?)?)?)?/i,
fri: /^fr(i(day)?)?/i,
sat: /^sa(t(urday)?)?/i,
future: /^next/i,
past: /^last|past|prev(ious)?/i,
add: /^(\+|aft(er)?|from|hence)/i,
subtract: /^(\-|bef(ore)?|ago)/i,
yesterday: /^yes(terday)?/i,
today: /^t(od(ay)?)?/i,
tomorrow: /^tom(orrow)?/i,
now: /^n(ow)?/i,
millisecond: /^ms|milli(second)?s?/i,
second: /^sec(ond)?s?/i,
minute: /^mn|min(ute)?s?/i,
hour: /^h(our)?s?/i,
week: /^w(eek)?s?/i,
month: /^m(onth)?s?/i,
day: /^d(ay)?s?/i,
year: /^y(ear)?s?/i,
shortMeridian: /^(a|p)/i,
longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,
ordinalSuffix: /^\s*(st|nd|rd|th)/i,
timeContext: /^\s*(\:|a(?!u|p)|p)/i
},
timezones: [ {
name: "UTC",
offset: "-000"
}, {
name: "GMT",
offset: "-000"
}, {
name: "EST",
offset: "-0500"
}, {
name: "EDT",
offset: "-0400"
}, {
name: "CST",
offset: "-0600"
}, {
name: "CDT",
offset: "-0500"
}, {
name: "MST",
offset: "-0700"
}, {
name: "MDT",
offset: "-0600"
}, {
name: "PST",
offset: "-0800"
}, {
name: "PDT",
offset: "-0700"
} ]
}, function() {
var e = Date, t = e.prototype, n = e.CultureInfo, r = function(e, t) {
return t || (t = 2), ("000" + e).slice(t * -1);
};
t.clearTime = function() {
return this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), this;
}, t.setTimeToNow = function() {
var e = new Date;
return this.setHours(e.getHours()), this.setMinutes(e.getMinutes()), this.setSeconds(e.getSeconds()), this.setMilliseconds(e.getMilliseconds()), this;
}, e.today = function() {
return (new Date).clearTime();
}, e.compare = function(e, t) {
if (isNaN(e) || isNaN(t)) throw new Error(e + " - " + t);
if (e instanceof Date && t instanceof Date) return e < t ? -1 : e > t ? 1 : 0;
throw new TypeError(e + " - " + t);
}, e.equals = function(e, t) {
return e.compareTo(t) === 0;
}, e.getDayNumberFromName = function(e) {
var t = n.dayNames, r = n.abbreviatedDayNames, i = n.shortestDayNames, s = e.toLowerCase();
for (var o = 0; o < t.length; o++) if (t[o].toLowerCase() == s || r[o].toLowerCase() == s || i[o].toLowerCase() == s) return o;
return -1;
}, e.getMonthNumberFromName = function(e) {
var t = n.monthNames, r = n.abbreviatedMonthNames, i = e.toLowerCase();
for (var s = 0; s < t.length; s++) if (t[s].toLowerCase() == i || r[s].toLowerCase() == i) return s;
return -1;
}, e.isLeapYear = function(e) {
return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0;
}, e.getDaysInMonth = function(t, n) {
return [ 31, e.isLeapYear(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][n];
}, e.getTimezoneAbbreviation = function(e) {
var t = n.timezones, r;
for (var i = 0; i < t.length; i++) if (t[i].offset === e) return t[i].name;
return null;
}, e.getTimezoneOffset = function(e) {
var t = n.timezones, r;
for (var i = 0; i < t.length; i++) if (t[i].name === e.toUpperCase()) return t[i].offset;
return null;
}, t.clone = function() {
return new Date(this.getTime());
}, t.compareTo = function(e) {
return Date.compare(this, e);
}, t.equals = function(e) {
return Date.equals(this, e || new Date);
}, t.between = function(e, t) {
return this.getTime() >= e.getTime() && this.getTime() <= t.getTime();
}, t.isAfter = function(e) {
return this.compareTo(e || new Date) === 1;
}, t.isBefore = function(e) {
return this.compareTo(e || new Date) === -1;
}, t.isToday = t.isSameDay = function(e) {
return this.clone().clearTime().equals((e || new Date).clone().clearTime());
}, t.addMilliseconds = function(e) {
return this.setMilliseconds(this.getMilliseconds() + e * 1), this;
}, t.addSeconds = function(e) {
return this.addMilliseconds(e * 1e3);
}, t.addMinutes = function(e) {
return this.addMilliseconds(e * 6e4);
}, t.addHours = function(e) {
return this.addMilliseconds(e * 36e5);
}, t.addDays = function(e) {
return this.setDate(this.getDate() + e * 1), this;
}, t.addWeeks = function(e) {
return this.addDays(e * 7);
}, t.addMonths = function(t) {
var n = this.getDate();
return this.setDate(1), this.setMonth(this.getMonth() + t * 1), this.setDate(Math.min(n, e.getDaysInMonth(this.getFullYear(), this.getMonth()))), this;
}, t.addYears = function(e) {
return this.addMonths(e * 12);
}, t.add = function(e) {
if (typeof e == "number") return this._orient = e, this;
var t = e;
return t.milliseconds && this.addMilliseconds(t.milliseconds), t.seconds && this.addSeconds(t.seconds), t.minutes && this.addMinutes(t.minutes), t.hours && this.addHours(t.hours), t.weeks && this.addWeeks(t.weeks), t.months && this.addMonths(t.months), t.years && this.addYears(t.years), t.days && this.addDays(t.days), this;
};
var i, s, o;
t.getWeek = function() {
var e, t, n, r, u, a, f, l, c, h;
return i = i ? i : this.getFullYear(), s = s ? s : this.getMonth() + 1, o = o ? o : this.getDate(), s <= 2 ? (e = i - 1, t = (e / 4 | 0) - (e / 100 | 0) + (e / 400 | 0), n = ((e - 1) / 4 | 0) - ((e - 1) / 100 | 0) + ((e - 1) / 400 | 0), c = t - n, u = 0, a = o - 1 + 31 * (s - 1)) : (e = i, t = (e / 4 | 0) - (e / 100 | 0) + (e / 400 | 0), n = ((e - 1) / 4 | 0) - ((e - 1) / 100 | 0) + ((e - 1) / 400 | 0), c = t - n, u = c + 1, a = o + (153 * (s - 3) + 2) / 5 + 58 + c), f = (e + t) % 7, r = (a + f - u) % 7, l = a + 3 - r | 0, l < 0 ? h = 53 - ((f - c) / 5 | 0) : l > 364 + c ? h = 1 : h = (l / 7 | 0) + 1, i = s = o = null, h;
}, t.getISOWeek = function() {
return i = this.getUTCFullYear(), s = this.getUTCMonth() + 1, o = this.getUTCDate(), r(this.getWeek());
}, t.setWeek = function(e) {
return this.moveToDayOfWeek(1).addWeeks(e - this.getWeek());
};
var u = function(e, t, n, r) {
if (typeof e == "undefined") return !1;
if (typeof e != "number") throw new TypeError(e + " is not a Number.");
if (e < t || e > n) throw new RangeError(e + " is not a valid value for " + r + ".");
return !0;
};
e.validateMillisecond = function(e) {
return u(e, 0, 999, "millisecond");
}, e.validateSecond = function(e) {
return u(e, 0, 59, "second");
}, e.validateMinute = function(e) {
return u(e, 0, 59, "minute");
}, e.validateHour = function(e) {
return u(e, 0, 23, "hour");
}, e.validateDay = function(t, n, r) {
return u(t, 1, e.getDaysInMonth(n, r), "day");
}, e.validateMonth = function(e) {
return u(e, 0, 11, "month");
}, e.validateYear = function(e) {
return u(e, 0, 9999, "year");
}, t.set = function(t) {
return e.validateMillisecond(t.millisecond) && this.addMilliseconds(t.millisecond - this.getMilliseconds()), e.validateSecond(t.second) && this.addSeconds(t.second - this.getSeconds()), e.validateMinute(t.minute) && this.addMinutes(t.minute - this.getMinutes()), e.validateHour(t.hour) && this.addHours(t.hour - this.getHours()), e.validateMonth(t.month) && this.addMonths(t.month - this.getMonth()), e.validateYear(t.year) && this.addYears(t.year - this.getFullYear()), e.validateDay(t.day, this.getFullYear(), this.getMonth()) && this.addDays(t.day - this.getDate()), t.timezone && this.setTimezone(t.timezone), t.timezoneOffset && this.setTimezoneOffset(t.timezoneOffset), t.week && u(t.week, 0, 53, "week") && this.setWeek(t.week), this;
}, t.moveToFirstDayOfMonth = function() {
return this.set({
day: 1
});
}, t.moveToLastDayOfMonth = function() {
return this.set({
day: e.getDaysInMonth(this.getFullYear(), this.getMonth())
});
}, t.moveToNthOccurrence = function(e, t) {
var n = 0;
if (t > 0) n = t - 1; else if (t === -1) return this.moveToLastDayOfMonth(), this.getDay() !== e && this.moveToDayOfWeek(e, -1), this;
return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(e, 1).addWeeks(n);
}, t.moveToDayOfWeek = function(e, t) {
var n = (e - this.getDay() + 7 * (t || 1)) % 7;
return this.addDays(n === 0 ? n += 7 * (t || 1) : n);
}, t.moveToMonth = function(e, t) {
var n = (e - this.getMonth() + 12 * (t || 1)) % 12;
return this.addMonths(n === 0 ? n += 12 * (t || 1) : n);
}, t.getOrdinalNumber = function() {
return Math.ceil((this.clone().clearTime() - new Date(this.getFullYear(), 0, 1)) / 864e5) + 1;
}, t.getTimezone = function() {
return e.getTimezoneAbbreviation(this.getUTCOffset());
}, t.setTimezoneOffset = function(e) {
var t = this.getTimezoneOffset(), n = Number(e) * -6 / 10;
return this.addMinutes(n - t);
}, t.setTimezone = function(t) {
return this.setTimezoneOffset(e.getTimezoneOffset(t));
}, t.hasDaylightSavingTime = function() {
return Date.today().set({
month: 0,
day: 1
}).getTimezoneOffset() !== Date.today().set({
month: 6,
day: 1
}).getTimezoneOffset();
}, t.isDaylightSavingTime = function() {
return Date.today().set({
month: 0,
day: 1
}).getTimezoneOffset() != this.getTimezoneOffset();
}, t.getUTCOffset = function() {
var e = this.getTimezoneOffset() * -10 / 6, t;
return e < 0 ? (t = (e - 1e4).toString(), t.charAt(0) + t.substr(2)) : (t = (e + 1e4).toString(), "+" + t.substr(1));
}, t.getElapsed = function(e) {
return (e || new Date) - this;
}, t.toISOString || (t.toISOString = function() {
function e(e) {
return e < 10 ? "0" + e : e;
}
return '"' + this.getUTCFullYear() + "-" + e(this.getUTCMonth() + 1) + "-" + e(this.getUTCDate()) + "T" + e(this.getUTCHours()) + ":" + e(this.getUTCMinutes()) + ":" + e(this.getUTCSeconds()) + 'Z"';
}), t._toString = t.toString, t.toString = function(e) {
var t = this;
if (e && e.length == 1) {
var i = n.formatPatterns;
t.t = t.toString;
switch (e) {
case "d":
return t.t(i.shortDate);
case "D":
return t.t(i.longDate);
case "F":
return t.t(i.fullDateTime);
case "m":
return t.t(i.monthDay);
case "r":
return t.t(i.rfc1123);
case "s":
return t.t(i.sortableDateTime);
case "t":
return t.t(i.shortTime);
case "T":
return t.t(i.longTime);
case "u":
return t.t(i.universalSortableDateTime);
case "y":
return t.t(i.yearMonth);
}
}
var s = function(e) {
switch (e * 1) {
case 1:
case 21:
case 31:
return "st";
case 2:
case 22:
return "nd";
case 3:
case 23:
return "rd";
default:
return "th";
}
};
return e ? e.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, function(e) {
if (e.charAt(0) === "\\") return e.replace("\\", "");
t.h = t.getHours;
switch (e) {
case "hh":
return r(t.h() < 13 ? t.h() === 0 ? 12 : t.h() : t.h() - 12);
case "h":
return t.h() < 13 ? t.h() === 0 ? 12 : t.h() : t.h() - 12;
case "HH":
return r(t.h());
case "H":
return t.h();
case "mm":
return r(t.getMinutes());
case "m":
return t.getMinutes();
case "ss":
return r(t.getSeconds());
case "s":
return t.getSeconds();
case "yyyy":
return r(t.getFullYear(), 4);
case "yy":
return r(t.getFullYear());
case "dddd":
return n.dayNames[t.getDay()];
case "ddd":
return n.abbreviatedDayNames[t.getDay()];
case "dd":
return r(t.getDate());
case "d":
return t.getDate();
case "MMMM":
return n.monthNames[t.getMonth()];
case "MMM":
return n.abbreviatedMonthNames[t.getMonth()];
case "MM":
return r(t.getMonth() + 1);
case "M":
return t.getMonth() + 1;
case "t":
return t.h() < 12 ? n.amDesignator.substring(0, 1) : n.pmDesignator.substring(0, 1);
case "tt":
return t.h() < 12 ? n.amDesignator : n.pmDesignator;
case "S":
return s(t.getDate());
default:
return e;
}
}) : this._toString();
};
}(), function() {
Date.Parsing = {
Exception: function(e) {
this.message = "Parse error at '" + e.substring(0, 10) + " ...'";
}
};
var e = Date.Parsing, t = e.Operators = {
rtoken: function(t) {
return function(n) {
var i = n.match(t);
if (i) return [ i[0], n.substring(i[0].length) ];
throw new e.Exception(n);
};
},
token: function(e) {
return function(e) {
return t.rtoken(new RegExp("^s*" + e + "s*"))(e);
};
},
stoken: function(e) {
return t.rtoken(new RegExp("^" + e));
},
until: function(e) {
return function(t) {
var n = [], r = null;
while (t.length) {
try {
r = e.call(this, t);
} catch (i) {
n.push(r[0]), t = r[1];
continue;
}
break;
}
return [ n, t ];
};
},
many: function(e) {
return function(t) {
var n = [], r = null;
while (t.length) {
try {
r = e.call(this, t);
} catch (i) {
return [ n, t ];
}
n.push(r[0]), t = r[1];
}
return [ n, t ];
};
},
optional: function(e) {
return function(t) {
var n = null;
try {
n = e.call(this, t);
} catch (r) {
return [ null, t ];
}
return [ n[0], n[1] ];
};
},
not: function(t) {
return function(n) {
try {
t.call(this, n);
} catch (r) {
return [ null, n ];
}
throw new e.Exception(n);
};
},
ignore: function(e) {
return e ? function(t) {
var n = null;
return n = e.call(this, t), [ null, n[1] ];
} : null;
},
product: function() {
var e = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = [];
for (var i = 0; i < e.length; i++) r.push(t.each(e[i], n));
return r;
},
cache: function(t) {
var n = {}, r = null;
return function(i) {
try {
r = n[i] = n[i] || t.call(this, i);
} catch (s) {
r = n[i] = s;
}
if (r instanceof e.Exception) throw r;
return r;
};
},
any: function() {
var t = arguments;
return function(n) {
var r = null;
for (var i = 0; i < t.length; i++) {
if (t[i] == null) continue;
try {
r = t[i].call(this, n);
} catch (s) {
r = null;
}
if (r) return r;
}
throw new e.Exception(n);
};
},
each: function() {
var t = arguments;
return function(n) {
var r = [], i = null;
for (var s = 0; s < t.length; s++) {
if (t[s] == null) continue;
try {
i = t[s].call(this, n);
} catch (o) {
throw new e.Exception(n);
}
r.push(i[0]), n = i[1];
}
return [ r, n ];
};
},
all: function() {
var e = arguments, t = t;
return t.each(t.optional(e));
},
sequence: function(n, r, i) {
return r = r || t.rtoken(/^\s*/), i = i || null, n.length == 1 ? n[0] : function(t) {
var s = null, o = null, u = [];
for (var a = 0; a < n.length; a++) {
try {
s = n[a].call(this, t);
} catch (f) {
break;
}
u.push(s[0]);
try {
o = r.call(this, s[1]);
} catch (l) {
o = null;
break;
}
t = o[1];
}
if (!s) throw new e.Exception(t);
if (o) throw new e.Exception(o[1]);
if (i) try {
s = i.call(this, s[1]);
} catch (h) {
throw new e.Exception(s[1]);
}
return [ u, s ? s[1] : t ];
};
},
between: function(e, n, i) {
i = i || e;
var s = t.each(t.ignore(e), n, t.ignore(i));
return function(e) {
var t = s.call(this, e);
return [ [ t[0][0], r[0][2] ], t[1] ];
};
},
list: function(e, n, r) {
return n = n || t.rtoken(/^\s*/), r = r || null, e instanceof Array ? t.each(t.product(e.slice(0, -1), t.ignore(n)), e.slice(-1), t.ignore(r)) : t.each(t.many(t.each(e, t.ignore(n))), px, t.ignore(r));
},
set: function(n, r, i) {
return r = r || t.rtoken(/^\s*/), i = i || null, function(s) {
var o = null, u = null, a = null, f = null, l = [ [], s ], h = !1;
for (var p = 0; p < n.length; p++) {
a = null, u = null, o = null, h = n.length == 1;
try {
o = n[p].call(this, s);
} catch (v) {
continue;
}
f = [ [ o[0] ], o[1] ];
if (o[1].length > 0 && !h) try {
a = r.call(this, o[1]);
} catch (m) {
h = !0;
} else h = !0;
!h && a[1].length === 0 && (h = !0);
if (!h) {
var g = [];
for (var y = 0; y < n.length; y++) p != y && g.push(n[y]);
u = t.set(g, r).call(this, a[1]), u[0].length > 0 && (f[0] = f[0].concat(u[0]), f[1] = u[1]);
}
f[1].length < l[1].length && (l = f);
if (l[1].length === 0) break;
}
if (l[0].length === 0) return l;
if (i) {
try {
a = i.call(this, l[1]);
} catch (b) {
throw new e.Exception(l[1]);
}
l[1] = a[1];
}
return l;
};
},
forward: function(e, t) {
return function(n) {
return e[t].call(this, n);
};
},
replace: function(e, t) {
return function(n) {
var r = e.call(this, n);
return [ t, r[1] ];
};
},
process: function(e, t) {
return function(n) {
var r = e.call(this, n);
return [ t.call(this, r[0]), r[1] ];
};
},
min: function(t, n) {
return function(r) {
var i = n.call(this, r);
if (i[0].length < t) throw new e.Exception(r);
return i;
};
}
}, n = function(e) {
return function() {
var t = null, n = [];
arguments.length > 1 ? t = Array.prototype.slice.call(arguments) : arguments[0] instanceof Array && (t = arguments[0]);
if (!t) return e.apply(null, arguments);
for (var r = 0, i = t.shift(); r < i.length; r++) return t.unshift(i[r]), n.push(e.apply(null, t)), t.shift(), n;
};
}, i = "optional not ignore cache".split(/\s/);
for (var s = 0; s < i.length; s++) t[i[s]] = n(t[i[s]]);
var o = function(e) {
return function() {
return arguments[0] instanceof Array ? e.apply(null, arguments[0]) : e.apply(null, arguments);
};
}, u = "each any all".split(/\s/);
for (var a = 0; a < u.length; a++) t[u[a]] = o(t[u[a]]);
}(), function() {
var e = Date, t = e.prototype, n = e.CultureInfo, r = function(e) {
var t = [];
for (var n = 0; n < e.length; n++) e[n] instanceof Array ? t = t.concat(r(e[n])) : e[n] && t.push(e[n]);
return t;
};
e.Grammar = {}, e.Translator = {
hour: function(e) {
return function() {
this.hour = Number(e);
};
},
minute: function(e) {
return function() {
this.minute = Number(e);
};
},
second: function(e) {
return function() {
this.second = Number(e);
};
},
meridian: function(e) {
return function() {
this.meridian = e.slice(0, 1).toLowerCase();
};
},
timezone: function(e) {
return function() {
var t = e.replace(/[^\d\+\-]/g, "");
t.length ? this.timezoneOffset = Number(t) : this.timezone = e.toLowerCase();
};
},
day: function(e) {
var t = e[0];
return function() {
this.day = Number(t.match(/\d+/)[0]);
};
},
month: function(e) {
return function() {
this.month = e.length == 3 ? "jan feb mar apr may jun jul aug sep oct nov dec".indexOf(e) / 4 : Number(e) - 1;
};
},
year: function(e) {
return function() {
var t = Number(e);
this.year = e.length > 2 ? t : t + (t + 2e3 < n.twoDigitYearMax ? 2e3 : 1900);
};
},
rday: function(e) {
return function() {
switch (e) {
case "yesterday":
this.days = -1;
break;
case "tomorrow":
this.days = 1;
break;
case "today":
this.days = 0;
break;
case "now":
this.days = 0, this.now = !0;
}
};
},
finishExact: function(t) {
t = t instanceof Array ? t : [ t ];
for (var n = 0; n < t.length; n++) t[n] && t[n].call(this);
var r = new Date;
(this.hour || this.minute) && !this.month && !this.year && !this.day && (this.day = r.getDate()), this.year || (this.year = r.getFullYear()), !this.month && this.month !== 0 && (this.month = r.getMonth()), this.day || (this.day = 1), this.hour || (this.hour = 0), this.minute || (this.minute = 0), this.second || (this.second = 0), this.meridian && this.hour && (this.meridian == "p" && this.hour < 12 ? this.hour = this.hour + 12 : this.meridian == "a" && this.hour == 12 && (this.hour = 0));
if (this.day > e.getDaysInMonth(this.year, this.month)) throw new RangeError(this.day + " is not a valid value for days.");
var i = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
return this.timezone ? i.set({
timezone: this.timezone
}) : this.timezoneOffset && i.set({
timezoneOffset: this.timezoneOffset
}), i;
},
finish: function(t) {
t = t instanceof Array ? r(t) : [ t ];
if (t.length === 0) return null;
for (var n = 0; n < t.length; n++) typeof t[n] == "function" && t[n].call(this);
var i = e.today();
if (this.now && !this.unit && !this.operator) return new Date;
this.now && (i = new Date);
var s = !!(this.days && this.days !== null || this.orient || this.operator), o, u, a;
a = this.orient == "past" || this.operator == "subtract" ? -1 : 1, !this.now && "hour minute second".indexOf(this.unit) != -1 && i.setTimeToNow(), (this.month || this.month === 0) && "year day hour minute second".indexOf(this.unit) != -1 && (this.value = this.month + 1, this.month = null, s = !0);
if (!s && this.weekday && !this.day && !this.days) {
var f = Date[this.weekday]();
this.day = f.getDate(), this.month || (this.month = f.getMonth()), this.year = f.getFullYear();
}
s && this.weekday && this.unit != "month" && (this.unit = "day", o = e.getDayNumberFromName(this.weekday) - i.getDay(), u = 7, this.days = o ? (o + a * u) % u : a * u), this.month && this.unit == "day" && this.operator && (this.value = this.month + 1, this.month = null), this.value != null && this.month != null && this.year != null && (this.day = this.value * 1), this.month && !this.day && this.value && (i.set({
day: this.value * 1
}), s || (this.day = this.value * 1)), !this.month && this.value && this.unit == "month" && !this.now && (this.month = this.value, s = !0), s && (this.month || this.month === 0) && this.unit != "year" && (this.unit = "month", o = this.month - i.getMonth(), u = 12, this.months = o ? (o + a * u) % u : a * u, this.month = null), this.unit || (this.unit = "day");
if (!this.value && this.operator && this.operator !== null && this[this.unit + "s"] && this[this.unit + "s"] !== null) this[this.unit + "s"] = this[this.unit + "s"] + (this.operator == "add" ? 1 : -1) + (this.value || 0) * a; else if (this[this.unit + "s"] == null || this.operator != null) this.value || (this.value = 1), this[this.unit + "s"] = this.value * a;
this.meridian && this.hour && (this.meridian == "p" && this.hour < 12 ? this.hour = this.hour + 12 : this.meridian == "a" && this.hour == 12 && (this.hour = 0));
if (this.weekday && !this.day && !this.days) {
var f = Date[this.weekday]();
this.day = f.getDate(), f.getMonth() !== i.getMonth() && (this.month = f.getMonth());
}
return (this.month || this.month === 0) && !this.day && (this.day = 1), !this.orient && !this.operator && this.unit == "week" && this.value && !this.day && !this.month ? Date.today().setWeek(this.value) : (s && this.timezone && this.day && this.days && (this.day = this.days), s ? i.add(this) : i.set(this));
}
};
var i = e.Parsing.Operators, s = e.Grammar, o = e.Translator, u;
s.datePartDelimiter = i.rtoken(/^([\s\-\.\,\/\x27]+)/), s.timePartDelimiter = i.stoken(":"), s.whiteSpace = i.rtoken(/^\s*/), s.generalDelimiter = i.rtoken(/^(([\s\,]|at|@|on)+)/);
var a = {};
s.ctoken = function(e) {
var t = a[e];
if (!t) {
var r = n.regexPatterns, s = e.split(/\s+/), o = [];
for (var u = 0; u < s.length; u++) o.push(i.replace(i.rtoken(r[s[u]]), s[u]));
t = a[e] = i.any.apply(null, o);
}
return t;
}, s.ctoken2 = function(e) {
return i.rtoken(n.regexPatterns[e]);
}, s.h = i.cache(i.process(i.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), o.hour)), s.hh = i.cache(i.process(i.rtoken(/^(0[0-9]|1[0-2])/), o.hour)), s.H = i.cache(i.process(i.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), o.hour)), s.HH = i.cache(i.process(i.rtoken(/^([0-1][0-9]|2[0-3])/), o.hour)), s.m = i.cache(i.process(i.rtoken(/^([0-5][0-9]|[0-9])/), o.minute)), s.mm = i.cache(i.process(i.rtoken(/^[0-5][0-9]/), o.minute)), s.s = i.cache(i.process(i.rtoken(/^([0-5][0-9]|[0-9])/), o.second)), s.ss = i.cache(i.process(i.rtoken(/^[0-5][0-9]/), o.second)), s.hms = i.cache(i.sequence([ s.H, s.m, s.s ], s.timePartDelimiter)), s.t = i.cache(i.process(s.ctoken2("shortMeridian"), o.meridian)), s.tt = i.cache(i.process(s.ctoken2("longMeridian"), o.meridian)), s.z = i.cache(i.process(i.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), o.timezone)), s.zz = i.cache(i.process(i.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), o.timezone)), s.zzz = i.cache(i.process(s.ctoken2("timezone"), o.timezone)), s.timeSuffix = i.each(i.ignore(s.whiteSpace), i.set([ s.tt, s.zzz ])), s.time = i.each(i.optional(i.ignore(i.stoken("T"))), s.hms, s.timeSuffix), s.d = i.cache(i.process(i.each(i.rtoken(/^([0-2]\d|3[0-1]|\d)/), i.optional(s.ctoken2("ordinalSuffix"))), o.day)), s.dd = i.cache(i.process(i.each(i.rtoken(/^([0-2]\d|3[0-1])/), i.optional(s.ctoken2("ordinalSuffix"))), o.day)), s.ddd = s.dddd = i.cache(i.process(s.ctoken("sun mon tue wed thu fri sat"), function(e) {
return function() {
this.weekday = e;
};
})), s.M = i.cache(i.process(i.rtoken(/^(1[0-2]|0\d|\d)/), o.month)), s.MM = i.cache(i.process(i.rtoken(/^(1[0-2]|0\d)/), o.month)), s.MMM = s.MMMM = i.cache(i.process(s.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), o.month)), s.y = i.cache(i.process(i.rtoken(/^(\d\d?)/), o.year)), s.yy = i.cache(i.process(i.rtoken(/^(\d\d)/), o.year)), s.yyy = i.cache(i.process(i.rtoken(/^(\d\d?\d?\d?)/), o.year)), s.yyyy = i.cache(i.process(i.rtoken(/^(\d\d\d\d)/), o.year)), u = function() {
return i.each(i.any.apply(null, arguments), i.not(s.ctoken2("timeContext")));
}, s.day = u(s.d, s.dd), s.month = u(s.M, s.MMM), s.year = u(s.yyyy, s.yy), s.orientation = i.process(s.ctoken("past future"), function(e) {
return function() {
this.orient = e;
};
}), s.operator = i.process(s.ctoken("add subtract"), function(e) {
return function() {
this.operator = e;
};
}), s.rday = i.process(s.ctoken("yesterday tomorrow today now"), o.rday), s.unit = i.process(s.ctoken("second minute hour day week month year"), function(e) {
return function() {
this.unit = e;
};
}), s.value = i.process(i.rtoken(/^\d\d?(st|nd|rd|th)?/), function(e) {
return function() {
this.value = e.replace(/\D/g, "");
};
}), s.expression = i.set([ s.rday, s.operator, s.value, s.unit, s.orientation, s.ddd, s.MMM ]), u = function() {
return i.set(arguments, s.datePartDelimiter);
}, s.mdy = u(s.ddd, s.month, s.day, s.year), s.ymd = u(s.ddd, s.year, s.month, s.day), s.dmy = u(s.ddd, s.day, s.month, s.year), s.date = function(e) {
return (s[n.dateElementOrder] || s.mdy).call(this, e);
}, s.format = i.process(i.many(i.any(i.process(i.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function(t) {
if (s[t]) return s[t];
throw e.Parsing.Exception(t);
}), i.process(i.rtoken(/^[^dMyhHmstz]+/), function(e) {
return i.ignore(i.stoken(e));
}))), function(e) {
return i.process(i.each.apply(null, e), o.finishExact);
});
var f = {}, l = function(e) {
return f[e] = f[e] || s.format(e)[0];
};
s.formats = function(e) {
if (e instanceof Array) {
var t = [];
for (var n = 0; n < e.length; n++) t.push(l(e[n]));
return i.any.apply(null, t);
}
return l(e);
}, s._formats = s.formats([ '"yyyy-MM-ddTHH:mm:ssZ"', "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ssz", "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-ddTHH:mmZ", "yyyy-MM-ddTHH:mmz", "yyyy-MM-ddTHH:mm", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "MMddyyyy", "ddMMyyyy", "Mddyyyy", "ddMyyyy", "Mdyyyy", "dMyyyy", "yyyy", "Mdyy", "dMyy", "d" ]), s._start = i.process(i.set([ s.date, s.time, s.expression ], s.generalDelimiter, s.whiteSpace), o.finish), s.start = function(e) {
try {
var t = s._formats.call({}, e);
if (t[1].length === 0) return t;
} catch (n) {}
return s._start.call({}, e);
}, e._parse = e.parse, e.parse = function(t) {
var n = null;
if (!t) return null;
if (t instanceof Date) return t;
try {
n = e.Grammar.start.call({}, t.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
} catch (r) {
return null;
}
return n[1].length === 0 ? n[0] : null;
}, e.getParseFunction = function(t) {
var n = e.Grammar.formats(t);
return function(e) {
var t = null;
try {
t = n.call({}, e);
} catch (r) {
return null;
}
return t[1].length === 0 ? t[0] : null;
};
}, e.parseExact = function(t, n) {
return e.getParseFunction(n)(t);
};
}(), this.JSON || (JSON = {}), function() {
function f(e) {
return e < 10 ? "0" + e : e;
}
function quote(e) {
return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
var t = meta[e];
return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + e + '"';
}
function str(e, t) {
var n, r, i, s, o = gap, u, a = t[e];
a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
switch (typeof a) {
case "string":
return quote(a);
case "number":
return isFinite(a) ? String(a) : "null";
case "boolean":
case "null":
return String(a);
case "object":
if (!a) return "null";
gap += indent, u = [];
if (Object.prototype.toString.apply(a) === "[object Array]") {
s = a.length;
for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i;
}
if (rep && typeof rep == "object") {
s = rep.length;
for (n = 0; n < s; n += 1) r = rep[n], typeof r == "string" && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
} else for (r in a) Object.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i;
}
}
typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z";
}, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
return this.valueOf();
});
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
"\b": "\\b",
"	": "\\t",
"\n": "\\n",
"\f": "\\f",
"\r": "\\r",
'"': '\\"',
"\\": "\\\\"
}, rep;
typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
var r;
gap = "", indent = "";
if (typeof n == "number") for (r = 0; r < n; r += 1) indent += " "; else typeof n == "string" && (indent = n);
rep = t;
if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
"": e
});
throw new Error("JSON.stringify");
}), typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
function walk(e, t) {
var n, r, i = e[t];
if (i && typeof i == "object") for (n in i) Object.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
return reviver.call(e, t, i);
}
var j;
cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
}));
if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
"": j
}, "") : j;
throw new SyntaxError("JSON.parse");
});
}(), function() {
var e = this, t = e._, n = {}, r = Array.prototype, i = Object.prototype, s = Function.prototype, o = r.slice, u = r.unshift, a = i.toString, f = i.hasOwnProperty, l = r.forEach, c = r.map, h = r.reduce, p = r.reduceRight, d = r.filter, v = r.every, m = r.some, g = r.indexOf, y = r.lastIndexOf, b = Array.isArray, w = Object.keys, E = s.bind, S = function(e) {
return new k(e);
};
typeof module != "undefined" && module.exports ? (module.exports = S, S._ = S) : e._ = S, S.VERSION = "1.1.6";
var x = S.each = S.forEach = function(e, t, r) {
if (e == null) return;
if (l && e.forEach === l) e.forEach(t, r); else if (S.isNumber(e.length)) {
for (var i = 0, s = e.length; i < s; i++) if (t.call(r, e[i], i, e) === n) return;
} else for (var o in e) if (f.call(e, o) && t.call(r, e[o], o, e) === n) return;
};
S.map = function(e, t, n) {
var r = [];
return e == null ? r : c && e.map === c ? e.map(t, n) : (x(e, function(e, i, s) {
r[r.length] = t.call(n, e, i, s);
}), r);
}, S.reduce = S.foldl = S.inject = function(e, t, n, r) {
var i = n !== void 0;
e == null && (e = []);
if (h && e.reduce === h) return r && (t = S.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
x(e, function(e, s, o) {
!i && s === 0 ? (n = e, i = !0) : n = t.call(r, n, e, s, o);
});
if (!i) throw new TypeError("Reduce of empty array with no initial value");
return n;
}, S.reduceRight = S.foldr = function(e, t, n, r) {
e == null && (e = []);
if (p && e.reduceRight === p) return r && (t = S.bind(t, r)), n !== void 0 ? e.reduceRight(t, n) : e.reduceRight(t);
var i = (S.isArray(e) ? e.slice() : S.toArray(e)).reverse();
return S.reduce(i, t, n, r);
}, S.find = S.detect = function(e, t, n) {
var r;
return T(e, function(e, i, s) {
if (t.call(n, e, i, s)) return r = e, !0;
}), r;
}, S.filter = S.select = function(e, t, n) {
var r = [];
return e == null ? r : d && e.filter === d ? e.filter(t, n) : (x(e, function(e, i, s) {
t.call(n, e, i, s) && (r[r.length] = e);
}), r);
}, S.reject = function(e, t, n) {
var r = [];
return e == null ? r : (x(e, function(e, i, s) {
t.call(n, e, i, s) || (r[r.length] = e);
}), r);
}, S.every = S.all = function(e, t, r) {
var i = !0;
return e == null ? i : v && e.every === v ? e.every(t, r) : (x(e, function(e, s, o) {
if (!(i = i && t.call(r, e, s, o))) return n;
}), i);
};
var T = S.some = S.any = function(e, t, r) {
t || (t = S.identity);
var i = !1;
return e == null ? i : m && e.some === m ? e.some(t, r) : (x(e, function(e, s, o) {
if (i = t.call(r, e, s, o)) return n;
}), i);
};
S.include = S.contains = function(e, t) {
var n = !1;
return e == null ? n : g && e.indexOf === g ? e.indexOf(t) != -1 : (T(e, function(e) {
if (n = e === t) return !0;
}), n);
}, S.invoke = function(e, t) {
var n = o.call(arguments, 2);
return S.map(e, function(e) {
return (t.call ? t || e : e[t]).apply(e, n);
});
}, S.pluck = function(e, t) {
return S.map(e, function(e) {
return e[t];
});
}, S.max = function(e, t, n) {
if (!t && S.isArray(e)) return Math.max.apply(Math, e);
var r = {
computed: -Infinity
};
return x(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o >= r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, S.min = function(e, t, n) {
if (!t && S.isArray(e)) return Math.min.apply(Math, e);
var r = {
computed: Infinity
};
return x(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o < r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, S.sortBy = function(e, t, n) {
return S.pluck(S.map(e, function(e, r, i) {
return {
value: e,
criteria: t.call(n, e, r, i)
};
}).sort(function(e, t) {
var n = e.criteria, r = t.criteria;
return n < r ? -1 : n > r ? 1 : 0;
}), "value");
}, S.sortedIndex = function(e, t, n) {
n || (n = S.identity);
var r = 0, i = e.length;
while (r < i) {
var s = r + i >> 1;
n(e[s]) < n(t) ? r = s + 1 : i = s;
}
return r;
}, S.toArray = function(e) {
return e ? e.toArray ? e.toArray() : S.isArray(e) ? e : S.isArguments(e) ? o.call(e) : S.values(e) : [];
}, S.size = function(e) {
return S.toArray(e).length;
}, S.first = S.head = function(e, t, n) {
return t != null && !n ? o.call(e, 0, t) : e[0];
}, S.rest = S.tail = function(e, t, n) {
return o.call(e, t == null || n ? 1 : t);
}, S.last = function(e) {
return e[e.length - 1];
}, S.compact = function(e) {
return S.filter(e, function(e) {
return !!e;
});
}, S.flatten = function(e) {
return S.reduce(e, function(e, t) {
return S.isArray(t) ? e.concat(S.flatten(t)) : (e[e.length] = t, e);
}, []);
}, S.without = function(e) {
var t = o.call(arguments, 1);
return S.filter(e, function(e) {
return !S.include(t, e);
});
}, S.uniq = S.unique = function(e, t) {
return S.reduce(e, function(e, n, r) {
if (0 == r || (t === !0 ? S.last(e) != n : !S.include(e, n))) e[e.length] = n;
return e;
}, []);
}, S.intersect = function(e) {
var t = o.call(arguments, 1);
return S.filter(S.uniq(e), function(e) {
return S.every(t, function(t) {
return S.indexOf(t, e) >= 0;
});
});
}, S.zip = function() {
var e = o.call(arguments), t = S.max(S.pluck(e, "length")), n = new Array(t);
for (var r = 0; r < t; r++) n[r] = S.pluck(e, "" + r);
return n;
}, S.indexOf = function(e, t, n) {
if (e == null) return -1;
var r, i;
if (n) return r = S.sortedIndex(e, t), e[r] === t ? r : -1;
if (g && e.indexOf === g) return e.indexOf(t);
for (r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
return -1;
}, S.lastIndexOf = function(e, t) {
if (e == null) return -1;
if (y && e.lastIndexOf === y) return e.lastIndexOf(t);
var n = e.length;
while (n--) if (e[n] === t) return n;
return -1;
}, S.range = function(e, t, n) {
arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = new Array(r);
while (i < r) s[i++] = e, e += n;
return s;
}, S.bind = function(e, t) {
if (e.bind === E && E) return E.apply(e, o.call(arguments, 1));
var n = o.call(arguments, 2);
return function() {
return e.apply(t, n.concat(o.call(arguments)));
};
}, S.bindAll = function(e) {
var t = o.call(arguments, 1);
return t.length == 0 && (t = S.functions(e)), x(t, function(t) {
e[t] = S.bind(e[t], e);
}), e;
}, S.memoize = function(e, t) {
var n = {};
return t || (t = S.identity), function() {
var r = t.apply(this, arguments);
return f.call(n, r) ? n[r] : n[r] = e.apply(this, arguments);
};
}, S.delay = function(e, t) {
var n = o.call(arguments, 2);
return setTimeout(function() {
return e.apply(e, n);
}, t);
}, S.defer = function(e) {
return S.delay.apply(S, [ e, 1 ].concat(o.call(arguments, 1)));
};
var N = function(e, t, n) {
var r;
return function() {
var i = this, s = arguments, o = function() {
r = null, e.apply(i, s);
};
n && clearTimeout(r);
if (n || !r) r = setTimeout(o, t);
};
};
S.throttle = function(e, t) {
return N(e, t, !1);
}, S.debounce = function(e, t) {
return N(e, t, !0);
}, S.once = function(e) {
var t = !1, n;
return function() {
return t ? n : (t = !0, n = e.apply(this, arguments));
};
}, S.wrap = function(e, t) {
return function() {
var n = [ e ].concat(o.call(arguments));
return t.apply(this, n);
};
}, S.compose = function() {
var e = o.call(arguments);
return function() {
var t = o.call(arguments);
for (var n = e.length - 1; n >= 0; n--) t = [ e[n].apply(this, t) ];
return t[0];
};
}, S.after = function(e, t) {
return function() {
if (--e < 1) return t.apply(this, arguments);
};
}, S.keys = w || function(e) {
if (e !== Object(e)) throw new TypeError("Invalid object");
var t = [];
for (var n in e) f.call(e, n) && (t[t.length] = n);
return t;
}, S.values = function(e) {
return S.map(e, S.identity);
}, S.functions = S.methods = function(e) {
return S.filter(S.keys(e), function(t) {
return S.isFunction(e[t]);
}).sort();
}, S.extend = function(e) {
return x(o.call(arguments, 1), function(t) {
for (var n in t) t[n] !== void 0 && (e[n] = t[n]);
}), e;
}, S.defaults = function(e) {
return x(o.call(arguments, 1), function(t) {
for (var n in t) e[n] == null && (e[n] = t[n]);
}), e;
}, S.clone = function(e) {
return S.isArray(e) ? e.slice() : S.extend({}, e);
}, S.tap = function(e, t) {
return t(e), e;
}, S.isEqual = function(e, t) {
if (e === t) return !0;
var n = typeof e, r = typeof t;
if (n != r) return !1;
if (e == t) return !0;
if (!e && t || e && !t) return !1;
e._chain && (e = e._wrapped), t._chain && (t = t._wrapped);
if (e.isEqual) return e.isEqual(t);
if (S.isDate(e) && S.isDate(t)) return e.getTime() === t.getTime();
if (S.isNaN(e) && S.isNaN(t)) return !1;
if (S.isRegExp(e) && S.isRegExp(t)) return e.source === t.source && e.global === t.global && e.ignoreCase === t.ignoreCase && e.multiline === t.multiline;
if (n !== "object") return !1;
if (e.length && e.length !== t.length) return !1;
var i = S.keys(e), s = S.keys(t);
if (i.length != s.length) return !1;
for (var o in e) if (!(o in t) || !S.isEqual(e[o], t[o])) return !1;
return !0;
}, S.isEmpty = function(e) {
if (S.isArray(e) || S.isString(e)) return e.length === 0;
for (var t in e) if (f.call(e, t)) return !1;
return !0;
}, S.isElement = function(e) {
return !!e && e.nodeType == 1;
}, S.isArray = b || function(e) {
return a.call(e) === "[object Array]";
}, S.isArguments = function(e) {
return !!e && !!f.call(e, "callee");
}, S.isFunction = function(e) {
return !!(e && e.constructor && e.call && e.apply);
}, S.isString = function(e) {
return !!(e === "" || e && e.charCodeAt && e.substr);
}, S.isNumber = function(e) {
return !!(e === 0 || e && e.toExponential && e.toFixed);
}, S.isNaN = function(e) {
return e !== e;
}, S.isBoolean = function(e) {
return e === !0 || e === !1;
}, S.isDate = function(e) {
return !!(e && e.getTimezoneOffset && e.setUTCFullYear);
}, S.isRegExp = function(e) {
return !(!(e && e.test && e.exec) || !e.ignoreCase && e.ignoreCase !== !1);
}, S.isNull = function(e) {
return e === null;
}, S.isUndefined = function(e) {
return e === void 0;
}, S.noConflict = function() {
return e._ = t, this;
}, S.identity = function(e) {
return e;
}, S.times = function(e, t, n) {
for (var r = 0; r < e; r++) t.call(n, r);
}, S.mixin = function(e) {
x(S.functions(e), function(t) {
A(t, S[t] = e[t]);
});
};
var C = 0;
S.uniqueId = function(e) {
var t = C++;
return e ? e + t : t;
}, S.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g
}, S.template = function(e, t) {
var n = S.templateSettings, r = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + e.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(n.interpolate, function(e, t) {
return "'," + t.replace(/\\'/g, "'") + ",'";
}).replace(n.evaluate || null, function(e, t) {
return "');" + t.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") + "__p.push('";
}).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');", i = new Function("obj", r);
return t ? i(t) : i;
};
var k = function(e) {
this._wrapped = e;
};
S.prototype = k.prototype;
var L = function(e, t) {
return t ? S(e).chain() : e;
}, A = function(e, t) {
k.prototype[e] = function() {
var e = o.call(arguments);
return u.call(e, this._wrapped), L(t.apply(S, e), this._chain);
};
};
S.mixin(S), x([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(e) {
var t = r[e];
k.prototype[e] = function() {
return t.apply(this._wrapped, arguments), L(this._wrapped, this._chain);
};
}), x([ "concat", "join", "slice" ], function(e) {
var t = r[e];
k.prototype[e] = function() {
return L(t.apply(this._wrapped, arguments), this._chain);
};
}), k.prototype.chain = function() {
return this._chain = !0, this;
}, k.prototype.value = function() {
return this._wrapped;
};
}(), function() {
function n(e, t) {
for (var n = []; t > 0; n[--t] = e) ;
return n.join("");
}
function r(e) {
return e ? i.escapeRegExp(e) : "\\s";
}
var e = this, t = String.prototype.trim, i = {
isBlank: function(e) {
return !!e.match(/^\s*$/);
},
capitalize: function(e) {
return e.charAt(0).toUpperCase() + e.substring(1).toLowerCase();
},
chop: function(e, t) {
t = t || e.length;
var n = [];
for (var r = 0; r < e.length; ) n.push(e.slice(r, r + t)), r += t;
return n;
},
clean: function(e) {
return i.strip(e.replace(/\s+/g, " "));
},
count: function(e, t) {
var n = 0, r;
for (var i = 0; i < e.length; ) r = e.indexOf(t, i), r >= 0 && n++, i = i + (r >= 0 ? r : 0) + t.length;
return n;
},
chars: function(e) {
return e.split("");
},
escapeHTML: function(e) {
return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
},
unescapeHTML: function(e) {
return String(e || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
},
escapeRegExp: function(e) {
return String(e || "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
},
insert: function(e, t, n) {
var r = e.split("");
return r.splice(t, 0, n), r.join("");
},
includes: function(e, t) {
return e.indexOf(t) !== -1;
},
join: function(e) {
e = String(e);
var t = "";
for (var n = 1; n < arguments.length; n += 1) t += String(arguments[n]), n !== arguments.length - 1 && (t += e);
return t;
},
lines: function(e) {
return e.split("\n");
},
splice: function(e, t, n, r) {
var i = e.split("");
return i.splice(t, n, r), i.join("");
},
startsWith: function(e, t) {
return e.length >= t.length && e.substring(0, t.length) === t;
},
endsWith: function(e, t) {
return e.length >= t.length && e.substring(e.length - t.length) === t;
},
succ: function(e) {
var t = e.split("");
return t.splice(e.length - 1, 1, String.fromCharCode(e.charCodeAt(e.length - 1) + 1)), t.join("");
},
titleize: function(e) {
var t = e.split(" "), n;
for (var r = 0; r < t.length; r++) n = t[r].split(""), typeof n[0] != "undefined" && (n[0] = n[0].toUpperCase()), r + 1 === t.length ? t[r] = n.join("") : t[r] = n.join("") + " ";
return t.join("");
},
camelize: function(e) {
return i.trim(e).replace(/(\-|_|\s)+(.)?/g, function(e, t, n) {
return n ? n.toUpperCase() : "";
});
},
underscored: function(e) {
return i.trim(e).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-|\s+/g, "_").toLowerCase();
},
dasherize: function(e) {
return i.trim(e).replace(/([a-z\d])([A-Z]+)/g, "$1-$2").replace(/^([A-Z]+)/, "-$1").replace(/\_|\s+/g, "-").toLowerCase();
},
trim: function(e, n) {
return !n && t ? t.call(e) : (n = r(n), e.replace(new RegExp("^[" + n + "]+|[" + n + "]+$", "g"), ""));
},
ltrim: function(e, t) {
return t = r(t), e.replace(new RegExp("^[" + t + "]+", "g"), "");
},
rtrim: function(e, t) {
return t = r(t), e.replace(new RegExp("[" + t + "]+$", "g"), "");
},
truncate: function(e, t, n) {
return n = n || "...", e.slice(0, t) + n;
},
words: function(e, t) {
return t = t || " ", e.split(t);
},
pad: function(e, t, r, i) {
var s = "", o = 0;
r ? r.length > 1 && (r = r[0]) : r = " ";
switch (i) {
case "right":
o = t - e.length, s = n(r, o), e += s;
break;
case "both":
o = t - e.length, s = {
left: n(r, Math.ceil(o / 2)),
right: n(r, Math.floor(o / 2))
}, e = s.left + e + s.right;
break;
default:
o = t - e.length, s = n(r, o), e = s + e;
}
return e;
},
lpad: function(e, t, n) {
return i.pad(e, t, n);
},
rpad: function(e, t, n) {
return i.pad(e, t, n, "right");
},
lrpad: function(e, t, n) {
return i.pad(e, t, n, "both");
},
sprintf: function() {
var e = 0, t, r = arguments[e++], i = [], s, o, u, a, f = "";
while (r) {
if (s = /^[^\x25]+/.exec(r)) i.push(s[0]); else if (s = /^\x25{2}/.exec(r)) i.push("%"); else {
if (!(s = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(r))) throw "Huh ?!";
if ((t = arguments[s[1] || e++]) == null || t == undefined) throw "Too few arguments.";
if (/[^s]/.test(s[7]) && typeof t != "number") throw "Expecting number but found " + typeof t;
switch (s[7]) {
case "b":
t = t.toString(2);
break;
case "c":
t = String.fromCharCode(t);
break;
case "d":
t = parseInt(t);
break;
case "e":
t = s[6] ? t.toExponential(s[6]) : t.toExponential();
break;
case "f":
t = s[6] ? parseFloat(t).toFixed(s[6]) : parseFloat(t);
break;
case "o":
t = t.toString(8);
break;
case "s":
t = (t = String(t)) && s[6] ? t.substring(0, s[6]) : t;
break;
case "u":
t = Math.abs(t);
break;
case "x":
t = t.toString(16);
break;
case "X":
t = t.toString(16).toUpperCase();
}
t = /[def]/.test(s[7]) && s[2] && t >= 0 ? "+" + t : t, u = s[3] ? s[3] == "0" ? "0" : s[3].charAt(1) : " ", a = s[5] - String(t).length - f.length, o = s[5] ? n(u, a) : "", i.push(f + (s[4] ? t + o : o + t));
}
r = r.substring(s[0].length);
}
return i.join("");
}
};
i.strip = i.trim, i.lstrip = i.ltrim, i.rstrip = i.rtrim, i.center = i.lrpad, i.ljust = i.lpad, i.rjust = i.rpad, typeof window == "undefined" && typeof module != "undefined" ? module.exports = i : typeof e._ != "undefined" ? e._.mixin(i) : e._ = i;
}(), shortcut = {
all_shortcuts: {},
add: function(e, t, n) {
var r = {
type: "keydown",
propagate: !1,
disable_in_input: !1,
target: document,
keycode: !1
};
if (!n) n = r; else for (var i in r) typeof n[i] == "undefined" && (n[i] = r[i]);
var s = n.target;
typeof n.target == "string" && (s = document.getElementById(n.target));
var o = this;
e = e.toLowerCase();
var u = function(r) {
r = r || window.event;
if (n.disable_in_input) {
var i;
r.target ? i = r.target : r.srcElement && (i = r.srcElement), i.nodeType == 3 && (i = i.parentNode);
if (i.tagName == "INPUT" || i.tagName == "TEXTAREA") return;
}
r.keyCode ? code = r.keyCode : r.which && (code = r.which);
var s = String.fromCharCode(code).toLowerCase();
code == 188 && (s = ","), code == 190 && (s = ".");
var o = e.split("+"), u = 0, a = {
"`": "~",
"1": "!",
"2": "@",
"3": "#",
"4": "$",
"5": "%",
"6": "^",
"7": "&",
"8": "*",
"9": "(",
"0": ")",
"-": "_",
"=": "+",
";": ":",
"'": '"',
",": "<",
".": ">",
"/": "?",
"\\": "|"
}, f = {
esc: 27,
escape: 27,
tab: 9,
space: 32,
"return": 13,
enter: 13,
backspace: 8,
scrolllock: 145,
scroll_lock: 145,
scroll: 145,
capslock: 20,
caps_lock: 20,
caps: 20,
numlock: 144,
num_lock: 144,
num: 144,
pause: 19,
"break": 19,
insert: 45,
home: 36,
"delete": 46,
end: 35,
pageup: 33,
page_up: 33,
pu: 33,
pagedown: 34,
page_down: 34,
pd: 34,
left: 37,
up: 38,
right: 39,
down: 40,
f1: 112,
f2: 113,
f3: 114,
f4: 115,
f5: 116,
f6: 117,
f7: 118,
f8: 119,
f9: 120,
f10: 121,
f11: 122,
f12: 123
}, l = {
shift: {
wanted: !1,
pressed: !1
},
ctrl: {
wanted: !1,
pressed: !1
},
alt: {
wanted: !1,
pressed: !1
},
meta: {
wanted: !1,
pressed: !1
}
};
r.ctrlKey && (l.ctrl.pressed = !0), r.shiftKey && (l.shift.pressed = !0), r.altKey && (l.alt.pressed = !0), r.metaKey && (l.meta.pressed = !0);
for (var c = 0; k = o[c], c < o.length; c++) k == "ctrl" || k == "control" ? (u++, l.ctrl.wanted = !0) : k == "shift" ? (u++, l.shift.wanted = !0) : k == "alt" ? (u++, l.alt.wanted = !0) : k == "meta" ? (u++, l.meta.wanted = !0) : k.length > 1 ? f[k] == code && u++ : n.keycode ? n["keycode"] == code && u++ : s == k ? u++ : a[s] && r.shiftKey && (s = a[s], s == k && u++);
if (u == o.length && l.ctrl.pressed == l.ctrl.wanted && l.shift.pressed == l.shift.wanted && l.alt.pressed == l.alt.wanted && l.meta.pressed == l.meta.wanted) {
t(r);
if (!n.propagate) return r.cancelBubble = !0, r.returnValue = !1, r.stopPropagation && (r.stopPropagation(), r.preventDefault()), !1;
}
};
this.all_shortcuts[e] = {
callback: u,
target: s,
event: n.type
}, s.addEventListener ? s.addEventListener(n.type, u, !1) : s.attachEvent ? s.attachEvent("on" + n.type, u) : s["on" + n.type] = u;
},
remove: function(e) {
e = e.toLowerCase();
var t = this.all_shortcuts[e];
delete this.all_shortcuts[e];
if (!t) return;
var n = t.event, r = t.target, i = t.callback;
r.detachEvent ? r.detachEvent("on" + n, i) : r.removeEventListener ? r.removeEventListener(n, i, !1) : r["on" + n] = !1;
}
};

var jaaulde = window.jaaulde || {};

jaaulde.utils = jaaulde.utils || {}, jaaulde.utils.cookies = function() {
var e, t, n, r, i = {
expiresAt: null,
path: "/",
domain: null,
secure: !1
};
return e = function(e) {
var t, n;
return typeof e != "object" || e === null ? t = i : (t = {
expiresAt: i.expiresAt,
path: i.path,
domain: i.domain,
secure: i.secure
}, typeof e.expiresAt == "object" && e.expiresAt instanceof Date ? t.expiresAt = e.expiresAt : typeof e.hoursToLive == "number" && e.hoursToLive !== 0 && (n = new Date, n.setTime(n.getTime() + e.hoursToLive * 60 * 60 * 1e3), t.expiresAt = n), typeof e.path == "string" && e.path !== "" && (t.path = e.path), typeof e.domain == "string" && e.domain !== "" && (t.domain = e.domain), e.secure === !0 && (t.secure = e.secure)), t;
}, t = function(t) {
return t = e(t), (typeof t.expiresAt == "object" && t.expiresAt instanceof Date ? "; expires=" + t.expiresAt.toGMTString() : "") + "; path=" + t.path + (typeof t.domain == "string" ? "; domain=" + t.domain : "") + (t.secure === !0 ? "; secure" : "");
}, n = function() {
var e = {}, t, n, r, i, s = document.cookie.split(";"), o;
for (t = 0; t < s.length; t += 1) {
n = s[t].split("="), r = n[0].replace(/^\s*/, "").replace(/\s*$/, "");
try {
i = decodeURIComponent(n[1]);
} catch (u) {
i = n[1];
}
if (typeof JSON == "object" && JSON !== null && typeof JSON.parse == "function") try {
o = i, i = JSON.parse(i);
} catch (a) {
i = o;
}
e[r] = i;
}
return e;
}, r = function() {}, r.prototype.get = function(e) {
var t, r, i = n();
if (typeof e == "string") t = typeof i[e] != "undefined" ? i[e] : null; else if (typeof e == "object" && e !== null) {
t = {};
for (r in e) typeof i[e[r]] != "undefined" ? t[e[r]] = i[e[r]] : t[e[r]] = null;
} else t = i;
return t;
}, r.prototype.filter = function(e) {
var t, r = {}, i = n();
typeof e == "string" && (e = new RegExp(e));
for (t in i) t.match(e) && (r[t] = i[t]);
return r;
}, r.prototype.set = function(e, n, r) {
if (typeof r != "object" || r === null) r = {};
if (typeof n == "undefined" || n === null) n = "", r.hoursToLive = -8760; else if (typeof n != "string") {
if (typeof JSON != "object" || JSON === null || typeof JSON.stringify != "function") throw new Error("cookies.set() received non-string value and could not serialize.");
n = JSON.stringify(n);
}
var i = t(r);
document.cookie = e + "=" + encodeURIComponent(n) + i;
}, r.prototype.del = function(e, t) {
var n = {}, r;
if (typeof t != "object" || t === null) t = {};
typeof e == "boolean" && e === !0 ? n = this.get() : typeof e == "string" && (n[e] = !0);
for (r in n) typeof r == "string" && r !== "" && this.set(r, null, t);
}, r.prototype.test = function() {
var e = !1, t = "cT", n = "data";
return this.set(t, n), this.get(t) === n && (this.del(t), e = !0), e;
}, r.prototype.setOptions = function(t) {
typeof t != "object" && (t = null), i = e(t);
}, new r;
}(), function() {
window.jQuery && function(e) {
e.cookies = jaaulde.utils.cookies;
var t = {
cookify: function(t) {
return this.each(function() {
var n, r = [ "name", "id" ], i, s = e(this), o;
for (n in r) if (!isNaN(n)) {
i = s.attr(r[n]);
if (typeof i == "string" && i !== "") {
s.is(":checkbox, :radio") ? s.attr("checked") && (o = s.val()) : s.is(":input") ? o = s.val() : o = s.html();
if (typeof o != "string" || o === "") o = null;
e.cookies.set(i, o, t);
break;
}
}
});
},
cookieFill: function() {
return this.each(function() {
var t, n, r = [ "name", "id" ], i, s = e(this), o;
n = function() {
return t = r.pop(), !!t;
};
while (n()) {
i = s.attr(t);
if (typeof i == "string" && i !== "") {
o = e.cookies.get(i), o !== null && (s.is(":checkbox, :radio") ? s.val() === o ? s.attr("checked", "checked") : s.removeAttr("checked") : s.is(":input") ? s.val(o) : s.html(o));
break;
}
}
});
},
cookieBind: function(t) {
return this.each(function() {
var n = e(this);
n.cookieFill().change(function() {
n.cookify(t);
});
});
}
};
e.each(t, function(t) {
e.fn[t] = this;
});
}(window.jQuery);
}();

var hexcase = 0, b64pad = "", OAuth;

OAuth == null && (OAuth = {}), OAuth.setProperties = function(t, n) {
if (t != null && n != null) for (var r in n) t[r] = n[r];
return t;
}, OAuth.setProperties(OAuth, {
percentEncode: function(t) {
if (t == null) return "";
if (t instanceof Array) {
var n = "";
for (var r = 0; r < t.length; ++t) n != "" && (n += "&"), n += OAuth.percentEncode(t[r]);
return n;
}
return t = encodeURIComponent(t), t = t.replace(/\!/g, "%21"), t = t.replace(/\*/g, "%2A"), t = t.replace(/\'/g, "%27"), t = t.replace(/\(/g, "%28"), t = t.replace(/\)/g, "%29"), t;
},
decodePercent: function(t) {
return t != null && (t = t.replace(/\+/g, " ")), decodeURIComponent(t);
},
getParameterList: function(t) {
if (t == null) return [];
if (typeof t != "object") return OAuth.decodeForm(t + "");
if (t instanceof Array) return t;
var n = [];
for (var r in t) n.push([ r, t[r] ]);
return n;
},
getParameterMap: function(t) {
if (t == null) return {};
if (typeof t != "object") return OAuth.getParameterMap(OAuth.decodeForm(t + ""));
if (t instanceof Array) {
var n = {};
for (var r = 0; r < t.length; ++r) {
var i = t[r][0];
n[i] === undefined && (n[i] = t[r][1]);
}
return n;
}
return t;
},
getParameter: function(t, n) {
if (t instanceof Array) {
for (var r = 0; r < t.length; ++r) if (t[r][0] == n) return t[r][1];
return null;
}
return OAuth.getParameterMap(t)[n];
},
formEncode: function(t) {
var n = "", r = OAuth.getParameterList(t);
for (var i = 0; i < r.length; ++i) {
var s = r[i][1];
s == null && (s = ""), n != "" && (n += "&"), n += OAuth.percentEncode(r[i][0]) + "=" + OAuth.percentEncode(s);
}
return n;
},
decodeForm: function(t) {
var n = [], r = t.split("&");
for (var i = 0; i < r.length; ++i) {
var s = r[i];
if (s == "") continue;
var o = s.indexOf("="), u, a;
o < 0 ? (u = OAuth.decodePercent(s), a = null) : (u = OAuth.decodePercent(s.substring(0, o)), a = OAuth.decodePercent(s.substring(o + 1))), n.push([ u, a ]);
}
return n;
},
setParameter: function(t, n, r) {
var i = t.parameters;
if (i instanceof Array) {
for (var s = 0; s < i.length; ++s) i[s][0] == n && (r === undefined ? i.splice(s, 1) : (i[s][1] = r, r = undefined));
r !== undefined && i.push([ n, r ]);
} else i = OAuth.getParameterMap(i), i[n] = r, t.parameters = i;
},
setParameters: function(t, n) {
var r = OAuth.getParameterList(n);
for (var i = 0; i < r.length; ++i) OAuth.setParameter(t, r[i][0], r[i][1]);
},
completeRequest: function(t, n) {
t.method == null && (t.method = "GET");
var r = OAuth.getParameterMap(t.parameters);
r.oauth_consumer_key == null && OAuth.setParameter(t, "oauth_consumer_key", n.consumerKey || ""), r.oauth_token == null && n.token != null && OAuth.setParameter(t, "oauth_token", n.token), r.oauth_version == null && OAuth.setParameter(t, "oauth_version", "1.0"), r.oauth_timestamp == null && OAuth.setParameter(t, "oauth_timestamp", OAuth.timestamp()), r.oauth_nonce == null && OAuth.setParameter(t, "oauth_nonce", OAuth.nonce(6)), OAuth.SignatureMethod.sign(t, n);
},
setTimestampAndNonce: function(t) {
OAuth.setParameter(t, "oauth_timestamp", OAuth.timestamp()), OAuth.setParameter(t, "oauth_nonce", OAuth.nonce(6));
},
addToURL: function(t, n) {
newURL = t;
if (n != null) {
var r = OAuth.formEncode(n);
if (r.length > 0) {
var i = t.indexOf("?");
i < 0 ? newURL += "?" : newURL += "&", newURL += r;
}
}
return newURL;
},
getAuthorizationHeader: function(t, n) {
var r = 'OAuth realm="' + OAuth.percentEncode(t) + '"', i = OAuth.getParameterList(n);
for (var s = 0; s < i.length; ++s) {
var o = i[s], u = o[0];
u.indexOf("oauth_") == 0 && (r += "," + OAuth.percentEncode(u) + '="' + OAuth.percentEncode(o[1]) + '"');
}
return r;
},
correctTimestampFromSrc: function(t) {
t = t || "oauth_timestamp";
var n = document.getElementsByTagName("script");
if (n == null || !n.length) return;
var r = n[n.length - 1].src;
if (!r) return;
var i = r.indexOf("?");
if (i < 0) return;
parameters = OAuth.getParameterMap(OAuth.decodeForm(r.substring(i + 1)));
var s = parameters[t];
if (s == null) return;
OAuth.correctTimestamp(s);
},
correctTimestamp: function(t) {
OAuth.timeCorrectionMsec = t * 1e3 - (new Date).getTime();
},
timeCorrectionMsec: 0,
timestamp: function() {
var t = (new Date).getTime() + OAuth.timeCorrectionMsec;
return Math.floor(t / 1e3);
},
nonce: function(t) {
var n = OAuth.nonce.CHARS, r = "";
for (var i = 0; i < t; ++i) {
var s = Math.floor(Math.random() * n.length);
r += n.substring(s, s + 1);
}
return r;
}
}), OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", OAuth.declareClass = function(t, n, r) {
var i = t[n];
t[n] = r;
if (r != null && i != null) for (var s in i) s != "prototype" && (r[s] = i[s]);
return r;
}, OAuth.declareClass(OAuth, "SignatureMethod", function() {}), OAuth.setProperties(OAuth.SignatureMethod.prototype, {
sign: function(t) {
var n = OAuth.SignatureMethod.getBaseString(t), r = this.getSignature(n);
return OAuth.setParameter(t, "oauth_signature", r), r;
},
initialize: function(t, n) {
var r;
n.accessorSecret != null && t.length > 9 && t.substring(t.length - 9) == "-Accessor" ? r = n.accessorSecret : r = n.consumerSecret, this.key = OAuth.percentEncode(r) + "&" + OAuth.percentEncode(n.tokenSecret);
}
}), OAuth.setProperties(OAuth.SignatureMethod, {
sign: function(t, n) {
var r = OAuth.getParameterMap(t.parameters).oauth_signature_method;
if (r == null || r == "") r = "HMAC-SHA1", OAuth.setParameter(t, "oauth_signature_method", r);
OAuth.SignatureMethod.newMethod(r, n).sign(t);
},
newMethod: function(t, n) {
var r = OAuth.SignatureMethod.REGISTERED[t];
if (r != null) {
var i = new r;
return i.initialize(t, n), i;
}
var s = new Error("signature_method_rejected"), o = "";
for (var u in OAuth.SignatureMethod.REGISTERED) o != "" && (o += "&"), o += OAuth.percentEncode(u);
throw s.oauth_acceptable_signature_methods = o, s;
},
REGISTERED: {},
registerMethodClass: function(t, n) {
for (var r = 0; r < t.length; ++r) OAuth.SignatureMethod.REGISTERED[t[r]] = n;
},
makeSubclass: function(t) {
var n = OAuth.SignatureMethod, r = function() {
n.call(this);
};
return r.prototype = new n, r.prototype.getSignature = t, r.prototype.constructor = r, r;
},
getBaseString: function(t) {
var n = t.action, r = n.indexOf("?"), i;
if (r < 0) i = t.parameters; else {
i = OAuth.decodeForm(n.substring(r + 1));
var s = OAuth.getParameterList(t.parameters);
for (var o = 0; o < s.length; ++o) i.push(s[o]);
}
return OAuth.percentEncode(t.method.toUpperCase()) + "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(n)) + "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(i));
},
normalizeUrl: function(t) {
var n = OAuth.SignatureMethod.parseUri(t), r = n.protocol.toLowerCase(), i = n.authority.toLowerCase(), s = r == "http" && n.port == 80 || r == "https" && n.port == 443;
if (s) {
var o = i.lastIndexOf(":");
o >= 0 && (i = i.substring(0, o));
}
var u = n.path;
return u || (u = "/"), r + "://" + i + u;
},
parseUri: function(t) {
var n = {
key: [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
parser: {
strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
}
}, r = n.parser.strict.exec(t), i = {}, s = 14;
while (s--) i[n.key[s]] = r[s] || "";
return i;
},
normalizeParameters: function(t) {
if (t == null) return "";
var n = OAuth.getParameterList(t), r = [];
for (var i = 0; i < n.length; ++i) {
var s = n[i];
s[0] != "oauth_signature" && r.push([ OAuth.percentEncode(s[0]) + " " + OAuth.percentEncode(s[1]), s ]);
}
r.sort(function(e, t) {
return e[0] < t[0] ? -1 : e[0] > t[0] ? 1 : 0;
});
var o = [];
for (var u = 0; u < r.length; ++u) o.push(r[u][1]);
return OAuth.formEncode(o);
}
}), OAuth.SignatureMethod.registerMethodClass([ "PLAINTEXT", "PLAINTEXT-Accessor" ], OAuth.SignatureMethod.makeSubclass(function(t) {
return this.key;
})), OAuth.SignatureMethod.registerMethodClass([ "HMAC-SHA1", "HMAC-SHA1-Accessor" ], OAuth.SignatureMethod.makeSubclass(function(t) {
b64pad = "=";
var n = b64_hmac_sha1(this.key, t);
return n;
})), OAuth.correctTimestampFromSrc();

var sc;

sc.helpers.getRelativeTime = function(e, t, n) {
var r = {
now: " Just now",
seconds: " sec ago",
minute: " min ago",
minutes: " min ago",
hour: " hr ago",
hours: " hr ago",
day: " day ago",
days: " days ago"
};
t = sch.defaults(r, t);
var i;
n === !0 ? i = new Date.parse(e) : i = new Date(e);
var s = new Date, o = parseInt((s.getTime() - i.getTime()) / 1e3, 10);
return o < 10 ? t.now : o < 60 ? o.toString() + t.seconds : o < 120 ? "1" + t.minute : o < 2700 ? Math.round(parseInt(o / 60, 10)).toString() + t.minutes : o < 5400 ? "1" + t.hour : o < 86400 ? Math.round(o / 3600) === 1 ? "2" + t.hours : Math.round(o / 3600).toString() + t.hours : o < 172800 ? "1" + t.day : Math.round(o / 86400).toString() + t.days;
}, sc.helpers.httpTimeToInt = function(e, t) {
return sc.helpers.dateToInt(e, t);
}, sc.helpers.dateToInt = function(e, t) {
var n = new Date;
return t === !0 ? e = new Date.parse(e) : e = new Date(e), n.setTime(e), n.getTime();
}, sc.helpers.getTimeAsInt = function() {
var e = new Date;
return e.getTime();
};

var sc;

sc.helpers.addListener = function(e, t, n, r, i) {
r && sch.warn('scope no longer supported! use a closure or reference "scope" in your event handler'), i && sch.warn("use_capture no longer supported!"), sch.debug("listening for " + t), sch.debug("on target nodeName:" + e.nodeName), jQuery(e).bind(t, n);
}, sc.helpers.removeListener = function(e, t, n, r) {
sch.debug("removing listener for " + t), sch.debug("on target nodeName:" + e.nodeName), r && sch.warn("use_capture no longer supported!"), jQuery(e).unbind(t, n);
}, sc.helpers.addDelegatedListener = function(e, t, n, r, i) {
sch.warn('scope no longer supported! use a closure or reference "scope" in your event handler'), sch.debug("listening for " + n), sch.debug("on target nodeName:" + target.nodeName), sch.debug("for selector:" + t), jQuery(e).delegate(t, n, r);
}, sc.helpers.removeDelegatedListener = function(e, t, n, r, i) {
sch.warn('scope no longer supported! use a closure or reference "scope" in your event handler'), jQuery(e).delegate(t, n, r);
}, sc.helpers.triggerCustomEvent = function(e, t, n, r) {
sch.debug("EVENT triggering " + e), sch.debug("EVENT on target nodeName:" + t.nodeName), r && sch.warn("bubble is no longer supported!"), n && (sch.debug("EVENT data passed"), n = [ n ]), jQuery(t).trigger(e, n);
}, sc.helpers.getEventData = function(e) {
return sch.error("getEventData is DEPRECATED. Use second param on event handler"), null;
}, sc.helpers.listen = sc.helpers.addListener, sc.helpers.unlisten = sc.helpers.removeListener, sc.helpers.delegate = sc.helpers.addDelegatedListener, sc.helpers.undelegate = sc.helpers.removeDelegatedListener, sc.helpers.trigger = sc.helpers.triggerCustomEvent;

var sc;

sc.helpers.Base64 = {
_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
encode: function(e) {
var t = "", n, r, i, s, o, u, a, f = 0;
e = sc.helpers.Base64._utf8_encode(e);
while (f < e.length) n = e.charCodeAt(f++), r = e.charCodeAt(f++), i = e.charCodeAt(f++), s = n >> 2, o = (n & 3) << 4 | r >> 4, u = (r & 15) << 2 | i >> 6, a = i & 63, isNaN(r) ? u = a = 64 : isNaN(i) && (a = 64), t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
return t;
},
decode: function(e) {
var t = "", n, r, i, s, o, u, a, f = 0;
e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
while (f < e.length) s = this._keyStr.indexOf(e.charAt(f++)), o = this._keyStr.indexOf(e.charAt(f++)), u = this._keyStr.indexOf(e.charAt(f++)), a = this._keyStr.indexOf(e.charAt(f++)), n = s << 2 | o >> 4, r = (o & 15) << 4 | u >> 2, i = (u & 3) << 6 | a, t += String.fromCharCode(n), u != 64 && (t += String.fromCharCode(r)), a != 64 && (t += String.fromCharCode(i));
return t = sc.helpers.Base64._utf8_decode(t), t;
},
_utf8_encode: function(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
},
_utf8_decode: function(e) {
var t = "", n = 0, r = 0, i = 0, s = 0, o = 0;
while (n < e.length) r = e.charCodeAt(n), r < 128 ? (t += String.fromCharCode(r), n++) : r > 191 && r < 224 ? (s = e.charCodeAt(n + 1), t += String.fromCharCode((r & 31) << 6 | s & 63), n += 2) : (s = e.charCodeAt(n + 1), o = e.charCodeAt(n + 2), t += String.fromCharCode((r & 15) << 12 | (s & 63) << 6 | o & 63), n += 3);
return t;
}
}, sc.helpers.crc32 = function(e) {
function t(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
}
e = t(e);
var n = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
typeof crc == "undefined" && (crc = 0);
var r = 0, i = 0;
crc ^= -1;
for (var s = 0, o = e.length; s < o; s++) i = (crc ^ e.charCodeAt(s)) & 255, r = "0x" + n.substr(i * 9, 8), crc = crc >>> 8 ^ r;
return crc ^ -1;
}, sc.helpers.MD5 = function(e) {
function t(e, t) {
return e << t | e >>> 32 - t;
}
function n(e, t) {
var n, r, i, s, o;
return i = e & 2147483648, s = t & 2147483648, n = e & 1073741824, r = t & 1073741824, o = (e & 1073741823) + (t & 1073741823), n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s;
}
function r(e, t, n) {
return e & t | ~e & n;
}
function i(e, t, n) {
return e & n | t & ~n;
}
function s(e, t, n) {
return e ^ t ^ n;
}
function o(e, t, n) {
return t ^ (e | ~n);
}
function u(e, i, s, o, u, a, f) {
return e = n(e, n(n(r(i, s, o), u), f)), n(t(e, a), i);
}
function a(e, r, s, o, u, a, f) {
return e = n(e, n(n(i(r, s, o), u), f)), n(t(e, a), r);
}
function f(e, r, i, o, u, a, f) {
return e = n(e, n(n(s(r, i, o), u), f)), n(t(e, a), r);
}
function l(e, r, i, s, u, a, f) {
return e = n(e, n(n(o(r, i, s), u), f)), n(t(e, a), r);
}
function c(e) {
var t, n = e.length, r = n + 8, i = (r - r % 64) / 64, s = (i + 1) * 16, o = Array(s - 1), u = 0, a = 0;
while (a < n) t = (a - a % 4) / 4, u = a % 4 * 8, o[t] = o[t] | e.charCodeAt(a) << u, a++;
return t = (a - a % 4) / 4, u = a % 4 * 8, o[t] = o[t] | 128 << u, o[s - 2] = n << 3, o[s - 1] = n >>> 29, o;
}
function h(e) {
var t = "", n = "", r, i;
for (i = 0; i <= 3; i++) r = e >>> i * 8 & 255, n = "0" + r.toString(16), t += n.substr(n.length - 2, 2);
return t;
}
function p(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
}
var d = Array(), v, m, g, y, b, w, E, S, x, T = 7, N = 12, C = 17, k = 22, L = 5, A = 9, O = 14, M = 20, _ = 4, D = 11, P = 16, H = 23, B = 6, j = 10, F = 15, I = 21;
e = p(e), d = c(e), w = 1732584193, E = 4023233417, S = 2562383102, x = 271733878;
for (v = 0; v < d.length; v += 16) m = w, g = E, y = S, b = x, w = u(w, E, S, x, d[v + 0], T, 3614090360), x = u(x, w, E, S, d[v + 1], N, 3905402710), S = u(S, x, w, E, d[v + 2], C, 606105819), E = u(E, S, x, w, d[v + 3], k, 3250441966), w = u(w, E, S, x, d[v + 4], T, 4118548399), x = u(x, w, E, S, d[v + 5], N, 1200080426), S = u(S, x, w, E, d[v + 6], C, 2821735955), E = u(E, S, x, w, d[v + 7], k, 4249261313), w = u(w, E, S, x, d[v + 8], T, 1770035416), x = u(x, w, E, S, d[v + 9], N, 2336552879), S = u(S, x, w, E, d[v + 10], C, 4294925233), E = u(E, S, x, w, d[v + 11], k, 2304563134), w = u(w, E, S, x, d[v + 12], T, 1804603682), x = u(x, w, E, S, d[v + 13], N, 4254626195), S = u(S, x, w, E, d[v + 14], C, 2792965006), E = u(E, S, x, w, d[v + 15], k, 1236535329), w = a(w, E, S, x, d[v + 1], L, 4129170786), x = a(x, w, E, S, d[v + 6], A, 3225465664), S = a(S, x, w, E, d[v + 11], O, 643717713), E = a(E, S, x, w, d[v + 0], M, 3921069994), w = a(w, E, S, x, d[v + 5], L, 3593408605), x = a(x, w, E, S, d[v + 10], A, 38016083), S = a(S, x, w, E, d[v + 15], O, 3634488961), E = a(E, S, x, w, d[v + 4], M, 3889429448), w = a(w, E, S, x, d[v + 9], L, 568446438), x = a(x, w, E, S, d[v + 14], A, 3275163606), S = a(S, x, w, E, d[v + 3], O, 4107603335), E = a(E, S, x, w, d[v + 8], M, 1163531501), w = a(w, E, S, x, d[v + 13], L, 2850285829), x = a(x, w, E, S, d[v + 2], A, 4243563512), S = a(S, x, w, E, d[v + 7], O, 1735328473), E = a(E, S, x, w, d[v + 12], M, 2368359562), w = f(w, E, S, x, d[v + 5], _, 4294588738), x = f(x, w, E, S, d[v + 8], D, 2272392833), S = f(S, x, w, E, d[v + 11], P, 1839030562), E = f(E, S, x, w, d[v + 14], H, 4259657740), w = f(w, E, S, x, d[v + 1], _, 2763975236), x = f(x, w, E, S, d[v + 4], D, 1272893353), S = f(S, x, w, E, d[v + 7], P, 4139469664), E = f(E, S, x, w, d[v + 10], H, 3200236656), w = f(w, E, S, x, d[v + 13], _, 681279174), x = f(x, w, E, S, d[v + 0], D, 3936430074), S = f(S, x, w, E, d[v + 3], P, 3572445317), E = f(E, S, x, w, d[v + 6], H, 76029189), w = f(w, E, S, x, d[v + 9], _, 3654602809), x = f(x, w, E, S, d[v + 12], D, 3873151461), S = f(S, x, w, E, d[v + 15], P, 530742520), E = f(E, S, x, w, d[v + 2], H, 3299628645), w = l(w, E, S, x, d[v + 0], B, 4096336452), x = l(x, w, E, S, d[v + 7], j, 1126891415), S = l(S, x, w, E, d[v + 14], F, 2878612391), E = l(E, S, x, w, d[v + 5], I, 4237533241), w = l(w, E, S, x, d[v + 12], B, 1700485571), x = l(x, w, E, S, d[v + 3], j, 2399980690), S = l(S, x, w, E, d[v + 10], F, 4293915773), E = l(E, S, x, w, d[v + 1], I, 2240044497), w = l(w, E, S, x, d[v + 8], B, 1873313359), x = l(x, w, E, S, d[v + 15], j, 4264355552), S = l(S, x, w, E, d[v + 6], F, 2734768916), E = l(E, S, x, w, d[v + 13], I, 1309151649), w = l(w, E, S, x, d[v + 4], B, 4149444226), x = l(x, w, E, S, d[v + 11], j, 3174756917), S = l(S, x, w, E, d[v + 2], F, 718787259), E = l(E, S, x, w, d[v + 9], I, 3951481745), w = n(w, m), E = n(E, g), S = n(S, y), x = n(x, b);
var q = h(w) + h(E) + h(S) + h(x);
return q.toLowerCase();
}, sc.helpers.SHA1 = function(e) {
function t(e, t) {
var n = e << t | e >>> 32 - t;
return n;
}
function n(e) {
var t = "", n, r, i;
for (n = 0; n <= 6; n += 2) r = e >>> n * 4 + 4 & 15, i = e >>> n * 4 & 15, t += r.toString(16) + i.toString(16);
return t;
}
function r(e) {
var t = "", n, r;
for (n = 7; n >= 0; n--) r = e >>> n * 4 & 15, t += r.toString(16);
return t;
}
function i(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
}
var s, o, u, a = new Array(80), f = 1732584193, l = 4023233417, c = 2562383102, h = 271733878, p = 3285377520, d, v, m, g, y, b;
e = i(e);
var w = e.length, E = [];
for (o = 0; o < w - 3; o += 4) u = e.charCodeAt(o) << 24 | e.charCodeAt(o + 1) << 16 | e.charCodeAt(o + 2) << 8 | e.charCodeAt(o + 3), E.push(u);
switch (w % 4) {
case 0:
o = 2147483648;
break;
case 1:
o = e.charCodeAt(w - 1) << 24 | 8388608;
break;
case 2:
o = e.charCodeAt(w - 2) << 24 | e.charCodeAt(w - 1) << 16 | 32768;
break;
case 3:
o = e.charCodeAt(w - 3) << 24 | e.charCodeAt(w - 2) << 16 | e.charCodeAt(w - 1) << 8 | 128;
}
E.push(o);
while (E.length % 16 != 14) E.push(0);
E.push(w >>> 29), E.push(w << 3 & 4294967295);
for (s = 0; s < E.length; s += 16) {
for (o = 0; o < 16; o++) a[o] = E[s + o];
for (o = 16; o <= 79; o++) a[o] = t(a[o - 3] ^ a[o - 8] ^ a[o - 14] ^ a[o - 16], 1);
d = f, v = l, m = c, g = h, y = p;
for (o = 0; o <= 19; o++) b = t(d, 5) + (v & m | ~v & g) + y + a[o] + 1518500249 & 4294967295, y = g, g = m, m = t(v, 30), v = d, d = b;
for (o = 20; o <= 39; o++) b = t(d, 5) + (v ^ m ^ g) + y + a[o] + 1859775393 & 4294967295, y = g, g = m, m = t(v, 30), v = d, d = b;
for (o = 40; o <= 59; o++) b = t(d, 5) + (v & m | v & g | m & g) + y + a[o] + 2400959708 & 4294967295, y = g, g = m, m = t(v, 30), v = d, d = b;
for (o = 60; o <= 79; o++) b = t(d, 5) + (v ^ m ^ g) + y + a[o] + 3395469782 & 4294967295, y = g, g = m, m = t(v, 30), v = d, d = b;
f = f + d & 4294967295, l = l + v & 4294967295, c = c + m & 4294967295, h = h + g & 4294967295, p = p + y & 4294967295;
}
return b = r(f) + r(l) + r(c) + r(h) + r(p), b.toLowerCase();
}, sc.helpers.SHA256 = function(e) {
function r(e, t) {
var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
return r << 16 | n & 65535;
}
function i(e, t) {
return e >>> t | e << 32 - t;
}
function s(e, t) {
return e >>> t;
}
function o(e, t, n) {
return e & t ^ ~e & n;
}
function u(e, t, n) {
return e & t ^ e & n ^ t & n;
}
function a(e) {
return i(e, 2) ^ i(e, 13) ^ i(e, 22);
}
function f(e) {
return i(e, 6) ^ i(e, 11) ^ i(e, 25);
}
function l(e) {
return i(e, 7) ^ i(e, 18) ^ s(e, 3);
}
function c(e) {
return i(e, 17) ^ i(e, 19) ^ s(e, 10);
}
function h(e, t) {
var n = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], i = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ], s = [ 64 ], h, p, d, v, m, g, y, b, w, E, S, x;
e[t >> 5] |= 128 << 24 - t % 32, e[(t + 64 >> 9 << 4) + 15] = t;
for (w = 0; w < e.length; w += 16) {
h = i[0], p = i[1], d = i[2], v = i[3], m = i[4], g = i[5], y = i[6], b = i[7];
for (E = 0; E < 64; E++) E < 16 ? s[E] = e[E + w] : s[E] = r(r(r(c(s[E - 2]), s[E - 7]), l(s[E - 15])), s[E - 16]), S = r(r(r(r(b, f(m)), o(m, g, y)), n[E]), s[E]), x = r(a(h), u(h, p, d)), b = y, y = g, g = m, m = r(v, S), v = d, d = p, p = h, h = r(S, x);
i[0] = r(h, i[0]), i[1] = r(p, i[1]), i[2] = r(d, i[2]), i[3] = r(v, i[3]), i[4] = r(m, i[4]), i[5] = r(g, i[5]), i[6] = r(y, i[6]), i[7] = r(b, i[7]);
}
return i;
}
function p(e) {
var n = Array(), r = (1 << t) - 1;
for (var i = 0; i < e.length * t; i += t) n[i >> 5] |= (e.charCodeAt(i / t) & r) << 24 - i % 32;
return n;
}
function d(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
}
function v(e) {
var t = n ? "0123456789ABCDEF" : "0123456789abcdef", r = "";
for (var i = 0; i < e.length * 4; i++) r += t.charAt(e[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + t.charAt(e[i >> 2] >> (3 - i % 4) * 8 & 15);
return r;
}
var t = 8, n = 0;
return e = d(e), v(h(p(e), e.length * t));
}, sc.helpers.UUID = function() {
var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
return function(t, n) {
var r = e, i = [], s = Math.random;
n = n || r.length;
if (t) for (var o = 0; o < t; o++) i[o] = r[0 | s() * n]; else {
var u;
i[8] = i[13] = i[18] = i[23] = "-", i[14] = "4";
for (var o = 0; o < 36; o++) i[o] || (u = 0 | s() * 16, i[o] = r[o == 19 ? u & 3 | 8 : u & 15]);
}
return i.join("");
};
}(), sc.helpers.isUUID = function(e) {
return e.match(/^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/);
};

var sc, jQuery;

sc.helpers.isString = function(e) {
if (typeof e == "string") return !0;
if (typeof e == "object" && e !== null) {
var t = e.constructor.toString().match(/string/i);
return t !== null;
}
return !1;
}, sc.helpers.isNumber = function(e) {
return typeof e == "number";
}, sc.helpers.isArray = function(e) {
return !e || !e.constructor ? !1 : e.constructor.toString().indexOf("Array") === -1 ? !1 : !0;
}, sc.helpers.clone = function(e) {
return _.extend({}, e);
}, sc.helpers.each = function(e, t) {}, sc.helpers.extend = function(e, t) {
e.prototype.__proto__ = t.prototype;
}, sc.helpers.defaults = function(e, t) {
var n = e;
for (var r in t) n[r] = t[r];
return n;
};

var sc;

sc.helpers.deJSON = function(e) {
var t, n = !1;
try {
t = JSON.parse(e), n = !0;
} catch (r) {
sch.error(r.message), sch.error(r);
} finally {
n || sch.error("Could not parse JSON text: '" + e + "'");
}
return t;
}, sc.helpers.enJSON = function(e) {
var t, n = !1;
try {
t = JSON.stringify(e), n = !0;
} catch (r) {
sch.error(r.message), sch.error(r), t = copy(e), n = !0;
} finally {
n || (console.error("Could not stringify jsobj (" + typeof e + ")"), sch.error("Could not stringify jsobj (" + typeof e + ")"));
}
return t;
}, sc.helpers.xml2json = function(e, t) {
function n(e, i) {
if (!e) return null;
var o = "", u = null, a = null, f = e.nodeType, l = r(e.localName || e.nodeName), c = e.text || e.nodeValue || "";
e.childNodes && e.childNodes.length > 0 && jQuery.each(e.childNodes, function(e, t) {
var i = t.nodeType, a = r(t.localName || t.nodeName), f = t.text || t.nodeValue || "";
if (i == 8) return;
if (i == 3 || i == 4 || !a) {
if (f.match(/^\s+$/)) return;
o += f.replace(/^\s+/, "").replace(/\s+$/, "");
} else u = u || {}, u[a] ? (u[a].length || (u[a] = s(u[a])), u[a][u[a].length] = n(t, !0), u[a].length = u[a].length) : u[a] = n(t);
}), e.attributes && e.attributes.length > 0 && (a = {}, u = u || {}, jQuery.each(e.attributes, function(e, t) {
var n = r(t.name), i = t.value;
a[n] = i, u[n] ? (u[n].length || (u[n] = s(u[n])), u[n][u[n].length] = i, u[n].length = u[n].length) : u[n] = i;
})), u && (u = jQuery.extend(o != "" ? new String(o) : {}, u || {}), o = u.text ? (typeof u.text == "object" ? u.text : [ u.text || "" ]).concat([ o ]) : o, o && (u.text = o), o = "");
var h = u || o;
return t && (o && (h = {}), o = h.text || o || "", o && (h.text = o), i || (h = s(h))), h;
}
if (!e) return {};
var r = function(e) {
return String(e || "").replace(/-/g, "_");
}, i = function(e) {
return typeof e == "number" || String(e && typeof e == "string" ? e : "").test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/);
}, s = function(e) {
return e.length || (e = [ e ]), e.length = e.length, e;
};
typeof e == "string" && (e = sc.helpers.createXMLFromString(e));
if (!e.nodeType) return;
if (e.nodeType == 3 || e.nodeType == 4) return e.nodeValue;
var o = e.nodeType == 9 ? e.documentElement : e, u = n(o, !0);
return e = null, o = null, u;
};

var sc, DOMParser, shortcut;

sc.helpers.key_add = function(e, t, n) {
n = sch.defaults({
type: "keydown",
disable_in_input: "true"
}, n), shortcut.add(e, t, n);
}, sc.helpers.key_remove = function(e) {
shortcut.remove(e);
}, sc.helpers.getModKey = function() {};

var sc;

sc.helpers.getCurrentLocation = function() {};

var sc;

sc.helpers.containsScreenName = function(e, t) {
var n = new RegExp("(?:\\s|\\b|^[[:alnum:]]|^)@(" + t + ")(?:\\s|\\b|$)", "gi");
return n.test(e) ? !0 : !1;
}, sc.helpers.extractScreenNames = function(e, t) {
e = e.toLowerCase();
var n = /(?:^|\s|\(\[|,|\.|\()@([a-zA-Z0-9_]+)/gi, r = [], i = [], s = [];
while (i = n.exec(e)) {
for (var o = 0; o < i.length; o++) i[o] || (i[o] = "");
i[1] != "" && r.push(i[1]);
}
if (r.length > 0) {
r = _.uniq(r), sch.isString(r) && (r = [ r ]);
if (t) {
s = [ r ];
for (var u = 0; u < t.length; u++) s.push(t[u].toLowerCase());
r = _.without.apply(this, s);
}
}
return r || [];
}, sc.helpers.extractURLs = function(e) {
var t = /(^|\s|\(|:)(((http(s?):\/\/)|(www\.))([\w\u272a]+[^\s\)<]+))/gi, n = [], r = [];
while ((n = t.exec(e)) !== null) {
for (var i = 0; i < n.length; i++) n[i] || (n[i] = "");
var s = n[7].charAt(n[7].length - 1);
s.search(/[\.,;\?]/) !== -1 && (n[7] = n[7].slice(0, -1)), r.push(n[3] + n[7]);
}
return r;
}, sc.helpers.replaceMultiple = function(e, t) {
for (var n in t) e = e.replace(n, t[n]);
return e;
}, sc.helpers.autolink = function(e, t, n, r) {
t || (t = "both");
var i = /((^|\s)(www\.)?([a-zA-Z_\-]+\.)(com|net|org|uk)($|\s))/gi, s = /(^|[\s\(:\u3002])((http(s?):\/\/)|(www\.))([\w\u272a]+[^\s\)<]+)/gi, o = /(^|\s|\()([a-zA-Z0-9_\.\-\+]+)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-\.]*)([^\s\)<]+)/gi, u, a, f = "";
if (t !== "email") {
while (a = i.exec(e)) {
for (u = 0; u < a.length; u++) a[u] || (a[u] = "");
n ? n = " " + n : n = "";
var l = a[3] + a[4] + a[5];
r && r > 0 && l.length > r && (l = l.substr(0, r) + "...");
var c = a[2] + '<a href="http://' + a[3] + a[4] + a[5] + '"' + n + ">" + l + "</a>" + a[6];
sch.error(c), e = e.replace(a[0], c);
}
while (a = s.exec(e)) {
for (u = 0; u < a.length; u++) a[u] || (a[u] = "");
n ? n = " " + n : n = "";
var h = a[6].charAt(a[6].length - 1);
h.search(/[\.,;\?]/) !== -1 && (a[6] = a[6].slice(0, -1), f = h);
var l = a[5] + a[6];
r && r > 0 && l.length > r && (l = l.substr(0, r) + "...");
var c = a[1] + '<a href="http' + a[4] + "://" + a[5] + a[6] + '"' + n + ">" + l + "</a>" + f;
e = e.replace(a[0], c);
}
}
if (t !== "url") while (a = o.exec(e)) {
f = "", /\./.test(a[5]) && (f = ".", a[5] = a[5].slice(0, -1));
for (u = 0; u < a.length; u++) a[u] || (a[u] = "");
e = e.replace(a[0], a[1] + '<a href="mailto:' + a[2] + "@" + a[3] + "." + a[4] + a[5] + '">' + a[2] + "@" + a[3] + "." + a[4] + a[5] + "</a>" + f);
}
return e;
}, sc.helpers.autolinkTwitterScreenname = function(e, t) {
t || (t = '<a href="http://twitter.com/#username#">@#username#</a>');
var n = /(^|\s|\(\[|,|\.|\()@([a-zA-Z0-9_]+)([^a-zA-Z0-9_]|$)/gi, r = [];
while (r = n.exec(e)) {
for (var i = 0; i < r.length; i++) r[i] || (r[i] = "");
var s = t.replace(/#username#/gi, r[2]);
e = e.replace(r[0], r[1] + s + r[3]);
}
return e;
}, sc.helpers.autolinkTwitterHashtag = function(e, t) {
t || (t = '<a href="http://search.twitter.com/search?q=#hashtag_enc#">##hashtag#</a>');
var n = /(^|\s|\()#([a-zA-Z0-9\-_\.+:=]{1,}\w)([^a-zA-Z0-9\-_+]|$)/gi, r = [];
while (r = n.exec(e)) {
for (var i = 0; i < r.length; i++) r[i] || (r[i] = "");
var s = t.replace(/#hashtag#/gi, r[2]);
s = s.replace(/#hashtag_enc#/gi, encodeURIComponent(r[2])), e = e.replace(r[0], r[1] + s + r[3]);
}
return e;
}, sc.helpers.makeClickable = function(e, t) {
var n, r, i, s, o;
t || (t = {});
if (t.autolink) var n = t.autolink.type || null, r = t.autolink.extra_code || null, i = t.autolink.maxlen || null;
if (t.screenname) var s = t.screenname.tpl || null;
if (t.hashtag) var o = t.hashtag.tpl || null;
return e = sc.helpers.autolink(e, n, r, i), e = sc.helpers.autolinkTwitterScreenname(e, s), e = sc.helpers.autolinkTwitterHashtag(e, o), e;
}, sc.helpers.stripTags = function(e) {
var t = /<[^>]*>/gim;
return e = e.replace(t, ""), e;
}, sc.helpers.fromHTMLSpecialChars = function(e) {
return e = e.replace(/&lt;/gi, "<"), e = e.replace(/&gt;/gi, ">"), e = e.replace(/&quot;/gi, '"'), e = e.replace(/&apos;/gi, "'"), e = e.replace(/&amp;/gi, "&"), e;
}, sc.helpers.escape_html = function(e) {
return sc.helpers.htmlspecialchars(e, "ENT_QUOTES");
}, sc.helpers.htmlspecialchars = function(e, t) {
var n = {}, r = "", i = "", s = 0;
i = e.toString();
if (!1 === (n = sc.helpers._get_html_translation_table("HTML_SPECIALCHARS", t))) return !1;
i = i.split("&").join(n["&"]);
for (r in n) r != "&" && (entity = n[r], i = i.split(r).join(entity));
return i;
}, sc.helpers.htmlentities = function(e, t) {
var n = {}, r = "", i = "", s = "";
i = e.toString();
if (!1 === (n = sc.helpers._get_html_translation_table("HTML_ENTITIES", t))) return !1;
for (r in n) s = n[r], i = i.split(r).join(s);
return i;
}, sc.helpers._get_html_translation_table = function(e, t) {
var n = [], r = {}, i = 0, s = "", o = {}, u = {}, a = {}, f = {};
a = e ? e.toUpperCase() : "HTML_SPECIALCHARS", f = t ? t.toUpperCase() : "ENT_COMPAT", o[0] = "HTML_SPECIALCHARS", o[1] = "HTML_ENTITIES", u[0] = "ENT_NOQUOTES", u[2] = "ENT_COMPAT", u[3] = "ENT_QUOTES", isNaN(a) || (a = o[a]), isNaN(f) || (f = u[f]);
if (a === "HTML_SPECIALCHARS") n.push({
code: 38,
entity: "&amp;"
}), f !== "ENT_NOQUOTES" && n.push({
code: 34,
entity: "&quot;"
}), f === "ENT_QUOTES" && n.push({
code: 39,
entity: "&#039;"
}), n.push({
code: 60,
entity: "&lt;"
}), n.push({
code: 62,
entity: "&gt;"
}); else {
if (a !== "HTML_ENTITIES") throw Error("Table: " + a + " not supported");
n.push({
code: 38,
entity: "&amp;"
}), f !== "ENT_NOQUOTES" && n.push({
code: 34,
entity: "&quot;"
}), f === "ENT_QUOTES" && n.push({
code: 39,
entity: "&#039;"
}), n.push({
code: 60,
entity: "&lt;"
}), n.push({
code: 62,
entity: "&gt;"
}), n.push({
code: 160,
entity: "&nbsp;"
}), n.push({
code: 161,
entity: "&iexcl;"
}), n.push({
code: 162,
entity: "&cent;"
}), n.push({
code: 163,
entity: "&pound;"
}), n.push({
code: 164,
entity: "&curren;"
}), n.push({
code: 165,
entity: "&yen;"
}), n.push({
code: 166,
entity: "&brvbar;"
}), n.push({
code: 167,
entity: "&sect;"
}), n.push({
code: 168,
entity: "&uml;"
}), n.push({
code: 169,
entity: "&copy;"
}), n.push({
code: 170,
entity: "&ordf;"
}), n.push({
code: 171,
entity: "&laquo;"
}), n.push({
code: 172,
entity: "&not;"
}), n.push({
code: 173,
entity: "&shy;"
}), n.push({
code: 174,
entity: "&reg;"
}), n.push({
code: 175,
entity: "&macr;"
}), n.push({
code: 176,
entity: "&deg;"
}), n.push({
code: 177,
entity: "&plusmn;"
}), n.push({
code: 178,
entity: "&sup2;"
}), n.push({
code: 179,
entity: "&sup3;"
}), n.push({
code: 180,
entity: "&acute;"
}), n.push({
code: 181,
entity: "&micro;"
}), n.push({
code: 182,
entity: "&para;"
}), n.push({
code: 183,
entity: "&middot;"
}), n.push({
code: 184,
entity: "&cedil;"
}), n.push({
code: 185,
entity: "&sup1;"
}), n.push({
code: 186,
entity: "&ordm;"
}), n.push({
code: 187,
entity: "&raquo;"
}), n.push({
code: 188,
entity: "&frac14;"
}), n.push({
code: 189,
entity: "&frac12;"
}), n.push({
code: 190,
entity: "&frac34;"
}), n.push({
code: 191,
entity: "&iquest;"
}), n.push({
code: 192,
entity: "&Agrave;"
}), n.push({
code: 193,
entity: "&Aacute;"
}), n.push({
code: 194,
entity: "&Acirc;"
}), n.push({
code: 195,
entity: "&Atilde;"
}), n.push({
code: 196,
entity: "&Auml;"
}), n.push({
code: 197,
entity: "&Aring;"
}), n.push({
code: 198,
entity: "&AElig;"
}), n.push({
code: 199,
entity: "&Ccedil;"
}), n.push({
code: 200,
entity: "&Egrave;"
}), n.push({
code: 201,
entity: "&Eacute;"
}), n.push({
code: 202,
entity: "&Ecirc;"
}), n.push({
code: 203,
entity: "&Euml;"
}), n.push({
code: 204,
entity: "&Igrave;"
}), n.push({
code: 205,
entity: "&Iacute;"
}), n.push({
code: 206,
entity: "&Icirc;"
}), n.push({
code: 207,
entity: "&Iuml;"
}), n.push({
code: 208,
entity: "&ETH;"
}), n.push({
code: 209,
entity: "&Ntilde;"
}), n.push({
code: 210,
entity: "&Ograve;"
}), n.push({
code: 211,
entity: "&Oacute;"
}), n.push({
code: 212,
entity: "&Ocirc;"
}), n.push({
code: 213,
entity: "&Otilde;"
}), n.push({
code: 214,
entity: "&Ouml;"
}), n.push({
code: 215,
entity: "&times;"
}), n.push({
code: 216,
entity: "&Oslash;"
}), n.push({
code: 217,
entity: "&Ugrave;"
}), n.push({
code: 218,
entity: "&Uacute;"
}), n.push({
code: 219,
entity: "&Ucirc;"
}), n.push({
code: 220,
entity: "&Uuml;"
}), n.push({
code: 221,
entity: "&Yacute;"
}), n.push({
code: 222,
entity: "&THORN;"
}), n.push({
code: 223,
entity: "&szlig;"
}), n.push({
code: 224,
entity: "&agrave;"
}), n.push({
code: 225,
entity: "&aacute;"
}), n.push({
code: 226,
entity: "&acirc;"
}), n.push({
code: 227,
entity: "&atilde;"
}), n.push({
code: 228,
entity: "&auml;"
}), n.push({
code: 229,
entity: "&aring;"
}), n.push({
code: 230,
entity: "&aelig;"
}), n.push({
code: 231,
entity: "&ccedil;"
}), n.push({
code: 232,
entity: "&egrave;"
}), n.push({
code: 233,
entity: "&eacute;"
}), n.push({
code: 234,
entity: "&ecirc;"
}), n.push({
code: 235,
entity: "&euml;"
}), n.push({
code: 236,
entity: "&igrave;"
}), n.push({
code: 237,
entity: "&iacute;"
}), n.push({
code: 238,
entity: "&icirc;"
}), n.push({
code: 239,
entity: "&iuml;"
}), n.push({
code: 240,
entity: "&eth;"
}), n.push({
code: 241,
entity: "&ntilde;"
}), n.push({
code: 242,
entity: "&ograve;"
}), n.push({
code: 243,
entity: "&oacute;"
}), n.push({
code: 244,
entity: "&ocirc;"
}), n.push({
code: 245,
entity: "&otilde;"
}), n.push({
code: 246,
entity: "&ouml;"
}), n.push({
code: 247,
entity: "&divide;"
}), n.push({
code: 248,
entity: "&oslash;"
}), n.push({
code: 249,
entity: "&ugrave;"
}), n.push({
code: 250,
entity: "&uacute;"
}), n.push({
code: 251,
entity: "&ucirc;"
}), n.push({
code: 252,
entity: "&uuml;"
}), n.push({
code: 253,
entity: "&yacute;"
}), n.push({
code: 254,
entity: "&thorn;"
}), n.push({
code: 255,
entity: "&yuml;"
});
}
for (var l = 0; l < n.length; l++) s = String.fromCharCode(n[l].code), r[s] = n[l].entity;
return r;
}, sc.helpers.Utf8 = {
encode: function(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0; n < e.length; n++) {
var r = e.charCodeAt(n);
r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128));
}
return t;
},
decode: function(e) {
var t = "", n = 0, r = 0, i = 0, s = 0, o = 0;
while (n < e.length) r = e.charCodeAt(n), r < 128 ? (t += String.fromCharCode(r), n++) : r > 191 && r < 224 ? (s = e.charCodeAt(n + 1), t += String.fromCharCode((r & 31) << 6 | s & 63), n += 2) : (s = e.charCodeAt(n + 1), o = e.charCodeAt(n + 2), t += String.fromCharCode((r & 15) << 12 | (s & 63) << 6 | o & 63), n += 3);
return t;
}
}, sc.helpers.trim = function(e, t) {
return sc.helpers.ltrim(sc.helpers.rtrim(e, t), t);
}, sc.helpers.ltrim = function(e, t) {
return t = t || "\\s", e.replace(new RegExp("^[" + t + "]+", "g"), "");
}, sc.helpers.rtrim = function(e, t) {
return t = t || "\\s", e.replace(new RegExp("[" + t + "]+$", "g"), "");
}, sc.helpers.pad = function(e, t, n, r) {
var i = "", s, o = function(e, t) {
var n = "", r;
while (n.length < t) n += e;
return n = n.substr(0, t), n;
};
return e += "", n = n !== undefined ? n : " ", r != "STR_PAD_LEFT" && r != "STR_PAD_RIGHT" && r != "STR_PAD_BOTH" && (r = "STR_PAD_RIGHT"), (s = t - e.length) > 0 && (r == "STR_PAD_LEFT" ? e = o(n, s) + e : r == "STR_PAD_RIGHT" ? e += o(n, s) : r == "STR_PAD_BOTH" && (i = o(n, Math.ceil(s / 2)), e = i + e + i, e = e.substr(0, t))), e;
}, sc.helpers.truncate = function(e, t, n) {
return e.length > t && (e = e.slice(0, t), n && (e += n)), e;
}, sc.helpers.nl2br = function(e, t) {
return t = t || "<br>", e = e.replace(/(\r\n|\n\r|\r|\n)/g, t + "$1"), e;
};

var sc, SPAZCORE_PLATFORM_AIR = "AIR", SPAZCORE_PLATFORM_WEBOS = "webOS", SPAZCORE_PLATFORM_TITANIUM = "Titanium", SPAZCORE_PLATFORM_UNKNOWN = "__UNKNOWN", SPAZCORE_OS_WINDOWS = "Windows", SPAZCORE_OS_LINUX = "Linux", SPAZCORE_OS_MACOS = "MacOS", SPAZCORE_OS_UNKNOWN = "__OS_UNKNOWN", SPAZCORE_DUMPLEVEL_DEBUG = 4, SPAZCORE_DUMPLEVEL_NOTICE = 3, SPAZCORE_DUMPLEVEL_WARNING = 2, SPAZCORE_DUMPLEVEL_ERROR = 1, SPAZCORE_DUMPLEVEL_NONE = 0, SPAZCORE_DUMP_MAXLEN = 512;

sc.helpers.getPlatform = function() {
return window.runtime ? SPAZCORE_PLATFORM_AIR : window && window.PalmSystem ? SPAZCORE_PLATFORM_WEBOS : window.Titanium ? SPAZCORE_PLATFORM_TITANIUM : navigator.userAgent.match(/[BlackBerry|RIM|BB|blackberry|BB10]/g) ? "__BLACKBERRY" : SPAZCORE_PLATFORM_UNKNOWN;
}, sc.helpers.isPlatform = function(e) {
var t = sc.helpers.getPlatform();
return t.toLowerCase() === e.toLowerCase() ? !0 : !1;
}, sc.helpers.isAIR = function() {
return sc.helpers.isPlatform(SPAZCORE_PLATFORM_AIR);
}, sc.helpers.iswebOS = function() {
return sc.helpers.isPlatform(SPAZCORE_PLATFORM_WEBOS);
}, sc.helpers.isTitanium = function() {
return sc.helpers.isPlatform(SPAZCORE_PLATFORM_TITANIUM);
}, sc.helpers.debug = function(e) {
sc.helpers.dump(e, SPAZCORE_DUMPLEVEL_DEBUG);
}, sc.helpers.note = function(e) {
sc.helpers.dump(e, SPAZCORE_DUMPLEVEL_NOTICE);
}, sc.helpers.warn = function(e) {
sc.helpers.dump(e, SPAZCORE_DUMPLEVEL_WARNING);
}, sc.helpers.error = function(e) {
sc.helpers.dump(e, SPAZCORE_DUMPLEVEL_ERROR);
}, sc.helpers.dump = function(e, t, n) {
t || (t = SPAZCORE_DUMPLEVEL_DEBUG);
if (sc.dumplevel < t) return;
sc.helpers.isString(e) && (e = sch.truncate(e, SPAZCORE_DUMP_MAXLEN, "\u2026[TRUNC]")), console.log(e), n && n(e, t);
}, sc.helpers.openInBrowser = function(e) {
switch (AppUtils.getPlatform()) {
case "__BLACKBERRY":
enyo.Signals.send("onLaunchBrowser", {
url: e
});
break;
case "__ANDROID":
Ti.App.fireEvent("openInBrowser", {
url: e
});
break;
default:
window.open(e);
}
}, sc.helpers.getAppVersion = function() {}, sc.helpers.getUserAgent = function() {}, sc.helpers.setUserAgent = function(e) {}, sc.helpers.getClipboardText = function() {}, sc.helpers.setClipboardText = function(e) {}, sc.helpers.getEncryptedValue = function(e) {}, sc.helpers.setEncryptedValue = function(e, t) {}, sc.helpers.getAppStoreDir = function() {}, sc.helpers.getPreferencesFile = function(e, t) {}, sc.helpers.init_file = function(e, t) {}, sc.helpers.getOS = function() {
return SPAZCORE_OS_UNKNOWN;
}, sc.helpers.isOS = function(e) {
var t = sc.helpers.getOS();
return t === e ? !0 : !1;
}, sc.helpers.isWindows = function() {
return sc.helpers.isOS(SPAZCORE_OS_WINDOWS);
}, sc.helpers.isLinux = function() {
return sc.helpers.isOS(SPAZCORE_OS_LINUX);
}, sc.helpers.isMacOS = function() {
return sc.helpers.isOS(SPAZCORE_OS_MACOS);
}, sc.helpers.objectToQueryString = function(e) {
var t, n, r, i = [];
for (n in e) r = e[n], i.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
return t = i.join("&"), t;
}, sc.helpers.getServiceBaseUrl = function(e) {
var t = null;
switch (e) {
case SPAZCORE_SERVICE_TWITTER:
t = SPAZCORE_BASEURL_TWITTER;
break;
case SPAZCORE_SERVICE_IDENTICA:
t = SPAZCORE_BASEURL_IDENTICA;
break;
case SPAZCORE_SERVICE_FREELISHUS:
t = SPAZCORE_BASEURL_FREELISHUS;
}
return t;
}, sc.helpers.getServiceProfileUrl = function(e, t) {
var n = null;
switch (t) {
case SPAZCORE_SERVICE_TWITTER:
n = SPAZCORE_BASEURL_TWITTER + "/" + e;
break;
case SPAZCORE_SERVICE_IDENTICA:
n = SPAZCORE_BASEURL_IDENTICA + "/" + e;
break;
case SPAZCORE_SERVICE_FREELISHUS:
n = SPAZCORE_BASEURL_FREELISHUS + "/" + e;
}
return n;
}, sc.helpers.getStatusUrl = function(e, t, n) {
var r = null;
switch (n) {
case SPAZCORE_SERVICE_TWITTER:
r = SPAZCORE_BASEURL_TWITTER + t + "/statuses/" + e;
break;
case SPAZCORE_SERVICE_IDENTICA:
r = SPAZCORE_BASEURL_IDENTICA + "notice/" + e;
break;
case SPAZCORE_SERVICE_FREELISHUS:
r = SPAZCORE_BASEURL_FREELISHUS + "notice/" + e;
}
return r;
};

var sc, jQuery;

sc.helpers.removeExtraElements = function(e, t, n) {
n || (n = !1);
var r = jQuery(e), i = r.parent().get(0), s = r.length - t;
sch.debug("removing extra elements from " + e), sch.debug("matching item count " + r.length), sch.debug("max_items: " + t), sch.debug("diff: " + s), sch.debug("remove_from_top: " + n), s > 0 && (n ? r.slice(s).each(function() {
this.parentNode.removeChild(this);
}) : r.slice(s * -1).each(function() {
this.parentNode.removeChild(this);
}));
}, sc.helpers.removeDuplicateElements = function(e, t) {
sc.helpers.dump("removeDuplicateElements TODO");
}, sc.helpers.updateRelativeTimes = function(e, t) {
jQuery(e).each(function(e) {
var n = jQuery(this).attr(t), r = sc.helpers.getRelativeTime(n);
jQuery(this).html(r);
});
}, sc.helpers.markAllAsRead = function(e) {
jQuery(e).removeClass("new");
};

var sc, DOMParser;

sc.helpers.createXMLFromString = function(e) {
var t, n;
try {
return t = new DOMParser, n = t.parseFromString(e, "text/xml"), n;
} catch (r) {
return sc.helpers.dump(r.name + ":" + r.message), null;
}
};

var SPAZCORE_ACCOUNT_TWITTER = "twitter", SPAZCORE_ACCOUNT_IDENTICA = "identi.ca", SPAZCORE_ACCOUNT_FREELISHUS = "freelish.us", SPAZCORE_ACCOUNT_STATUSNET = "StatusNet", SPAZCORE_ACCOUNT_FLICKR = "flickr", SPAZCORE_ACCOUNT_WORDPRESS = "wordpress.com", SPAZCORE_ACCOUNT_WORDPRESS_TWITTER = "wordpress-twitter", SPAZCORE_ACCOUNT_TUMBLR = "tumblr", SPAZCORE_ACCOUNT_TUMBLR_TWITTER = "tumblr-twitter", SPAZCORE_ACCOUNT_FACEBOOK = "facebook", SPAZCORE_ACCOUNT_FRIENDFEED = "friendfeed", SPAZCORE_ACCOUNT_CUSTOM = "custom", SpazAccounts = function(e) {
e ? this.prefs = e : (this.prefs = new SpazPrefs, this.prefs.load()), this.load();
};

SpazAccounts.prototype.prefskey = "users", SpazAccounts.prototype.load = function() {
var e = this.prefs.get(this.prefskey);
sch.debug("accjson:'" + e + "'");
try {
this._accounts = sch.deJSON(this.prefs.get(this.prefskey));
} catch (t) {
sch.error(t.message), this._accounts = [];
}
sch.isArray(this._accounts) || (this._accounts = []), sch.debug("this._accounts:'" + this._accounts + "'");
}, SpazAccounts.prototype.save = function() {
this.prefs.set(this.prefskey, sch.enJSON(this._accounts)), sch.debug('saved users to "' + this.prefskey + '" pref');
for (var e in this._accounts) sch.debug(this._accounts[e].id);
sch.debug("THE ACCOUNTS:"), sch.debug(sch.enJSON(this._accounts)), sch.debug("ALL PREFS:"), sch.debug(sch.enJSON(this.prefs._prefs));
}, SpazAccounts.prototype.getAll = function() {
return this._accounts;
}, SpazAccounts.prototype.setAll = function(e) {
this._accounts = e, this.save(), sch.debug("Saved these accounts:");
for (var t = 0; t < this._accounts.length; t++) sch.debug(this._accounts[t].id);
}, SpazAccounts.prototype.update = function(e, t) {
var n = this.get(e);
if (n) {
var r = sch.defaults(n, t);
return this.get(e);
}
return sch.error('No account with id "' + e + '" exists'), null;
}, SpazAccounts.prototype.initAccounts = function() {
this._accounts = [], this.save();
}, SpazAccounts.prototype.add = function(e, t, n) {
if (!n) return sch.error("Type must be set"), !1;
var r = {
id: this.generateID(),
type: n,
auth: t,
username: e,
meta: {}
};
return this._accounts.push(r), this.save(), r;
}, SpazAccounts.prototype.remove = function(e) {
sch.error("Deleting '" + e + "'\u2026");
var t = this._findUserIndex(e);
if (t !== !1) {
var n = this._accounts.splice(t, 1);
return sch.debug("Deleted account '" + n[0].id + "'"), this.save(), n[0];
}
return sch.error("Could not find this id to delete: '" + e + "'"), !1;
}, SpazAccounts.prototype.getByType = function(e) {
var t = [];
for (var n = 0; n < this._accounts.length; n++) this._accounts[n].type === e && t.push(this._accounts[n]);
return t;
}, SpazAccounts.prototype.getByUsername = function(e) {
var t = [];
for (var n = 0; n < this._accounts.length; n++) this._accounts[n].username === e && t.push(this._accounts[n]);
return t;
}, SpazAccounts.prototype.getByUsernameAndType = function(e, t) {
var n = [];
for (var r = 0; r < this._accounts.length; r++) this._accounts[r].username === e && this._accounts[r].type === t && n.push(this._accounts[r]);
return n;
}, SpazAccounts.prototype.get = function(e) {
var t = this._findUserIndex(e);
return t !== !1 ? this._accounts[i] : !1;
}, SpazAccounts.prototype.set = SpazAccounts.prototype.update, SpazAccounts.prototype.getLabel = function(e) {
var t = this._findUserIndex(e), n = "";
return t !== !1 ? (n = this._accounts[i].username + "@" + this._accounts[i].type, this._accounts[i].type === SPAZCORE_ACCOUNT_STATUSNET || this._accounts[i].type === SPAZCORE_ACCOUNT_CUSTOM, n) : !1;
}, SpazAccounts.prototype._findUserIndex = function(e) {
for (i = 0; i < this._accounts.length; i++) if (this._accounts[i].id === e) return sch.debug("Found matching user record to " + e), i;
return !1;
}, SpazAccounts.prototype.generateID = function() {
var e = sc.helpers.UUID();
return e;
}, SpazAccounts.prototype.getMeta = function(e, t) {
var n;
if (n = this.get(e)) if (n.meta && n.meta[t] !== null) return n.meta[t];
return null;
}, SpazAccounts.prototype.setMeta = function(e, t, n) {
var r = this._findUserIndex(e);
return r !== !1 ? (this._accounts[r].meta || (this._accounts[r].meta = {}), this._accounts[r].meta[t] = n, this.save(), this._accounts[r].meta[t]) : null;
}, SpazAccounts.prototype.getType = function(e) {
var t;
return (t = this.get(e)) ? t.type : null;
}, SpazAccounts.prototype.getAuthKey = function(e) {
if (e) {
var t = this.get(e);
return t ? t.auth : null;
}
return null;
}, SpazAccounts.prototype.setAuthKey = function(e, t) {
if (!e) return null;
var n = this.get(e);
n.auth = t, this.set(e, n);
}, SpazAccounts.prototype.getAuthObject = function(e) {
var t = this.getAuthKey(e);
if (t) {
var n = new SpazAuth(this.getType(e));
return n.load(t), n;
}
return null;
};

var SPAZCORE_AUTHTYPE_BASIC = "basic", SPAZCORE_AUTHTYPE_OAUTH = "oauth", SPAZAUTH_SERVICES = {};

SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_STATUSNET] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_TUMBLR_TWITTER] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_WORDPRESS_TWITTER] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_IDENTICA] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_FREELISHUS] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_CUSTOM] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SPAZAUTH_SERVICES["default"] = {
authType: SPAZCORE_AUTHTYPE_BASIC
}, SpazAuth.addService = function(e, t) {
SPAZAUTH_SERVICES[e] = t;
}, SpazBasicAuth.prototype.authorize = function(e, t, n) {
return this.username = e, this.password = t, this.authHeader = "Basic " + sc.helpers.Base64.encode(e + ":" + t), n && n.call(this, !0), !0;
}, SpazBasicAuth.prototype.signRequest = function() {
return this.authHeader;
}, SpazBasicAuth.prototype.load = function(e) {
var t = e.split(":", 2);
return t.length != 2 ? (sch.error("Invalid basic auth pickle: " + e), !1) : (this.authorize(t[0], t[1]), !0);
}, SpazBasicAuth.prototype.save = function() {
return this.username + ":" + this.password;
}, SpazBasicAuth.prototype.getUsername = function() {
return this.username;
}, SpazBasicAuth.prototype.getPassword = function() {
return this.password;
}, SpazOAuth.prototype.authorize = function(e, t, n) {
var r = this, i = !1;
this.username = e;
var s = {
x_auth_username: e,
x_auth_password: t,
x_auth_mode: "client_auth"
};
OAuth.completeRequest({
method: "post",
action: this.opts.accessURL,
parameters: s
}, this.opts), n && (i = !0);
var o = null;
return jQuery.ajax({
async: i,
type: "post",
url: this.opts.accessURL,
data: s,
dataType: "text",
success: function(e, t, i) {
sch.error(i), sch.error("xhr.responseText:" + i.responseText), sch.error("xhr.responseXML:" + i.responseXML), sch.error("getAllResponseHeaders:n" + i.getAllResponseHeaders()), sch.error("OAuth Data return"), sch.error(sch.enJSON(e));
var s = OAuth.decodeForm(e);
sch.error("results"), sch.error(sch.enJSON(s)), o = {}, o.key = OAuth.getParameter(s, "oauth_token"), o.secret = OAuth.getParameter(s, "oauth_token_secret"), r.setAccessToken(o.key, o.secret), n && n.call(this, !0, o);
},
error: function(e, t, r) {
sch.error("Failed to fetch oAuth access token: " + e.responseText), n && n.call(this, !1);
},
complete: function(e, t) {
sch.error("COMPLETE:"), sch.error("xhr.responseText:" + e.responseText), sch.error("xhr.responseXML:" + e.responseXML), sch.error("getAllResponseHeaders:n" + e.getAllResponseHeaders());
},
beforeSend: function(e) {
e.setRequestHeader("Accept-Encoding", "none"), e.setRequestHeader("Cookie", "");
}
}), i !== !0 ? o != null ? !0 : !1 : null;
}, SpazOAuth.prototype.setAccessToken = function(e, t) {
this.accessToken = {
key: e,
secret: t
}, this.signingCredentials = {
consumerKey: this.opts.consumerKey,
consumerSecret: this.opts.consumerSecret,
token: e,
tokenSecret: t
};
}, SpazOAuth.prototype.signRequest = function(e, t, n) {
var r = jQuery.extend({}, n);
return OAuth.completeRequest({
method: e,
action: t,
parameters: r
}, this.signingCredentials), OAuth.getAuthorizationHeader(this.realm, r);
}, SpazOAuth.prototype.load = function(e) {
var t = e.split(":", 3);
return t.length != 3 ? (sch.error("Invalid oauth pickle: " + e), !1) : (this.username = t[0], this.setAccessToken(t[1], t[2]), !0);
}, SpazOAuth.prototype.save = function() {
return this.username + ":" + this.accessToken.key + ":" + this.accessToken.secret;
};

var SpazFilterChain = function(e) {
e = sch.defaults({
filters: null
}, e), this._filters = [];
if (e.filters) for (var t = 0; t < e.filters.length; t++) this.addFilter(e.filters[t].label, e.filters[t].func);
};

SpazFilterChain.prototype.addFilter = function(e, t, n) {
var r = {
label: e,
func: t
};
n ? this._filters.splice(n, 0, r) : this._filters.push(r), sch.debug('added filter "' + e + '"');
}, SpazFilterChain.prototype.removeFilter = function(e) {
var t = this.getFilterIndex(e), n = this._filters.splice(t, 1);
sch.debug('removed filter "' + e + '": ' + n);
}, SpazFilterChain.prototype.nukeFilters = function() {
this._filters = [], sch.debug("filters nuked");
}, SpazFilterChain.prototype.makeFilterFirst = function(e) {
var t = this.getFilterIndex(e);
if (t !== 0) {
var n = this._filters.splice(t, 1);
this._filters.unshift(n);
}
}, SpazFilterChain.prototype.makeFilterLast = function(e) {
var t = this.getFilterIndex(e);
if (t !== this._filters.langth - 1) {
var n = this._filters.splice(t, 1);
this._filters.push(n);
}
}, SpazFilterChain.prototype.getFilterList = function() {
var e = [];
for (var t = 0; t < this._filters.length; t++) e.push(this._filters[t].label);
return e;
}, SpazFilterChain.prototype.process = function(e) {
var t;
for (var n = 0; n < this._filters.length; n++) t = this._filters[n], sch.debug("Calling filter " + t.label), e = t.func(e);
return e;
}, SpazFilterChain.prototype.processArray = function(e) {
var t;
for (var n = 0; n < e.length; n++) for (var r = 0; r < this._filters.length; r++) {
t = this._filters[r], sch.debug("Calling filter " + t.label), e[n] = t.func(e[n]);
if (e[n] === null) break;
}
return e = _.compact(e), e;
}, SpazFilterChain.prototype.getFilterIndex = function(e) {
for (var t = 0; t < this._filters.length; t++) if (this._filters[t].label === e) return t;
return !1;
};

var sc, DOMParser, jQuery, SpazImageUploader = function(e) {
e && this.setOpts(e);
};

SpazImageUploader.prototype.setOpts = function(e) {
this.opts = sch.defaults({
extra: {},
auth_obj: null,
username: null,
password: null,
auth_method: "echo",
statusnet_api_base: null
}, e);
}, SpazImageUploader.prototype.getServiceLabels = function() {
var e = [];
for (var t in this.services) e.push(t);
return e;
}, SpazImageUploader.prototype.services = {
drippic: {
url: "http://drippic.com/drippic2/upload",
parseResponse: function(e) {
var t = new DOMParser;
xmldoc = t.parseFromString(e, "text/xml");
var n, r, i;
try {
r = xmldoc.getElementsByTagName("rsp")[0].attributes, n = r.getNamedItem("stat").nodeValue;
} catch (s) {
return i = "Unknown error uploading image", {
error: i
};
}
if (n == "ok") {
var o = xmldoc.getElementsByTagName("mediaurl")[0].childNodes[0].nodeValue;
return {
url: o
};
}
return xmldoc.getElementsByTagName("err")[0] ? i = xmldoc.getElementsByTagName("err")[0].childNodes[0].nodeValue : i = xmldoc.getElementsByTagName("error")[0].childNodes[0].nodeValue, sch.error(i), {
error: i
};
}
},
pikchur: {
url: "http://api.pikchur.com/simple/upload",
extra: {
api_key: "MzTrvEd/uPNjGDabr539FA",
source: "NjMw"
},
parseResponse: function(e) {
var t = new DOMParser;
xmldoc = t.parseFromString(e, "text/xml");
var n, r = xmldoc.getElementsByTagName("rsp")[0].attributes;
r.getNamedItem("status") ? n = r.getNamedItem("status").nodeValue : r.getNamedItem("stat") ? n = r.getNamedItem("stat").nodeValue : n = "fuck I wish they would use the same goddamn nodenames";
if (n == "ok") {
var i = xmldoc.getElementsByTagName("mediaurl")[0].childNodes[0].nodeValue;
return {
url: i
};
}
var s;
return xmldoc.getElementsByTagName("err")[0] ? s = xmldoc.getElementsByTagName("err")[0].attributes : s = xmldoc.getElementsByTagName("error")[0].attributes, sch.error(s), errMsg = s.getNamedItem("msg").nodeValue, sch.error(errMsg), {
error: errMsg
};
}
},
twitpic: {
url: "http://api.twitpic.com/2/upload.json",
extra: {
key: "3d8f511397248dc913193a6195c4a018"
},
parseResponse: function(e) {
return sch.isString(e) && (e = sch.deJSON(e)), e.url ? {
url: e.url
} : {
error: "unknown error"
};
}
},
twitgoo: {
url: "http://twitgoo.com/api/upload",
extra: {
format: "xml",
source: "Spaz",
source_url: "http://getspaz.com"
},
parseResponse: function(e) {
var t = new DOMParser;
xmldoc = t.parseFromString(e, "text/xml");
var n, r = xmldoc.getElementsByTagName("rsp")[0].attributes;
n = r.getNamedItem("status").nodeValue;
if (n == "ok") {
var i = xmldoc.getElementsByTagName("mediaurl")[0].childNodes[0].nodeValue;
return {
url: i
};
}
var s;
return xmldoc.getElementsByTagName("err")[0] ? s = xmldoc.getElementsByTagName("err")[0].attributes : s = xmldoc.getElementsByTagName("error")[0].attributes, sch.error(s), errMsg = s.getNamedItem("msg").nodeValue, sch.error(errMsg), {
error: errMsg
};
}
},
"identi.ca": {
url: "https://identi.ca/api/statusnet/media/upload",
parseResponse: function(e) {
var t = new DOMParser;
xmldoc = t.parseFromString(e, "text/xml");
var n, r = xmldoc.getElementsByTagName("rsp")[0].attributes;
n = r.getNamedItem("stat").nodeValue;
if (n == "ok") {
var i = xmldoc.getElementsByTagName("mediaurl")[0].childNodes[0].nodeValue;
return {
url: i
};
}
var s;
return xmldoc.getElementsByTagName("err")[0] ? s = xmldoc.getElementsByTagName("err")[0].childNodes[0].nodeValue : s = xmldoc.getElementsByTagName("error")[0].childNodes[0].nodeValue, sch.error(s), {
error: s
};
}
},
StatusNet: {
url: "/statusnet/media/upload",
prepForUpload: function() {
this.opts.statusnet_api_base ? this.services.StatusNet.url = this.opts.statusnet_api_base + this.services.StatusNet.url : sch.error("opts.statusnet_api_base must be set to use statusnet uploader service");
},
parseResponse: function(e) {
var t = new DOMParser;
xmldoc = t.parseFromString(e, "text/xml");
var n, r = xmldoc.getElementsByTagName("rsp")[0].attributes;
n = r.getNamedItem("stat").nodeValue;
if (n == "ok") {
var i = xmldoc.getElementsByTagName("mediaurl")[0].childNodes[0].nodeValue;
return {
url: i
};
}
var s;
return xmldoc.getElementsByTagName("err")[0] ? s = xmldoc.getElementsByTagName("err")[0].childNodes[0].nodeValue : s = xmldoc.getElementsByTagName("error")[0].childNodes[0].nodeValue, sch.error(s), {
error: s
};
}
}
}, SpazImageUploader.prototype.getAuthHeader = function() {
var e = sch.defaults({
getEchoHeaderOpts: {}
}, this.opts), t, n = e.username, r = e.password;
if (e.auth_method === "echo") {
var i = new SpazTwit({
auth: e.auth_obj
});
t = i.getEchoHeader(e.getEchoHeaderOpts);
} else t = e.auth_obj.signRequest();
return sch.error(t), t;
}, SpazImageUploader.prototype.upload = function() {
var e = sch.defaults({
extra: {}
}, this.opts), t = this.services[e.service];
t.prepForUpload && t.prepForUpload.call(this), e.url = t.url, t.extra && (e.extra = jQuery.extend(e.extra, t.extra));
var n, r;
t.parseResponse ? n = function(n) {
return sch.isString(n) ? (r = t.parseResponse.call(t, n), e.onSuccess(r)) : n && n.responseString ? (r = t.parseResponse.call(t, n.responseString), e.onSuccess(r)) : arguments[1] && arguments[1].responseString ? (r = t.parseResponse.call(t, arguments[1].responseString), e.onSuccess(r)) : e.onSuccess.apply(this, arguments);
} : n = e.onSuccess;
var i;
e.service === "yfrog" ? (verify_url = "https://api.twitter.com/1/account/verify_credentials.xml", i = this.getAuthHeader({
getEchoHeaderOpts: {
verify_url: verify_url
}
})) : (verify_url = "https://api.twitter.com/1/account/verify_credentials.json", i = this.getAuthHeader()), i.indexOf("Basic ") === 0 ? (e.username = this.opts.auth_obj.getUsername(), e.password = this.opts.auth_obj.getPassword(), e.headers || (e.headers = {}), e.headers.Authorization = i) : (e.headers || (e.headers = {}), e.headers["X-Auth-Service-Provider"] = verify_url, e.headers["X-Verify-Credentials-Authorization"] = i), sc.helpers.HTTPUploadFile(e, n, e.onFailure);
}, SpazImageURL.prototype.initAPIs = function() {
this.addAPI("drippic", {
url_regex: new RegExp("http://drippic.com/([a-zA-Z0-9]+)", "gi"),
getThumbnailUrl: function(e) {
var t = "http://drippic.com/drippic/show/thumb/" + e;
return t;
},
getImageUrl: function(e) {
var t = "http://drippic.com/drippic/show/full/" + e;
return t;
}
}), this.addAPI("twitpic", {
url_regex: new RegExp("http://twitpic.com/([a-zA-Z0-9]+)", "gi"),
getThumbnailUrl: function(e) {
var t = "http://twitpic.com/show/thumb/" + e;
return t;
},
getImageUrl: function(e) {
var t = "http://twitpic.com/show/large/" + e;
return t;
}
}), this.addAPI("yfrog", {
url_regex: new RegExp("http://yfrog.(?:com|us)/([a-zA-Z0-9]+)", "gim"),
getThumbnailUrl: function(e) {
var t = "http://yfrog.com/" + e + ".th.jpg";
return t;
},
getImageUrl: function(e) {
var t = "http://yfrog.com/" + e + ":iphone";
return t;
}
}), this.addAPI("twitgoo", {
url_regex: /http:\/\/twitgoo.com\/([a-zA-Z0-9]+)/gi,
getThumbnailUrl: function(e) {
var t = "http://twitgoo.com/show/thumb/" + e;
return t;
},
getImageUrl: function(e) {
var t = "http://twitgoo.com/show/img/" + e;
return t;
}
}), this.addAPI("pikchur", {
url_regex: /http:\/\/(?:pikchur\.com|pk\.gd)\/([a-zA-Z0-9]+)/gi,
getThumbnailUrl: function(e) {
var t = "http://img.pikchur.com/pic_" + e + "_s.jpg";
return t;
},
getImageUrl: function(e) {
var t = "http://img.pikchur.com/pic_" + e + "_l.jpg";
return t;
}
}), this.addAPI("tweetphoto", {
url_regex: /http:\/\/tweetphoto.com\/([a-zA-Z0-9]+)/gi,
getThumbnailUrl: function(e) {
var t = "http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=thumbnail&url=http://tweetphoto.com/" + e;
return t;
},
getImageUrl: function(e) {
var t = "http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://tweetphoto.com/" + e;
return t;
}
}), this.addAPI("pic.gd", {
url_regex: /http:\/\/pic.gd\/([a-zA-Z0-9]+)/gi,
getThumbnailUrl: function(e) {
var t = "http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=thumbnail&url=http://pic.gd/" + e;
return t;
},
getImageUrl: function(e) {
var t = "http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://pic.gd/" + e;
return t;
}
});
}, SpazImageURL.prototype.getAPIs = function() {
return this.apis;
}, SpazImageURL.prototype.getAPI = function(e) {
return this.apis[e];
}, SpazImageURL.prototype.addAPI = function(e, t) {
var n = {};
n.url_regex = t.url_regex, n.getThumbnailUrl = t.getThumbnailUrl, n.getImageUrl = t.getImageUrl, this.apis[e] = n;
}, SpazImageURL.prototype.findServiceUrlsInString = function(e) {
var t = {}, n = 0, r, i, s;
for (i in this.apis) {
s = this.getAPI(i), sch.dump(i), sch.dump(s.url_regex);
while ((r = s.url_regex.exec(sch.trim(e))) != null) sch.dump(r), t[i] || (t[i] = []), t[i].push(r), n++;
}
return sch.dump("num_matches:" + n), sch.dump(t), n > 0 ? t : null;
}, SpazImageURL.prototype.getThumbsForMatches = function(e) {
var t, n, r, i, s = {}, o = 0;
for (n in e) {
sch.dump("SERVICE:" + n), r = this.getAPI(n), urls = e[n], sch.dump("URLS:" + urls);
for (var u = 0; u < urls.length; u++) {
var a = urls[u];
s[a[0]] = r.getThumbnailUrl(a[1]), o++;
}
}
return sch.dump("num_urls:" + o), sch.dump(s), o > 0 ? s : null;
}, SpazImageURL.prototype.getThumbsForUrls = function(e) {
var t = this.findServiceUrlsInString(e);
if (t) return this.getThumbsForMatches(t);
var n = [ "png", "gif", "png", "jpg", "jpeg" ], t = [];
sch.dump(e);
var r = e.match(/"(.*)"/g, "$1");
for (var i in r) r[i].search(/\.(jpg|png|gif|jpeg)/) != -1 && t.push(r[i].replace(/"/g, ""));
return sch.dump(t), null;
}, SpazImageURL.prototype.getThumbForUrl = function(e) {
var t = this.getThumbsForUrls(e);
return t ? t[e] : null;
}, SpazImageURL.prototype.getImagesForMatches = function(e) {
var t, n, r, i, s = {}, o = 0;
for (n in e) {
sch.dump("SERVICE:" + n), r = this.getAPI(n), urls = e[n], sch.dump("URLS:" + urls);
for (var u = 0; u < urls.length; u++) {
var a = urls[u];
s[a[0]] = r.getImageUrl(a[1]), o++;
}
}
return sch.dump("num_urls:" + o), sch.dump(s), o > 0 ? s : null;
}, SpazImageURL.prototype.getImagesForUrls = function(e) {
var t = this.findServiceUrlsInString(e);
return t ? this.getImagesForMatches(t) : null;
}, SpazImageURL.prototype.getImageForUrl = function(e) {
var t = this.getImagesForUrls(e);
return t ? t[e] : null;
};

var sc, jQuery;

SpazPhotoMailer.prototype.getAPILabels = function() {
var e = [];
for (var t in this.getAPIs()) e.push(t);
return e;
}, SpazPhotoMailer.prototype.getAPIs = function() {
var e = this, t = {
yfrog: {
email_tpl: "{{username}}.??????@yfrog.com",
message_in: "subject",
email_info_url: "http://yfrog.com/froggy.php",
help_text: "Log-in to yfrog.com with your Twitter username and password, and click 'my yfrog.' Your customized posting email will be listed on the right.",
getToAddress: function(t) {
var n = t.username;
return e.apis.yfrog.email_tpl.replace("{{username}}", n);
}
},
posterous: {
email_tpl: "post@posterous.com",
message_in: "subject",
email_info_url: "http://posterous.com/autopost",
help_text: "Post instantly to your Posterous blog. Setup autopost to post back to Twitter! Login for more information and controls.",
getToAddress: function(t) {
return e.apis.posterous.email_tpl;
}
},
pikchur: {
email_tpl: "{{username}}.???@pikchur.com",
message_in: "subject",
email_info_url: "http://pikchur.com/dashboard/profile",
help_text: "Log-in to pikchur with your Twitter username and password, and click 'Profile.' Your customized posting email will be listed",
getToAddress: function(t) {
var n = t.username;
return e.apis.pikchur.email_tpl.replace("{{username}}", n);
}
},
twitgoo: {
email_tpl: "m@twitgoo.com",
message_in: "subject",
email_info_url: "http://twitgoo.com/-settings/mobile",
help_text: "Log-in to twitgoo.com and click 'Settings.' Add the email address from which you'll be sending messages.",
getToAddress: function(t) {
return e.apis.twitgoo.email_tpl;
}
},
twitpic: {
email_tpl: "{{username}}.####@twitpic.com",
message_in: "subject",
email_info_url: "http://twitpic.com/settings.do",
help_text: "Log-in to twitpic.com, and click 'Settings.' Your custom email address will be listed.",
getToAddress: function(t) {
var n = t.username;
return e.apis.twitpic.email_tpl.replace("{{username}}", n);
}
},
tweetphoto: {
email_tpl: "{{username}}.####@tweetphoto.com",
message_in: "subject",
email_info_url: "http://www.tweetphoto.com/mysettings.php",
help_text: "Log-in to tweetphoto.com and click 'My Settings.' Your custom email address will be listed.",
getToAddress: function(t) {
var n = t.username;
return e.apis.tweetphoto.email_tpl.replace("{{username}}", n);
},
retrievePostingAddress: function(e, t, n, r) {
function i(e, t) {
var n = "http://tweetphotoapi.com/api/tpapi.svc/json/users/" + e, i = "TPAPI: " + e + "," + t;
jQuery.ajax({
dataType: "text",
success: function(e, t) {
var n = sc.helpers.deJSON(e);
},
error: function(e, t, n) {
r(e, t, n);
},
beforeSend: function(n) {
n.setRequestHeader("TPAPI", e + "," + t);
},
url: n
});
}
function s(e, t, i) {
var s = "TPAPI: " + e + "," + t;
jQuery.ajax({
dataType: "text",
success: function(e, t) {
var r = sc.helpers.deJSON(e);
n(r.Email);
},
error: function(e, t, n) {
r(e, t, n);
},
beforeSend: function(n) {
n.setRequestHeader("TPAPI", e + "," + t);
},
url: i
});
}
}
}
};
return t;
}, SpazPhotoMailer.prototype.setAPI = function(e) {
this.api = this.apis[e];
}, SpazPhotoMailer.prototype.send = function(e, t, n) {};

var sc, Titanium, air, jQuery, Mojo, SPAZCORE_PREFS_TI_KEY = "preferences.json", SPAZCORE_PREFS_AIR_FILENAME = "preferences.json", SPAZCORE_PREFS_MOJO_COOKIENAME = "preferences.json", SPAZCORE_PREFS_STANDARD_COOKIENAME = "preferences_json";

SpazPrefs.prototype.setDefaults = function(e) {
this._defaults = e;
}, SpazPrefs.prototype._applyDefaults = function() {
var e;
for (e in this._defaults) sc.helpers.debug('Copying default "' + e + '":"' + this._defaults[e] + '" (' + typeof this._defaults[e] + ")"), this._prefs[e] = this._defaults[e];
}, SpazPrefs.prototype.resetPrefs = function() {
this._applyDefaults(), this.save();
}, SpazPrefs.prototype.get = function(e, t) {
var n;
return t ? n = this.getEncrypted(e) : (sc.helpers.debug('Looking for pref "' + e + '"'), this._prefs[e] !== undefined ? (sc.helpers.debug('Found pref "' + e + '" of value "' + this._prefs[e] + '" (' + typeof this._prefs[e] + ")"), n = this._prefs[e]) : n = undefined), this._sanity_methods[e] && this._sanity_methods[e].onGet && (sc.helpers.debug("Calling " + e + ".onGet()"), n = this._sanity_methods[e].onGet.call(this, e, n)), n;
}, SpazPrefs.prototype.set = function(e, t, n) {
sc.helpers.debug('Setting and saving "' + e + '" to "' + t + '" (' + typeof t + ")"), this._sanity_methods[e] && this._sanity_methods[e].onSet && (sc.helpers.debug("Calling " + e + ".onSet()"), t = this._sanity_methods[e].onSet.call(this, e, t)), n ? this.setEncrypted(e, t) : this._prefs[e] = t, this.save();
}, SpazPrefs.prototype.setSanityMethod = function(e, t, n) {
t !== "onGet" && t !== "onSet" && sch.error("sanity method type must be onGet or onSet"), this._sanity_methods[e] || (this._sanity_methods[e] = {}), this._sanity_methods[e][t] = n;
}, SpazPrefs.prototype.getEncrypted = function(e) {
alert("not yet implemented");
}, SpazPrefs.prototype.setEncrypted = function(e, t) {
alert("not yet implemented");
}, SpazPrefs.prototype.load = function(e) {}, SpazPrefs.prototype.save = function() {};

if (sc) var scPrefs = SpazPrefs;

var sc;

SpazShortText.prototype.genBaseMaps = function() {
this.basemap = {
about: "abt",
account: "acct",
address: "addy",
anyone: "ne1",
and: "&",
at: "@",
"at the moment": "atm",
back: "bk",
"be right back": "brb",
"be back later": "bbl",
"be back soon": "bbs",
because: "b/c",
boyfriend: "bf",
but: "but",
girlfriend: "gf",
between: "b/t",
"by the way": "btw",
definitely: "def",
everyone: "evr1",
favorite: "fav",
"for": "fr",
from: "frm",
"for example": "Fr ex",
follow: "fllw",
follower: "fllwr",
followers: "fllwrs",
following: "fllwng",
good: "gd",
got: "gt",
having: "hvg",
hours: "hrs",
"i don't know": "idk",
"if i recall correctly": "iirc",
"in my opinion": "imo",
"in my humble opinion": "imho",
just: "jst",
little: "lttl",
love: "<3",
message: "msg",
midnight: "12am",
"never mind": "nm",
"no problem": "np",
"not much": "nm",
pages: "pgs",
pictures: "pics",
obviously: "obvs",
please: "pls",
seriously: "srsly",
something: "s/t",
sorry: "sry",
text: "txt",
thanks: "thx",
think: "thk",
"to be honest": "tbh",
though: "tho",
through: "thru",
weeks: "wks",
"with": "w",
without: "w/o",
that: "tht",
what: "wht",
have: "hv",
"don't": "dnt",
was: "ws",
well: "wll",
right: "rt",
here: "hr",
going: "gng",
like: "lk",
can: "cn",
want: "wnt",
"that's": "thts",
there: "thr",
come: "cme",
really: "rly",
would: "wld",
look: "lk",
when: "whn",
okay: "ok",
"can't": "cnt",
tell: "tll",
"I'll": "Ill",
could: "cl",
"didn't": "ddnt",
yes: "y",
had: "hd",
then: "thn",
take: "tke",
make: "mk",
gonna: "gna",
never: "nvr",
them: "thm",
more: "mr",
over: "ovr",
where: "whr",
"what's": "whts",
thing: "thg",
maybe: "mybe",
down: "dwn",
very: "very",
should: "shld",
anything: "nethg",
said: "sd",
any: "ne",
even: "evn",
thank: "thk",
give: "gve",
thought: "thot",
help: "hlp",
talk: "tlk",
people: "ppl",
find: "fnd",
nothing: "nthg",
again: "agn",
things: "thgs",
call: "cll",
told: "tld",
great: "grt",
before: "b4",
better: "bttr",
ever: "evr",
night: "nite",
than: "thn",
away: "awy",
first: "1st",
believe: "blve",
other: "othr",
everything: "evrythg",
work: "wrk",
fine: "fne",
home: "hme",
after: "aftr",
last: "lst",
keep: "kp",
around: "arnd",
stop: "stp",
"long": "lng",
always: "alwys",
listen: "lstn",
wanted: "wntd",
happened: "hppnd",
"won't": "wnt",
trying: "tryng",
kind: "knd",
wrong: "wrng",
talking: "tlkg",
being: "bng",
bad: "bd",
remember: "rmbr",
getting: "gttg",
together: "togthr",
mother: "mom",
understand: "undrstd",
"wouldn't": "wldnt",
actually: "actly",
baby: "bby",
father: "dad",
done: "dne",
"wasn't": "wsnt",
might: "mite",
every: "evry",
enough: "engh",
someone: "sm1",
family: "fmly",
whole: "whl",
another: "anthr",
jack: "jck",
yourself: "yrslf",
best: "bst",
must: "mst",
coming: "cmg",
looking: "lkg",
woman: "wmn",
which: "whch",
years: "yrs",
room: "rm",
left: "lft",
tonight: "2nte",
real: "rl",
hmm: "hm",
happy: "hpy",
pretty: "prty",
girl: "grl",
show: "shw",
friend: "frnd",
already: "alrdy",
saying: "syng",
next: "nxt",
job: "jb",
problem: "prblm",
minute: "min",
found: "fnd",
world: "wrld",
thinking: "thkg",
"haven't": "hvnt",
heard: "hrd",
honey: "hny",
matter: "mttr",
myself: "myslf",
"couldn't": "cldnt",
exactly: "xctly",
probably: "prob",
happen: "hppn",
"we've": "wve",
hurt: "hrt",
both: "bth",
gotta: "gtta",
alone: "alne",
excuse: "xcse",
start: "strt",
today: "2dy",
ready: "rdy",
until: "untl",
whatever: "wtevr",
wants: "wnts",
hold: "hld",
yet: "yt",
took: "tk",
once: "1ce",
gone: "gne",
called: "clld",
morning: "morn",
supposed: "sppsd",
friends: "frnds",
stuff: "stff",
most: "mst",
used: "usd",
worry: "wrry",
second: "2nd",
part: "prt",
truth: "trth",
school: "schl",
forget: "frgt",
business: "biz",
cause: "cuz",
telling: "tllg",
chance: "chnce",
move: "mv",
person: "prsn",
somebody: "smbdy",
heart: "hrt",
point: "pt",
later: "ltr",
making: "makg",
anyway: "nywy",
many: "mny",
phone: "phn",
reason: "rsn",
looks: "lks",
bring: "brng",
turn: "trn",
tomorrow: "tmrw",
trust: "trst",
check: "chk",
change: "chng",
anymore: "anymr",
town: "twn",
"aren't": "rnt",
working: "wrkg",
year: "yr",
taking: "tkg",
means: "mns",
brother: "bro",
play: "ply",
hate: "h8",
says: "sez",
beautiful: "btfl",
crazy: "crzy",
party: "prty",
afraid: "afrd",
important: "imptnt",
rest: "rst",
word: "wrd",
watch: "wtch",
glad: "gld",
sister: "sistr",
minutes: "min",
everybody: "evrybdy",
couple: "cpl",
either: "ethr",
feeling: "flg",
under: "undr",
"break": "brk",
promise: "prmse",
easy: "ez",
question: "q",
doctor: "doc",
walk: "wlk",
trouble: "trbl",
different: "diff",
hospital: "hsptl",
anybody: "anybdy",
wedding: "wddg",
perfect: "prfct",
police: "cops",
waiting: "wtng",
dinner: "din",
against: "agst",
funny: "fny",
husband: "hsbnd",
child: "kid",
"shouldn't": "shldnt",
half: "1/2",
moment: "mmnt",
sleep: "slp",
started: "strtd",
young: "yng",
sounds: "snds",
lucky: "lky",
sometimes: "smtimes",
plan: "pln",
serious: "srs",
ahead: "ahd",
week: "wk",
wonderful: "wndfl",
past: "pst",
number: "#",
nobody: "nbdy",
along: "alng",
"finally": "fnly",
worried: "wrrd",
book: "bk",
sort: "srt",
safe: "sfe",
living: "livg",
children: "kids",
"weren't": "wrnt",
front: "frnt",
loved: "luvd",
asking: "askg",
running: "rnng",
clear: "clr",
figure: "fgr",
felt: "flt",
parents: "prnts",
absolutely: "abs",
alive: "alve",
meant: "mnt",
happens: "hppns",
kidding: "kddg",
full: "fl",
meeting: "mtg",
coffee: "cffe",
sound: "snd",
women: "wmn",
welcome: "wlcm",
months: "mnths",
hour: "hr",
speak: "spk",
thinks: "thks",
Christmas: "Xmas",
possible: "pssble",
worse: "wrs",
company: "co",
mistake: "mstk",
handle: "hndl",
spend: "spnd",
totally: "ttly",
giving: "gvg",
control: "ctrl",
realize: "rlze",
power: "pwr",
president: "pres",
girls: "grls",
taken: "tkn",
picture: "pic",
talked: "tlkd",
hundred: "hndrd",
changed: "chgd",
completely: "cmpltly",
explain: "exp",
playing: "plyg",
relationship: "rlshp",
loves: "lvs",
fucking: "fkg",
anywhere: "newhr",
questions: "qs",
wonder: "wndr",
calling: "cllg",
somewhere: "smwhr",
straight: "str8",
fast: "fst",
words: "wrds",
worked: "wrkd",
light: "lite",
cannot: "can't",
protect: "prtct",
"class": "cls",
surprise: "sprise",
sweetheart: "swthrt",
looked: "lkd",
except: "xcpt",
takes: "tks",
situation: "sitn",
besides: "bsds",
pull: "pll",
himself: "hmslf",
"hasn't": "hsnt",
worth: "wrth",
amazing: "amzg",
given: "gvn",
expect: "xpct",
rather: "rthr",
black: "blk",
movie: "film",
country: "cntry",
perhaps: "prhps",
watching: "wtchg",
darling: "darlg",
honor: "hnr",
personal: "prsnl",
moving: "movg",
till: "til",
admit: "admt",
problems: "prbs",
information: "info",
honest: "hnst",
missed: "mssd",
longer: "lngr",
dollars: "$s",
evening: "eve",
starting: "strtg",
suppose: "spps",
street: "st",
sitting: "sttg",
favor: "fvr",
apartment: "apt",
court: "crt",
terrible: "trrbl",
clean: "cln",
learn: "lrn",
works: "wks",
relax: "rlx",
million: "mil",
prove: "prv",
smart: "smrt",
missing: "missg",
forgot: "frgt",
small: "sm",
interested: "intrstd",
table: "tbl",
become: "bcm",
pregnant: "preg",
middle: "mddl",
ring: "rng",
careful: "crfl",
figured: "fgrd",
stick: "stk",
stopped: "stppd",
standing: "stndg",
forgive: "frgv",
wearing: "wearg",
hoping: "hopg",
thousand: "k",
paper: "ppr",
tough: "tuff",
count: "cnt",
birthday: "bday",
history: "hstry",
share: "shr",
offer: "offr",
hurry: "hrry",
feet: "ft",
wondering: "wonderg",
building: "buildg",
ones: "1s",
finish: "fin",
"would've": "wldve",
interesting: "intrstg",
enjoy: "njoy",
road: "rd",
staying: "stayg",
"short": "shrt",
finished: "fin",
respect: "rspct",
spent: "spnt",
attention: "attn",
holding: "hldg",
surprised: "srprsd",
keeping: "kpg",
putting: "puttg",
dark: "drk",
self: "slf",
using: "usg",
helping: "helpg",
normal: "nrml",
lawyer: "atty",
floor: "flr",
whether: "whthr",
"everything's": "evrthg's",
present: "prsnt",
"private": "priv",
cover: "cvr",
judge: "jdg",
upstairs: "upstrs",
mommy: "mom",
possibly: "pssbly",
worst: "wrst",
"I am": "I'm",
"I will": "I'll",
"I had": "I'd",
"I would": "I'd",
"I have": "I've",
"You are": "You're",
"You will": "You'll",
"You had": "You'd",
"You would": "You'd",
"You have": "You've",
"He is": "He's",
"He has": "He's",
"He will": "He'll",
"He had": "He'd",
"He would": "He'd",
"She is": "She's",
"She has": "She's",
"She will": "She'll",
"She had": "She'd",
"She would": "She'd",
"It is": "It's",
"It has": "It's",
"It will": "It'll",
"It would": "It'd",
"It had": "It'd",
"We are": "We're",
"We will": "We'll",
"We had": "We'd",
"We would": "We'd",
"We have": "We've",
"They are": "They're",
"They will": "They'll",
"They had": "They'd",
"They would": "They'd",
"They have": "They've",
"There is": "There's",
"There has": "There's",
"There will": "There'll",
"There had": "There'd",
"There would": "There'd",
"That is": "That's",
"That has": "That's",
"That will": "That'll",
"That had": "That'd",
"That would": "That'd",
"are not": "aren't",
"can not": "can't",
"could not": "couldn't",
"did not": "didn't",
"does not": "doesn't",
"do not": "don't",
"had not": "hadn't",
"has not": "hasn't",
"is not": "isn't",
"must not": "mustn't",
"need not": "needn't",
"should not": "shouldn't",
"was not": "wasn't",
"were not": "weren't",
"will not": "won't",
"would not": "wouldn't",
one: "1",
two: "2",
three: "3",
four: "4",
five: "5",
six: "6",
seven: "7",
eight: "8",
nine: "9",
ten: "10",
eleven: "11",
twelve: "12",
twenty: "20"
}, this.baserawmap = {
"--": "\u2013",
"-\\s+": "-",
"\\s+-": "-",
"\\s+": " ",
"\\s+$": "",
"^\\s+": "",
"\\s?\\.\\.\\.": "\u2026",
"\\.\\s+": ". ",
"\\.\\s*$": "",
"RT:? @[a-z0-9_]+:? RT:? @([a-z0-9_]+):?": "RT @$1"
};
}, SpazShortText.prototype.processBaseMaps = function() {
var e, t, n, r;
for (e in this.basemap) t = this.basemap[e], n = new RegExp("(\\b)" + e + "(\\b)", "gi"), this.map[e] = {
"short": "$1" + t + "$2",
regex: n
};
for (e in this.baserawmap) t = this.baserawmap[e], n = new RegExp(e, "gi"), this.map[e] = {
"short": t,
regex: n
};
}, SpazShortText.prototype.shorten = function(e) {
for (var t in this.map) {
var n = this.map[t].regex, r = this.map[t]["short"];
e = e.replace(n, r);
}
return e;
}, SpazShortText.prototype.addMap = function(e, t, n) {
n = n || !1, n ? this.baserawmap[e] = t : this.basemap[e] = t, this.processBaseMaps();
}, SpazShortText.prototype.getMaps = function() {
return this.map;
};

var sc, jQuery, SPAZCORE_SHORTURL_SERVICE_ISGD = "is.gd", SPAZCORE_SHORTURL_SERVICE_BITLY = "bit.ly", SPAZCORE_SHORTURL_SERVICE_JMP = "j.mp", SPAZCORE_SHORTURL_SERVICE_GOOGLE = "goo.gl", SPAZCORE_SHORTURL_SERVICE_GOLOOKAT = "go.ly", SPAZCORE_EXPANDABLE_DOMAINS = [ "bit.ly", "cli.gs", "digg.com", "fb.me", "is.gd", "j.mp", "kl.am", "su.pr", "tinyurl.com", "goo.gl", "307.to", "adjix.com", "b23.ru", "bacn.me", "bloat.me", "budurl.com", "chzb.gr", "clipurl.us", "cort.as", "dwarfurl.com", "ff.im", "fff.to", "goo.gl", "href.in", "ht.ly", "idek.net", "korta.nu", "lin.cr", "livesi.de", "ln-s.net", "loopt.us", "lost.in", "memurl.com", "merky.de", "migre.me", "moourl.com", "nanourl.se", "om.ly", "ow.ly", "peaurl.com", "ping.fm", "piurl.com", "plurl.me", "pnt.me", "poprl.com", "post.ly", "rde.me", "reallytinyurl.com", "redir.ec", "retwt.me", "rubyurl.com", "short.ie", "short.to", "smallr.com", "sn.im", "sn.vc", "snipr.com", "snipurl.com", "snurl.com", "t.co", "tiny.cc", "tinysong.com", "togoto.us", "tr.im", "tra.kz", "trg.li", "twurl.cc", "twurl.nl", "u.mavrev.com", "u.nu", "un.cr", "ur1.ca", "url.az", "url.ie", "urlx.ie", "w34.us", "xrl.us", "yep.it", "zi.ma", "zurl.ws", "chilp.it", "notlong.com", "qlnk.net", "trim.li", "url4.eu" ];

sc.events || (sc.events = {}), sc.events.newShortURLSuccess = "newShortURLSuccess", sc.events.newShortURLFailure = "newShortURLFailure", sc.events.newExpandURLSuccess = "recoverLongURLSuccess", sc.events.newExpandURLFailure = "recoverLongURLFailure", SpazShortURL.prototype.services = {}, SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_BITLY] = {
url: "http://api.bit.ly/v3/shorten",
getData: function(e, t) {
var n = {
longurl: e,
login: t.login,
apiKey: t.apiKey,
format: "json"
};
return n;
},
method: "GET",
processResult: function(e, t) {
var n = sc.helpers.deJSON(e);
return n.data && n.data.long_url && (n.longurl = n.data.long_url, n.shorturl = n.data.url), n;
}
}, SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_JMP] = {
url: "http://api.j.mp/v3/shorten",
getData: function(e, t) {
var n = {
longurl: e,
login: t.login,
apiKey: t.apiKey,
format: "json"
};
return n;
},
method: "GET",
processResult: function(e, t) {
var n = sc.helpers.deJSON(e);
return n.data && n.data.long_url && (n.longurl = n.data.long_url, n.shorturl = n.data.url), n;
}
}, SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_ISGD] = {
url: "http://is.gd/create.php",
getData: function(e, t) {
return {
url: e,
format: "simple"
};
}
}, SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_GOLOOKAT] = {
url: "http://api.golook.at/",
getData: function(e, t) {
return {
url: e,
output_format: "json",
anybase: 1
};
},
method: "GET",
processResult: function(e, t) {
var n = sc.helpers.deJSON(e);
return n.orig_url && n.short_url && (n.longurl = n.orig_url, n.shorturl = n.short_url), n;
}
}, SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_GOOGLE] = {
url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBMFTY7VjWGoXeFwbiY7vXoqAssjTr0od0",
contentType: "application/json",
getData: function(e, t) {
return JSON.stringify({
longUrl: e
});
},
processResult: function(e, t) {
var n = sc.helpers.deJSON(e);
return n.longUrl && n.id && (n.longurl = t, n.shorturl = n.id), n;
}
}, SpazShortURL.prototype.getServiceLabels = function() {
var e = [];
for (var t in this.services) e.push(t);
return e;
}, SpazShortURL.prototype.getAPIObj = function(e) {
return this.services[e];
}, SpazShortURL.prototype.shorten = function(e, t) {
function s(e, t, n, r, i) {
jQuery.ajax({
traditional: !0,
dataType: "text",
complete: function(e, t) {},
error: function(e, n, i) {
sc.helpers.dump(t.api.url + " error:" + n);
var s = {
url: t.api.url,
xhr: null,
msg: null
};
e ? (s.xhr = e, sc.helpers.error("Error:" + e.status + " from " + t.api.url)) : (sc.helpers.error("Error:Unknown from " + t.api.url), s.msg = "Unknown Error"), t._onShortenResponseFailure(s, r.event_target), r.onError && r.onError(s);
},
success: function(n) {
var i = {};
t.api.processResult ? i = t.api.processResult(n, e) : i = {
shorturl: n,
longurl: e
}, sch.error(i), t._onShortenResponseSuccess(i, r.event_target), r.onSuccess && r.onSuccess(i);
},
type: i.api.method || "POST",
contentType: i.api.contentType || "application/x-www-form-urlencoded",
url: i.api.url,
data: n
});
}
var n = this;
t || (t = {}), t.event_target = t.event_target || document, t.apiopts = t.apiopts || null, sch.isString(e) && (e = [ e ]);
for (var r = 0; r < e.length; r++) {
e[r];
var i = this.api.getData(e[r], t.apiopts);
sc.helpers.getMojoURL && (this.api.url = sc.helpers.getMojoURL(this.api.url)), s(e[r], n, i, t, this);
}
}, SpazShortURL.prototype._onShortenResponseSuccess = function(e, t) {
sc.helpers.triggerCustomEvent(sc.events.newShortURLSuccess, t, e);
}, SpazShortURL.prototype._onShortenResponseFailure = function(e, t) {
sc.helpers.triggerCustomEvent(sc.events.newShortURLFailure, t, e);
}, SpazShortURL.prototype.expand = function(e, t) {
var n = this, r;
t || (t = {}), t.event_target = t.event_target || document;
if (r = this.getExpandedURLFromCache()) {
n._onExpandResponseSuccess({
shorturl: e,
longurl: r
}, t.event_target);
return;
}
var i = jQuery.ajax({
dataType: "text",
complete: function(e, t) {},
error: function(e, r, i) {
sc.helpers.dump(this.url + " error:" + r);
var s = {
url: this.url,
xhr: null,
msg: null
};
e ? (s.xhr = e, sc.helpers.dump("Error:" + e.status + " from " + this.url)) : (sc.helpers.dump("Error:Unknown from " + this.url), s.msg = "Unknown Error"), n._onExpandResponseFailure(s, t.event_target), t.onError && t.onError(s);
},
success: function(r) {
r = sch.deJSON(r);
var i = r.final_url;
n.saveExpandedURLToCache(e, i);
var s = {
shorturl: e,
longurl: i
};
n._onExpandResponseSuccess(s, t.event_target), t.onSuccess && t.onSuccess(s);
},
beforeSend: function(e) {},
type: "GET",
url: "http://api.getspaz.com/url/resolve",
data: {
url: e
}
});
}, SpazShortURL.prototype._onExpandResponseSuccess = function(e, t) {
sc.helpers.triggerCustomEvent(sc.events.newExpandURLSuccess, t, e);
}, SpazShortURL.prototype._onExpandResponseFailure = function(e, t) {
sc.helpers.triggerCustomEvent(sc.events.newExpandURLFailure, t, e);
}, SpazShortURL.prototype.findExpandableURLs = function(e) {
var t, n, r, i = [], s, o, u, a = [], f = sch.extractURLs(e);
for (n = 0; n < SPAZCORE_EXPANDABLE_DOMAINS.length; n++) o = SPAZCORE_EXPANDABLE_DOMAINS[n], o == "ff.im" ? a.push(new RegExp("http://" + o + "/(-?[a-zA-Z0-9]+)", "gi")) : o == "ow.ly" ? a.push(new RegExp("http://" + o + "/(-?[a-zA-Z0-9]{2,})", "gi")) : o == "goo.gl" ? a.push(new RegExp("http://" + o + "/(?:fb/|)(-?[a-zA-Z0-9]+)", "gi")) : a.push(new RegExp("http://" + o + "/([a-zA-Z0-9-_]+)", "gi"));
sch.debug("looking for " + a + " in '" + e + "'");
for (n = 0; n < a.length; n++) {
u = a[n];
while ((re_matches = u.exec(sch.trim(e))) != null) i.push(re_matches[0]);
}
return sch.debug("Matches: " + i), i.length > 0 ? i : null;
}, SpazShortURL.prototype.expandURLs = function(e, t, n, r) {
for (var i = 0; i < e.length; i++) {
var s = e[i];
sch.dump("expanding " + s), this.expand(s, {
event_target: t,
onSuccess: n,
onFailure: r
});
}
}, SpazShortURL.prototype.replaceExpandableURL = function(e, t, n) {
return e = e.replace(t, n, "gi"), e = e.replace(t.replace("http://", ""), n ? n.replace("http://", "") : "", "gi"), e;
}, SpazShortURL.prototype.getExpandedURLFromCache = function(e) {
return this.expanded_cache[e];
}, SpazShortURL.prototype.saveExpandedURLToCache = function(e, t) {
this.expanded_cache[e] = t;
};

var sc;

SpazTemplate.prototype.addTemplateMethod = function(e, t) {
this._tpls[e] = t;
}, SpazTemplate.prototype.parseTemplate = function(e, t) {
var n = this._tpls[e](t);
return n;
}, SpazTemplate.prototype.parseArray = function(e, t) {
var n = "";
for (var r = 0; r < t.length; r++) n += this.parseTemplate(e, t[r]);
return n;
};

var sc, jQuery, SpazTimeline = function(e) {
var t = this;
this.refresh = function() {
sch.debug("Refreshing timeline"), t.requestData.call(t);
}, this.onSuccess = function(e, n) {
sch.debug("onSuccess timeline"), t.data_success.call(t, e, n), t.startRefresher();
}, this.onFailure = function(e, n) {
sch.debug("onFailure timeline"), t.data_failure.call(t, e, n), t.startRefresher();
}, this._init(e);
};

SpazTimeline.prototype._init = function(e) {
e = e || {}, this.max_items = e.max_items || 100, this.refresh_time = e.refresh_time || 12e4, this.timeline_container_selector = e.timeline_container_selector || "#timeline", this.timeline_item_selector = e.timeline_item_selector || "div.timeline-entry", this.event_target = e.event_target || jQuery(this.timeline_container_selector).get(0), this.add_method = e.add_method || "prepend", this.success_event = e.success_event || "timeline-success", this.failure_event = e.failure_event || "timeline-failure", this.renderer = e.renderer || null, this.request_data = e.request_data || null, this.data_success = e.data_success || null, this.data_failure = e.data_failure || null, this.refresher = e.refresher || null;
if (!this.renderer) throw new Error("renderer is required");
if (!this.request_data) throw new Error("request_data is required");
if (!this.data_success) throw new Error("data_success is required");
this.container = jQuery(this.timeline_container_selector).get(0);
}, SpazTimeline.prototype.last_id = -1, SpazTimeline.prototype.model = [], SpazTimeline.prototype.start = function() {
sch.debug("Starting timeline"), this.requestData();
}, SpazTimeline.prototype.requestData = function() {
sch.debug("Requesting data timeline"), this.stopRefresher(), this.stopListening(), this.startListening();
var e = this.request_data();
}, SpazTimeline.prototype.startListening = function() {
var e = this;
sc.helpers.debug("Listening for " + e.success_event), sc.helpers.listen(e.event_target, e.success_event, e.onSuccess), sc.helpers.listen(e.event_target, e.failure_event, e.onFailure);
}, SpazTimeline.prototype.stopListening = function() {
var e = this;
sc.helpers.debug("Stopping listening for " + e.success_event), sc.helpers.unlisten(e.event_target, e.success_event), sc.helpers.unlisten(e.event_target, e.failure_event);
}, SpazTimeline.prototype.startRefresher = function() {
this.stopRefresher(), sc.helpers.debug("Starting refresher"), this.refresh_time > 1e3 ? (sc.helpers.debug("Refresh time is " + this.refresh_time + "ms"), this.refresher = setInterval(this.refresh, this.refresh_time)) : sc.helpers.debug("Not starting refresher; refresh time is " + this.refresh_time + "ms");
}, SpazTimeline.prototype.stopRefresher = function() {
sc.helpers.debug("Stopping refresher"), clearInterval(this.refresher);
}, SpazTimeline.prototype.cleanup = function() {
sch.debug("Cleaning up timeline"), this.stopListening(), this.stopRefresher();
}, SpazTimeline.prototype.addItems = function(e) {
sch.debug("Adding items to timeline");
var t = [], n = "";
for (var r = 0; r < e.length; r++) t.push(this.renderItem(e[r], this.renderer));
this.add_method === "append" ? (t.reverse(), n = t.join(""), this.append(n)) : (n = t.join(""), this.prepend(n)), this.removeExtraItems();
}, SpazTimeline.prototype.renderItem = function(e, t) {
sch.debug("Rendering item in timeline");
var n = t(e);
return n;
}, SpazTimeline.prototype.removeExtraItems = function() {
sch.debug("Removing extra items in timeline");
if (this.add_method === "append") var e = !0; else e = !1;
sc.helpers.removeExtraElements(this.getEntrySelector(), this.max_items, e);
}, SpazTimeline.prototype.removeItems = function(e) {}, SpazTimeline.prototype.removeItem = function(e) {}, SpazTimeline.prototype.itemExists = function(e) {
sch.debug("Checking it item (" + e + ") exists in timeline");
var t = this.select(e);
return t.length > 0 ? !0 : !1;
}, SpazTimeline.prototype.hideItems = function(e) {
sch.debug("Hiding items in timeline"), this.filterItems(e, "blacklist");
}, SpazTimeline.prototype.showItems = function(e) {
sch.debug("Showing items in timeline"), this.filterItems(e, "whitelist");
}, SpazTimeline.prototype.filterItems = function(e, t) {}, SpazTimeline.prototype.sortItems = function(e, t) {
sch.debug("Sorting items in timeline");
var n = this.select(e);
n.sort(t);
}, SpazTimeline.prototype.select = function(e, t) {
return t || (t = this.timeline_container_selector), jQuery(e, t).get();
}, SpazTimeline.prototype.prepend = function(e) {
jQuery(this.timeline_container_selector).prepend(e);
}, SpazTimeline.prototype.append = function(e) {
jQuery(this.timeline_container_selector).append(e);
}, SpazTimeline.prototype.getEntrySelector = function() {
return this.timeline_container_selector + " " + this.timeline_item_selector;
}, SpazTimelineFilter = function(e) {
e || (e = {}), e.type !== "whitelist" && (e.type = "blacklist"), this.settings = {
name: e.name || "unnamed",
type: e.type,
usernames_show: e.usernames_show || [],
usernames_hide: e.usernames_hide || [],
content_show: e.content_show || [],
content_hide: e.content_hide || [],
filter_class_prefix: e.filter_class_prefix || "customfilter-",
timeline_selector: e.timeline_selector || "div.timeline",
entry_selector: e.entry_selector || "div.timeline-entry",
username_attr: e.username_attr || "data-user-screen_name",
content_selector: e.content_selector || "div.timeline-entry status-text",
style_selector: e.style_selector || 'style[title="custom-timeline-filters"]'
};
}, SpazTimelineFilter.prototype.getBaseSelector = function() {
var e = this.settings.timeline_selector + "." + this.getTimelineClass() + " " + this.settings.entry_selector;
return e;
}, SpazTimelineFilter.prototype.getTimelineClass = function() {
return this.settings.filter_class_prefix + this.settings.name;
}, SpazTimelineFilter.prototype.getUserCSS = function() {
var e = "", t = "", n = [], r;
e = this.getBaseSelector();
if (this.settings.type === "whitelist") t = e + " { display:none; }", n.push(t); else {
if (this.settings.type !== "blacklist") return null;
t = e + " { display:block; }", n.push(t);
}
for (var i = 0; i < this.settings.usernames_show.length; i++) r = this.settings.usernames_show[i], t = e + "[" + this.settings.username_attr + "='" + r + "'] { display:block; }", n.push(t);
for (var i = 0; i < this.settings.usernames_hide.length; i++) r = this.settings.usernames_show[i], t = e + "[" + this.settings.username_attr + "='" + r + "'] { display:none; }", n.push(t);
return n.join("\n");
}, SpazTimelineFilter.prototype.parseUsersFromString = function(e, t) {
t !== "hide" && (t = "show");
var n = e.split(",");
for (var r = 0; r < n.length; r++) n[r] = sch.trim(n[r]);
this.parseUsersFromArray(n, t);
}, SpazTimelineFilter.prototype.parseUsersFromArray = function(e, t) {
t !== "hide" && (t = "show"), t === "hide" ? this.usernames_hide = e : this.usernames_show = e;
}, SpazTimelineFilter.prototype.addUser = function(e, t) {
t !== "hide" && (t = "show");
var n = sch.trim(e);
t === "hide" ? this.usernames_hide.push(n) : this.usernames_show.push(n);
}, SpazTimelineFilter.prototype.parseContentStringsFromString = function(e, t) {
t !== "hide" && (t = "show");
var n = e.split(",");
for (var r = 0; r < n.length; r++) n[r] = sch.trim(n[r]);
this.parseContentStringsFromArray(n, t);
}, SpazTimelineFilter.prototype.parseContentStringsFromArray = function(e, t) {
t !== "hide" && (t = "show"), t === "hide" ? this.content_hide = e : this.content_show = e;
}, SpazTimelineFilter.prototype.addContentString = function(e, t) {
t !== "hide" && (t = "show");
var n = sch.trim(e);
t === "hide" ? this.content_hide.push(n) : this.content_show.push(n);
}, SpazTimelineFilter.prototype.settingsToJSON = function() {
return sch.enJSON(this.settings);
}, SpazTimelineFilter.prototype.settingsFromJSON = function(e) {
this.settings = sch.deJSON(e);
}, SpazTimelineFilter.prototype.applyUserCSS = function() {
jQuery(this.settings.style_selector).text(this.getUserCSS());
}, SpazTimelineFilter.prototype.disableUserCSS = function() {
jQuery(this.settings.style_selector).text("");
}, SpazTimelineFilter.prototype.applyContentFilters = function() {
var e, t = this.buildContentFilterSelectors(), n = jQuery(this.getBaseSelector());
for (var r = 0; r < t.hide.length; r++) n.filter(t.hide[r]).hide();
for (var r = 0; r < t.show.length; r++) n.filter(t.show[r]).show();
}, SpazTimelineFilter.prototype.disableContentFilters = function() {
var e = jQuery(this.getBaseSelector());
e.filter().show();
}, SpazTimelineFilter.prototype.buildContentFilterSelectors = function() {
var e = {
hide: [],
show: []
};
for (var t = 0; t < this.settings.content_hide.length; t++) thiscontent = this.settings.content_hide[t], e.hide.push(':contains("' + thiscontent + '")');
for (var t = 0; t < this.settings.content_show.length; t++) thiscontent = this.settings.content_show[t], e.show.push(':contains("' + thiscontent + '")');
return e;
}, SpazTimelineFilter.prototype.apply = function() {
this.applyUserCSS(), this.applyContentFilters();
}, SpazTimelineFilter.prototype.disable = function() {
this.disableUserCSS(), this.disableContentFilters();
};

var sc, DOMParser, jQuery, sch;

sc.events || (sc.events = {}), sc.events.tmdbMethodSuccess = "tmdbMethodSuccess", sc.events.tmdbMethodFailure = "tmdbMethodFailure", sc.events.tmdbMovieSearchSuccess = "tmdbMovieSearchSuccess", sc.events.tmdbMovieSearchFailure = "tmdbMovieSearchFailure", sc.events.tmdbMovieIMDBLookupSuccess = "tmdbMovieIMDBLookupSuccess", sc.events.tmdbMovieIMDBLookupFailure = "tmdbMovieIMDBLookupFailure", sc.events.tmdbMovieGetInfoSuccess = "tmdbMovieGetInfoSuccess", sc.events.tmdbMovieGetInfoFailure = "tmdbMovieGetInfoFailure", sc.events.tmdbMovieGetImagesSuccess = "tmdbMovieGetImagesSuccess", sc.events.tmdbMovieGetImagesFailure = "tmdbMovieGetImagesFailure", sc.events.tmdbPersonSearchSuccess = "tmdbPersonSearchSuccess", sc.events.tmdbPersonSearchFailure = "tmdbPersonSearchFailure", sc.events.tmdbPersonGetInfoSuccess = "tmdbPersonGetInfoSuccess", sc.events.tmdbPersonGetInfoFailure = "tmdbPersonGetInfoFailure", sc.events.tmdbHashGetInfoSuccess = "tmdbHashGetInfoSuccess", sc.events.tmdbHashGetInfoFailure = "tmdbHashGetInfoFailure", SpazTMDB.prototype.setAPIKey = function(e) {
this.apikey = e;
}, SpazTMDB.prototype.getAPIKey = function() {
return this.apikey;
}, SpazTMDB.prototype.movieSearch = function(e, t, n) {
this.callMethod({
method: "Movie.search",
value: e,
successEvent: sc.events.tmdbMovieSearchSuccess,
failureEvent: sc.events.tmdbMovieSearchFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.movieInfo = function(e, t, n) {
this.callMethod({
method: "Movie.getInfo",
value: e,
successEvent: sc.events.tmdbMovieGetInfoSuccess,
failureEvent: sc.events.tmdbMovieGetInfoFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.movieImages = function(e, t, n) {
this.callMethod({
method: "Movie.getImages",
value: e,
successEvent: sc.events.tmdbMovieGetInfoSuccess,
failureEvent: sc.events.tmdbMovieGetInfoFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.movieInfoIMDB = function(e, t, n) {
this.callMethod({
method: "Movie.imdbLookup",
value: e,
successEvent: sc.events.tmdbMovieIMDBLookupSuccess,
failureEvent: sc.events.tmdbMovieIMDBLookupFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.personInfo = function(e, t, n) {
this.callMethod({
method: "Person.getInfo",
value: e,
successEvent: sc.events.tmdbPersonGetInfoSuccess,
failureEvent: sc.events.tmdbPersonGetInfoFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.personSearch = function(e, t, n) {
this.callMethod({
method: "Person.search",
value: e,
successEvent: sc.events.tmdbPersonSearchSuccess,
failureEvent: sc.events.tmdbPersonSearchFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.movieInfoHash = function(e, t, n) {
this.callMethod({
method: "Hash.getInfo",
value: e,
successEvent: sc.events.tmdbHashGetInfoSuccess,
failureEvent: sc.events.tmdbHashGetInfoFailure,
onSuccess: t,
onFailure: n
});
}, SpazTMDB.prototype.getURL = function(e, t) {
var n = this.baseURL + e + "/" + this.lang + "/" + this.format + "/" + this.apikey + "/" + encodeURIComponent(t);
return n;
}, SpazTMDB.prototype.callMethod = function(e) {
var t = this;
e = sch.defaults({
method: "Movie.search",
value: "Road House",
successEvent: sc.events.tmdbMethodSuccess,
failureEvent: sc.events.tmdbMethodFailure,
onSuccess: null,
onFailure: null
}, e);
var n = this.getURL(e.method, e.value);
jQuery.ajax({
url: n,
type: "GET",
success: function(n, r) {
e.onSuccess && e.onSuccess.call(t, n, r), sch.trigger(e.successEvent, t.eventTarget, n);
},
error: function(r, i, s) {
e.onFailure && e.onFailure.call(t, r, i, s), sch.trigger(e.failure, t.eventTarget, {
url: n,
xhr: r,
msg: i
});
}
});
};

var sc, jQuery, Mojo, use_palmhost_proxy, SPAZCORE_SECTION_FRIENDS = "friends", SPAZCORE_SECTION_HOME = "home", SPAZCORE_SECTION_REPLIES = "replies", SPAZCORE_SECTION_DMS = "dms", SPAZCORE_SECTION_DMSENT = "dmsent", SPAZCORE_SECTION_FAVORITES = "favorites", SPAZCORE_SECTION_COMBINED = "combined", SPAZCORE_SECTION_PUBLIC = "public", SPAZCORE_SECTION_SEARCH = "search", SPAZCORE_SERVICEURL_TWITTERSEARCH = "https://search.twitter.com/", SPAZCORE_SERVICEURL_IDENTICA = "https://identi.ca/api/", SPAZCORE_SECTION_USER = "user-timeline", SPAZCORE_SECTION_FRIENDLIST = "friendslist", SPAZCORE_SECTION_FOLLOWERSLIST = "followerslist", SPAZCORE_SECTION_USERLISTS = "userlists", SPAZCORE_SERVICEURL_TWITTER = "https://api.twitter.com/1/", SPAZCORE_SERVICEURL_IDENTICA = "https://identi.ca/api/", SPAZCORE_SERVICEURL_FREELISHUS = "http://freelish.us/api/", SPAZCORE_SERVICEURL_WORDPRESS_TWITTER = "https://twitter-api.wordpress.com/", SPAZCORE_SERVICEURL_TUMBLR_TWITTER = "http://www.tumblr.com/";

SpazTwit.prototype.DEFAULT_TIMEOUT = 6e4, SpazTwit.prototype.getLastId = function(e) {
return this.data[e].lastid;
}, SpazTwit.prototype.setLastId = function(e, t) {
this.data[e].lastid = t;
}, SpazTwit.prototype.initializeData = function() {
this.data = {}, this.data[SPAZCORE_SECTION_HOME] = {
lastid: 1,
items: [],
newitems: [],
max: 200,
min_age: 300
}, this.data[SPAZCORE_SECTION_FRIENDS] = {
lastid: 1,
items: [],
newitems: [],
max: 200,
min_age: 300
}, this.data[SPAZCORE_SECTION_REPLIES] = {
lastid: 1,
items: [],
newitems: [],
max: 50,
min_age: 300
}, this.data[SPAZCORE_SECTION_DMS] = {
lastid: 1,
items: [],
newitems: [],
max: 50,
min_age: 300
}, this.data[SPAZCORE_SECTION_DMSENT] = {
lastid: 1,
items: [],
newitems: [],
max: 50,
min_age: 300
}, this.data[SPAZCORE_SECTION_FAVORITES] = {
lastid: 1,
items: [],
newitems: [],
max: 100,
min_age: 300
}, this.data[SPAZCORE_SECTION_COMBINED] = {
items: [],
newitems: [],
updates: [],
max: 400,
min_age: 300
}, this.data[SPAZCORE_SECTION_FRIENDLIST] = {
items: [],
newitems: [],
max: 500,
min_age: 300
}, this.data[SPAZCORE_SECTION_FOLLOWERSLIST] = {
items: [],
newitems: [],
max: 500,
min_age: 300
}, this.data[SPAZCORE_SECTION_SEARCH] = {
lastid: 0,
items: [],
newitems: [],
lastresultdata: {},
max: 200,
min_age: 30
}, this.data[SPAZCORE_SECTION_USERLISTS] = {
items: [],
newitems: [],
max: 500,
min_age: 300
};
}, SpazTwit.prototype.initializeCombinedTracker = function() {
this.combined_finished = {}, this.combined_finished[SPAZCORE_SECTION_HOME] = !1, this.combined_finished[SPAZCORE_SECTION_REPLIES] = !1, this.combined_finished[SPAZCORE_SECTION_DMS] = !1, this.combined_finished[SPAZCORE_SECTION_DMSENT] = !1, this.combined_errors = [];
}, SpazTwit.prototype.combinedTimelineFinished = function() {
for (var e in this.combined_finished) if (!this.combined_finished[e]) return !1;
return !0;
}, SpazTwit.prototype.combinedTimelineHasErrors = function() {
return this.combined_errors.length > 0 ? !0 : !1;
}, SpazTwit.prototype.combinedTimelineHasUpdates = function() {
return this.data[SPAZCORE_SECTION_COMBINED].updates.length > 0;
}, SpazTwit.prototype.combinedTimelineAddUpdates = function(e) {
e.id && (e = [ e ]);
var t;
for (t in e) this.data[SPAZCORE_SECTION_COMBINED].updates.push(e[t].id);
}, SpazTwit.prototype.combinedNewItemsRemoveUpdates = function() {
if (!this.combinedTimelineHasUpdates()) return;
var e = this.data[SPAZCORE_SECTION_COMBINED], t = ":" + e.updates.join(":") + ":", n = e.newitems, r = [], i;
for (i in n) RegExp(":" + n[i].id + ":").test(t) || r.push(n[i]);
e.newitems = r, e.updates = [];
}, SpazTwit.prototype.setBaseURL = function(e) {
var t = e.charAt(e.length - 1);
t !== "/" && (e += "/"), this.baseurl = e;
}, SpazTwit.prototype.setBaseURLByService = function(e) {
var t = "";
switch (e) {
case SPAZCORE_SERVICE_TWITTER:
t = SPAZCORE_SERVICEURL_TWITTER;
break;
case SPAZCORE_SERVICE_IDENTICA:
t = SPAZCORE_SERVICEURL_IDENTICA;
break;
case SPAZCORE_SERVICE_FREELISHUS:
t = SPAZCORE_SERVICEURL_FREELISHUS;
break;
case SPAZCORE_SERVICE_WORDPRESS_TWITTER:
t = SPAZCORE_SERVICEURL_WORDPRESS_TWITTER;
break;
case SPAZCORE_SERVICE_TUMBLR_TWITTER:
t = SPAZCORE_SERVICEURL_TUMBLR_TWITTER;
break;
default:
t = SPAZCORE_SERVICEURL_TWITTER;
}
this.baseurl = t;
}, SpazTwit.prototype.getServiceFromBaseURL = function(e) {
var t;
e || (e = this.baseurl);
switch (e) {
case SPAZCORE_SERVICEURL_TWITTER:
t = SPAZCORE_SERVICE_TWITTER;
break;
case SPAZCORE_SERVICEURL_IDENTICA:
t = SPAZCORE_SERVICE_IDENTICA;
break;
case SPAZCORE_SERVICEURL_FREELISHUS:
t = SPAZCORE_SERVICE_FREELISHUS;
break;
case SPAZCORE_SERVICEURL_WORDPRESS_TWITTER:
t = SPAZCORE_SERVICE_WORDPRESS_TWITTER;
break;
case SPAZCORE_SERVICEURL_TUMBLR_TWITTER:
t = SPAZCORE_SERVICE_TUMBLR_TWITTER;
break;
default:
t = SPAZCORE_SERVICE_CUSTOM;
}
return t;
}, SpazTwit.prototype.setCredentials = function(e) {
this.auth = e, this.username = this.auth.username;
}, SpazTwit.prototype.setSource = function(e) {
this.source = e;
}, SpazTwit.prototype.getAPIURL = function(e, t) {
var n = {};
return n.public_timeline = "statuses/public_timeline.json", n.friends_timeline = "statuses/friends_timeline.json", n.home_timeline = "statuses/home_timeline.json", n.user_timeline = "statuses/user_timeline.json", n.replies_timeline = "statuses/replies.json", n.show = "statuses/show/{{ID}}.json", n.show_related = "related_results/show/{{ID}}.json", n.favorites = "favorites.json", n.user_favorites = "favorites/{{ID}}.json", n.dm_timeline = "direct_messages.json", n.dm_sent = "direct_messages/sent.json", n.friendslist = "statuses/friends.json", n.followerslist = "statuses/followers.json", n.show_user = "users/show.json", n.featuredlist = "statuses/featured.json", n.update = "statuses/update.json", n.destroy_status = "statuses/destroy/{{ID}}.json", n.dm_new = "direct_messages/new.json", n.dm_destroy = "direct_messages/destroy/{{ID}}.json", n.friendship_create = "friendships/create/{{ID}}.json", n.friendship_destroy = "friendships/destroy/{{ID}}.json", n.friendship_show = "friendships/show.json", n.friendship_incoming = "friendships/incoming.json", n.friendship_outgoing = "friendships/outgoing.json", n.graph_friends = "friends/ids.json", n.graph_followers = "followers/ids.json", n.block_create = "blocks/create/{{ID}}.json", n.block_destroy = "blocks/destroy/{{ID}}.json", n.follow = "notifications/follow/{{ID}}.json", n.unfollow = "notifications/leave/{{ID}}.json", n.favorites_create = "favorites/create/{{ID}}.json", n.favorites_destroy = "favorites/destroy/{{ID}}.json", n.saved_searches_create = "saved_searches/create.json", n.saved_searches_destroy = "saved_searches/destroy/{{ID}}.json", n.verify_credentials = "account/verify_credentials.json", n.ratelimit_status = "account/rate_limit_status.json", n.update_profile = "account/update_profile.json", n.saved_searches = "saved_searches.json", n.report_spam = "report_spam.json", n.lists = "{{USER}}/lists.json", n.lists_list = "{{USER}}/lists/{{SLUG}}.json", n.lists_memberships = "{{USER}}/lists/memberships.json", n.lists_timeline = "{{USER}}/lists/{{SLUG}}/statuses.json", n.lists_members = "{{USER}}/{{SLUG}}/members.json", n.lists_check_member = "{{USER}}/{{SLUG}}/members/{{ID}}.json", n.lists_subscribers = "{{USER}}/{{SLUG}}/subscribers.json", n.lists_check_subscriber = "{{USER}}/{{SLUG}}/subscribers/{{ID}}.json", n.lists_subscriptions = "{{USER}}/lists/subscriptions.json", n.trends = "trends/1.json", n.trends_current = "trends/current.json", n.trends_daily = "trends/daily.json", n.trends_weekly = "trends/weekly.json", n.retweet = "statuses/retweet/{{ID}}.json", n.retweets = "statuses/retweets/{{ID}}.json", n.retweeted_by_me = "statuses/retweeted_by_me.json", n.retweeted_to_me = "statuses/retweeted_to_me.json", n.retweets_of_me = "statuses/retweets_of_me.json", n.search = "search.json", n.test = "help/test.json", n.downtime_schedule = "help/downtime_schedule.json", n[e].indexOf("{{ID}}") > -1 && (typeof t == "string" ? n[e] = n[e].replace("{{ID}}", t) : t && typeof t == "object" && (n[e] = n[e].replace("{{ID}}", t.id))), n[e].indexOf("{{USER}}") > -1 && t && typeof t == "object" && (n[e] = n[e].replace("{{USER}}", t.user)), n[e].indexOf("{{SLUG}}") > -1 && t && typeof t == "object" && (n[e] = n[e].replace("{{SLUG}}", t.slug)), n[e] ? (t && typeof t != "string" ? t = "?" + jQuery.param(t) : t = "", e == "search" ? this._postProcessURL(SPAZCORE_SERVICEURL_TWITTERSEARCH + n[e] + t) : this._postProcessURL(this.baseurl + n[e] + t)) : !1;
}, SpazTwit.prototype.verifyCredentials = function(e, t) {
var n = this.getAPIURL("verify_credentials"), r = {
url: n,
process_callback: this._processAuthenticatedUser,
success_event_type: "verify_credentials_succeeded",
failure_event_type: "verify_credentials_failed",
success_callback: e,
failure_callback: t,
method: "GET"
}, i = this._callMethod(r);
}, SpazTwit.prototype._processAuthenticatedUser = function(e, t) {
this.me = e, this.initializeData(), t.success_callback && t.success_callback(this.me), this.triggerEvent(t.success_event_type, this.me);
}, SpazTwit.prototype.getPublicTimeline = function(e, t) {
var n = this.getAPIURL("public_timeline"), r = this._getTimeline({
url: n,
success_callback: e,
failure_callback: t,
success_event_type: "new_public_timeline_data"
});
}, SpazTwit.prototype.getHomeTimeline = function(e, t, n, r, i, s) {
n || (n = null), t || (t = 50), e || (this.data[SPAZCORE_SECTION_HOME].lastid && this.data[SPAZCORE_SECTION_HOME].lastid > 1 ? e = this.data[SPAZCORE_SECTION_HOME].lastid : e = 1), r || (r = {}), r.combined && (r.section = SPAZCORE_SECTION_HOME);
var o = {};
e[0] == "-" ? o.max_id = e.replace("-", "") : o.since_id = e, o.count = t, n && (o.page = n);
var u = this.getAPIURL("home_timeline", o);
this._getTimeline({
url: u,
process_callback: this._processHomeTimeline,
success_callback: i,
failure_callback: s,
success_event_type: "new_home_timeline_data",
failure_event_type: "error_home_timeline_data",
processing_opts: r
});
}, SpazTwit.prototype._processHomeTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_HOME, e, t, n);
}, SpazTwit.prototype.getFriendsTimeline = function(e, t, n, r, i, s) {
n || (n = null), t || (t = 50), e || (this.data[SPAZCORE_SECTION_FRIENDS].lastid && this.data[SPAZCORE_SECTION_FRIENDS].lastid > 1 ? e = this.data[SPAZCORE_SECTION_FRIENDS].lastid : e = 1), r || (r = {}), r.combined && (r.section = SPAZCORE_SECTION_FRIENDS);
var o = {};
o.since_id = e, o.count = t, n && (o.page = n);
var u = this.getAPIURL("friends_timeline", o);
this._getTimeline({
url: u,
process_callback: this._processFriendsTimeline,
success_callback: i,
failure_callback: s,
success_event_type: "new_friends_timeline_data",
failure_event_type: "error_friends_timeline_data",
processing_opts: r
});
}, SpazTwit.prototype._processFriendsTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_FRIENDS, e, t, n);
}, SpazTwit.prototype.getReplies = function(e, t, n, r, i, s) {
n || (n = null), t || (t = null), e || (this.data[SPAZCORE_SECTION_REPLIES].lastid && this.data[SPAZCORE_SECTION_REPLIES].lastid > 1 ? e = this.data[SPAZCORE_SECTION_REPLIES].lastid : e = 1), r || (r = {}), r.combined && (r.section = SPAZCORE_SECTION_REPLIES);
var o = {};
e[0] == "-" ? o.max_id = e.replace("-", "") : o.since_id = e, n && (o.page = n), t && (o.count = t);
var u = this.getAPIURL("replies_timeline", o);
this._getTimeline({
url: u,
process_callback: this._processRepliesTimeline,
success_callback: i,
failure_callback: s,
success_event_type: "new_replies_timeline_data",
failure_event_type: "error_replies_timeline_data",
processing_opts: r
});
}, SpazTwit.prototype._processRepliesTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_REPLIES, e, t, n);
}, SpazTwit.prototype.getDirectMessages = function(e, t, n, r, i, s) {
n || (n = null), t || (t = null), e || (this.data[SPAZCORE_SECTION_DMS].lastid && this.data[SPAZCORE_SECTION_DMS].lastid > 1 ? e = this.data[SPAZCORE_SECTION_DMS].lastid : e = 1), r || (r = {}), r.combined && (r.section = SPAZCORE_SECTION_DMS);
var o = {};
e[0] == "-" ? o.max_id = e.replace("-", "") : o.since_id = e, n && (o.page = n), t && (o.count = t);
var u = this.getAPIURL("dm_timeline", o);
this._getTimeline({
url: u,
process_callback: this._processDMTimeline,
success_callback: i,
failure_callback: s,
success_event_type: "new_dms_timeline_data",
failure_event_type: "error_dms_timeline_data",
processing_opts: r
});
}, SpazTwit.prototype._processDMTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_DMS, e, t, n);
}, SpazTwit.prototype.getFavorites = function(e, t, n, r, i) {
t || (t = null), e || (e = 1), n || (n = {});
var s = {};
e[0] == "-" ? s.max_id = e.replace("-", "") : s.since_id = e, t && (s.page = t);
var o = this.getAPIURL("favorites", s);
this._getTimeline({
url: o,
process_callback: this._processFavoritesTimeline,
success_callback: r,
failure_callback: i,
success_event_type: "new_favorites_timeline_data",
failure_event_type: "error_favorites_timeline_data",
processing_opts: n
});
}, SpazTwit.prototype._processFavoritesTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_FAVORITES, e, t, n);
}, SpazTwit.prototype.getSent = function(e, t, n, r, i) {}, SpazTwit.prototype.getSentDirectMessages = function(e, t, n, r, i, s) {
n || (n = null), t || (t = null), e || (this.data[SPAZCORE_SECTION_DMSENT].lastid && this.data[SPAZCORE_SECTION_DMSENT].lastid > 1 ? e = this.data[SPAZCORE_SECTION_DMSENT].lastid : e = 1), r || (r = {}), r.combined && (r.section = SPAZCORE_SECTION_DMSENT);
var o = {};
e < -1 ? o.max_id = Math.abs(e) : o.since_id = e, n && (o.page = n), t && (o.count = t);
var u = this.getAPIURL("dm_sent", o);
this._getTimeline({
url: u,
process_callback: this._processDMSentTimeline,
success_callback: i,
failure_callback: s,
success_event_type: "new_dms_sent_timeline_data",
failure_event_type: "error_dms_sent_timeline_data",
processing_opts: r
});
}, SpazTwit.prototype._processDMSentTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_DMSENT, e, t, n);
}, SpazTwit.prototype.getUserTimeline = function(e, t, n, r, i) {
var s = sch.defaults({
id: e,
since_id: null,
count: t || 10,
page: n || null,
onSuccess: r,
onFailure: i
}, e);
if (!s.id || "object" == typeof s.id) return;
var o = {};
o.id = s.id, o.count = s.count, s.since_id && (since_id[0] == "-" ? o.max_id = since_id.replace("-", "") : o.since_id = s.since_id), s.page && (o.page = s.page);
var u = this.getAPIURL("user_timeline", o);
this._getTimeline({
url: u,
process_callback: this._processUserTimeline,
success_callback: s.onSuccess,
failure_callback: s.onFailure,
success_event_type: "new_user_timeline_data",
failure_event_type: "error_user_timeline_data"
});
}, SpazTwit.prototype._processUserTimeline = function(e, t, n) {
this._processTimeline(SPAZCORE_SECTION_USER, e, t, n);
}, SpazTwit.prototype.getCombinedTimeline = function(e, t, n) {
var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y = {
combined: !0
};
e && (e.friends_count && (i = e.friends_count), e.home_count && (r = e.home_count), e.replies_count && (s = e.replies_count), e.dm_count && (o = e.dm_count), e.dmsent_count && (u = e.dmsent_count), e.home_since && (a = e.home_since), e.friends_since && (f = e.friend_since), e.replies_since && (h = e.replies_since), e.dm_since && (l = e.dm_since), e.dmsent_since && (c = e.dmsent_since), e.home_page && (p = e.home_page), e.friends_page && (d = e.friends_page), e.replies_page && (g = e.replies_page), e.dm_page && (v = e.dm_page), e.dmsent_page && (m = e.dmsent_page), r || (r = i), a || (a = f), p || (p = d), e.force && (y.force = !0)), this.getHomeTimeline(a, r, p, y, t, n), this.getReplies(h, s, g, y, t, n), this.getDirectMessages(l, o, v, y, t, n), this.getSentDirectMessages(c, u, m, y, t, n);
}, SpazTwit.prototype.search = function(e, t, n, r, i, s, o, u) {
r || (r = 1), n || (n = 100);
var a = {};
a.q = e, a.rpp = n, t && (t[0] == "-" ? a.max_id = t.replace("-", "") : a.since_id = t), a.page = r, i && (a.lang = i), s && (a.geocode = s);
var f = this.getAPIURL("search", a);
this._getTimeline({
url: f,
process_callback: this._processSearchTimeline,
success_callback: o,
failure_callback: u,
success_event_type: "new_search_timeline_data",
failure_event_type: "error_search_timeline_data"
});
}, SpazTwit.prototype._processSearchTimeline = function(e, t, n) {
n || (n = {}), this.data[SPAZCORE_SECTION_SEARCH].newitems = [], this.data[SPAZCORE_SECTION_SEARCH].lastresultdata = e;
var r = e.results;
if (r && r.length > 0) {
for (var i = 0; i < r.length; i++) r[i] = this._processSearchItem(r[i], SPAZCORE_SECTION_SEARCH);
r.sort(this._sortItemsAscending);
var s = r[r.length - 1].id;
this.data[SPAZCORE_SECTION_SEARCH].lastid = s, sc.helpers.dump("this.data[" + SPAZCORE_SECTION_SEARCH + "].lastid:" + this.data[SPAZCORE_SECTION_SEARCH].lastid), this.data[SPAZCORE_SECTION_SEARCH].newitems = r, this.data[SPAZCORE_SECTION_SEARCH].items = this.data[SPAZCORE_SECTION_SEARCH].items.concat(this.data[SPAZCORE_SECTION_SEARCH].newitems), this.data[SPAZCORE_SECTION_SEARCH].items = this.removeDuplicates(this.data[SPAZCORE_SECTION_SEARCH].items), sch.debug("NOT removing extras from search -- we don't do that anymore");
var o = {
since_id: e.since_id,
max_id: e.max_id,
refresh_url: e.refresh_url,
results_per_page: e.results_per_page,
next_page: e.next_page,
completed_in: e.completed_in,
page: e.page,
query: e.query
};
t.success_callback && t.success_callback(this.data[SPAZCORE_SECTION_SEARCH].newitems, o), this.triggerEvent(t.success_event_type, [ this.data[SPAZCORE_SECTION_SEARCH].newitems, o ]);
} else t.success_callback && t.success_callback(null, []), this.triggerEvent(t.success_event_type, []);
}, SpazTwit.prototype._processSearchItem = function(e, t) {
return e = this.deSnowFlake(e), e.SC_service_baseurl = this.baseurl, e.SC_service = this.getServiceFromBaseURL(this.baseurl), e.SC_timeline_from = t, this.username && (e.SC_user_received_by = this.username), e.SC_is_search = !0, e.SC_created_at_unixtime || (e.SC_created_at_unixtime = sc.helpers.httpTimeToInt(e.created_at)), e.SC_text_raw || (e.SC_text_raw = e.text), !e.in_reply_to_screen_name && e.in_reply_to_user_id, e.SC_retrieved_unixtime || (e.SC_retrieved_unixtime = sc.helpers.getTimeAsInt()), e.user = {
profile_image_url: e.profile_image_url,
screen_name: e.from_user,
id: e.from_user_id
}, e.source = sc.helpers.fromHTMLSpecialChars(e.source), e;
}, SpazTwit.prototype.getTrends = function(e, t) {
var n = this.getAPIURL("trends");
this._getTimeline({
url: n,
process_callback: this._processTrends,
success_callback: e,
failure_callback: t,
success_event_type: "new_trends_data",
failure_event_type: "error_trends_data"
});
}, SpazTwit.prototype._processTrends = function(e, t, n) {
n || (n = {});
var r = e[0].trends;
if (r && r.length > 0) {
for (var i = 0; i < r.length; i++) r[i].searchterm = r[i].name, /\s+/.test(r[i].searchterm) && (r[i].searchterm = '"' + r[i].searchterm + '"');
t.success_callback && t.success_callback(r), this.triggerEvent(t.success_event_type, r);
}
}, SpazTwit.prototype._getTimeline = function(e) {
e = sch.defaults({
method: "GET",
timeout: this.DEFAULT_TIMEOUT,
url: null,
data: null,
process_callback: null,
processing_opts: null,
success_event_type: null,
failure_event_type: null,
success_callback: null,
failure_callback: null
}, e);
var t = this;
sch.error("_getTimeline opts:"), sch.error(e);
var n = jQuery.ajax({
timeout: e.timeout,
complete: function(n, r) {
sch.error(e.url + " complete:" + r), r === "timeout" && t.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: n,
msg: r
});
},
error: function(n, r, i) {
sch.error(e.url + ' error:"' + r + '"');
if (r.toLowerCase().indexOf("timeout") !== -1) t.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: null,
msg: r
}), (!e.processing_opts || !e.processing_opts.combined) && e.failure_callback && e.failure_callback(null, r, i); else if (n) {
if (!n.readyState < 4) {
sc.helpers.dump("Error:" + n.status + " from " + e.url);
if (n.responseText) try {
var s = sc.helpers.deJSON(n.responseText);
} catch (o) {
sc.helpers.dump(o.name + ":" + o.message), s = n.responseText;
}
}
e.failure_callback && e.failure_callback(n, r, i), e.failure_event_type && (sc.helpers.dump("opts.failure_event_type:" + e.failure_event_type), t.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: n,
msg: r
}));
} else sc.helpers.dump("Error:Unknown from " + e.url), e.failure_callback && e.failure_callback(null, r, i), e.failure_event_type && t.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: n,
msg: "Unknown Error"
});
t.triggerEvent("spaztwit_ajax_error", {
url: e.url,
xhr: n,
msg: r
}), e.processing_opts && e.processing_opts.combined && (sc.helpers.dump("adding to combined processing errors"), n && n.readyState > 3 ? t.combined_errors.push({
url: e.url,
xhr: n,
msg: r,
section: e.processing_opts.section
}) : t.combined_errors.push({
url: e.url,
xhr: null,
msg: r,
section: e.processing_opts.section
}), t.combined_finished[e.processing_opts.section] = !0, sc.helpers.dump(t.combined_errors), sc.helpers.dump(t.combined_finished), e.process_callback && e.process_callback.call(t, [], e, e.processing_opts));
},
success: function(r) {
sch.error(e.url + " success!" + " data:" + r);
try {
r = sc.helpers.deJSON(r);
} catch (i) {
t.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: n,
msg: "Error decoding data from server"
});
}
e.process_callback ? e.process_callback.call(t, r, e, e.processing_opts) : (e.success_callback && (sch.error("CALLING SUCCESS CALLBACK"), e.success_callback(r)), t.triggerEvent(e.success_event_type, r));
},
beforeSend: function(n) {
sc.helpers.dump(e.url + " beforesend"), t.auth ? (sch.debug("signing request"), n.setRequestHeader("Authorization", t.auth.signRequest(e.method, e.url, e.data))) : sch.debug("NOT signing request -- no auth object provided");
},
type: e.method,
url: e.url,
data: e.data,
dataType: "text"
});
return n;
}, SpazTwit.prototype._processTimeline = function(e, t, n, r) {
sch.debug(n), r || (r = {}), e !== SPAZCORE_SECTION_USER && (this.data[e].newitems = []), t == undefined && sch.error("ret_items is undefined!");
if (t && t.length > 0) {
var i = [];
for (var s = 0; s < t.length; s++) t[s] && i.push(this._processItem(t[s], e));
t = i, i = null, t.sort(this._sortItemsAscending);
if (e === SPAZCORE_SECTION_USER) n.success_callback && n.success_callback(t), this.triggerEvent(n.success_event_type, t); else {
if (n.is_update_item) this.combinedTimelineAddUpdates(t); else {
var o = t[t.length - 1].id;
this.data[e].lastid = o, sc.helpers.dump("this.data[" + e + "].lastid:" + this.data[e].lastid);
}
this.data[e].newitems = t, this._addToSectionItems(e, this.data[e].newitems), r.combined ? (this.combined_finished[e] = !0, sc.helpers.dump("this.combined_finished[" + e + "]:" + this.combined_finished[e])) : (n.success_callback && n.success_callback(this.data[e].newitems), this.triggerEvent(n.success_event_type, this.data[e].items)), this.data[SPAZCORE_SECTION_COMBINED].newitems = this.data[SPAZCORE_SECTION_COMBINED].newitems.concat(this.data[e].newitems);
}
} else r.combined ? this.combined_finished[e] = !0 : (n.success_callback && n.success_callback(), this.triggerEvent(n.success_event_type));
this.combinedTimelineFinished() && (this.combinedNewItemsRemoveUpdates(), this._addToSectionItems(SPAZCORE_SECTION_COMBINED, this.data[SPAZCORE_SECTION_COMBINED].newitems, this._sortItemsByDateAsc), this.data[SPAZCORE_SECTION_COMBINED].newitems = this._cleanupItemArray(this.data[SPAZCORE_SECTION_COMBINED].newitems, this.data[SPAZCORE_SECTION_COMBINED].max, this._sortItemsByDateAsc), this.combinedTimelineHasErrors() && (n.failure_callback && n.failure_callback(this.combined_errors), this.triggerEvent("error_combined_timeline_data", this.combined_errors)), n.success_callback && n.success_callback(this.data[SPAZCORE_SECTION_COMBINED].newitems), sch.debug("this.data[SPAZCORE_SECTION_COMBINED].newitems has " + this.data[SPAZCORE_SECTION_COMBINED].newitems.length + " items"), this.triggerEvent("new_combined_timeline_data", this.data[SPAZCORE_SECTION_COMBINED].newitems), this.data[SPAZCORE_SECTION_COMBINED].newitems = [], this.initializeCombinedTracker());
}, SpazTwit.prototype._addToSectionItems = function(e, t, n) {
var r = this.data[e];
r.items = this._cleanupItemArray(r.items.concat(t), null, n);
}, SpazTwit.prototype._cleanupItemArray = function(e, t, n) {
return n && (e = e.sort(n)), e = this.removeDuplicates(e), sch.debug("NOT removing extras -- we don't do that anymore"), e;
}, SpazTwit.prototype._processItem = function(e, t) {
return e = this.deSnowFlake(e), e.SC_service_baseurl = this.baseurl, e.SC_service = this.getServiceFromBaseURL(this.baseurl), e.SC_timeline_from = t, this.username && (e.SC_user_received_by = this.username), e.in_reply_to_screen_name && e.SC_user_received_by && e.in_reply_to_screen_name.toLowerCase() === e.SC_user_received_by.toLowerCase() && (e.SC_is_reply = !0), e.retweeted_status && (e.SC_is_retweet = !0), t === SPAZCORE_SECTION_REPLIES && (e.SC_is_reply = !0), this.username && sc.helpers.containsScreenName(e.text, this.username) && (e.SC_is_reply = !0), e.user && (e.user = this._processUser(e.user)), e.recipient_id && e.sender_id && (e.SC_is_dm = !0, e.sender && (e.sender = this._processUser(e.sender)), e.recipient && (e.recipient = this._processUser(e.recipient))), e.SC_created_at_unixtime || (e.SC_created_at_unixtime = sc.helpers.httpTimeToInt(e.created_at)), e.SC_text_raw || (e.SC_text_raw = e.text), !e.in_reply_to_screen_name && e.in_reply_to_user_id, e.SC_retrieved_unixtime || (e.SC_retrieved_unixtime = sc.helpers.getTimeAsInt()), e;
}, SpazTwit.prototype._processUser = function(e, t) {
return e = this.deSnowFlake(e), e.SC_service_baseurl = this.baseurl, e.SC_service = this.getServiceFromBaseURL(this.baseurl), e.SC_timeline_from = t, this.username && (e.SC_user_received_by = this.username), t === SPAZCORE_SECTION_FOLLOWERSLIST && e.SC_is_follower, t === SPAZCORE_SECTION_FRIENDLIST && e.SC_is_followed, e.SC_created_at_unixtime || (e.SC_created_at_unixtime = sc.helpers.httpTimeToInt(e.created_at) / 1e3), e.SC_retrieved_unixtime || (e.SC_retrieved_unixtime = sc.helpers.getTimeAsInt() / 1e3), e;
}, SpazTwit.prototype.getEchoHeader = function(e) {
var t;
e && e.verify_url ? t = e.verify_url : t = this.getAPIURL("verify_credentials");
var n = "GET", r = this.auth.signRequest(n, t, null);
return r;
}, SpazTwit.prototype._callMethod = function(e) {
e = sch.defaults({
method: "POST",
timeout: this.DEFAULT_TIMEOUT,
url: null,
data: null,
process_callback: null,
success_event_type: null,
failure_event_type: null,
success_callback: null,
failure_callback: null
}, e);
var t, n = this;
e.method ? t = e.method : t = "POST";
var r = jQuery.ajax({
timeout: this.opts.timeout,
complete: function(t, n) {
sc.helpers.dump(e.url + " complete:" + n);
},
error: function(t, r, i) {
sc.helpers.error(e.url + " error:" + r);
if (t) {
if (!t.readyState < 4) {
sc.helpers.dump("Error:" + t.status + " from " + e.url);
if (t.responseText) try {
var s = sc.helpers.deJSON(t.responseText);
} catch (o) {
sc.helpers.dump(o.name + ":" + o.message), s = t.responseText;
}
}
e.failure_callback && e.failure_callback(t, r, i), e.failure_event_type && n.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: t,
msg: r
});
} else sc.helpers.dump("Error:Unknown from " + e.url), e.failure_callback && e.failure_callback(null, r, i), e.failure_event_type && n.triggerEvent(e.failure_event_type, {
url: e.url,
xhr: null,
msg: "Unknown Error"
});
n.triggerEvent("spaztwit_ajax_error", {
url: e.url,
xhr: t,
msg: r
});
},
success: function(t) {
sc.helpers.error(e.url + " success"), t = sc.helpers.deJSON(t), e.process_callback ? e.process_callback.call(n, t, e) : (e.success_callback && e.success_callback(t), n.triggerEvent(e.success_event_type, t));
},
beforeSend: function(r) {
sc.helpers.dump(e.url + " beforesend"), n.auth ? (sch.debug("signing request"), r.setRequestHeader("Authorization", n.auth.signRequest(t, e.url, e.data))) : sch.debug("NOT signing request -- no auth object provided");
},
type: t,
url: e.url,
data: e.data,
dataType: "text"
});
return r;
}, SpazTwit.prototype.getUser = function(e, t, n) {
var r = {}, i = this;
sch.isString(e) && e.indexOf("@") === 0 ? r.screen_name = e.substr(1) : r.user_id = e;
var s = this.getAPIURL("show_user"), o = {
url: s,
data: r,
success_event_type: "get_user_succeeded",
failure_event_type: "get_user_failed",
success_callback: function(e) {
sch.error("BEFORE PROCESSING"), sch.error(e), e = i._processUser(e, SPAZCORE_SECTION_HOME), sch.error("AFTER PROCESSING"), sch.error(e), t(e);
},
failure_callback: n,
method: "GET"
}, u = this._callMethod(o);
}, SpazTwit.prototype.getFriendsList = function(e, t, n, r) {
var i = this.getAPIURL("friendslist"), s = {};
sch.isString(e) && e.indexOf("@") === 0 ? s.screen_name = e.substr(1) : s.user_id = e, t ? s.cursor = t : s.cursor = -1;
var o = {
url: i,
data: s,
success_callback: n,
failure_callback: r,
process_callback: this._processFriendsList,
success_event_type: "get_friendslist_succeeded",
failure_event_type: "get_friendslist_failed",
method: "GET"
}, u = this._getTimeline(o);
}, SpazTwit.prototype._processFriendsList = function(e, t, n) {
this._processUserList(SPAZCORE_SECTION_FRIENDLIST, e, t, n);
}, SpazTwit.prototype.getFollowersList = function(e, t, n, r) {
var i = this.getAPIURL("followerslist"), s = {};
sch.isString(e) && e.indexOf("@") === 0 ? s.screen_name = e.substr(1) : s.user_id = e, t ? s.cursor = t : s.cursor = -1;
var o = {
url: i,
data: s,
success_callback: n,
failure_callback: r,
process_callback: this._processFollowersList,
success_event_type: "get_followerslist_succeeded",
failure_event_type: "get_followerslist_failed",
method: "GET"
}, u = this._getTimeline(o);
}, SpazTwit.prototype._processFollowersList = function(e, t, n) {
this._processUserList(SPAZCORE_SECTION_FOLLOWERSLIST, e, t, n);
}, SpazTwit.prototype._processUserList = function(e, t, n, r) {
var i = [], s = -1, o = -1;
r || (r = {}), t.users ? (i = t.users, s = t.next_cursor_str, o = t.previous_cursor_str) : i = t;
if (i.length > 0) {
for (var u = 0; u < i.length; u++) i[u] = this._processUser(i[u], e), sch.dump(i[u]);
var a = i[i.length - 1].id;
this.data[e].lastid = a, sc.helpers.dump("this.data[" + e + "].lastid:" + this.data[e].lastid), this.data[e].newitems = i, this._addToSectionItems(e, this.data[e].newitems), n.success_callback && n.success_callback(this.data[e].newitems, {
next: s,
prev: o
}), this.triggerEvent(n.success_event_type, this.data[e].newitems);
} else n.success_callback && n.success_callback(i, {
next: s,
prev: o
}), this.triggerEvent(n.success_event_type);
}, SpazTwit.prototype.addFriend = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("friendship_create", r), s = {
url: i,
success_event_type: "create_friendship_succeeded",
failure_event_type: "create_friendship_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.removeFriend = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("friendship_destroy", r), s = {
url: i,
success_event_type: "destroy_friendship_succeeded",
failure_event_type: "destroy_friendship_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.showFriendship = function(e, t, n, r) {
var i = {};
sch.isString(e) && e.indexOf("@") === 0 ? i.target_screen_name = e.substr(1) : i.target_id = e, t && (sch.isString(t) && t.indexOf("@") === 0 ? i.source_screen_name = t.substr(1) : i.source_id = t);
var s = this.getAPIURL("friendship_show", i), o = {
url: s,
method: "GET",
success_event_type: "show_friendship_succeeded",
failure_event_type: "show_friendship_failed",
success_callback: n,
failure_callback: r,
data: i
}, u = this._callMethod(o);
}, SpazTwit.prototype.getIncomingFriendships = function(e, t, n) {
var r = {};
e || (e = -1), r.cursor = e;
var i = this.getAPIURL("friendship_incoming", r), s = {
url: i,
method: "GET",
success_event_type: "get_incoming_friendships_succeeded",
failure_event_type: "get_incoming_friendships_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.getOutgoingFriendships = function(e, t, n) {
var r = {};
e || (e = -1), r.cursor = e;
var i = this.getAPIURL("friendship_outgoing", r), s = {
url: i,
method: "GET",
success_event_type: "get_outgoing_friendships_succeeded",
failure_event_type: "get_outgoing_friendships_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.getFriendsGraph = function(e, t, n, r) {
var i = {};
t || (t = -1), i.cursor = t, i.user_id = e;
var s = this.getAPIURL("graph_friends", i), o = {
url: s,
method: "GET",
success_event_type: "get_friends_graph_succeeded",
failure_event_type: "get_friends_graph_failed",
success_callback: n,
failure_callback: r,
data: i
}, u = this._callMethod(o);
}, SpazTwit.prototype.getFollowersGraph = function(e, t, n, r) {
var i = {};
t || (t = -1), i.cursor = t, i.user_id = e;
var s = this.getAPIURL("graph_followers", i), o = {
url: s,
method: "GET",
success_event_type: "get_followers_graph_succeeded",
failure_event_type: "get_followers_graph_failed",
success_callback: n,
failure_callback: r,
data: i
}, u = this._callMethod(o);
}, SpazTwit.prototype.block = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("block_create", r), s = {
url: i,
success_event_type: "create_block_succeeded",
failure_event_type: "create_block_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.unblock = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("block_destroy", r), s = {
url: i,
success_event_type: "destroy_block_succeeded",
failure_event_type: "destroy_block_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.follow = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("follow", r), s = {
url: i,
username: this.username,
password: this.password,
success_event_type: "follow_succeeded",
failure_event_type: "follow_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.unfollow = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("unfollow", r), s = {
url: i,
username: this.username,
password: this.password,
success_event_type: "unfollow_succeeded",
failure_event_type: "unfollow_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.update = function(e, t, n, r, i) {
var s = this.getAPIURL("update"), o = {};
n && (o.in_reply_to_status_id = n), t ? o.source = t : o.source = this.source, o.status = e;
var u = {
url: s,
data: o,
process_callback: this._processUpdateReturn,
success_callback: r,
failure_callback: i,
success_event_type: "update_succeeded",
failure_event_type: "update_failed"
}, a = this._callMethod(u);
}, SpazTwit.prototype._processUpdateReturn = function(e, t) {
t.is_update_item = !0, this._processTimeline(SPAZCORE_SECTION_HOME, [ e ], t);
}, SpazTwit.prototype.sendDirectMessage = function(e, t, n, r) {
var i = this.getAPIURL("dm_new"), s = {};
sch.isString(e) && e.indexOf("@") === 0 ? s.screen_name = e.substr(1) : s.user_id = e, s.text = t;
var o = {
url: i,
data: s,
success_callback: n,
failure_callback: r,
success_event_type: "sent_dm_succeeded",
failure_event_type: "sent_dm_failed"
}, u = this._callMethod(o);
}, SpazTwit.prototype.destroy = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("destroy_status", r), s = {
url: i,
data: r,
success_event_type: "destroy_status_succeeded",
success_callback: t,
failure_callback: n,
failure_event_type: "destroy_status_failed"
}, o = this._callMethod(s);
}, SpazTwit.prototype.destroyDirectMessage = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("dm_destroy", r), s = {
url: i,
data: r,
success_event_type: "destroy_dm_succeeded",
success_callback: t,
failure_callback: n,
failure_event_type: "destroy_dm_failed"
}, o = this._callMethod(s);
}, SpazTwit.prototype.getOne = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("show", r), s = {
url: i,
process_callback: this._processOneItem,
success_event_type: "get_one_status_succeeded",
success_callback: t,
failure_callback: n,
failure_event_type: "get_one_status_failed",
method: "GET"
}, o = this._callMethod(s);
}, SpazTwit.prototype._processOneItem = function(e, t) {
e = this._processItem(e), t.success_callback && t.success_callback(e), this.triggerEvent(t.success_event_type, e);
}, SpazTwit.prototype.getRelated = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("show_related", r), s = {
url: i,
success_event_type: "get_related_success",
failure_event_type: "get_related_failed",
success_callback: t,
failure_callback: n,
method: "GET"
}, o = this._callMethod(s);
}, SpazTwit.prototype.retweet = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("retweet", r), s = {
url: i,
username: this.username,
password: this.password,
success_event_type: "retweet_succeeded",
failure_event_type: "retweet_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.getRetweets = function(e, t) {
var n = this.getAPIURL("retweets", {
id: e,
count: t
}), r = {
url: n,
username: this.username,
password: this.password,
success_event_type: "get_retweets_succeeded",
failure_event_Type: "get_retweets_failed",
method: "GET"
}, i = this._getTimeline(r);
}, SpazTwit.prototype.retweetedByMe = function(e, t, n, r, i, s) {
var o = {};
e != null && (o.since_id = e), t != null && (o.max_id = t), n == null && (n = 20), o.count = n, r == null && (r = 1), o.page = r;
var u = this.getAPIURL("retweeted_by_me", o), a = {
url: u,
username: this.username,
password: this.password,
success_event_type: "retweeted_by_me_succeeded",
failure_event_type: "retweeted_by_me_failed",
success_callback: i,
failure_callback: s,
method: "GET"
}, f = this._getTimeline(a);
}, SpazTwit.prototype.retweetedToMe = function(e, t, n, r, i, s) {
var o = {};
e != null && (o.since_id = e), t != null && (o.max_id = t), n == null && (n = 20), o.count = n, r == null && (r = 1), o.page = r;
var u = this.getAPIURL("retweeted_to_me", o), a = {
url: u,
username: this.username,
password: this.password,
success_event_type: "retweeted_to_me_succeeded",
failure_event_type: "retweeted_to_me_failed",
success_callback: i,
failure_callback: s,
method: "GET"
}, f = this._getTimeline(a);
}, SpazTwit.prototype.retweetsOfMe = function(e, t, n, r, i, s) {
var o = {};
e != null && (o.since_id = e), t != null && (o.max_id = t), n == null && (n = 20), o.count = n, r == null && (r = 1), o.page = r;
var u = this.getAPIURL("retweets_of_me", o), a = {
url: u,
username: this.username,
password: this.password,
success_event_type: "retweets_of_me_succeeded",
failure_event_type: "retweets_of_me_failed",
success_callback: i,
failure_callback: s,
method: "GET"
}, f = this._getTimeline(a);
}, SpazTwit.prototype.favorite = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("favorites_create", r), s = {
url: i,
success_event_type: "create_favorite_succeeded",
failure_event_type: "create_favorite_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.unfavorite = function(e, t, n) {
var r = {};
r.id = e;
var i = this.getAPIURL("favorites_destroy", r), s = {
url: i,
success_event_type: "destroy_favorite_succeeded",
failure_event_type: "destroy_favorite_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.updateLocation = function(e, t, n) {
var r = {};
r.location = e, this.setBaseURL(SPAZCORE_SERVICEURL_TWITTER);
var i = this.getAPIURL("update_profile"), s = {
url: i,
success_event_type: "update_location_succeeded",
failure_event_type: "update_location_failed",
success_callback: t,
failure_callback: n,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.updateProfile = function(e, t, n, r, i) {}, SpazTwit.prototype.getRateLimitStatus = function(e, t) {
var n = this.getAPIURL("ratelimit_status"), r = {
method: "GET",
url: n,
success_event_type: "ratelimit_status_succeeded",
failure_event_type: "ratelimit_status_failed",
success_callback: e,
failure_callback: t
}, i = this._callMethod(r);
}, SpazTwit.prototype.test = function() {}, SpazTwit.prototype._postProcessURL = function(e) {
if (typeof Mojo != "undefined") {
if (use_palmhost_proxy) {
var t = /https?:\/\/.[^\/:]*(?::[0-9]+)?/, n = e.match(t);
return n && n[0] !== Mojo.hostingPrefix && (e = "/proxy?url=" + encodeURIComponent(e)), e;
}
return e;
}
return e;
}, SpazTwit.prototype._sortItemsAscending = function(e, t) {
return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}, SpazTwit.prototype._sortItemsDescending = function(e, t) {
return e.id < t.id ? 1 : e.id > t.id ? -1 : 0;
}, SpazTwit.prototype._sortItemsByDateAsc = function(e, t) {
var n = sc.helpers.httpTimeToInt(e.created_at), r = sc.helpers.httpTimeToInt(t.created_at);
return n - r;
}, SpazTwit.prototype._sortItemsByDateDesc = function(e, t) {
var n = sc.helpers.httpTimeToInt(e.created_at), r = sc.helpers.httpTimeToInt(t.created_at);
return r - n;
}, SpazTwit.prototype.removeDuplicates = function(e) {
var t = [], n = {}, r = e.length;
try {
for (var i = 0; i < r; i++) {
var s = e[i].id;
n[s] ? sc.helpers.dump("removing dupe " + e[i].id + ', "' + e[i].text + '"') : (n[s] = !0, t.push(e[i]));
}
} catch (o) {
sc.helpers.dump(o.name + ":" + o.message), t = e;
}
return t;
}, SpazTwit.prototype.removeExtraElements = function(e, t, n) {
n || (n = !1);
var r = e.length - t;
return r > 0 && (n ? (sc.helpers.dump("array length is " + e.length + " > " + t + "; removing first " + r + " entries"), e.splice(0, r)) : (sc.helpers.dump("array length is " + e.length + " > " + t + "; removing last " + r + " entries"), e.splice(r * -1, r))), e;
}, SpazTwit.prototype.getSavedSearches = function(e, t) {
var n = this.getAPIURL("saved_searches"), r = {
url: n,
success_event_type: "new_saved_searches_data",
failure_event_type: "error_saved_searches_data",
success_callback: e,
failure_callback: t,
method: "GET"
}, i = this._callMethod(r);
}, SpazTwit.prototype.addSavedSearch = function(e, t, n) {
var r = this.getAPIURL("saved_searches_create"), i = {
url: r,
success_event_type: "create_saved_search_succeeded",
failure_event_type: "create_saved_search_failed",
success_callback: t,
failure_callback: n,
data: {
query: e
},
method: "POST"
}, s = this._callMethod(i);
}, SpazTwit.prototype.removeSavedSearch = function(e, t, n) {
var r = this.getAPIURL("saved_searches_destroy", e.toString()), i = {
url: r,
success_event_type: "destroy_saved_search_succeeded",
failure_event_type: "destroy_saved_search_failed",
success_callback: t,
failure_callback: n,
data: {
id: e
},
method: "POST"
};
sch.debug("opts for removeSavedSearch"), sch.debug(i);
var s = this._callMethod(i);
}, SpazTwit.prototype.getLists = function(e, t, n) {
if (!e && !this.username) return;
e || (e = this.username);
var r = this.getAPIURL("lists", {
user: e
}), i = {
url: r,
success_event_type: "get_lists_succeeded",
failure_event_type: "get_lists_failed",
success_callback: t,
failure_callback: n,
method: "GET"
}, s = this._callMethod(i);
}, SpazTwit.prototype._processUserLists = function(e, t, n, r) {
r || (r = {});
if (t.length > 0) {
for (var i = 0; i < t.length; i++) t[i] = this._processList(t[i], e), sch.dump(t[i]);
t.sort(this._sortItemsAscending);
var s = t[t.length - 1].id;
this.data[e].lastid = s, sc.helpers.dump("this.data[" + e + "].lastid:" + this.data[e].lastid), this.data[e].newitems = t, this._addToSectionItems(e, this.data[e].newitems), n.success_callback && n.success_callback(this.data[e].newitems), this.triggerEvent(n.success_event_type, this.data[e].newitems);
} else n.success_callback && n.success_callback(), this.triggerEvent(n.success_event_type);
}, SpazTwit.prototype._processList = function(e, t) {
return e.SC_retrieved_unixtime || (e.SC_retrieved_unixtime = sc.helpers.getTimeAsInt()), e;
}, SpazTwit.prototype.getListInfo = function(e, t, n, r) {
if (!t && !this.username) {
sch.error("must pass a username or have one set to get list");
return;
}
t = t || this.username;
var i = this.getAPIURL("lists_list", {
user: t,
slug: e
}), s = {
url: i,
success_event_type: "get_list_succeeded",
failure_event_type: "get_list_failed",
success_callback: n,
failure_callback: r,
method: "GET"
}, o = this._callMethod(s);
}, SpazTwit.prototype.getListTimeline = function(e, t, n, r) {
if (!t && !this.username) {
sch.error("must pass a username or have one set to get list");
return;
}
t = t || this.username;
var i = this.getAPIURL("lists_timeline", {
user: t,
slug: e
}), s = {
url: i,
success_event_type: "get_list_timeline_succeeded",
failure_event_type: "get_list_timeline_failed",
success_callback: n,
failure_callback: r,
method: "GET",
process_callback: this._processListTimeline,
processing_opts: {
user: t,
slug: e
}
}, o = this._getTimeline(s);
}, SpazTwit.prototype._processListTimeline = function(e, t, n) {
n || (n = {});
var r = n.user || null, i = n.slug || null, s = {
statuses: e,
user: r,
slug: i
};
this._processTimeline(SPAZCORE_SECTION_USERLISTS, e, t, n), t.success_callback && t.success_callback(s), this.triggerEvent(t.success_event_type, s);
}, SpazTwit.prototype.getListMembers = function(e, t, n, r) {
if (!t && !this.username) {
sch.error("must pass a username or have one set to get list");
return;
}
t = t || this.username;
var i = this.getAPIURL("lists_members", {
user: t,
slug: e
}), s = {
url: i,
success_event_type: "get_list_members_succeeded",
failure_event_type: "get_list_members_failed",
success_callback: n,
failure_callback: r,
method: "GET",
processing_opts: {
user: t,
slug: e
}
}, o = this._getTimeline(s);
}, SpazTwit.prototype.addList = function(e, t, n) {
var r = {};
r.name = e, r.mode = t, r.description = n;
var i = this.getAPIURL("lists", {
user: this.username
}), s = {
url: i,
success_event_type: "create_list_succeeded",
failure_event_type: "create_list_failed",
success_callback: null,
failure_callback: null,
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.updateList = function(e, t, n, r) {
var i = {};
i.name = t, i.mode = n, i.description = r;
var s = this.getAPIURL("lists_list", {
user: this.username,
slug: e
}), o = {
url: s,
username: this.username,
password: this.password,
success_event_type: "update_list_succeeded",
failure_event_type: "update_list_failed",
data: i
}, u = this._callMethod(o);
}, SpazTwit.prototype.removeList = function(e, t) {
if (!t && !this.username) {
sch.error("must pass a username or have one set to remove list");
return;
}
t = t || this.username;
var n = this.getAPIURL("lists_list", {
user: t,
slug: e
}), r = {
url: n,
success_event_type: "remove_list_succeeded",
failure_event_type: "remove_list_failed",
method: "DELETE"
}, i = this._callMethod(r);
}, SpazTwit.prototype.addUserToList = function(e, t, n) {
var r = {};
r.list_id = t, r.id = n;
if (!e && !this.username) {
sch.error("must pass a username or have one set to add a user to a list");
return;
}
e = e || this.username;
var i = this.getAPIURL("lists_members", {
user: e,
slug: t
}), s = {
url: i,
success_event_type: "add_list_user_succeeded",
failure_event_type: "add_list_user_failed",
data: r
}, o = this._callMethod(s);
}, SpazTwit.prototype.removeUserFromList = function(e, t, n) {
var r = {};
r.list_id = t, r.id = n;
if (!e && !this.username) {
sch.error("must pass a username or have one set to remove a user from a list");
return;
}
e = e || this.username;
var i = this.getAPIURL("lists_members", {
user: e,
slug: t
}), s = {
url: i,
success_event_type: "create_list_succeeded",
failure_event_type: "create_list_failed",
success_event_type: "remove_list_user_succeeded",
failure_event_type: "remove_list_user_failed",
data: r,
method: "DELETE"
}, o = this._callMethod(s);
}, SpazTwit.prototype.listsSubscribedTo = function(e) {
if (!e && !this.username) return sch.error("must pass a username or have one set to retrieve subscribed lists"), !1;
e = e || this.username;
var t = this.getAPIURL("lists_subscriptions", {
user: e
}), n = {
url: t,
username: this.username,
password: this.password,
success_event_type: "get_subscriptions_succeeded",
failure_event_type: "get_subscriptions_failed"
}, r = this._callMethod(n);
}, SpazTwit.prototype.listMemberships = function(e) {
if (!e && !this.username) return sch.error("must pass a username or have one set to retrieve list memberships"), !1;
e = e || this.username;
var t = this.getAPIURL("lists_memberships", {
user: e
}), n = {
url: t,
username: this.username,
password: this.password,
success_event_type: "get_list_memberships_succeeded",
failure_event_type: "get_list_memberships_failed"
}, r = this._callMethod(n);
}, SpazTwit.prototype.getListSubscribers = function(e, t, n, r) {
if (!t && !this.username) return sch.error("must pass a username or have one set to retrieve list subscribers"), !1;
t = t || this.username;
var i = this.getAPIURL("lists_subscribers", {
user: t,
slug: e
}), s = {
url: i,
username: this.username,
password: this.password,
success_callback: n,
failure_callback: r,
success_event_type: "get_list_subscribers_succeeded",
failure_event_type: "get_list_subscribers_failed",
method: "GET"
}, o = this._callMethod(s);
}, SpazTwit.prototype.isSubscribed = function(e, t, n) {
if (!n && !this.username) return sch.error("must pass a username or have one set to retrieve list subscribers"), !1;
n = n || this.username;
var r = this.getAPIURL("lists_check_subscriber", {
user: n,
slug: e,
id: t
}), i = {
url: r,
username: this.username,
password: this.password,
success_event_type: "check_list_subscribers_succeeded",
failure_event_type: "check_list_subscribers_failed",
method: "GET"
}, s = this._callMethod(i);
}, SpazTwit.prototype.subscribe = function(e, t) {
if (!t && !this.username) return sch.error("must pass a username or have one set to subscribe to a list"), !1;
t = t || this.username;
var n = this.getAPIURL("lists_subscribers", {
user: t,
slug: e
}), r = {
url: n,
username: this.username,
password: this.password,
success_event_type: "list_subscribe_succeeded",
failure_event_type: "list_subscribe_failed",
method: "POST"
}, i = this._callMethod(r);
}, SpazTwit.prototype.unsubscribe = function(e, t) {
if (!t && !this.username) return sch.error("must pass a username or have one set to unsubscribe"), !1;
t = t || this.username;
var n = this.getAPIURL("lists_subscribers", {
user: t,
slug: e,
id: list_user
}), r = {
url: n,
username: this.username,
password: this.password,
success_event_type: "list_unsubscribe_succeeded",
failure_event_type: "list_unsubscribe_failed",
method: "DELETE"
}, i = this._callMethod(r);
}, SpazTwit.prototype.isMember = function(e, t, n) {
if (!n && !this.username) return sch.error("must pass a username or have one set to retrieve list memberships"), !1;
n = n || this.username;
var r = this.getAPIURL("lists_check_member", {
user: n,
slug: e,
id: t
}), i = {
url: r,
username: this.username,
password: this.password,
success_event_type: "check_list_members_succeeded",
failure_event_type: "check_list_members_failed",
method: "GET"
}, s = this._callMethod(i);
}, SpazTwit.prototype.reportSpam = function(e, t, n) {
var r = this.getAPIURL("report_spam"), i = {};
i.user_id = e;
var s = {
url: r,
username: this.username,
password: this.password,
success_callback: t,
failure_callback: n,
success_event_type: "report_spam_succeeded",
failure_event_type: "report_spam_failed",
method: "POST",
data: i
}, o = this._callMethod(s);
}, SpazTwit.prototype.openUserStream = function(e, t) {
var n = this;
return this.closeUserStream(), this.userstream = new SpazTwitterStream({
auth: this.auth,
onData: function(t) {
var r;
t = sch.trim(t), t && (sch.debug("new stream data:" + t), r = sch.deJSON(t), r.source && r.user && r.text && (r = n._processItem(r, SPAZCORE_SECTION_HOME), e && e(r)), r.direct_message && (r = n._processItem(r.direct_message, SPAZCORE_SECTION_HOME), e && e(r)));
}
}), this.userstream.connect(), this.userstream;
}, SpazTwit.prototype.closeUserStream = function() {
this.userstream && (sch.error("userstream exist\u2026 disconnecting"), this.userstream.disconnect(), this.userstream = null);
}, SpazTwit.prototype.userStreamExists = function() {
return this.userstream ? !0 : !1;
}, SpazTwit.prototype.deSnowFlake = function(e) {
return e.id_str && (e.id = e.id_str), e.in_reply_to_user_id_str && (e.in_reply_to_user_id = e.in_reply_to_user_id_str), e.in_reply_to_status_id_str && (e.in_reply_to_status_id = e.in_reply_to_status_id_str), e.to_user_id_str && (e.to_user_id = e.to_user_id_str), e.from_user_id_str && (e.from_user_id = e.from_user_id_str), e.user && (e.user = this.deSnowFlake(e.user)), e.recipient && (e.recipient = this.deSnowFlake(e.recipient)), e.sender && (e.sender = this.deSnowFlake(e.sender)), e.retweeted_status && (e.retweeted_status = this.deSnowFlake(e.retweeted_status)), e;
}, SpazTwit.prototype.triggerEvent = function(e, t) {
var n = this.opts.event_target || document;
t = t || null, sc.helpers.dump("TriggerEvent: target:" + n.toString() + " type:" + e + " data:" + t), this.opts.event_mode === "jquery" ? (t = [ t ], jQuery(n).trigger(e, t)) : sc.helpers.trigger(e, n, t);
};

if (sc) var scTwit = SpazTwit;

var sc;

window.localStorage ? (SpazPrefs.prototype.load = function(e) {
var t = this.id || SPAZCORE_PREFS_STANDARD_COOKIENAME, n = window.localStorage.getItem(t);
if (n) {
var r = sch.deJSON(n);
sch.debug("prefsval exists");
for (var i in r) sch.debug('Copying loaded pref "' + i + '":"' + r[i] + '" (' + typeof r[i] + ")"), this._prefs[i] = r[i];
} else sch.debug("prefsval does not exist; saving with defaults"), this.save();
typeof e == "function" && e(this);
}, SpazPrefs.prototype.save = function(e) {
var t = this.id || SPAZCORE_PREFS_STANDARD_COOKIENAME;
try {
window.localStorage.setItem(t, sch.enJSON(this._prefs)), sch.debug("stored prefs in localStorage");
} catch (n) {
n.name == "QUOTA_EXCEEDED_ERR" && sch.error("LocalStorage quota exceeded!");
}
typeof e == "function" && e(this);
}) : (SpazPrefs.prototype.load = function(e) {
var t = this.id || SPAZCORE_PREFS_STANDARD_COOKIENAME, n = jaaulde.utils.cookies.get(t);
if (n) {
sch.debug("prefsval exists");
for (var r in n) sch.debug('Copying loaded pref "' + r + '":"' + this._prefs[r] + '" (' + typeof this._prefs[r] + ")"), this._prefs[r] = n[r];
} else sch.debug("prefsval does not exist; saving with defaults"), this.save();
typeof e == "function" && e(this);
}, SpazPrefs.prototype.save = function(e) {
var t = this.id || SPAZCORE_PREFS_STANDARD_COOKIENAME;
jaaulde.utils.cookies.set(t, this._prefs), sch.debug("stored prefs in cookie"), typeof e == "function" && e(this);
});

// spazcore-enyo-webos-network.js

sc.helpers.HTTPUploadFile = function(e, t, n) {
e = sch.defaults({
method: "POST",
content_type: "img",
field_name: "media",
file_url: null,
url: null,
extra: null,
headers: null,
username: null,
password: null,
onProgress: null
}, e);
var r = [], i = [], s = e.file_url || null, o = e.url || null;
field_name = e.field_name || "media", content_type = e.content_type || "img";
for (var u in e.extra) r.push({
key: u,
data: e.extra[u],
contentType: "text/plain"
});
e.username && r.push({
key: "username",
data: e.username,
contentType: "text/plain"
}), e.password && r.push({
key: "password",
data: e.password,
contentType: "text/plain"
});
for (var u in e.headers) i.push(u + ": " + e.headers[u]);
e.callback({
url: o,
contentType: content_type,
fileLabel: field_name,
fileName: s,
postParameters: r,
cookies: {},
customHttpHeaders: i
});
};

// ../Support/mousewheel.js

enyo.dispatcher.events = enyo.dispatcher.events.concat([ "mouswheel" ]), document.addEventListener("mousewheel", enyo.dispatch, !1), enyo.dispatcher.features.push(function(e) {
if (e.type == "mousewheel") {
var t = {
comp: 0,
x: 0,
y: 0
};
e.wheelDelta && (t.x = t.comp = e.wheelDelta / 12), e.detail && (t.x = t.comp = -event.detail / 3), t.y = t.x, e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS && (t.y = 0, t.x = -1 * t.comp), e.wheelDeltaY !== undefined && (t.y = e.wheelDeltaY / 12), e.wheelDeltaX !== undefined && (t.x = e.wheelDeltaX / 12), e.delta = t;
}
});

// VirtualList.js

enyo.kind({
name: "ekl.List.VirtualList",
kind: enyo.Repeater,
published: {
mousewheel: !0,
mousewheelDamp: 40,
dragHoldInterval: 50,
dragHoldTrigger: 500,
dragHoldTimeMax: 5e3,
pullToRefreshThreshold: 50
},
events: {
onPullToRefresh: ""
},
dragHoldTime: 0,
dragPoller: null,
mousewheelHandler: function(e, t) {
if (this.mousewheel) {
var n = enyo.mixin({}, t);
n.pageX = t.pageX + t.delta.x * this.mousewheelDamp, n.pageY = t.pageY + t.delta.y * this.mousewheelDamp, this.$.scroller.$.scroll.startDrag(t), this.$.scroller.$.scroll.drag(n), this.$.scroller.$.scroll.dragDrop(n), this.$.scroller.$.scroll.dragFinish();
}
},
holdMousePoller: function() {
window.clearTimeout(this.dragPoller);
if (this.dragHoldTimeMax < this.dragHoldTime) {
this._clearPullToRefresh();
return;
}
this.dragHoldTime >= this.dragHoldTrigger && this.pulledPastThreshold() && this.owner.$.pulltoRefreshTextTeaser.applyStyle("opacity", 1), this.$.scroller.$.scroll.y >= 0 ? this.dragHoldTime += this.dragHoldInterval : this._clearPullToRefresh(), this._resetMousePoller();
},
mousedownHandler: function() {
this._clearPullToRefresh();
if (this.$.scroller.$.scroll.y < 0) return;
this._resetMousePoller();
},
mouseupHandler: function(e) {
this.dragHoldTime >= this.dragHoldTrigger && this.pulledPastThreshold() && this.doPullToRefresh(), this._clearPullToRefresh();
},
pulledPastThreshold: function(e) {
return this.$.scroller.$.scroll.y >= this.pullToRefreshThreshold ? !0 : !1;
},
_clearPullToRefresh: function() {
window.clearTimeout(this.dragPoller), this.dragHoldTime = 0, this.owner.$.pulltoRefreshTextTeaser.applyStyle("opacity", 0);
},
_resetMousePoller: function() {
window.clearTimeout(this.dragPoller), this.dragPoller = window.setTimeout(_.bind(this.holdMousePoller, this), this.dragHoldInterval);
},
_logScrollerInfo: function() {
console.log("this.$.scroller.$.scroll.owner", this.$.scroller.$.scroll.owner, "owner.pageOffset", this.$.scroller.$.scroll.owner.pageOffset, "owner.pageTop", this.$.scroller.$.scroll.owner.pageTop, "owner.top", this.$.scroller.$.scroll.owner.top, "my:", this.$.scroller.$.scroll.my, "py:", this.$.scroller.$.scroll.py, "uy", this.$.scroller.$.scroll.uy, "y", this.$.scroller.$.scroll.y, "y0", this.$.scroller.$.scroll.y0);
},
punt: function(e) {
this.reset();
}
});

// SlidingPane.js

enyo.kind({
name: "ekl.Layout.SlidingPane",
kind: enyo.FittableRows,
defaultKind: "ekl.Layout.SlidingView",
events: {
onDismiss: ""
},
dragfinishHandler: function(e, t) {
if (this.dragging) {
var n = this.dragging.dragFinish(t), r = this.dragStartSliding;
t.preventClick(), this.dragging = null, n && (r.slidePosition > this.dismissDistance && r.dismissible ? (r.setShowing(!1), this.doDismiss()) : n.select ? this.selectView(n.select, !0) : this.animateOverSlide(r));
}
}
});

// SlidingView.js

enyo.kind({
name: "ekl.Layout.SlidingView",
kind: onyx.Slider,
published: {
nodragleft: !1
},
calcSlideMin: function() {
return this.nodragleft ? 0 : this.inherited(arguments);
}
});

// alert.js

function alert(e, t, n) {
var r = t.createComponent(new Alert);
r.setMessage(e), r.setOwner(t);
if (n != null) {
r.setDoCancel(typeof n.onCancel == "function" || typeof n.cancelText == "string");
for (var i in n) r[i] = n[i];
r.setDynamic(!0);
}
return r.setShowing(!0), r;
}

enyo.kind({
name: "Alert",
kind: "onyx.Popup",
layoutKind: "FittableRowsLayout",
classes: "enyo-fit",
style: "width: 350px; height: 250px; position: fixed; padding: 40px; z-index: 2;",
centered: !0,
floating: !0,
autoDismiss: !1,
published: {
message: "",
confirmText: "CONTINUE",
cancelText: "CANCEL",
doCancel: !1,
dynamic: !1,
onCancel: function(e) {},
onConfirm: function(e) {}
},
components: [ {
name: "message",
allowHtml: !0
}, {
name: "space",
fit: !0
}, {
layoutKind: "FittableColumnsLayout",
components: [ {
name: "cancel",
kind: "onyx.Button",
ontap: "cancel",
showing: !1,
classes: "onyx-negative",
content: this.cancelText,
style: "width: 50% !important;"
}, {
name: "confirm",
kind: "onyx.Button",
ontap: "confirm",
classes: "onyx-affirmative",
content: this.confirmText,
fit: !0
} ]
} ],
create: function() {
this.inherited(arguments), this.messageChanged(), this.dynamicChanged();
},
dynamicChanged: function(e) {
this.onCancelTextChanged(), this.onConfirmTextChanged(), this.onDoCancelChanged();
},
onCancelTextChanged: function(e) {
this.$.cancel.setContent(this.cancelText);
},
onConfirmTextChanged: function(e) {
this.$.confirm.setContent(this.confirmText);
},
onDoCancelChanged: function(e) {
this.$.cancel.setShowing(this.doCancel);
},
messageChanged: function(e) {
this.$.message.setContent(this.message);
},
confirm: function(e, t) {
this.onConfirm(this.owner), this.destroy();
},
cancel: function(e, t) {
this.onCancel(this.owner), this.destroy();
}
});

// Util.js

var Util = new Object;

Util.getGeometry = function(e) {
var t = e.hasNode(), n = {
left: 0,
top: 0,
width: t.offsetWidth,
height: t.offsetHeight
};
do n.left += t.offsetLeft, n.top += t.offsetTop; while (t = t.offsetParent);
return n;
}, Util.isEmpty = function(e) {
return e == null || e == undefined || e.length == 0 || Util.trim(e).length == 0 ? !0 : !1;
}, Util.trim = function(e) {
return e.replace(/^\s+|\s+$/g, "");
}, Util.isValidZip = function(e) {
return !0;
}, Util.appendToHash = function(e, t) {
return t.merge($H(e)).toObject();
}, Util.arrayToString = function(e) {
var t = "";
for (var n = 0; n < e.length; ++n) t += e[n] + "<br/><br/>";
return t;
}, Util.truncateText = function(e, t) {
var n = "...", r = t - n.length;
return e.length > t ? e.substr(0, r) + n : e;
}, Util.floor = function(e, t) {
var n = -1;
while (n != 0) {
n = e % t;
if (n == 0) break;
e--;
}
return e;
}, Util.showError = function(e) {
var t = Util.arrayToString(e), n = null;
e.length > 1 ? n = AppConstants.MSG_ERROR_TITLE_PLURAL : n = AppConstants.MSG_ERROR_TITLE_SINGULAR;
var r = "warning";
Application.$.notif.sendNotification({
title: n,
message: t,
src: "assets/images/" + r + ".png",
theme: "notification.Bezel",
stay: !0,
duration: null
}), onyx.scrim.show();
}, Util.showMessage = function(e, t, n) {
var r = n ? n : "warning";
Application.$.notif.sendNotification({
title: e,
message: t,
src: "assets/images/" + r + ".png",
theme: "notification.Bezel",
stay: !0,
duration: null
}), onyx.scrim.show();
}, Util.showMessageWithCallback = function(e, t, n, r) {
var i = n ? n : "warning";
Application.$.notif.sendNotification({
title: e,
message: t,
src: "assets/images/" + i + ".png",
theme: "notification.Bezel",
stay: !0,
duration: null
}), onyx.scrim.show();
}, Util.showRetryMessage = function(e, t, n, r) {
var i = n ? n : "connectionlost";
Application.$.notif.sendNotification({
title: e,
message: t,
src: "assets/images/" + i + ".png",
theme: "notification.Bezel",
stay: !0,
duration: null
}), onyx.scrim.show();
}, Util.httpGet = function(e) {
var t = new Ajax.Request(e, {
method: "get",
onSuccess: Util.onSuccess
});
}, Util.onSuccess = function(e) {
Util.log("http get complete: " + e.status);
}, Util.showBannerMessage = function(e) {
Application.$.notif.sendNotification({
title: "",
message: e,
src: "",
theme: "notification.MessageBar",
stay: undefined,
duration: 2.3
});
}, Util.showBannerSong = function(e, t) {
var n = t ? t : "";
Application.$.notif.sendNotification({
title: "Now Playing: ",
message: e,
src: n,
theme: "notification.MessageBar",
stay: undefined,
duration: 2.3
});
}, Util.inspectObject = function(e) {
for (name in e) Util.log(name);
}, Util.trimNonAscii = function(e) {
var t = "", n = 0;
Util.log("length: " + e.length);
for (var r = 0; r < e.length; ++r) n = e.charCodeAt(r), n < 8e3 ? t += String.fromCharCode(n) : Util.log("over: " + n);
return Util.log("length: " + t.length), t;
}, Util.log = function(e) {
AppGlobals.debug && enyo.log(Util.PREFIX + e);
}, Util.secondsToTimeString = function(e) {
var t = Math.round(e), n = Math.floor(t / 60), r = t % 60;
return r < 10 && (r = "0" + r), n + ":" + r;
}, Util.sendHeadRequest = function(e, t) {
var n = new XMLHttpRequest;
n.open("HEAD", e, !0), n.onreadystatechange = function() {
if (n.readyState == 4) {
Util.log("HEAD returned: " + n.status);
var r = n.getResponseHeader(Util.CONTENT_LENGTH);
t(n.status, r, e);
}
}, n.send(null);
}, Util.PREFIX = "PANDORA> ", Util.CONTENT_LENGTH = "Content-Length", Util.HEAD = "HEAD";

// fx.Fader.js

function round(e, t) {
var n = Math.round(e * Math.pow(10, t)) / Math.pow(10, t);
return n;
}

enyo.kind({
name: "fx.Fader",
kind: "onyx.Scrim",
floating: !0,
rootPath: "assets/fader/",
covers: [ "dark", "dark_glow", "dark", "normal", "glow", "normal", "grain", "normal", "dark_glow" ],
published: {
variable: .02,
timeout: .2,
max: 100,
min: 0,
scrim: 75,
scrimColor: "#ABACA0",
size: 500,
reference: "window",
_switch: !1,
rotateFlag: !1
},
classes: "enyo-fit onyx-scrim",
style: "position:fixed;z-index:999999;top:0;left:0;",
components: [ {
name: "scrim",
classes: "enyo-fit"
}, {
name: "fader",
kind: "Image",
cover: -1,
domStyles: {
opacity: .5
}
}, {
name: "fadee",
kind: "Image",
cover: 0,
domStyles: {
opacity: .5
}
}, {
kind: "clearview"
} ],
create: function() {
this.inherited(arguments), this.max > 100 && (this.max = 100), this.min < 0 && (this.min = 0), this.max = this.max / 100, this.min = this.min / 100, this.min > this.max && (this.min = this.max), this.max = round(this.max, 4), this.min = round(this.min, 4), this.$.scrim.applyStyle("opacity", round(this.scrim / 100, 4)), this.$.scrim.applyStyle("background-color", this.scrimColor), this.rotate(), this.beginFade();
},
rotate: function() {
var e = this.$.fader, t = this.$.fadee;
e.cover++, t.cover++, t.cover >= this.covers.length && (t.cover = 0), e.cover >= this.covers.length && (e.cover = 0);
var n = t.cover;
t.cover = e.cover, e.cover = n, this._switch = !this._switch, this.imageSetup(e), this.imageSetup(t), this.rotateFlag = !1;
},
beginFade: function() {
this.fading = setInterval(this.fade.bind(this), this.timeout * 1e3);
},
fade: function(e) {
this.rotateFlag && this.rotate();
var t = this.$.fader, n = this.$.fadee;
this._switch ? this.next(t, n) : this.next(n, t);
},
next: function(e, t) {
var n = 0;
n = e.domStyles.opacity + this.variable, n = round(n, 4), n >= this.max && (this.rotateFlag = !0);
var r = this.max - n + this.min;
r = round(r, 4), e.applyStyle("opacity", n), t.applyStyle("opacity", r);
},
imageSetup: function(e) {
var t = 0, n = 0;
switch (this.reference) {
case "container":
t = this.container.getBounds().width, n = this.container.getBounds().height;
break;
case "window":
t = window.innerWidth, n = window.innerHeight;
}
e.applyStyle("width", this.size + "px"), e.applyStyle("height", this.size + "px"), e.applyStyle("right", (t - this.size) / 2 + "px"), e.applyStyle("bottom", (n - this.size) / 2 + "px"), e.applyStyle("position", "fixed"), e.applyStyle("opacity", this.min - this.variable), e.setSrc(this.rootPath + this.covers[e.cover] + ".png");
},
show: function() {
var e = this.inherited(arguments);
return this.beginFade(), e;
},
hide: function() {
var e = this.inherited(arguments);
return clearTimeout(this.fading), e;
}
});

// clearview.js

enyo.kind({
name: "clearview",
tag: "div",
attributes: {
id: "clearviewDiv"
},
create: function() {
this.inherited(arguments), this.createComponent({
kind: "ApplicationEvents",
onWindowActivated: "refreshUp",
onWindowDeactivated: "refreshDown",
onResize: "getWallpaper"
}, {
owner: this
}), this.setup();
},
setup: function() {
timer = window.setInterval(this.getWallpaper.bind(this), 1e4), isMaximized = isFullScreen = !1, this.getWallpaper();
},
refreshDown: function(e) {
isMaximized = !1, this.getWallpaper();
},
refreshUp: function(e) {
isMaximized = !0, this.getWallpaper();
},
wallpaperService: new enyo.webOS.ServiceRequest({
service: "palm://com.palm.systemservice",
method: "getPreferences"
}),
getWallpaper: function(e) {
return;
},
wallpaperSuccess: function(e) {
enyo.error("response! ahh", e), this.currentWallpaper = "file://" + e.wallpaper.wallpaperFile, $("clearviewDiv").innerHTML = '<img id="clearview" src="' + this.currentWallpaper + '">', newImg = new Image, newImg.src = this.currentWallpaper, oldHeight = newImg.height, oldWidth = newImg.width, isMaximized ? this.maximize() : this.minimize(), enyo.byId("clearview").ontap = "divTap";
},
wallpaperFailure: function(e) {
this.currentWallpaper = "file://" + e.wallpaper.wallpaperFile;
},
divTap: function(e) {
isFullScreen ? isFullScreen = !1 : isFullScreen = !0, this.getWallpaper();
},
minimize: function() {
isMaximized = !1;
var e, t, n = .973075 * oldWidth, r = .973075 * oldHeight, i = 768;
oldWidth < 1024 || oldHeight === oldWidth ? i = oldHeight : oldWidth < oldWidth * (oldWidth / oldHeight) && oldWidth / oldHeight < 4 / 3 && (i = 1024 / (oldWidth / oldHeight));
var s = i * (oldWidth / oldHeight), o = i, u = (s - 1024) / 2 * .973075;
n = n * 2 * (s / oldWidth), r = r * 2 * (o / oldHeight);
var a = oldWidth / n, f = oldHeight / r;
e = oldWidth / a, t = oldHeight / f, $("clearview").style.width = e + "px", $("clearview").style.height = t + "px";
var l = e / 4, c = t / 4 + (t / 2 - 768) / 2;
l = l - 14 + u, c -= 47, enyo.byId("clearview").style.top = 0 - c + "px", enyo.byId("clearview").style.left = 0 - l + "px", window.innerWidth < 1024 && this.isRotated(null, !1);
},
maximize: function() {
isMaximized = !0;
var e, t, n = .973075 * oldWidth / 1.9379, r = .973075 * oldHeight / 1.9379, i = 768;
oldWidth < 1024 || oldHeight === oldWidth ? i = oldHeight : oldWidth < oldWidth * (oldWidth / oldHeight) && oldWidth / oldHeight < 4 / 3 && (i = 1024 / (oldWidth / oldHeight));
var s = i * (oldWidth / oldHeight), o = i, u = (s - 1024) / 2 * .973075 / 1.9379, a = 0;
n = n * 2 * (s / oldWidth), r = r * 2 * (o / oldHeight);
var f = oldWidth / n, l = oldHeight / r;
e = oldWidth / f, t = oldHeight / l, enyo.byId("clearview").style.width = e + "px", enyo.byId("clearview").style.height = t + "px";
var c = e / 4, h = t / 4 + (t / 2 - 768) / 2;
c = c - 254 + u, h = h + 29 + a, isFullScreen && (h -= 28), enyo.byId("clearview").style.top = 0 - h + "px", enyo.byId("clearview").style.left = 0 - c + "px", window.innerWidth < 1024 && this.isRotated(null, !0);
},
isRotated: function(e, t) {
var n = -97;
t && (n = 27);
var r = .75, i = parseInt($("clearview").style.height), s = parseInt($("clearview").style.width);
oldHeight < 768 && oldWidth < 1024 || s === i ? r = 1 : oldWidth < oldWidth * (oldWidth / oldHeight) && oldWidth / oldHeight < 4 / 3 && (r = oldHeight / oldWidth), s /= r, i /= r;
var o = 1024;
i < 1024 && (o = i);
var u = o * (s / i), a = o;
oldHeight < 768 && oldWidth < 1024 && (n = (i / 8 - 491) / 4, t && (n = (i / 8 + 28) / 4), n -= i / 4 + (i / 2 - 1024) / 2), n += (a - 1024) / 2 * .973075, enyo.byId("clearview").style.height = i + "px", enyo.byId("clearview").style.width = s + "px";
var f = s / 2 - 384, l = i / 4 + (i / 2 - 1024) / 2;
l += n, isFullScreen && (l -= 28, isMaximized || (l += 28)), enyo.byId("clearview").style.top = 0 - l + "px", enyo.byId("clearview").style.left = 0 - f + "px";
}
});

// js/cufon.js

var Cufon = function() {
function r(e) {
var t = this.face = e.face, n = [], r = {
" ": 1,
"\u00a0": 1,
"\u3000": 1
};
this.glyphs = function(e) {
var t, n = {
"\u2011": "-",
"\u00ad": "\u2011"
};
for (t in n) {
if (!d(n, t)) continue;
e[t] || (e[t] = e[n[t]]);
}
return e;
}(e.glyphs), this.w = e.w, this.baseSize = parseInt(t["units-per-em"], 10), this.family = t["font-family"].toLowerCase(), this.weight = t["font-weight"], this.style = t["font-style"] || "normal", this.viewBox = function() {
var e = t.bbox.split(/\s+/), n = {
minX: parseInt(e[0], 10),
minY: parseInt(e[1], 10),
maxX: parseInt(e[2], 10),
maxY: parseInt(e[3], 10)
};
return n.width = n.maxX - n.minX, n.height = n.maxY - n.minY, n.toString = function() {
return [ this.minX, this.minY, this.width, this.height ].join(" ");
}, n;
}(), this.ascent = -parseInt(t.ascent, 10), this.descent = -parseInt(t.descent, 10), this.height = -this.ascent + this.descent, this.spacing = function(e, t, n) {
var i = this.glyphs, s, o, u, a = [], f = 0, l, c = -1, h = -1, p;
while (p = e[++c]) {
s = i[p] || this.missingGlyph;
if (!s) continue;
o && (f -= u = o[p] || 0, a[h] -= u), l = s.w, isNaN(l) && (l = +this.w), l > 0 && (l += t, r[p] && (l += n)), f += a[++h] = ~~l, o = s.k;
}
return a.total = f, a;
}, this.applyLigatures = function(e, t) {
for (var r = 0, i; r < n.length && !i; r++) n[r].ligatures === t && (i = n[r]);
if (!i) {
var s = [];
for (var o in t) this.glyphs[t[o]] && s.push(o);
var u = s.sort(function(e, t) {
return t.length - e.length || e > t;
}).join("|");
n.push(i = {
ligatures: t,
regexp: u.length > 0 ? C[u] || (C[u] = new RegExp(u, "g")) : null
});
}
return i.regexp ? e.replace(i.regexp, function(e) {
return t[e] || e;
}) : e;
};
}
function i() {
var e = {}, t = {
oblique: "italic",
italic: "oblique"
};
this.add = function(t) {
(e[t.style] || (e[t.style] = {}))[t.weight] = t;
}, this.get = function(n, r) {
var i = e[n] || e[t[n]] || e.normal || e.italic || e.oblique;
if (!i) return null;
r = {
normal: 400,
bold: 700
}[r] || parseInt(r, 10);
if (i[r]) return i[r];
var s = {
1: 1,
99: 0
}[r % 100], o = [], u, a;
s === undefined && (s = r > 400), r == 500 && (r = 400);
for (var f in i) {
if (!d(i, f)) continue;
f = parseInt(f, 10);
if (!u || f < u) u = f;
if (!a || f > a) a = f;
o.push(f);
}
return r < u && (r = u), r > a && (r = a), o.sort(function(e, t) {
return (s ? e >= r && t >= r ? e < t : e > t : e <= r && t <= r ? e > t : e < t) ? -1 : 1;
}), i[o[0]];
};
}
function s() {
function t(e, t) {
try {
return e.contains ? e.contains(t) : e.compareDocumentPosition(t) & 16;
} catch (n) {}
return !1;
}
function n(e) {
var n = e.relatedTarget;
if (n && t(this, n)) return;
i(this, e.type == "mouseover");
}
function r(e) {
e || (e = window.event), i(e.target || e.srcElement, e.type == "mouseenter");
}
function i(t, n) {
setTimeout(function() {
var r = k.get(t).options;
n && (r = v(r, r.hover), r._mediatorMode = 1), e.replace(t, r, !0);
}, 10);
}
this.attach = function(e) {
e.onmouseenter === undefined ? (f(e, "mouseover", n), f(e, "mouseout", n)) : (f(e, "mouseenter", r), f(e, "mouseleave", r));
}, this.detach = function(e) {
e.onmouseenter === undefined ? (g(e, "mouseover", n), g(e, "mouseout", n)) : (g(e, "mouseenter", r), g(e, "mouseleave", r));
};
}
function o() {
function r(e) {
var r = [], i;
for (var s = 0; i = e[s]; ++s) r[s] = t[n[i]];
return r;
}
var t = [], n = {};
this.add = function(e, r) {
n[e] = t.push(r) - 1;
}, this.repeat = function() {
var n = arguments.length ? r(arguments) : t, i;
for (var s = 0; i = n[s++]; ) e.replace(i[0], i[1], !0);
};
}
function u() {
function n(e) {
return e.cufid || (e.cufid = ++t);
}
var e = {}, t = 0;
this.get = function(t) {
var r = n(t);
return e[r] || (e[r] = {});
};
}
function a(e) {
var t = {}, r = {};
this.extend = function(e) {
for (var n in e) d(e, n) && (t[n] = e[n]);
return this;
}, this.get = function(n) {
return t[n] != undefined ? t[n] : e[n];
}, this.getSize = function(e, t) {
return r[e] || (r[e] = new n.Size(this.get(e), t));
}, this.isUsable = function() {
return !!e;
};
}
function f(e, t, n) {
e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n);
}
function l(e, t) {
if (t._mediatorMode) return e;
var n = k.get(e), r = n.options;
if (r) {
if (r === t) return e;
r.hover && L.detach(e);
}
return t.hover && t.hoverables[e.nodeName.toLowerCase()] && L.attach(e), n.options = t, e;
}
function c(e) {
var t = {};
return function(n) {
return d(t, n) || (t[n] = e.apply(null, arguments)), t[n];
};
}
function h(e, t) {
var r = n.quotedList(t.get("fontFamily").toLowerCase()), i;
for (var s = 0; i = r[s]; ++s) if (H[i]) return H[i].get(t.get("fontStyle"), t.get("fontWeight"));
return null;
}
function p(e) {
return document.getElementsByTagName(e);
}
function d(e, t) {
return e.hasOwnProperty(t);
}
function v() {
var e = {}, t, n;
for (var r = 0, i = arguments.length; t = arguments[r], r < i; ++r) for (n in t) d(t, n) && (e[n] = t[n]);
return e;
}
function m(e, t, r, i, s, o) {
var u = document.createDocumentFragment(), a;
if (t === "") return u;
var f = i.separate, l = t.split(j[f]), c = f == "words";
c && E && (/^\s/.test(t) && l.unshift(""), /\s$/.test(t) && l.push(""));
for (var h = 0, p = l.length; h < p; ++h) a = P[i.engine](e, c ? n.textAlign(l[h], r, h, p) : l[h], r, i, s, o, h < p - 1), a && u.appendChild(a);
return u;
}
function g(e, t, n) {
e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent && e.detachEvent("on" + t, n);
}
function y(e, t) {
var r = e.nodeName.toLowerCase();
if (t.ignore[r]) return;
if (t.ignoreClass && t.ignoreClass.test(e.className)) return;
t.onBeforeReplace && t.onBeforeReplace(e, t);
var i = !t.textless[r], s = t.trim === "simple", o = n.getStyle(l(e, t)).extend(t);
if (parseFloat(o.get("fontSize")) === 0) return;
var u = h(e, o), a, c, p, d, v, g, y = t.softHyphens, E = !1, S, T, N = /\u00ad/g, C = t.modifyText;
if (!u) return;
for (a = e.firstChild; a; a = p) {
c = a.nodeType, p = a.nextSibling;
if (i && c == 3) {
y && e.nodeName.toLowerCase() != x && (S = a.data.indexOf("\u00ad"), S >= 0 && (a.splitText(S), p = a.nextSibling, p.deleteData(0, 1), T = document.createElement(x), T.appendChild(document.createTextNode("\u00ad")), e.insertBefore(T, p), p = T, E = !0)), d ? (d.appendData(a.data), e.removeChild(a)) : d = a;
if (p) continue;
}
d && (v = d.data, y || (v = v.replace(N, "")), v = n.whiteSpace(v, o, d, g, s), C && (v = C(v, d, e, t)), e.replaceChild(m(u, v, o, t, a, e), d), d = null), c == 1 && (a.firstChild && (a.nodeName.toLowerCase() == "cufon" ? P[t.engine](u, null, o, t, a, e) : arguments.callee(a, t)), g = a);
}
y && E && (b(e), M || f(window, "resize", w), M = !0), t.onAfterReplace && t.onAfterReplace(e, t);
}
function b(e) {
var t, n, r, i, s, o, u, a;
t = e.getElementsByTagName(x);
for (a = 0; n = t[a]; ++a) {
n.className = T, i = r = n.parentNode;
if (i.nodeName.toLowerCase() != S) s = document.createElement(S), s.appendChild(n.previousSibling), r.insertBefore(s, n), s.appendChild(n); else {
i = i.parentNode;
if (i.nodeName.toLowerCase() == S) {
r = i.parentNode;
while (i.firstChild) r.insertBefore(i.firstChild, i);
r.removeChild(i);
}
}
}
for (a = 0; n = t[a]; ++a) n.className = "", i = n.parentNode, r = i.parentNode, o = i.nextSibling || r.nextSibling, u = o.nodeName.toLowerCase() == S ? i : n.previousSibling, u.offsetTop >= o.offsetTop && (n.className = T, u.offsetTop < o.offsetTop && (s = document.createElement(S), r.insertBefore(s, i), s.appendChild(i), s.appendChild(o)));
}
function w() {
if (D) return;
n.addClass(t.root(), N), clearTimeout(_), _ = setTimeout(function() {
D = !0, n.removeClass(t.root(), N), b(document), D = !1;
}, 100);
}
var e = function() {
return e.replace.apply(null, arguments);
}, t = e.DOM = {
ready: function() {
var e = !1, t = {
loaded: 1,
complete: 1
}, n = [], r = function() {
if (e) return;
e = !0;
for (var t; t = n.shift(); t()) ;
};
return document.addEventListener && (document.addEventListener("DOMContentLoaded", r, !1), window.addEventListener("pageshow", r, !1)), !window.opera && document.readyState && function() {
t[document.readyState] ? r() : setTimeout(arguments.callee, 10);
}(), document.readyState && document.createStyleSheet && function() {
try {
document.body.doScroll("left"), r();
} catch (e) {
setTimeout(arguments.callee, 1);
}
}(), f(window, "load", r), function(t) {
arguments.length ? e ? t() : n.push(t) : r();
};
}(),
root: function() {
return document.documentElement || document.body;
},
strict: function() {
var e;
return document.compatMode == "BackCompat" ? !1 : (e = document.doctype, e ? !/frameset|transitional/i.test(e.publicId) : (e = document.firstChild, e.nodeType != 8 || /^DOCTYPE.+(transitional|frameset)/i.test(e.data) ? !1 : !0));
}()
}, n = e.CSS = {
Size: function(e, t) {
this.value = parseFloat(e), this.unit = String(e).match(/[a-z%]*$/)[0] || "px", this.convert = function(e) {
return e / t * this.value;
}, this.convertFrom = function(e) {
return e / this.value * t;
}, this.toString = function() {
return this.value + this.unit;
};
},
addClass: function(e, t) {
var n = e.className;
return e.className = n + (n && " ") + t, e;
},
color: c(function(e) {
var t = {};
return t.color = e.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function(e, n, r) {
return t.opacity = parseFloat(r), "rgb(" + n + ")";
}), t;
}),
fontStretch: c(function(e) {
return typeof e == "number" ? e : /%$/.test(e) ? parseFloat(e) / 100 : {
"ultra-condensed": .5,
"extra-condensed": .625,
condensed: .75,
"semi-condensed": .875,
"semi-expanded": 1.125,
expanded: 1.25,
"extra-expanded": 1.5,
"ultra-expanded": 2
}[e] || 1;
}),
getStyle: function(e) {
var t = document.defaultView;
return t && t.getComputedStyle ? new a(t.getComputedStyle(e, null)) : e.currentStyle ? new a(e.currentStyle) : new a(e.style);
},
gradient: c(function(e) {
var t = {
id: e,
type: e.match(/^-([a-z]+)-gradient\(/)[1],
stops: []
}, n = e.substr(e.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);
for (var r = 0, i = n.length, s; r < i; ++r) s = n[r].split("=", 2).reverse(), t.stops.push([ s[1] || r / (i - 1), s[0] ]);
return t;
}),
quotedList: c(function(e) {
var t = [], n = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, r;
while (r = n.exec(e)) t.push(r[3] || r[1]);
return t;
}),
recognizesMedia: c(function(e) {
var t = document.createElement("style"), n, r, i;
t.type = "text/css", t.media = e;
try {
t.appendChild(document.createTextNode("/**/"));
} catch (s) {}
return r = p("head")[0], r.insertBefore(t, r.firstChild), n = t.sheet || t.styleSheet, i = n && !n.disabled, r.removeChild(t), i;
}),
removeClass: function(e, t) {
var n = RegExp("(?:^|\\s+)" + t + "(?=\\s|$)", "g");
return e.className = e.className.replace(n, ""), e;
},
supports: function(e, t) {
var n = document.createElement("span").style;
return n[e] === undefined ? !1 : (n[e] = t, n[e] === t);
},
textAlign: function(e, t, n, r) {
return t.get("textAlign") == "right" ? n > 0 && (e = " " + e) : n < r - 1 && (e += " "), e;
},
textShadow: c(function(e) {
if (e == "none") return null;
var t = [], n = {}, r, i = 0, s = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
while (r = s.exec(e)) r[0] == "," ? (t.push(n), n = {}, i = 0) : r[1] ? n.color = r[1] : n[[ "offX", "offY", "blur" ][i++]] = r[2];
return t.push(n), t;
}),
textTransform: function() {
var e = {
uppercase: function(e) {
return e.toUpperCase();
},
lowercase: function(e) {
return e.toLowerCase();
},
capitalize: function(e) {
return e.replace(/(?:^|\s)./g, function(e) {
return e.toUpperCase();
});
}
};
return function(t, n) {
var r = e[n.get("textTransform")];
return r ? r(t) : t;
};
}(),
whiteSpace: function() {
var e = {
inline: 1,
"inline-block": 1,
"run-in": 1
}, t = /^\s+/, n = /\s+$/;
return function(r, i, s, o, u) {
return u ? r.replace(t, "").replace(n, "") : (o && o.nodeName.toLowerCase() == "br" && (r = r.replace(t, "")), e[i.get("display")] ? r : (s.previousSibling || (r = r.replace(t, "")), s.nextSibling || (r = r.replace(n, "")), r));
};
}()
};
n.ready = function() {
function f(e) {
return a[e.type.toLowerCase()] ? e.disabled || l(e.sheet, e.media || "screen") : !0;
}
function l(e, t) {
if (!n.recognizesMedia(t || "all")) return !0;
if (!e || e.disabled) return !1;
try {
var r = e.cssRules, i;
if (r) e : for (var s = 0, o = r.length; i = r[s], s < o; ++s) switch (i.type) {
case 2:
break;
case 3:
if (!l(i.styleSheet, i.media.mediaText)) return !1;
break;
default:
break e;
}
} catch (u) {}
return !0;
}
function c() {
if (document.createStyleSheet) return !0;
var e, t;
for (t = 0; e = o[t]; ++t) if (e.rel.toLowerCase() == "stylesheet" && !f(e)) return !1;
for (t = 0; e = u[t]; ++t) if (!f(e)) return !1;
return !0;
}
var e = !n.recognizesMedia("all"), r = !1, i = [], s = function() {
e = !0;
for (var t; t = i.shift(); t()) ;
}, o = p("link"), u = p("style"), a = {
"": 1,
"text/css": 1
};
return t.ready(function() {
r || (r = n.getStyle(document.body).isUsable()), e || r && c() ? s() : setTimeout(arguments.callee, 10);
}), function(t) {
e ? t() : i.push(t);
};
}();
var E = " ".split(/\s+/).length == 0, S = "cufonglue", x = "cufonshy", T = "cufon-shy-disabled", N = "cufon-viewport-resizing", C = {}, k = new u, L = new s, A = new o, O = !1, M = !1, _, D = !1, P = {}, H = {}, B = {
autoDetect: !1,
engine: null,
forceHitArea: !1,
hover: !1,
hoverables: {
a: !0
},
ignore: {
applet: 1,
canvas: 1,
col: 1,
colgroup: 1,
head: 1,
iframe: 1,
map: 1,
noscript: 1,
optgroup: 1,
option: 1,
script: 1,
select: 1,
style: 1,
textarea: 1,
title: 1,
pre: 1
},
ignoreClass: null,
modifyText: null,
onAfterReplace: null,
onBeforeReplace: null,
printable: !0,
selector: window.Sizzle || window.jQuery && function(e) {
return jQuery(e);
} || window.dojo && dojo.query || window.glow && glow.dom && glow.dom.get || window.Ext && Ext.query || window.YAHOO && YAHOO.util && YAHOO.util.Selector && YAHOO.util.Selector.query || window.$$ && function(e) {
return $$(e);
} || window.$ && function(e) {
return $(e);
} || document.querySelectorAll && function(e) {
return document.querySelectorAll(e);
} || p,
separate: "words",
softHyphens: !0,
textless: {
dl: 1,
html: 1,
ol: 1,
table: 1,
tbody: 1,
thead: 1,
tfoot: 1,
tr: 1,
ul: 1
},
textShadow: "none",
trim: "advanced",
ligatures: {
ff: "\ufb00",
fi: "\ufb01",
fl: "\ufb02",
ffi: "\ufb03",
ffl: "\ufb04",
"\u017ft": "\ufb05",
st: "\ufb06"
}
}, j = {
words: /\s/.test("\u00a0") ? /[^\S\u00a0]+/ : /\s+/,
characters: "",
none: /^/
};
return e.now = function() {
return t.ready(), e;
}, e.refresh = function() {
return A.repeat.apply(A, arguments), e;
}, e.registerEngine = function(t, n) {
return n ? (P[t] = n, e.set("engine", t)) : e;
}, e.registerFont = function(t) {
if (!t) return e;
var n = new r(t), s = n.family;
return H[s] || (H[s] = new i), H[s].add(n), e.set("fontFamily", '"' + s + '"');
}, e.replace = function(r, i, s) {
return i = v(B, i), i.engine ? (O || (n.addClass(t.root(), "cufon-active cufon-loading"), n.ready(function() {
n.addClass(n.removeClass(t.root(), "cufon-loading"), "cufon-ready");
}), O = !0), i.hover && (i.forceHitArea = !0), i.autoDetect && delete i.fontFamily, typeof i.ignoreClass == "string" && (i.ignoreClass = new RegExp("(?:^|\\s)(?:" + i.ignoreClass.replace(/\s+/g, "|") + ")(?:\\s|$)")), typeof i.textShadow == "string" && (i.textShadow = n.textShadow(i.textShadow)), typeof i.color == "string" && /^-/.test(i.color) ? i.textGradient = n.gradient(i.color) : delete i.textGradient, typeof r == "string" ? (s || A.add(r, arguments), r = [ r ]) : r.nodeType && (r = [ r ]), n.ready(function() {
for (var t = 0, n = r.length; t < n; ++t) {
var s = r[t];
typeof s == "string" ? e.replace(i.selector(s), i, !0) : y(s, i);
}
}), e) : e;
}, e.set = function(t, n) {
return B[t] = n, e;
}, e;
}();

Cufon.registerEngine("vml", function() {
function i(e, t) {
return s(e, /(?:em|ex|%)$|^[a-z-]+$/i.test(t) ? "1em" : t);
}
function s(e, t) {
if (!isNaN(t) || /px$/i.test(t)) return parseFloat(t);
var n = e.style.left, r = e.runtimeStyle.left;
e.runtimeStyle.left = e.currentStyle.left, e.style.left = t.replace("%", "em");
var i = e.style.pixelLeft;
return e.style.left = n, e.runtimeStyle.left = r, i;
}
function o(e, t, n, r) {
var i = "computed" + r, o = t[i];
return isNaN(o) && (o = t.get(r), t[i] = o = o == "normal" ? 0 : ~~n.convertFrom(s(e, o))), o;
}
function a(e) {
var t = e.id;
if (!u[t]) {
var n = e.stops, r = document.createElement("cvml:fill"), i = [];
r.type = "gradient", r.angle = 180, r.focus = "0", r.method = "none", r.color = n[0][1];
for (var s = 1, o = n.length - 1; s < o; ++s) i.push(n[s][0] * 100 + "% " + n[s][1]);
r.colors = i.join(","), r.color2 = n[o][1], u[t] = r;
}
return u[t];
}
var e = document.namespaces;
if (!e) return;
e.add("cvml", "urn:schemas-microsoft-com:vml"), e = null;
var t = document.createElement("cvml:shape");
t.style.behavior = "url(#default#VML)";
if (!t.coordsize) return;
t = null;
var n = (document.documentMode || 0) < 8, r = document.createElement("style");
r.type = "text/css", r.styleSheet.cssText = ("cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:" + (n ? "middle" : "text-bottom") + ";}" + "cufon cufontext{position:absolute;left:-10000in;font-size:1px;text-align:left;}" + "cufonshy.cufon-shy-disabled,.cufon-viewport-resizing cufonshy{display:none;}" + "cufonglue{white-space:nowrap;display:inline-block;}" + ".cufon-viewport-resizing cufonglue{white-space:normal;}" + "a cufon{cursor:pointer}" + "}" + "@media print{" + "cufon cufoncanvas{display:none;}" + "}").replace(/;/g, "!important;"), document.getElementsByTagName("head")[0].appendChild(r);
var u = {};
return function(e, t, r, u, f, l, c) {
var h = t === null;
h && (t = f.alt);
var p = e.viewBox, d = r.computedFontSize || (r.computedFontSize = new Cufon.CSS.Size(i(l, r.get("fontSize")) + "px", e.baseSize)), v, m;
if (h) v = f, m = f.firstChild; else {
v = document.createElement("cufon"), v.className = "cufon cufon-vml", v.alt = t, m = document.createElement("cufoncanvas"), v.appendChild(m);
if (u.printable) {
var g = document.createElement("cufontext");
g.appendChild(document.createTextNode(t)), v.appendChild(g);
}
c || v.appendChild(document.createElement("cvml:shape"));
}
var y = v.style, b = m.style, w = d.convert(p.height), E = Math.ceil(w), S = E / w, x = S * Cufon.CSS.fontStretch(r.get("fontStretch")), T = p.minX, N = p.minY;
b.height = E, b.top = Math.round(d.convert(N - e.ascent)), b.left = Math.round(d.convert(T)), y.height = d.convert(e.height) + "px";
var C = r.get("color"), k = Cufon.CSS.textTransform(u.ligatures ? e.applyLigatures(t, u.ligatures) : t, r).split(""), L = e.spacing(k, o(l, r, d, "letterSpacing"), o(l, r, d, "wordSpacing"));
if (!L.length) return null;
var A = L.total, O = -T + A + (p.width - L[L.length - 1]), M = d.convert(O * x), _ = Math.round(M), D = O + "," + p.height, P, H = "r" + D + "ns", B = u.textGradient && a(u.textGradient), j = e.glyphs, F = 0, I = u.textShadow, q = -1, R = 0, U;
while (U = k[++q]) {
var z = j[k[q]] || e.missingGlyph, W;
if (!z) continue;
if (h) {
W = m.childNodes[R];
while (W.firstChild) W.removeChild(W.firstChild);
} else W = document.createElement("cvml:shape"), m.appendChild(W);
W.stroked = "f", W.coordsize = D, W.coordorigin = P = T - F + "," + N, W.path = (z.d ? "m" + z.d + "xe" : "") + "m" + P + H, W.fillcolor = C, B && W.appendChild(B.cloneNode(!1));
var X = W.style;
X.width = _, X.height = E;
if (I) {
var V = I[0], $ = I[1], J = Cufon.CSS.color(V.color), K, Q = document.createElement("cvml:shadow");
Q.on = "t", Q.color = J.color, Q.offset = V.offX + "," + V.offY, $ && (K = Cufon.CSS.color($.color), Q.type = "double", Q.color2 = K.color, Q.offset2 = $.offX + "," + $.offY), Q.opacity = J.opacity || K && K.opacity || 1, W.appendChild(Q);
}
F += L[R++];
}
var G = W.nextSibling, Y, Z;
u.forceHitArea ? (G || (G = document.createElement("cvml:rect"), G.stroked = "f", G.className = "cufon-vml-cover", Y = document.createElement("cvml:fill"), Y.opacity = 0, G.appendChild(Y), m.appendChild(G)), Z = G.style, Z.width = _, Z.height = E) : G && m.removeChild(G), y.width = Math.max(Math.ceil(d.convert(A * x)), 0);
if (n) {
var et = r.computedYAdjust;
if (et === undefined) {
var tt = r.get("lineHeight");
tt == "normal" ? tt = "1em" : isNaN(tt) || (tt += "em"), r.computedYAdjust = et = .5 * (s(l, tt) - parseFloat(y.height));
}
et && (y.marginTop = Math.ceil(et) + "px", y.marginBottom = et + "px");
}
return v;
};
}()), Cufon.registerEngine("canvas", function() {
function i(e, t) {
var n = 0, r = 0, i = [], s = /([mrvxe])([^a-z]*)/g, o;
e : for (var u = 0; o = s.exec(e); ++u) {
var a = o[2].split(",");
switch (o[1]) {
case "v":
i[u] = {
m: "bezierCurveTo",
a: [ n + ~~a[0], r + ~~a[1], n + ~~a[2], r + ~~a[3], n += ~~a[4], r += ~~a[5] ]
};
break;
case "r":
i[u] = {
m: "lineTo",
a: [ n += ~~a[0], r += ~~a[1] ]
};
break;
case "m":
i[u] = {
m: "moveTo",
a: [ n = ~~a[0], r = ~~a[1] ]
};
break;
case "x":
i[u] = {
m: "closePath"
};
break;
case "e":
break e;
}
t[i[u].m].apply(t, i[u].a);
}
return i;
}
function s(e, t) {
for (var n = 0, r = e.length; n < r; ++n) {
var i = e[n];
t[i.m].apply(t, i.a);
}
}
var e = document.createElement("canvas");
if (!e || !e.getContext || !e.getContext.apply) return;
e = null;
var t = Cufon.CSS.supports("display", "inline-block"), n = !t && (document.compatMode == "BackCompat" || /frameset|transitional/i.test(document.doctype.publicId)), r = document.createElement("style");
return r.type = "text/css", r.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;" + (n ? "" : "font-size:1px;line-height:1px;") + "}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;text-align:left;text-indent:-10000in;}" + (t ? "cufon canvas{position:relative;}" : "cufon canvas{position:absolute;}") + "cufonshy.cufon-shy-disabled,.cufon-viewport-resizing cufonshy{display:none;}" + "cufonglue{white-space:nowrap;display:inline-block;}" + ".cufon-viewport-resizing cufonglue{white-space:normal;}" + "}" + "@media print{" + "cufon{padding:0;}" + "cufon canvas{display:none;}" + "}").replace(/;/g, "!important;"))), document.getElementsByTagName("head")[0].appendChild(r), function(e, n, r, o, u, a) {
function R() {
var t = e.glyphs, n, r = -1, o = -1, u;
F.scale(D, 1);
while (u = S[++r]) {
var n = t[S[r]] || e.missingGlyph;
if (!n) continue;
n.d && (F.beginPath(), F.moveTo(0, 0), n.code ? s(n.code, F) : n.code = i("m" + n.d, F), F.fill()), F.translate(x[++o], 0);
}
F.restore();
}
var f = n === null;
f && (n = u.getAttribute("alt"));
var l = e.viewBox, c = r.getSize("fontSize", e.baseSize), h = 0, p = 0, d = 0, v = 0, m = o.textShadow, g = [];
if (m) for (var y = m.length; y--; ) {
var b = m[y], w = c.convertFrom(parseFloat(b.offX)), E = c.convertFrom(parseFloat(b.offY));
g[y] = [ w, E ], E < h && (h = E), w > p && (p = w), E > d && (d = E), w < v && (v = w);
}
var S = Cufon.CSS.textTransform(o.ligatures ? e.applyLigatures(n, o.ligatures) : n, r).split(""), x = e.spacing(S, ~~c.convertFrom(parseFloat(r.get("letterSpacing")) || 0), ~~c.convertFrom(parseFloat(r.get("wordSpacing")) || 0));
if (!x.length) return null;
var T = x.total;
p += l.width - x[x.length - 1], v += l.minX;
var N, C;
if (f) N = u, C = u.firstChild; else {
N = document.createElement("cufon"), N.className = "cufon cufon-canvas", N.setAttribute("alt", n), C = document.createElement("canvas"), N.appendChild(C);
if (o.printable) {
var k = document.createElement("cufontext");
k.appendChild(document.createTextNode(n)), N.appendChild(k);
}
}
var L = N.style, A = C.style, O = c.convert(l.height), M = Math.ceil(O), _ = M / O, D = _ * Cufon.CSS.fontStretch(r.get("fontStretch")), P = T * D, H = Math.ceil(c.convert(P + p - v)), B = Math.ceil(c.convert(l.height - h + d));
C.width = H, C.height = B, A.width = H + "px", A.height = B + "px", h += l.minY, A.top = Math.round(c.convert(h - e.ascent)) + "px", A.left = Math.round(c.convert(v)) + "px";
var j = Math.max(Math.ceil(c.convert(P)), 0) + "px";
t ? (L.width = j, L.height = c.convert(e.height) + "px") : (L.paddingLeft = j, L.paddingBottom = c.convert(e.height) - 1 + "px");
var F = C.getContext("2d"), I = O / l.height, q = window.devicePixelRatio || 1;
q != 1 && (C.width = H * q, C.height = B * q, F.scale(q, q)), F.scale(I, I * _), F.translate(-v, -h), F.save();
if (m) for (var y = m.length; y--; ) {
var b = m[y];
F.save(), F.fillStyle = b.color, F.translate.apply(F, g[y]), R();
}
var U = o.textGradient;
if (U) {
var z = U.stops, W = F.createLinearGradient(0, l.minY, 0, l.maxY);
for (var y = 0, X = z.length; y < X; ++y) W.addColorStop.apply(W, z[y]);
F.fillStyle = W;
} else F.fillStyle = r.get("color");
return R(), N;
};
}());

// fonts/Vegur.font.js

Cufon.registerFont({
w: 209,
face: {
"font-family": "Vegur",
"font-weight": 200,
"font-stretch": "normal",
"units-per-em": "360",
"panose-1": "0 0 0 0 0 0 0 0 0 0",
ascent: "270",
descent: "-90",
"x-height": "4",
bbox: "-11 -274 322 94",
"underline-thickness": "18",
"underline-position": "-36",
"unicode-range": "U+0020-U+00F3"
},
glyphs: {
" ": {
w: 83
},
B: {
d: "50,-18v11,1,23,2,39,2v40,0,69,-20,69,-51v0,-28,-26,-45,-65,-45v-14,0,-32,1,-43,1r0,93xm83,-220v-12,0,-23,1,-33,2r0,87r41,0v36,0,58,-23,58,-45v0,-26,-14,-44,-66,-44xm136,-125v28,11,45,30,45,55v0,47,-41,74,-96,74v-20,0,-36,-2,-53,-4r-3,0r0,-235r3,0v20,-3,36,-4,59,-4v53,0,81,25,81,58v0,26,-15,44,-36,56",
w: 196
},
b: {
d: "50,-69v0,27,26,53,58,53v38,0,63,-27,63,-71v0,-45,-23,-71,-63,-71v-32,0,-58,26,-58,53r0,36xm112,-178v52,0,82,36,82,89v0,51,-33,93,-82,93v-27,0,-49,-13,-62,-31r-1,27r-20,0r0,-252r21,0r0,104v13,-18,35,-30,62,-30"
},
a: {
d: "78,-16v27,0,52,-26,52,-59r0,-16v-12,-2,-25,-3,-43,-3v-32,0,-49,19,-49,41v0,24,16,37,40,37xm92,-178v39,0,60,25,60,63r0,115r-20,0r-1,-27v-13,19,-30,31,-58,31v-31,0,-58,-24,-58,-55v0,-37,31,-63,74,-63v15,0,29,2,41,4r0,-2v0,-34,-16,-46,-44,-46v-16,0,-30,3,-44,11r-5,3r-2,-20r2,-1v15,-9,33,-13,55,-13",
w: 177
},
c: {
d: "110,4v-60,0,-94,-39,-94,-90v0,-51,35,-92,94,-92v18,0,32,4,45,8r3,1r-3,19r-4,-1v-12,-5,-25,-7,-39,-7v-50,0,-73,33,-73,71v0,40,23,71,73,71v13,0,24,-1,38,-6r4,-1r2,19r-3,1v-14,4,-27,7,-43,7",
w: 173
},
d: {
d: "101,-16v32,0,58,-26,58,-53r0,-36v0,-27,-26,-53,-58,-53v-38,0,-62,27,-62,71v0,45,22,71,62,71xm159,-148r0,-104r22,0r0,252r-20,0r-1,-27v-13,18,-35,31,-62,31v-52,0,-82,-36,-82,-89v0,-51,33,-93,82,-93v27,0,48,12,61,30"
},
e: {
d: "168,-104v0,6,0,11,-1,16r-1,2r-127,0v1,44,26,70,67,70v16,0,27,-2,39,-8r5,-3r2,20r-3,1v-13,6,-28,10,-46,10v-50,0,-87,-33,-87,-91v0,-48,30,-91,85,-91v43,0,67,31,67,74xm101,-158v-38,0,-57,24,-61,53r106,0v-1,-32,-15,-53,-45,-53",
w: 183
},
f: {
d: "38,-190v0,-39,16,-66,51,-66v7,0,13,2,19,3r3,1r-3,19r-4,-1v-6,-1,-11,-2,-17,-2v-19,0,-28,15,-28,43r0,19r42,0r0,19r-42,0r0,155r-21,0r0,-155r-30,0r0,-19r30,0r0,-16",
w: 107
},
g: {
d: "100,-16v31,0,59,-26,59,-53r0,-36v0,-27,-28,-53,-59,-53v-37,0,-61,27,-61,71v0,45,22,71,61,71xm160,-147r1,-27r20,0r0,162v0,61,-32,93,-87,93v-19,0,-40,-4,-56,-13r-2,-1r2,-19r5,2v17,8,38,12,53,12v39,0,63,-24,63,-75r0,-14v-14,18,-35,31,-62,31v-51,0,-81,-36,-81,-89v0,-51,33,-93,81,-93v27,0,49,13,63,31"
},
h: {
d: "50,-252r0,104v14,-18,38,-30,64,-30v41,0,62,28,62,67r0,111r-22,0r0,-107v0,-37,-17,-51,-43,-51v-31,0,-61,25,-61,53r0,105r-21,0r0,-252r21,0",
w: 201
},
i: {
d: "29,0r0,-174r21,0r0,174r-21,0xm40,-210v-8,0,-15,-6,-15,-14v0,-8,7,-14,15,-14v8,0,14,6,14,14v0,8,-6,14,-14,14",
w: 79
},
j: {
d: "40,-210v-8,0,-14,-6,-14,-14v0,-8,6,-14,14,-14v8,0,15,6,15,14v0,8,-7,14,-15,14xm30,11r0,-185r21,0r0,182v0,46,-22,73,-57,73r-3,0r-2,-19r4,0v29,0,37,-26,37,-51",
w: 79
},
k: {
d: "165,-174r-78,79r88,95r-29,0r-75,-83r-21,21r0,62r-21,0r0,-252r21,0r0,169r87,-91r28,0",
w: 176
},
l: {
d: "50,0r-21,0r0,-252r21,0r0,252",
w: 79
},
m: {
d: "217,-178v40,0,61,30,61,67r0,111r-21,0r0,-108v0,-24,-9,-50,-42,-50v-28,0,-51,24,-51,63r0,95r-22,0r0,-104v0,-32,-14,-54,-42,-54v-27,0,-50,25,-50,63r0,95r-21,0r0,-174r20,0r1,25v12,-18,31,-29,53,-29v25,0,45,15,54,38v10,-21,31,-38,60,-38",
w: 303
},
n: {
d: "49,-174r1,27v14,-18,38,-31,64,-31v41,0,62,28,62,67r0,111r-22,0r0,-107v0,-37,-17,-51,-43,-51v-31,0,-61,25,-61,53r0,105r-21,0r0,-174r20,0",
w: 201
},
o: {
d: "186,-87v0,51,-33,91,-85,91v-52,0,-85,-40,-85,-91v0,-51,33,-91,85,-91v52,0,85,40,85,91xm101,-16v44,0,62,-36,62,-71v0,-35,-18,-71,-62,-71v-44,0,-62,36,-62,71v0,35,18,71,62,71",
w: 202
},
u: {
d: "152,0r-1,-27v-14,18,-38,31,-64,31v-41,0,-62,-28,-62,-67r0,-111r22,0r0,107v0,37,17,51,43,51v31,0,61,-26,61,-54r0,-104r21,0r0,174r-20,0",
w: 201
},
t: {
d: "98,-174r0,19r-40,0r0,119v0,16,6,20,16,20v6,0,12,-1,19,-3r4,-1r2,20r-3,1v-9,2,-17,3,-25,3v-21,0,-35,-11,-35,-35r0,-124r-28,0r0,-19r28,0r0,-43r22,0r0,43r40,0",
w: 111
},
s: {
d: "65,-79v-25,-12,-46,-27,-46,-51v0,-26,22,-48,55,-48v11,0,23,2,35,9r2,1r-2,20r-5,-2v-12,-6,-19,-8,-34,-8v-16,0,-29,10,-29,25v0,18,11,26,33,36v30,14,45,29,45,52v0,28,-27,49,-55,49v-18,0,-31,-4,-45,-11r-3,-1r3,-20r4,2v15,7,25,10,41,10v19,0,33,-11,33,-27v0,-18,-8,-25,-32,-36",
w: 137
},
r: {
d: "93,-178r4,0r0,22r-4,0v-27,1,-43,28,-43,62r0,94r-21,0r0,-174r20,0r1,25v9,-16,23,-29,43,-29",
w: 104
},
q: {
d: "159,-105v0,-27,-28,-53,-59,-53v-37,0,-61,27,-61,71v0,45,22,71,61,71v31,0,59,-26,59,-53r0,-36xm97,4v-51,0,-81,-36,-81,-89v0,-51,33,-93,81,-93v27,0,49,13,63,31r1,-27r20,0r0,252r-22,0r0,-105v-14,18,-35,31,-62,31"
},
p: {
d: "109,-158v-31,0,-58,26,-58,53r0,36v0,27,27,53,58,53v37,0,62,-27,62,-71v0,-45,-23,-71,-62,-71xm51,-26r0,104r-22,0r0,-252r20,0r1,27v14,-18,36,-31,63,-31v51,0,81,36,81,89v0,51,-33,93,-81,93v-26,0,-48,-12,-62,-30"
},
C: {
d: "133,4v-69,0,-117,-50,-117,-121v0,-71,48,-122,117,-122v22,0,40,2,58,8r3,1r-2,20r-4,-1v-17,-5,-34,-9,-51,-9v-56,0,-98,40,-98,102v0,62,42,102,98,102v17,0,34,-3,51,-8r4,-1r2,19r-3,1v-18,6,-36,9,-58,9",
w: 202
},
D: {
d: "32,-235v16,-2,29,-4,47,-4v89,0,138,47,138,116v0,76,-58,127,-138,127v-17,0,-32,-1,-47,-4r-3,-1r0,-234r3,0xm80,-220v-11,0,-21,1,-30,2r0,201v9,1,20,1,29,1v68,0,115,-43,115,-105v0,-61,-41,-99,-114,-99",
w: 233
},
E: {
d: "50,-112r0,93r107,0r0,19r-128,0r0,-235r124,0r0,19r-103,0r0,85r91,0r0,19r-91,0",
w: 167
},
F: {
d: "50,0r-21,0r0,-235r127,0r0,19r-106,0r0,87r91,0r0,20r-91,0r0,109",
w: 159
},
U: {
d: "195,-85v0,56,-33,89,-85,89v-52,0,-85,-34,-85,-82r0,-157r21,0r0,153v0,42,24,66,64,66v42,0,65,-26,65,-66r0,-153r20,0r0,150",
w: 219
},
T: {
d: "189,-235r0,19r-79,0r2,216r-21,0r-5,-216r-79,0r0,-19r182,0",
w: 195
},
S: {
d: "18,-182v0,-36,30,-57,73,-57v18,0,30,3,42,9r2,1r-2,20r-4,-2v-14,-7,-25,-9,-41,-9v-35,0,-48,19,-48,35v0,24,11,35,51,56v39,22,57,40,57,69v0,37,-30,64,-82,64v-17,0,-31,-3,-45,-9r-3,-1r2,-20r4,2v15,6,27,8,43,8v39,0,58,-17,58,-41v0,-25,-11,-36,-47,-55v-44,-24,-60,-44,-60,-70",
w: 164
},
R: {
d: "50,0r-21,0r0,-235r3,0v24,-2,35,-4,56,-4v56,0,86,25,86,61v0,29,-19,50,-42,61v15,8,22,17,30,46v7,25,13,44,21,66r2,5r-25,0r-1,-3v-7,-20,-15,-45,-21,-66v-8,-28,-14,-35,-48,-35r-40,0r0,104xm86,-220v-13,0,-25,1,-36,2r0,94v10,0,24,1,34,1v39,0,65,-22,65,-51v0,-27,-16,-46,-63,-46",
w: 190
},
Q: {
d: "243,-117v0,43,-18,82,-51,104r23,51r-23,0r-20,-42v-13,5,-27,8,-42,8v-72,0,-114,-58,-114,-122v0,-64,42,-121,114,-121v72,0,113,58,113,122xm130,-16v58,0,90,-49,90,-102v0,-53,-32,-102,-90,-102v-58,0,-91,49,-91,102v0,53,33,102,91,102",
w: 259
},
P: {
d: "50,0r-21,0r0,-235r3,0v25,-3,34,-4,56,-4v52,0,84,28,84,66v0,43,-35,74,-86,74v-13,0,-26,-1,-36,-3r0,102xm88,-220v-12,0,-28,1,-38,2r0,96v12,2,23,3,36,3v36,0,63,-20,63,-53v0,-31,-20,-48,-61,-48",
w: 176
},
O: {
d: "130,-239v72,0,113,57,113,121v0,64,-41,122,-113,122v-72,0,-114,-58,-114,-122v0,-64,42,-121,114,-121xm130,-16v58,0,90,-49,90,-102v0,-53,-32,-102,-90,-102v-58,0,-91,49,-91,102v0,53,33,102,91,102",
w: 259
},
L: {
d: "50,-235r0,216r122,0r0,19r-143,0r0,-235r21,0",
w: 180
},
J: {
d: "118,-79v0,52,-30,83,-72,83v-13,0,-21,-2,-32,-4r-4,-1r3,-19r4,1v10,3,16,3,27,3v31,0,52,-17,52,-62r0,-157r22,0r0,156",
w: 140
},
I: {
d: "50,0r-21,0r0,-235r21,0r0,235",
w: 79
},
H: {
d: "188,-235r22,0r0,235r-22,0r0,-113r-138,0r0,113r-21,0r0,-235r21,0r0,103r138,0r0,-103",
w: 238
},
G: {
d: "185,-23r0,-78r-51,0r0,-19r73,0r0,111r-3,1v-24,8,-43,12,-70,12v-66,0,-118,-46,-118,-121v0,-71,45,-122,123,-122v22,0,41,2,57,8r3,1r-3,20r-4,-1v-18,-6,-34,-9,-55,-9v-63,0,-98,46,-98,102v0,63,42,102,97,102v21,0,36,-3,49,-7",
w: 229
},
"0": {
d: "102,-230v52,0,83,50,83,117v0,67,-31,117,-83,117v-52,0,-84,-50,-84,-117v0,-67,32,-117,84,-117xm102,-16v39,0,60,-40,60,-97v0,-57,-21,-97,-60,-97v-39,0,-61,40,-61,97v0,57,22,97,61,97",
w: 203
},
"1": {
d: "99,-226r12,0r0,226r-22,0r0,-198r-36,16r-2,-19",
w: 159
},
"2": {
d: "42,-19r114,0r0,19r-143,0r0,-15r51,-60v59,-65,65,-77,65,-97v0,-25,-16,-38,-46,-38v-18,0,-34,4,-48,12r-4,3r-3,-21r2,-1v17,-9,37,-13,59,-13v39,0,63,26,63,56v0,30,-19,53,-79,120",
w: 174
},
"3": {
d: "61,4v-16,0,-32,-4,-45,-11r-2,-1r2,-20r5,2v15,7,28,10,44,10v34,0,59,-18,59,-45v0,-20,-8,-42,-64,-49r-4,0r0,-18r4,-1v34,-2,57,-20,57,-44v0,-23,-14,-37,-48,-37v-15,0,-28,4,-41,11r-5,3r-2,-20r2,-1v13,-7,30,-13,52,-13v40,0,65,25,65,53v0,24,-16,45,-40,56v24,9,48,26,48,59v0,41,-37,66,-87,66",
w: 166
},
"4": {
d: "147,-226r0,147r28,0r0,20r-28,0r0,59r-21,0r0,-59r-115,0r0,-16r115,-151r21,0xm125,-151r0,-45r-34,47r-53,70r88,0",
w: 189
},
"6": {
d: "145,-66v0,-30,-19,-51,-51,-51v-34,0,-53,14,-53,32v0,42,21,69,55,69v29,0,49,-22,49,-50xm93,4v-45,0,-75,-37,-75,-101v0,-76,47,-129,119,-133r3,0r2,19r-4,0v-64,4,-91,46,-96,93v14,-13,33,-19,56,-19v43,0,70,33,70,69v0,42,-32,72,-75,72",
w: 183
},
"5": {
d: "78,-142v51,0,76,33,76,69v0,48,-36,77,-90,77v-18,0,-33,-4,-47,-11r-3,-1r3,-20r4,2v18,7,29,10,47,10v35,0,63,-19,63,-54v0,-31,-17,-52,-57,-52v-13,0,-26,1,-36,4r-1,1r-14,-1r6,-108r108,0r0,19r-89,0r-3,68v9,-2,21,-3,33,-3",
w: 172
},
"7": {
d: "11,-226r141,0r0,17r-97,209r-23,0r98,-207r-119,0r0,-19",
w: 164
},
"8": {
d: "41,-62v0,27,18,46,51,46v30,0,52,-18,52,-44v0,-27,-17,-43,-53,-55v-37,13,-50,32,-50,53xm93,-210v-30,0,-43,16,-43,36v0,21,16,37,44,47v28,-10,43,-23,43,-45v0,-21,-14,-38,-44,-38xm119,-122v32,16,48,34,48,61v0,41,-35,65,-75,65v-41,0,-74,-20,-74,-60v0,-29,18,-50,48,-64v-24,-12,-39,-30,-39,-55v0,-29,24,-55,66,-55v37,0,67,24,67,53v0,25,-16,41,-41,55",
w: 184
},
"9": {
d: "38,-160v0,30,20,51,52,51v34,0,52,-14,52,-32v0,-42,-21,-69,-55,-69v-29,0,-49,22,-49,50xm90,-230v45,0,75,37,75,101v0,76,-46,129,-118,133r-4,0r-2,-19r4,0v64,-4,91,-46,96,-93v-14,13,-33,19,-56,19v-43,0,-70,-33,-70,-69v0,-42,32,-72,75,-72",
w: 183
},
"/": {
d: "105,-248r21,0r-113,265r-20,0",
w: 118
},
".": {
d: "48,-8v0,8,-7,15,-15,15v-8,0,-15,-7,-15,-15v0,-8,7,-15,15,-15v8,0,15,7,15,15",
w: 61
},
"-": {
d: "90,-101r0,17r-77,0r0,-17r77,0",
w: 103
},
",": {
d: "38,-19r16,0r-2,4v-8,25,-17,49,-26,71r-1,2r-23,7r2,-7v8,-22,19,-53,24,-69v1,-3,0,-2,0,-2v2,-4,5,-6,10,-6",
w: 64
},
"+": {
d: "116,-101r80,0r0,17r-80,0r0,88r-20,0r0,-88r-79,0r0,-17r79,0r0,-87r20,0r0,87",
w: 212
},
"*": {
d: "58,-239r22,0r-3,50r46,-18r7,20r-49,12r32,39r-17,13r-27,-43r-27,43r-17,-13r32,-39r-49,-12r7,-20r46,18",
w: 138
},
"(": {
d: "83,32r3,5r-19,0r-1,-1v-24,-41,-42,-83,-42,-143v0,-60,18,-102,42,-142r1,-2r19,0r-3,5v-22,40,-39,86,-39,139v0,53,17,99,39,139",
w: 90
},
"'": {
d: "39,-170r-19,0r-2,-69r0,-1v0,-8,5,-10,11,-10r14,0",
w: 59
},
"%": {
d: "208,-122v34,0,54,28,54,63v0,35,-20,63,-54,63v-35,0,-56,-28,-56,-63v0,-35,21,-63,56,-63xm208,-14v20,0,34,-16,34,-45v0,-29,-14,-46,-34,-46v-20,0,-35,17,-35,46v0,29,15,45,35,45xm69,-230v35,0,56,29,56,65v0,36,-21,65,-56,65v-34,0,-54,-29,-54,-65v0,-36,20,-65,54,-65xm69,-117v20,0,35,-18,35,-48v0,-30,-15,-47,-35,-47v-20,0,-33,17,-33,47v0,30,13,48,33,48xm212,-233r23,0r-170,240r-23,0",
w: 277
},
"!": {
d: "33,7v-8,0,-15,-7,-15,-15v0,-8,7,-15,15,-15v8,0,16,7,16,15v0,8,-8,15,-16,15xm44,-46r-21,0r-2,-193r25,0",
w: 66
},
'"': {
d: "39,-170r-19,0r-2,-69r0,-1v0,-8,5,-10,11,-10r14,0xm76,-170r-19,0r-1,-69r0,-1v0,-8,5,-10,11,-10r13,0",
w: 97
},
"#": {
d: "124,-131r-7,36r34,0r0,17r-38,0r-15,74r-19,0r15,-74r-29,0r-15,74r-19,0r15,-74r-31,0r0,-17r34,0r8,-36r-34,0r0,-18r37,0r16,-73r18,0r-15,73r30,0r15,-73r19,0r-15,73r31,0r0,18r-35,0xm98,-95r7,-36r-29,0r-8,36r30,0",
w: 173
},
$: {
d: "141,-64v0,33,-23,53,-54,57r0,34r-17,0r0,-33v-15,0,-28,-3,-41,-9r-2,-2r2,-19r5,2v17,7,26,9,41,9v28,0,43,-14,43,-36v0,-17,-7,-27,-41,-48v-36,-22,-49,-37,-49,-62v0,-25,19,-43,45,-48r0,-34r17,0r0,33v14,1,27,5,36,10r2,1r-2,19r-5,-2v-11,-6,-23,-9,-35,-9v-23,0,-35,11,-35,28v0,17,7,27,38,46v41,25,52,41,52,63",
w: 168
},
"&": {
d: "92,-223v-16,0,-28,8,-28,26v0,16,7,28,23,48v24,-20,34,-30,34,-48v0,-14,-10,-26,-29,-26xm213,4r-29,0r-19,-25v-21,20,-45,28,-74,28v-41,0,-77,-22,-77,-64v0,-32,25,-55,56,-79v-18,-21,-29,-40,-29,-59v0,-29,20,-48,51,-48v31,0,51,20,51,45v0,25,-16,43,-44,64r66,80v10,-17,12,-38,12,-65r0,-3r22,0r0,3v0,17,-3,56,-21,82xm83,-121v-35,29,-46,43,-46,63v0,30,24,46,57,46v26,0,41,-5,58,-23",
w: 211
},
")": {
d: "7,-246r-3,-5r19,0r1,2v24,40,42,82,42,142v0,60,-18,102,-42,143r-1,1r-19,0r3,-5v22,-40,39,-86,39,-139v0,-53,-17,-99,-39,-139",
w: 90
},
"?": {
d: "80,-129v-18,24,-22,43,-22,66r0,17r-22,0r0,-14v0,-35,12,-59,32,-87v14,-19,20,-31,20,-46v0,-24,-17,-30,-35,-30v-14,0,-26,5,-38,14r-5,3r-3,-20r2,-1v19,-14,36,-16,47,-16v35,0,55,21,55,49v0,20,-9,36,-31,65xm55,-8v0,-5,-3,-8,-8,-8v-5,0,-8,3,-8,8v0,5,3,8,8,8v5,0,8,-3,8,-8",
w: 124
},
":": {
d: "18,-166v0,-8,7,-15,15,-15v8,0,15,7,15,15v0,8,-7,15,-15,15v-8,0,-15,-7,-15,-15xm48,-8v0,8,-7,15,-15,15v-8,0,-15,-7,-15,-15v0,-8,7,-15,15,-15v8,0,15,7,15,15",
w: 61
},
";": {
d: "22,-166v0,-8,7,-15,15,-15v8,0,15,7,15,15v0,8,-7,15,-15,15v-8,0,-15,-7,-15,-15xm38,-19r16,0r-2,4v-8,25,-17,49,-26,71r-1,2r-23,7r2,-7v8,-22,19,-53,24,-69v1,-3,0,-2,0,-2v2,-4,5,-6,10,-6",
w: 64
},
"<": {
d: "38,-91r118,63r0,22r-141,-76r0,-18r141,-77r0,21",
w: 170
},
"=": {
d: "189,-120r-170,0r0,-18r170,0r0,18xm189,-47r-170,0r0,-17r170,0r0,17",
w: 207
},
"[": {
d: "48,-231r0,249r32,0r0,17r-51,0r0,-283r51,0r0,17r-32,0",
w: 88
},
"\\": {
d: "14,-248r112,265r-21,0r-112,-265r21,0",
w: 118
},
"]": {
d: "9,-231r0,-17r51,0r0,283r-51,0r0,-17r31,0r0,-249r-31,0",
w: 88
},
"^": {
d: "101,-231r69,147r-21,0r-57,-123r-57,123r-21,0r69,-147r18,0",
w: 184
},
_: {
d: "166,32r-170,0r0,-17r170,0r0,17",
w: 162
},
">": {
d: "133,-91r-119,-64r0,-22r141,77r0,18r-141,76r0,-21",
w: 170
},
"{": {
d: "57,-79v0,2,-1,4,-1,6r-6,50v-1,4,-1,8,-1,12v0,19,7,32,36,32r4,0r0,17r-4,0v-33,0,-55,-16,-55,-49v0,-4,0,-8,1,-13r7,-50r0,-5v0,-8,-2,-17,-24,-19r-4,-1r0,-16r4,-1v17,-2,24,-8,24,-20v0,-2,-1,-4,-1,-6r-6,-48v-1,-4,-1,-9,-1,-13v0,-33,22,-49,55,-49r4,0r0,17r-4,0v-29,0,-36,12,-36,31v0,4,0,9,1,13r7,50r0,5v0,11,-5,21,-17,28v11,7,17,16,17,29",
w: 97
},
"|": {
d: "48,94r-19,0r0,-368r19,0r0,368",
w: 77
},
"}": {
d: "40,-135v0,-2,1,-4,1,-6r7,-50v1,-4,1,-8,1,-12v0,-19,-8,-32,-37,-32r-3,0r0,-17r3,0v33,0,56,16,56,49v0,4,0,9,-1,13r-7,50v0,2,-1,4,-1,5v0,8,3,17,25,19r3,1r0,16r-3,1v-18,2,-25,8,-25,21v0,2,1,3,1,5r7,48v1,5,1,9,1,13v0,33,-23,49,-56,49r-3,0r0,-17r3,0v29,0,36,-12,36,-31v0,-4,1,-9,0,-13r-8,-50r0,-4v0,-11,6,-22,18,-29v-12,-7,-18,-16,-18,-29",
w: 97
},
"~": {
d: "98,-83v-31,-11,-43,-13,-50,-13v-14,0,-20,4,-20,19r0,4r-17,0r0,-4v0,-19,8,-37,40,-37v13,0,25,3,53,13v31,11,43,12,50,12v14,0,20,-3,20,-18r0,-4r17,0r0,4v0,18,-9,37,-41,37v-13,0,-24,-3,-52,-13",
w: 201
},
"`": {
d: "25,-250v6,0,9,4,11,7v7,12,15,28,23,41r3,5r-22,2r-2,-1v-8,-12,-20,-33,-28,-49r-3,-5r18,0",
w: 67
},
"@": {
d: "181,-97r10,-42v-5,-1,-12,-2,-21,-2v-40,0,-67,36,-67,78v0,25,14,34,25,34v32,0,47,-38,53,-68xm280,-112v0,56,-28,98,-68,98v-18,0,-32,-9,-36,-27v-13,20,-32,29,-52,29v-22,0,-42,-22,-42,-48v0,-57,39,-99,93,-99v14,0,23,2,35,7r3,2r-18,78v-2,7,-2,13,-2,18v0,15,6,22,20,22v24,0,47,-27,47,-75v0,-51,-30,-89,-90,-89v-74,0,-133,56,-133,127v0,60,39,97,94,97v26,0,46,-5,70,-19r4,-2r3,18r-2,1v-27,15,-51,19,-78,19v-63,0,-111,-46,-111,-111v0,-92,75,-147,159,-147v58,0,104,42,104,101",
w: 293
},
K: {
d: "189,-235r-99,107r109,128r-28,0r-97,-116r-24,27r0,89r-21,0r0,-235r21,0r0,124r111,-124r28,0",
w: 200
},
M: {
d: "144,-31r89,-204r28,0r1,235r-21,0r-1,-207r-86,198r-21,0r-84,-198r-1,207r-21,0r1,-235r28,0",
w: 290
},
v: {
d: "92,-22r62,-152r22,0r-74,174r-21,0r-75,-174r24,0",
w: 178
},
w: {
d: "203,-25r53,-149r22,0r-65,174r-20,0r-51,-150r-57,150r-20,0r-58,-174r23,0r46,149r57,-149r20,0",
w: 281
},
x: {
d: "167,-174r-65,84r70,90r-27,0r-57,-78r-57,78r-26,0r69,-89r-66,-85r27,0r53,72r54,-72r25,0",
w: 171
},
y: {
d: "15,62v29,-5,44,-15,65,-65r-74,-171r24,0r62,152r62,-152r22,0r-73,172v-27,64,-51,78,-86,83r-3,1r-3,-19",
w: 178
},
z: {
d: "13,-17r98,-138r-91,0r0,-19r116,0r0,17r-98,138r104,0r0,19r-129,0r0,-17",
w: 154
},
Z: {
d: "14,-18r127,-198r-115,0r0,-19r139,0r0,17r-127,199r136,0r0,19r-160,0r0,-18",
w: 183
},
Y: {
d: "98,-122r65,-113r24,0r-78,129r0,106r-23,0r0,-105r-80,-130r26,0",
w: 187
},
X: {
d: "107,-121r77,121r-26,0r-64,-103r-64,103r-25,0r76,-120r-73,-115r26,0r60,97r61,-97r24,0",
w: 184
},
W: {
d: "234,-30r67,-205r21,0r-78,235r-20,0r-59,-205r-66,205r-21,0r-71,-235r23,0r59,205r66,-205r20,0",
w: 326
},
V: {
d: "107,-24r78,-211r22,0r-90,235r-21,0r-90,-235r24,0"
},
A: {
d: "105,-208r-41,113r82,0xm182,0r-29,-76r-96,0r-30,76r-22,0r90,-235r21,0r90,235r-24,0"
},
N: {
d: "195,-61r0,-174r21,0r0,235r-25,0r-143,-209v0,12,1,24,1,35r0,174r-21,0r0,-235r24,0r143,209r0,-35",
w: 243
},
"\u00f3": {
d: "117,-250v-6,0,-9,4,-11,7v-7,12,-15,28,-23,41r-3,5r22,2r1,-1v8,-12,21,-33,29,-49r3,-5r-18,0xm186,-87v0,51,-33,91,-85,91v-52,0,-85,-40,-85,-91v0,-51,33,-91,85,-91v52,0,85,40,85,91xm101,-16v44,0,62,-36,62,-71v0,-35,-18,-71,-62,-71v-44,0,-62,36,-62,71v0,35,18,71,62,71",
w: 202
},
"\u00a0": {
w: 83
}
}
}), Cufon.registerFont({
w: 189,
face: {
"font-family": "Vegur",
"font-weight": 700,
"font-stretch": "normal",
"units-per-em": "360",
"panose-1": "0 0 0 0 0 0 0 0 0 0",
ascent: "270",
descent: "-90",
"x-height": "4",
bbox: "-13 -270 325 90",
"underline-thickness": "18",
"underline-position": "-18",
"unicode-range": "U+0020-U+007E"
},
glyphs: {
" ": {
w: 79
},
"~": {
d: "116,-109v30,15,36,16,44,16v9,0,14,-7,14,-19r31,0v0,30,-14,57,-45,57v-19,0,-32,-6,-61,-20v-30,-15,-36,-17,-44,-17v-9,0,-14,8,-14,20r-31,0v0,-30,14,-57,45,-57v19,0,32,6,61,20",
w: 215
},
_: {
d: "189,50r-189,0r0,-31r189,0r0,31"
},
"^": {
d: "79,-228r41,0r65,141r-42,0r-44,-99r0,0r-45,99r-40,0",
w: 198
},
"]": {
d: "8,-214r0,-31r80,0r0,276r-80,0r0,-31r41,0r0,-214r-41,0",
w: 115
},
"\\": {
d: "40,-245r109,258r-41,0r-110,-258r42,0",
w: 147
},
"[": {
d: "107,-214r-41,0r0,214r41,0r0,31r-80,0r0,-276r80,0r0,31",
w: 115
},
Z: {
d: "184,-40r0,40r-175,0r0,-39r111,-156r0,-1r-97,0r0,-39r152,0r0,38r-111,157r0,0r120,0"
},
Y: {
d: "146,-235r51,0r-72,132r0,103r-48,0r0,-100r-74,-135r55,0r44,94r0,0",
w: 198
},
X: {
d: "188,-235r-65,112r70,123r-55,0r-42,-87r-1,0r-42,87r-51,0r68,-119r-67,-116r56,0r38,80r1,0r38,-80r52,0",
w: 196
},
"9": {
d: "96,-229v45,0,83,35,83,96v0,83,-64,133,-141,137r-5,-39v47,-5,84,-29,92,-61r-1,0v-10,9,-26,14,-40,14v-42,0,-74,-28,-74,-68v0,-48,40,-79,86,-79xm97,-119v16,0,28,-11,28,-28v0,-26,-12,-43,-31,-43v-17,0,-31,10,-31,33v0,26,12,38,34,38",
w: 192
},
":": {
d: "45,-53v16,0,28,12,28,28v0,16,-12,29,-28,29v-16,0,-29,-13,-29,-29v0,-16,13,-28,29,-28xm45,-121v-16,0,-29,-12,-29,-28v0,-16,13,-29,29,-29v16,0,28,13,28,29v0,16,-12,28,-28,28",
w: 84
},
";": {
d: "31,-32v2,-8,9,-13,22,-13r28,0v-10,29,-23,67,-37,100r-41,4v12,-34,23,-72,28,-91xm56,-121v-16,0,-29,-12,-29,-28v0,-16,13,-29,29,-29v16,0,28,13,28,29v0,16,-12,28,-28,28",
w: 95
},
"<": {
d: "54,-92r99,50r0,42r-139,-70r0,-42r139,-71r0,42r-99,48r0,1",
w: 168
},
"=": {
d: "206,-116r-189,0r0,-31r189,0r0,31xm206,-37r-189,0r0,-31r189,0r0,31",
w: 222
},
">": {
d: "114,-90r-99,-50r0,-43r139,71r0,42r-139,70r0,-41r99,-49r0,0",
w: 168
},
"?": {
d: "90,-25v0,-16,-12,-28,-28,-28v-16,0,-29,12,-29,28v0,16,13,29,29,29v16,0,28,-13,28,-29xm139,-188v0,21,-9,39,-39,75v-14,17,-17,24,-17,36r0,6r-44,0r0,-6v0,-22,6,-35,25,-59v21,-27,23,-36,23,-45v0,-11,-10,-18,-28,-18v-16,0,-32,5,-46,14r-4,-39v21,-10,38,-15,65,-15v37,0,65,20,65,51",
w: 154
},
"`": {
d: "9,-246r35,0v4,0,7,3,10,7v8,13,26,40,38,57r-38,2v-13,-17,-34,-47,-45,-66",
w: 100
},
"@": {
d: "176,-212v62,0,107,46,107,99v0,60,-32,95,-74,95v-19,0,-34,-7,-39,-24r-1,0v-10,18,-24,27,-45,27v-26,0,-47,-22,-47,-50v0,-53,37,-90,94,-90v16,0,39,5,49,11r-17,71v-4,18,1,28,12,28v20,0,36,-26,36,-61v0,-49,-28,-80,-81,-80v-69,0,-123,50,-123,115v0,58,33,89,84,89v24,0,47,-7,70,-19r3,25v-22,12,-47,19,-76,19v-68,0,-113,-42,-113,-110v0,-87,72,-145,161,-145xm169,-89r8,-33v-3,-1,-9,-2,-15,-2v-24,0,-43,21,-43,57v0,12,6,21,16,21v17,0,26,-10,34,-43",
w: 294
},
A: {
d: "165,0r-22,-66r-72,0v-10,32,-22,66,-22,66r-47,0r83,-235r49,0r82,235r-51,0xm84,-105r46,0r-4,-13v-8,-24,-13,-45,-18,-69r-1,0v-4,24,-10,45,-18,69",
w: 218
},
a: {
d: "95,-178v41,0,67,23,67,62r0,116r-48,0r-1,-22r0,0v-13,17,-26,26,-48,26v-22,0,-53,-19,-53,-58v0,-38,32,-59,72,-59v10,0,21,1,29,2r0,0r0,-4v0,-14,-10,-23,-31,-23v-17,0,-30,5,-45,12r-6,-40v20,-8,39,-12,64,-12xm113,-73r0,-8v-9,-1,-15,-2,-25,-2v-14,0,-24,8,-24,24v0,15,8,23,20,23v18,0,29,-18,29,-37",
w: 182
},
b: {
d: "74,-22r-1,0r0,22r-48,0r0,-252r48,0r0,99r1,0v13,-15,33,-25,55,-25v48,0,79,38,79,89v0,55,-34,93,-79,93v-22,0,-42,-11,-55,-26xm73,-95r0,16v0,25,17,43,42,43v23,0,41,-19,41,-51v0,-31,-15,-51,-41,-51v-25,0,-42,18,-42,43",
w: 221
},
d: {
d: "148,-252r48,0r0,252r-48,0r0,-22r-1,0v-13,15,-32,26,-54,26v-48,0,-80,-38,-80,-89v0,-55,35,-93,80,-93v22,0,41,10,54,25r1,0r0,-99xm148,-79r0,-16v0,-25,-17,-43,-42,-43v-23,0,-41,19,-41,51v0,31,15,51,41,51v25,0,42,-18,42,-43",
w: 221
},
e: {
d: "177,-100v0,8,-1,17,-2,24r-113,0v0,27,18,40,47,40v13,0,33,-3,47,-9r5,40v-15,5,-36,9,-53,9v-59,0,-95,-36,-95,-91v0,-49,35,-91,90,-91v46,0,74,34,74,78xm99,-138v-18,0,-31,10,-35,30r65,0v0,-18,-9,-30,-30,-30",
w: 190
},
c: {
d: "109,4v-57,0,-96,-35,-96,-90v0,-56,38,-92,96,-92v20,0,37,2,52,7r-5,40v-15,-5,-25,-7,-42,-7v-36,0,-49,27,-49,51v0,24,13,51,49,51v14,0,26,-2,40,-6r6,39v-17,4,-32,7,-51,7",
w: 173
},
f: {
d: "38,-186v0,-44,28,-70,71,-70v13,0,23,2,29,3r-6,40v-5,-1,-10,-3,-17,-3v-19,0,-29,11,-29,28r0,14r42,0r0,39r-42,0r0,135r-48,0r0,-135r-30,0r0,-39r30,0r0,-12",
w: 137
},
F: {
d: "72,0r-49,0r0,-235r145,0r0,39r-96,0r0,57r81,0r0,40r-81,0r0,99",
w: 171
},
G: {
d: "169,-40r0,-53r-44,0r0,-39r92,0r0,124v-25,7,-54,12,-85,12v-66,0,-120,-41,-120,-122v0,-76,56,-121,134,-121v25,0,46,3,64,8r-6,40v-19,-5,-39,-8,-62,-8v-51,0,-78,30,-78,81v0,54,29,82,70,82v15,0,22,-1,35,-4",
w: 237
},
H: {
d: "176,-235r48,0r0,235r-48,0r0,-103r-104,0r0,103r-49,0r0,-235r49,0r0,92r104,0r0,-92",
w: 247
},
I: {
d: "72,0r-49,0r0,-235r49,0r0,235",
w: 95
},
J: {
d: "138,-87v0,63,-40,91,-94,91v-13,0,-24,-1,-36,-4r5,-40v10,3,18,4,28,4v35,0,49,-18,49,-51r0,-148r48,0r0,148",
w: 156
},
K: {
d: "204,-235r-90,103r97,132r-59,0r-70,-100r-1,0r-9,11r0,89r-49,0r0,-235r49,0r0,61v0,13,0,21,-1,34r0,0v5,-10,15,-23,24,-34r50,-61r59,0",
w: 210
},
l: {
d: "73,0r-48,0r0,-252r48,0r0,252",
w: 98
},
m: {
d: "230,-178v36,0,54,30,54,66r0,112r-48,0r0,-109v0,-18,-8,-29,-26,-29v-18,0,-32,16,-32,47r0,91r-48,0r0,-109v0,-19,-8,-29,-26,-29v-20,0,-31,19,-31,47r0,91r-48,0r0,-174r48,0r0,24r1,0v11,-18,26,-28,49,-28v25,0,40,11,49,32r1,0v13,-22,29,-32,57,-32",
w: 304
},
N: {
d: "176,-235r46,0r0,235r-68,0r-58,-124v-8,-18,-15,-32,-28,-69r-1,0v1,19,1,51,1,69r0,124r-46,0r0,-235r68,0r57,120v9,18,16,36,30,73r0,0v-1,-37,-1,-55,-1,-73r0,-120",
w: 244
},
o: {
d: "106,-178v55,0,93,40,93,91v0,51,-38,91,-93,91v-55,0,-93,-40,-93,-91v0,-51,38,-91,93,-91xm106,-36v24,0,41,-19,41,-51v0,-32,-17,-51,-41,-51v-24,0,-41,19,-41,51v0,32,17,51,41,51",
w: 212
},
P: {
d: "72,-198r0,68v8,1,18,1,28,1v20,0,32,-15,32,-36v0,-22,-13,-34,-33,-34v-10,0,-17,0,-27,1xm23,0r0,-235v27,-2,48,-4,76,-4v53,0,85,28,85,70v0,48,-41,80,-85,80v-9,0,-19,-1,-27,-2r0,0r0,91r-49,0",
w: 187
},
p: {
d: "73,78r-48,0r0,-252r48,0r0,21r1,0v13,-15,33,-25,55,-25v48,0,79,38,79,89v0,55,-34,93,-79,93v-22,0,-42,-11,-55,-26r-1,0r0,100xm73,-95r0,16v0,25,17,43,42,43v23,0,41,-19,41,-51v0,-31,-15,-51,-41,-51v-25,0,-42,18,-42,43",
w: 221
},
Q: {
d: "203,-17r25,55r-52,0r-16,-37v-8,2,-18,3,-27,3v-73,0,-121,-55,-121,-122v0,-67,48,-121,121,-121v73,0,122,54,122,121v0,41,-20,79,-52,101xm133,-36v39,0,70,-31,70,-82v0,-51,-31,-81,-70,-81v-39,0,-69,30,-69,81v0,51,30,82,69,82",
w: 266
},
q: {
d: "147,-153r1,0r0,-21r48,0r0,252r-48,0r0,-100r-1,0v-13,15,-32,26,-54,26v-48,0,-80,-38,-80,-89v0,-55,35,-93,80,-93v22,0,41,10,54,25xm148,-79r0,-16v0,-25,-17,-43,-42,-43v-23,0,-41,19,-41,51v0,31,15,51,41,51v25,0,42,-18,42,-43",
w: 221
},
r: {
d: "126,-178r0,43v-36,2,-53,17,-53,57r0,78r-48,0r0,-174r48,0r0,28r1,0v10,-18,28,-32,52,-32",
w: 132
},
R: {
d: "72,-198r0,64v10,1,15,2,25,2v23,0,37,-14,37,-35v0,-21,-12,-32,-35,-32v-9,0,-16,0,-27,1xm23,0r0,-235v24,-2,49,-4,80,-4v51,0,83,29,83,62v0,28,-19,47,-43,57r0,0v17,9,24,18,33,51v6,26,14,47,22,69r-52,0v-6,-21,-14,-46,-19,-69v-4,-17,-14,-26,-29,-26v-9,0,-13,0,-26,1r0,94r-49,0",
w: 200
},
S: {
d: "14,-175v0,-38,30,-64,82,-64v18,0,38,3,52,9r-5,39v-15,-6,-34,-8,-50,-8v-17,0,-27,9,-27,20v0,15,5,21,35,36v44,22,63,45,63,76v0,44,-40,71,-89,71v-19,0,-43,-4,-61,-9r5,-39v19,6,35,8,58,8v22,0,35,-11,35,-27v0,-13,-6,-23,-32,-36v-44,-22,-66,-42,-66,-76",
w: 174
},
s: {
d: "72,-65v-40,-14,-57,-29,-57,-60v0,-28,22,-53,69,-53v16,0,33,3,46,8r-5,40v-12,-5,-26,-8,-40,-8v-11,0,-18,4,-18,11v0,8,4,11,11,14v48,18,61,33,61,61v0,33,-30,56,-67,56v-20,0,-42,-4,-58,-10r5,-40v14,6,30,10,46,10v15,0,23,-5,23,-12v0,-8,-4,-12,-16,-17",
w: 149
},
M: {
d: "273,-235r1,235r-48,0r-1,-141v0,-14,1,-34,2,-49r-1,0v-3,15,-7,35,-12,49r-44,132r-50,0r-44,-132v-5,-14,-9,-34,-11,-48r-1,0v1,14,2,34,2,48r-1,141r-44,0r1,-235r70,0r38,117v5,16,12,37,17,64r0,0v5,-27,11,-48,17,-64r39,-117r70,0",
w: 295
},
O: {
d: "133,-239v73,0,122,54,122,121v0,67,-49,122,-122,122v-73,0,-121,-55,-121,-122v0,-67,48,-121,121,-121xm133,-36v39,0,70,-31,70,-82v0,-51,-31,-81,-70,-81v-39,0,-69,30,-69,81v0,51,30,82,69,82",
w: 266
},
T: {
d: "203,-235r0,39r-76,0r0,196r-48,0r0,-196r-75,0r0,-39r199,0",
w: 206
},
U: {
d: "204,-84v0,57,-40,88,-92,88v-52,0,-93,-32,-93,-81r0,-158r48,0r0,154v0,31,20,45,44,45v25,0,47,-12,47,-45r0,-154r46,0r0,151",
w: 222
},
V: {
d: "169,-235r47,0r-82,235r-49,0r-82,-235r51,0r39,117v8,23,13,46,18,69r1,0v4,-23,10,-46,18,-69",
w: 218
},
W: {
d: "279,-235r46,0r-66,235r-48,0r-33,-118v-5,-16,-8,-33,-13,-75r-1,0v-5,42,-10,59,-14,75r-32,118r-49,0r-65,-235r50,0r30,117v5,18,9,37,12,73r0,0v4,-36,8,-55,13,-73r33,-117r48,0r33,117v5,18,10,37,13,73r1,0v3,-36,6,-55,11,-73",
w: 327
},
z: {
d: "15,-174r133,0r0,36r-79,98r0,0r86,0r0,40r-146,0r0,-36r80,-98r0,-1r-74,0r0,-39",
w: 165
},
y: {
d: "72,2r-68,-176r51,0r28,80v6,17,10,33,13,49r1,0v3,-16,8,-32,14,-49r28,-80r47,0r-66,174v-23,58,-46,77,-98,81r-5,-39v28,-2,43,-10,55,-40"
},
x: {
d: "177,-174r-57,83r63,91r-59,0r-33,-60r-1,0r-33,60r-54,0r60,-88r-59,-86r58,0r30,54r1,0r30,-54r54,0",
w: 186
},
w: {
d: "158,-70v-5,-17,-10,-34,-14,-62r0,0v-4,29,-9,45,-14,62r-22,70r-49,0r-55,-174r51,0r20,71v4,16,8,32,11,58r1,0v4,-26,7,-42,12,-58r22,-71r50,0r22,71v5,16,8,32,12,58r1,0v3,-26,6,-42,11,-58r20,-71r47,0r-55,174r-49,0",
w: 287
},
v: {
d: "139,-174r47,0r-66,174r-50,0r-66,-174r51,0r28,80v6,17,10,33,13,49r1,0v3,-16,8,-32,14,-49"
},
u: {
d: "138,-79r0,-95r48,0r0,174r-48,0r0,-22r-1,0v-13,16,-32,26,-56,26v-36,0,-60,-25,-60,-67r0,-111r48,0r0,104v0,23,10,34,29,34v26,0,40,-15,40,-43",
w: 209
},
t: {
d: "128,-174r0,39r-43,0r0,70v0,20,7,29,20,29v6,0,13,-1,20,-3r5,40v-13,2,-29,3,-43,3v-32,0,-51,-23,-51,-61r0,-78r-28,0r0,-39r28,0r0,-43r49,0r0,43r43,0",
w: 140
},
"{": {
d: "44,-108v24,8,37,23,33,49r-5,36v-3,21,9,27,31,27r0,31v-45,0,-74,-18,-68,-58r4,-34v3,-24,-7,-31,-29,-34r0,-31v22,-3,32,-11,29,-35r-4,-34v-6,-40,23,-57,68,-57r0,31v-22,0,-33,5,-30,26r5,36v4,26,-10,41,-34,47r0,0",
w: 112
},
"|": {
d: "66,90r-39,0r0,-360r39,0r0,360",
w: 92
},
"}": {
d: "69,-106v-24,-8,-37,-23,-33,-49r5,-36v3,-21,-9,-26,-31,-26r0,-31v45,0,74,17,68,57r-5,34v-3,24,8,32,30,35r0,31v-22,3,-33,10,-30,34r5,34v6,40,-23,58,-68,58r0,-31v22,0,33,-6,30,-27r-5,-36v-4,-26,10,-40,34,-46r0,-1",
w: 112
},
g: {
d: "148,-174r48,0r0,163v0,57,-39,92,-97,92v-24,0,-50,-4,-68,-12r6,-40v20,9,39,13,60,13v32,0,51,-19,51,-51r0,-13r-1,0v-13,15,-32,26,-54,26v-48,0,-80,-38,-80,-89v0,-55,35,-93,80,-93v22,0,41,10,54,25r1,0r0,-21xm148,-79r0,-16v0,-25,-17,-43,-42,-43v-23,0,-41,19,-41,51v0,31,15,51,41,51v25,0,42,-18,42,-43",
w: 220
},
h: {
d: "73,-153r1,0v13,-16,32,-25,56,-25v36,0,60,25,60,67r0,111r-48,0r0,-104v0,-23,-10,-34,-29,-34v-26,0,-40,15,-40,43r0,95r-48,0r0,-252r48,0r0,99",
w: 215
},
i: {
d: "25,0r0,-174r48,0r0,174r-48,0xm49,-185v-15,0,-27,-13,-27,-28v0,-15,12,-28,27,-28v15,0,28,13,28,28v0,15,-13,28,-28,28",
w: 98
},
k: {
d: "179,-174r-69,78r79,96r-62,0r-49,-66r0,0r-5,6r0,60r-48,0r0,-252r48,0r0,113v0,9,0,18,-1,30r1,0v5,-10,13,-23,18,-30r28,-35r60,0",
w: 188
},
j: {
d: "52,-186v-15,0,-28,-13,-28,-28v0,-15,13,-28,28,-28v15,0,28,13,28,28v0,15,-13,28,-28,28xm28,4r0,-178r48,0r0,174v0,50,-33,81,-83,81r-6,-39v24,0,41,-13,41,-38",
w: 101
},
n: {
d: "73,-95r0,95r-48,0r0,-174r48,0r0,21r1,0v13,-16,32,-25,56,-25v36,0,60,25,60,67r0,111r-48,0r0,-104v0,-23,-10,-34,-29,-34v-26,0,-40,15,-40,43",
w: 215
},
E: {
d: "72,-40r97,0r0,40r-146,0r0,-235r143,0r0,39r-94,0r0,55r81,0r0,39r-81,0r0,62",
w: 177
},
D: {
d: "23,-235v26,-2,56,-4,81,-4v84,0,127,48,127,115v0,76,-54,128,-127,128v-29,0,-57,-2,-81,-4r0,-235xm72,-198r0,161v10,1,21,1,32,1v48,0,76,-31,76,-85v0,-47,-21,-78,-76,-78v-9,0,-20,0,-32,1",
w: 243
},
C: {
d: "12,-117v0,-78,57,-122,125,-122v20,0,44,2,62,8r-5,40v-17,-5,-37,-8,-54,-8v-54,0,-76,35,-76,81v0,46,22,82,76,82v17,0,37,-3,54,-8r5,39v-18,6,-42,9,-62,9v-68,0,-125,-43,-125,-121",
w: 205
},
B: {
d: "143,-126v32,10,48,29,48,56v0,45,-39,74,-92,74v-21,0,-56,-2,-76,-4r0,-235v23,-2,56,-4,77,-4v50,0,83,22,83,58v0,25,-16,43,-40,55r0,0xm72,-198r0,58v9,1,18,1,30,1v19,0,29,-14,29,-31v0,-18,-8,-29,-34,-29v-14,0,-15,0,-25,1xm102,-36v24,0,37,-12,37,-32v0,-21,-12,-34,-37,-34v-12,0,-20,1,-30,2r0,63v11,1,18,1,30,1",
w: 203
},
"8": {
d: "133,-122v35,18,46,36,46,57v0,43,-41,69,-84,69v-43,0,-83,-21,-83,-63v0,-29,17,-45,47,-59r0,0v-26,-14,-38,-27,-38,-53v0,-28,27,-59,75,-59v48,0,76,27,76,55v0,23,-14,40,-39,52r0,1xm71,-170v0,14,9,22,28,32v16,-8,23,-18,23,-30v0,-13,-9,-22,-26,-22v-17,0,-25,11,-25,20xm95,-36v21,0,34,-13,34,-28v0,-18,-12,-30,-36,-40v-21,8,-31,19,-31,37v0,15,12,31,33,31",
w: 190
},
"7": {
d: "163,-226r0,38r-91,188r-49,0r90,-186r0,0r-107,0r0,-40r157,0",
w: 169
},
"6": {
d: "97,4v-45,0,-83,-35,-83,-96v0,-83,64,-133,141,-137r5,40v-47,5,-84,28,-92,60r1,0v10,-9,26,-13,40,-13v42,0,74,27,74,67v0,48,-40,79,-86,79xm96,-106v-16,0,-28,12,-28,29v0,26,12,42,31,42v17,0,31,-10,31,-33v0,-26,-12,-38,-34,-38",
w: 192
},
"5": {
d: "94,-150v45,0,76,28,76,69v0,49,-37,85,-102,85v-21,0,-43,-5,-57,-11r5,-39v18,8,37,10,59,10v26,0,43,-15,43,-38v0,-23,-12,-38,-36,-38v-6,0,-13,1,-19,4r-44,-3r5,-115r126,0r0,40r-83,0r-2,41r1,0v8,-3,18,-5,28,-5",
w: 185
},
"4": {
d: "162,-226r0,138r28,0r0,39r-28,0r0,49r-48,0r0,-49r-107,0r0,-40r89,-137r66,0xm114,-140v0,-13,0,-28,1,-42r-1,0v-6,16,-13,29,-21,42r-34,51r0,1r55,0r0,-52",
w: 200
},
"3": {
d: "65,4v-19,0,-40,-4,-55,-10r5,-40v19,7,35,10,55,10v24,0,41,-12,41,-29v0,-23,-15,-32,-59,-35r0,-39v31,-2,48,-10,48,-29v0,-13,-7,-22,-32,-22v-16,0,-31,5,-46,12r-6,-40v19,-9,43,-12,65,-12v46,0,73,22,73,49v0,27,-17,44,-49,55r0,1v35,10,56,27,56,57v0,47,-42,72,-96,72",
w: 175
},
"2": {
d: "166,-40r0,40r-158,0r0,-32r36,-40v60,-65,68,-79,68,-93v0,-15,-10,-25,-34,-25v-17,0,-34,5,-50,13r-5,-40v23,-8,47,-13,71,-13v43,0,70,21,70,55v0,31,-16,58,-56,100v-5,6,-21,21,-36,35r0,0r94,0",
w: 180
},
"0": {
d: "107,-230v54,0,93,48,93,117v0,69,-39,117,-93,117v-54,0,-93,-48,-93,-117v0,-69,39,-117,93,-117xm107,-36v26,0,43,-24,43,-77v0,-53,-17,-77,-43,-77v-26,0,-43,24,-43,77v0,53,17,77,43,77",
w: 213
},
"1": {
d: "115,-226r24,0r0,226r-48,0r0,-167r-40,15r-5,-40",
w: 190
},
"/": {
d: "108,-245r40,0r-110,258r-40,0",
w: 145
},
".": {
d: "45,-53v16,0,28,12,28,28v0,16,-12,29,-28,29v-16,0,-29,-13,-29,-29v0,-16,13,-28,29,-28",
w: 84
},
"-": {
d: "111,-108r0,31r-100,0r0,-31r100,0",
w: 121
},
",": {
d: "31,-32v2,-8,9,-13,22,-13r28,0v-10,29,-23,67,-37,100r-41,4v12,-34,23,-72,28,-91",
w: 92
},
"+": {
d: "127,-108r73,0r0,31r-73,0r0,77r-39,0r0,-77r-73,0r0,-31r73,0r0,-76r39,0r0,76",
w: 214
},
"*": {
d: "69,-235r39,0r-8,56r2,0r50,-24r13,37r-56,10r0,1r39,41r-32,23r-27,-49r-1,0r-27,49r-31,-23r38,-41r0,-1r-55,-10r12,-37r50,24r2,0",
w: 177
},
")": {
d: "32,-107v0,-54,-9,-99,-24,-141r31,0v17,33,34,83,34,141v0,58,-17,108,-34,141r-31,0v15,-42,24,-87,24,-141",
w: 93
},
"(": {
d: "62,-107v0,54,9,99,24,141r-31,0v-17,-33,-35,-83,-35,-141v0,-58,18,-108,35,-141r31,0v-15,42,-24,87,-24,141",
w: 93
},
"'": {
d: "53,-145r-33,0r-3,-94v0,-6,6,-7,15,-7r30,0",
w: 77
},
"&": {
d: "248,0r-64,0r-15,-17r-1,0v-19,17,-42,21,-73,21v-43,0,-83,-31,-83,-73v0,-36,13,-50,48,-70r0,0v-13,-13,-21,-26,-21,-44v0,-34,30,-56,65,-56v40,0,66,28,66,53v0,26,-12,40,-39,58r0,1r46,49r1,0v8,-14,10,-20,11,-43r45,0v-1,31,-9,55,-27,76xm104,-199v-8,0,-14,5,-14,14v0,10,7,20,13,27r1,0v10,-6,14,-14,14,-27v0,-9,-5,-14,-14,-14xm102,-36v16,0,27,-2,39,-10r0,-1r-52,-63r-1,0v-16,10,-25,19,-25,39v0,19,20,35,39,35",
w: 249
},
"%": {
d: "215,-233r33,0r-159,240r-32,0xm230,-119v34,0,61,25,61,61v0,36,-27,62,-61,62v-34,0,-61,-26,-61,-62v0,-36,27,-61,61,-61xm230,-27v11,0,19,-12,19,-31v0,-19,-8,-30,-19,-30v-11,0,-20,11,-20,30v0,19,9,31,20,31xm75,-230v34,0,61,26,61,62v0,36,-27,61,-61,61v-34,0,-61,-25,-61,-61v0,-36,27,-62,61,-62xm75,-138v11,0,19,-11,19,-30v0,-19,-8,-31,-19,-31v-11,0,-20,12,-20,31v0,19,9,30,20,30",
w: 304
},
$: {
d: "159,-70v0,33,-25,55,-58,61r0,36r-31,0r0,-35v-16,-1,-35,-3,-48,-8r5,-40v20,6,35,9,54,9v18,0,27,-7,27,-18v0,-13,-3,-19,-26,-30v-44,-22,-59,-37,-59,-67v0,-28,19,-49,50,-55r0,-36r31,0r0,34v15,1,33,4,43,9r-6,40v-15,-6,-30,-9,-48,-9v-11,0,-18,4,-18,13v0,12,5,16,28,28v48,24,56,40,56,68",
w: 182
},
"#": {
d: "187,-129r-37,0r-6,32r33,0r0,22r-38,0r-14,68r-28,0r14,-68r-38,0r-13,68r-28,0r13,-68r-32,0r0,-22r37,0r7,-32r-34,0r0,-23r38,0r14,-67r28,0r-14,67r38,0r13,-67r28,0r-13,67r32,0r0,23xm116,-97r6,-32r-37,0r-7,32r38,0",
w: 200
},
'"': {
d: "53,-145r-33,0r-3,-94v0,-6,6,-7,15,-7r30,0xm122,-145r-32,0r-4,-94v0,-6,7,-7,16,-7r30,0",
w: 147
},
"!": {
d: "73,-25v0,16,-12,29,-28,29v-16,0,-28,-13,-28,-29v0,-16,12,-28,28,-28v16,0,28,12,28,28xm65,-71r-40,0r-3,-164r46,0",
w: 90
},
L: {
d: "72,-40r113,0r0,40r-162,0r0,-235r49,0r0,195"
},
"\u00a0": {
w: 79
}
}
});

// ColorPicker.js

enyo.kind({
name: "DefaultColorsBox",
published: {
color: ""
},
events: {
onSelect: ""
},
components: [ {
classes: "onyx-groupbox",
ontap: "colorTapped",
components: [ {
name: "colorBox",
style: "height: 24px; border: 1px solid Black; margin: 5px;"
} ]
} ],
create: function() {
this.inherited(arguments), this.colorChanged();
},
setColor: function(e) {
this.color = e, this.colorChanged();
},
colorChanged: function() {
this.$.colorBox.applyStyle("background-color", "#" + this.color);
},
colorTapped: function() {
this.bubbleUp("onSelect", {
color: this.color,
opacity: this.opacity
});
}
}), enyo.kind({
name: "DefaultColorsBoxes",
events: {
onSelect: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
style: "width: 5%;"
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "000000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "222222",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "444444",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "666666",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "888888",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "AAAAAA",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "CCCCCC",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FFFFFF",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "220000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "440000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "880000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "BB0000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF0000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FE2E2E",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F78181",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F6CECE",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "002200",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "004400",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "008800",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "00BB00",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "00FF00",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "2EFF2E",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "81FF81",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "CEF6CE",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "000022",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "000044",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "000088",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "0000BB",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "0000FF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "2E2EFF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "8181FF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "CECEF6",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "220022",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "440044",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "880088",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "BB00BB",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF00FF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF2EFF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF81FF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F6CEF6",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "002222",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "004444",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "008888",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "00BBBB",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "00FFFF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "2EFFFF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "81FFFF",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "CEF6F6",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "222200",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "444400",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "888800",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "BBBB00",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FFFF00",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FFFF2E",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FFFF81",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F6F6CE",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "3B240B",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "61380B",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "B45F04",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF8000",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FE9A2E",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FAAC58",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F7BE81",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F5D0A9",
onSelect: "colorTapped"
} ]
}, {
kind: "FittableRows",
style: "width: 10%;",
components: [ {
kind: "DefaultColorsBox",
color: "3B0B17",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "610B21",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "8A0829",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "DF013A",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FF0040",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "FA5882",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F7819F",
onSelect: "colorTapped"
}, {
kind: "DefaultColorsBox",
color: "F5A9BC",
onSelect: "colorTapped"
} ]
}, {
style: "width: 5%;"
} ]
} ],
create: function() {
this.inherited(arguments);
},
colorTapped: function(e, t) {
this.bubbleUp("onSelect", {
color: e.color,
opacity: e.opacity
});
}
}), enyo.kind({
name: "ColorPicker",
kind: "Control",
published: {
red: "ff",
blue: "ff",
green: "ff",
opacity: "1",
color: ""
},
events: {
onColorPick: "",
onColorSlide: ""
},
components: [ {
kind: "DefaultColorsBoxes",
onSelect: "colorTapped"
}, {
kind: "onyx.Slider",
name: "redSlider",
barClasses: "red-progress-bar",
onChanging: "redSliding",
onChange: "redChanged",
style: "vertical-align:middle; height:10px;"
}, {
style: "height: 10px"
}, {
kind: "onyx.Slider",
name: "greenSlider",
barClasses: "green-progress-bar",
onChanging: "greenSliding",
onChange: "greenChanged",
style: "vertical-align:middle; height:10px;"
}, {
style: "height: 10px"
}, {
kind: "onyx.Slider",
name: "blueSlider",
barClasses: "blue-progress-bar",
onChanging: "blueSliding",
onChange: "blueChanged",
style: "vertical-align:middle; height:10px;"
}, {
style: "height: 10px"
}, {
kind: "onyx.Slider",
name: "opacitySlider",
barClasses: "opacity-progress-bar",
onChanging: "opacitySliding",
onChange: "opacityChanged",
style: "vertical-align:middle; height:10px;"
}, {
style: "height: 10px"
}, {
classes: "onyx-groupbox",
components: [ {
name: "colorBox",
ontap: "mainColorPicked",
style: "height: 32px; border: 1px solid Black; margin: 10px;"
} ]
} ],
create: function() {
this.inherited(arguments), this.updateColor(), this.updateProgresses();
},
colorTapped: function(e, t) {
var n = t.color;
this.red = n.substr(0, 2), this.green = n.substr(2, 2), this.blue = n.substr(4, 2), this.opacity = 1, this.updateProgresses(), this.updateColor(), this.doColorPick();
},
updateProgresses: function() {
var e = Math.floor(parseInt(this.red, 16) * 100 / 255), t = Math.floor(parseInt(this.blue, 16) * 100 / 255), n = Math.floor(parseInt(this.green, 16) * 100 / 255);
this.$.redSlider.setValue(e), this.$.greenSlider.setValue(n), this.$.blueSlider.setValue(t), this.$.opacitySlider.setValue(this.opacity || 1), (!this.$.opacitySlider.getValue() || this.$.opacitySlider.getValue() == "") && this.opacity + "" != "1" && this.$.opacitySlider.setValue(1);
},
mainColorPicked: function() {
color = this.color, console.log("color picked: " + this.color + " opacity: " + this.opacity), this.doColorPick();
},
updateColor: function() {
var e = "#" + (this.red + this.green + this.blue).toUpperCase();
this.$.colorBox.applyStyle("background-color", e), this.$.colorBox.applyStyle("opacity", this.opacity), this.color = e;
},
redChanged: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.red = r, this.updateColor();
},
greenChanged: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.green = r, this.updateColor();
},
blueChanged: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.blue = r, this.updateColor();
},
opacityChanged: function(e, t) {
var n = t.value / 100;
this.opacity = n, this.updateColor();
},
redSliding: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.red = r, this.updateColor(), this.doColorSlide(), this.render();
},
greenSliding: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.green = r, this.updateColor(), this.doColorSlide(), this.render();
},
blueSliding: function(e, t) {
var n = Math.floor(t.value * 255 / 100), r = n.toString(16);
r.length == 1 && (r = "0" + r), this.blue = r, this.updateColor(), this.doColorSlide(), this.render();
},
opacitySliding: function(e, t) {
var n = t.value / 100;
this.opacity = n, this.updateColor(), this.doColorSlide(), this.render();
}
});

// windows.js

enyo.windows = {
openWindow: function(e, t, n, r, i) {
var s = r || {};
s.window = s.window || "card";
var o = this.getRootWindow(), u = this.fetchWindow(t);
if (u) console.warn('Window "' + t + '" already exists, activating it'), this.activateWindow(u, n); else {
if (n) {
var a = enyo.fetchAppRootPath();
if (e[0] === "/" && e.indexOf(a.slice(7)) !== 0 || e.indexOf("file:///") === 0 && e.indexOf(a) !== 0) e = e + "?enyoWindowParams=" + encodeURIComponent(enyo.json.stringify(n));
}
u = this.agent.open(o, e, t || "", s, i), this.finishOpenWindow(u, n), this.manager.setPendingParamsList(u, []);
}
return u;
},
finishOpenWindow: function(e, t) {
e.name = enyo.windows.ensureUniqueWindowName(e, e.name), this.assignWindowParams(e, t), this.manager.addWindow(e);
},
ensureUniqueWindowName: function(e, t) {
var n = this.getWindows(), r = n[t];
return this.agent.isValidWindowName(t) && (!r || r == e) ? t : this.calcUniqueWindowName();
},
calcUniqueWindowName: function() {
var e = this.getWindows(), t = "window";
for (var n = 1, r; Boolean(e[r = t + (n > 1 ? String(n) : "")]); n++) ;
return r;
},
openDashboard: function(e, t, n, r) {
return r = r || {}, r.window = "dashboard", this.openWindow(e, t, n, r);
},
openPopup: function(e, t, n, r, i, s) {
r = r || {}, r.window = "popupalert";
var o = this.openWindow(e, t, n, r, "height=" + (i || 200));
return s && o.PalmSystem && o.PalmSystem.addNewContentIndicator(), o;
},
activate: function(e, t, n, r, i) {
var s = this.fetchWindow(t);
return s ? this.activateWindow(s, n) : e && (s = this.openWindow(e, t, n, r, i)), s;
},
activateWindow: function(e, t) {
this.agent.activate(e), t && this.setWindowParams(e, t);
},
deactivate: function(e) {
var t = this.fetchWindow(e);
this.deactivateWindow(t);
},
deactivateWindow: function(e) {
e && this.agent.deactivate(e);
},
addBannerMessage: function(e, t, n, r, i, s) {
return this.agent.addBannerMessage.apply(this.agent, arguments);
},
removeBannerMessage: function(e) {
this.agent.removeBannerMessage.apply(this.agent, arguments);
},
setWindowProperties: function(e, t) {
this.agent.setWindowProperties.apply(this.agent, arguments);
},
setWindowParams: function(e, t) {
var n = this.manager.getPendingParamsList(e);
n ? n.push(t) : e.postMessage("enyoWindowParams=" + enyo.json.stringify(t), "*");
},
assignWindowParams: function(e, t) {
var n;
try {
n = t && enyo.isString(t) ? enyo.json.parse(t) : t || {};
} catch (r) {
console.error("Invalid window params: " + r), n = {};
}
e.enyo = e.enyo || {}, e.enyo.windowParams = n || {};
},
fetchWindow: function(e) {
return this.manager.fetchWindow(e);
},
getRootWindow: function() {
return this.manager.getRootWindow();
},
getWindows: function() {
return this.manager.getWindows();
},
getActiveWindow: function() {
return this.manager.getActiveWindow();
},
renameWindow: function(e, t) {
var n = this.manager.getPendingParamsList(e);
return this.manager.removeWindow(e), e.name = enyo.windows.ensureUniqueWindowName(e, t), this.manager.addWindow(e), this.manager.setPendingParamsList(e, n), e.name;
}
};

// agent.js

enyo.windows.agent = {
open: function(e, t, n, r, i) {
var s = enyo.makeAbsoluteUrl(window, t), o = r && enyo.isString(r) ? r : enyo.json.stringify(r), o = "attributes=" + o, u = i ? i + ", " : "";
return e.open(s, n, u + o);
},
activate: function(e) {
e.PalmSystem && e.PalmSystem.activate();
},
deactivate: function(e) {
e.PalmSystem && e.PalmSystem.deactivate();
},
addBannerMessage: function() {
return window.PalmSystem.addBannerMessage.apply(PalmSystem, arguments);
},
removeBannerMessage: function(e) {
window.PalmSystem.removeBannerMessage.apply(PalmSystem, arguments);
},
setWindowProperties: function(e, t) {
e.PalmSystem.setWindowProperties(t);
},
isValidWindow: function(e) {
return Boolean(e && e.closed === !1);
},
isValidWindowName: function(e) {
return e;
}
};

// events.js

enyo.windows.events = {
dispatchEvent: function(e, t) {
e.enyo.dispatcher.rootHandler.broadcastEvent(t);
},
handleAppMenu: function(e) {
var t = enyo.windows.getActiveWindow();
if (t && e["palm-command"] == "open-app-menu" && t.enyo) return t.enyo.appMenu.toggle(), !0;
},
handleActivated: function() {
this.dispatchEvent(window, {
type: "windowActivated"
});
},
handleDeactivated: function() {
this.dispatchEvent(window, {
type: "windowDeactivated"
});
},
handleWindowHidden: function() {
this.dispatchEvent(window, {
type: "windowHidden"
});
},
handleWindowShown: function() {
this.dispatchEvent(window, {
type: "windowShown"
});
},
handleRelaunch: function() {
var e = enyo.windows.getRootWindow(), t = PalmSystem.launchParams;
try {
t = t && enyo.json.parse(t);
} catch (n) {
console.error("Invalid launch params: " + n), t = {};
}
return this.handleAppMenu(t) ? !0 : (enyo.windows.assignWindowParams(e, t), enyo.windows.setWindowParams(e, t), this.dispatchApplicationRelaunch(e));
},
dispatchWindowParamsChange: function(e) {
var t = e.enyo.windowParams, n = "windowParamsChange", r = n + "Handler";
this.dispatchEvent(e, {
type: n,
params: t
}), enyo.call(e.enyo, r, [ t ]);
},
dispatchApplicationRelaunch: function(e) {
var t = e.enyo.windowParams, n = "applicationRelaunch", r = n + "Handler", i = {
type: n,
params: t
};
this.dispatchEvent(e, i);
var s = enyo.call(e.enyo, r, [ t ]), o = enyo.call(enyo.application, r, [ t ]);
return Boolean(i.handler || s || o);
}
}, enyo.requiresWindow(function() {
Mojo = window.Mojo || {}, Mojo.stageActivated = function() {
enyo.windows.events.handleActivated();
}, Mojo.stageDeactivated = function() {
enyo.windows.events.handleDeactivated();
}, Mojo.hide = function() {
enyo.windows.events.handleWindowHidden();
}, Mojo.show = function() {
enyo.windows.events.handleWindowShown();
}, Mojo.relaunch = function() {
return enyo.windows.events.handleRelaunch();
};
});

// manager.js

enyo.windows.manager = {
getRootWindow: function() {
var e = window.opener || window.rootWindow || window.top || window;
return e.setTimeout || (e = window), e;
},
getWindows: function() {
var e = this.getRootWindow(), t = e.enyo.windows.manager, n = t._windowList, r = {};
for (var i in n) this.isValidWindow(n[i]) && (r[i] = n[i]);
return t._windowList = r, r;
},
getWindowName: function(e) {
if (e.name) return e.name;
var t = this.getRootWindow().enyo.windows.manager._windowList, n = Object.keys(t);
for (var r = 0; r < n.length; r++) if (t[n[r]] === e) return n[r];
return undefined;
},
_windowList: {},
_pendingWindowParams: {},
getPendingParamsList: function(e) {
var t = this.getRootWindow().enyo.windows.manager;
return t._pendingWindowParams[e.name];
},
setPendingParamsList: function(e, t) {
var n = this.getRootWindow().enyo.windows.manager;
n._pendingWindowParams[e.name] = t;
return;
},
executePendingWindowParams: function(e) {
var t = this.getWindowName(e), n = this.getRootWindow().enyo.windows.manager, r = n._pendingWindowParams[t];
delete n._pendingWindowParams[t], r || console.warn("WARNING: Executing pending window params, but no params list found.");
while (r && r.length) enyo.windows.setWindowParams(e, r.shift());
},
isValidWindow: function(e) {
return enyo.windows.agent.isValidWindow(e);
},
addWindow: function(e) {
var t = this.getWindows();
t[e.name] = e;
},
removeWindow: function(e) {
var t = this.getWindows();
delete t[e.name];
},
fetchWindow: function(e) {
var t = this.getWindows();
return t[e];
},
getActiveWindow: function() {
var e = this.getWindows(), t;
for (var n in e) {
t = e[n];
if (t.PalmSystem && t.PalmSystem.isActivated) return t;
}
},
resetRootWindow: function(e) {
var t = this.getWindows(), n, r = this.findRootableWindow(t);
if (r) {
this.transferRootToWindow(r, e);
for (var i in t) n = t[i], n.rootWindow = n == r ? null : r, this.setupApplication(n);
}
},
findRootableWindow: function(e) {
var t;
for (var n in e) {
t = e[n];
if (t.enyo && t.enyo.windows) return e[n];
}
},
setupApplication: function(e) {
var t = e.enyo;
t && (t.application = (t.windows.getRootWindow().enyo || t).application || {});
},
transferRootToWindow: function(e, t) {
var n = e.enyo.windows.manager, r = t.enyo.windows.manager;
n._windowList = enyo.clone(r._windowList), n._activeWindow = r._activeWindow;
},
addUnloadListener: function() {
window.addEventListener("unload", enyo.bind(this, function() {
this.removeWindow(window), this.getRootWindow() == window && this.resetRootWindow(window);
}), !1);
},
addLoadListener: function() {
window.addEventListener("load", function() {
enyo.windows.events.dispatchWindowParamsChange(window);
}, !1);
},
addMessageListener: function() {
var e = this;
window.addEventListener("message", function(t) {
var n = "enyoWindowParams=";
t.data.indexOf(n) === 0 ? (enyo.windows.assignWindowParams(window, t.data.slice(n.length)), enyo.windows.events.dispatchWindowParamsChange(window)) : t.data === "enyoWindowReady" && e.executePendingWindowParams(t.source);
}, !1);
}
}, enyo.requiresWindow(function() {
var e = enyo.windowParams || window.PalmSystem && PalmSystem.launchParams;
!e && enyo.args.enyoWindowParams && (e = decodeURIComponent(enyo.args.enyoWindowParams)), enyo.windows.finishOpenWindow(window, e);
var t = enyo.windows.manager;
t.addUnloadListener(), t.addLoadListener(), t.addMessageListener(), (window.opener || window.parent).postMessage("enyoWindowReady", "*"), t.setupApplication(window);
});

// browserAgent.js

enyo.windows.browserAgent = {
open: function(e, t, n, r, i) {
var s = enyo.makeAbsoluteUrl(window, t), o = e.document, u = o.createElement("iframe");
u.src = s, u._enyoWrapperIframe = !0, u.setAttribute("frameborder", 0);
var a = (i || "").match(/height=(.*)($|,)/), f = a && a[1] || r.window == "dashboard" && 96;
f ? u.style.cssText = "position:absolute; left: 0; right: 0; bottom: 0px; height: " + f + "px; width:100%" : u.style.cssText = "position:absolute; left: 0; right: 0; width:100%;height:100%;", o.body.appendChild(u);
var l = u.contentWindow;
return l.name = n, l.close = function() {
this.frameElement.parentNode.removeChild(this.frameElement);
}, l;
},
activate: function(e) {
var t = enyo.windows.getWindows(), n;
for (var r in t) n = t[r].frameElement, n && n._enyoWrapperIframe && (n.style.display = e.name == r ? "" : "none");
e.enyo.windows.events.handleActivated();
},
deactivate: function(e) {
var t = e.frameElement;
t && (t.style.zIndex = -1), e.enyo.windows.events.handleDeactivated();
},
addBannerMessage: function() {
console.log("addBannerMessage", arguments);
},
removeBanner: function() {
console.log("removeBanner");
},
isValidWindow: function(e) {
return Boolean(e && !e.closed);
},
isValidWindowName: function(e) {
return e && e.charAt(0) != "<";
},
asyncActivate: function() {
enyo.asyncMethod(enyo.windows, "activateWindow", window);
}
}, enyo.requiresWindow(function() {
window.PalmSystem || (enyo.dispatcher.features.push(function(e) {
e.type == "keydown" && e.ctrlKey && e.keyCode == 192 && enyo.appMenu.toggle();
}), enyo.mixin(enyo.windows.agent, enyo.windows.browserAgent), window.addEventListener("unload", function() {
enyo.windows.events.handleDeactivated();
var e = window.parent;
e.enyo.windows.agent.asyncActivate();
}, !1), window.addEventListener("load", function() {
enyo.windows.activateWindow(window);
}));
});

// ApplicationEvents.js

enyo.kind({
name: "enyo.ApplicationEvents",
kind: enyo.Component,
events: {
onLoad: "",
onUnload: "",
onError: "",
onWindowActivated: "",
onWindowDeactivated: "",
onWindowParamsChange: "",
onApplicationRelaunch: "",
onWindowRotated: "",
onOpenAppMenu: "",
onCloseAppMenu: "",
onWindowHidden: "",
onWindowShown: "",
onKeyup: "",
onKeydown: "",
onKeypress: "",
onBack: "",
onKeyboardShown: ""
},
create: function() {
this.inherited(arguments), enyo.dispatcher.rootHandler.addListener(this), window.addEventListener("unload", this.dispatchDomEvent.bind(this)), window.addEventListener("load", this.dispatchDomEvent.bind(this)), window.addEventListener("resize", this.dispatchDomEvent.bind(this)), window.addEventListener("message", this.dispatchDomEvent.bind(this));
},
destroy: function() {
enyo.dispatcher.rootHandler.removeListener(this), this.inherited(arguments);
},
dispatchDomEvent: function(e) {
return this.bubble("on" + enyo.cap(e.type), arguments);
}
}), enyo.dispatcher.rootHandler = {
requiresDomMousedown: !0,
listeners: [],
addListener: function(e) {
this.listeners.push(e);
},
removeListener: function(e) {
enyo.remove(e, this.listeners);
},
dispatchDomEvent: function(e) {
if (e.type == "resize") {
this.broadcastMessage("resize");
return;
}
return (e.type == "windowDeactivated" || e.type == "windowHidden") && this.broadcastMessage("autoHide"), this.broadcastEvent(e);
},
broadcastMessage: function(e) {
for (var t in enyo.master.$) enyo.master.$[t].broadcastMessage(e);
},
broadcastEvent: function(e) {
var t = !1;
for (var n = 0, r; r = this.listeners[n]; n++) t = r.dispatchDomEvent(e) || t;
return t;
},
isDescendantOf: function() {
return !1;
}
};

// CrossAppUI.js

enyo.kind({
name: "enyo.CrossAppUI",
tag: "Iframe",
published: {
app: "",
path: "",
params: null
},
events: {
onResult: ""
},
getAppPath: new enyo.webOS.ServiceRequest({
service: "palm://com.palm.applicationManager/",
method: "getAppBasePath"
}),
classes: "enyo-iframe enyo-view",
create: function() {
this.inherited(arguments), this.params = this.params || {}, this.appPath = "", this.checkLoadHitched = enyo.bind(this, "checkLoad"), this.handleMessageHitched = enyo.bind(this, "handleMessage"), window.addEventListener("message", this.handleMessageHitched);
},
destroy: function() {
window.removeEventListener("message", this.handleMessageHitched), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.app ? this.appChanged() : this.path && this.pathChanged();
},
appChanged: function() {
this.appPath = "", this.app ? (this.$.getAppPath.go({
appId: this.app
}), this.getAppPath.response(this.gotAppInfo)) : this.pathChanged();
},
gotAppInfo: function(e, t) {
if (!t || !t.returnValue) {
this.error("Could not get app path: " + (t && t.errorText));
return;
}
this.appPath = t.basePath, this.appPath = this.appPath || "", this.appPath && (this.appPath = this.appPath.slice(0, this.appPath.lastIndexOf("/") + 1), this.pathChanged());
},
pathChanged: function() {
this.log("crossappui path changed...");
var e = "";
this.path && (this.appPath ? e = this.appPath + this.path : this.app || (e = this.path), e && (this.log("CrossAppUI: Loading cross-app UI at " + e), e = e + "?enyoWindowParams=" + encodeURIComponent(enyo.json.stringify(this.params)), this._checkLoadTimerId || (this._checkLoadTimerId = window.setTimeout(this.checkLoadHitched, 1e3)))), this.setAttribute("src", e);
},
checkLoad: function() {
var e = this.node, t = e && e.contentDocument;
this._checkLoadTimerId = undefined, t && t.readyState === "complete" && t.location.href === "about:blank" && this.path ? (console.log("CrossAppUI: checkLoad: Kicking iframe."), this.pathChanged()) : this.log("CrossAppUI: checkLoad: things look okay.");
},
paramsChanged: function() {
this.path && this.node && this.node.contentWindow && enyo.windows.setWindowParams(this.node.contentWindow, this.params);
},
handleMessage: function(e) {
var t = "enyoCrossAppResult=";
e.source === (this.node && this.node.contentWindow) && e.data.indexOf(t) === 0 && this.doResult(enyo.json.parse(e.data.slice(t.length)));
}
});

// Dashboard.js

enyo.kind({
name: "enyo.Dashboard",
kind: enyo.Component,
published: {
layers: null,
smallIcon: ""
},
events: {
onIconTap: "",
onMessageTap: "",
onTap: "",
onUserClose: "",
onLayerSwipe: "",
onDashboardActivated: "",
onDashboardDeactivated: ""
},
components: [ {
kind: "ApplicationEvents",
onUnload: "destroy"
} ],
indexPath: "/usr/palm/frameworks/enyo/1.0/framework/source/palm/system/dashboard-window/dashboard.html",
create: function() {
this.inherited(arguments), this.layers = [], this.dashboardId = Math.random(), this.handleMessageHitched = enyo.bind(this, "handleMessage"), window.addEventListener("message", this.handleMessageHitched);
},
destroy: function() {
this.layers.length = 0, this.updateWindow(), window.removeEventListener("message", this.handleMessageHitched), this.inherited(arguments);
},
push: function(e) {
e && (this.layers.push(e), this.updateWindow());
},
pop: function() {
var e = this.layers.pop();
return this.updateWindow(), e;
},
setLayers: function(e) {
this.layers = e.slice(0), this.updateWindow();
},
updateWindow: function() {
var e = this.window && this.window.closed === !1;
if (this.layers.length) {
var t = {
layers: this.layers,
docPath: document.location.pathname,
dashboardId: this.dashboardId
};
if (!e) {
var n = {
webosDragMode: "manual"
};
this.smallIcon && (n.icon = this.smallIcon), this.window = enyo.windows.openDashboard(enyo.path.rewrite(this.indexPath), this.name, t, n);
} else enyo.windows.activate(undefined, this.name, t);
} else e && this.window.close(), this.window = undefined;
},
handleMessage: function(e) {
if (!this.window) return;
var t = e.source === this.window || e.source === undefined && this.window.closed !== !1;
if (!t) return;
var n = "enyoDashboardEvent=";
if (e.data.indexOf(n) !== 0) return;
var r = enyo.json.parse(e.data.slice(n.length));
if (r.dashboardId !== this.dashboardId || !r.event || r.event.indexOf("do") !== 0 || !this[r.event]) return;
switch (r.event) {
case "doLayerSwipe":
this.layers.pop(), this.doLayerSwipe.apply(this, r.args);
break;
case "doUserClose":
this.layers.length = 0, this.window = undefined, this.doUserClose();
break;
default:
this[r.event].apply(this, r.args);
}
}
});

// FilePicker.js

enyo.kind({
name: "enyo.FilePicker",
kind: "onyx.Popup",
classes: "onyx-popup enyo-filepicker",
published: {
fileType: undefined,
previewLabel: undefined,
extensions: undefined,
allowMultiSelect: !1,
currentRingtonePath: undefined,
cropWidth: undefined,
cropHeight: undefined
},
events: {
onPickFile: ""
},
dismissWithClick: !1,
modal: !0,
scrim: !0,
centered: !0,
showOnTop: !0,
floating: !0,
filePickerPath: "/usr/lib/luna/system/luna-systemui/app/FilePicker/filepicker.html",
components: [ {
classes: "enyo-filepiecker-container",
components: [ {
name: "crossapp",
kind: "CrossAppUI",
onResult: "handleResult"
} ]
} ],
pickFile: function() {
this.updateParams(), this.$.crossapp.setPath(this.filePickerPath), this.show();
},
updateParams: function() {
var e = {}, t = this;
Object.keys(this.published).forEach(function(n) {
t[n] !== undefined && (e[n] = t[n]);
}), this.fileType && !enyo.isString(this.fileType) && (e.fileTypes = this.fileType, e.fileType = undefined), this.$.crossapp.setParams(e);
},
handleResult: function(e, t) {
this.$.crossapp.setPath(""), t.result && this.doPickFile(t.result), this.hide();
}
});

// keyboard.js

enyo.getModalBounds = function() {
return enyo.keyboard.modalBounds || {
width: window.innerWidth,
height: window.innerHeight - enyo.keyboard.height
};
}, enyo.keyboard = {
height: 0,
events: {
resize: 1,
focus: 1,
keydown: 1,
keyboardShown: 1
},
resizesWindow: !0,
positiveSpaceChanged: function(e, t) {
enyo.keyboard.modalBounds = {
width: e,
height: t
}, enyo.dispatch({
type: "resize"
}), this.scrollIntoView();
},
scrollIntoView: function() {
enyo.job("enyo.keyboard.scrollIntoView", enyo.bind(enyo.keyboard, "_scrollIntoView"), 100);
},
_scrollIntoView: function() {
var e = this.findFocusedScroller();
if (e) {
this.scroller = e;
var t = this.getCaretPosition();
enyo.call(e, "scrollOffsetIntoView", [ t.y, t.x, t.height ]);
}
},
resetScroller: function() {
this.scroller && (this.scroller.stabilize(), this.scroller = null);
},
findFocusedScroller: function() {
var e = document.activeElement, t;
while (e) {
t = enyo.$[e.id];
if (typeof t == "function" && t instanceof enyo.DragScroller) return t;
e = e.parentNode;
}
},
getFocusedControl: function() {
return enyo.dispatcher.findDispatchTarget(document.activeElement);
},
getCaretPosition: function() {
if (window.caretRect) {
var e = window.caretRect();
if (e.x !== 0 || e.y !== 0) return e;
e = this.getControlCaretPosition();
if (e) return e;
}
return this.getSimulatedCaretPosition();
},
getControlCaretPosition: function() {
var e = this.getFocusedControl();
if (e && e.caretRect) return e.caretRect;
},
getSimulatedCaretPosition: function() {
var e = this.getFocusedControl(), t = {
x: 0,
y: 0,
height: 20,
width: 0
};
if (e) {
var n = e.getOffset();
t.x = n.left, t.y = n.top;
}
return t;
},
resize: function() {
enyo.keyboard.scrollIntoView();
},
focus: function() {
enyo.keyboard.scrollIntoView();
},
keydown: function(e) {
e.keyCode != 9 && enyo.keyboard.scrollIntoView();
},
keyboardShown: function(e) {
e.showing || enyo.asyncMethod(enyo.keyboard, "resetScroller");
}
}, enyo.keyboard.setResizesWindow = function(e) {}, enyo.keyboard.setManualMode = function(e) {}, enyo.keyboard.suspend = function() {}, enyo.keyboard.resume = function() {}, enyo.keyboard.show = function(e) {}, enyo.keyboard.typeText = 0, enyo.keyboard.typePassword = 1, enyo.keyboard.typeSearch = 2, enyo.keyboard.typeRange = 3, enyo.keyboard.typeEmail = 4, enyo.keyboard.typeNumber = 5, enyo.keyboard.typePhone = 6, enyo.keyboard.typeURL = 7, enyo.keyboard.typeColor = 8, enyo.keyboard.hide = function() {}, enyo.keyboard.forceShow = function(e) {}, enyo.keyboard.forceHide = function() {}, enyo.keyboard.isShowing = function() {}, enyo.keyboard.isManualMode = function() {}, enyo.keyboard.warnManual = function() {
enyo.warn("Cannot show or hide keyboard when not in manual mode; call enyo.keyboard.setManualMode(true)");
}, enyo.requiresWindow(function() {
Mojo = window.Mojo || {}, Mojo.positiveSpaceChanged = function(e, t) {
e !== 0 && t !== 0 && enyo.keyboard.positiveSpaceChanged(e, t);
}, Mojo.keyboardShown = function(e) {
enyo.keyboard._isShowing = e, enyo.dispatch({
type: "keyboardShown",
showing: e
});
}, enyo.dispatcher.features.push(function(e) {
if (enyo.keyboard.events[e.type]) return enyo.keyboard[e.type](e);
}), window.PalmSystem && PalmSystem.setManualKeyboardEnabled && (enyo.keyboard.setResizesWindow = function(e) {
this.resizesWindow = e, this.resizesWindow && (enyo.keyboard.modalBounds = null), PalmSystem.allowResizeOnPositiveSpaceChange ? PalmSystem.allowResizeOnPositiveSpaceChange(e) : console.log("Keyboard resizing cannot be changed.");
}, enyo.keyboard.setManualMode = function(e) {
enyo.keyboard._manual = e, PalmSystem.setManualKeyboardEnabled(e);
}, enyo.keyboard.isManualMode = function() {
return enyo.keyboard._manual;
}, enyo.keyboard.suspend = function() {
enyo.keyboard.isManualMode() && enyo.warn("Keyboard suspended when in manual mode"), PalmSystem.setManualKeyboardEnabled(!0);
}, enyo.keyboard.resume = function() {
enyo.keyboard.isManualMode() || enyo.keyboard.setManualMode(!1);
}, enyo.keyboard.show = function(e) {
enyo.keyboard.isManualMode() ? PalmSystem.keyboardShow(e || 0) : enyo.keyboard.warnManual();
}, enyo.keyboard.hide = function() {
enyo.keyboard.isManualMode() ? PalmSystem.keyboardHide() : enyo.keyboard.warnManual();
}, enyo.keyboard.forceShow = function(e) {
enyo.keyboard.setManualMode(!0), PalmSystem.keyboardShow(e || 0);
}, enyo.keyboard.forceHide = function() {
enyo.keyboard.setManualMode(!0), PalmSystem.keyboardHide();
}, enyo.keyboard.isShowing = function() {
return enyo.keyboard._isShowing;
});
});

// system.js

enyo.makeAbsoluteUrl = function(e, t) {
var n = new RegExp("^([a-z]+:/)?/");
if (n.test(t)) return t;
var r = e.location.href.split("/");
return r.pop(), r.push(t), r.join("/");
}, enyo.fittingClassName = "enyo-fit", enyo.fetchConfigFile = function(e) {
if (e) {
var t = enyo.windows.getRootWindow();
e = enyo.makeAbsoluteUrl(t, enyo.path.rewrite(e));
if (window.PalmSystem) return palmGetResource(e, "const json");
if (t.enyo) {
var n = t.enyo.xhr.request({
url: e,
sync: !0
});
if (n.status != 404 && n.status != -1100 && n.responseText !== "") try {
return enyo.json.parse(n.responseText);
} catch (r) {
enyo.warn("Could not parse", e, r);
}
}
}
}, enyo.logTimers = function(e) {
var t = e ? " (" + e + ")" : "";
console.log("*** Timers " + t + " ***");
var n = enyo.time.timed;
for (var r in n) console.log(r + ": " + n[r] + "ms");
console.log("***************");
}, enyo.setAllowedOrientation = function(e) {
enyo._allowedOrientation = e, window.PalmSystem && PalmSystem.setWindowOrientation(e);
}, enyo.getWindowOrientation = function() {
if (window.PalmSystem) return PalmSystem.screenOrientation;
}, enyo.sendOrientationChange = function() {
var e = enyo.getWindowOrientation();
e != enyo.lastWindowOrientation && enyo.dispatch({
type: "windowRotated",
orientation: e
}), enyo.lastWindowOrientation = e;
}, enyo.setFullScreen = function(e) {
window.PalmSystem && window.PalmSystem.enableFullScreenMode(e);
}, enyo.ready = function() {
window.PalmSystem && (setTimeout(function() {
PalmSystem.stageReady();
}, 1), enyo.setAllowedOrientation(enyo._allowedOrientation ? enyo._allowedOrientation : "free"));
}, enyo.fetchAppId = function() {
if (window.PalmSystem) return PalmSystem.identifier.split(" ")[0];
}, enyo.fetchAppRootPath = function() {
var e = enyo.windows.getRootWindow(), t = e.document, n = t.baseURI.match(new RegExp(".*://[^#]*/"));
if (n) return n[0];
}, enyo.fetchAppInfo = function() {
return enyo.fetchConfigFile("appinfo.json");
}, enyo.fetchFrameworkConfig = function() {
return enyo.fetchConfigFile("framework_config.json");
}, enyo.fetchRootFrameworkConfig = function() {
return enyo.fetchConfigFile("$enyo/../framework_config.json");
}, enyo.fetchDeviceInfo = function() {
return window.PalmSystem ? JSON.parse(PalmSystem.deviceInfo) : undefined;
}, enyo.requiresWindow(function() {
window.addEventListener("load", enyo.ready, !1), window.addEventListener("resize", enyo.sendOrientationChange, !1), Mojo = window.Mojo || {}, Mojo.lowMemoryNotification = function(e) {
enyo.dispatch({
type: "lowMemory",
state: e.state
});
};
});

// setuplogging.js

(function() {
setupLoggingLevel = function() {
var e = enyo.fetchRootFrameworkConfig();
e && enyo.setLogLevel(e.logLevel);
var t = enyo.fetchFrameworkConfig();
t && enyo.setLogLevel(t.logLevel);
var n = enyo.fetchAppInfo();
n && enyo.setLogLevel(n.logLevel);
}, setupLoggingLevel();
})();

// Neo.js

enyo.kind({
name: "Neo",
kind: "FittableRows",
classes: "neo enyo-fit onyx onyx-dark",
fit: !0,
published: {
isRendered: !1,
onRendered: [],
twit: new SpazTwit,
dashWin: null
},
components: [ {
name: "cover",
kind: "fx.Fader"
}, {
kind: "enyo.Signals",
setFullscreen: "setFullscreen",
onDeFocus: "deFocus"
}, {
kind: "Neo.BlackBerryExtention"
}, {
kind: "ApplicationEvents",
onApplicationRelaunch: "relaunchHandler",
onWindowActivated: "windowActivated",
onWindowDeactivated: "windowDeactivated",
onUnload: "unloaded"
}, {
name: "main",
kind: "Panels",
layoutKind: "FittableColumnsLayout",
arrangerKind: "CollapsingArranger",
classes: "enyo-fit",
narrowFit: !1,
components: [ {
name: "sidebar",
kind: "Neo.Sidebar",
onAccountAdded: "accountAdded",
onAccountRemoved: "accountRemoved"
}, {
name: "container",
kind: "Neo.Container",
onRefreshAllFinished: "refreshAllFinished",
style: "min-width: 350px;"
} ]
}, {
name: "imageViewPopup",
kind: "Neo.ImageViewPopup",
onClose: "closeImageView"
}, {
name: "dashboard",
kind: "Dashboard",
onTap: "dashboardTap",
onIconTap: "iconTap",
onMessageTap: "messageTap",
onUserClose: "dashboardClose",
onLayerSwipe: "layerSwiped",
appId: null
} ],
create: function() {
var e = this, t = arguments;
enyo.keyboard.setResizesWindow(!1), this.initAppObject(function() {
e.inherited(t);
}), this.bindGlobalListeners(), AppUI.addFunction("confirmDeleteTweet", function(e) {
this.confirmDeleteTweet(this, e);
}, this), AppUI.addFunction("deleteTweet", function(e) {
this.deleteTweet(this, e);
}, this), AppUI.addFunction("startAutoRefresher", function() {
App.Prefs.get("network-refreshinterval") > 0 && (enyo.log("Starting auto-refresher", App.Prefs.get("network-refreshinterval")), App._refresher = setInterval(function() {
enyo.log("Auto-refreshing"), AppUI.refresh();
}, App.Prefs.get("network-refreshinterval")));
}, this), AppUI.addFunction("stopAutoRefresher", function() {
enyo.log("Clearing auto-refresher"), clearInterval(App._refresher);
}, this), AppUI.addFunction("restartAutoRefresher", function() {
enyo.log("Restarting auto-refresher"), AppUI.stopAutoRefresher(), AppUI.startAutoRefresher();
}, this), AppUI.startAutoRefresher(), this.processLaunchParams(enyo.windowParams), this.$.dashboard.appId = enyo.fetchAppInfo().id, AppUtils.showTestBuildWarning(), this.initFilters(), this.reflow();
},
windowParamsChangeHandler: function(e) {
AppUtils.showBanner("windowParamsChangeHandler: " + JSON.stringify(enyo.windowParams)), AppUtils.showBanner("windowParamsChangeHandler inParams: " + JSON.stringify(e));
var t = enyo.windowParams;
},
relaunchHandler: function(e, t) {
this.processLaunchParams(enyo.windowParams), this.$.dashboard.setLayers([]), t.source == "banner" && this.dashToColumn(t.text);
},
windowActivated: function() {
this.windowActive = !0, this.$.dashboard.setLayers([]), App.Prefs.get("hide-when-minimized") && this.$.cover.hide(), this.reflow();
},
windowDeactivated: function() {
this.windowActive = !1, App.Prefs.get("hide-when-minimized") && this.$.cover.show(), this.reflow();
},
unloaded: function() {
this.$.dashboard.setLayers([]), this.$.container.saveColumnData();
},
initAppObject: function(e) {
var t = this;
window.App = {}, SPAZCORE_CONSUMERKEY_TWITTER ? SpazAuth.addService(SPAZCORE_ACCOUNT_TWITTER, {
authType: SPAZCORE_AUTHTYPE_OAUTH,
consumerKey: SPAZCORE_CONSUMERKEY_TWITTER,
consumerSecret: SPAZCORE_CONSUMERSECRET_TWITTER,
accessURL: "https://twitter.com/oauth/access_token"
}) : console.error("SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter"), App.Prefs = new SpazPrefs(SPAZ_DEFAULT_PREFS, null, {
"network-refreshinterval": {
onGet: function(e, t) {
return t < 0 && (t = 0), sch.debug(e + ":" + t), t;
},
onSet: function(e, t) {
return t < 0 && (t = 0), sch.debug(e + ":" + t), t;
}
}
}), App.Prefs.load(function() {
App.Users = new SpazAccounts(App.Prefs), e();
}), this.initAppCache();
},
initAppCache: function() {
App.Cache = {
EntriesHTML: new Cache(750)
};
},
processLaunchParams: function(e) {
e.tweet && (e.action = "prepPost", e.msg = e.tweet), e.user && (e.action = "user", e.userid = e.user);
if (!e.account) {
var t = this.getLaunchParamsAccount(e);
t && (e.account = t);
}
switch (e.action) {
case "prepPost":
case "post":
var n = enyo.bind(function() {
AppUI.compose(e.msg, e.account);
}, this);
this.isRendered === !1 ? this.onRendered.push(n) : n();
break;
case "search":
var r = enyo.bind(function() {
AppUI.search(decodeURI(e.query), e.account);
}, this);
this.isRendered === !1 ? this.onRendered.push(r) : r();
break;
case "bgcheck":
var i = enyo.bind(function() {
AppUI.refresh();
}, this);
this.isRendered === !1 ? this.onRendered.push(i) : i();
break;
case "relaunch":
this.warn("app relaunched...");
}
},
getLaunchParamsAccount: function(e) {
if (!e.account) {
var t;
return e.username && e.service ? t = App.Users.getByUsernameAndType(e.username, e.service)[0] : e.username ? t = App.Users.getByUsername(e.username)[0] : e.service ? t = App.Users.getByType(e.service)[0] : t = App.Users.getAll()[0], t ? t.id : null;
}
return e.account;
},
bindGlobalListeners: function() {
$("a[href]").live("click", function(e) {
return sc.helpers.openInBrowser(this.getAttribute("href")), event.preventDefault(), !1;
});
},
rendered: function() {
var e = this.inherited(arguments);
return this.onRendered.length > 0 && enyo.forEach(this.onRendered, function(e) {
e.call();
}, this), this.setOnRendered([]), this.isRendered = !0, e;
},
setFullscreen: function(e, t) {
this.$.main.setDraggable(!t), this.$.main.setIndex(t ? 1 : 0);
},
showImageView: function(e, t, n) {
this.$.imageViewPopup.open(), this.$.imageViewPopup.setImages(t, n);
},
closeImageView: function(e) {
this.$.imageViewPopup.close();
},
accountAdded: function(e) {
console.log("account added....", e), this.$.container.checkForUsers(), App.Prefs.set("columns_" + e, null), App.Users.getAll().length == 1 && App.Prefs.set("currentUser", e), AppUI.reloadColumns(), AppUI.rerenderTimelines();
},
accountRemoved: function(e) {
this.$.container.checkForUsers(), App.Prefs.set("columns_" + e, null), e == App.Prefs.get("currentUser") && App.Prefs.set("currentUser", null), AppUI.refresh();
},
refreshAllFinished: function() {
this.$.sidebar.refreshAllFinished();
},
showDetailPane: function() {
AppUI.showMore("detailContent");
},
pushDashboard: function(e, t, n) {
this.dashWin = this.$.dashboard.push({
icon: "icon_48.png",
title: t,
text: n
});
},
popDashboard: function() {
this.$.dashboard.pop();
},
dashboardClose: function(e) {
enyo.log("Closed dashboard.");
},
layerSwiped: function(e, t) {
enyo.log("Swiped layer: " + t.text);
},
dashboardTap: function(e, t) {
AppUtils.relaunch("dashboard", this.$.dashboard.appInfo);
},
messageTap: function(e, t) {
enyo.log("Tapped on message: " + t.text), this.dashToColumn(t.text);
},
iconTap: function(e, t) {
enyo.log("Tapped on icon for message: " + t.text), this.dashToColumn(t.text);
},
dashToColumn: function(e) {
var t = "Timeline";
e.search("tweet") >= 0 && (t = "Timeline"), e.search("private") >= 0 && (t = "Messages"), e.search("mention") >= 0 && (t = "Mentions"), e.search("search") >= 0 && (t = "Search"), AppUI.loadColumn(t);
},
deleteTweet: function(e, t) {
var n = App.Users.get(t.account_id), r = new SpazAuth(n.type), i = new SpazTwit;
r.load(n.auth), i.setBaseURLByService(n.type), i.setSource(App.Prefs.get("twitter-source")), i.setCredentials(r), t.is_private_message ? i.destroyDirectMessage(t.service_id, function(e) {
AppUI.removeTweetById(t.service_id), AppUtils.showBanner("Deleted message");
}, function() {
AppUtils.showBanner("Error deleting message");
}) : t.is_author && i.destroy(t.service_id, function(e) {
AppUI.removeTweetById(t.service_id), AppUtils.showBanner("Deleted tweet");
}, function() {
AppUtils.showBanner("Error deleting tweet");
});
},
confirmDeleteTweet: function(e, t) {
this.tweetToDelete = t, this.tweetAlert = alert("Delete tweet?", this, {
onConfirm: this.confirmTweetDeletion.bind(this),
onCancel: this.cancelTweetDeletion.bind(this),
confirmText: "Delete",
cancelText: "Cancel"
});
},
cancelTweetDeletion: function(e) {
this.tweetAlert.destroy(), this.tweetToDelete = null;
},
confirmTweetDeletion: function(e) {
this.tweetAlert.destroy(), delete this.tweetAlert, this.tweetToDelete && (AppUI.deleteTweet(this.tweetToDelete), this.tweetToDelete = null);
},
initFilters: function() {
var e = App.Prefs.get("filters");
enyo.forEach(e, function(e) {
e.persist == 1 && window._filter_chain.addFilter(e.text, window._filter_chain._neo_filter);
}, this), this.log(window._filter_chain), enyo.Signals.send("updateUnread", {
title: "filters",
unread: window._filter_chain._filters.length
});
},
deFocus: function(e, t) {
return AppUtils.getPlatform() == SPAZCORE_PLATFORM_WEBOS ? !0 : (this.createComponent({
name: "rt",
tag: "input"
}, {
owner: this
}).render(), this.$.rt.node.focus(), this.$.rt.node.blur(), this.$.rt.destroy(), !0);
}
}), copy = function(e) {
var t = {};
for (var n in e) try {
var r = JSON.stringify(e[n]);
!e[n].$ && n != "originator" && n != "flyweight" ? t[n] = JSON.parse(r) : delete e[n];
} catch (i) {
e[n] && !e[n].$ ? t[n] = copy(e[n]) : delete e[n];
}
return t;
};

// Button.js

enyo.kind({
name: "Neo.Button",
handlers: {
ontap: "buttonTap",
onresize: "resizeHandler"
},
components: [ {
name: "themer",
kind: "Neo.ThemeFile",
type: "button",
onUpdate: "updateTheme"
}, {
name: "button",
kind: "onyx.Button",
classes: "neo-button onyx-blue",
components: [ {
name: "icon",
kind: "Neo.Icon"
}, {
name: "text",
style: "top: -25px !important;"
} ]
} ],
published: {
icon: "",
iconPath: "assets/icons/",
iconRes: "ldpi/",
iconColor: "white/",
text: "",
collapse: !0,
blue: !0,
highlighted: !1,
downState: !1,
sample: !1,
preview: !1
},
create: function() {
this.inherited(arguments), this.blue || this.removeClass("onyx-blue"), this.setActive = this.$.button.setActive, this.setDisabled = this.$.button.setDisabled, this.$.themer.loadSaved();
},
iconChanged: function(e) {
this.$.icon.setType(this.type), this.$.icon.setIcon(this.icon);
},
textChanged: function(e) {
var t = this.text, n = {
name: "text",
content: t,
allowHtml: !0
};
this.$.text && this.$.text.destroy(), this.$.button.createComponent(n, {
owner: this
});
},
themeChanged: function(e) {
var t = this.inherited(arguments);
return this.iconChanged(), this.textChanged(), t;
},
updateTheme: function(e, t) {
this.$.themer.stylize(t, this.$.button), this.themeChanged(), this.render();
},
buttonTap: function(e, t) {
if (this.sample && !this.preview) return this.$.themer.customize(), this.log("lalal"), !1;
if (this.preview) return this.$.themer.preview(this.themePreview), this.log("asdfsdaf"), !1;
},
resizeHandler: function() {
var e = this.inherited(arguments), t = this.findContainer();
return this.collapse && this.$.icon && this.$.text.setShowing(t.getBounds().width >= 760), e;
},
rendered: function() {
var e = this.inherited(arguments), t = this.findContainer();
return this.collapse && this.$.icon && this.$.text.setShowing(t.getBounds().width >= 760), e;
},
findContainer: function(e) {
e == null && (e = [ "sidebar", "container" ]);
var t = this.container, n = 0;
do {
if (t.kind && (t.kind.toLowerCase().search(e[0]) >= 0 || t.kind.toLowerCase().search(e[1]) >= 0)) return t;
t.container ? t = t.container : n = 1;
} while (!n);
return this.container;
},
highlightedChanged: function(e) {
this.highlighted && this.$.themer.stylize(this.$.themer.highlight, this.$.button);
},
themes: {
neo: {
styles: {
backgroundColor: "rgb(15,15,15)",
textColor: "rgb(240,240,240)",
textSize: "24px",
textWeight: "400",
letterSpacing: "-2px",
textTransform: "uppercase",
borderWidth: "1px",
borderColor: "rgb(140,140,140)",
cornerRadius: "5px",
"border-style": "ridge"
},
classes: ""
},
aqua: {
styles: {
backgroundColor: "teal",
textColor: "rgb(240,240,240)",
textSize: "24px",
textWeight: "400",
letterSpacing: "-5px",
textTransform: "lowercase",
borderWidth: "2px",
borderColor: "rgb(255,255,255)",
cornerRadius: "20px"
},
classes: ""
},
blue: {
styles: {
backgroundColor: "rgb(26,47,58)",
borderColor: "rgb(255,255,255)",
borderWidth: "0px",
cornerRadius: "0px",
letterSpacing: "-2px",
textColor: "rgb(189, 183, 107)",
textSize: "24px",
textTransform: "uppercase",
textWeight: "0"
}
},
onyx: {
styles: {}
},
next: {
styles: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
borderWidth: "",
borderColor: "",
cornerRadius: ""
},
classes: ""
}
}
});

// RadioButton.js

enyo.kind({
name: "Neo.RadioButton",
kind: "Neo.Button",
classes: "",
handlers: {
ontap: "tap"
},
tap: function(e, t) {
return this.bubble("onchange", {
index: this.index
}), !0;
}
});

// AvatarButton.js

enyo.kind({
name: "Neo.AvatarButton",
kind: "Neo.Button",
extra: {
icon: {
width: "60px",
height: "60px",
margin: "4px -2px 0 0",
padding: "0 0 0 0"
},
button: {
width: "60px",
height: "60px",
"padding-left": "4px",
"padding-right": "5px",
"padding-top": "0px"
}
},
updateTheme: function() {
this.inherited(arguments), this.loadExtra();
},
iconChanged: function() {
this.inherited(arguments), this.loadExtra();
},
loadExtra: function() {
this.$.icon && this.$.themer.stylize(this.extra.icon, this.$.icon), this.$.button && this.$.themer.stylize(this.extra.button, this.$.button);
}
});

// SendButton.js

enyo.kind({
name: "Neo.SendButton",
kind: "Neo.Button",
published: {
remaining: 140,
collapse: !1
},
create: function() {
this.inherited(arguments), this.$.button.createComponent({
name: "remaining",
classes: "neo-button-send"
});
},
themeChanged: function(e) {
this.inherited(arguments), this.remainingChanged();
},
textChanged: function(e) {
var t = this.text;
this.$.text && this.$.text.destroy();
var n = {
name: "text",
content: t,
allowHtml: !0
};
this.$.button.createComponent(n, {
owner: this
});
},
remainingChanged: function(e) {
var t = this.remaining;
this.$.remaining && this.$.remaining.destroy();
var n = {
name: "remaining",
content: t,
classes: "neo-button-send"
};
this.$.button.createComponent(n, {
owner: this
}), this.$.button.render(), t > 20 ? (this.$.remaining.applyStyle("color", "inherit"), this.setDisabled(t === 140)) : t <= 20 && t >= 0 ? (this.$.remaining.applyStyle("color", "orange"), this.setDisabled(!1)) : (this.$.remaining.applyStyle("color", "red"), this.setDisabled(!0));
}
});

// PopupList.js

enyo.kind({
name: "Neo.PopupList",
kind: "onyx.Picker",
classes: "neo-popup-list",
handlers: {
ontap: "buttonTap"
},
published: {
sample: !1,
preview: !1
},
themes: {
neo: {
styles: {
backgroundColor: "rgb(5,5,5)",
textColor: "rgb(204,204,204)",
textSize: "24px",
textWeight: "400",
letterSpacing: "",
textTransform: "uppercase",
borderWidth: "2px",
borderColor: "rgb(255,255,255)",
padding: "",
margin: "",
width: "300px"
},
classes: ""
},
aqua: {},
cloudy: {
styles: {
backgroundColor: "rgb(79,96,74)",
borderColor: "rgb(189, 183, 107)",
borderWidth: "0px",
letterSpacing: "-3px",
margin: "3px",
padding: "13px",
textColor: "rgb(189, 183, 107)",
textSize: "25px",
textTransform: "uppercase",
textWeight: "7",
width: "182px"
}
},
onyx: {
styles: {},
highlight: {}
}
},
create: function() {
this.inherited(arguments), this.controlParent.setHorizontal("hidden"), this.createComponent({
name: "themer",
kind: "Neo.ThemeFile",
type: "popupList",
onUpdate: "updateTheme",
showing: !1
}, {
owner: this
}), this.themeChanged(), this.$.themer.loadSaved();
},
themeChanged: function(e) {
var t = this.inherited(arguments);
return t;
},
updateTheme: function(e, t) {
if (this.container.children[0].kind == "onyx.PickerButton") {
var n = this.container.children[0], r = enyo.clone(t);
this.preview || delete r.width, this.$.themer.stylize(r, n);
}
this.$.themer.stylize(t, this), this.$.themer.stylize(t, this.children[0]), this.applyStyle("min-width", t.width);
},
buttonTap: function(e, t) {
console.log(e, t);
if (this.sample && !this.preview) return this.$.themer.customize(), !1;
if (this.preview) return this.$.themer.preview(this.themePreview), !1;
}
});

// TweetTapPopup.js

enyo.kind({
name: "Neo.TweetTapPopup",
kind: "Neo.PopupList",
create: function() {
this.inherited(arguments), this.tweet = null;
},
selectedChanged: function(e, t) {
var n = this.inherited(arguments);
return this.requestHide(), this[this.selected.callNext](), n;
},
detailsClicked: function(e) {
AppUI.viewTweet(this.tweet);
},
replyClicked: function(e) {
AppUI.reply(this.tweet);
},
favoriteClicked: function(e) {
var t = App.Users.get(this.tweet.account_id), n = new SpazAuth(t.type), r = new SpazTwit;
n.load(t.auth), r.setBaseURLByService(t.type), r.setSource(App.Prefs.get("twitter-source")), r.setCredentials(n), this.tweet.is_favorite ? (enyo.log("UNFAVORITING %j", this.tweet), r.unfavorite(this.tweet.service_id, enyo.bind(this, function(e) {
this.tweet.is_favorite = !1, AppUtils.showBanner("Removed favorite"), AppUI.rerenderTimelines();
}), function(e, t, n) {
AppUtils.showBanner("Error removing favorite");
})) : (enyo.log("FAVORITING %j", this.tweet), r.favorite(this.tweet.service_id, enyo.bind(this, function(e) {
this.tweet.is_favorite = !0, AppUtils.showBanner("Added favorite"), AppUI.rerenderTimelines();
}), function(e, t, n) {
AppUtils.showBanner("Error adding favorite");
}));
},
deleteClicked: function(e) {
AppUI.confirmDeleteTweet(this.tweet);
},
repostClicked: function(e) {
AppUI.repost(this.tweet);
},
editRepostClicked: function(e) {
AppUI.repostManual(this.tweet);
},
emailClicked: function(e) {
AppUtils.emailTweet(this.tweet);
},
smsClicked: function(e) {
AppUtils.SMSTweet(this.tweet);
},
clipboardClicked: function(e) {
AppUtils.copyTweet(this.tweet);
},
showAtEvent: function(e, t) {
this.tweet = e, this.beforeOpen();
var n = {
top: t.pageY,
left: t.pageX
};
this.applyPosition(n), this.activatorOffset = this.getPageOffset(t.originator.eventNode), this.show(), this.render();
},
beforeOpen: function() {
var e = this.getComponents();
for (var t in e) e[t].callNext && e[t].destroy();
var n = [ {
content: "Details",
callNext: "detailsClicked"
}, {
content: "Reply",
callNext: "replyClicked"
} ];
this.tweet.is_favorite ? n.push({
content: "Unfavorite",
callNext: "favoriteClicked"
}) : this.tweet.is_private_message || n.push({
content: "Favorite",
callNext: "favoriteClicked"
}), n.push({
content: "Retweet",
callNext: "repostClicked"
}, {
content: "RT",
callNext: "editRepostClicked"
}, {
content: "Email",
callNext: "emailClicked"
}, {
content: "SMS/IM",
callNext: "smsClicked"
}, {
content: "Copy To Clipboard",
callNext: "clipboardClicked"
}), (this.tweet.is_author || this.tweet.is_private_message) && n.push({
content: "Delete",
callNext: "deleteClicked"
}), this.createComponents(n, {
owner: this
});
}
});

// layout.js

enyo.kind({
name: "Neo.Sidebar.layout"
});

// item.js

enyo.kind({
name: "Neo.SidebarItem",
layoutKind: "FittableColumnsLayout",
fit: !0,
style: "text-align: center;",
handlers: {
ontap: "itemTap"
},
published: {
icon: "",
title: "",
highlighted: !1,
unread: 0,
sample: !1,
preview: !1
},
components: [ {
name: "themer",
kind: "Neo.ThemeFile",
type: "sidebarItem",
onUpdate: "updateTheme"
}, {
kind: "Signals",
updateUnread: "updateUnread"
}, {
name: "sidebarItem",
kind: "FittableColumns",
classes: "neo-sidebar-item onyx-toolbar onyx-dark onyx-highlight",
components: [ {
name: "icon",
kind: "Neo.Icon"
}, {
name: "title",
layoutKind: "FittableColumnsLayout",
style: "margin-left: 20px;"
}, {
layoutKind: "FittableColumnsLayout",
fit: !0
}, {
name: "unread",
layoutKind: "FittableColumnsLayout",
classes: "neo-sidebar-item-unread"
} ]
} ],
create: function() {
this.inherited(arguments), this.$.themer.loadSaved();
},
themeChanged: function(e) {
var t = this.inherited(arguments);
return this.iconChanged(), this.titleChanged(), this.unreadChanged("skip"), t;
},
updateTheme: function(e, t) {
this.themeChanged(), this.$.themer.stylize(t, this.$.sidebarItem), !this.preview && !this.sample && this.bubble("onSetWidth", {
width: parseInt(t.width) || 344
}), this.selectItem(this.highlighted);
},
iconChanged: function(e) {
this.$.icon.setType(this.type), this.$.icon.setIcon(this.icon);
},
titleChanged: function(e) {
this.$.title.setContent(this.title);
},
unreadChanged: function(e) {
this.$.unread.setShowing(this.unread != 0 && typeof this.unread != "undefined");
if (e == "skip") return;
this.$.unread.setContent(this.unread), this.dispatchBubble("onUpdateUnread", {
unread: this.unread
}), this.render();
},
updateUnread: function(e, t) {
var n = t.unread, r = this.columnTypeToName(t.title), i = this.getTitle();
if (r == null || r.toLowerCase() != i.toLowerCase()) return;
this.setUnread(n);
},
columnTypeToName: function(e) {
switch (e) {
case "home":
e = "timeline";
break;
case "lists":
e = "list";
break;
case "timeline":
e = "home";
break;
case "list":
n = "lists";
break;
default:
}
return e;
},
selectItem: function(e) {
var t = this.$.themer, n = this.$.unread;
this.highlighted = e;
switch (e) {
case !0:
t.stylize(t.highlight, this.$.sidebarItem), this.$.unread.applyStyle("background-color", t.highlight.textColor), this.$.unread.applyStyle("color", t.highlight.backgroundColor);
break;
case !1:
default:
this.$.unread.applyStyle("background-color", t.highlight.backgroundColor), this.$.unread.applyStyle("color", t.highlight.textColor);
}
},
itemTap: function(e, t) {
return this.sample && !this.preview ? (this.$.themer.customize(), !1) : this.preview ? (this.$.themer.preview(this.themePreview), !1) : (this.bubble("selectColumn"), !0);
},
rendered: function() {
var e = this.inherited(arguments);
return this.sample === !0 && (this.$.sidebarItem.applyStyle("width", "100%"), this.applyStyle("width", "100%")), e;
},
themes: {
neo: {
styles: {
width: "250px",
backgroundColor: "rgb(5,5,5)",
textColor: "rgb(240,240,240)",
textSize: "23px",
textWeight: "400",
letterSpacing: "-2px",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(255,255,255)",
borderRightColor: "rgb(255,255,255)",
borderTopSize: "0",
borderBottomSize: "0",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
backgroundColor: "rgb(255,255,255)",
textColor: "rgb(204,204,204)",
textSize: "23px",
textWeight: "400",
letterSpacing: "-2px",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(5,5,5)",
borderRightColor: "rgb(5,5,5)",
borderTopSize: "0",
borderBottomSize: "0",
borderTopColor: "",
borderBottomColor: ""
},
classes: ""
},
aqua: {
styles: {
width: "250px",
backgroundColor: "teal",
textColor: "rgb(240,240,240)",
textSize: "23px",
letterSpacing: "-2px",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(255,255,255)",
borderRightColor: "rgb(255,255,255)",
borderTopSize: "0",
borderBottomSize: "0",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
backgroundColor: "rgb(255,255,255)",
textColor: "teal",
textSize: "23px",
textWeight: "400",
letterSpacing: "-2px",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(5,5,5)",
borderRightColor: "rgb(5,5,5)",
borderTopSize: "0",
borderBottomSize: "0",
borderTopColor: "",
borderBottomColor: ""
},
classes: ""
},
murky: {
styles: {
width: "250px",
backgroundColor: "rgb(119,109,17)",
borderBottomColor: "",
borderBottomSize: "1px",
borderLeftColor: "rgb(255,255,255)",
borderLeftSize: "0px",
borderRightColor: "rgb(255,255,255)",
borderRightSize: "0px",
borderTopColor: "",
borderTopSize: "0px",
letterSpacing: "-2px",
textColor: "rgb(95,20,48)",
textSize: "24px",
textTransform: "",
textWeight: "0"
},
highlight: {
backgroundColor: "rgb(201,181,0)",
borderBottomColor: "rgb(38,0,42)",
borderBottomSize: "1px",
borderLeftColor: "rgb(5,5,5)",
borderLeftSize: "0px",
borderRightColor: "rgb(5,5,5)",
borderRightSize: "0px",
borderTopColor: "rgb(31,0,33)",
borderTopSize: "1px",
letterSpacing: "-2px",
textColor: "rgb(0,53,91)",
textSize: "24px",
textTransform: "",
textWeight: "0"
},
classes: ""
},
onyx: {
styles: {},
highlight: {}
}
}
});

// Sidebar.js

enyo.kind({
name: "Neo.Sidebar",
kind: "FittableRows",
classes: "neo-sidebar",
published: {
sidebarWidth: 344,
unread: new Array(10),
index: 0
},
_side: [ {
name: "Timeline",
icon: "timeline"
}, {
name: "Mentions",
icon: "mentions"
}, {
name: "Messages",
icon: "messages"
}, {
name: "Search",
icon: "search"
}, {
name: "Trends",
icon: "trends"
}, {
name: "Favorites",
icon: "favorites"
}, {
name: "Profile",
icon: "profile"
}, {
name: "Lists",
icon: "lists"
}, {
name: "Retweets",
icon: "retweets"
}, {
name: "Filters",
icon: "filters"
} ],
_menu: [ {
name: "About",
icon: "NEO",
type: "aboutPopup"
}, {
name: "Settings",
icon: "settings",
type: "settingsPopup"
}, {
name: "Themes",
icon: "settings",
type: "themes"
}, {
name: "Accounts",
icon: "accounts",
type: "accountsPopup"
} ],
components: [ {
kind: "Neo.Toolbar",
align: "left",
left: [ {
name: "avatar",
kind: "Neo.AvatarButton"
} ],
middle: [ {
kind: "onyx.PickerDecorator",
components: [ {
name: "accountName",
kind: "Neo.Button",
icon: "twitter",
collapse: !1
}, {
name: "accountSelection",
kind: "Neo.PopupList",
onSelect: "selectAccount"
} ]
} ]
}, {
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
horizontal: "hidden",
classes: "list",
components: [ {
name: "list",
kind: "Repeater",
onSetupItem: "setupItem",
components: [ {
name: "item",
kind: "Neo.SidebarItem",
selectColumn: "itemTap",
onUpdateUnread: "updateUnread",
onSetWidth: "setWidth"
} ]
} ]
}, {
kind: "Neo.Toolbar",
align: "left",
middle: [ {
name: "pin",
kind: "Neo.Button",
icon: "back",
ontap: "collapse",
style: "z-index: 999"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "Neo.Button",
text: "",
icon: "settings",
collapse: !0
}, {
name: "menu",
kind: "Neo.PopupList",
onSelect: "menuSelect"
} ]
} ]
} ],
create: function() {
this.inherited(arguments), AppUI.addFunction("selectSidebar", this.selectSidebar, this), AppUI.addFunction("selectSidebarByName", function(e, t) {
for (var n in this._side) {
var r = this._side[n];
r.name.toLowerCase() == e.toLowerCase() && (this.index = parseInt(n), AppUI.selectSidebar(parseInt(n), t));
}
}, this), this.$.list.setCount(this._side.length), this.$.list.build(), this.buildMenu(), this.refreshAccountsButton(), this.render();
},
collapse: function(e, t) {
this.getBounds().width != 65 ? (this.applyStyle("width", "65px"), this.$.pin.setIcon("forward")) : (this.applyStyle("width", null), this.$.pin.setIcon("back")), enyo.Signals.send("setFullscreen", !0), enyo.Signals.send("setFullscreen", !1), this.render(), this.container.reflow(), this.reflow();
},
setWidth: function(e, t) {
this.setSidebarWidth(t.width);
},
sidebarWidthChanged: function(e) {
var t = this.sidebarWidth;
this.applyStyle("width", t + "px"), this.applyStyle("max-width", t + "px"), this.render(), this.reflow();
},
selectSidebar: function(e, t) {
e || (e = this.index), this.refreshAccountsButton(), this.$.list.build();
var n = e - 3;
n = n < 0 ? 0 : n, this.$.scroller.scrollToControl(this.$.list.children[n].$.item);
},
updateUnread: function(e, t) {
var n = t.index, r = t.unread;
return this.unread[n] = r, !0;
},
setupItem: function(e, t) {
var n = t.index, r = t.item.$.item, i = this._side[n];
r.setIcon(i.icon), r.setTitle(i.name), r.selectItem(this.index == n), r.setUnread(this.unread[n]);
},
itemTap: function(e, t) {
var n = t.originator.$.title.content, r = t.index, i = this._side[r];
this.index = r, n == "Profile" ? AppUI.showMore(n) : AppUI.loadColumn(n), this.$.list.build();
},
menuSelect: function(e, t) {
var n = t.selected;
AppUI.showMore(n.type);
},
buildMenu: function() {
this.$.menu.destroyClientControls(), enyo.forEach(this._menu, function(e) {
this.$.menu.createComponent({
content: e.name,
type: e.type
}, {
owner: this
});
}, this);
},
refreshAllFinished: function() {
this.refreshAccountsButton();
},
refreshAccountsButton: function() {
var e = App.Users.getAll(), t = App.Prefs.get("currentUser"), n = [];
this.$.accountSelection.destroyClientControls(), enyo.forEach(e, function(e) {
n.push({
content: "@" + e.username,
id: e.id
});
}, this), this.$.accountSelection.createComponents(n, {
owner: this
}), AppUtils.getAccount(App.Prefs.get("currentUser"), enyo.bind(this, function(e) {
this.$.avatar.setIcon(e.profile_image_url), this.$.accountName.setText("" + e.screen_name), this.$.accountName.container.render(), this.render();
}), enyo.bind(this, function(e, t, n) {
console.error("Couldn't find user's avatar"), this.$.avatar.setIcon(""), this.$.accountName.setText(""), this.$.accountName.container.render(), this.render();
})), this.reflow(), this.render();
},
selectAccount: function(e, t) {
var n = App.Prefs.get("currentUser");
App.Prefs.set("currentUser", t.selected.id), AppUI.userChange(n);
}
});

// Spinner.js

enyo.kind({
name: "Neo.Spinner",
kind: "onyx.Spinner"
}), enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// Subtext.js

enyo.kind({
name: "Neo.Subtext",
allowHtml: !0,
classes: "neo-subtext"
});

// Settings.js

enyo.kind({
name: "Neo.SettingsPopup",
kind: "FittableRows",
classes: "neo-container neo-settings",
events: {
onClose: ""
},
components: [ {
kind: "Neo.Toolbar",
header: "Settings"
}, {
name: "scroller",
kind: "Scroller",
thumb: !1,
fit: !0,
touch: !0,
horizontal: "hidden",
components: [ {
kind: "Neo.setting",
section: "Tweet Tap",
title: "What happens when you tap a tweet",
items: [ {
content: "Opens Panel",
value: "panel"
}, {
content: "Opens Popup",
value: "popup"
} ],
onChange: "setPreference",
preferenceProperty: "tweet-tap"
}, {
kind: "Neo.setting",
section: "Tweet Hold",
title: "What happens when you hold a tweet",
items: [ {
content: "Opens Panel",
value: "panel"
}, {
content: "Opens Popup",
value: "popup"
}, {
content: "Does Nothing",
value: "nothing"
} ],
onChange: "setPreference",
preferenceProperty: "tweet-hold"
}, {
kind: "Neo.setting",
section: "Toolbar Tap",
title: "Scroll behavior when toolbar is tapped",
items: [ {
content: "Top->Unread->Bottom",
value: 0
}, {
content: "Top->Unread",
value: 1
}, {
content: "Top->Bottom",
value: 2
}, {
content: "Unread->Bottom",
value: 3
}, {
content: "Top",
value: 4
}, {
content: "Unread",
value: 5
}, {
content: "Bottom",
value: 6
} ],
onChange: "setPreference",
preferenceProperty: "scroll-behavior"
}, {
kind: "Neo.setting",
section: "Toolbar Hold",
title: "What happens when you hold the toolbar",
items: [ {
content: "Mark As Read",
value: "mark-read"
}, {
content: "Do Nothing",
value: "do-nothing"
} ],
onChange: "setPreference",
preferenceProperty: "toolbar-hold"
}, {
content: "Hide when minimized",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "Toggles graphics when app is minimized"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "hide-when-minimized",
style: "float:right;"
} ]
}, {
content: "Compose",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "Enter key posts"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "post-send-on-enter",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "Refresh after posting"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
style: "float:right;",
preferenceProperty: "refresh-after-posting"
} ]
}, {
kind: "Neo.setting",
section: "Refresh",
title: "Frequency",
items: [ {
content: "Never",
value: 0
}, {
content: "5 min",
value: 3e5
}, {
content: "10 min",
value: 6e5
}, {
content: "15 min",
value: 9e5
}, {
content: "30 min",
value: 18e5
}, {
content: "1 hr",
value: 36e5
}, {
content: "2 hr",
value: 72e5
}, {
content: "4 hr",
value: 144e5
}, {
content: "8 hr",
value: 288e5
} ],
onChange: "setPreference",
preferenceProperty: "network-refreshinterval"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "Scroll to unread after refresh"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "timeline-scrollonupdate",
style: "float: right;"
} ]
}, {
content: "Notifications",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "New tweets"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "notify-newmessages",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "New mentions"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "notify-mentions",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "New DMs"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "notify-dms",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "New search results"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "notify-searchresults",
style: "float:right;"
} ]
}, {
kind: "Neo.setting",
section: "URL Shortening",
title: "Preferred service for shortening URLs",
items: [ {
content: "bit.ly",
value: "bit.ly"
}, {
content: "j.mp",
value: "j.mp"
}, {
content: "is.gd",
value: "is.gd"
}, {
content: "go.ly",
value: "go.ly"
}, {
content: "goo.gl",
value: "goo.gl"
} ],
onChange: "setPreference",
preferenceProperty: "url-shortener"
}, {
kind: "Neo.setting",
section: "Image Upload",
title: "Preferred service for uploading images",
items: [ {
content: "drippic",
value: "drippic"
}, {
content: "pikchur",
value: "pikchur"
}, {
content: "twitpic",
value: "twitpic"
}, {
content: "twitgoo",
value: "twitgoo"
}, {
content: "identi.ca",
value: "identi.ca"
}, {
content: "statusnet",
value: "statusnet"
} ],
onChange: "setPreference",
preferenceProperty: "image-uploader"
}, {
content: "Data",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
content: "Save data on exit (recommended)"
}, {
kind: "onyx.ToggleButton",
onChange: "setPreference",
preferenceProperty: "save-on-exit",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
components: [ {
content: "Clear saved tweet data for all accounts"
}, {
tag: "br"
}, {
content: "NOTE: This does NOT delete account data"
} ]
}, {
kind: "Neo.Button",
text: "Clear",
ontap: "clearData",
style: "float:right;"
} ]
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
components: [ {
content: "Clear All Data"
}, {
tag: "br"
}, {
content: "This action will delete everything."
} ]
}, {
kind: "Neo.Button",
text: "Clear All",
ontap: "clearAll",
style: "float:right;",
classes: "onyx-negative",
blue: !1
} ]
} ]
}, {
kind: "Neo.Toolbar",
middle: [ {
kind: "Neo.Button",
ontap: "doClose",
text: "Close",
icon: "exit",
collapse: !1
} ]
} ],
numLoaded: 0,
create: function() {
this.inherited(arguments);
},
reset: function() {
var e = [ "tweet-tap", "tweet-hold", "network-refreshinterval", "url-shortener", "image-uploader" ];
_.each(this.getComponents(), function(e) {
if (e.preferenceProperty) {
App.Prefs.get(e.preferenceProperty) === undefined && App.Prefs.set(e.preferenceProperty, SPAZ_DEFAULT_PREFS[e.preferenceProperty]), e.kind;
if (e.kind === "onyx.ToggleButton") e.setValue(App.Prefs.get(e.preferenceProperty)); else {
e.render();
var t = App.Prefs.get(e.preferenceProperty);
for (var n in e.$.popupList.controls) {
var r = e.$.popupList.controls[n];
if (r.value == t) {
console.log("found!", r, t, r.value), e.$.popupList.setSelected(e.$.popupList.controls[n]), e.render();
break;
}
}
}
}
});
},
setPreference: function(e, t) {
this.numLoaded++;
if (this.numLoaded < 17) return;
if (t.originator.kind === "onyx.ToggleButton") App.Prefs.set(e.preferenceProperty, t.value); else {
App.Prefs.set(e.preferenceProperty, t.selected.value);
var n = !0;
}
n && AppUI.rerenderTimelines();
},
setRefreshPreference: function(e, t) {
this.setPreference(e, t), AppUI.restartAutoRefresher();
},
clearData: function(e, t) {
var n = App.Users.getAll();
for (var r in n) {
var i = n[r];
console.log(i.id, App.Prefs.get("currentUser")), App.Prefs.set("columns_" + i.id, null);
}
AppUI.reloadColumns(), AppUI.rerenderTimelines();
},
clearAll: function(e, t) {
var n = new alert("<h1 style='color: red;'>WARNING!</h1><h2 style='color: red;'>This will erase ALL app data, including accounts.<br/>Performing this action will restart the application.<br/>Are you SURE you want to continue?", this, {
cancelText: "Remove Accounts",
confirmText: "CANCEL",
onConfirm: function(e) {
this.destroy();
},
onCancel: function(e) {
localStorage.preferences_json = null, window.location.reload();
}
});
n.applyStyle("height", "350px");
}
});

// setting.js

enyo.kind({
name: "Neo.setting",
classes: "neo-container neo-settings",
published: {
items: [],
type: "list",
section: "section",
title: "setting title",
description: "longer description",
mixin: {}
},
list: [ {
name: "section",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
tag: "table",
attributes: {
width: "100%"
},
components: [ {
tag: "tr",
components: [ {
tag: "td",
attributes: {
width: "60%"
},
components: [ {
name: "title"
}, {
tag: "br"
}, {
name: "description",
kind: "Neo.Subtext"
} ]
}, {
tag: "td",
attributes: {
width: "20%"
},
components: [ {
kind: "onyx.PickerDecorator",
style: "float: right;",
components: [ {
kind: "onyx.PickerButton"
}, {
name: "popupList",
kind: "Neo.PopupList",
onChange: "setPreference",
preferenceProperty: "tweet-text-size"
} ]
} ]
} ]
} ]
} ]
} ],
button: [ {
name: "section",
classes: "neo-settings-header"
}, {
classes: "onyx-toolbar-inline neo-settings-setting",
components: [ {
tag: "table",
attributes: {
width: "100%"
},
components: [ {
tag: "tr",
components: [ {
tag: "td",
attributes: {
width: "100%"
},
components: [ {
name: "title"
}, {
tag: "br"
}, {
name: "description",
kind: "Neo.Subtext"
} ]
}, {
tag: "td",
attributes: {
width: "10%"
},
components: [ {
name: "button",
kind: "Neo.Button",
ontap: "action",
bubble: "",
collapse: !1,
style: "float:right;",
classes: "onyx-negative",
blue: !1
} ]
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.typeChanged(), this.itemsChanged(), this.sectionChanged(), this.titleChanged(), this.descriptionChanged();
},
typeChanged: function(e) {
this.destroyClientControls();
var t = this[this.type];
enyo.mixin(t[1].components[0].components[0].components[1].components[0], this.mixin), this.createComponents(t, {
owner: this
}), this.render();
},
descriptionChanged: function(e) {
this.$.description.setContent(this.description), this.$.description.setShowing(this.description != "longer description");
},
titleChanged: function(e) {
this.$.title.setContent(this.title);
},
sectionChanged: function(e) {
this.$.section.setContent(this.section);
},
itemsChanged: function(e) {
if (!this.$.popupList) return;
this.$.popupList.destroyClientControls();
var t = [];
enyo.forEach(this.items, function(e) {
t.push({
content: e.content,
value: e.value,
preferenceProperty: e.preferenceProperty
});
}), this.$.popupList.createComponents(t, {
owner: this
});
},
requestHide: function() {
this.$.popupList.requestHide(), this.inherited(arguments);
},
action: function(e, t) {
this.bubbleUp(e.bubble, {
inSender: e
});
}
});

// Toolbar.js

enyo.kind({
name: "Neo.Toolbar",
classes: "neo-toolbar onyx-toolbar onyx-dark ",
published: {
header: "",
closeable: !1,
align: "center",
left: [ {
content: " "
} ],
middle: [ {
content: " "
} ],
right: [ {
content: " "
} ],
sample: !1,
preview: !1
},
events: {
onClose: ""
},
handlers: {
ontap: "handleTapped",
onhold: "handleHold"
},
components: [ {
name: "themer",
kind: "Neo.ThemeFile",
type: "toolbar",
onUpdate: "updateTheme"
}, {
layoutKind: "FittableColumnsLayout",
components: [ {
name: "close",
kind: "Neo.Button",
icon: "close",
action: "doClose",
showing: !1
}, {
name: "left",
layoutKind: "FittableColumnsLayout",
classes: ""
}, {
name: "middle",
kind: "FittableColumns",
classes: "onyx-header",
fit: !0
}, {
name: "right",
layoutKind: "FittableColumnsLayout",
classes: ""
} ]
} ],
themes: {
neo: {
styles: {
backgroundColor: "rgb(0,0,0)",
textColor: "rgb(255,255,255)",
textSize: "16px",
textWeight: "400",
letterSpacing: "",
textTransform: "",
margin: "",
padding: ""
},
classes: ""
},
aqua: {
styles: {},
classes: ""
},
kakhi: {
styles: {
backgroundColor: "rgb(85,88,35)",
letterSpacing: "-2px",
margin: "0px",
padding: "0px",
textColor: "rgb(189, 183, 107)",
textSize: "19px",
textTransform: "",
textWeight: "0"
}
},
red: {
styles: {
backgroundColor: "rgb(128,0,0)",
textColor: "rgb(255,176,0)",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
margin: "",
padding: ""
}
},
steel: {
styles: {
backgroundColor: "rgb(63,63,60)",
textColor: "rgb(198,204,204)",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
margin: "",
padding: ""
}
},
green: {
styles: {
backgroundColor: "rgb(0,163,0)",
textColor: "rgb(57,0,0)",
textSize: "18px",
textWeight: "900",
letterSpacing: "-2px",
textTransform: "",
margin: "0px",
padding: "14px"
}
},
forest: {
styles: {
backgroundColor: "rgb(0,60,0)",
letterSpacing: "0px",
margin: "0px",
padding: "0px",
textColor: "rgb(255,255,255)",
textSize: "16px",
textTransform: "0px",
textWeight: "400"
}
},
blue: {
styles: {
backgroundColor: "rgb(0,0,120)",
textColor: "rgb(85,255,255)",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
margin: "",
padding: ""
}
},
bruins: {
styles: {
backgroundColor: "rgb(0,0,0)",
textColor: "rgb(255, 215, 0)",
textSize: "28px",
textWeight: "900",
letterSpacing: "-2px",
textTransform: "",
margin: "0px",
padding: "14px"
}
},
onyx: {
styles: {},
highlight: {}
}
},
create: function() {
this.inherited(arguments), this.$.themer.loadSaved();
},
themeChanged: function(e) {
var t = this.inherited(arguments);
return this.leftChanged(), this.rightChanged(), this.middleChanged(), this.closeableChanged(), this.headerChanged(), this.alignChanged(), this.reflow(), t;
},
updateTheme: function(e, t) {
this.$.themer.stylize(t, this), this.themeChanged(), this.reflow();
},
leftChanged: function(e) {
this.$.left.destroyClientControls(), enyo.forEach(this.left, function(e) {
this.$.left.createComponent(e, {
owner: this.owner
});
}.bind(this)), this.reflow();
},
middleChanged: function(e) {
this.$.middle.destroyClientControls(), enyo.forEach(this.middle, function(e) {
this.$.middle.createComponent(e, {
owner: this.header ? this : this.owner
}), this.$.middle.render();
}.bind(this)), this.reflow();
},
rightChanged: function(e) {
this.$.right.destroyClientControls(), enyo.forEach(this.right, function(e) {
this.$.right.createComponent(e, {
owner: this.owner
});
}.bind(this)), this.reflow();
},
closeableChanged: function(e) {
this.$.close.setShowing(this.closeable);
},
headerChanged: function(e) {
this.header ? (this.$.toolHeader || (this.middle.push({
name: "toolHeader",
style: "font-size: 2em;",
classes: "onyx-header"
}), this.middleChanged()), this.$.toolHeader.setContent(this.header)) : (this.$.toolHeader && enyo.remove(this.$.toolHeader, this.middle), this.middleChanged());
},
alignChanged: function(e) {
this.applyStyle("text-align", this.align), this.$.middle.applyStyle("text-align", this.align);
},
contains: function(e, t) {
try {
if (e.originator[t]) return e.originator[t];
if (e.originator.container[t]) return e.originator.container[t];
if (e.originator.container.container[t]) return e.originator.container.container[t];
} catch (n) {}
return this.log(e, t), !1;
},
handleTapped: function(e, t) {
if (this.sample && !this.preview) return this.$.themer.customize(), !1;
if (this.preview) return this.$.themer.preview(this.themePreview), !1;
var n = this.inherited(arguments);
return !this.contains(t, "ontap") && !this.contains(t, "action") ? (this.bubble("toolbarTap", t), console.log("notap")) : this.contains(t, "action") && (this[this.contains(t, "action")](e, t), console.log("tap")), n;
},
handleHold: function(e, t) {
var n = this.inherited(arguments);
return !t.originator.ontap && !t.originator.container.ontap && this.bubble("toolbarHold", t), n;
}
});

// Tweet.js

enyo.kind({
name: "Neo.Tweet",
classes: "  neo-toolbar-middle",
handlers: {
ontap: "tweetTap",
onhold: "activateHold",
onmouseup: "tweetHold"
},
events: {
onTweetTap: "",
onTweetHold: ""
},
published: {
tweet: "",
tweetClass: "normal",
ignoreUnread: !1,
_hold: !1,
sample: !1,
preview: !1,
theme: ""
},
components: [ {
name: "themer",
kind: "Neo.ThemeFile",
type: "tweet",
onUpdate: "updateTheme"
}, {
name: "tweet",
classes: "neo neo-tweet onyx-toolbar onyx-dark neo-toolbar-middle"
}, {
name: "images"
} ],
create: function() {
this.inherited(arguments), this.$.themer.loadSaved();
},
themeChanged: function(e) {
var t = this.inherited(arguments), n = this.$.themer.getDefaults();
return this.$.tweet.destroyClientControls(), this.$.tweet.createComponents(n.theme, {
owner: this
}), t;
},
updateTheme: function(e, t) {
this.themeChanged(), this.tweetChanged(), this.$.themer.stylize(t, this.$.tweet), this.$.themer.stylize(this.$.themer.highlight, this.$.header.$.usernames), this.$.tweet.render();
},
tweetTap: function(e, t) {
if (this.sample === !0 && !this.preview) return this.$.themer.customize(), !1;
if (this.preview === !0) return this.$.themer.preview(this.themePreview), !1;
if (this._hold) return;
this.bubble("onTweetTap", t);
},
activateHold: function(e, t) {
this._hold = !0;
},
tweetHold: function(e, t) {
if (!this._hold) return !1;
this._hold = !1, this.bubble("onTweetHold", t);
},
tweetClassChanged: function(e) {
this.removeClass(e), this.addClass(this.tweetClass);
},
tweetChanged: function(e) {
function u(e, n) {
t.setRt_full(enyo.macroize(e, r)), t.setRt_short(enyo.macroize(n, r));
}
var t = this.$.header, n = this.$.avatar.$, r = this.tweet, i = "normal", s, o = sch.getRelativeTime(r.publish_date, {
now: "now",
seconds: "s",
minute: "m",
minutes: "m",
hour: "h",
hours: "h",
day: "d",
days: "d"
});
t.reset(), t.setAuthor_full(enyo.macroize("{$author_fullname}", r)), t.setAuthor_short(enyo.macroize("{$author_username}", r)), this.$.retweet.setShowing(r.is_repost === !0), t.setPrivate(r.author_is_private || r.is_private_message), t.setFavorite(r.is_favorite), r.author_avatar && n.author.setSrc(r.author_avatar), r.recipient_username && r.author_username == r._orig.SC_user_received_by && r.is_private_message ? (t.setAuthor_full(enyo.macroize("{$recipient_fullname}", r)), t.setAuthor_short(enyo.macroize("{$recipient_username}", r))) : r.is_repost === !0 && (u("{$reposter_fullname}", "{$reposter_username}"), n.retweeter.setSrc(r.reposter_avatar), this.$.retweet.$.username.setContent(r.reposter_username), this.$.retweet.$.published.setContent(sch.getRelativeTime(r.publish_date))), t.setUnread(r.read === !1 && this.ignoreUnread === !1), r._orig && r._orig.source && (o += " from {$_orig.source}</span>"), o = enyo.macroize(o, r), this.$.timestamp.setContent(o), r.is_private_message === !0 ? i = "message" : r.is_mention === !0 ? i = "mention" : r.is_author === !0 && (i = "author"), this.setTweetClass(i);
try {
s = App.Cache.EntriesHTML.getItem(r.spaz_id);
} catch (a) {}
if (!s) {
s = AppUtils.applyTweetTextFilters(r.text);
try {
App.Cache.EntriesHTML.setItem(r.spaz_id, s);
} catch (a) {}
}
s = enyo.macroize(s + "", r);
var f = new SpazShortURL, l = f.findExpandableURLs(s);
this.$.body.setContent(s);
var c = this;
if (l) for (var h in l) f.expand(l[h], {
onSuccess: enyo.bind(this, function(e) {
s = f.replaceExpandableURL(s, e.shorturl, e.longurl);
if (!c || !c.$.body) return;
c.$.body.setContent(s), c.buildMediaPreviews(), c.render();
})
}); else this.buildMediaPreviews();
}
});

// small.js

enyo.kind({
name: "Neo.Tweet.small",
kind: "Neo.Tweet",
buildMediaPreviews: function() {
return;
},
create: function() {
this.inherited(arguments), this.$.header.refresh();
},
themes: {
neo: {
theme: [ {
tag: "table",
attributes: {
width: "100%"
},
components: [ {
tag: "tr",
components: [ {
tag: "td",
attributes: {
rowspan: "2",
width: "70px"
},
components: [ {
name: "avatar",
kind: "Neo.Avatar"
} ]
}, {
tag: "td",
attributes: {
width: "100%"
},
components: [ {
name: "header",
kind: "Neo.Header"
} ]
} ]
}, {
tag: "tr",
components: [ {
tag: "td",
components: [ {
name: "body",
kind: "Neo.Body"
}, {
name: "timestamp",
kind: "Neo.Timestamp"
} ]
} ]
}, {
tag: "tr",
components: [ {
tag: "td",
attributes: {
colspan: "2"
},
components: [ {
name: "retweet",
kind: "Neo.RetweetInfo",
showing: !1
} ]
} ]
} ]
} ],
styles: {
backgroundColor: "rgb(15,15,15)",
textColor: "rgb(255,255,255)",
textSize: "16px",
textWeight: "400",
layout: "neo",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(255,255,255)",
borderRightColor: "rgb(255,255,255)",
borderTopSize: "0px",
borderBottomSize: "0px",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
textColor: "",
textSize: "20px",
textWeight: "400",
textTransform: ""
},
classes: ""
},
official: {
theme: [ {
tag: "table",
attributes: {
width: "100%"
},
components: [ {
tag: "tr",
components: [ {
tag: "td",
attributes: {
width: "70px"
},
components: [ {
name: "avatar",
kind: "Neo.Avatar"
} ]
}, {
tag: "td",
attributes: {
width: "100%"
},
components: [ {
kind: "FittableColumns",
fit: !0,
components: [ {
name: "header",
kind: "Neo.Header",
extra: {
name: "timestamp",
kind: "Neo.Timestamp"
}
} ]
} ]
} ]
}, {
tag: "tr",
components: [ {
tag: "td",
attributes: {
colspan: "2"
},
components: [ {
name: "body",
kind: "Neo.Body"
} ]
} ]
}, {
tag: "tr",
components: [ {
tag: "td",
attributes: {
colspan: "2"
},
components: [ {
name: "retweet",
kind: "Neo.RetweetInfo",
showing: !1
} ]
} ]
} ]
} ],
styles: {
backgroundColor: "rgb(255,255,255)",
textColor: "rgb(85,119,48)",
textSize: "16px",
textWeight: "400",
layout: "official",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(85,119,48)",
borderRightColor: "rgb(85,119,48)",
borderTopSize: "0px",
borderBottomSize: "0px",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
textColor: "",
textSize: "20px",
textWeight: "400",
textTransform: ""
},
classes: ""
},
officialCondensed: {
theme: [ {
tag: "table",
attributes: {
width: "100%"
},
components: [ {
tag: "tr",
components: [ {
tag: "td",
attributes: {
width: "70px"
},
components: [ {
name: "avatar",
kind: "Neo.Avatar"
} ]
}, {
tag: "td",
attributes: {
width: "100%"
},
components: [ {
components: [ {
kind: "FittableColumns",
fit: !0,
components: [ {
name: "header",
kind: "Neo.Header",
extra: {
name: "timestamp",
kind: "Neo.Timestamp"
}
} ]
}, {
name: "body",
kind: "Neo.Body"
} ]
} ]
} ]
}, {
tag: "tr",
components: [ {
tag: "td",
attributes: {
colspan: "2"
},
components: [ {
name: "retweet",
kind: "Neo.RetweetInfo",
classes: "neo-tweet-retweet-condensed",
showing: !1
} ]
} ]
} ]
} ],
styles: {
backgroundColor: "rgb(204,0,255)",
textColor: "rgb(255,204,0)",
textSize: "16px",
textWeight: "400",
layout: "officialCondensed",
textTransform: "",
borderLeftSize: "3px",
borderRightSize: "3px",
borderLeftColor: "rgb(255,204,0)",
borderRightColor: "rgb(255,204,0)",
borderTopSize: "0px",
borderBottomSize: "0px",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
textColor: "",
textSize: "20px",
textWeight: "400",
textTransform: ""
},
classes: ""
},
blue: {
styles: {
backgroundColor: "rgb(14,44,58)",
borderBottomColor: "rgb(184, 134, 11)",
borderBottomSize: "7px",
borderLeftColor: "rgb(91,108,72)",
borderLeftSize: "0px",
borderRightColor: "rgb(189, 183, 107)",
borderRightSize: "0px",
borderTopColor: "",
borderTopSize: "0px",
layout: "neo",
margin: "0px",
padding: "0px",
textColor: "rgb(189, 183, 107)",
textSize: "20px",
textTransform: "",
textWeight: "0"
},
highlight: {
textColor: "rgb(82,114,102)",
textSize: "14px",
textTransform: "",
textWeight: "0"
},
classes: ""
},
onyx: {
styles: {
layout: "neo"
},
highlight: {}
}
}
});

// large.js

enyo.kind({
name: "Neo.Tweet.large",
kind: "Neo.Tweet.small",
tweetChanged: function() {
this.inherited(arguments), this.$.tweet.applyStyle("font-size", "1.5em !important");
},
buildMediaPreviews: function() {
var e = this, t = new SpazImageURL, n = t.getThumbsForUrls(this.$.body.getContent()), r = t.getImagesForUrls(this.$.body.getContent()), i = 0;
this.imageFullUrls = [];
if (n) for (var s in n) {
var o = this.$.images.createComponent({
kind: "Image",
name: "imagePreview" + i,
style: "height: 10px;",
ontap: "imageClick",
src: n[s]
}, {
owner: this
});
o.render(), this.imageFullUrls.push(r[s]), i++;
} else jQuery("#" + this.$.tweet.id).embedly({
maxWidth: 300,
maxHeight: 300,
method: "afterParent",
wrapElement: "div",
classes: "thumbnails",
success: function(t, n) {
t.code.indexOf("<embed") === -1 ? e.$.images.createComponent({
kind: "enyo.Control",
owner: e,
components: [ {
style: "height: 10px;"
}, {
kind: "FittableColumns",
pack: "center",
components: [ {
name: "oembed_code",
allowHtml: !0,
content: t.code
} ]
} ]
}).render() : enyo.log("skipping oembed with <embed> tag in it", t.code);
}
});
this.render(), this.reflow();
}
});

// body.js

enyo.kind({
name: "Neo.Body",
allowHtml: !0,
classes: "neo-tweet-body  ",
create: function() {
this.inherited(arguments), this.applyStyle("overflow", "auto");
}
});

// header.js

enyo.kind({
name: "Neo.Header",
layoutKind: "FittableColumnsLayout",
style: "width: 100%;",
published: {
author_full: "",
author_short: "",
rt_full: "",
rt_short: "",
unread: !1,
favorite: !1,
"private": !1,
extra: null
},
components: [ {
name: "usernames",
style: "float: left;",
components: [ {
name: "author_short",
classes: "neo-tweet-big neo-tweet-username"
}, {
name: "author_full",
classes: "neo-tweet-bigger"
} ]
}, {
name: "extra",
layoutKind: "FittableColumnsLayout",
style: "float: right;",
components: [ {
name: "unread",
kind: "Neo.Icon",
icon: "flash",
classes: "",
style: "height: 13px; width: 13px;",
showing: !1
}, {
name: "favorite",
kind: "Neo.Icon",
icon: "heart",
classes: "",
style: "height: 13px; width: 13px;",
showing: !1
}, {
name: "private",
kind: "Neo.Icon",
icon: "lock_closed",
classes: "",
style: "height: 13px; width: 13px;",
showing: !1
} ]
} ],
create: function() {
this.inherited(arguments), this.extraChanged(), this.render(), this.log("yeah", this.private);
},
refresh: function() {
this.$.unread.iconChanged(), this.$.favorite.iconChanged(), this.$.private.iconChanged();
},
reset: function() {
for (var e in this.published) e != "extra" && this["set" + e[0].toUpperCase() + e.substr(1)](null);
},
author_fullChanged: function(e) {
this.$.author_full.setContent(this.author_full);
},
author_shortChanged: function(e) {
this.$.author_short.setContent(this.author_short);
},
rt_fullChanged: function(e) {},
rt_shortChanged: function(e) {},
unreadChanged: function(e) {
this.$.unread.setShowing(this.unread);
},
favoriteChanged: function(e) {
this.$.favorite.setShowing(this.favorite);
},
privateChanged: function(e) {
this.$.private.setShowing(this.private);
},
extraChanged: function(e) {
this.extra != null && this.$.extra.createComponent(this.extra, {
owner: this.owner
});
}
});

// timestamp.js

enyo.kind({
name: "Neo.Timestamp",
allowHtml: !0,
classes: "neo-tweet-timestamp"
});

// avatar.js

enyo.kind({
name: "Neo.Avatar",
components: [ {
name: "author",
kind: "Image",
classes: "neo-avatar"
}, {
name: "retweeter",
kind: "Image",
classes: "neo-avatar neo-avatar-retweet",
showing: !1
} ]
});

// retweet.js

enyo.kind({
name: "Neo.RetweetInfo",
kind: "Neo.Subtext",
classes: "neo-tweet-retweet",
layoutKind: "FittableColumnsLayout",
components: [ {
content: "Retweeted by"
}, {
classes: "username",
name: "username"
}, {
classes: "published",
name: "published"
} ]
});

// other.js

enyo.kind({
name: "Neo.Tweet.other",
kind: "Neo.Tweet.small",
published: {
show: [ "body" ]
},
create: function() {
this.inherited(arguments);
var e = [ "retweet", "timestamp", "header", "avatar", "body" ];
for (var t in e) this.$[e[t]].hide();
var n = this.show;
for (var t in n) this.$[n[t]].show();
}
});

// RichText.js

enyo.kind({
name: "Neo.RichText",
kind: "onyx.RichText",
classes: "onyx-input-decorator",
defaultFocus: !0,
richContent: !0,
published: {
maxTextHeight: null,
selection: null,
sample: !1,
preview: !1
},
handlers: {
onfocus: "focusHandler",
onblur: "blurHandler",
ontap: "tapHandler"
},
themes: {
neo: {
styles: {
backgroundColor: "rgb(0,0,0)",
textColor: "rgb(255,255,255)",
textSize: "23px",
textWeight: "900",
letterSpacing: "",
borderColor: "#4A4A4A",
borderWidth: "15px",
textTransform: "",
padding: "",
margin: "5px",
width: "500px"
},
classes: ""
},
aqua: {
styles: {},
classes: ""
},
onyx: {
styles: {},
highlight: {}
}
},
create: function() {
this.inherited(arguments), this.container.createComponent({
name: "themer",
kind: "Neo.ThemeFile",
type: "richText",
onUpdate: "updateTheme",
owner: this
}, {
owner: this
}), enyo.mixin(this.container.handlers, {
onUpdate: "updateTheme"
}), this.container.updateTheme = this.updateTheme.bind(this), this.container.addClass("onyx-input-decorator"), this.themeObj = this.$.themer.getStatics(), this.themeChanged(), this.$.themer.loadSaved();
},
themeChanged: function(e) {
var t = this.inherited(arguments);
return !this.hasNode() || this.preview !== !0 && this.sample !== !0 ? this.hasNode() || setTimeout(this.themeChanged.bind(this), 100) : (this.setValue(""), this.setValue(this.text)), t;
},
updateTheme: function(e, t) {
this.$.themer.stylize(t, this.container), this.$.themer.stylize(t, this), this.container.applyStyle("width", "auto"), this.themeChanged(), this.render();
},
focusHandler: function() {
var e = this.inherited(arguments);
return (this.sample === !0 || this.preview === !0) && this.hasNode() && this.node.blur(), e;
},
blurHandler: function() {
var e = this.inherited(arguments);
return e;
},
blur: function() {
this.hasNode() && this.node.blur(), enyo.Signals.send("onDeFocus"), this.inherited(arguments);
},
getValue: function() {
return !this.hasNode() || this.preview === !0 || this.sample === !0 ? "" : (this.eventNode.innerHTML = this.eventNode.innerHTML.replace(/\<br\>/g, ""), this.eventNode.innerHTML = this.eventNode.innerHTML.replace(/(\r\n|\n|\r)/gm, ""), this.eventNode.innerHTML.replace(/&nbsp;/g, " "));
},
getCharCount: function() {
return this.getValue().length;
},
tapHandler: function() {
if (this.sample && !this.preview) return this.$.themer.customize(), !1;
if (this.preview) return this.$.themer.preview(this.themePreview), !1;
}
});

// Icon.js

enyo.kind({
name: "Neo.Icon",
kind: "Image",
classes: "onyx-icon neo-icon",
published: {
icon: "",
type: "",
_res: "hdpi/",
_col: null,
_pre: "ic_action_",
_ext: ".png",
_intname: "home",
_fullpath: "",
_relpath: ""
},
AROOT: enyo.fetchAppRootPath(),
IROOT: "assets/icons/",
create: function() {
this.inherited(arguments);
},
rendered: function() {
var e = this.inherited(arguments);
return this.iconChanged(), e;
},
iconChanged: function(e) {
var t = this.icon;
this.setSrc(""), this.set_intname(t.search(".png") != -1 || t.search("http") != -1 ? t : this.externalToInternal(t)), this.generate(this._intname), this.setSrc(this._fullpath);
return;
var n, r;
},
generate: function(e) {
if (e.search(".png") != -1 || e.search("http") != -1) return this.set_relpath(e), this.set_fullpath(e);
this.setCloseColor();
var t = this._col || "white/", n = this.IROOT + t + this._res + this._pre + "" + e + "" + this._ext, r = this.AROOT + n;
this.set_relpath(n), this.set_fullpath(r);
},
setCloseColor: function() {
if (!document.getElementById(this.id) || this._col != null) return;
var e = this.getRGB(document.getElementById(this.id).style.color), t = this.getRGB(document.getElementById(this.id).style.backgroundColor), n = [ "black", "blue_dark", "blue_light", "green_dark", "green_light", "holo_dark", "holo_light", "purple_dark", "purple_light", "red_dark", "red_light", "white", "yellow_dark", "yellow_light" ], r = [ [ 0, 0, 0 ], [ 0, 153, 204 ], [ 81, 172, 190 ], [ 102, 153, 0 ], [ 153, 204, 0 ], [ 255, 255, 255 ], [ 123, 123, 123 ], [ 153, 51, 204 ], [ 170, 102, 204 ], [ 204, 0, 0 ], [ 255, 68, 68 ], [ 255, 255, 255 ], [ 255, 136, 0 ], [ 255, 187, 51 ] ], i = "", s = 765;
for (var o = 0; o < n.length; o++) {
var u = this.getColorDistance(e, r[o]);
u < s && (i = n[o], s = u);
var u = this.getColorDistance(t, r[o]);
u < s && (i = n[o], s = u);
}
i != "" && (this._col = i + "/");
},
getColorDistance: function(e, t) {
var n = Math.abs(e[0] - t[0]) + Math.abs(e[1] - t[1]) + Math.abs(e[2] - t[2]), r = e[0] - t[0];
r *= r;
var i = e[1] - t[1];
i *= i;
var s = e[2] - t[2];
s *= s;
var o = r + i + s, u = Math.sqrt(o);
return n;
},
getRGB: function(e) {
var t = "", n = this.createComponent({
tag: "div",
style: "color:" + e + ";"
}, {
owner: this
});
return n.render(), t = n.getComputedStyleValue("color"), n.destroy(), typeof t != "undefined" && (t = t.match(/\d+/g), t[0] = parseInt(t[0]), t[1] = parseInt(t[1]), t[2] = parseInt(t[2])), t || [ 0, 0, 0 ];
},
_whatWith: function(e, t) {
return {
_what: e,
_with: t
};
},
externalToInternal: function(e) {
var t = this._whatWith, n = [ t([ "conversation", "messages" ], "messages"), t([ "following", "followers", "accounts" ], "users"), t([ "favorited", "favorites" ], "star") ], r = {
_twitter: "twitter",
_filters: "filter",
_inbox: "inbox",
_search: "search",
_send: "send",
_refresh: "reload",
_help: "help",
_email: "mail",
_share: "share",
_compose: "edit",
_profile: "user",
_users: "users",
_lists: "list_2",
_delete: "trash",
_star: "star_10",
_unfavorited: "star_0",
_favorite: "star_10",
_close: "exit",
_reply: "goleft",
_retweet: "share_2",
_config: "gear",
_unpinned: "pin",
_mentions: "sms",
_block: "shield",
_unblock: "halt",
_messages: "dialog",
_pinned: "anchor",
_settings: "more",
_attach: "attachment_2",
_shorten: "link",
_trends: "sort_1",
_save: "download",
_load: "upload",
_forward: "arrow_right",
_back: "arrow_left",
_new: "edit",
_timeline: "home",
_mention: "happy",
_retweets: "share_2",
_outbox: "plane",
_follow: "signal",
_unfollow: "io"
}, i;
return enyo.forEach(n, function(t) {
enyo.indexOf(e, t._what) != -1 && (e = t._with);
}, this), i = r["_" + e], i && typeof i != undefined ? i : !i && e ? e : !i && !e ? "bug" : e ? e : "bug";
}
});

// QuickTheme.js

function getRGB(e) {
var t = "", n = neoapp.createComponent({
tag: "div",
style: "color:" + e + ";"
});
return n.render(), t = n.getComputedStyleValue("color"), n.destroy(), delete n, t;
}

function getRGBA(e, t) {
var n, r, i, s = function(e) {
var t = e;
try {
e.indexOf("rgb(") != -1 && (t = e.replace("rgb(", "").replace(")", "").replace("s", "").split(","));
} catch (n) {
return e;
}
return t;
};
return r = s(e), r.length == 3 ? n = r : n = getRGB(r), n = s(n), i = "rgba(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + t + ")", i;
}

enyo.kind({
name: "Neo.QuickTheme",
kind: "FittableRows",
classes: "enyo-fit neo-container",
fit: !0,
published: {
primary: "#00",
secondary: "#00",
alternate: "#00"
},
current: "",
components: [ {
kind: "Neo.Tweet.small",
theme: "neo",
name: "preview",
preview: "neo",
sample: !0,
themePreview: "neo",
showing: !1,
tweet: {
author_username: "Username",
author_fullname: "Full name",
text: "neo",
author_avatar: "assets/_icon.png",
publish_date: (new Date).toUTCString(),
spaz_id: -(Math.random() * 1e5),
reposter_username: "RepostUsername"
}
}, {
showing: !1,
kind: "onyx.InputDecorator",
components: [ {
kind: "Neo.RichText",
text: "neo",
themePreview: "neo",
name: "preview",
sample: !0
} ]
}, {
kind: "Neo.Toolbar",
header: "Quick Theme",
left: [ {
name: "exit",
kind: "Neo.Button",
ontap: "exit",
icon: "exit",
blue: !1,
style: "color: red !important;"
} ],
right: [ {
kind: "Neo.Button",
ontap: "select",
text: "Apply...",
blue: !1,
style: "color: green !important;"
} ]
}, {
name: "widgetBox",
kind: "Scroller",
touch: !0,
fit: !0,
components: [ {
kind: "ColorPicker",
onColorPick: "choose",
onColorSlide: "choose"
} ]
}, {
name: "selectMessage",
kind: "Scroller",
touch: !0,
fit: !0,
components: [ {
content: "Select 3 colours for Neo<br/>Tap apply to finish<br/>Tap the door to exit",
style: "font-size: 2em; text-transform: italics; font-weight: bold;",
allowHtml: !0
} ]
}, {
name: "spinner",
kind: "Neo.Spinner",
fit: !0,
showing: !1
}, {
kind: "Neo.Toolbar",
left: [ {
name: "primary",
kind: "Neo.ColorSquare",
ontap: "swap"
}, {
content: "Primary",
style: "-webkit-transform: rotateX(90)"
} ],
middle: [ {
name: "secondary",
kind: "Neo.ColorSquare",
ontap: "swap"
}, {
content: "Secondary"
} ],
right: [ {
content: "Alternate"
}, {
name: "alternate",
kind: "Neo.ColorSquare",
ontap: "swap"
} ]
} ],
create: function() {
this.inherited(arguments), this.showSelectMessage(!0), setTimeout(this.render.bind(this), 0);
var e = App.Prefs.get("neo-quicktheme-colors");
this.primary = e[0], this.secondary = e[1], this.alternate = e[2], this.$.primary.setColor(this.primary), this.$.secondary.setColor(this.secondary), this.$.alternate.setColor(this.alternate);
},
quickTheme: function(e) {
this.log(e), App.Prefs.set("neo-quicktheme-colors", e);
var t = e[0], n = e[1], r = e[2], i = {
button: {
defaultTheme: "blue",
themes: [ "neo", "aqua", "blue", "onyx" ],
styles: {
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null,
borderWidth: null,
borderColor: null,
cornerRadius: null
}
},
toolbar: {
defaultTheme: "kakhi",
themes: [ "neo", "kakhi", "onyx", "red", "steel", "blue", "green", "forest", "bruins" ],
styles: {
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null,
margin: null,
padding: null
}
},
sidebar: {
defaultTheme: "neo",
themes: [ "neo", "onyx" ],
styles: {
background: null,
borderColor: n,
borderWidth: null
}
},
sidebarItem: {
defaultTheme: "murky",
themes: [ "neo", "aqua", "murky", "onyx" ],
styles: {
width: null,
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null,
borderLeftSize: null,
borderRightSize: null,
borderLeftColor: n,
borderRightColor: n,
borderTopSize: null,
borderBottomSize: null,
borderTopColor: null,
borderBottomColor: n
},
highlight: {
backgroundColor: r,
textColor: t,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null,
borderLeftSize: null,
borderRightSize: null,
borderLeftColor: n,
borderRightColor: n,
borderTopSize: null,
borderBottomSize: null,
borderTopColor: n,
borderBottomColor: n
}
},
tweet: {
defaultTheme: "blue",
themes: [ "neo", "official", "officialCondensed", "blue", "onyx" ],
styles: {
layout: null,
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null,
borderLeftSize: null,
borderRightSize: null,
borderLeftColor: n,
borderRightColor: n,
borderTopSize: null,
borderBottomSize: null,
borderTopColor: n,
borderBottomColor: n,
padding: null,
margin: null
},
highlight: {
textColor: n,
textSize: null,
textWeight: null,
letterSpacing: null,
textTransform: null
}
},
popupList: {
defaultTheme: "cloudy",
themes: [ "neo", "cloudy", "onyx" ],
styles: {
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
borderColor: n,
borderWidth: null,
textTransform: null,
padding: null,
margin: null,
width: null
}
},
richText: {
defaultTheme: "neo",
themes: [ "neo", "onyx", "onyx" ],
styles: {
backgroundColor: t,
textColor: r,
textSize: null,
textWeight: null,
letterSpacing: null,
borderColor: n,
borderWidth: null,
textTransform: null,
padding: null,
margin: null,
width: null
}
}
};
this.log("BEGINNING TO LOAD QUICKTHEME...", t, n, r, i);
var s = 0;
for (var o in i) {
var u = i[o], a = {
theme: {
styles: u.styles,
highlight: u.highlight,
type: o,
name: "QuickTheme",
override: !0
}
};
setTimeout(function(e, t) {
this.log("loading...", e, t), enyo.Signals.send("saveQuickTheme", enyo.clone(t));
}.bind(this), 1e3 * s, o, a), s++;
}
this.log("SUCCESS!!!!!!!!!!!!!!!");
},
swap: function(e, t) {
this.log(e.name, e, t);
var n = this.current == e.name;
this.current = n ? null : e.name, this.showSelectMessage(n), this.$.primary.removeClass("neo-colorbox-selected"), this.$.secondary.addRemoveClass("neo-colorbox-selected"), this.$.alternate.addRemoveClass("neo-colorbox-selected"), n ? this.save(e.name) && this.showSelectMessage(!0) : (this.$[e.name].addClass("neo-colorbox-selected"), this.$.colorPicker.setColor(this[e.name])), this.reflow();
},
showSelectMessage: function(e) {
this.log(e), this.$.widgetBox.setShowing(!e), this.$.selectMessage.setShowing(e), this.render(), this.reflow();
},
choose: function(e, t) {
var n = getRGBA(e.color, e.opacity);
this.log("COLOR SELECTED: ", n), this.$[this.current].setColor(n), this[this.current] = n;
},
save: function(e) {
if (!this.current || this.current == "") return;
var t;
this.log("saving...", e, t = this.$[this.current].getColor()), this[e] = t;
},
select: function() {
var e = [ this.primary, this.secondary, this.alternate ];
this.log(e), this.quickTheme(e), this.spinner(!0), setTimeout(this.finish.bind(this), 7300);
},
spinner: function(e) {
this.log(e ? "showing" : "hiding"), this.$.spinner.setShowing(e), this.$.widgetBox.setShowing(!e), this.reflow(), this.render();
},
finish: function() {
window.saving = {}, this.spinner(!1), this.exit();
},
exit: function(e, t) {
this.bubbleUp("destroyBox", t);
},
getPreview: function(e, t, n, r) {
var i = [], s = {
name: "preview",
preview: !0,
sample: r,
themePreview: n
};
switch (t) {
case "button":
_cmp = enyo.mixin({
kind: "Neo.Button",
text: n,
icon: "settings",
collapse: !1
}, s);
break;
case "toolbar":
_cmp = enyo.mixin({
kind: "Neo.Toolbar",
header: n,
style: "max-height: 75px;"
}, s);
break;
case "sidebarItem":
_cmp = enyo.mixin({
kind: "Neo.SidebarItem",
title: n,
icon: "gear"
}, s), i.push(_cmp), _cmp = enyo.mixin(s, {
name: "previewH",
kind: "Neo.SidebarItem",
icon: "gear",
title: n + " Selected",
highlighted: !0
});
break;
case "tweet":
_cmp = enyo.mixin({
kind: "Neo.Tweet.small",
theme: n,
tweet: {
author_username: "Username",
author_fullname: "Full name",
text: n,
author_avatar: "assets/_icon.png",
publish_date: (new Date).toUTCString(),
spaz_id: -(Math.random() * 1e5),
reposter_username: "RepostUsername"
}
}, s);
break;
case "popupList":
_cmp = {
kind: "onyx.PickerDecorator",
components: [ {
content: n
}, enyo.mixin({
kind: "Neo.PopupList",
components: [ {
content: "Customize"
} ]
}, s) ]
};
break;
case "richText":
_cmp = {
kind: "onyx.InputDecorator",
components: [ enyo.mixin({
kind: "Neo.RichText",
text: n,
themePreview: n
}, s) ]
};
}
return this.log(_cmp), i.push(_cmp), i;
}
});

// TweakElements.js

enyo.kind({
name: "Neo.TweakElements",
classes: "neo-themes",
layoutKind: "FittableRowsLayout",
style: "",
fit: !0,
events: {
onClose: ""
},
published: {
themeName: "",
validTheme: !1,
customizer: {},
type: "",
element: "",
themes: {},
presets: [],
preset: "",
colors: [ "custom", "transparent", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "yellowgreen" ]
},
components: [ {
name: "signals",
kind: "Signals",
customize: "customize"
}, {
name: "toptool",
kind: "Neo.Toolbar",
header: "Tweak Elements",
onClose: "close",
closeable: !0,
right: [ {
name: "caption",
classes: "neo-themes-caption",
content: "Change everything. Again."
} ]
}, {
name: "spinner",
kind: "Neo.Spinner",
fit: !0,
showing: !1
}, {
name: "themer",
kind: "Panels",
fit: !0,
index: 0,
draggable: !1,
components: [ {
name: "sampler",
kind: "Scroller",
thumb: !1,
classes: "enyo-fit",
touch: !0,
horizontal: "hidden",
components: [ {
kind: "Neo.Toolbar",
header: "Toolbar",
style: "max-height: 75px;",
sample: !0
}, {
kind: "Neo.SidebarItem",
icon: "",
title: "Sidebar Item",
sample: !0,
icon: "gear"
}, {
name: "sidebarHighlight",
kind: "Neo.SidebarItem",
icon: "",
title: "Sidebar Item Selected",
sample: !0,
selected: !0,
icon: "gear"
}, {
name: "tweetSmall",
kind: "Neo.Tweet.small",
sample: !0
}, {
name: "tweetLarge",
kind: "Neo.Tweet.large",
sample: !0
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "richText",
kind: "Neo.RichText",
text: "Input box",
sample: !0
} ]
}, {
kind: "Neo.Button",
text: "Button",
icon: "settings",
collapse: !1,
sample: !0
}, {
kind: "onyx.PickerDecorator",
components: [ {
content: "Popup List"
}, {
kind: "Neo.PopupList",
components: [ {
content: "Customize"
} ],
sample: !0
} ]
} ]
}, {
name: "customizer",
classes: "neo-container enyo-fit",
components: [ {
name: "presetBox",
kind: "Scroller",
touch: !0,
thumb: !1,
classes: "enyo-fit",
components: [ {
content: "Choose a preset to build from"
}, {
name: "presets",
kind: "Repeater",
classes: "list",
fit: !0,
onSetupItem: "setupPreset",
components: [ {
name: "preset",
ontap: "presetTap"
} ]
} ]
}, {
name: "builderBox",
classes: "enyo-fit",
layoutKind: "FittableRowsLayout",
fit: !0,
components: [ {
content: "Customize your theme",
classes: "onyx-groupbox-header"
}, {
name: "livePreview",
saveable: !0,
style: "margin:auto;"
}, {
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
components: [ {
content: "Theme Name",
classes: "onyx-groupbox-header"
}, {
style: "max-width: 300px; text-align: center; margin: auto;",
classes: "compose onyx-groupbox",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
name: "nameInput",
kind: "onyx.Input",
style: "width: 200px; color: black;",
oninput: "keypress"
} ]
} ]
}, {
name: "builder",
kind: "Repeater",
onSetupItem: "setupCustomizer",
onUpdate: "updateBuilder",
components: [ {
name: "title",
classes: "onyx-groupbox-header",
ontap: "toggleDrawer"
}, {
name: "drawer",
kind: "onyx.Drawer",
style: "max-width: 300px; text-align: center; margin: auto; border: none;",
classes: "onyx-groupbox",
components: [ {
name: "builderPopup",
showing: !1,
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton"
}, {
name: "builderPopupList",
kind: "Neo.PopupList"
} ]
}, {
name: "builderColor",
kind: "Neo.ColorBuilder",
showing: !1
}, {
name: "builderPattern",
showing: !1,
components: [ {
content: "Pattern",
classes: "onyx-groupbox-header"
}, {
name: "builderPatternOpacitySlider",
onChange: "sliding",
onChanging: "sliding",
kind: "onyx.Slider"
} ]
}, {
name: "builderSize",
showing: !1,
components: [ {
content: "Size",
classes: "onyx-groupbox-header"
}, {
name: "builderSizeSlider",
kind: "onyx.Slider",
onChange: "sliding",
onChanging: "sliding",
min: -10,
max: 40
} ]
}, {
name: "builderInput",
showing: !1,
classes: "compose",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
name: "customizeInput",
kind: "onyx.Input",
style: "width: 200px; color: black;",
oninput: "keypress"
} ]
} ]
} ]
} ]
} ]
} ]
} ]
} ]
}, {
name: "bottomtool",
kind: "Neo.Toolbar",
middle: [ {
name: "back",
kind: "Neo.Button",
ontap: "reset",
text: "Back",
icon: "back"
}, {
kind: "Neo.Button",
ontap: "close",
text: "Close",
icon: "close"
}, {
name: "deleteTheme",
kind: "Neo.Button",
ontap: "deleteTheme",
text: "Delete",
icon: "delete"
}, {
name: "save",
kind: "Neo.Button",
ontap: "save",
text: "Save",
icon: "save"
}, {
name: "load",
kind: "Neo.Button",
ontap: "load",
text: "Load",
icon: "load"
}, {
name: "email",
kind: "Neo.Button",
ontap: "email",
text: "Email",
icon: "email"
} ]
} ],
create: function() {
this.inherited(arguments);
},
toggleDrawer: function(e, t) {
this.togglenext = !0, this.$.builder.renderRow(t.index);
},
themeNameChanged: function(e) {
var t = !1, n = this.getCustom() || {}, r = n[this.themeName];
this.$.deleteTheme.setShowing(r), this.$.nameInput.addRemoveClass("validExists", r);
for (var i in this.getElement().themes) this.getElement().themes[i].toLowerCase() == this.getThemeName().toLowerCase() && (t = !0);
this.setValidTheme(!t || !!r);
},
validThemeChanged: function(e) {
var t = this.getValidTheme();
this.log(t), this.$.nameInput.addRemoveClass("invalid", !t), this.$.nameInput.addRemoveClass("valid", t);
},
elementChanged: function(e) {},
customize: function(e, t) {
var n = JSON.parse(t.theme);
this.spinner(!0), this.$.back.show(), this.setElement(n.element), this.getElement().highlight || (this.element.highlight = {}), this.setType(n.type), this.setThemes(enyo.mixin(n.themes, {
custom: {
styles: n.styles,
highlight: n.highlight
}
})), this.$.themer.setIndex(1), this.$.builderBox.hide(), this.$.sampler.hide(), this.$.presetBox.show(), this.$.customizer.show();
var r = [], i = this.getElement().themes.concat([ "custom" ]);
for (var s in i) r.push({
preview: !0,
themePreview: i[s],
type: this.type
});
r[r.length - 1].last = !0, setTimeout(enyo.bind(this, function() {
this.setPresets(r), this.$.presets.setCount(r.length), this.$.presets.build();
}), 100);
},
setupPreset: function(e, t) {
var n = t.index, r = this.getPresets()[n], i = this.getPreview(n, this.getType(), r.themePreview, !0);
t.item.$.preset.destroyClientControls(), t.item.$.preset.createComponents(i), enyo.forEach(t.item.$.preset.children, function(e) {
var t = e;
!e.$.themer && e.children[1] && e.children[1].kind != "Neo.ThemeFile" ? e = e.children[1] : e.$.themer || (e = t.children[0]), e.$.themer.preview(e.themePreview), e.selectItem && e.selectItem(e.highlighted), t.render();
}, this), t.item.$.preset.render(), r.last && this.spinner(!1);
},
presetTap: function(e, t) {
this.log(), this.spinner(!0);
var n = [ "save", "load", "email", "builderBox" ], r = e.children[0], i = t.index, s, o = this.getCustom(), u = this.getElement();
this.log(copy(u), copy(this.getElement()));
if (r.name == "pickerDecorator" && r.children[1].showing == 1) return;
for (var a in n) this.$[n[a]].show();
this.$.presetBox.hide(), this.setPreset(this.presets[i]), s = this.getPreset().themePreview;
var f = {};
f.styles = u.styles, f.highlight = u.highlight, f.master = [];
var l = this.getThemes()[s];
for (var c in l.styles) f.styles[c] = l.styles[c];
for (var c in l.highlight) f.highlight[c] = l.highlight[c];
this.setCustomizer(f);
for (var h in this.getCustomizer().styles) this.customizer.master.push(h);
for (var h in this.getCustomizer().highlight) this.customizer.master.push("highlight " + h);
o && o[s] && (this.$.nameInput.setValue(s), this.setThemeName(s), this.$.deleteTheme.show()), setTimeout(enyo.bind(this, function() {
var e = this.getPreview(50, this.getType(), s, !1);
this.$.livePreview.destroyClientControls(), this.$.livePreview.createComponents(e, {
owner: this
}), this.$.livePreview.render(), this.$.builder.setCount(this.getCustomizer().master.length), this.$.builder.build(), this.render(), this.reflow();
}), 100);
},
setupCustomizer: function(e, t) {
var n = t.index, r = t.item, i = r.$, s = undefined, o = "Size", u = "", a, f = this.getCustomizer().master[n], l = this.getCustomizer().styles, c;
if (typeof f === undefined) return;
f.indexOf("highlight") != -1 && (l = this.getCustomizer().highlight, f = f.substr(10)), c = l[f], a = l[f], f.toLowerCase().search("color") != -1 && (o = "Color"), f.toLowerCase().search("layout") != -1 && (o = "Input"), i.title.setContent(this.type + " " + (l == this.getCustomizer().highlight ? "highlight " : "") + f), i.inputDecorator.show();
switch (o) {
case "Size":
var h = this.getMinMax(f);
i.builderSizeSlider.setValue(parseInt(a)), i.builderSizeSlider.setMin(h[0]), i.builderSizeSlider.setMax(h[1]), i.builderSize.show();
break;
case "Color":
i.builderColor.setTitle(this.type + " " + (l == this.getCustomizer().highlight ? "highlight " : "") + f), i.builderColor.setType(this.getType()), i.builderColor.setHighlight(l == this.getCustomizer().highlight), i.builderColor.setColor(a), i.builderColor.setColors(this.getColors()), i.builderColor.show();
break;
case "Input":
i.customizeInput.setValue(a), i.builderInput.show();
break;
default:
i.builderPopup.show();
}
f.toLowerCase().search("background") != -1 && i.builderPattern.show(), n == this.getCustomizer().master.length - 1 && (this.updatePreview(), this.spinner(!1)), this.togglenext && i.drawer.setOpen(!i.drawer.open);
},
getPrepared: function() {
var e = this.getCustomizer(), t = {
styles: e.styles,
highlight: e.highlight,
type: this.getType()
};
return t;
},
loadAndSave: function() {
return !0;
},
load: function(e, t) {
var n = this.getPrepared();
this.spinner(!0), this.log(copy(n), copy(this.getElement())), enyo.Signals.send("loadCustom", {
theme: JSON.stringify(n)
}), this.reset();
},
save: function(e, t) {
this.spinner(!0);
var n = this.getPrepared(), r = this.getThemeName().toLowerCase();
this.log(n, r, this.getValidTheme(), this.$.nameInput.getValue(), this);
if (!r || !this.getValidTheme()) return this.spinner(!1);
n.name = r, this.log(copy(n), copy(this.getElement())), enyo.Signals.send("saveToThemesList", {
theme: JSON.stringify(n)
}), this.reset();
},
deleteTheme: function(e, t) {
this.spinner(!0), enyo.Signals.send("deleteTheme", {
type: this.getType(),
theme: this.getThemeName(),
callback: function(e) {
e && this.reset();
}.bind(this)
});
},
email: function(e, t) {
AppUtils.sendEmail({
to: [ {
name: "Neo",
address: "fxjmapps@gmail.com"
} ],
subject: "My Neo theme: " + this.getThemeName() + " " + this.getType(),
msg: enyo.json.stringify(this.customizer)
});
},
choosePreset: function(e, t) {
this.spinner(!0), enyo.Signals.send("loadTheme", {
type: this.getType(),
theme: t.selected.value
}), this.reset();
},
close: function(e, t) {
this.log(), this.$.richText.blur(), this.bubbleUp("destroyBox");
},
keypress: function(e, t) {
var n = t.index, r = e.getValue(), i = this.$.builder.children[n], s;
this.log(e, t, r);
if (e.name == "nameInput") return this.setThemeName(r);
s = i.$.title.getContent().substr(this.getType().length + 1).toLowerCase();
switch (s) {
case "layout":
enyo.forEach(this.$.livePreview.children, function(e) {
e.$.themer.validate(r) && (this.getCustomizer().styles.layout = r);
}.bind(this)), this.updatePreview();
}
},
sliding: function(e, t) {
var n = {}, r = !1, i = t.index, s = e.parent.name, o = this.$.builder.children[i], u = o.$.title.getContent().substr(this.type.length + 1), a = u.toLowerCase().search("highlight");
a != -1 && (r = !0, u = u.substr(a + 10));
switch (s) {
case "builderColor":
n[u] = "rgb(" + Math.round(o.$.builderRedSlider.getValue()) + "," + Math.round(o.$.builderGreenSlider.getValue()) + "," + Math.round(o.$.builderBlueSlider.getValue()) + ")";
break;
case "builderSize":
var f = Math.round(o.$.builderSizeSlider.getValue());
u.toLowerCase().search("weight") >= 0 ? n[u] = f + "" : n[u] = f + "px";
}
r != 1 ? this.customizer.styles = enyo.mixin(this.customizer.styles, n) : this.customizer.highlight = enyo.mixin(this.customizer.highlight, n), this.updatePreview();
},
pickColor: function(e, t) {
var n = {}, r = !1, i = e.selected.content, s = t.index, o = this.$.builder.children[s], u = o.$.title.getContent().substr(this.type.length + 1), a = u.toLowerCase().search("highlight");
a != -1 && (r = !0, u = u.substr(a + 10));
switch (i) {
case "custom":
break;
case "transparent":
break;
default:
var f = this.getRGB(i), l = f.match(/\d+/g);
l == null && (l = [ 0, 0, 0 ]), o.$.builderRedSlider.setValue(l[0]), o.$.builderGreenSlider.setValue(l[1]), o.$.builderBlueSlider.setValue(l[2]), n[u] = f, r != 1 ? this.customizer.styles = enyo.mixin(this.customizer.styles, n) : this.customizer.highlight = enyo.mixin(this.customizer.highlight, n), this.updatePreview();
}
},
updateBuilder: function(e, t) {
var n = t.customizer;
enyo.mixin(this.customizer, t.customizer), this.updatePreview();
},
getPreview: function(e, t, n, r) {
var i = [], s = {
name: "preview",
preview: !0,
sample: r,
themePreview: n
};
switch (t) {
case "button":
_cmp = enyo.mixin({
kind: "Neo.Button",
text: n,
icon: "settings",
collapse: !1
}, s);
break;
case "toolbar":
_cmp = enyo.mixin({
kind: "Neo.Toolbar",
header: n,
style: "max-height: 75px;"
}, s);
break;
case "sidebarItem":
_cmp = enyo.mixin({
kind: "Neo.SidebarItem",
title: n,
icon: "gear"
}, s), i.push(_cmp), _cmp = enyo.mixin(s, {
name: "previewH",
kind: "Neo.SidebarItem",
icon: "gear",
title: n + " Selected",
highlighted: !0
});
break;
case "tweet":
_cmp = enyo.mixin({
kind: "Neo.Tweet.small",
theme: n,
tweet: {
author_username: "Username",
author_fullname: "Full name",
text: n,
author_avatar: "assets/_icon.png",
publish_date: (new Date).toUTCString(),
spaz_id: -(Math.random() * 1e5),
reposter_username: "RepostUsername"
}
}, s);
break;
case "popupList":
_cmp = {
kind: "onyx.PickerDecorator",
components: [ {
content: n
}, enyo.mixin({
kind: "Neo.PopupList",
components: [ {
content: "Customize"
} ]
}, s) ]
};
break;
case "richText":
_cmp = {
kind: "onyx.InputDecorator",
components: [ enyo.mixin({
kind: "Neo.RichText",
text: n,
themePreview: n
}, s) ]
};
}
return i.push(_cmp), i;
},
updatePreview: function() {
var e = this.getCustomizer().styles, t = this.getCustomizer().highlight;
enyo.forEach(this.$.livePreview.children, function(n) {
var r = n;
!n.$.themer && n.children[1] && n.children[1].kind != "Neo.ThemeFile" ? n = n.children[1] : n.$.themer || (n = r.children[0]), n.$.themer.updatePreview(e, t), r.render();
}.bind(this));
},
getMinMax: function(e) {
var t = 0, n = 100;
switch (e) {
case "textSize":
n = 40;
break;
case "borderWidth":
case "borderTopSize":
case "borderRightSize":
case "borderBottomSize":
case "borderLeftSize":
n = 30;
break;
case "padding":
case "margin":
n = 50;
break;
case "letterSpacing":
t = -10, n = 10;
break;
case "cornerRadius":
n = 40;
break;
case "textWeight":
n = 900;
break;
case "width":
case "height":
n = 500;
}
return [ t, n ];
},
reset: function() {
var e = [ "back", "save", "load", "email", "deleteTheme", "builderBox", "customizer" ], t = {
author_username: "Username",
author_fullname: "Full name",
text: "This is a small tweet.",
author_avatar: "assets/_icon.png",
publish_date: (new Date).toUTCString(),
spaz_id: 1,
reposter_username: "RepostUsername"
}, n = enyo.mixin(copy(t), {
text: "This is a large tweet.",
spaz_id: 2
});
for (var r in e) this.$[e[r]].hide();
this.published = copy(this.publishedDefaults), this.$.themer.setIndex(0), this.$.nameInput.setValue(""), this.$.presetBox.show(), this.$.sampler.show(), this.$.tweetSmall.setTweet(t), this.$.tweetLarge.setTweet(n), this.$.sidebarHighlight.selectItem(!0), enyo.Signals.send("setFullscreen", !0), this.spinner(!1), this.$.richText.blur();
},
getCustom: function() {
try {
var e = JSON.parse(App.Prefs.get(this.getType() + "_customThemes")) || {};
} catch (t) {
e = {};
}
return e == {} && App.Prefs.set(this.getType() + "_customThemes", e), e = enyo.clone(e), e;
},
spinner: function(e) {
this.log(e ? "showing" : "hiding"), this.$.spinner.setShowing(e), this.$.themer.setShowing(!e), this.reflow(), this.render();
}
});

// ColorSquare.js

enyo.kind({
name: "Neo.ColorSquare",
kind: "FittableColumns",
style: "width: 200px; height: 100px; margin: auto; border: 2px solid white; background-color: black;",
published: {
color: "",
notap: !1
},
handlers: {
ontap: "handleTapped"
},
components: [ {
name: "color",
classes: "enyo-fit"
}, {
name: "nocolmsg",
showing: !1,
style: "color: white;",
content: "Tap to choose..."
} ],
create: function() {
this.inherited(arguments), this.colorChanged();
},
handleTapped: function(e, t) {
if (this.notap) return !0;
this.openPicker();
},
colorChanged: function(e) {
this.$.nocolmsg.setShowing(!1), this.color ? this.$.color.applyStyle("background-color", this.color) : this.setNoColor();
},
setNoColor: function() {
this.$.nocolmsg.setShowing(!0), this.$.color.applyStyle("background-color", null);
},
openPicker: function() {
console.log("opening picker........");
}
});

// basic.js

enyo.kind({
name: "Neo.Themes_basic",
classes: "neo-themes",
style: "color: white;",
fit: !0,
events: {
onClose: ""
},
colors: [ "custom", "transparent", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "yellowgreen" ],
published: {},
components: [ {
name: "page",
components: [ {
content: "Primary color"
}, {
name: "pri",
kind: "Neo.Themes_ColorSquare",
ontap: "beginSelection"
}, {
content: "Secondary color"
}, {
name: "sec",
kind: "Neo.Themes_ColorSquare"
}, {
content: "Alternate color"
}, {
name: "alt",
kind: "Neo.Themes_ColorSquare"
}, {
content: "COMING SOON...",
style: "color: red; text-transform: italics;"
}, {
fit: !0
}, {
name: "bottomtool",
kind: "Neo.Toolbar",
middle: [ {
kind: "Neo.Button",
ontap: "close",
text: "Apply",
icon: "close"
}, {
kind: "Neo.Button",
ontap: "close",
text: "Cancel",
icon: "close"
} ]
} ]
}, {
name: "extras"
} ],
create: function() {
this.inherited(arguments), this.beginSelection();
},
beginSelection: function(e, t) {
this.$.extras.destroyClientControls(), this.$.extras.setShowing(!0), this.$.page.setShowing(!1), this.$.extras.createComponent({
name: "colorpage",
kind: "Neo.Themes_ColorPage",
fit: !0,
layoutKind: "FittableRowsLayout"
}, {
owner: this
}), this.$.extras.render(), this.reflow();
},
close: function(e, t) {
this.log(), this.bubbleUp("destroyBox");
}
});

// Color.js

enyo.kind({
name: "Neo.ColorBuilder",
kind: "FittableRows",
style: "width: 200px; margin: auto; border: 2px solid white; background-color: black;",
published: {
color: "",
colors: [],
title: "",
highlight: "",
type: ""
},
components: [ {
content: "Red",
classes: "onyx-groupbox-header"
}, {
name: "builderRedSlider",
onChange: "sliding",
onChanging: "sliding",
kind: "onyx.Slider",
min: 0,
max: 255
}, {
content: "Green",
classes: "onyx-groupbox-header"
}, {
name: "builderGreenSlider",
onChange: "sliding",
onChanging: "sliding",
kind: "onyx.Slider",
min: 0,
max: 255
}, {
content: "Blue",
classes: "onyx-groupbox-header"
}, {
name: "builderBlueSlider",
onChange: "sliding",
onChanging: "sliding",
kind: "onyx.Slider",
min: 0,
max: 255
}, {
content: "Opacity",
classes: "onyx-groupbox-header"
}, {
name: "builderOpacitySlider",
onChange: "sliding",
onChanging: "sliding",
kind: "onyx.Slider",
min: 0,
max: 1
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton"
}, {
name: "builderColorPicker",
kind: "Neo.PopupList",
onSelect: "pickColor",
style: "min-width: 250px;"
} ]
} ],
create: function() {
this.inherited(arguments);
},
sliding: function(e, t) {
var n = {}, r = t.index, i = e.parent.name, s = this.getTitle().substr(this.getType().length + 1), o = this.getHighlight();
o == 1 && (s = s.substr(o + 9)), n[s] = "rgba(" + Math.round(this.$.builderRedSlider.getValue()) + "," + Math.round(this.$.builderGreenSlider.getValue()) + "," + Math.round(this.$.builderBlueSlider.getValue()) + "," + this.$.builderOpacitySlider.getValue() + ")", this.send(n, o);
},
pickColor: function(e, t) {
var n = {}, r = e.selected.content, i = t.index, s = e.parent.name, o = this.getTitle().substr(this.getType().length + 1), u = this.getHighlight();
u == 1 && (o = o.substr(u + 9));
switch (r) {
case "custom":
break;
case "transparent":
break;
default:
var a = getRGBA(r, 1), f = a.match(/\d+/g);
f == null && (f = [ 0, 0, 0, 0 ]), this.$.builderRedSlider.setValue(f[0]), this.$.builderGreenSlider.setValue(f[1]), this.$.builderBlueSlider.setValue(f[2]), this.$.builderOpacitySlider.setValue(f[3]), n[o] = a, this.send(n, u);
}
},
send: function(e, t) {
var n = "{" + (t ? '"highlight":' : '"styles":') + JSON.stringify(e) + "}", r = JSON.parse(n);
this.bubbleUp("onUpdate", {
customizer: r
});
},
handleTapped: function(e, t) {
if (this.notap) return !0;
this.openPicker();
},
colorChanged: function(e) {
var t = this.getColor() || "", n = t.match(/\d+/g), r = [];
n == null && (n = getRGBA(t).match(/\d+/g), n == null && (n = [ 0, 0, 0, 0 ])), this.$.builderRedSlider.setValue(n[0]), this.$.builderGreenSlider.setValue(n[1]), this.$.builderBlueSlider.setValue(n[2]), this.$.builderOpacitySlider.setValue(n[3] || 1);
},
colorsChanged: function(e) {
var t = [];
this.$.builderColorPicker.destroyClientControls();
for (var n in this.getColors()) t.push({
content: this.getColors()[n],
style: "background-color: " + this.getColors()[n] + " !important;",
active: parseInt(n) == 0
});
this.$.builderColorPicker.createComponents(t);
},
setNoColor: function() {
this.$.nocolmsg.setShowing(!0), this.$.color.applyStyle("background-color", null);
},
openPicker: function() {
console.log("opening picker........");
}
});

// Input.js



// Pattern.js



// Size.js



// ThemeFile.js

window.saving = {}, enyo.kind({
name: "Neo.ThemeFile",
kind: "Control",
showing: !1,
published: {
styles: {},
highlight: {},
theme: "",
type: "",
elements: [ "tweet", "toolbar", "subtext", "richText", "spinner", "sidebar", "button" ]
},
create: function() {
this.inherited(arguments), this.createComponent({
kind: "Signals",
loadTheme: "signalLoad",
saveTheme: "saveTheme",
saveQuickTheme: "saveQuickTheme",
loadCustom: "loadCustom",
saveToThemesList: "saveToThemesList",
deleteTheme: "deleteTheme"
}, {
owner: this
}), this.owner.loadTheme = this.loadTheme.bind(this);
},
themeChanged: function(e) {
var t = this.theme, n = this.getDefaults(), r = this.getCustom();
r[t] ? enyo.mixin(n, r[t]) : enyo.mixin(n, this._load()), this.setHighlight(n.highlight), this.setStyles(n.styles), this.bubble("onUpdate", n.styles || n);
},
highlightChanged: function(e) {
this.highlight || (this.highlight = {}), this.highlight = this.owner.highlight = copy(this.highlight);
},
stylesChanged: function(e) {
this.styles || (this.styles = {}), this.styles = copy(this.styles);
},
toCSS: function(e) {
switch (e) {
case "background":
return "background";
case "textColor":
return "color";
case "textSize":
return "font-size";
case "borderColor":
return "border-color";
case "borderWidth":
return "border-width";
case "borderTopSize":
return "border-top-width";
case "borderTopColor":
return "border-top-color";
case "borderRightSize":
return "border-right-width";
case "borderRightColor":
return "border-right-color";
case "borderBottomSize":
return "border-bottom-width";
case "borderBottomColor":
return "border-bottom-color";
case "borderLeftSize":
return "border-left-width";
case "borderLeftColor":
return "border-left-color";
case "padding":
return "padding";
case "margin":
return "margin";
case "backgroundColor":
case "highlightColor":
return "background-color";
case "letterSpacing":
return "letter-spacing";
case "cornerRadius":
return "border-radius";
case "textTransform":
return "text-transform";
case "textWeight":
return "font-weight";
default:
return e;
}
},
loadSaved: function() {
if (this.isPreview()) return this.preview(this.owner.themePreview);
try {
var e = this._load();
} catch (t) {
e = {};
}
if (e && e.name) this.loadTheme(e.name); else if (!e || !e.name) this.loadTheme(this.getStatics().defaultTheme), this.saveTheme();
},
customize: function() {
var e = this.getCustom(), t = this[this.getType()], n = [], r;
for (var i in e) enyo.indexOf(e[i].name, t.themes) == -1 && e[i].name && t.themes.push(e[i].name);
r = {
type: this.getType(),
element: t,
styles: this.loadStyles(),
highlight: this.loadHighlight(),
themes: enyo.mixin(copy(this.owner.themes), e)
}, this.log(this.getType(), r), enyo.Signals.send("customize", {
theme: JSON.stringify(r)
});
},
signalLoad: function(e, t) {
if (this.getType() === t.type || t.type === "override") t.theme == "saved" ? this.loadSaved() : this.loadTheme(t.theme);
},
saveQuickTheme: function(e, t) {
(!this.getType() || this.getType() == null) && this.log(this, this.getType(), e, t);
if (this.getType() != t.theme.type) return;
this.owner.sample = !0;
if (window.saving[this.getType()] != null) {
setTimeout(function() {
delete this.owner.sample;
}.bind(this), 4e3, this);
return;
}
window.saving[this.getType()] = !0;
var n = this.getCustom(), r = enyo.clone({
name: t.theme.name,
styles: t.theme.styles,
highlight: t.theme.highlight
});
this.theme = r.name, this.setStyles(r.styles), this.setHighlight(r.highlight), this.saveTheme(), this.saveCustom(r), enyo.Signals.send("loadTheme", {
type: this.getType(),
theme: r.name
});
},
stripNull: function(e) {
for (var t in e) (e[t] == null || !e[t]) && delete e[t];
},
saveToThemesList: function(e, t) {
var n = JSON.parse(t.theme);
if (!n.override || window.saving[this.getType()] != null) {
if (!this._fromThemes()) return;
if (!this.isPreview()) return;
}
var r = this.getCustom(), i = {
name: n.name,
styles: n.styles,
highlight: n.highlight
};
this.log(n), this.theme = i.name, this.setStyles(i.styles), this.setHighlight(i.highlight), this.saveTheme(), this.saveCustom(i), n.override || enyo.Signals.send("loadTheme", {
type: this.getType(),
theme: "saved"
});
},
_fromThemes: function() {
var e = this.owner.name != "preview" && this.owner.name != "previewH";
return !e;
},
loadCustom: function(e, t) {
var n = JSON.parse(t.theme);
if (!n.override) {
if (!this._fromThemes()) return;
if (!this.isPreview()) return;
}
this.getType() === n.type && (this.log(e, n), this.theme = "custom", this.setStyles(n.styles), this.setHighlight(n.highlight), this.saveTheme(), enyo.Signals.send("loadTheme", {
type: this.getType(),
theme: "saved"
}));
},
deleteTheme: function(e, t) {
if (!this.isPreview() || !t.theme) return;
try {
var n = JSON.parse(App.Prefs.get(t.type + "_customThemes"));
if (!n[t.theme]) return;
delete n[t.theme], App.Prefs.set(t.type + "_customThemes", JSON.stringify({})), enyo.forEach(n, function(e) {
this.saveCustom(e);
}, this);
var r = this[t.type].themes;
for (var i in r) r[i] == t.theme && r.splice(parseInt(i), 1);
t.callback && t.callback(!0);
} catch (s) {
t.callback && t.callback(!1);
}
},
updatePreview: function(e, t) {
this.setHighlight(t), this.setStyles(e), e.layout && this.validate(e.layout) && e.layout != "custom" && (this.theme = e.layout), this.bubble("onUpdate", e);
},
preview: function(e) {
if (!this.validate(e)) return this.deleteTheme(null, {
theme: e
});
var t = {}, n;
this.theme = e, t = this.getDefaults(), n = this.getCustom(), n[e] ? enyo.mixin(t, n[e]) : e === "custom" && enyo.mixin(t, this._load()), this.setHighlight(t.highlight), this.setStyles(t.styles), this.bubble("onUpdate", t.styles || t);
},
loadTheme: function(e) {
this.validate(e) || (e = this.getStatics().defaultTheme), this.setTheme(e);
},
stylize: function(e, t) {
this.stripNull(e);
for (var n in e) {
var r = e[n];
n = this.toCSS(n), n != "" ? t.applyStyle(n, r) : t.applyStyle(n, null);
}
},
saveTheme: function() {
if (!this.isSample()) return;
var e = this.getType() + "_theme", t = this.getStatics(), n = enyo.mixin({
name: this.theme,
styles: t.styles,
highlight: t.highlight
}, {
styles: this.getStyles(),
highlight: this.getHighlight()
});
this.log(e, n.name, n), n = JSON.stringify(n), App.Prefs.set(e, n);
},
saveCustom: function(e) {
var t = this.getCustom();
t[e.name] = e, this.log("Saving custom slot...", e.name, e, t), t = JSON.stringify(t), App.Prefs.set(this.getType() + "_customThemes", t);
},
loadStyles: function() {
var e = this.getType() + "_theme", t = JSON.parse(App.Prefs.get(e));
return this.setStyles({}), (!t || !t.name || !t.styles) && this.saveTheme(), t = JSON.parse(App.Prefs.get(e)) || {}, t.styles || (t.styles = this.getStatics().styles, enyo.mixin(t.styles, this.getDefaults().styles)), this.setStyles(t.styles), this.getStyles();
},
loadHighlight: function() {
var e = this.getType() + "_theme", t = JSON.parse(App.Prefs.get(e));
return this.setHighlight({}), (!t || !t.name || !t.highlight) && this.saveTheme(), t = JSON.parse(App.Prefs.get(e)) || {}, t.highlight || (t.highlight = this.getStatics().highlight, enyo.mixin(t.highlight, this.getDefaults().highlight)), this.setHighlight(t.highlight), this.getHighlight();
},
getStatics: function() {
var e = enyo.clone(this[this.getType()]);
return e;
},
getDefaults: function() {
var e = {};
return this.theme != "custom" && this.validate(this.theme) ? e = this.getOwnerTheme(this.theme) : this.theme == "custom" && this.validate(this.styles.layout) ? e = this.getOwnerTheme(this.styles.layout) : this.validate(this.getStatics().defaultTheme) && (e = this.getOwnerTheme(this.getStatics().defaultTheme)), e.theme || (e.theme = this.getOwnerTheme(this.getOwnerTheme(this.getStatics().defaultTheme).styles.layout).theme), e;
},
getOwnerTheme: function(e) {
var t = enyo.clone(this.owner.themes[e]) || {};
return t;
},
getCustom: function() {
try {
var e = JSON.parse(App.Prefs.get(this.getType() + "_customThemes")) || {};
} catch (t) {
e = {};
}
return e == {} && App.Prefs.set(this.getType() + "_customThemes", JSON.stringify(e)), e = enyo.clone(e), e;
},
_load: function() {
try {
var e = JSON.parse(App.Prefs.get(this.getType() + "_theme")) || {};
} catch (t) {
e = {};
}
return e;
},
validate: function(e) {
if (!e || typeof e === undefined || typeof e != "string") return !1;
var t;
if (e.toLowerCase() === "custom") return !0;
if (!this.getType() || !this[this.getType()]) return !1;
t = this[this.getType()].themes;
for (var n in t) if (t[n] == e) return !0;
return !1;
},
loadDefaults: function() {
this.loadTheme(this.getStatics().defaultTheme);
},
isPreview: function() {
return this.owner.preview === !0;
},
isSample: function() {
return this.owner.sample === !0;
},
button: {
defaultTheme: "blue",
themes: [ "neo", "aqua", "blue", "onyx" ],
styles: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
borderWidth: "",
borderColor: "",
cornerRadius: ""
}
},
toolbar: {
defaultTheme: "kakhi",
themes: [ "neo", "kakhi", "onyx", "red", "steel", "blue", "green", "forest", "bruins" ],
styles: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
margin: "",
padding: ""
}
},
sidebar: {
defaultTheme: "neo",
themes: [ "neo", "onyx" ],
styles: {
background: "",
borderColor: "",
borderWidth: ""
}
},
sidebarItem: {
defaultTheme: "murky",
themes: [ "neo", "aqua", "murky", "onyx" ],
styles: {
width: "",
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
borderLeftSize: "",
borderRightSize: "",
borderLeftColor: "",
borderRightColor: "",
borderTopSize: "",
borderBottomSize: "",
borderTopColor: "",
borderBottomColor: ""
},
highlight: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
borderLeftSize: "",
borderRightSize: "",
borderLeftColor: "",
borderRightColor: "",
borderTopSize: "",
borderBottomSize: "",
borderTopColor: "",
borderBottomColor: ""
}
},
tweet: {
defaultTheme: "blue",
themes: [ "neo", "official", "officialCondensed", "blue", "onyx" ],
styles: {
layout: "",
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: "",
borderLeftSize: "",
borderRightSize: "",
borderLeftColor: "",
borderRightColor: "",
borderTopSize: "",
borderBottomSize: "",
borderTopColor: "",
borderBottomColor: "",
padding: "",
margin: ""
},
highlight: {
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
textTransform: ""
}
},
popupList: {
defaultTheme: "cloudy",
themes: [ "neo", "cloudy", "onyx" ],
styles: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
borderColor: "",
borderWidth: "",
textTransform: "",
padding: "",
margin: "",
width: ""
}
},
richText: {
defaultTheme: "neo",
themes: [ "neo", "onyx", "onyx" ],
styles: {
backgroundColor: "",
textColor: "",
textSize: "",
textWeight: "",
letterSpacing: "",
borderColor: "",
borderWidth: "",
textTransform: "",
padding: "",
margin: "",
width: ""
}
}
});

// Themes.js

enyo.kind({
name: "Neo.Themes",
classes: "neo-themes",
layoutKind: "FittableRowsLayout",
events: {
onClose: ""
},
colors: [ "custom", "transparent", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "yellowgreen" ],
components: [ {
name: "signals",
kind: "Signals",
customize: "customize",
hidetools: "hideTools"
}, {
name: "toptool",
kind: "Neo.Toolbar",
header: "Themes",
onClose: "close",
closeable: !0,
right: [ {
name: "caption",
classes: "neo-themes-caption"
} ]
}, {
name: "box",
fit: !0,
kind: "FittableRows",
destroyBox: "reset"
} ],
startMenu: [ {
name: "startMenu",
onLoadBox: "loadBox",
kind: "Scroller",
touch: !0,
fit: !0,
components: [ {
content: "Please choose from one of the following options:",
style: "color: white; font-size: 2em; text-transform: italics;"
}, {
kind: "Neo.setting",
type: "button",
section: "QuickTheme",
title: "Apply theme to Neo",
mixin: {
text: "QuickTheme",
bubble: "onLoadBox",
box: "quickTheme",
icon: "magnet"
},
description: "Choose from Primary, Secondary, and Advanced colours, and let Neo decide which ones belong where with Neo SmartColor(tm) Technology"
}, {
kind: "Neo.setting",
type: "button",
section: "Tweak Elements",
title: "Customize individual elements of Neo",
mixin: {
text: "Tweak",
bubble: "onLoadBox",
box: "tweakElements",
icon: "lab"
},
description: "View live previews of Neo's elements. Modify an element's properties, apply CSS styles, and more. Choose from custom presets, or load one you've made before.. it's all there at your fingertips. QuickTheme compatible."
}, {
kind: "Neo.setting",
type: "button",
section: "Theme Manager",
title: "Manage Neo themes",
mixin: {
text: "Enter",
bubble: "onLoadBox",
box: "themeManager",
icon: "list"
},
description: "Neo themes provide enhanced theme capability by combining the ease of QuickThemes with the power of the theme elements. Create, remove, and reorder your favorite Neo themes for quick access. First, select which custom and premade themes belong to Neo's elements. Then save a name, add a colour for easy remembering, and you're done!You can now load your theme at any time, and Neo will remember which settings you chose. It's that easy! Also, you can view and manually edit your entire theme's CSS style here.If you so desire..."
}, {
kind: "Neo.setting",
type: "button",
section: "Help",
title: "Get help",
mixin: {
text: "Help Me",
bubble: "onLoadBox",
box: "help",
icon: "help"
},
description: "Display additional help information."
} ]
} ],
quickTheme: [ {
name: "quickTheme",
kind: "Neo.QuickTheme",
fit: !0,
layoutKind: "FittableRowsLayout"
} ],
tweakElements: [ {
name: "tweakElements",
kind: "Neo.TweakElements",
fit: !0,
layoutKind: "FittableRowsLayout"
} ],
create: function() {
this.inherited(arguments), this.reset();
},
destroyBox: function(e, t) {
return this.log(), this.$.box.destroyClientControls(), this.hideTools(null, {
hide: !1
}), this.render(), this.reflow(), this.$.caption.setContent(""), !0;
},
insertBox: function(e, t) {
var n = e.insert, r = e.hideToolbars || !1;
this.log(n);
if (!this[n]) return alert("NOTHING TO LOAD HERE.", this);
this.destroyBox(), this.$.box.createComponents(this[n], {
owner: this
}), this.$.box.render(), this.$[n].reset && this.$[n].reset(), this.hideTools(null, {
hide: r
});
},
hideTools: function(e, t) {
this.log(e, t);
var n;
t && t.hide != null ? n = t.hide : n = e, this.$.toptool.setShowing(!n), this.reflow();
},
loadBox: function(e, t) {
this.log(t.inSender.box);
var n = t.inSender.box;
if (!n) return this.reset() && alert("COMING SOON...", this);
this.insertBox({
insert: n,
hideToolbars: !0
});
},
reset: function(e, t) {
this.destroyBox(), this.insertBox({
insert: "startMenu",
hideToolbars: !1
});
},
close: function(e, t) {
this.hideTools(null, {
hide: !1
}), enyo.Signals.send("setFullscreen", !1), this.doClose();
}
});

// auth_config.js

var SPAZCORE_CONSUMERKEY_TWITTER = "SFn5ggxUBFQk5Gz6oRhA", SPAZCORE_CONSUMERSECRET_TWITTER = "CznCkWbKkhZ8BxOfJBXnljqhVAc1QRqIwj3qA6dkpuE";

// default_preferences.js

var SPAZ_DEFAULT_PREFS = {
last_username: null,
last_type: null,
last_userid: null,
users: [],
"always-go-to-my-timeline": !1,
"use-markdown": !0,
"sound-enabled": !0,
"vibration-enabled": !0,
"wilhelm-enabled": !0,
"network-refreshinterval": 9e5,
"network-autoadjustrefreshinterval": !0,
"notify-newmessages": !1,
"notify-mentions": !0,
"notify-dms": !0,
"notify-searchresults": !1,
"network-refresh-auto": !0,
"network-refresh-wake": !1,
"timeline-scrollonupdate": !0,
"timeline-maxtweets": 100,
"timeline-maxtweets-dm": 50,
"timeline-maxtweets-reply": 50,
"timeline-friends-getcount": 100,
"timeline-replies-getcount": 10,
"timeline-dm-getcount": 10,
"timeline-save-cache": !0,
"url-shortener": "j.mp",
"image-uploader": "twitpic",
"services-twitpic-sharepassword": !1,
"services-pingfm-userappkey": "",
"services-pingfm-enabled": !1,
"services-pingfm-sendreplies": !1,
"services-pingfm-updatetype": "default",
"services-pikchur-apikey": "aJMHC7eHRbhnA7FLdXmAtA",
"services-pikchur-source": "NjMw",
"services-bitly-apikey": "R_f3b86681a63a6bbefc7d8949fd915f1d",
"twitter-api-base-url": "https://twitter.com/",
"twitter-www-base-url": "http://twitter.com/",
"twitter-source": "spaz",
"tweet-tap": "panel",
"tweet-hold": "popup",
"save-on-exit": !0,
"scroll-behavior": 0,
"toolbar-hold": "mark-read",
"hide-when-minimized": !0,
maxTweets: 10,
maxCached: 10,
"post-rt-cursor-position": "beginning",
"post-send-on-enter": !0,
"refresh-after-posting": !0,
"run-lastVersion": "0.0.1",
"run-isFirst": !0,
"run-isNew": !0,
"run-count": 0
};

// consts.js

var SPAZ_TIMELINE_CACHE_MAXENTRIES = 100, SPAZ_TIMELINE_CACHE_MAXENTRIES_DM = 30, SPAZ_TIMELINE_CACHE_MAXENTRIES_REPLY = 30, SPAZ_RELATIVE_TIME_LABELS = {
now: "now",
seconds: "s",
minute: "m",
minutes: "m",
hour: "hr",
hours: "hr",
day: "d",
days: "d"
}, SPAZ_COLUMN_HOME = "home", SPAZ_COLUMN_UNIFIED = "unified", SPAZ_COLUMN_MENTIONS = "mentions", SPAZ_COLUMN_MESSAGES = "messages", SPAZ_COLUMN_TRENDS = "trends", SPAZ_COLUMN_SEARCH = "search", SPAZ_COLUMN_FAVORITES = "favorites", SPAZ_COLUMN_SENT = "sent", SPAZ_COLUMN_LIST = "list", SPAZ_COLUMN_RETWEETS = "retweets", SPAZ_COLUMN_FILTERS = "filters", SPAZ_COLUMN_TYPES = {};

SPAZ_COLUMN_TYPES[SPAZCORE_SERVICE_TWITTER] = [ SPAZ_COLUMN_HOME, SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_TRENDS, SPAZ_COLUMN_SEARCH, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT, SPAZ_COLUMN_LIST ], SPAZ_COLUMN_TYPES[SPAZCORE_SERVICE_IDENTICA] = [ SPAZ_COLUMN_HOME, SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_SEARCH, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT ], SPAZ_COLUMN_TYPES[SPAZCORE_SERVICE_CUSTOM] = [ SPAZ_COLUMN_HOME, SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_SEARCH, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT ];

var SPAZ_COLUMN_TYPES_ALL = {};

SPAZ_COLUMN_TYPES_ALL[SPAZCORE_SERVICE_TWITTER] = [ SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT ], SPAZ_COLUMN_TYPES_ALL[SPAZCORE_SERVICE_IDENTICA] = [ SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT ], SPAZ_COLUMN_TYPES_ALL[SPAZCORE_SERVICE_CUSTOM] = [ SPAZ_COLUMN_MENTIONS, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_FAVORITES, SPAZ_COLUMN_SENT ];

var SPAZ_ACCOUNT_ICONS = {};

SPAZ_ACCOUNT_ICONS[SPAZCORE_SERVICE_TWITTER] = "assets/images/account-icon-twitter.png", SPAZ_ACCOUNT_ICONS[SPAZCORE_SERVICE_IDENTICA] = "assets/images/account-icon-identica.png", SPAZ_ACCOUNT_ICONS[SPAZCORE_SERVICE_CUSTOM] = "assets/images/account-icon-custom.png";

var SPAZ_EMBEDLY_REGEX_WEBOS = /((http:\/\/(.*yfrog\..*\/.*|www\.flickr\.com\/photos\/.*|flic\.kr\/.*|twitpic\.com\/.*|www\.twitpic\.com\/.*|twitpic\.com\/photos\/.*|www\.twitpic\.com\/photos\/.*|.*imgur\.com\/.*|.*\.posterous\.com\/.*|post\.ly\/.*|twitgoo\.com\/.*|i.*\.photobucket\.com\/albums\/.*|s.*\.photobucket\.com\/albums\/.*|phodroid\.com\/.*\/.*\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.xkcd\.com\/.*|imgs\.xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.asofterworld\.com\/.*\.jpg|asofterworld\.com\/.*\.jpg|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|emberapp\.com\/.*\/images\/.*|emberapp\.com\/.*\/images\/.*\/sizes\/.*|emberapp\.com\/.*\/collections\/.*\/.*|emberapp\.com\/.*\/categories\/.*\/.*\/.*|embr\.it\/.*|picasaweb\.google\.com.*\/.*\/.*#.*|picasaweb\.google\.com.*\/lh\/photo\/.*|picasaweb\.google\.com.*\/.*\/.*|dailybooth\.com\/.*\/.*|brizzly\.com\/pic\/.*|pics\.brizzly\.com\/.*\.jpg|img\.ly\/.*|www\.tinypic\.com\/view\.php.*|tinypic\.com\/view\.php.*|www\.tinypic\.com\/player\.php.*|tinypic\.com\/player\.php.*|www\.tinypic\.com\/r\/.*\/.*|tinypic\.com\/r\/.*\/.*|.*\.tinypic\.com\/.*\.jpg|.*\.tinypic\.com\/.*\.png|meadd\.com\/.*\/.*|meadd\.com\/.*|.*\.deviantart\.com\/art\/.*|.*\.deviantart\.com\/gallery\/.*|.*\.deviantart\.com\/#\/.*|fav\.me\/.*|.*\.deviantart\.com|.*\.deviantart\.com\/gallery|.*\.deviantart\.com\/.*\/.*\.jpg|.*\.deviantart\.com\/.*\/.*\.gif|.*\.deviantart\.net\/.*\/.*\.jpg|.*\.deviantart\.net\/.*\/.*\.gif|www\.fotopedia\.com\/.*\/.*|fotopedia\.com\/.*\/.*|photozou\.jp\/photo\/show\/.*\/.*|photozou\.jp\/photo\/photo_only\/.*\/.*|instagr\.am\/p\/.*|instagram\.com\/p\/.*|skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|share\.ovi\.com\/media\/.*\/.*|www\.questionablecontent\.net\/|questionablecontent\.net\/|www\.questionablecontent\.net\/view\.php.*|questionablecontent\.net\/view\.php.*|questionablecontent\.net\/comics\/.*\.png|www\.questionablecontent\.net\/comics\/.*\.png|picplz\.com\/.*|twitrpix\.com\/.*|.*\.twitrpix\.com\/.*|www\.someecards\.com\/.*\/.*|someecards\.com\/.*\/.*|some\.ly\/.*|www\.some\.ly\/.*|pikchur\.com\/.*|achewood\.com\/.*|www\.achewood\.com\/.*|achewood\.com\/index\.php.*|www\.achewood\.com\/index\.php.*|www\.whosay\.com\/content\/.*|www\.whosay\.com\/photos\/.*|www\.whosay\.com\/videos\/.*|say\.ly\/.*|ow\.ly\/i\/.*|color\.com\/s\/.*|bnter\.com\/convo\/.*|mlkshk\.com\/p\/.*|lockerz\.com\/s\/.*|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*|www\.last\.fm\/music\/.*|www\.last\.fm\/music\/+videos\/.*|www\.last\.fm\/music\/+images\/.*|www\.last\.fm\/music\/.*\/_\/.*|www\.last\.fm\/music\/.*\/.*|www\.mixcloud\.com\/.*\/.*\/|www\.radionomy\.com\/.*\/radio\/.*|radionomy\.com\/.*\/radio\/.*|www\.hark\.com\/clips\/.*|www\.rdio\.com\/#\/artist\/.*\/album\/.*|www\.rdio\.com\/artist\/.*\/album\/.*|www\.zero-inch\.com\/.*|.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*|freemusicarchive\.org\/music\/.*|www\.freemusicarchive\.org\/music\/.*|freemusicarchive\.org\/curator\/.*|www\.freemusicarchive\.org\/curator\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/templates\/story\/story\.php.*|huffduffer\.com\/.*\/.*|www\.audioboo\.fm\/boos\/.*|audioboo\.fm\/boos\/.*|boo\.fm\/b.*|www\.xiami\.com\/song\/.*|xiami\.com\/song\/.*|www\.saynow\.com\/playMsg\.html.*|www\.saynow\.com\/playMsg\.html.*|grooveshark\.com\/.*|radioreddit\.com\/songs.*|www\.radioreddit\.com\/songs.*|radioreddit\.com\/\?q=songs.*|www\.radioreddit\.com\/\?q=songs.*|www\.gogoyoko\.com\/song\/.*|.*amazon\..*\/gp\/product\/.*|.*amazon\..*\/.*\/dp\/.*|.*amazon\..*\/dp\/.*|.*amazon\..*\/o\/ASIN\/.*|.*amazon\..*\/gp\/offer-listing\/.*|.*amazon\..*\/.*\/ASIN\/.*|.*amazon\..*\/gp\/product\/images\/.*|.*amazon\..*\/gp\/aw\/d\/.*|www\.amzn\.com\/.*|amzn\.com\/.*|www\.shopstyle\.com\/browse.*|www\.shopstyle\.com\/action\/apiVisitRetailer.*|api\.shopstyle\.com\/action\/apiVisitRetailer.*|www\.shopstyle\.com\/action\/viewLook.*|gist\.github\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.twitter\.com\/.*\/status\/.*|www\.twitter\.com\/.*\/statuses\/.*|mobile\.twitter\.com\/.*\/status\/.*|mobile\.twitter\.com\/.*\/statuses\/.*|www\.crunchbase\.com\/.*\/.*|crunchbase\.com\/.*\/.*|www\.slideshare\.net\/.*\/.*|www\.slideshare\.net\/mobile\/.*\/.*|slidesha\.re\/.*|scribd\.com\/doc\/.*|www\.scribd\.com\/doc\/.*|scribd\.com\/mobile\/documents\/.*|www\.scribd\.com\/mobile\/documents\/.*|screenr\.com\/.*|polldaddy\.com\/community\/poll\/.*|polldaddy\.com\/poll\/.*|answers\.polldaddy\.com\/poll\/.*|www\.5min\.com\/Video\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|www\.scrapblog\.com\/viewer\/viewer\.aspx.*|ping\.fm\/p\/.*|chart\.ly\/symbols\/.*|chart\.ly\/.*|maps\.google\.com\/maps\?.*|maps\.google\.com\/\?.*|maps\.google\.com\/maps\/ms\?.*|.*\.craigslist\.org\/.*\/.*|my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|www\.polleverywhere\.com\/polls\/.*|www\.polleverywhere\.com\/multiple_choice_polls\/.*|www\.polleverywhere\.com\/free_text_polls\/.*|www\.quantcast\.com\/wd:.*|www\.quantcast\.com\/.*|siteanalytics\.compete\.com\/.*|statsheet\.com\/statplot\/charts\/.*\/.*\/.*\/.*|statsheet\.com\/statplot\/charts\/e\/.*|statsheet\.com\/.*\/teams\/.*\/.*|statsheet\.com\/tools\/chartlets\?chart=.*|.*\.status\.net\/notice\/.*|identi\.ca\/notice\/.*|brainbird\.net\/notice\/.*|shitmydadsays\.com\/notice\/.*|www\.studivz\.net\/Profile\/.*|www\.studivz\.net\/l\/.*|www\.studivz\.net\/Groups\/Overview\/.*|www\.studivz\.net\/Gadgets\/Info\/.*|www\.studivz\.net\/Gadgets\/Install\/.*|www\.studivz\.net\/.*|www\.meinvz\.net\/Profile\/.*|www\.meinvz\.net\/l\/.*|www\.meinvz\.net\/Groups\/Overview\/.*|www\.meinvz\.net\/Gadgets\/Info\/.*|www\.meinvz\.net\/Gadgets\/Install\/.*|www\.meinvz\.net\/.*|www\.schuelervz\.net\/Profile\/.*|www\.schuelervz\.net\/l\/.*|www\.schuelervz\.net\/Groups\/Overview\/.*|www\.schuelervz\.net\/Gadgets\/Info\/.*|www\.schuelervz\.net\/Gadgets\/Install\/.*|www\.schuelervz\.net\/.*|myloc\.me\/.*|pastebin\.com\/.*|pastie\.org\/.*|www\.pastie\.org\/.*|redux\.com\/stream\/item\/.*\/.*|redux\.com\/f\/.*\/.*|www\.redux\.com\/stream\/item\/.*\/.*|www\.redux\.com\/f\/.*\/.*|cl\.ly\/.*|cl\.ly\/.*\/content|speakerdeck\.com\/u\/.*\/p\/.*|www\.kiva\.org\/lend\/.*|www\.timetoast\.com\/timelines\/.*|storify\.com\/.*\/.*|.*meetup\.com\/.*|meetu\.ps\/.*|www\.dailymile\.com\/people\/.*\/tweets\/.*|.*\.kinomap\.com\/.*|www\.metacdn\.com\/api\/users\/.*\/content\/.*|www\.metacdn\.com\/api\/users\/.*\/media\/.*|prezi\.com\/.*\/.*|.*\.uservoice\.com\/.*\/suggestions\/.*|formspring\.me\/.*|www\.formspring\.me\/.*|formspring\.me\/.*\/q\/.*|www\.formspring\.me\/.*\/q\/.*|twitlonger\.com\/show\/.*|www\.twitlonger\.com\/show\/.*|tl\.gd\/.*|www\.qwiki\.com\/q\/.*|crocodoc\.com\/.*|.*\.crocodoc\.com\/.*|www\.wikipedia\.org\/wiki\/.*|www\.wikimedia\.org\/wiki\/File.*|.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|youtu\.be\/.*|.*\.youtube\.com\/user\/.*|.*\.youtube\.com\/.*#.*\/.*|m\.youtube\.com\/watch.*|m\.youtube\.com\/index.*|.*\.youtube\.com\/profile.*|.*\.youtube\.com\/view_play_list.*|.*\.youtube\.com\/playlist.*|.*justin\.tv\/.*|.*justin\.tv\/.*\/b\/.*|.*justin\.tv\/.*\/w\/.*|www\.ustream\.tv\/recorded\/.*|www\.ustream\.tv\/channel\/.*|www\.ustream\.tv\/.*|qik\.com\/video\/.*|qik\.com\/.*|qik\.ly\/.*|.*revision3\.com\/.*|.*\.dailymotion\.com\/video\/.*|.*\.dailymotion\.com\/.*\/video\/.*|collegehumor\.com\/video:.*|collegehumor\.com\/video\/.*|www\.collegehumor\.com\/video:.*|www\.collegehumor\.com\/video\/.*|.*twitvid\.com\/.*|www\.break\.com\/.*\/.*|vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|www\.metacafe\.com\/watch\/.*|www\.metacafe\.com\/w\/.*|blip\.tv\/.*\/.*|.*\.blip\.tv\/.*\/.*|video\.google\.com\/videoplay\?.*|.*revver\.com\/video\/.*|video\.yahoo\.com\/watch\/.*\/.*|video\.yahoo\.com\/network\/.*|.*viddler\.com\/explore\/.*\/videos\/.*|liveleak\.com\/view\?.*|www\.liveleak\.com\/view\?.*|animoto\.com\/play\/.*|dotsub\.com\/view\/.*|www\.overstream\.net\/view\.php\?oid=.*|www\.livestream\.com\/.*|www\.worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|teachertube\.com\/viewVideo\.php.*|www\.teachertube\.com\/viewVideo\.php.*|www1\.teachertube\.com\/viewVideo\.php.*|www2\.teachertube\.com\/viewVideo\.php.*|bambuser\.com\/v\/.*|bambuser\.com\/channel\/.*|bambuser\.com\/channel\/.*\/broadcast\/.*|www\.schooltube\.com\/video\/.*\/.*|bigthink\.com\/ideas\/.*|bigthink\.com\/series\/.*|sendables\.jibjab\.com\/view\/.*|sendables\.jibjab\.com\/originals\/.*|www\.xtranormal\.com\/watch\/.*|socialcam\.com\/v\/.*|www\.socialcam\.com\/v\/.*|dipdive\.com\/media\/.*|dipdive\.com\/member\/.*\/media\/.*|dipdive\.com\/v\/.*|.*\.dipdive\.com\/media\/.*|.*\.dipdive\.com\/v\/.*|v\.youku\.com\/v_show\/.*\.html|v\.youku\.com\/v_playlist\/.*\.html|www\.snotr\.com\/video\/.*|snotr\.com\/video\/.*|video\.jardenberg\.se\/.*|www\.clipfish\.de\/.*\/.*\/video\/.*|www\.myvideo\.de\/watch\/.*|www\.whitehouse\.gov\/photos-and-video\/video\/.*|www\.whitehouse\.gov\/video\/.*|wh\.gov\/photos-and-video\/video\/.*|wh\.gov\/video\/.*|www\.hulu\.com\/watch.*|www\.hulu\.com\/w\/.*|hulu\.com\/watch.*|hulu\.com\/w\/.*|.*crackle\.com\/c\/.*|www\.fancast\.com\/.*\/videos|www\.funnyordie\.com\/videos\/.*|www\.funnyordie\.com\/m\/.*|funnyordie\.com\/videos\/.*|funnyordie\.com\/m\/.*|www\.vimeo\.com\/groups\/.*\/videos\/.*|www\.vimeo\.com\/.*|vimeo\.com\/groups\/.*\/videos\/.*|vimeo\.com\/.*|vimeo\.com\/m\/#\/.*|www\.ted\.com\/talks\/.*\.html.*|www\.ted\.com\/talks\/lang\/.*\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/lang\/.*\/.*\.html.*|.*nfb\.ca\/film\/.*|www\.thedailyshow\.com\/watch\/.*|www\.thedailyshow\.com\/full-episodes\/.*|www\.thedailyshow\.com\/collection\/.*\/.*\/.*|movies\.yahoo\.com\/movie\/.*\/video\/.*|movies\.yahoo\.com\/movie\/.*\/trailer|movies\.yahoo\.com\/movie\/.*\/video|www\.colbertnation\.com\/the-colbert-report-collections\/.*|www\.colbertnation\.com\/full-episodes\/.*|www\.colbertnation\.com\/the-colbert-report-videos\/.*|www\.comedycentral\.com\/videos\/index\.jhtml\?.*|www\.theonion\.com\/video\/.*|theonion\.com\/video\/.*|wordpress\.tv\/.*\/.*\/.*\/.*\/|www\.traileraddict\.com\/trailer\/.*|www\.traileraddict\.com\/clip\/.*|www\.traileraddict\.com\/poster\/.*|www\.escapistmagazine\.com\/videos\/.*|www\.trailerspy\.com\/trailer\/.*\/.*|www\.trailerspy\.com\/trailer\/.*|www\.trailerspy\.com\/view_video\.php.*|www\.atom\.com\/.*\/.*\/|fora\.tv\/.*\/.*\/.*\/.*|www\.spike\.com\/video\/.*|www\.gametrailers\.com\/video\/.*|gametrailers\.com\/video\/.*|www\.koldcast\.tv\/video\/.*|www\.koldcast\.tv\/#video:.*|techcrunch\.tv\/watch.*|techcrunch\.tv\/.*\/watch.*|mixergy\.com\/.*|video\.pbs\.org\/video\/.*|www\.zapiks\.com\/.*|tv\.digg\.com\/diggnation\/.*|tv\.digg\.com\/diggreel\/.*|tv\.digg\.com\/diggdialogg\/.*|www\.trutv\.com\/video\/.*|www\.nzonscreen\.com\/title\/.*|nzonscreen\.com\/title\/.*|app\.wistia\.com\/embed\/medias\/.*|hungrynation\.tv\/.*\/episode\/.*|www\.hungrynation\.tv\/.*\/episode\/.*|hungrynation\.tv\/episode\/.*|www\.hungrynation\.tv\/episode\/.*|indymogul\.com\/.*\/episode\/.*|www\.indymogul\.com\/.*\/episode\/.*|indymogul\.com\/episode\/.*|www\.indymogul\.com\/episode\/.*|channelfrederator\.com\/.*\/episode\/.*|www\.channelfrederator\.com\/.*\/episode\/.*|channelfrederator\.com\/episode\/.*|www\.channelfrederator\.com\/episode\/.*|tmiweekly\.com\/.*\/episode\/.*|www\.tmiweekly\.com\/.*\/episode\/.*|tmiweekly\.com\/episode\/.*|www\.tmiweekly\.com\/episode\/.*|99dollarmusicvideos\.com\/.*\/episode\/.*|www\.99dollarmusicvideos\.com\/.*\/episode\/.*|99dollarmusicvideos\.com\/episode\/.*|www\.99dollarmusicvideos\.com\/episode\/.*|ultrakawaii\.com\/.*\/episode\/.*|www\.ultrakawaii\.com\/.*\/episode\/.*|ultrakawaii\.com\/episode\/.*|www\.ultrakawaii\.com\/episode\/.*|barelypolitical\.com\/.*\/episode\/.*|www\.barelypolitical\.com\/.*\/episode\/.*|barelypolitical\.com\/episode\/.*|www\.barelypolitical\.com\/episode\/.*|barelydigital\.com\/.*\/episode\/.*|www\.barelydigital\.com\/.*\/episode\/.*|barelydigital\.com\/episode\/.*|www\.barelydigital\.com\/episode\/.*|threadbanger\.com\/.*\/episode\/.*|www\.threadbanger\.com\/.*\/episode\/.*|threadbanger\.com\/episode\/.*|www\.threadbanger\.com\/episode\/.*|vodcars\.com\/.*\/episode\/.*|www\.vodcars\.com\/.*\/episode\/.*|vodcars\.com\/episode\/.*|www\.vodcars\.com\/episode\/.*|confreaks\.net\/videos\/.*|www\.confreaks\.net\/videos\/.*|video\.allthingsd\.com\/video\/.*|videos\.nymag\.com\/.*|aniboom\.com\/animation-video\/.*|www\.aniboom\.com\/animation-video\/.*|clipshack\.com\/Clip\.aspx\?.*|www\.clipshack\.com\/Clip\.aspx\?.*|grindtv\.com\/.*\/video\/.*|www\.grindtv\.com\/.*\/video\/.*|ifood\.tv\/recipe\/.*|ifood\.tv\/video\/.*|ifood\.tv\/channel\/user\/.*|www\.ifood\.tv\/recipe\/.*|www\.ifood\.tv\/video\/.*|www\.ifood\.tv\/channel\/user\/.*|logotv\.com\/video\/.*|www\.logotv\.com\/video\/.*|lonelyplanet\.com\/Clip\.aspx\?.*|www\.lonelyplanet\.com\/Clip\.aspx\?.*|streetfire\.net\/video\/.*\.htm.*|www\.streetfire\.net\/video\/.*\.htm.*|trooptube\.tv\/videos\/.*|www\.trooptube\.tv\/videos\/.*|sciencestage\.com\/v\/.*\.html|sciencestage\.com\/a\/.*\.html|www\.sciencestage\.com\/v\/.*\.html|www\.sciencestage\.com\/a\/.*\.html|www\.godtube\.com\/featured\/video\/.*|godtube\.com\/featured\/video\/.*|www\.godtube\.com\/watch\/.*|godtube\.com\/watch\/.*|www\.tangle\.com\/view_video.*|mediamatters\.org\/mmtv\/.*|www\.clikthrough\.com\/theater\/video\/.*|espn\.go\.com\/video\/clip.*|espn\.go\.com\/.*\/story.*|abcnews\.com\/.*\/video\/.*|abcnews\.com\/video\/playerIndex.*|washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.boston\.com\/video.*|boston\.com\/video.*|www\.facebook\.com\/photo\.php.*|www\.facebook\.com\/video\/video\.php.*|www\.facebook\.com\/v\/.*|cnbc\.com\/id\/.*\?.*video.*|www\.cnbc\.com\/id\/.*\?.*video.*|cnbc\.com\/id\/.*\/play\/1\/video\/.*|www\.cnbc\.com\/id\/.*\/play\/1\/video\/.*|cbsnews\.com\/video\/watch\/.*|www\.google\.com\/buzz\/.*\/.*\/.*|www\.google\.com\/buzz\/.*|www\.google\.com\/profiles\/.*|google\.com\/buzz\/.*\/.*\/.*|google\.com\/buzz\/.*|google\.com\/profiles\/.*|www\.cnn\.com\/video\/.*|edition\.cnn\.com\/video\/.*|money\.cnn\.com\/video\/.*|today\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/ns\/.*|today\.msnbc\.msn\.com\/id\/.*\/ns\/.*|multimedia\.foxsports\.com\/m\/video\/.*\/.*|msn\.foxsports\.com\/video.*|www\.globalpost\.com\/video\/.*|www\.globalpost\.com\/dispatch\/.*|guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|www\.guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|bravotv\.com\/.*\/.*\/videos\/.*|www\.bravotv\.com\/.*\/.*\/videos\/.*|video\.nationalgeographic\.com\/.*\/.*\/.*\.html|dsc\.discovery\.com\/videos\/.*|animal\.discovery\.com\/videos\/.*|health\.discovery\.com\/videos\/.*|investigation\.discovery\.com\/videos\/.*|military\.discovery\.com\/videos\/.*|planetgreen\.discovery\.com\/videos\/.*|science\.discovery\.com\/videos\/.*|tlc\.discovery\.com\/videos\/.*|video\.forbes\.com\/fvn\/.*))|(https:\/\/(skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.twitter\.com\/.*\/status\/.*|www\.twitter\.com\/.*\/statuses\/.*|mobile\.twitter\.com\/.*\/status\/.*|mobile\.twitter\.com\/.*\/statuses\/.*|crocodoc\.com\/.*|.*\.crocodoc\.com\/.*|.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|app\.wistia\.com\/embed\/medias\/.*|www\.facebook\.com\/photo\.php.*|www\.facebook\.com\/video\/video\.php.*|www\.facebook\.com\/v\/.*)))/i, SPAZ_EMBEDLY_REGEX_BROWSER = /((http:\/\/(.*yfrog\..*\/.*|www\.flickr\.com\/photos\/.*|flic\.kr\/.*|twitpic\.com\/.*|www\.twitpic\.com\/.*|twitpic\.com\/photos\/.*|www\.twitpic\.com\/photos\/.*|.*imgur\.com\/.*|.*\.posterous\.com\/.*|post\.ly\/.*|twitgoo\.com\/.*|i.*\.photobucket\.com\/albums\/.*|s.*\.photobucket\.com\/albums\/.*|phodroid\.com\/.*\/.*\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.xkcd\.com\/.*|imgs\.xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.asofterworld\.com\/.*\.jpg|asofterworld\.com\/.*\.jpg|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|emberapp\.com\/.*\/images\/.*|emberapp\.com\/.*\/images\/.*\/sizes\/.*|emberapp\.com\/.*\/collections\/.*\/.*|emberapp\.com\/.*\/categories\/.*\/.*\/.*|embr\.it\/.*|picasaweb\.google\.com.*\/.*\/.*#.*|picasaweb\.google\.com.*\/lh\/photo\/.*|picasaweb\.google\.com.*\/.*\/.*|dailybooth\.com\/.*\/.*|brizzly\.com\/pic\/.*|pics\.brizzly\.com\/.*\.jpg|img\.ly\/.*|www\.tinypic\.com\/view\.php.*|tinypic\.com\/view\.php.*|www\.tinypic\.com\/player\.php.*|tinypic\.com\/player\.php.*|www\.tinypic\.com\/r\/.*\/.*|tinypic\.com\/r\/.*\/.*|.*\.tinypic\.com\/.*\.jpg|.*\.tinypic\.com\/.*\.png|meadd\.com\/.*\/.*|meadd\.com\/.*|.*\.deviantart\.com\/art\/.*|.*\.deviantart\.com\/gallery\/.*|.*\.deviantart\.com\/#\/.*|fav\.me\/.*|.*\.deviantart\.com|.*\.deviantart\.com\/gallery|.*\.deviantart\.com\/.*\/.*\.jpg|.*\.deviantart\.com\/.*\/.*\.gif|.*\.deviantart\.net\/.*\/.*\.jpg|.*\.deviantart\.net\/.*\/.*\.gif|www\.fotopedia\.com\/.*\/.*|fotopedia\.com\/.*\/.*|photozou\.jp\/photo\/show\/.*\/.*|photozou\.jp\/photo\/photo_only\/.*\/.*|instagr\.am\/p\/.*|instagram\.com\/p\/.*|skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|share\.ovi\.com\/media\/.*\/.*|www\.questionablecontent\.net\/|questionablecontent\.net\/|www\.questionablecontent\.net\/view\.php.*|questionablecontent\.net\/view\.php.*|questionablecontent\.net\/comics\/.*\.png|www\.questionablecontent\.net\/comics\/.*\.png|picplz\.com\/.*|twitrpix\.com\/.*|.*\.twitrpix\.com\/.*|www\.someecards\.com\/.*\/.*|someecards\.com\/.*\/.*|some\.ly\/.*|www\.some\.ly\/.*|pikchur\.com\/.*|achewood\.com\/.*|www\.achewood\.com\/.*|achewood\.com\/index\.php.*|www\.achewood\.com\/index\.php.*|www\.whosay\.com\/content\/.*|www\.whosay\.com\/photos\/.*|www\.whosay\.com\/videos\/.*|say\.ly\/.*|ow\.ly\/i\/.*|color\.com\/s\/.*|bnter\.com\/convo\/.*|mlkshk\.com\/p\/.*|lockerz\.com\/s\/.*|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*|www\.last\.fm\/music\/.*|www\.last\.fm\/music\/+videos\/.*|www\.last\.fm\/music\/+images\/.*|www\.last\.fm\/music\/.*\/_\/.*|www\.last\.fm\/music\/.*\/.*|www\.mixcloud\.com\/.*\/.*\/|www\.radionomy\.com\/.*\/radio\/.*|radionomy\.com\/.*\/radio\/.*|www\.hark\.com\/clips\/.*|www\.rdio\.com\/#\/artist\/.*\/album\/.*|www\.rdio\.com\/artist\/.*\/album\/.*|www\.zero-inch\.com\/.*|.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*|freemusicarchive\.org\/music\/.*|www\.freemusicarchive\.org\/music\/.*|freemusicarchive\.org\/curator\/.*|www\.freemusicarchive\.org\/curator\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/templates\/story\/story\.php.*|huffduffer\.com\/.*\/.*|www\.audioboo\.fm\/boos\/.*|audioboo\.fm\/boos\/.*|boo\.fm\/b.*|www\.xiami\.com\/song\/.*|xiami\.com\/song\/.*|www\.saynow\.com\/playMsg\.html.*|www\.saynow\.com\/playMsg\.html.*|grooveshark\.com\/.*|radioreddit\.com\/songs.*|www\.radioreddit\.com\/songs.*|radioreddit\.com\/\?q=songs.*|www\.radioreddit\.com\/\?q=songs.*|www\.gogoyoko\.com\/song\/.*|.*amazon\..*\/gp\/product\/.*|.*amazon\..*\/.*\/dp\/.*|.*amazon\..*\/dp\/.*|.*amazon\..*\/o\/ASIN\/.*|.*amazon\..*\/gp\/offer-listing\/.*|.*amazon\..*\/.*\/ASIN\/.*|.*amazon\..*\/gp\/product\/images\/.*|.*amazon\..*\/gp\/aw\/d\/.*|www\.amzn\.com\/.*|amzn\.com\/.*|www\.shopstyle\.com\/browse.*|www\.shopstyle\.com\/action\/apiVisitRetailer.*|api\.shopstyle\.com\/action\/apiVisitRetailer.*|www\.shopstyle\.com\/action\/viewLook.*|gist\.github\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.twitter\.com\/.*\/status\/.*|www\.twitter\.com\/.*\/statuses\/.*|mobile\.twitter\.com\/.*\/status\/.*|mobile\.twitter\.com\/.*\/statuses\/.*|www\.crunchbase\.com\/.*\/.*|crunchbase\.com\/.*\/.*|www\.slideshare\.net\/.*\/.*|www\.slideshare\.net\/mobile\/.*\/.*|slidesha\.re\/.*|scribd\.com\/doc\/.*|www\.scribd\.com\/doc\/.*|scribd\.com\/mobile\/documents\/.*|www\.scribd\.com\/mobile\/documents\/.*|screenr\.com\/.*|polldaddy\.com\/community\/poll\/.*|polldaddy\.com\/poll\/.*|answers\.polldaddy\.com\/poll\/.*|www\.5min\.com\/Video\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|www\.scrapblog\.com\/viewer\/viewer\.aspx.*|ping\.fm\/p\/.*|chart\.ly\/symbols\/.*|chart\.ly\/.*|maps\.google\.com\/maps\?.*|maps\.google\.com\/\?.*|maps\.google\.com\/maps\/ms\?.*|.*\.craigslist\.org\/.*\/.*|my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|www\.polleverywhere\.com\/polls\/.*|www\.polleverywhere\.com\/multiple_choice_polls\/.*|www\.polleverywhere\.com\/free_text_polls\/.*|www\.quantcast\.com\/wd:.*|www\.quantcast\.com\/.*|siteanalytics\.compete\.com\/.*|statsheet\.com\/statplot\/charts\/.*\/.*\/.*\/.*|statsheet\.com\/statplot\/charts\/e\/.*|statsheet\.com\/.*\/teams\/.*\/.*|statsheet\.com\/tools\/chartlets\?chart=.*|.*\.status\.net\/notice\/.*|identi\.ca\/notice\/.*|brainbird\.net\/notice\/.*|shitmydadsays\.com\/notice\/.*|www\.studivz\.net\/Profile\/.*|www\.studivz\.net\/l\/.*|www\.studivz\.net\/Groups\/Overview\/.*|www\.studivz\.net\/Gadgets\/Info\/.*|www\.studivz\.net\/Gadgets\/Install\/.*|www\.studivz\.net\/.*|www\.meinvz\.net\/Profile\/.*|www\.meinvz\.net\/l\/.*|www\.meinvz\.net\/Groups\/Overview\/.*|www\.meinvz\.net\/Gadgets\/Info\/.*|www\.meinvz\.net\/Gadgets\/Install\/.*|www\.meinvz\.net\/.*|www\.schuelervz\.net\/Profile\/.*|www\.schuelervz\.net\/l\/.*|www\.schuelervz\.net\/Groups\/Overview\/.*|www\.schuelervz\.net\/Gadgets\/Info\/.*|www\.schuelervz\.net\/Gadgets\/Install\/.*|www\.schuelervz\.net\/.*|myloc\.me\/.*|pastebin\.com\/.*|pastie\.org\/.*|www\.pastie\.org\/.*|redux\.com\/stream\/item\/.*\/.*|redux\.com\/f\/.*\/.*|www\.redux\.com\/stream\/item\/.*\/.*|www\.redux\.com\/f\/.*\/.*|cl\.ly\/.*|cl\.ly\/.*\/content|speakerdeck\.com\/u\/.*\/p\/.*|www\.kiva\.org\/lend\/.*|www\.timetoast\.com\/timelines\/.*|storify\.com\/.*\/.*|.*meetup\.com\/.*|meetu\.ps\/.*|www\.dailymile\.com\/people\/.*\/tweets\/.*|.*\.kinomap\.com\/.*|www\.metacdn\.com\/api\/users\/.*\/content\/.*|www\.metacdn\.com\/api\/users\/.*\/media\/.*|prezi\.com\/.*\/.*|.*\.uservoice\.com\/.*\/suggestions\/.*|formspring\.me\/.*|www\.formspring\.me\/.*|formspring\.me\/.*\/q\/.*|www\.formspring\.me\/.*\/q\/.*|twitlonger\.com\/show\/.*|www\.twitlonger\.com\/show\/.*|tl\.gd\/.*|www\.qwiki\.com\/q\/.*|crocodoc\.com\/.*|.*\.crocodoc\.com\/.*|www\.wikipedia\.org\/wiki\/.*|www\.wikimedia\.org\/wiki\/File.*|.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|youtu\.be\/.*|.*\.youtube\.com\/user\/.*|.*\.youtube\.com\/.*#.*\/.*|m\.youtube\.com\/watch.*|m\.youtube\.com\/index.*|.*\.youtube\.com\/profile.*|.*\.youtube\.com\/view_play_list.*|.*\.youtube\.com\/playlist.*|.*justin\.tv\/.*|.*justin\.tv\/.*\/b\/.*|.*justin\.tv\/.*\/w\/.*|www\.ustream\.tv\/recorded\/.*|www\.ustream\.tv\/channel\/.*|www\.ustream\.tv\/.*|qik\.com\/video\/.*|qik\.com\/.*|qik\.ly\/.*|.*revision3\.com\/.*|.*\.dailymotion\.com\/video\/.*|.*\.dailymotion\.com\/.*\/video\/.*|collegehumor\.com\/video:.*|collegehumor\.com\/video\/.*|www\.collegehumor\.com\/video:.*|www\.collegehumor\.com\/video\/.*|.*twitvid\.com\/.*|www\.break\.com\/.*\/.*|vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|www\.metacafe\.com\/watch\/.*|www\.metacafe\.com\/w\/.*|blip\.tv\/.*\/.*|.*\.blip\.tv\/.*\/.*|video\.google\.com\/videoplay\?.*|.*revver\.com\/video\/.*|video\.yahoo\.com\/watch\/.*\/.*|video\.yahoo\.com\/network\/.*|.*viddler\.com\/explore\/.*\/videos\/.*|liveleak\.com\/view\?.*|www\.liveleak\.com\/view\?.*|animoto\.com\/play\/.*|dotsub\.com\/view\/.*|www\.overstream\.net\/view\.php\?oid=.*|www\.livestream\.com\/.*|www\.worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|teachertube\.com\/viewVideo\.php.*|www\.teachertube\.com\/viewVideo\.php.*|www1\.teachertube\.com\/viewVideo\.php.*|www2\.teachertube\.com\/viewVideo\.php.*|bambuser\.com\/v\/.*|bambuser\.com\/channel\/.*|bambuser\.com\/channel\/.*\/broadcast\/.*|www\.schooltube\.com\/video\/.*\/.*|bigthink\.com\/ideas\/.*|bigthink\.com\/series\/.*|sendables\.jibjab\.com\/view\/.*|sendables\.jibjab\.com\/originals\/.*|www\.xtranormal\.com\/watch\/.*|socialcam\.com\/v\/.*|www\.socialcam\.com\/v\/.*|dipdive\.com\/media\/.*|dipdive\.com\/member\/.*\/media\/.*|dipdive\.com\/v\/.*|.*\.dipdive\.com\/media\/.*|.*\.dipdive\.com\/v\/.*|v\.youku\.com\/v_show\/.*\.html|v\.youku\.com\/v_playlist\/.*\.html|www\.snotr\.com\/video\/.*|snotr\.com\/video\/.*|video\.jardenberg\.se\/.*|www\.clipfish\.de\/.*\/.*\/video\/.*|www\.myvideo\.de\/watch\/.*|www\.whitehouse\.gov\/photos-and-video\/video\/.*|www\.whitehouse\.gov\/video\/.*|wh\.gov\/photos-and-video\/video\/.*|wh\.gov\/video\/.*|www\.hulu\.com\/watch.*|www\.hulu\.com\/w\/.*|hulu\.com\/watch.*|hulu\.com\/w\/.*|.*crackle\.com\/c\/.*|www\.fancast\.com\/.*\/videos|www\.funnyordie\.com\/videos\/.*|www\.funnyordie\.com\/m\/.*|funnyordie\.com\/videos\/.*|funnyordie\.com\/m\/.*|www\.vimeo\.com\/groups\/.*\/videos\/.*|www\.vimeo\.com\/.*|vimeo\.com\/groups\/.*\/videos\/.*|vimeo\.com\/.*|vimeo\.com\/m\/#\/.*|www\.ted\.com\/talks\/.*\.html.*|www\.ted\.com\/talks\/lang\/.*\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/lang\/.*\/.*\.html.*|.*nfb\.ca\/film\/.*|www\.thedailyshow\.com\/watch\/.*|www\.thedailyshow\.com\/full-episodes\/.*|www\.thedailyshow\.com\/collection\/.*\/.*\/.*|movies\.yahoo\.com\/movie\/.*\/video\/.*|movies\.yahoo\.com\/movie\/.*\/trailer|movies\.yahoo\.com\/movie\/.*\/video|www\.colbertnation\.com\/the-colbert-report-collections\/.*|www\.colbertnation\.com\/full-episodes\/.*|www\.colbertnation\.com\/the-colbert-report-videos\/.*|www\.comedycentral\.com\/videos\/index\.jhtml\?.*|www\.theonion\.com\/video\/.*|theonion\.com\/video\/.*|wordpress\.tv\/.*\/.*\/.*\/.*\/|www\.traileraddict\.com\/trailer\/.*|www\.traileraddict\.com\/clip\/.*|www\.traileraddict\.com\/poster\/.*|www\.escapistmagazine\.com\/videos\/.*|www\.trailerspy\.com\/trailer\/.*\/.*|www\.trailerspy\.com\/trailer\/.*|www\.trailerspy\.com\/view_video\.php.*|www\.atom\.com\/.*\/.*\/|fora\.tv\/.*\/.*\/.*\/.*|www\.spike\.com\/video\/.*|www\.gametrailers\.com\/video\/.*|gametrailers\.com\/video\/.*|www\.koldcast\.tv\/video\/.*|www\.koldcast\.tv\/#video:.*|techcrunch\.tv\/watch.*|techcrunch\.tv\/.*\/watch.*|mixergy\.com\/.*|video\.pbs\.org\/video\/.*|www\.zapiks\.com\/.*|tv\.digg\.com\/diggnation\/.*|tv\.digg\.com\/diggreel\/.*|tv\.digg\.com\/diggdialogg\/.*|www\.trutv\.com\/video\/.*|www\.nzonscreen\.com\/title\/.*|nzonscreen\.com\/title\/.*|app\.wistia\.com\/embed\/medias\/.*|hungrynation\.tv\/.*\/episode\/.*|www\.hungrynation\.tv\/.*\/episode\/.*|hungrynation\.tv\/episode\/.*|www\.hungrynation\.tv\/episode\/.*|indymogul\.com\/.*\/episode\/.*|www\.indymogul\.com\/.*\/episode\/.*|indymogul\.com\/episode\/.*|www\.indymogul\.com\/episode\/.*|channelfrederator\.com\/.*\/episode\/.*|www\.channelfrederator\.com\/.*\/episode\/.*|channelfrederator\.com\/episode\/.*|www\.channelfrederator\.com\/episode\/.*|tmiweekly\.com\/.*\/episode\/.*|www\.tmiweekly\.com\/.*\/episode\/.*|tmiweekly\.com\/episode\/.*|www\.tmiweekly\.com\/episode\/.*|99dollarmusicvideos\.com\/.*\/episode\/.*|www\.99dollarmusicvideos\.com\/.*\/episode\/.*|99dollarmusicvideos\.com\/episode\/.*|www\.99dollarmusicvideos\.com\/episode\/.*|ultrakawaii\.com\/.*\/episode\/.*|www\.ultrakawaii\.com\/.*\/episode\/.*|ultrakawaii\.com\/episode\/.*|www\.ultrakawaii\.com\/episode\/.*|barelypolitical\.com\/.*\/episode\/.*|www\.barelypolitical\.com\/.*\/episode\/.*|barelypolitical\.com\/episode\/.*|www\.barelypolitical\.com\/episode\/.*|barelydigital\.com\/.*\/episode\/.*|www\.barelydigital\.com\/.*\/episode\/.*|barelydigital\.com\/episode\/.*|www\.barelydigital\.com\/episode\/.*|threadbanger\.com\/.*\/episode\/.*|www\.threadbanger\.com\/.*\/episode\/.*|threadbanger\.com\/episode\/.*|www\.threadbanger\.com\/episode\/.*|vodcars\.com\/.*\/episode\/.*|www\.vodcars\.com\/.*\/episode\/.*|vodcars\.com\/episode\/.*|www\.vodcars\.com\/episode\/.*|confreaks\.net\/videos\/.*|www\.confreaks\.net\/videos\/.*|video\.allthingsd\.com\/video\/.*|videos\.nymag\.com\/.*|aniboom\.com\/animation-video\/.*|www\.aniboom\.com\/animation-video\/.*|clipshack\.com\/Clip\.aspx\?.*|www\.clipshack\.com\/Clip\.aspx\?.*|grindtv\.com\/.*\/video\/.*|www\.grindtv\.com\/.*\/video\/.*|ifood\.tv\/recipe\/.*|ifood\.tv\/video\/.*|ifood\.tv\/channel\/user\/.*|www\.ifood\.tv\/recipe\/.*|www\.ifood\.tv\/video\/.*|www\.ifood\.tv\/channel\/user\/.*|logotv\.com\/video\/.*|www\.logotv\.com\/video\/.*|lonelyplanet\.com\/Clip\.aspx\?.*|www\.lonelyplanet\.com\/Clip\.aspx\?.*|streetfire\.net\/video\/.*\.htm.*|www\.streetfire\.net\/video\/.*\.htm.*|trooptube\.tv\/videos\/.*|www\.trooptube\.tv\/videos\/.*|sciencestage\.com\/v\/.*\.html|sciencestage\.com\/a\/.*\.html|www\.sciencestage\.com\/v\/.*\.html|www\.sciencestage\.com\/a\/.*\.html|www\.godtube\.com\/featured\/video\/.*|godtube\.com\/featured\/video\/.*|www\.godtube\.com\/watch\/.*|godtube\.com\/watch\/.*|www\.tangle\.com\/view_video.*|mediamatters\.org\/mmtv\/.*|www\.clikthrough\.com\/theater\/video\/.*|espn\.go\.com\/video\/clip.*|espn\.go\.com\/.*\/story.*|abcnews\.com\/.*\/video\/.*|abcnews\.com\/video\/playerIndex.*|washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.washingtonpost\.com\/wp-dyn\/.*\/video\/.*\/.*\/.*\/.*|www\.boston\.com\/video.*|boston\.com\/video.*|www\.facebook\.com\/photo\.php.*|www\.facebook\.com\/video\/video\.php.*|www\.facebook\.com\/v\/.*|cnbc\.com\/id\/.*\?.*video.*|www\.cnbc\.com\/id\/.*\?.*video.*|cnbc\.com\/id\/.*\/play\/1\/video\/.*|www\.cnbc\.com\/id\/.*\/play\/1\/video\/.*|cbsnews\.com\/video\/watch\/.*|www\.google\.com\/buzz\/.*\/.*\/.*|www\.google\.com\/buzz\/.*|www\.google\.com\/profiles\/.*|google\.com\/buzz\/.*\/.*\/.*|google\.com\/buzz\/.*|google\.com\/profiles\/.*|www\.cnn\.com\/video\/.*|edition\.cnn\.com\/video\/.*|money\.cnn\.com\/video\/.*|today\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/ns\/.*|today\.msnbc\.msn\.com\/id\/.*\/ns\/.*|multimedia\.foxsports\.com\/m\/video\/.*\/.*|msn\.foxsports\.com\/video.*|www\.globalpost\.com\/video\/.*|www\.globalpost\.com\/dispatch\/.*|guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|www\.guardian\.co\.uk\/.*\/video\/.*\/.*\/.*\/.*|bravotv\.com\/.*\/.*\/videos\/.*|www\.bravotv\.com\/.*\/.*\/videos\/.*|video\.nationalgeographic\.com\/.*\/.*\/.*\.html|dsc\.discovery\.com\/videos\/.*|animal\.discovery\.com\/videos\/.*|health\.discovery\.com\/videos\/.*|investigation\.discovery\.com\/videos\/.*|military\.discovery\.com\/videos\/.*|planetgreen\.discovery\.com\/videos\/.*|science\.discovery\.com\/videos\/.*|tlc\.discovery\.com\/videos\/.*|video\.forbes\.com\/fvn\/.*))|(https:\/\/(skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.twitter\.com\/.*\/status\/.*|www\.twitter\.com\/.*\/statuses\/.*|mobile\.twitter\.com\/.*\/status\/.*|mobile\.twitter\.com\/.*\/statuses\/.*|crocodoc\.com\/.*|.*\.crocodoc\.com\/.*|.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|app\.wistia\.com\/embed\/medias\/.*|www\.facebook\.com\/photo\.php.*|www\.facebook\.com\/video\/video\.php.*|www\.facebook\.com\/v\/.*)))/i;

// apputils.js

window.AppUtils || (window.AppUtils = {});

if (!window.$L) var $L = function(e) {
return e;
};

var SPAZ_DEFAULT_APPID = "com.fxjm.neo";

AppUtils.getAppObj = function() {
return window.App;
}, AppUtils.makeItemsClickable = function(e) {
return e = sch.autolink(e, null, null, 20), e = sch.autolinkTwitterScreenname(e, '<span class="username clickable" data-user-screen_name="#username#">@#username#</span>'), e = sch.autolinkTwitterHashtag(e, '<span class="hashtag clickable" data-hashtag="#hashtag#">##hashtag#</span>'), e;
}, AppUtils.applyTweetTextFilters = function(e) {
return e ? (App.tweetOutputFilters || (App.tweetOutputFilters = new SpazFilterChain({
filters: SpazDefaultTextFilters
})), App.tweetOutputFilters.process(e)) : e;
}, AppUtils.showTestBuildWarning = function() {
var e = enyo.fetchAppInfo();
if (!e || !e.testBuild) return;
AppUtils.showBanner($L("This is a TEST BUILD of Neo. It has bugs. It may not operate properly. It may insult you or your family. BE AWARE."), 4e3);
}, AppUtils.sendEmail = function(e) {
function t(e, t, n) {
var r = 1, i = 2, s = 3, o = null;
switch (t) {
case "to":
o = r;
break;
case "cc":
o = i;
break;
case "bcc":
o = s;
break;
default:
o = r;
}
var u = {
contactDisplay: n,
role: o,
value: e,
type: "email"
};
return u;
}
var n = e.to || null, r = e.cc || null, i = e.bcc || null, s = [], o;
if (n) for (o = 0; o < n.length; o++) s.push(t(n[o].address, "to", n[o].name));
if (r) for (o = 0; o < r.length; o++) s.push(t(r[o].address, "cc", r[o].name));
if (i) for (o = 0; o < i.length; o++) s.push(t(i[o].address, "bcc", i[o].name));
var u = e.account || null, a = e.attachments || null, f = e.subject || null, l = e.msg || null, c = {
account: u,
attachments: a,
recipients: s,
summary: f,
text: l
}, h = new enyo.webOS.ServiceRequest({
service: "palm://com.palm.applicationManager",
method: "open"
});
h.go({
id: "com.palm.app.email",
params: c
}), h.response(function(e) {
enyo.log("email service response...", enyo.json.stringify(e));
});
}, AppUtils.emailTweet = function(e) {
var t = "@" + e.author_username + ":<br><br>" + sch.autolink(e.text_raw) + "<br><br>" + sch.autolink("sent with Neo") + "\n\n";
AppUtils.sendEmail({
msg: t,
subject: "@" + e.author_username + " - Neo"
});
}, AppUtils.SMSTweet = function(e) {
var t = "@" + e.author_username + ": " + e.text_raw + " " + " - Neo", n = new enyo.webOS.ServiceRequest({
service: "palm://com.palm.applicationManager",
method: "open"
});
n.go({
id: "com.palm.app.messaging",
params: {
compose: {
messageText: t
}
}
}), n.response(function(e) {
enyo.log("sms service response...", enyo.json.stringify(e));
});
}, AppUtils.copyTweet = function(e) {
enyo.keyboard.suspend();
var t = e.text;
neoapp._clipboardTextArea || neoapp.createComponent({
kind: "onyx.RichText",
name: "_clipboardTextArea"
});
var n = neoapp.$._clipboardTextArea;
n.render(), n.node.blur(), n.setValue(""), n.setValue(t), n.focus(), n.selectAll(), console.log(document.getSelection()), document.execCommand("cut"), AppUtils.showBanner("Post copied to clipboard"), n.destroy(), enyo.keyboard.resume();
}, AppUtils.relaunch = function(e, t) {
e || (e = "default"), t || (t = enyo.fetchAppInfo().id);
var n = new enyo.webOS.ServiceRequest({
service: "palm://com.palm.applicationManager",
method: "launch"
});
n.go({
id: t,
params: {
action: "relaunch",
from: "notification"
},
subscribe: !0
}), n.response(function(e) {
enyo.log("app relaunch response...", enyo.json.stringify(e));
});
}, AppUtils.setTheme = function(e) {
console.error("AppThemes: %j", AppThemes), console.error("theme: %s", e), console.error("AppThemes[theme]: %j", AppThemes[e]), AppThemes && AppThemes[e] && (AppThemes[e].palmtheme == "dark" ? jQuery("body").addClass("palm-dark") : jQuery("body").removeClass("palm-dark"), jQuery('link[title="apptheme"]').attr("href", "stylesheets/" + AppThemes[e].stylesheet));
}, AppUtils.getFancyTime = function(e, t, n) {
if (sc.helpers.iswebOS() && App.Prefs.get("timeline-absolute-timestamps")) {
n === !0 ? parsed_date = new Date.parse(e) : parsed_date = new Date(e);
var r = new Date, i = parseInt((r.getTime() - parsed_date.getTime()) / 1e3, 10);
return i < 86400 ? Mojo.Format.formatDate(parsed_date, {
time: "short"
}) : Mojo.Format.formatDate(parsed_date, "short");
}
return sch.getRelativeTime(e, t, n);
}, AppUtils.getAccountAvatar = function(e, t, n) {
window.App.avatarCache || (window.App.avatarCache = {});
if (window.App.avatarCache[e]) {
t(window.App.avatarCache[e]);
return;
}
var r = AppUtils.makeTwitObj(e), i = App.Users.get(e).username;
enyo.log(i), r.getUser("@" + i, function(n) {
var r = n.profile_image_url;
window.App.avatarCache[e] = r, t(r);
}, function(e, t, r) {
n(e, t, r);
});
}, AppUtils.getAccount = function(e, t, n) {
window.App.avatarCache || (window.App.avatarCache = {});
var r = AppUtils.makeTwitObj(e), i = App.Users.get(e).username;
enyo.log(i), r.getUser("@" + i, function(n) {
window.App.avatarCache[e] = n.profile_image_url, t(n);
}, function(e, t, r) {
n(e, t, r);
});
}, AppUtils.getCustomAPIUrl = function(e) {
var t = App.Users.getMeta(e, "twitter-api-base-url");
return t || (t = App.Users.getMeta(e, "api-url")), t;
}, AppUtils.makeTwitObj = function(e) {
var t = new SpazTwit({
timeout: 6e4
});
t.setSource(App.Prefs.get("twitter-source"));
var n;
return e && (n = App.Users.getAuthObject(e)) && (t.setCredentials(n), App.Users.getType(e) === SPAZCORE_ACCOUNT_CUSTOM ? t.setBaseURL(AppUtils.getCustomAPIUrl(e)) : t.setBaseURLByService(App.Users.getType(e))), t;
}, AppUtils.getAuthObj = function(e) {
var t = App.Users.getAuthObject(e);
return t;
}, AppUtils.convertToUser = function(e) {
var t = {};
return t.spaz_id = sch.UUID(), t.username = e.screen_name, t.description = e.description, t.fullname = e.name, t.service = e.SC_service, t.service_id = e.id, t.avatar = e.profile_image_url, t.avatar_bigger = AppUtils.getBiggerAvatar(t), t.url = e.url, t.is_private = !!e["protected"], t._orig = _.extend({}, e), t;
}, AppUtils.convertToTweet = function(e) {
var t = {};
e.SC_service || (e.SC_service = SPAZCORE_SERVICE_TWITTER);
switch (e.SC_service) {
case SPAZCORE_SERVICE_TWITTER:
case SPAZCORE_SERVICE_IDENTICA:
case SPAZCORE_SERVICE_CUSTOM:
t.service = e.SC_service, t.service_id = e.id, t.spaz_id = e.SC_service + e.id + e.SC_created_at_unixtime, t.text = e.text, t.text_raw = e.SC_text_raw, t.publish_date = e.SC_created_at_unixtime, t.account_id = e.account_id || undefined, e.SC_is_dm ? (t.author_username = e.sender.screen_name, t.author_description = e.sender.description, t.author_fullname = e.sender.name, t.author_id = e.sender.id, t.author_avatar = e.sender.profile_image_url, t.author_url = e.sender.url, t.recipient_username = e.recipient.screen_name, t.recipient_description = e.recipient.description, t.recipient_fullname = e.recipient.name, t.recipient_id = e.recipient.id, t.recipient_avatar = e.recipient.profile_image_url, t.is_private_message = !0) : e.SC_is_retweet ? (t.is_repost = !0, t.text = e.retweeted_status.text, t.text_raw = e.retweeted_status.text, t.repost_orig_date = sc.helpers.httpTimeToInt(e.retweeted_status.created_at), t.repost_orig_id = e.retweeted_status.id, t.author_username = e.retweeted_status.user.screen_name, t.author_description = e.retweeted_status.user.description, t.author_fullname = e.retweeted_status.user.name, t.author_id = e.retweeted_status.user.id, t.author_avatar = e.retweeted_status.user.profile_image_url, t.author_url = e.retweeted_status.user.url, t.reposter_username = e.user.screen_name, t.reposter_description = e.user.description, t.reposter_fullname = e.user.name, t.reposter_id = e.user.id, t.reposter_avatar = e.user.profile_image_url, t.reposter_url = e.user.url, e.retweeted_status.in_reply_to_screen_name && (t.recipient_username = e.retweeted_status.in_reply_to_screen_name, t.recipient_id = e.retweeted_status.in_reply_to_user_id), e.retweeted_status.in_reply_to_status_id && (t.in_reply_to_id = e.retweeted_status.in_reply_to_status_id)) : (t.author_username = e.user.screen_name, t.author_description = e.user.description, t.author_fullname = e.user.name, t.author_id = e.user.id, t.author_avatar = e.user.profile_image_url, t.author_url = e.user.url, e.SC_is_reply && (t.is_mention = !0), e.in_reply_to_screen_name && (t.recipient_username = e.in_reply_to_screen_name, t.recipient_id = e.in_reply_to_user_id), e.in_reply_to_status_id && (t.in_reply_to_id = e.in_reply_to_status_id), e.favorited ? t.is_favorite = !0 : t.is_favorite = !1), t.author_fullname || (t.author_fullname = e.from_user_name), e.SC_is_search && (t.is_search_result = !0), t.author_avatar_bigger = AppUtils.getBiggerAvatar(t), t.author_is_private = e && e.user ? e.user["protected"] : !1, t._orig = _.extend({}, e);
break;
default:
}
return t;
}, AppUtils.setAdditionalTweetProperties = function(e, t) {
for (var n = e.length - 1; n >= 0; n--) {
var r = App.Users.getByType(e[n].service);
for (var i = r.length - 1; i >= 0; i--) if (r[i].username.toLowerCase() === e[n].author_username.toLowerCase()) {
e[n].is_author = !0, e[n].is_private_message || (e[n].account_id = r[i].id);
break;
}
}
return e;
}, AppUtils.getBiggerAvatar = function(e) {
var t, n, r;
e.author_username ? (n = e.author_username, r = e.author_avatar) : (n = e.username, r = e.avatar);
switch (e.service) {
case SPAZCORE_SERVICE_TWITTER:
t = r.replace(/_normal\.([a-zA-Z]+)$/, "_bigger.$1");
break;
case SPAZCORE_SERVICE_IDENTICA:
t = "http://identi.ca/api/users/profile_image/" + n + ".json?size=bigger";
break;
default:
t = r;
}
return t;
}, AppUtils.convertToTweets = function(e) {
if (!e) return [];
for (var t = 0; t < e.length; t++) e[t] = AppUtils.convertToTweet(e[t]);
return e;
}, AppUtils.showBanner = function(e, t, n) {
if (!enyo.windows) {
console.log(e);
return;
}
window.humane.timeout = t || 1500, window.humane.waitForMove = n || !1, enyo.windows.addBannerMessage(e, "{source: 'banner', text:" + e + "}", "icon_32.png"), humane(e);
}, AppUtils.showDashboard = function(e) {
e = sch.defaults({
icon: "icon_48.png",
title: "Dashboard Title",
text: "This is the dashboard message",
duration: null,
onClick: null
}, e);
switch (AppUtils.getPlatform()) {
case "__BLACKBERRY":
enyo.Signals.send("onNotify", e);
break;
case SPAZCORE_PLATFORM_WEBOS:
window.enyo.$.neo.pushDashboard(null, e.title, e.text);
var t = e.title + ": " + e.text;
AppUtils.showBanner(t);
break;
case SPAZCORE_PLATFORM_TITANIUM:
var n = Titanium.Notification.createNotification();
n.setMessage(e.text), n.setIcon(e.icon || null), n.setTimeout(e.duration || null), n.setTitle(e.title), n.setCallback(function() {
e.onClick && e.onClick();
}), n.show();
break;
default:
window.webkitNotifications && (window.webkitNotifications.checkPermission() === 0 ? window.webkitNotifications.createNotification(e.icon, e.title, e.text).show() : window.webkitNotifications.requestPermission());
}
}, AppUtils.getPlatform = function() {
var e;
return e = sch.getPlatform(), e;
}, AppUtils.getQueryVars = function(e) {
var t = [], n = e.split("&");
for (var r = 0; r < n.length; r++) {
var i = n[r].split("=");
t[i[0]] = decodeURIComponent(i[1]);
}
return t;
}, AppUtils.isService = function(e) {
return e === SPAZCORE_SERVICE_TWITTER || e === SPAZCORE_SERVICE_IDENTICA || e === SPAZCORE_SERVICE_CUSTOM;
};

// appui.js

AppUI = {
addFunction: function(e, t, n) {
AppUI[e] = enyo.bind(n || this, t);
}
};

// emoticons.js

var Emoticons = function(e) {
e && this.set(e);
};

Emoticons.prototype.CHARS_TO_ESCAPE = /[\\=!^$*+?.:|(){}[\]]/g, Emoticons.prototype.REGEX_OPEN = "(^|\\s)", Emoticons.prototype.REGEX_CLOSE = "(\\s|$)", Emoticons.prototype.set = function(e) {
this.set = EmoticonSets[e], this.regexp = this.buildRegexp(this.set.mappings, this.set.regexOpen, this.set.regexClose);
}, Emoticons.prototype.buildRegexp = function(e, t, n) {
var r = "";
t || (t = this.REGEX_OPEN), n || (n = this.REGEX_CLOSE);
for (smiley in e) r > "" && (r += "|"), r += smiley.replace(this.CHARS_TO_ESCAPE, "\\$&");
return r = t + "(" + r + ")" + n, new RegExp(r, "g");
}, Emoticons.prototype.apply = function(e) {
return e;
var t, n, r, i;
};

var EmoticonSets = {};

// emoticons/simplesmileys.js

if (!EmoticonSets) var EmoticonSets = {};

EmoticonSets.SimpleSmileys = {
name: "Simple Smileys",
author: "Leo Bolin",
home: "http://leobolin.net/simplesmileys/",
classes: "simple-smileys",
imgPath: "assets/emoticons/simple-smileys/",
mappings: {
"o:)": "angel.png",
"O:)": "angel.png",
"0:)": "angel.png",
"0-:)": "angel.png",
"o:-)": "angel.png",
"O:-)": "angel.png",
":@": "angry.png",
":-@": "angry.png",
":s": "confused.png",
":S": "confused.png",
":-s": "confused.png",
":-S": "confused.png",
"B)": "cool.png",
"B-)": "cool.png",
";'(": "crying.png",
":'(": "crying.png",
':"(': "crying.png",
":*(": "crying.png",
";_;": "crying.png",
";'-(": "crying.png",
":'-(": "crying.png",
':"-(': "crying.png",
":*-(": "crying.png",
";3": "cute_smart.png",
":3": "cute.png",
"&gt;:)": "devil.png",
"&gt;:-)": "devil.png",
":E": "eee.png",
"):)": "evil.png",
"]:)": "evil.png",
":O": "gasp.png",
":o": "gasp.png",
":0": "gasp.png",
":-O": "gasp.png",
":-o": "gasp.png",
":-0": "gasp.png",
":-$": "greedy.png",
":$": "greedy.png",
":D": "grin.png",
":-D": "grin.png",
";D": "grin.png",
";-D": "grin.png",
"=D": "grin.png",
"&lt;3": "heart.png",
"(L)": "heart.png",
"^^^": "joyful.png",
"^,^": "joyful_2.png",
"^.^": "joyful_2.png",
"^_^": "joyful_3.png",
";X": "lips_sealed.png",
":X": "lips_sealed.png",
":-X": "lips_sealed.png",
";-X": "lips_sealed.png",
"8D": "madly_happy.png",
"8-D": "madly_happy.png",
"&gt;_&lt;": "pinching_eyes.png",
"&gt;.&lt;": "pinching_eyes_2.png",
"&gt;,&lt;": "pinching_eyes_2.png",
xD: "pinching_grin.png",
XD: "pinching_grin.png",
"o.O": "shocked.png",
o_O: "shocked.png",
"o.o": "shocked.png",
"o.0": "shocked.png",
o_o: "shocked.png",
o_0: "shocked.png",
"O.o": "shocked_2.png",
O_o: "shocked_2.png",
"O.O": "shocked_2.png",
"0.o": "shocked_2.png",
O_O: "shocked_2.png",
"0_o": "shocked_2.png",
":&": "sick.png",
":)": "smile.png",
":-)": "smile.png",
"=)": "smile.png",
":]": "smile.png",
":-]": "smile.png",
":|": "speechless.png",
":I": "speechless.png",
":l": "speechless.png",
"8)": "stupid.png",
"8-)": "stupid.png",
"-_-": "tired.png",
"-__-": "tired.png",
"-___-": "tired.png",
"-.-": "tired.png",
";p": "tongue_out_wink.png",
";P": "tongue_out_wink.png",
";-p": "tongue_out_wink.png",
";-P": "tongue_out_wink.png",
":p": "tongue_out.png",
":P": "tongue_out.png",
":-p": "tongue_out.png",
":-P": "tongue_out.png",
":\\": "uncertain_2.png",
":-\\": "uncertain_2.png",
":/": "uncertain.png",
":-/": "uncertain.png",
":(": "unhappy.png",
":-(": "unhappy.png",
"=(": "unhappy.png",
":[": "unhappy.png",
":-[": "unhappy.png",
"(:": "upside.png",
"(-:": "upside.png",
";)": "wink.png",
";-)": "wink.png",
"'w'": "ww.png",
"*w*\u00b4": "ww.png",
"^w^": "ww2.png",
xP: "xp.png"
}
};

// emoticons/sae-tweek.js

if (!EmoticonSets) var EmoticonSets = {};

EmoticonSets.SAE = {
name: "SAE Tweek",
author: "",
home: "http://sae.tweek.us/",
classes: "sae-tweek",
imgPath: "source/emoticons/sae-tweek/",
regexOpen: "(:?)",
regexClose: "([s]?)",
mappings: {
":11tea:": "emot-11tea.gif",
":3:": "emot-3.gif",
":aaa:": "emot-aaa.gif",
":aaaaa:": "emot-aaaaa.gif",
":airquote:": "emot-airquote.gif",
":allears:": "emot-allears.gif",
":angel:": "emot-angel.gif",
":argh:": "emot-argh.gif",
":arghfist:": "emot-arghfist.gif",
":bang:": "emot-bang.gif",
":banjo:": "emot-banjo.gif",
":black101:": "emot-black101.gif",
":blush:": "emot-blush.gif",
":bravo2:": "emot-bravo2.gif",
":butt:": "emot-butt.gif",
":catholic:": "emot-catholic.gif",
":cawg:": "emot-cawg.gif",
":cb:": "emot-clownballoon.gif",
":cheers:": "emot-cheers.gif",
":chef:": "emot-chef.gif",
":clint:": "emot-clint.gif",
":coffee:": "emot-coffee.gif",
":colbert:": "emot-colbert.gif",
":comeback:": "emot-comeback.gif",
":commissar:": "emot-commissar.gif",
":confused:": "confused.gif",
":cool:": "cool.gif",
":cop:": "emot-cop.gif",
":corsair:": "emot-corsair.gif",
":crossarms:": "emot-crossarms.gif",
":cry:": "emot-crying.gif",
":cthulhu:": "emot-cthulhu.gif",
":dance:": "emot-dance.gif",
":devil:": "emot-devil.gif",
":doh:": "emot-doh.gif",
":downs:": "emot-downs.gif",
":downsgun:": "emot-downsgun.gif",
":downsrim:": "emot-downsrim.gif",
":downswords:": "emot-downswords.gif",
":drac:": "emot-drac.gif",
":eek:": "emot-eek.gif",
":emo:": "emot-emo.gif",
":eng101:": "emot-eng101.gif",
":eng99:": "emot-eng99.gif",
":engleft:": "emot-engleft.gif",
":ese:": "emot-ese.gif",
":f5:": "emot-f5.gif",
":f5h:": "emot-f5h.gif",
":fap:": "emot-fappery.gif",
":fh:": "emot-fh.gif",
":flame:": "emot-flame.gif",
":gay:": "emot-gay.gif",
":geno:": "emot-geno.gif",
":ghost:": "emot-ghost.gif",
":gibs:": "emot-gibs.gif",
":glomp:": "emot-glomp.gif",
":golfclap:": "emot-golfclap.gif",
":gonk:": "emot-gonk.gif",
":greatgift:": "emot-greatgift.gif",
":haw:": "emot-haw.gif",
":hawaaaafap:": "emot-hawaaaafap.gif",
":hehe:": "emot-hehe.gif",
":hf:": "emot-hf.gif",
":hfive:": "emot-hfive.gif",
":hist101:": "emot-hist101.gif",
":hitler:": "emot-hitler.gif",
":holy:": "emot-holy.gif",
":huh:": "emot-huh.gif",
":hydrogen:": "emot-hydrogen.gif",
":j:": "emot-j.gif",
":jerkbag:": "emot-jerkbag.gif",
":jewish:": "emot-jewish.gif",
":jihad:": "emot-jihad.gif",
":keke:": "emot-keke.gif",
":mad:": "mad.gif",
":mmmhmm:": "mmmhmm.gif",
":monocle:": "emot-monocle.gif",
":munch:": "emot-munch.gif",
":neckbeard:": "emot-neckbeard.gif",
":niggly:": "emot-niggly.gif",
":ninja:": "emot-ninja.gif",
":nyd:": "emot-nyd.gif",
":o:": "redface.gif",
":ohdear:": "emot-ohdear.png",
":patriot:": "emot-patriot.gif",
":pedo:": "emot-pedo.gif",
":pervert:": "emot-pervert.gif",
":pirate:": "emot-pirate.gif",
":pseudo:": "emot-pseudo.gif",
":raise:": "emot-raise.gif",
":rant:": "emot-rant.gif",
":redhammer:": "emot-redhammer.gif",
":reject:": "emot-reject.gif",
":respek:": "emot-respek.gif",
":rimshot:": "emot-rimshot.gif",
":roboluv:": "emot-roboluv.gif",
":rock:": "emot-rock.gif",
":roflolmao:": "emot-roflolmao.gif",
":rolleye:": "emot-rolleye.gif",
":rolleyes:": "rolleyes.gif",
":saddowns:": "emot-saddowns.gif",
":science:": "emot-science.gif",
":shlick:": "emot-shlick.gif",
":shobon:": "emot-shobon.gif",
":sigh:": "emot-sigh.gif",
":silent:": "emot-silent.gif",
":siren:": "emot-siren.gif",
":ssh:": "emot-ssh.gif",
":ssj:": "emot-ssj.gif",
":suicide:": "emot-suicide.gif",
":sun:": "emot-sun.gif",
":supaburn:": "emot-supaburn.gif",
":sweatdrop:": "emot-sweatdrop.gif",
":swoon:": "emot-swoon.gif",
":sympathy:": "emot-sympathy.gif",
":tinfoil:": "emot-tinfoil.gif",
":tipshat:": "emot-tiphat.gif",
":toot:": "emot-toot.gif",
":twisted:": "emot-twisted.gif",
":v:": "emot-v.gif",
":what:": "emot-what.gif",
":whip:": "emot-whip.gif",
":witch:": "emot-witch.gif",
":woop:": "emot-woop.gif",
":words:": "emot-words.gif",
":worship:": "emot-worship.gif",
":wth:": "emot-wth.gif",
":xd:": "emot-xd.gif",
":yarr:": "emot-yarr.gif",
":zombie:": "emot-zombie.gif",
":zoro:": "emot-zoro.gif",
":10bux:": "emot-10bux.gif",
":20bux:": "emot-20bux.gif",
":banme:": "emot-banme.gif",
":bustem:": "emot-bustem.png",
":byewhore:": "emot-byewhore.gif",
":byob:": "emot-byob.gif",
":cmon:": "emot-cmon.gif",
":coupons:": "emot-coupons.gif",
":damn:": "emot-damn.gif",
":dealwithit:": "emot-dealwithit.jpg",
":downsowned:": "emot-downsowned.gif",
":effort:": "emot-effort.gif",
":filez:": "emot-filez.gif",
":firstpost:": "emot-firstpost.gif",
":frogout:": "emot-frogout.gif",
":ftbrg:": "emot-ftbrg.gif",
":gb2byob:": "emot-gb2byob.gif",
":gb2fyad:": "emot-gb2fyad.gif",
":gb2gbs:": "emot-gb2gbs.gif",
":gb2hd2k:": "emot-gb2hd2k.gif",
":getout:": "emot-getout.png",
":godwin:": "emot-godwin.gif",
":goof:": "emot-goof.gif",
":hurr:": "emot-hurr.gif",
":iceburn:": "emot-iceburn.gif",
":iia:": "emot-iia.png",
":iiam:": "emot-iiam.gif",
":laffo:": "emot-laffo.gif",
":lol:": "emot-lol.gif",
":master:": "emot-master.gif",
":ms:": "emot-ms.gif",
":nattyburn:": "emot-nattyburn.gif",
":nms:": "emot-nms.gif",
":nws:": "emot-nws.gif",
":owned:": "emot-owned.gif",
":protarget:": "emot-protarget.gif",
":their:": "emot-their.gif",
":vd:": "emot-vd.gif",
":w00t:": "emot-w00t.gif",
":w2byob:": "emot-w2byob.gif",
":waycool:": "emot-waycool.gif",
":whoptc:": "emot-whoptc.gif",
":wrongful:": "emot-wrongful.gif",
":wtc:": "emot-wtc.gif",
":wtf:": "emot-wtf.gif",
":yohoho:": "emot-yohoho.gif",
":aslol:": "emot-aslol.gif",
":backtowork:": "emot-backtowork.gif",
":barf:": "emot-barf.gif",
":boonie:": "emot-boonie.gif",
":bravo:": "emot-bravo.gif",
":buddy:": "emot-buddy.gif",
":byodame:": "emot-byodame.gif",
":byodood:": "emot-byodood.gif",
":c00l:": "emot-c00l.gif",
":c00lbert:": "emot-c00lbert.gif",
":can:": "emot-can.gif",
":chord:": "emot-chord.gif",
":crow:": "emot-crow.gif",
":dawkins101:": "emot-Dawkins102.gif",
":dogout:": "emot-dogout.gif",
":downsbravo:": "emot-downsbravo.gif",
":fiesta:": "emot-fiesta.gif",
":frog:": "emot-frog.gif",
":frogbon:": "emot-frogbon.gif",
":frogc00l:": "emot-frogc00l.gif",
":froggonk:": "emot-froggonk.gif",
":frogsiren:": "emot-frogsiren.gif",
":fyadride:": "emot-fyadride.gif",
":gbsmith:": "emot-gbsmith.gif",
":goonsay:": "emot-goonsay.gif",
":hampants:": "emot-hampants.gif",
":mmmsmug:": "emot-mmmsmug.gif",
":psyboom:": "emot-psyboom.gif",
":pwn:": "emot-pwn.gif",
":razz:": "emot-razz.gif",
":regd09:": "emot-regd09.gif",
":rodimus:": "emot-rodimus.gif",
":rubshands:": "rubshandstogetherandgrinsevilly.gif",
":shivdurf:": "emot-shivdurf.gif",
":smith:": "emot-smith.gif",
":smithicide:": "emot-smithicide.gif",
":smug:": "emot-smug.gif",
":smugbert:": "emot-smugbert.gif",
":smugdog:": "emot-smugdog.gif",
":smugissar:": "emot-smugissar.gif",
":smugspike:": "emot-smugspike.png",
":stoat:": "emot-stoat.gif",
":sweep:": "emot-sweep.gif",
":ughh:": "emot-ughh.gif",
":unsmigghh:": "emot-unsmigghh.gif",
":unsmith:": "emot-unsmith.gif",
":wotwot:": "emot-wotwot.gif",
":911:": "emot-911.gif",
":australia:": "emot-australia.gif",
":belarus:": "emot-belarus.gif",
":britain:": "emot-britain.gif",
":ca:": "emot-ca.gif",
":canada:": "emot-canada.gif",
":china:": "emot-china.gif",
":denmark:": "emot-denmark.gif",
":eurovision:": "emot-eurovision.png",
":france:": "emot-france.gif",
":fsmug:": "emot-fsmug.gif",
":italy:": "emot-italy.gif",
":mexico:": "emot-mexico.gif",
":norway:": "emot-norway.gif",
":scotland:": "emot-scotland.gif",
":spain:": "emot-spain.gif",
":sweden:": "emot-sweden.gif",
":tf:": "emot-tf.gif",
":tito:": "emot-tito.gif",
":ussr:": "emot-ussr.gif",
":?:": "emot-question.gif",
":axe:": "emot-axe.gif",
":bsg:": "emot-bsg.gif",
":bubblewoop:": "emot-bubblewoop.gif",
":c:": "emot-c.png",
":d:": "emot-d.png",
":doink:": "emot-doink.gif",
":doom:": "emot-doom.gif",
":dota101:": "emot-dota101.gif",
":flashfact:": "emot-flashfact.gif",
":flashfap:": "emot-flashfap.gif",
":foxnews:": "emot-foxnews.gif",
":fry:": "emot-fry.gif",
":golgo:": "emot-golgo.gif",
":h:": "emot-h.png",
":itjb:": "emot-itjb.gif",
":kakashi:": "emot-kakashi.gif",
":kratos:": "emot-kratos.gif",
":laugh:": "emot-laugh.gif",
":lost:": "emot-lost.gif",
":lovewcc:": "emot-lovewcc.gif",
":lron:": "emot-lron.gif",
":mario:": "emot-mario.gif",
":megaman:": "emot-megaman.gif",
":orks:": "emot-orks.gif",
":pcgaming1:": "emot-pcgaming1.gif",
":pcgaming:": "emot-pcgaming.gif",
":qfg:": "emot-qfg.gif",
":quagmire:": "emot-quagmire.gif",
":ramsay:": "emot-ramsay.gif",
":s:": "emot-s.png",
":sg:": "emot-sg.gif",
":spidey:": "emot-spidey.gif",
":stat:": "emot-stat.gif",
":todd:": "emot-todd.gif",
":twentyfour:": "emot-twentyfour.gif",
":wal:": "emot-wal.gif",
":wcc:": "emot-wcc.gif",
":wcw:": "emot-wcw.gif",
":wookie:": "emot-wookie.gif",
":yoshi:": "emot-yoshi.gif",
":zoid:": "emot-zoid.gif",
":am:": "emot-am.gif",
":awesomelon:": "emot-awesomelon.gif",
":bahgawd:": "emot-bahgawd.gif",
":bandwagon:": "emot-bandwagon.gif",
":bick:": "emot-bick.gif",
":bigtran:": "emot-bigtran.gif",
":btroll:": "emot-buttertroll.gif",
":burger:": "emot-burger.gif",
":byobear:": "emot-byobear.gif",
":c00lbutt:": "emot-c00lbutt.gif",
":camera6:": "emot-camera6.gif",
":cenobite:": "emot-chatter.gif",
":chiyo:": "emot-chio.gif",
":coal:": "emot-coal.gif",
":coolfish:": "emot-coolfish.gif",
":derp:": "emot-derp.gif",
":drum:": "emot-drum.gif",
":evil:": "evol-anim.gif",
":fireman:": "emot-fireman.gif",
":flag:": "emot-flag.gif",
":fork:": "emot-fork.png",
":frogdowns:": "emot-frogdowns.png",
":furcry:": "emot-furcry.gif",
":FYH:": "emot-FYH.gif",
":george:": "emot-george.gif",
":goleft:": "emot-goleft.gif",
":gonchar:": "emot-gonchar.gif",
":google:": "emot-google.gif",
":goon:": "emot-goon.gif",
":goonboot:": "emot-goonboot.gif",
":gooncamp:": "emot-gooncamp.gif",
":gtfoycs:": "emot-gtfoycs.gif",
":guitar:": "emot-guitar.gif",
":happyelf:": "emot-happyelf.gif",
":havlat:": "emot-havlat.gif",
":hchatter:": "emot-hchatter.gif",
":hellyeah:": "emot-hellyeah.gif",
":holymoley:": "emot-holymoley.gif",
":horse:": "emot-horse.gif",
":hr:": "emot-hr.gif",
":iiaca:": "emot-iiaca.gif",
":ironicat:": "emot-ironicat.gif",
":irony:": "emot-irony.gif",
":joel:": "emot-joel.gif",
":kamina:": "emot-kamina.gif",
":kiddo:": "emot-kiddo.gif",
":killdozer:": "emot-killdozer.gif",
":krad:": "emot-krad2.gif",
":krakken:": "emot-kraken.gif",
":love:": "emot-love.gif",
":madmax:": "emot-madmax.gif",
":mason:": "emot-mason.gif",
":milk:": "emot-milk.gif",
":monar:": "emot-monar.gif",
":moustache:": "emot-moustache.gif",
":mufasa:": "emot-mufasa.png",
":negative:": "negativeman-55f.png",
":nyoron:": "emot-nyoron.gif",
":objection:": "emot-objection.gif",
":page3:": "emot-page3.gif",
":phone:": "emot-phone.gif",
":phoneb:": "emot-phoneb.gif",
":phoneline:": "emot-phoneline.gif",
":pipe:": "emot-pipe.gif",
":pluto:": "emot-pluto.gif",
":pranke:": "emot-pranke.gif",
":psyberger:": "emot-psyberger.gif",
":psyduck:": "emot-psyduck.gif",
":psylon:": "emot-psylon.gif",
":psypop:": "emot-psypop.gif",
":pt:": "emot-onlyoption.gif",
":q:": "emot-q.gif",
":qirex:": "emot-qirex.gif",
":rice:": "emot-rice.gif",
":riker:": "emot-riker.gif",
":rudebox:": "emot-rudebox.gif",
":russbus:": "emot-russbus.gif",
":sax:": "emot-sax.gif",
":sharpton:": "emot-sharpton.gif",
":shibaz:": "emot-shibaz.png",
":shopkeeper:": "emot-shopkeeper.gif",
":signings:": "emot-signings.gif",
":sissies:": "emot-sissies.gif",
":slick:": "emot-slick.gif",
":smugndar:": "emot-smugndar.gif",
":snoop:": "emot-snoop.gif",
":sotw:": "emot-sotw.gif",
":spergin:": "emot-spergin.png",
":spooky:": "emot-spooky.gif",
":stalker:": "emot-stalker.gif",
":synpa:": "emot-synpa.gif",
":taco:": "emot-taco.gif",
":tbear:": "emot-trashbear.gif",
":techno:": "emot-techno.gif",
":toughguy:": "emot-toughguy.gif",
":toxx:": "emot-toxx.gif",
":tubular:": "emot-tubular.gif",
":uhaul:": "emot-uhaul.gif",
":vick:": "emot-vick.gif",
":whatup:": "emot-whatup.gif",
":wink:": "emot-wink.gif",
":wmwink:": "emot-wmwink.png",
":wom:": "emot-wom.gif",
":woof:": "emot-woof.gif",
":wooper:": "emot-wooper.gif",
":xie:": "emot-xie.gif",
":zerg:": "emot-zerg.gif",
":2bong:": "emot-2bong.png",
":350:": "emot-350.gif",
":420:": "emot-weed.gif",
":catdrugs:": "emot-catdrugs.gif",
":dominic:": "emot-dominic.gif",
":drugnerd:": "emot-drugnerd.gif",
":lsd:": "emot-lsd.gif",
":obama:": "emot-obama.gif",
":shroom:": "emot-shroom.gif",
":tinsley:": "classic_fillmore.gif",
":weed:": "emot-weed_.gif",
":anime:": "emot-anime.png",
":baby:": "emot-baby.png",
":beck:": "beck.001.gif",
":catstare:": "catstare.001.gif",
":cedric:": "cedric.001.png",
":circlefap:": "emot-circlefap.gif",
":confuoot:": "confuoot.001.gif",
":dice:": "dice.001.gif",
":dukedog:": "dukedog.001.png",
":edi:": "edi.001.gif",
":faggot:": "emot-faggot.gif",
":feelsgood:": "feelsgood.001.png",
":fella:": "fella.001.gif",
":fsn:": "emot-fsn.gif",
":getin:": "getin.001.gif",
":gurf:": "emot-gurf.gif",
":hb:": "emot-hb.gif",
":helladid:": "helladid.001.gif",
":heysexy:": "heysexy.001.gif",
":japan:": "japan.001.gif",
":jiggled:": "emot-jiggled.gif",
":jp:": "emot-jp.gif",
":legion:": "legion.001.gif",
":liara:": "liara.001.gif",
":m10:": "emot-m10.gif",
":mcnabb:": "emot-mcnabb.png",
":mordin:": "emot-mordin.gif",
":moreevil:": "moreevil.001.gif",
":nixon:": "emot-nixon.gif",
":nolan:": "emot-nolan.gif",
":notch:": "notch.001.png",
":notfunny:": "emot-notfunny.gif",
":nyan:": "nyan.001.gif",
":ocelot:": "emot-ocelot.gif",
":ohdearsass:": "ohdearsass.001.png",
":okpos:": "okpos.001.gif",
":parrot:": "emot-parrot.gif",
":pray:": "emot-pray.gif",
":punto:": "emot-punto.gif",
":pwm:": "emot-pwm.gif",
":qq:": "emot-qq.gif",
":qqsay:": "emot-qqsay.gif",
":ranbowdash:": "ranbowdash.001.png",
":regd10:": "emot-regd10.png",
":riot:": "riot.001.gif",
":rms2:": "rms2.001.png",
":rms:": "rms.001.png",
":rolldice:": "rolldice.001.gif",
":russo:": "russo.001.gif",
":sbahj:": "emot-sbahj.gif",
":shepface:": "emot-shepface.gif",
":shepicide:": "shepicide.001.gif",
":sicknasty:": "emot-sicknasty.gif",
":smithfrog:": "emot-smithfrog.png",
":smugbird:": "emot-smugbird.gif",
":smuggo:": "emot-smuggo.gif",
":smugteddie:": "emot-smugteddie.gif",
":solanadumb:": "emot-solanadumb.png",
":stare:": "emot-stare.gif",
":staredog:": "staredog.001.gif",
":steam:": "steam.001.gif",
":suspense:": "suspense.001.gif",
":tali:": "tali.001.gif",
":thumbsup:": "emot-thumbsup.gif",
":thurman:": "emot-thurman.gif",
":tizzy:": "emot-tizzy.gif",
":turianass:": "emot-turianass.gif",
":viconia:": "emot-viconia.gif",
":viggo:": "emot-viggo.gif",
":yum:": "yum.001.gif",
":zaeed:": "zaeed.001.gif",
":frogout3:": "frog-ssj3.gif",
":grandma:": "emot-grandma.gif",
":w-hat:": "emot-w-hat.gif",
":yousuck:": "emot-yousuck.gif"
}
};

// default_filters.js

var SpazDefaultTextFilters = [ {
label: "nl2br",
func: function(e) {
return e = sch.nl2br(e), e;
}
}, {
label: "simplemarkup",
func: function(e) {
return e = e.replace(/(\s|^)\*([^\*]+)\*($|[\s:.!,;])/g, "$1<strong>$2</strong>$3"), e = e.replace(/(\s|^)`([^\`]+)`($||[\s:.!,;])/g, "$1<code>$2</code>$3"), e = e.replace(/(\s|^)_([^\_]+)_($||[\s:.!,;])/g, "$1<em>$2</em>$3"), e;
}
}, {
label: "autolink",
func: function(e) {
return e = AppUtils.makeItemsClickable(e), e;
}
}, {
label: "SAE",
func: function(e) {
return window.SAE || (window.SAE = new Emoticons("SAE")), e = window.SAE.apply(e), e;
}
}, {
label: "SimpleSmileys",
func: function(e) {
return window.SpazSimpleSmileys || (window.SpazSimpleSmileys = new Emoticons("SimpleSmileys")), e = window.SpazSimpleSmileys.apply(e), e;
}
} ];

// cache.js

window.AppCache = {}, window.AppCache._data = {
users: new Cache(500),
tweets: new Cache(1e3)
}, window.AppCache.addUser = function(e, t, n) {
var r = t + "___" + e;
AppCache._data.users.setItem(r, n);
}, window.AppCache.getUser = function(e, t, n, r, i) {
var s = t + "___" + e, o = AppCache._data.users.getItem(s);
if (o) return r(o), o;
var u = AppUtils.makeTwitObj(n);
return u.getUser("@" + e, function(n) {
n = AppUtils.convertToUser(n), AppCache.addUser(e, t, n), r(n);
}, i), null;
};

// lastread.js

var LastRead = {};

LastRead.get = function(e) {
return App.Prefs.get("lastread_" + e) || 1;
}, LastRead.set = function(e, t) {
App.Prefs.set("lastread_" + e, t);
};

// Container.js

function clearSelection() {
document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges();
}

enyo.kind({
name: "Neo.Container",
classes: "neo-container enyo-fit",
events: {
onRefreshAllFinished: "",
onShowAccountsPopup: "",
onDestroy: "hideDetailPane",
onGoPreviousViewEvent: "goPreviousViewEvent",
onGetViewEvents: "getViewEvents",
onShowImageView: "showImageView"
},
handlers: {},
published: {
actions: [],
viewEvents: [],
columnData: [],
_boxes: new Array(9)
},
components: [ {
kind: "Neo.Notifier",
name: "notifier"
}, {
name: "_box",
layoutKind: "FittableRowsLayout",
classes: "enyo-fit",
fit: !0
}, {
name: "background"
} ],
create: function() {
this.inherited(arguments), this.boxes._ = this, AppUI.addFunction("reloadColumns", this.reloadColumns, this), AppUI.addFunction("search", this.search, this), AppUI.addFunction("fixSidebar", this.fixSidebar, this), AppUI.addFunction("saveData", this.saveColumnData, this), AppUI.addFunction("compose", this.compose, this), AppUI.addFunction("reply", this.reply, this), AppUI.addFunction("repost", this.repost, this), AppUI.addFunction("repostManual", this.repostManual, this), AppUI.addFunction("directMessage", this.directMessage, this), AppUI.addFunction("removeTweetById", this.removeTweetById, this), AppUI.addFunction("loadColumn", this.loadColumn, this), AppUI.addFunction("showMore", this.showMore, this), AppUI.addFunction("doMore", this.doMore, this), AppUI.addFunction("addTweetToNotifications", function(e) {
this.$.notifier.addTweet(e);
}, this), AppUI.addFunction("raiseNotifications", function() {
this.$.notifier.raiseNotifications();
}, this), AppUI.addFunction("userChange", function(e) {
this.saveColumnData(e), this.reloadColumns();
}, this), AppUI.addFunction("newMessage", function() {
this.showMore("composePopup");
}, this), AppUI.addFunction("viewUser", this.showUserView, this), AppUI.addFunction("viewTweet", this.showTweetView, this), AppUI.addFunction("refresh", this.refreshAll, this), AppUI.addFunction("rerenderTimelines", function() {
this.columnsFunction("render");
}, this);
if (!this.checkForUsers()) return;
this.loadingColumns = 0, this.reloadColumns();
},
reloadColumns: function() {
var e = this.columnData, t = this.columnData.length, n = App.Prefs.get("currentUser"), r = App.Prefs.get("columns_" + n), i;
this.log("reloading columns...");
for (var s = 0; s < t; s++) {
var o = this.columnData.splice(0, 1);
enyo.Signals.send("updateUnread", {
unread: 0,
title: o.type
});
}
this.$._box.destroyClientControls(), this._boxes = null, this._boxes = new Array(9), this.boxes.currentBox = null;
if (!App.Prefs.get("currentUser") && App.Users.getAll()[0] != null) App.Prefs.set("currentUser", App.Users.getAll()[0].id); else if (!App.Prefs.get("currentUser") || App.Users.getAll().length <= 0) return;
window.autocomplete = [], i = App.Users.get(App.Prefs.get("currentUser")), AppUtils.makeTwitObj(i.id).getFriendsList(i.service_id, -1, enyo.bind(this, function(e) {
enyo.forEach(e, function(e) {
window.autocomplete.push(e.screen_name);
});
})), this.columnData = enyo.clone(this.getDefaultColumns()), App.Prefs.get("save-on-exit") && r && r.length > 0 && enyo.mixin(this.columnData, r), this.log("preparing columns...", this.columnData), this.loadColumn("Timeline"), this.runBackground();
},
columnsFunction: function(e, t, n) {
if (!this.$.timeline) return 0;
var r = 0, i = this.$.timeline.children[0];
try {
if (t && t.account_id && t.account_id !== i.getInfo().accounts[0]) return;
if (t && t.column_types && t.column_types.indexOf(i.getInfo().type) < 0) return;
enyo.asyncMethod(i, e, t), r++;
} catch (s) {
console.error("columnsFunction:", s, s.message);
}
return r;
},
runBackground: function() {
this.log();
var e = [ "timeline", "mentions", "messages" ], t = [ "filters" ];
this.boxes.backgroundProcessed = 0;
if (this.$.timeline) {
var n = this.columnTypeToName(this.$.timeline.children[0].info.type), r = enyo.indexOf(n, e);
r != -1 && t.push(n);
}
for (var i = 0; i < t.length; i++) {
var r = enyo.indexOf(t[i], e);
r != -1 && e.splice(r, 1);
}
for (var i = 0; i < e.length; i++) {
var s = e[i], o = this.findIn(this.columnTypeToName(s.toLowerCase()), this.columnData), u = this.getColumn(o);
u.kind = "Neo.BackgroundColumn", u.callback = this.backgroundCallback, this.log("running background for", u.info.type, enyo.clone(u), "at index", u.index), this.$.background.createComponent(u, {
owner: this
}), this.$.background.render();
}
},
backgroundCallback: function(e, t) {
var n = e.owner;
this.log(this.info.type), n.boxes.saveBackground(this.name), e.destroy(), n.$.background.render(), n.saveColumnData();
},
boxes: {
_: null,
BOX_ORDER: [ "timeline", "composePopup", "aboutPopup", "settingsPopup", "accountsPopup", "searchPopup", "detailContent", "themes", "filterPopup" ],
currentBox: "",
ludacris: [ {
published: {
savedData: {}
},
speed: [ {
name: "toolbar",
kind: "Neo.Toolbar",
closeable: !1,
header: "Neo",
toolbarTap: "scrollBehavior",
toolbarHold: "holdBehavior",
onClose: "deleteColumn",
left: [ {
kind: "Neo.Button",
icon: "refresh",
text: "Refresh",
ontap: "loadNewer"
} ],
right: [ {
kind: "Neo.Button",
icon: "compose",
text: "Compose",
ontap: "compose"
} ]
}, {
name: "timeline",
kind: "FittableRows",
fit: !0
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "composePopup",
kind: "Neo.ComposePopup",
fit: !0,
onClose: "actionBack"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "aboutPopup",
kind: "Neo.AboutPopup",
fit: !0,
onClose: "actionBack"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "settingsPopup",
kind: "Neo.SettingsPopup",
fit: !0,
onClose: "actionBack"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "accountsPopup",
kind: "Neo.AccountsPopup",
fit: !0,
onClose: "actionBack",
onAccountAdded: "doAccountAdded",
onAccountRemoved: "doAccountRemoved"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "searchPopup",
kind: "Neo.SearchPopup",
fit: !0,
onClose: "actionBack"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "detailContent",
kind: "Panels",
fit: !0,
draggable: !1
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "themes",
kind: "Neo.Themes",
fit: !0,
onClose: "actionBack"
} ]
}, {
published: {
savedData: {}
},
speed: [ {
name: "filterPopup",
kind: "Neo.FilterPopup",
fit: !0,
onClose: "actionBack"
} ]
} ],
swap: function(e) {
this.currentBox == "timeline" && this._.$.timeline.children[0].anchor();
var t = this._.$._box, n = this.getBox(), r = this.getStatic(e);
console.log("swapping..", this.currentBox, e, enyo.clone(this), enyo.clone(n));
switch (this.currentBox) {
case null:
this._._boxes[this.getIndex(e)] = {};
break;
case "timeline":
this._._boxes[0][this._.$.timeline.children[0].info.type] = enyo.clone(n);
case "detailContent":
break;
default:
this._._boxes[this._.boxes.getIndex(this.currentBox)] = enyo.clone(n);
}
this.currentBox = this.BOX_ORDER[this.getIndex(e)], t.destroyClientControls(), t.createComponents(r.speed, {
owner: this._
}), t.render();
},
getIndex: function(e) {
return enyo.indexOf(e, this.BOX_ORDER);
},
getStatic: function(e) {
return typeof e == "string" && (e = this.getIndex(e)), this.ludacris[e];
},
getBox: function() {
var e = {}, t = this._.$[this.currentBox], n = function(e) {
var t = enyo.clone(e.published);
for (var n in e.published) t[n] = e[n];
return t;
};
switch (this.currentBox) {
case "timeline":
t = t.children[0];
break;
case "detailContent":
break;
default:
return null;
}
return e = enyo.clone(n(t)), e;
},
backgroundProcessed: 0,
saveBackground: function(e) {
var t = this._._boxes, n = this.getBoxBackground(e), r = n.info.type;
t[0][r] === undefined && (t[0][r] = {}), enyo.mixin(t[0][r], enyo.clone(n)), this.backgroundProcessed++;
},
getBoxBackground: function(e) {
var t = {}, n = this._.$[e], r = function(e) {
var t = enyo.clone(e.published);
for (var n in e.published) t[n] = e[n];
return t;
};
return t = enyo.clone(r(n)), t;
}
},
loadColumn: function(e) {
var t = this.findIn(this.columnTypeToName(e.toLowerCase()), this.columnData);
if (e == null) {
this.showTimeline();
return;
}
this.log("loading column", e.toLowerCase(), "exists at index", t, this.columnData[t]);
if (typeof t == "number") {
this.boxes.swap("timeline");
var n = this.getColumn(t);
this.log("adding column", n.info.type, enyo.clone(n), "at index", n.index), this.$.timeline.createComponent(n, {
owner: this
}), this.buildHeaders(e), this.lastIndex = t;
} else {
var r;
switch (e.toLowerCase()) {
case "favorites":
r = {
type: SPAZ_COLUMN_FAVORITES,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "trends":
r = {
type: SPAZ_COLUMN_TRENDS,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "retweets":
r = {
type: SPAZ_COLUMN_RETWEETS,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "lists":
r = {
type: SPAZ_COLUMN_LIST,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "search":
this.showMore("searchPopup");
return;
case "filters":
r = {
type: SPAZ_COLUMN_FILTERS,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "messages":
r = {
type: SPAZ_COLUMN_MESSAGES,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "timeline":
r = {
type: SPAZ_COLUMN_HOME,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
case "mentions":
r = {
type: SPAZ_COLUMN_MENTIONS,
accounts: [ App.Prefs.get("currentUser") ]
};
break;
default:
return;
}
this.createColumn(r), this.loadColumn(e);
}
this.render(), this.reflow(), this.owner.reflow();
},
getColumn: function(e) {
var t = enyo.clone(this.columnData[e]), n = enyo.clone(this._boxes[0][t.type]), r = {
name: "Column" + e,
info: t,
index: e,
kind: "Neo.Column",
onLoadStarted: "loadStarted",
onLoadFinished: "loadFinished",
owner: this,
tweets: t.tweets,
cache: t.cache
};
r.info.id || (r.info.id = _.uniqueId((new Date).getTime()));
switch (r.info.type) {
case SPAZ_COLUMN_MESSAGES:
r.states = [ "getDirectMessages", "getSentDirectMessages" ], r.radios = [ {
text: "Inbox",
icon: "inbox"
}, {
text: "Outbox",
icon: "outbox"
} ];
break;
case SPAZ_COLUMN_TRENDS:
r.kind = "Neo.TrendsColumn";
break;
case SPAZ_COLUMN_RETWEETS:
r.states = [ "sOf", "edBy", "edTo" ], r.radios = [ {
text: "of me",
icon: "tshirt"
}, {
text: "by me",
icon: "user"
}, {
text: "to me",
icon: "users"
} ];
break;
case SPAZ_COLUMN_LIST:
r.kind = "Neo.ListColumn", states = [ "all", "Members", "Timeline", "Subscribers" ], r.radios = [ {
text: "All",
icon: "list"
}, {
text: "Members",
icon: "members"
}, {
text: "Timeline",
icon: "timeline"
}, {
text: "Subscribers",
icon: "subscribers"
} ];
break;
case SPAZ_COLUMN_FILTERS:
r.kind = "Neo.FiltersColumn";
}
return r.fresh = !n.tweets || n.tweets.length == 0, n.tweets && t.tweets && n.tweets.length < t.tweets.length && delete n.tweets, n.cache && n.cache[0] && t.cache && t.cache[0] && n.cache[0].length < t.cache[0].length && delete n.cache, enyo.mixin(r, n), r;
},
columnTypeToName: function(e) {
var t = e;
switch (e) {
case "home":
t = "timeline";
break;
case "timeline":
t = "home";
break;
case "lists":
t = "list";
break;
case "list":
t = "lists";
}
return t;
},
cleanColumns: function() {
console.log("stripping columns to barebones..."), enyo.forEach(this.columnData, function(e) {
switch (e.type) {
case SPAZ_COLUMN_MENTIONS:
case SPAZ_COLUMN_HOME:
case SPAZ_COLUMN_MESSAGES:
break;
default:
this.columnData.splice(enyo.indexOf(e), 1);
}
}, this);
},
buildHeaders: function(e) {
this.$.toolbar.setCloseable(!0);
switch (e.toLowerCase()) {
case "filters":
case "favorites":
case "retweets":
case "trends":
this.$.toolbar.setHeader(e);
break;
case "lists":
this.$.toolbar.setHeader(this.$.timeline.children[0].title);
break;
case "search":
this.$.toolbar.setHeader(this.$.timeline.children[0].info.query);
break;
default:
this.$.toolbar.setCloseable(!1), this.$.toolbar.setHeader(e);
}
this.$.toolbar.render(), this.$.toolbar.reflow();
},
createColumn: function(e) {
e.id = _.uniqueId((new Date).getTime()), this.saveColumnTweets(), this.columnData.push(e), console.log("creating column", e), this.render();
},
actionBack: function(e, t) {
this.log(this.actions), this.actions.pop(), this.columnClosed(), this.render();
},
columnClosed: function(e, t) {
this.log("action back:", enyo.clone(this.actions));
if (this.actions.length == 0) {
this.showTimeline();
return;
}
this.showMore(this.actions.pop());
},
fixSidebar: function() {
console.error("fixSidebar: deprecated");
},
showTimeline: function() {
if (this.lastIndex == null || !this.columnData[this.lastIndex]) this.lastIndex = this.columnData.length - 1;
var e = this.columnData[this.lastIndex], t = this.columnTypeToName(e.type);
console.log("showing timeline...", t, e, this.columnData), t = enyo.cap(t), this.loadColumn(t), AppUI.selectSidebarByName(t);
},
refreshAll: function(e) {
e == null && (e = App.Prefs.get("currentUser")), this.loadingColumns = 0;
var t = {};
e && (t.account_id = e, t.column_types = [ SPAZ_COLUMN_HOME, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_MENTIONS ]), this.columnsFunction("loadNewer", t, !0) === 0 && this.loadFinished(), this.runBackground();
},
loadNewer: function(e, t) {
AppUI.refresh(), AppUI.restartAutoRefresher();
},
timelinePickerChanged: function(e, t, n) {
this.setTimeline(t.content);
},
showMore: function(e, t) {
e != "undefined" && this.actions[this.actions.length - 1] != e && this.actions.push(e);
switch (e) {
case "detailContent":
if (this.$.detailContent) return;
break;
case "themes":
enyo.Signals.send("setFullscreen", !0);
break;
case "Profile":
var n = App.Users.get(App.Prefs.get("currentUser"));
console.log(n), this.actions.pop(), AppUI.viewUser(n.username, n.service, n.account_id);
return;
case "timeline":
console.error("SHOWMORE TIMELINE, FIXME");
return;
default:
}
this.boxes.swap(e), this.reflow(), this.$[e].reset && this.$[e].reset();
},
doMore: function(e) {
var t = e.name, n = e.fn, r = e.args;
this.$[t][n](r);
},
deleteColumn: function(e, t) {
var n = this.columnData, r = this.$.timeline.children[0], s = r.index, o = this._boxes[0];
console.log("DELETING COLUMN....", r, s, r.name, r.kind, enyo.clone(n));
if (n[s] === undefined) {
console.error("CANNOT ERASE COLUMN...", n);
return;
}
var u = n.splice(s, 1);
enyo.Signals.send("updateUnread", {
title: u[0].type,
unread: 0
}), delete o[i], r.destroy(), this.$._box.destroyClientControls(), console.log("column spliced, active destroyed", enyo.cloneArray(n), this.$._box), this.boxes.currentBox = null, this.actionBack();
},
loadStarted: function() {
this.loadingColumns++;
},
loadFinished: function() {
console.log("loadFinished..."), this.loadingColumns--, this.loadingColumns <= 0 && (this.bubble("onRefreshAllFinished"), setTimeout(AppUI.raiseNotifications.bind(this), 1e3), console.log("no more columns to load... raising notifications..."), this.saveColumnData()), this.reflow();
},
checkForUsers: function() {
return App.Users.getAll().length === 0 ? (AppUtils.showBanner("No accounts! You should add one."), this.showMore("accountsPopup"), enyo.Signals.send("setFullscreen", !0), this.$.accountsPopup.$.toolbar.setCloseable(!1), this.reflow(), !1) : (enyo.Signals.send("setFullscreen", !1), this.$.accountsPopup && this.$.accountsPopup.$.toolbar.setCloseable(!0), !0);
},
search: function(e, t) {
t == null && (t = App.Prefs.get("currentUser"));
var n = this.findIn(this.columnTypeToName(SPAZ_COLUMN_SEARCH), this.columnData);
if (typeof n == "number") {
this.loadColumn("search"), this.deleteColumn(), this.search(e, t);
return;
}
this.createColumn({
type: "search",
accounts: [ t ],
query: e
}), this.loadColumn("search"), AppUI.selectSidebarByName("Search");
},
composePrep: function() {
AppUI.showMore("composePopup"), this.$.composePopup.reset();
},
compose: function(e, t) {
var n = t && !e.$ ? t : App.Prefs.get("currentUser");
this.composePrep(), e.$ && (e = ""), this.$.composePopup.compose({
text: e,
account_id: n
});
},
reply: function(e) {
var t = e.account_id || App.Prefs.get("currentUser");
this.composePrep(), e.is_private_message ? this.$.composePopup.directMessage({
to: e.author_username,
text: null,
tweet: e,
account_id: t
}) : this.$.composePopup.replyTo({
tweet: e,
account_id: t
});
},
repost: function(e) {
var t = App.Prefs.get("currentUser");
this.composePrep(), e.is_private_message ? AppUtils.showBanner("Private messages cannot be retweeted") : this.$.composePopup.repost({
tweet: e,
account_id: t
});
},
repostManual: function(e) {
var t = App.Prefs.get("currentUser");
this.composePrep(), e.is_private_message ? AppUtils.showBanner("Private messages cannot be retweeted") : this.$.composePopup.repostManual({
tweet: e,
account_id: t
});
},
directMessage: function(e, t) {
var n = inTweet.account_id || App.Prefs.get("currentUser");
this.composePrep(), this.$.composePopup.directMessage({
to: e,
text: null,
account_id: n
});
},
removeTweetById: function(e) {
this.columnsFunction("removeTweetById", e);
},
getDefaultColumns: function(e) {
var t = [ {
type: SPAZ_COLUMN_HOME,
accounts: [ App.Prefs.get("currentUser") ],
id: _.uniqueId((new Date).getTime())
}, {
type: SPAZ_COLUMN_MENTIONS,
accounts: [ App.Prefs.get("currentUser") ],
id: _.uniqueId((new Date).getTime())
}, {
type: SPAZ_COLUMN_MESSAGES,
accounts: [ App.Prefs.get("currentUser") ],
id: _.uniqueId((new Date).getTime())
} ];
return t;
},
saveColumnData: function(e) {
if (App.Prefs.get("save-on-exit") != 1) return;
e == null && (e = App.Prefs.get("currentUser"));
var t = SPAZ_DEFAULT_PREFS.maxTweets, n = SPAZ_DEFAULT_PREFS.maxCached, r = [], i = function(e, t) {
return e && e.length > t && e.splice(t, e.length - t), e;
};
this.saveColumnTweets();
var s = enyo.clone(this.columnData);
enyo.forEach(s, function(e) {
var s = function() {
var t = [];
return e.cache && enyo.forEach(e.cache, function(e) {
t.push(i(e, n));
}, this), enyo.clone(t);
}, o = {
id: e.id,
type: e.type,
accounts: e.accounts,
query: e.query,
service: e.service,
list: e.list,
tweets: i(e.tweets, t) || [],
cache: s() || []
};
(o.tweets.length > 0 || o.cache && o.cache[0] && o.cache[0].length > 0) && r.push(o);
}), App.Prefs.set("columns_" + e, r), this.log(enyo.clone(r));
},
findIn: function(e, t) {
var n = -1;
for (var r in t) {
n++;
if (t[r].type == e) return n;
}
return !1;
},
saveColumnTweets: function() {
var e = 0, t = this.columnData, n = 0;
for (var r in this._boxes[0]) {
var i = this._boxes[0][r];
for (var s in t) t[parseInt(s)].id == i.info.id && (n = parseInt(s));
t[n].id == i.info.id && (i.cache && i.cache[0] && i.cache[0].length > 0 ? t[n].cache = enyo.clone(i.cache) : t[n].tweets = enyo.clone(i.tweets));
}
},
scrollBehavior: function(e, t) {
var n = this.$.timeline.children[0].rotateScroll();
},
holdBehavior: function(e, t) {
var n = App.Prefs.get("toolbar-hold");
switch (n) {
case "mark-read":
this.$.timeline.children[0].markAllAsRead();
break;
case "do-nothing":
}
},
showTweetView: function(e) {
this.$.detailContent || this.boxes.swap("detailContent"), (!this.actions.length || this.actions[this.actions.length - 1] != "detailContent") && this.actions.push("detailContent");
var t = this.$.detailContent.getActive(), n = "tweet-" + e.spaz_id, r = function(e, t) {
for (var n in e) if (e[n].name === t) return parseInt(n);
return !1;
}, i = r(this.$.detailContent.getPanels(), n);
t && t.setScrollPosition && t.setScrollPosition();
if (typeof i == "number") {
var s = this.viewEvents.splice(i, 1);
this.viewEvents.push(s), this.$.detailContent.getPanels()[i].destroy();
} else this.viewEvents.push({
type: e.is_private_message === !0 ? "message" : "tweet",
tweet: e
});
this.$.detailContent.createComponent({
name: n,
kind: "Neo.TweetView",
onDestroy: "hideDetailPane",
onGoPreviousViewEvent: "goPreviousViewEvent",
onGetViewEvents: "getViewEvents",
onShowImageView: "showImageView"
}, {
owner: this
}), this.$.detailContent.render(), this.$[n].render(), this.$[n].setTweet(e), this.$.detailContent.setIndex(this.$.detailContent.getPanels().length - 1);
},
showUserView: function(e, t, n, r) {
this.$.detailContent || this.boxes.swap("detailContent"), (!this.actions.length || this.actions[this.actions.length - 1] != "detailContent") && this.actions.push("detailContent");
var i = this.$.detailContent.getActive(), s = "user-" + e + "-" + t + "-" + n, o = function(e, t) {
for (var n in e) if (e[n].name === t) return parseInt(n);
return !1;
}, u = o(this.$.detailContent.getPanels(), s);
i && i.setScrollPosition && i.setScrollPosition();
if (typeof u == "number") {
var a = this.viewEvents.splice(u, 1);
this.viewEvents.push(a), this.$.detailContent.getPanels()[u].destroy();
} else this.viewEvents.push({
type: "user",
user: {
username: e,
type: t,
account_id: n
}
});
this.$.detailContent.createComponent({
name: s,
kind: "Neo.UserView",
onDestroy: "hideDetailPane",
onGoPreviousViewEvent: "goPreviousViewEvent",
onGetViewEvents: "getViewEvents"
}, {
owner: this
}), this.$.detailContent.render(), this.$[s].render(), this.$[s].showUser(e, t, n), this.$.detailContent.setIndex(this.viewEvents.length - 1);
},
goPreviousViewEvent: function(e) {
this.$.detailContent.getPanels().pop(), this.viewEvents.pop(), this.$.detailContent.render();
if (this.viewEvents.length == 0 || this.$.detailContent.getPanels().length == 0) return this.hideDetailPane();
this.$.detailContent.setIndex(this.$.detailContent.getPanels().length - 1), this.$.detailContent.getActive().render();
},
getViewEvents: function(e, t) {
t(this.viewEvents);
},
hideDetailPane: function() {
var e = this.$.detailContent.getPanels();
enyo.forEach(e, function(t) {
e.pop(), this.viewEvents.pop(), this.$.detailContent.render();
}, this), this.$.detailContent.destroyClientControls(), this.viewEvents = [], this.actionBack();
}
});

// BackgroundColumn.js

enyo.kind({
name: "Neo.BackgroundColumn",
published: {
tweets: [],
cachedData: [],
info: {},
tweets: []
},
create: function() {
this.inherited(arguments), !this.pullComplete || this.tweets.length === 0 || this.fresh === !0 ? enyo.call(this.loadNewer({
forceCountUnread: !0
})) : this.tweets.length != 1 && enyo.call(this.buildList());
},
loadNewer: function(e) {
this.loadData(enyo.mixin(e, {
mode: "newer"
})), sch.debug("Loading newer tweets...");
},
loadOlder: function() {
this.loadData({
mode: "older"
}), sch.debug("Loading older tweets...");
},
loadData: function(e) {
if (this.info == null || this.info.accounts == null || this.info.accounts[0] == null) return;
var t = this;
e = sch.defaults({
mode: "newer",
since_id: null,
max_id: null
}, e);
try {
var n;
this.tweets.length > 0 ? e.mode === "newer" ? (n = _.first(this.tweets).service_id, this.markAllAsRead()) : e.mode === "older" && (n = "-" + _.last(t.tweets).service_id) : n = 1, this.accountsLoaded = 0, this.totalData = [], enyo.forEach(t.info.accounts, function(e) {
r(e);
});
function r(r) {
var i = App.Users.get(r), s = new SpazAuth(i.type), o = null;
s.load(i.auth), t.twit = new SpazTwit, t.twit.setBaseURLByService(i.type), t.twit.setSource(App.Prefs.get("twitter-source")), t.twit.setCredentials(s);
switch (t.info.type) {
case SPAZ_COLUMN_HOME:
t.loadStarted(), t.twit.getHomeTimeline(n, 50, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_MENTIONS:
t.loadStarted(), t.twit.getReplies(n, 50, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_MESSAGES:
t.loadStarted(), t.twit[t.states[t.cacheIndex] || "getDirectMessages"](n, 50, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_SEARCH:
t.loadStarted(), t.twit.search(t.info.query, n, 50, o, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_FAVORITES:
t.loadStarted(), t.twit.getFavorites(n, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_SENT:
t.loadStarted(), window.AppCache.getUser(i.username, i.type, i.id, function(n) {
t.twit.getUserTimeline(n.service_id, 50, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
}, t.loadFailed);
break;
case SPAZ_COLUMN_RETWEETS:
t.loadStarted();
var u = "retweet" + t.states[t.cacheIndex] + "Me";
t.twit[u](o, o, o, o, function(n) {
t.loadFinished(n, e, r);
}, t.loadFailed);
break;
case SPAZ_COLUMN_TRENDS:
t.loadStarted(), t.twit.getTrends(function(e) {
t.loadTrendsFinished(e), t.loadOtherFinished();
}, t.loadFailed);
break;
case SPAZ_COLUMN_LIST:
t.loadStarted(), window.AppCache.getUser(i.username, i.type, i.id, function(n) {
switch (t.states[t.cacheIndex]) {
case "all":
t.twit.getLists(i.username, function(n) {
t.loadOtherFinished(), t.loadListsFinished(n, e, r);
}, t.loadFailed);
break;
default:
var s = "getList" + t.states[t.cacheIndex];
t.twit[s](t.info.list, n.service_id, function(n) {
t.loadOtherFinished(), t.loadListsFinished(n, e, r);
}, t.loadFailed);
}
}, t.loadFailed);
break;
case SPAZ_COLUMN_FILTERS:
t.loadStarted();
var a = window._filter_chain.getFilterList();
a ? (t.loadOtherFinished(), t.gotFilters(a)) : t.loadFailed;
break;
default:
}
}
} catch (i) {
console.error(i, i.message);
}
},
loadStarted: function() {
this.accountsLoaded++;
},
loadFinished: function(e, t, n) {
typeof e !== undefined && (enyo.forEach(e, function(e) {
e.account_id = n;
}), this.totalData.push(e)), --this.accountsLoaded === 0 && this.processData(this.totalData, t);
},
loadFailed: function() {
this.error("loadFailed:", this.info.type, this), --this.accountsLoaded === 0 && null;
},
loadOtherFinished: function() {
--this.accountsLoaded === 0 && null;
},
processData: function(e, t, n) {
var r = this;
t = sch.defaults({
mode: "newer",
since_id: null,
max_id: null
}, t);
if (e) switch (this.info.type) {
default:
var i = [], s = 0;
enyo.forEach(e, function(e) {
if (!e) return;
e = AppUtils.convertToTweets(e), _.first(e).publish_date > s && (s = _.first(e).publish_date), i = i.concat(e);
}), i = _.reject(i, function(e) {
for (var n = 0; n < r.tweets.length; n++) {
if (e.service_id === r.tweets[n].service_id) return !0;
t.mode === "older" ? e.read = !0 : e.read = !1;
}
}), i = this._filter(i);
if (i.length > 0) {
i = AppUtils.setAdditionalTweetProperties(i), enyo.forEach(i, function(e) {
e.read = t.mode === "older";
});
var o = _.reject(i, function(e) {
if (e.publish_date < s) return !0;
});
o.length < 10 && i.length > 5 ? i = _.sortBy(i, function(e) {
return s - e.publish_date;
}).slice(0, 10) : i = o, this.setTweets([].concat(i.reverse(), this.tweets)), this.sortTweets();
}
} else enyo.log("No new data");
this.markOlderAsRead(), t.forceCountUnread && this.countUnread(), this.setLastRead(), this.notifyOfNewTweets(), this.callback ? this.callback(this, this.index) : this.$.list && this.$.list.pullState ? this.$.list.completePull() : this.pullComplete && this.pullComplete();
},
addToAC: function(e) {
var t = enyo.indexOf(e, window.autocomplete);
t == -1 && window.autocomplete.push(e);
},
notifyOfNewTweets: function() {
var e = _.reject(this.tweets, function(e) {
return !!e.read;
});
enyo.forEach(e, function(e) {
AppUI.addTweetToNotifications(e);
});
},
markAllAsRead: function() {
var e = 0;
enyo.forEach(this.tweets, function(t) {
t.read || (t.read = !0, e++);
}), e > 0 && this.countUnread();
},
markOlderAsRead: function() {
var e = 0, t = this.getLastRead();
enyo.forEach(this.tweets, function(n) {
n.publish_date <= t && (n.read = !0, e++);
}), e > 0 && this.countUnread();
},
countUnread: function() {
var e = 0;
return enyo.forEach(this.tweets, function(t) {
t.read || e++;
}), enyo.Signals.send("updateUnread", {
title: this.info.type,
unread: e
}), e;
},
sortTweets: function() {
this.tweets.sort(function(e, t) {
return t.service_id - e.service_id;
});
},
getHash: function() {
return sch.MD5(this.info.type + "_" + this.info.id);
},
getLastRead: function() {
return LastRead.get(this.getHash());
},
setLastRead: function() {
var e = 1;
if (this.tweets.length > 0) {
var t = _.max(this.tweets, function(e) {
return e.publish_date;
}) || this.tweets[0]._orig.created_at;
e = t.publish_date;
}
LastRead.set(this.getHash(), e);
},
removeTweetById: function(e) {
enyo.forEach(this.tweets, function(t) {
t.service_id === e && this.tweets.splice(enyo.indexOf(t, this.tweets));
}, this), this.buildList();
},
tweetsChanged: function(e) {
var t = [];
enyo.forEach(this.tweets, function(e) {
e.publish_date || (e.publish_date = (new Date(e.created_at || (e._orig ? e._orig.created_at : null))).toUTCString()), t.push(e);
}, this), this.tweets = enyo.clone(t), this.cache && this.cache[this.cacheIndex] && (this.cache[this.cacheIndex] = t.splice(0, t.length));
},
_filter: function(e) {
var t, n = e.length, r, i;
try {
t = window._filter_chain.processArray(e);
} catch (s) {
t = e;
}
return r = t.length, i = n - r, i != 0 && AppUtils.showBanner(i + " filters applied..."), t;
}
}), window._filter_chain = new SpazFilterChain, window._filter_chain._neo_filter = function(e) {
var t = this.label, n = e;
if (typeof e == "string") return e.toLowerCase().search(t.toLowerCase()) != -1 ? null : e;
for (var r in e) {
var i = e[r];
typeof e[r] == "string" && r.search("text") != -1 && (i = this.func(e[r])), e[r] != null && i === null && (n = null);
}
return n;
};

// Column.js

enyo.kind({
name: "Neo.Column",
kind: "Neo.BackgroundColumn",
layoutKind: "FittableRowsLayout",
fit: !0,
classes: "neo-column",
events: {
onDeleteClicked: "",
onLoadStarted: "",
onLoadFinished: ""
},
published: {
info: {},
tweets: [],
cache: [],
cacheIndex: 0,
scrollBehavior: 0,
manualAnchor: 0,
autoAnchor: 0
},
_list_guts: [ {
name: "item",
kind: "Neo.Tweet.small",
onTweetTap: "tweetTap",
onTweetHold: "tweetHold"
}, {
name: "more",
kind: "Neo.Tweet.other",
tweet: {
text: "Load More"
},
ontap: "loadOlder"
} ],
components: [ {
name: "list",
kind: "Neo.PulldownList",
onSetupItem: "setupRow",
onPullRelease: "pullRelease",
onPullComplete: "pullComplete",
fit: !0,
horizontal: "hidden",
touch: !0,
thumb: !1,
pullState: !1,
rowsPerPage: 15
}, {
name: "tweetTapPopup",
kind: "Neo.TweetTapPopup"
} ],
create: function() {
this.inherited(arguments), this.$.list.createComponents(this._list_guts, {
owner: this
}), this.radios && this.radios.length != 0 && this._radio_gen(this.cacheIndex), setTimeout(this.scrollToAutoAnchor.bind(this), 0);
},
loadStarted: function() {
this.log(), this.accountsLoaded === 0 && this.bubble("onLoadStarted"), this.accountsLoaded++;
},
loadFinished: function(e, t, n) {
this.log(), typeof e !== undefined && (enyo.forEach(e, function(e) {
e.account_id = n;
}), this.totalData.push(e)), --this.accountsLoaded === 0 && (this.processData(this.totalData, t), this.bubble("onLoadFinished"));
},
loadFailed: function() {
this.error("loadFailed:", this.info.type, this), --this.accountsLoaded === 0 && this.bubble("onLoadFinished");
},
loadOtherFinished: function() {
this.log(), --this.accountsLoaded === 0 && this.bubble("onLoadFinished");
},
tweetTap: function(e, t) {
var n = t.index, r = this.tweets[n], i = t.target.className;
this.anchor();
if (i.search("username") != -1) {
var s = t.target.getAttribute("data-user-screen_name") || t.target.innerText.replace("@", "");
return AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
if (i.search("neo-avatar") != -1) {
var s = r.author_username;
return i.search("retweet") != -1 && (s = r.reposter_username), AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
return i.search("hashtag") != -1 ? (AppUI.search(t.target.innerText, r.account_id), !0) : t.target.getAttribute("href") ? !0 : (App.Prefs.get("tweet-tap").toLowerCase().search("panel") != -1 ? AppUI.viewTweet(r) : this.$.tweetTapPopup.showAtEvent(r, t), !0);
},
tweetHold: function(e, t) {
var n = App.Prefs.get("tweet-hold").toLowerCase();
return this.anchor(), n.search("popup") != -1 ? this.$.tweetTapPopup.showAtEvent(e.tweet, t) : n.search("panel") != -1 && AppUI.viewTweet(e.tweet), !0;
},
scrollToUnread: function() {
var e = this.countUnread();
this.$.list.scrollToRow(e);
},
scrollToTop: function(e, t) {
this.$.list.scrollToStart();
},
scrollToBottom: function() {
this.$.list.scrollToEnd();
},
scrollToAutoAnchor: function() {
this.$.list.setScrollPosition(this.autoAnchor);
},
anchor: function() {
this.autoAnchor = this.$.list.getScrollPosition();
},
rotateScroll: function() {
var e = this, t = e.scrollBehavior, n = App.Prefs.get("scroll-behavior");
switch (n) {
case 4:
e.scrollToTop();
break;
case 5:
e.scrollToUnread();
break;
case 6:
e.scrollToBottom();
break;
case 1:
e.scrollBehavior++, e.scrollBehavior > 1 && (e.scrollBehavior = 0);
switch (t) {
case 0:
e.scrollToTop();
break;
case 1:
e.scrollToUnread();
}
break;
case 2:
e.scrollBehavior++, e.scrollBehavior > 1 && (e.scrollBehavior = 0);
switch (t) {
case 0:
e.scrollToTop();
break;
case 1:
e.scrollToBottom();
}
break;
case 3:
e.scrollBehavior++, e.scrollBehavior > 1 && (e.scrollBehavior = 0);
switch (t) {
case 0:
e.scrollToUnread();
break;
case 1:
e.scrollToBottom();
}
break;
case 0:
e.scrollBehavior++, e.scrollBehavior > 2 && (e.scrollBehavior = 0);
switch (t) {
case 0:
e.scrollToTop();
break;
case 1:
e.scrollToUnread();
break;
case 2:
e.scrollToBottom();
}
break;
default:
}
},
pullRelease: function(e, t) {
this.$.list.pullState = !0, this.manualAnchor = this.$.list.getScrollPosition(), this.loadNewer();
},
pullComplete: function(e, t) {
this.log();
var n = App.Prefs.get("timeline-scrollonupdate");
n === !0 ? this.scrollToUnread() : this.scrollManual(), this.buildList(), this.$.list.pullState = !1;
},
buildList: function() {
this.log(this.tweets.length), this.$.list.setCount(this.tweets.length), this.$.list.refresh();
},
clearList: function() {
this.$.list.setCount(0), this.$.list.refresh();
},
setupRow: function(e, t) {
var n = t.index, r = this.tweets[n];
r.index = n, this.$.item.setTweet(r), this.$.more.setShowing(this.tweets.length == n + 1), this.addToAC(r.author_username);
},
_radio_toolbar: [ {
kind: "Neo.Toolbar",
middle: [ {
name: "radio",
kind: "onyx.RadioGroup",
layoutKind: "FittableColumnsLayout",
fit: !0,
style: "text-align: center;",
onchange: "_radio",
components: []
} ]
} ],
_radio_gen: function(e) {
var t = enyo.clone(this._radio_toolbar), n = enyo.clone(this.radios);
this.cache = [], this.createComponents(t, {
owner: this
});
if (!this.$.radio) return;
enyo.forEach(n, function(e) {
this.$.radio.createComponent(enyo.mixin(enyo.clone(e), {
kind: "Neo.RadioButton",
index: this.cache.length
}), {
owner: this
}), this.cache.push([]);
}, this), this._radio_select(e);
},
_radio: function(e, t) {
var n = t.originator, r = t.index;
return r == this.cacheIndex ? !0 : (this.clearList(), this.cacheIndex = r, this.setTweets(this.cache[r] || []), this.tweets.length != 0 ? this.buildList() : this.loadNewer(), !0);
},
_radio_select: function(e) {
this.$.radio.children[e].$.button.tap();
}
});

// TrendsColumn.js

enyo.kind({
name: "Neo.TrendsColumn",
kind: "Neo.Column",
_list_guts: [ {
name: "item",
kind: "Neo.Tweet.other",
ontap: "searchTrend"
} ],
loadTrendsFinished: function(e) {
this.tweets = e, this.buildList();
},
setupRow: function(e, t) {
var n = this.tweets[t.index];
this.$.item.setTweet({
text: n.name
});
},
searchTrend: function(e, t) {
console.log("attempting search for", e.content), AppUI.search(this.tweets[t.index].name, App.Prefs.get("currentUser"));
}
});

// ListColumn.js

enyo.kind({
name: "Neo.ListColumn",
kind: "Neo.Column",
_list_guts: [ {
name: "basicItem",
kind: "Neo.Tweet.other",
ontap: "getList"
}, {
name: "userItem",
kind: "Neo.Tweet.other",
ontap: "userItemClick",
show: [ "avatar", "header" ]
}, {
name: "tweetItem",
kind: "Neo.Tweet.small",
ignoreUnread: !0,
onTweetTap: "tweetTap",
onTweetHold: "tweetHold"
} ],
getList: function(e, t) {
this.info.list = e.$.body.content, this._radio_select(1);
},
userItemClick: function(e, t) {
var n = AppUtils.convertToUser(this.tweets[t.index]);
AppUI.viewUser(n.username, n.service, n.account_id);
},
loadListsFinished: function(e, t, n) {
this.log(this.states[this.cacheIndex], e);
if (!e.lists && !e.statuses && !e.users) return;
var r = [];
switch (this.getCacheIndex()) {
case 2:
for (var i in e.statuses) r.push(AppUtils.convertToTweet(e.statuses[i]));
break;
case 0:
r = e.lists;
break;
case 1:
case 3:
r = e.users;
break;
default:
this.error();
}
this.setTweets(r), this.tweets = r, this.buildList();
},
setupRow: function(e, t) {
var n = t.index, r = this.getTweets()[n], i = this.getCacheIndex(), s = this.$.userItem;
r.index = n, this.$.basicItem.setShowing(i == 0), this.$.userItem.setShowing(i == 1 || i == 3), this.$.tweetItem.setShowing(i == 2);
switch (i) {
case 0:
this.$.basicItem.$.body.setContent(r.name);
break;
case 1:
case 3:
s.$.avatar.$.author.setSrc(r.profile_image_url), s.$.header.setAuthor_full(r.name), s.$.header.setAuthor_short(r.screen_name);
break;
case 2:
this.$.tweetItem.setTweet(r);
}
return;
}
});

// FiltersColumn.js

enyo.kind({
name: "Neo.FiltersColumn",
kind: "Neo.Column",
published: {
filters: [],
tweets: [ 1 ]
},
_list_guts: [ {
name: "item",
kind: "FittableColumns",
fit: !0,
components: [ {
kind: "Neo.Button",
ontap: "deleteFilter",
icon: "delete"
}, {
name: "persist",
kind: "onyx.ToggleButton",
onChange: "persist",
onContent: "keep",
offContent: "once"
}, {
kind: "FittableColumns",
fit: !0,
components: [ {
name: "filter",
kind: "Neo.Tweet.other"
} ]
} ]
} ],
_radio_toolbar: [ {
kind: "Neo.Toolbar",
middle: [ {
kind: "Neo.Button",
text: "Delete All",
icon: "list",
ontap: "nukeFilters"
}, {
kind: "Neo.Button",
text: "Add Filter",
icon: "new",
ontap: "newFilter"
} ]
} ],
create: function() {
AppUI.addFunction("addFilter", this.addFilter, this), this.inherited(arguments), this._radio_gen();
var e = App.Prefs.get("filters");
enyo.forEach(e, function(e) {
e.persist == 1 && this.filters.push(e);
}, this), this.filters.length > 0 && this.filtersRefresh();
},
loadData: function(e) {
var t = this.inherited(arguments);
if (this.isLoading) return t;
},
setupRow: function(e, t) {
var n = t.index, r = this.filters[n];
this.log(r, n, this);
if (typeof r == "undefined") return;
this.$.filter.setTweet({
text: r.text
}), this.$.persist.setValue(r.persist);
},
persist: function(e, t) {
var n = t.index, r = t.value;
if (typeof n != "number" || !this.filters[n]) return;
this.filters[n].persist = r, App.Prefs.set("filters", this.filters);
},
gotFilters: function(e) {
var t = [], n = this.filters[r];
for (var r in e) t.push({
text: e[r],
persist: !1
});
enyo.mixin(t, this.filters), this.log("got", t), App.Prefs.set("filters", t), this.setFilters(t), this.setTweets(t), this.$.list && this.$.list.completePull ? this.$.list.completePull() : this.pullComplete(), this.isLoading = !1;
},
deleteFilter: function(e, t) {
var n = t.index, r = this.filters[n].text;
window._filter_chain.removeFilter(r), this.filtersRefresh();
},
nukeFilters: function(e, t) {
window._filter_chain.nukeFilters(), this.filtersRefresh();
},
newFilter: function(e, t) {
AppUI.showMore("filterPopup");
},
addFilter: function(e) {
this.log(e), window._filter_chain.addFilter(e, window._filter_chain._neo_filter), this.filtersRefresh();
},
filtersRefresh: function() {
this.log(), this.tweets = [ 1 ], this.isLoading = !0, this.loadNewer();
}
});

// TweetView.js

enyo.kind({
name: "Neo.TweetView",
kind: "FittableRows",
classes: "neo-tweet-view",
published: {
tweet: {}
},
events: {
onGoPreviousViewEvent: "",
onGetViewEvents: "",
onDestroy: "",
onShowImageView: ""
},
components: [ {
name: "toolbar",
kind: "Neo.Toolbar",
onClose: "deleteColumn",
closeable: !1,
align: "left",
left: [ {
name: "back",
kind: "Neo.Button",
icon: "back",
text: "Back",
ontap: "back"
} ],
middle: [ {
ontap: "loadProfile",
kind: "FittableColumns",
components: [ {
name: "avatar",
kind: "Image",
classes: "neo-avatar neo-avatar-large"
}, {
components: [ {
name: "username",
classes: "neo-tweet-big"
}, {
name: "realname",
classes: "neo-tweet-bigger"
} ]
}, {
name: "private",
kind: "Image",
style: "width: 13px; height: 13px;",
src: "assets/images/tiny-lock-icon.png",
showing: !1
} ]
} ],
right: [ {
kind: "Neo.Button",
icon: "close",
text: "Close",
ontap: "doDestroy"
} ]
}, {
name: "tweetView",
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
horizontal: "hidden",
classes: "neo-tweet-view",
components: [ {
name: "tweet",
kind: "Neo.Tweet.large",
ontap: "tweetTap"
}, {
name: "images"
}, {
name: "conversation_button",
kind: "Neo.Tweet.other",
ontap: "toggleDrawer",
tweet: {
text: "More"
}
}, {
name: "conversation_drawer",
kind: "onyx.Drawer",
open: !1,
fit: !0,
onOpenChanged: "onConversationOpenChanged",
components: [ {
name: "conversation",
kind: "Neo.Conversation",
onStart: "onConversationLoadStart",
onDone: "onConversationLoadDone",
onTweetTap: "tweetTap"
} ]
} ]
}, {
kind: "Neo.Toolbar",
middle: [ {
kind: "Neo.Button",
ontap: "reply",
icon: "reply",
text: "Reply"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "Neo.Button",
icon: "share",
text: "Share"
}, {
name: "sharePopup",
kind: "Neo.PopupList",
onChange: "sharePopupSelected",
components: [ {
content: "Retweet"
}, {
content: "RT"
}, {
content: "Email"
}, {
content: "SMS/IM"
}, {
content: "Copy"
} ]
} ]
}, {
name: "favorite",
kind: "Neo.Button",
ontap: "toggleFavorite",
icon: "favorite",
text: "Favorite"
}, {
name: "deleteButton",
kind: "Neo.Button",
ontap: "deleteTweet",
icon: "delete",
text: "Delete"
} ]
} ],
browser: new enyo.webOS.ServiceRequest({
service: "palm://com.palm.applicationManager/",
method: "open",
subscribe: !0,
fail: this.serviceFail
}),
tweetChanged: function(e) {
if (this.tweet.service_id !== e.service_id) {
var t, n = this.tweet;
storeEvents = function(e) {
t = e;
}, this.bubble("onGetViewEvents", storeEvents), this.$.back.setShowing(t.length > 1), this.$.avatar.setSrc(n.author_avatar_bigger), this.$.realname.setContent(n.author_fullname || n.author_username), this.$.username.setContent("@" + n.author_username), this.$["private"].setShowing(n.author_is_private), this.$.deleteButton.setShowing(n.is_author || n.is_private_message), this.$.images.destroyClientControls(), this.$.tweet.setTweet(n);
var r = new SpazShortURL, i = this.$.tweet.$.body.getContent(), s = r.findExpandableURLs(i), o = this;
if (s) for (var u = 0; u < s.length; u++) r.expand(s[u], {
onSuccess: enyo.bind(this, function(e) {
i = r.replaceExpandableURL(i, e.shorturl, e.longurl);
})
});
n.is_search_result && n.service === SPAZCORE_SERVICE_TWITTER ? AppUtils.makeTwitObj(n.account_id).getOne(n.service_id, enyo.bind(this, function(e) {
n.in_reply_to_id = e.in_reply_to_status_id, this.showOrHideConversation();
}), enyo.bind(this, function() {
n.in_reply_to_id = null, this.showOrHideConversation();
})) : this.showOrHideConversation(), this.setFavButtonState();
}
},
showOrHideConversation: function() {
console.log("showingConvo", this.tweet);
var e = this.tweet.in_reply_to_id;
this.$.conversation_button.setShowing(e), this.$.conversation_drawer.setOpen(!1), e ? (this.$.conversation_button.setTweet({
text: "More"
}), this.$.conversation.setTweet(this.tweet)) : (this.$.conversation_button.hide(), this.$.conversation.clearConversationMessages());
},
buildMediaPreviews: function() {
var e = this, t = new SpazImageURL, n = t.getThumbsForUrls(this.$.tweet.getContent()), r = t.getImagesForUrls(this.$.tweet.getContent()), i = 0;
this.imageFullUrls = [];
if (n) for (var s in n) {
var o = this.$.images.createComponent({
kind: "Image",
name: "imagePreview" + i,
style: "height: 10px;",
ontap: "imageClick",
src: n[s]
});
o.render(), this.imageFullUrls.push(r[s]), i++;
} else jQuery("#" + this.$.tweet.id).embedly({
maxWidth: 300,
maxHeight: 300,
method: "afterParent",
wrapElement: "div",
classes: "thumbnails",
success: function(t, n) {
t.code.indexOf("<embed") === -1 ? e.$.images.createComponent({
kind: "enyo.Control",
owner: e,
components: [ {
style: "height: 10px;"
}, {
kind: "FittableColumns",
pack: "center",
components: [ {
name: "oembed_code",
allowHtml: !0,
content: t.code
} ]
} ]
}).render() : enyo.log("skipping oembed with <embed> tag in it", t.code);
}
});
},
tweetTap: function(e, t) {
var n = t.index, r = this.items[n], i = t.target.className;
this.lock = this.$.list.getScrollPosition();
if (i.search("username") != -1) {
var s = t.target.getAttribute("data-user-screen_name") || t.target.innerText.replace("@", "");
return AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
if (i.search("neo-avatar") != -1) {
var s = r.author_username;
return i.search("retweet") != -1 && (s = r.reposter_username), AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
return i.search("hashtag") != -1 ? (AppUI.search(t.target.innerText, r.account_id), !0) : t.target.getAttribute("href") ? !0 : (App.Prefs.get("tweet-tap").toLowerCase().search("panel") != -1 ? AppUI.viewTweet(r) : this.$.tweetTapPopup.showAtEvent(r, t), !0);
},
tweetHold: function(e, t) {
var n = App.Prefs.get("tweet-hold").toLowerCase();
return n.search("popup") != -1 ? this.$.tweetTapPopup.showAtEvent(e.tweet, t) : n.search("panel") != -1 && AppUI.viewTweet(e.tweet), !0;
},
toggleDrawer: function(e, t) {
this.$.conversation_drawer.setOpen(!this.$.conversation_drawer.open);
var n = this.$.conversation_button;
n.setTweet({
text: this.$.conversation_drawer.open ? "Less" : "More"
});
},
onConversationOpenChanged: function(e, t) {
this.$.conversation_drawer.open ? this.$.conversation.refresh() : setTimeout(enyo.bind(this, function() {
this.$.tweetView.scrollTo(0, 0);
}), 100);
},
onConversationLoadStart: function() {
enyo.log("Load Conversation Start");
},
onConversationLoadDone: function(e, t) {
enyo.log("Load Conversation Done"), e.done(), this.reflow();
},
reply: function() {
AppUI.reply(this.tweet);
},
imageClick: function(e) {
var t = parseInt(e.getName().replace("imagePreview", ""), 10);
this.doShowImageView(this.imageFullUrls, t);
},
embedlyClick: function(e) {
e.url && (this.browser.go({
id: "com.palm.app.browser",
params: {
target: e.url
}
}), this.browser.response(this, this.onUploadSuccess));
},
toggleFavorite: function(e) {
var t = this, n = App.Users.get(this.tweet.account_id), r = new SpazAuth(n.type);
r.load(n.auth), t.twit = t.twit || new SpazTwit, t.twit.setBaseURLByService(n.type), t.twit.setSource(App.Prefs.get("twitter-source")), t.twit.setCredentials(r), t.tweet.is_favorite ? (enyo.log("UNFAVORITING %j", t.tweet), t.twit.unfavorite(t.tweet.service_id, function(e) {
t.tweet.is_favorite = !1, t.setFavButtonState(), AppUI.rerenderTimelines(), AppUtils.showBanner($L("Removed favorite"));
}, function(e, t, n) {
AppUtils.showBanner($L("Error removing favorite"));
})) : (enyo.log("FAVORITING %j", t.tweet), t.twit.favorite(t.tweet.service_id, function(e) {
t.tweet.is_favorite = !0, t.setFavButtonState(), AppUI.rerenderTimelines(), AppUtils.showBanner($L("Added favorite"));
}, function(e, t, n) {
AppUtils.showBanner($L("Error adding favorite"));
}));
},
setFavButtonState: function() {
this.tweet.is_favorite === !0 ? (this.$.favorite.setShowing(!0), this.$.favorite.setIcon("favorited"), this.$.favorite.setText("Unfavorite")) : this.tweet.is_private_message === !0 ? this.$.favorite.setShowing(!1) : (this.$.favorite.setIcon("unfavorited"), this.$.favorite.setText("Favorite"), this.$.favorite.setShowing(!0)), this.$.favorite.render();
},
sharePopupSelected: function(e, t) {
var n = this.tweet;
switch (t.content) {
case "Retweet":
AppUI.repost(n);
break;
case "RT":
AppUI.repostManual(n);
break;
case "Email":
AppUtils.emailTweet(n);
break;
case "SMS/IM":
AppUtils.SMSTweet(n);
break;
case "Copy":
AppUtils.copyTweet(n);
break;
default:
console.error(t.getValue() + " has no handler");
}
},
deleteTweet: function(e, t) {
AppUI.confirmDeleteTweet(this.tweet);
},
loadProfile: function(e, t) {
var n = this.tweet;
AppUI.viewUser(n.author_username, n.service, n.account_id);
},
back: function() {
this.doGoPreviousViewEvent();
},
serviceComplete: function(e) {},
serviceFail: function(e) {
AppUtils.showBanner("PalmService Error!"), enyo.log("PalmService Error:", e);
}
});

// UserView.js

enyo.kind({
name: "Neo.UserView",
kind: "FittableRows",
classes: "neo-tweet-view",
published: {
user: "",
items: [],
states: [ "tweets", "followers", "friends" ],
cacheIndex: 0,
cache: [ [], [], [] ],
scrollPositions: {}
},
events: {
onGoPreviousViewEvent: "",
onGetViewEvents: "",
onDestroy: ""
},
components: [ {
name: "toolbar",
kind: "Neo.Toolbar",
onClose: "deleteColumn",
closeable: !1,
align: "left",
left: [ {
name: "back",
kind: "Neo.Button",
icon: "back",
text: "Back",
ontap: "back"
} ],
middle: [ {
name: "avatar",
kind: "Image",
classes: "neo-avatar neo-avatar-large"
}, {
components: [ {
name: "username",
classes: "neo-tweet-big"
}, {
name: "realname",
classes: "neo-tweet-bigger"
} ]
}, {
name: "private",
kind: "Image",
style: "width: 13px; height: 13px;",
src: "assets/images/tiny-lock-icon.png",
showing: !1
} ],
right: [ {
kind: "Neo.Button",
icon: "close",
text: "Close",
ontap: "doDestroy"
} ]
}, {
name: "bio",
kind: "Neo.Subtext",
ontap: "bioClick"
}, {
name: "subtoolbar",
kind: "Neo.Toolbar",
left: [ {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton",
classes: "neo-button",
content: "Account"
}, {
name: "accounts",
kind: "Neo.PopupList",
onChange: "pickerTap"
} ]
}, {
name: "following",
kind: "Neo.Button",
ontap: "toggleFollow",
text: "Loading...",
disabled: !0,
blue: !1
} ],
right: [ {
name: "radio",
kind: "onyx.RadioGroup",
layoutKind: "FittableColumnsLayout",
onchange: "radio",
components: [ {
name: "tweets",
kind: "Neo.RadioButton",
index: 0,
active: !0,
icon: "mention"
}, {
name: "followers",
kind: "Neo.RadioButton",
index: 1,
icon: "accounts"
}, {
name: "friends",
kind: "Neo.RadioButton",
index: 2,
icon: "accounts",
blue: !1
} ]
} ]
}, {
name: "list",
kind: "List",
onSetupItem: "setupItem",
fit: !0,
touch: !0,
thumb: !1,
horizontal: "hidden",
components: [ {
name: "tweetItem",
kind: "Neo.Tweet.small",
ignoreUnread: !0,
onTweetTap: "tweetTap",
ontweetHold: "tweetHold"
}, {
name: "userItem",
kind: "Neo.Tweet.other",
ontap: "userItemClick",
show: [ "avatar", "header" ]
} ]
}, {
name: "bottomToolbar",
kind: "Neo.Toolbar",
middle: [ {
kind: "Neo.Button",
icon: "mention",
text: "Mention",
ontap: "mention"
}, {
name: "message",
kind: "Neo.Button",
icon: "messages",
text: "Message",
ontap: "message"
}, {
kind: "Neo.Button",
icon: "block",
text: "Block",
ontap: "block"
}, {
kind: "Neo.Button",
icon: "search",
text: "Search",
ontap: "userSearch"
} ]
}, {
name: "tweetTapPopup",
kind: "Neo.TweetTapPopup"
}, {
name: "confirmPopup",
kind: "onyx.Popup",
scrim: !0,
components: [ {
content: "Block user?"
}, {
style: "height: 10px;"
}, {
layoutKind: "FittableColumnsLayout",
components: [ {
kind: "Neo.Button",
text: "No",
ontap: "hideBlockPopup",
icon: "cancel"
}, {
kind: "Neo.Button",
blue: !1,
classes: "onyx-negative",
text: "Yes",
ontap: "confirmBlock",
icon: "halt"
} ]
} ]
} ],
userChanged: function(e) {
var t = this.user, n = t.url || "";
if (this.$.username.getContent() === "@" + t.username) return;
this.bubble("onGetViewEvents", enyo.bind(this, function(e) {
this.$.back.setShowing(e.length > 1);
})), this.cache = [ [], [], [] ], this.$.avatar.setSrc(t.avatar_bigger), this.$.avatar.applyStyle("display", null), this.$.realname.setContent(t.fullname || t.username), this.$.username.setContent("@" + t.username), this.$.private.setShowing(t.is_private), this.$.bio.setContent(AppUtils.makeItemsClickable(t.description) || ""), this.$.followers.setText(t._orig.followers_count + " folwz"), this.$.friends.setText(t._orig.friends_count + " frndz"), this.$.tweets.setText(t._orig.statuses_count + " twtz"), this.$.radio.children[0].$.button.tap(), this.getItems(), this.buildAccountButton(), this.getTwitterRelationship(), this.render(), this.reflow();
},
tweetTap: function(e, t) {
var n = t.index, r = this.items[n], i = t.target.className;
this.lock = this.$.list.getScrollPosition();
if (i.search("username") != -1) {
var s = t.target.getAttribute("data-user-screen_name") || t.target.innerText.replace("@", "");
return AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
if (i.search("neo-avatar") != -1) {
var s = r.author_username;
return i.search("retweet") != -1 && (s = r.reposter_username), AppUI.viewUser(s, r.service, r.account_id, this.index), !0;
}
return i.search("hashtag") != -1 ? (AppUI.search(t.target.innerText, r.account_id), !0) : t.target.getAttribute("href") ? !0 : (App.Prefs.get("tweet-tap").toLowerCase().search("panel") != -1 ? AppUI.viewTweet(r) : this.$.tweetTapPopup.showAtEvent(r, t), !0);
},
tweetHold: function(e, t) {
var n = App.Prefs.get("tweet-hold").toLowerCase();
return n.search("popup") != -1 ? this.$.tweetTapPopup.showAtEvent(e.tweet, t) : n.search("panel") != -1 && AppUI.viewTweet(e.tweet), !0;
},
toggleFollow: function(e, t) {
var n = this, r = AppUtils.makeTwitObj(this.getAccounts().id), i = this.user.are_following;
this.$.following.setActive(!0), i && i === "yes" ? r.removeFriend(this.user.service_id, function(e) {
enyo.log("response from remove friend:", e), n.user.are_following = "no", n.setFollowButtonIcon(n.user.are_following), n.$.following.setActive(!1), AppUtils.showBanner(enyo.macroize($L("Stopped following {$screen_name}"), {
screen_name: n.user.username
}));
}, function(e, t, r) {
n.$.following.setActive(!1), AppUtils.showBanner(enyo.macroize($L("Failed to stop following {$screen_name}"), {
screen_name: n.user.username
}));
}) : i && r.addFriend(this.user.service_id, function(e) {
enyo.log("response from add friend:", e), n.user.are_following = "yes", n.setFollowButtonIcon(n.user.are_following), n.$.following.setActive(!1), AppUtils.showBanner(enyo.macroize($L("Started following {$screen_name}"), {
screen_name: n.user.username
}));
}, function(e, t, r) {
n.$.following.setActive(!1), AppUtils.showBanner(enyo.macroize($L("Failed to start following {$screen_name}"), {
screen_name: n.user.username
}));
});
},
radio: function(e, t) {
var n = t.originator, r = t.index;
this.log(n, r), this.setScrollPosition(), this.cacheIndex = r, this.items = [], this.refreshList(), this.cache[this.cacheIndex].length > 0 ? (this.items = this.cache[this.cacheIndex], this.refreshList()) : this.getItems();
},
pickerTap: function(e, t) {
this.setFollowButtonIcon();
},
userItemClick: function(e, t) {
AppUI.viewUser(this.items[t.rowIndex].screen_name, this.items[t.rowIndex].SC_service, this.account_id);
},
bioClick: function(e, t) {
var n = t.target.className;
if (_.includes(n, "username")) {
var r = t.target.getAttribute("data-user-screen_name") || t.target.innerText.replace("@", "");
AppUI.viewUser(r, this.user.service, this.user.account_id);
} else _.includes(n, "hashtag") && AppUI.search(t.target.innerText, this.user.account_id);
},
mention: function(e, t) {
AppUI.compose("@" + this.user.username + " ");
},
message: function(e, t) {
AppUI.directMessage(this.user.username, this.getAccounts().value);
},
userSearch: function(e, t) {
AppUI.search("@" + this.user.username + " OR from:" + this.user.username, this.getAccounts().value);
},
block: function(e, t) {
this.$.confirmPopup.open();
},
confirmBlock: function(e, t) {
this.hideBlockPopup(), AppUtils.makeTwitObj(this.account_id).block(this.user.service_id, function(e) {
AppUtils.showBanner("Blocked user");
}, function(e, t, n) {
AppUtils.showBanner("Failed to block user");
});
},
hideBlockPopup: function(e, t) {
this.$.confirmPopup.close();
},
back: function(e, t) {
this.doGoPreviousViewEvent();
},
showUser: function(e, t, n) {
this.account_id = n || App.Prefs.get("currentUser"), window.AppCache.getUser(e, t, n, enyo.bind(this, function(e) {
this.setUser(e);
}), enyo.bind(this, function(t) {
t.status === 404 ? AppUtils.showBanner(enyo.macroize("No user named {$username}", {
username: e
})) : AppUtils.showBanner(enyo.macroize("Error loading info for {$username}", {
username: e
})), this.doDestroy();
}));
},
buildAccountButton: function() {
this.accounts = [];
var e = App.Users.getAll();
enyo.forEach(e, function(e) {
e.type === this.user.service && this.accounts.push({
id: e.id,
value: e.id,
content: e.username,
type: e.type,
active: this.account_id && this.account_id == e.id || !this.account_id && App.Prefs.get("currentUser") == e.id
});
}, this), this.$.accounts.destroyClientControls(), this.$.accounts.createComponents(this.accounts, {
owner: this
}), this.$.accounts.render();
},
getTwitterRelationship: function() {
var e = this, t = AppUtils.makeTwitObj(this.getAccounts().value);
this.account_id = this.getAccounts().id, this.enableFollowButton(!1), t.showFriendship(this.user.service_id, null, function(t) {
enyo.log("show friendship result: %j", t), t.relationship.target.followed_by ? (enyo.log("You are following this user!"), e.user.are_following = "yes") : (enyo.log("You are NOT following this user!"), e.user.are_following = "no"), e.enableFollowButton(!0), e.setFollowButtonIcon(e.user.are_following), e.$.message.setShowing(t.relationship.source.can_dm), e.$.bottomToolbar.render(), e.reflow();
}, function(e, t, n) {
AppUtils.showBanner("Could not retrieve relationship info");
});
},
setFollowButtonIcon: function(e) {
this.$.following.setDisabled(!1), e === "yes" ? (this.$.following.setIcon("unfollow"), this.$.following.setText("Unfollow"), this.$.following.removeClass("onyx-affirmative"), this.$.following.addClass("onyx-negative")) : App.Users.get(this.getAccounts().id).username.toLowerCase() === this.user.username.toLowerCase() ? (this.$.following.setIcon("show"), this.$.following.setText("That's you!"), this.$.following.removeClass("onyx-affirmative"), this.$.following.removeClass("onyx-negative")) : (this.$.following.setIcon("follow"), this.$.following.setText("Follow"), this.$.following.removeClass("onyx-negative"), this.$.following.addClass("onyx-affirmative")), this.$.list.render(), this.$.subtoolbar.render();
},
getItems: function() {
this.cache[this.cacheIndex] = [];
switch (this.states[this.cacheIndex]) {
case "tweets":
AppUtils.makeTwitObj(this.account_id).getUserTimeline(this.user.service_id, 50, null, enyo.bind(this, function(e) {
this.items = AppUtils.convertToTweets(e.reverse()), this.items = AppUtils.setAdditionalTweetProperties(this.items, this.account_id), this.items.sort(function(e, t) {
return t.service_id - e.service_id;
}), this.cache[this.cacheIndex] = this.items, this.refreshList();
}), enyo.bind(this, function() {
AppUtils.showBanner("Error loading tweets for " + this.$.username.getContent());
}));
break;
case "followers":
AppUtils.makeTwitObj(this.account_id).getFollowersList(this.user.service_id, null, enyo.bind(this, function(e) {
this.items = e, this.cache[this.cacheIndex] = this.items, this.refreshList();
}), enyo.bind(this, function() {
AppUtils.showBanner("Error loading followers for " + this.$.username.getContent());
}));
break;
case "friends":
AppUtils.makeTwitObj(this.account_id).getFriendsList(this.user.service_id, null, enyo.bind(this, function(e) {
this.items = e, this.cache[this.cacheIndex] = this.items, this.refreshList();
}), enyo.bind(this, function() {
AppUtils.showBanner("Error loading friends for " + this.$.username.getContent());
}));
}
},
enableFollowButton: function(e) {
this.$.following.setDisabled(!e);
},
getAccounts: function() {
return this.$.accounts.render(), this.$.accounts.selected;
},
refreshList: function() {
this.$.list.setCount(this.items.length), this.$.list.refresh(), this.render(), this.scrollPositions[this.cacheIndex] && this.$.list.setScrollPosition(this.scrollPositions[this.cacheIndex]);
},
setScrollPosition: function() {
this.scrollPositions[this.cacheIndex] || (this.scrollPositions[this.cacheIndex] = 0), this.scrollPositions[this.cacheIndex] = this.$.list.getScrollPosition();
},
setupItem: function(e, t) {
var n = t.index, r = this.items[n], i = this.$.userItem, s = this.$.tweetItem, o = this.cacheIndex, u = o == 0;
if (!r) return;
i.setShowing(!u), s.setShowing(u), u ? s.setTweet(enyo.mixin(r, {
account_id: this.account_id
})) : (i.$.avatar.$.author.setSrc(r.profile_image_url), i.$.header.setAuthor_full(r.name), i.$.header.setAuthor_short(r.screen_name));
}
});

// Conversation.js

enyo.kind({
name: "Neo.Conversation",
events: {
onStart: "",
onTweetLoaded: "",
onSuccess: "",
onDone: "",
onError: ""
},
published: {
tweet: {}
},
components: [ {
name: "list",
kind: "List",
horizontal: "hidden",
layoutKind: "FittableRowsLayout",
onSetupItem: "setupItem",
onAnimateFinish: "animateFinish",
touch: !0,
classes: "list",
fit: !0,
thumb: !1,
components: [ {
name: "item",
kind: "Neo.Tweet.small",
ignoreUnread: !0,
onTweetHold: "tweetHold"
} ]
}, {
name: "tweetTapPopup",
kind: "Neo.TweetTapPopup"
} ],
tweets: [],
create: function() {
this.inherited(arguments);
},
tweetChanged: function() {
this.clearConversationMessages(), this.loadConversation();
},
loadConversation: function() {
function t(n) {
var r = AppUtils.convertToTweet(n);
r = AppUtils.setAdditionalTweetProperties([ r ], e.tweet.account_id)[0], e._addTweet(r), e.bubble("onTweetLoaded", r), r.in_reply_to_id ? e.twit.getOne(r.in_reply_to_id, t, function() {
e.bubble("onError"), e.bubble("onDone");
}) : (e.bubble("onSuccess"), e.bubble("onDone"));
}
var e = this;
if (this.tweets.length > 0) return !0;
this.bubble("onStart"), this.twit = AppUtils.makeTwitObj(this.tweet.account_id), this.twit.getOne(this.tweet.in_reply_to_id, t, function() {
e.bubble("onError"), e.bubble("onDone");
});
},
_addTweet: function(e) {
this.tweets.push(enyo.mixin(e, {
account_id: this.tweet.account_id
})), this.refreshList();
},
setupItem: function(e, t) {
var n = this.tweets[t.index];
n && this.$.item.setTweet(n);
},
tweetHold: function(e, t) {
var n = App.Prefs.get("tweet-hold");
_t = e.tweet;
switch (n) {
case "popup":
this.$.tweetTapPopup.showAtEvent(_t, t);
break;
case "panel":
AppUI.viewTweet(_t);
}
},
clearConversationMessages: function() {
this.tweets = [], this.refreshList();
},
done: function() {
this.refreshList();
var e = this.container.container.container;
setTimeout(function() {
e.render();
}, 1e3, e);
},
refreshList: function() {
this.$.list.setCount(this.tweets.length), this.$.list.refresh();
}
});

// ComposePopup.js

enyo.kind({
name: "Neo.ComposePopup",
kind: "FittableRows",
events: {
onClose: ""
},
published: {
dmUser: "",
inReplyTweetText: ""
},
isDM: !1,
inReplyToId: null,
showKeyboardWhenOpening: !1,
uploader: new enyo.webOS.ServiceRequest({
service: "palm://com.palm.downloadmanager",
method: "upload",
subscribe: !0,
fail: this.onUploadFailure
}),
components: [ {
name: "filePicker",
kind: "FilePicker",
fileType: [ "image" ],
allowMultiSelect: !1,
onPickFile: "fileChosen"
}, {
name: "toolbar",
kind: "Neo.Toolbar",
closeable: !0,
header: "Compose Tweet",
onClose: "close"
}, {
name: "inReplyTweetText",
kind: "Neo.Subtext"
}, {
classes: "compose",
components: [ {
tag: "hr"
}, {
name: "autocompleteBox",
showing: !1,
style: "color:black;max-height: 300px;width:200px;",
components: [ {
layoutKind: "FittableColumnsLayout",
name: "autocompleteResults"
} ]
}, {
name: "postTextBoxContainer",
kind: "onyx.InputDecorator",
components: [ {
name: "postTextBox",
kind: "Neo.RichText",
alwaysLooksFocused: !0,
placeholder: "Type message here...",
oninput: "postTextBoxInput",
onkeydown: "postTextBoxKeydown",
onfocus: "postTextBoxFocus"
} ]
}, {
tag: "hr"
} ]
}, {
kind: "Neo.Toolbar",
left: [ {
kind: "onyx.PickerDecorator",
style: "margin-top: 0px;",
components: [ {
kind: "onyx.PickerButton",
classes: "neo-button"
}, {
name: "accountSelection",
kind: "Neo.PopupList",
onChange: "accountChange"
} ]
} ],
middle: [ {
kind: "Neo.Button",
icon: "attach",
text: "Attach",
ontap: "showFilePicker"
}, {
kind: "onyx.PickerDecorator",
components: [ {
name: "shortenButton",
kind: "Neo.Button",
icon: "shorten",
text: "Shorten",
ontap: "onShortenClick"
}, {
name: "shortenPopup",
kind: "Neo.PopupList",
onChange: "itemSelect",
components: [ {
content: "Shorten URLs",
value: "shortenURLs"
}, {
content: "Shorten Text",
value: "shortenText"
} ]
} ]
} ],
right: [ {
name: "sendButton",
kind: "Neo.SendButton",
ontap: "onSendClick",
icon: "send",
text: "Send",
remaining: 140
}, {
name: "retweetButton",
kind: "Neo.Button",
ontap: "onSendClick",
blue: !1,
classes: "onyx-negative",
text: "Retweet",
icon: "refresh",
collapse: !1,
showing: !1
} ]
} ],
create: function() {
this.inherited(arguments);
},
close: function() {
this.inherited(arguments), this.$.postTextBox.blur(), this.doClose();
},
buildAccounts: function() {
var e = App.Users.getAll(), t = App.Prefs.get("currentUser");
this.accounts = [];
for (var n in e) e[n].id === t && (found_last_posting_account_id = !0), this.accounts.push({
id: e[n].id,
value: e[n].id,
content: e[n].username,
type: e[n].type,
active: e[n].id === t || n == 0
});
this.$.accountSelection.createComponents(this.accounts, {
owner: this
}), this.$.accountSelection.render(), t ? this.setPostingAccount(t) : this.setPostingAccount(this.accounts[0].value);
},
reset: function() {
this.setAllDisabled(!1), this.$.postTextBoxContainer.setShowing(!0), this.$.postTextBox.blur(), this.buildAccounts(), this.$.autocompleteBox.setShowing(!1), this.$.autocompleteResults.destroyClientControls(), this.completemode = !1, this.$.sendButton.show(), this.$.retweetButton.hide(), this.reflow(), this.render();
},
dmUserChanged: function() {
this.dmUser ? (this.$.toolbar.setHeader("Message to " + this.dmUser), this.isDM = !0) : this.isDM = !1;
},
inReplyTweetChanged: function() {
this.$.inReplyTweetText.setContent(this.inReplyTweetText), this.isDM || (this.inReplyToId ? (this.$.toolbar.setHeader("Reply"), this.$.inReplyTweetText.show()) : this.$.inReplyTweetText.hide()), this.inReplyTweetText ? this.$.inReplyTweetText.show() : this.$.inReplyTweetText.hide();
},
setPostingAccount: function(e) {
this.twit = AppUtils.makeTwitObj(e), App.Prefs.set("last_posting_account_id", e);
},
accountChange: function(e, t) {
this.setPostingAccount(t.selected.id);
},
onSendClick: function(e) {
this.$.sendButton.setActive(!0), this.setAllDisabled(!0), this.isDM ? this.twit.sendDirectMessage("@" + this.dmUser, this.$.postTextBox.getValue(), enyo.bind(this, function() {
this.$.postTextBox.setValue(""), this.$.sendButton.setActive(!1), this.setAllDisabled(!1), this.close(), App.Prefs.get("refresh-after-posting") && AppUI.refresh(this.$.accountSelection.selected.value);
}), enyo.bind(this, function() {
AppUtils.showBanner("Sending failed"), this.$.sendButton.setActive(!1), this.setAllDisabled(!1);
})) : this.isRepost ? this.twit.retweet(this.repostTweet.service_id, enyo.bind(this, function(e) {
this.repostTweet = null, this.isRepost = null, this.$.sendButton.setActive(!1), this.setAllDisabled(!1);
var t = this.$.accountSelection.selected.value;
this.close(), AppUtils.showBanner("Message retweeted!"), App.Prefs.get("refresh-after-posting") && AppUI.refresh(t);
}), enyo.bind(this, function(e, t, n) {
this.$.sendButton.setActive(!1);
})) : this.twit.update(this.$.postTextBox.getValue(), null, this.inReplyToId, enyo.bind(this, function() {
this.$.postTextBox.setValue(""), this.$.sendButton.setActive(!1), this.setAllDisabled(!1), this.close(), App.Prefs.get("refresh-after-posting") && AppUI.refresh(App.Prefs.get("currentUser"));
}), enyo.bind(this, function(e) {
console.log(e), AppUtils.showBanner("Sending failed"), this.$.sendButton.setActive(!1), this.setAllDisabled(!1);
}));
},
onShortenClick: function(e) {
this.$.shortenPopup.show(e);
},
itemSelect: function(e, t) {
console.log(e, t);
switch (e.selected.value) {
case "shortenURLs":
this.onShortenURLsClick();
break;
case "shortenText":
this.onShortenTextClick();
break;
default:
console.error(e.selected.value + " has no handler");
}
},
onShortenTextClick: function(e) {
this.$.postTextBox.setValue((new SpazShortText).shorten(this.$.postTextBox.getValue())), this.$.postTextBox.focus(), this.postTextBoxInput();
},
onShortenURLsClick: function(e) {
var t = sc.helpers.extractURLs(this.$.postTextBox.getValue());
if (t.length > 0) {
this.$.shortenButton.setDisabled(!0);
var n = App.Prefs.get("url-shortener"), r = {};
switch (n) {
case SPAZCORE_SHORTURL_SERVICE_ISGD:
case SPAZCORE_SHORTURL_SERVICE_GOOGLE:
case SPAZCORE_SHORTURL_SERVICE_GOLOOKAT:
break;
default:
enyo.log("Unknown shortener: " + n + ", falling back to " + SPAZCORE_SHORTURL_SERVICE_JMP), n = SPAZCORE_SHORTURL_SERVICE_JMP;
case SPAZCORE_SHORTURL_SERVICE_BITLY:
case SPAZCORE_SHORTURL_SERVICE_JMP:
r = {
version: "2.0.1",
format: "json",
login: "spazcore",
apiKey: "R_f3b86681a63a6bbefc7d8949fd915f1d"
};
}
(new SpazShortURL(n)).shorten(t, {
apiopts: r,
onSuccess: enyo.bind(this, function(e) {
this.$.postTextBox.setValue(this.$.postTextBox.getValue().replace(e.longurl, e.shorturl)), this.$.postTextBox.focus(), this.postTextBoxInput(), this.$.shortenButton.setDisabled(!1);
}),
onFailure: enyo.bind(this, function() {
this.$.shortenButton.setDisabled(!1);
})
});
}
},
postTextBoxInput: function(e, t, n) {
n || (n = this.$.postTextBox.getValue());
var r = 140 - this.$.postTextBox.getCharCount();
this.$.sendButton.setRemaining(r);
if (n.length != 0) var i = n[n.length - 1]; else var i = "";
if (i === " " && this.completemode === !0) this.$.autocompleteResults.children[0].dispatchBubble("ontap"); else if (i === " ") this.$.autocompleteBox.setShowing(!1), this.$.autocompleteResults.destroyClientControls(), this.completemode = !1; else if (this.completemode === !0) {
var s = this.autocompleteSearch(n);
this.$.autocompleteResults.destroyClientControls();
for (var o in s) {
var u = "transparent";
parseInt(o) == 0 && (u = "blue"), this.$.autocompleteResults.createComponent({
content: "@" + s[o],
style: "background-color: " + u + "; margin-left: 10px;",
ontap: "completeUsername"
}, {
owner: this
});
}
this.$.autocompleteResults.render();
} else i === "@" && this.backPressed != 1 && (this.completemode = !0, this.$.autocompleteBox.setShowing(!0));
},
completeUsername: function(e, t) {
var n = e.content;
inValue = this.$.postTextBox.getValue(), inValue = inValue.substr(0, inValue.lastIndexOf("@")), inValue += n, this.$.autocompleteBox.setShowing(!1), this.$.autocompleteResults.destroyClientControls(), this.completemode = !1, this.$.postTextBox.setValue(inValue + "&nbsp;"), this.cursorToEnd();
},
autocompleteSearch: function(e) {
var t = [], n = e.substr(e.lastIndexOf("@")).toLowerCase();
for (var r in window.autocomplete) {
var i = window.autocomplete[r];
i.toLowerCase().search(n.substr(1)) >= 0 && t.push(i);
if (t.length > 4) break;
}
return t;
},
clear: function() {
this.$.postTextBox.setValue(""), this.dmUser = "", this.inReplyTweetText = "", this.inReplyToId = null, this.$.toolbar.setHeader("New Tweet"), this.postTextBoxInput(), this.dmUserChanged(), this.inReplyTweetChanged(), this.$.postTextBox.blur(), this.isDM = !1, this.isRepost = !1;
},
postTextBoxKeydown: function(e, t) {
this.backPressed = !1;
if (e.disabled) return t.preventDefault();
t.keyCode === 13 && App.Prefs.get("post-send-on-enter") === !0 ? (this.$.sendButton.disabled === !1 && this.onSendClick(), t.preventDefault()) : t.keyCode === 8 && this.completemode == 1 && (this.$.autocompleteBox.setShowing(!1), this.$.autocompleteResults.destroyClientControls(), this.completemode = !1, this.backPressed = !0);
},
postTextBoxFocus: function(e, t) {
e.disabled && e.blur();
},
compose: function(e) {
this.clear(), e = sch.defaults({
text: null,
account_id: null
}, e), e.account_id && this.setPostingAccount(e.account_id);
var t = e.text || "";
this.clear(), this.$.postTextBox.setValue(t), this.$.postTextBox.focus(), this.cursorToEnd(), this.postTextBoxInput(), this.dmUserChanged(), this.inReplyTweetChanged();
},
replyTo: function(e) {
this.clear(), e = sch.defaults({
to: null,
text: null,
tweet: null,
account_id: null,
all: !1
}, e);
var t = "", n = [];
e.account_id && this.setPostingAccount(e.account_id);
if (e.tweet) {
this.inReplyTweetText = e.tweet.text_raw, this.inReplyToId = e.tweet.service_id, e.account_id && n.push(App.Users.get(e.account_id).username), n.push(e.tweet.author_username);
var r = sch.extractScreenNames(e.tweet.text_raw, n), i = e.tweet.service_id, s = r.join(" @");
s.length > 0 && (s = "@" + s), t = _.clean([ "@" + e.tweet.author_username, s, e.text ].join(" "));
} else e.to ? t = "@" + e.to : t = "@";
this.$.postTextBox.setValue(t + "&nbsp;"), this.$.postTextBox.focus(), this.cursorToEnd(), this.postTextBoxInput(), this.dmUserChanged(), this.inReplyTweetChanged();
},
directMessage: function(e) {
this.clear(), this.isDM = !0, e = sch.defaults({
to: null,
text: null,
tweet: null,
account_id: null
}, e), e.account_id && this.setPostingAccount(e.account_id), this.dmUser = e.to;
var t = e.text || "";
e.tweet && (this.inReplyTweetText = e.tweet.text_raw), this.$.postTextBox.setValue(t), this.$.postTextBox.focus(), this.cursorToEnd();
var n = this.$.postTextBox.getCharCount(), r = {
start: n - 1,
end: n
};
this.$.postTextBox.setSelection(r), this.postTextBoxInput(), this.inReplyTweetChanged(), this.dmUserChanged();
},
repost: function(e) {
var t = this;
this.clear(), this.isRepost = !0, this.$.toolbar.setHeader("Retweet"), e = sch.defaults({
tweet: null,
account_id: null
}, e);
if (!e.tweet || !e.account_id) {
sch.error("No account and/or tweet obj set");
return;
}
this.repostTweet = e.tweet, this.setPostingAccount(e.account_id), this.$.inReplyTweetText.show(), this.$.inReplyTweetText.setContent('<span style="font-weight: bold">@' + e.tweet.author_username + ":</span> " + e.tweet.text), this.$.postTextBoxContainer.setShowing(!1), this.setRepostDisabled(!0), this.$.sendButton.hide(), this.$.retweetButton.show();
},
repostManual: function(e) {
this.show(), this.clear(), e = sch.defaults({
tweet: null,
account_id: null
}, e);
var t = e.tweet.text_raw, n = e.tweet.author_username;
t = "RT @" + e.tweet.author_username + " " + e.tweet.text_raw, this.show(), this.clear(), this.$.postTextBox.setValue(t), this.$.postTextBox.focus(), this.cursorToEnd(), this.postTextBoxInput(), this.dmUserChanged(), this.inReplyTweetChanged(), this.setPostingAccount(e.tweet.account_id);
},
quoteMessage: function(e) {
this.clear(), e = sch.defaults({
message: null,
account_id: null
}, e);
},
setAllDisabled: function(e) {
enyo.forEach(this.getComponents(), function(t) {
t.setDisabled && t.getName() !== "closeButton" && t.getName() !== "retweetButton" && t.setDisabled(e);
});
},
setRepostDisabled: function(e) {
enyo.forEach(this.getComponents(), function(t) {
t.setDisabled && t.getName() !== "closeButton" && !_.includes(t.getName(), "accountSelection") && t.getName() !== "sendButton" && t.getName() !== "retweetButton" && t.setDisabled(e);
});
},
cursorToEnd: function() {
var e = this.$.postTextBox;
if (!e.hasNode()) return;
var t = e.node.innerHTML;
e.node.blur(), e.setValue(""), e.setValue(t), e.focus(), e.moveCursorToEnd();
},
cursorToStart: function() {
var e = this.$.postTextBox;
if (!e.hasNode()) return;
var t = e.node.innerHTML;
e.node.blur(), e.setValue(""), e.setValue(t), e.focus(), e.moveCursorToEnd();
},
showFilePicker: function(e, t) {
this.$.filePicker.pickFile();
},
fileChosen: function(e, t) {
this.$.filePicker.hide(), t && t[0] && t[0].fullPath && (AppUtils.showBanner($L("Uploading image")), this.log("image path:", t[0].fullPath), this.upload(t[0].fullPath));
},
upload: function(e) {
var t = new SpazImageUploader;
t.setOpts({
auth_obj: AppUtils.getAuthObj(this.$.accountSelection.selected.value),
service: App.Prefs.get("image-uploader") || "twitpic",
file_url: e,
extra: {
message: this.isDM ? "from " + enyo.fetchAppInfo().title : this.$.postTextBox.getValue()
},
callback: this.begin
}), t.upload();
},
begin: function(e) {
this.uploader.go(e), this.uploader.response(this, this.uploadSuccess);
},
uploadProgress: function(e) {
enyo.warn(enyo.json.stringify(e));
},
uploadSuccess: function(e, t) {
this.log(this, t);
var n = this.$.postTextBox.getValue(), r = JSON.parse(t.responseString);
if (t.returnValue) return this.ticket = t.ticket;
if (t.completed && this.ticket != t.ticket) return this.error("ticket validation failed", this.ticket, t.ticket);
r.url ? (n.length > 0 ? this.$.postTextBox.setValue([ n, r.url ].join(" ")) : this.$.postTextBox.setValue(r.url), this.postTextBoxInput(), AppUtils.showBanner("Image uploaded!")) : r.error && typeof r.error == "string" && AppUtils.showBanner("Posting image failed: " + r.error);
},
uploadFail: function(e) {
AppUtils.showBanner("Posting image FAILED"), AppUtils.showBanner("Error!");
}
});

// SearchPopup.js

enyo.kind({
name: "Neo.SearchPopup",
kind: "FittableRows",
style: "text-align: center;",
events: {
onClose: ""
},
published: {
active: "topics"
},
components: [ {
kind: "Neo.Toolbar",
header: "Search",
closeable: !0
}, {
components: [ {
tag: "hr"
}, {
name: "radioGroup",
kind: "onyx.RadioGroup",
layoutKind: "FittableColumnsLayout",
fit: !0,
style: "margin:15px; text-align: center;",
onActivate: "radioActivate",
components: [ {
name: "topics",
kind: "Neo.Button",
text: "Topics",
active: !0
}, {
name: "users",
kind: "Neo.Button",
text: "Users",
blue: !1
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "searchTextBox",
kind: "Neo.RichText",
onkeydown: "searchBoxKeydown"
} ]
}, {
tag: "hr"
} ]
}, {
kind: "Neo.Toolbar",
left: [ {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton",
classes: "neo-button"
}, {
name: "accountSelection",
kind: "Neo.PopupList",
onSelect: "accountChange"
} ]
} ],
right: [ {
name: "searchButton",
kind: "Neo.Button",
ontap: "search",
text: "Search",
icon: "search"
} ]
} ],
create: function() {
this.inherited(arguments);
},
searchBoxKeydown: function(e, t) {
t.keyCode === 13 && (this.search(), t.preventDefault());
},
radioActivate: function(e, t) {
var n = t.originator.container || {};
if (n.active != 1) return;
switch (n.name) {
case "users":
this.$.searchTextBox.setPlaceholder("Enter username..."), this.setActive("users");
break;
case "topics":
default:
this.$.searchTextBox.setPlaceholder("Enter query..."), this.setActive("topics");
}
},
search: function() {
var e = this.$.searchTextBox, t = this.$.accountSelection;
switch (this.active) {
case "users":
var n = App.Users.get(t.selected.value), r = e.getValue().replace("@", "");
AppUI.viewUser(r, n.type, n.id), this.close();
break;
case "topics":
default:
AppUI.search(e.getValue(), t.selected.value), this.close();
}
},
buildAccounts: function() {
var e = App.Users.getAll();
this.accounts = [];
for (var t in e) this.accounts.push({
id: e[t].id,
value: e[t].id,
content: e[t].username,
type: e[t].type,
active: e[t].id === App.Prefs.get("currentUser")
});
this.$.accountSelection.createComponents(this.accounts, {
owner: this
}), this.$.accountSelection.render();
},
reset: function() {
this.active = "topics", this.$.searchTextBox.setValue(""), this.$.searchTextBox.focus(), this.buildAccounts();
},
close: function() {
this.$.searchTextBox.blur(), this.doClose();
}
});

// AccountsPopup.js

enyo.kind({
name: "Neo.AccountsPopup",
kind: "FittableRows",
fit: !0,
events: {
onClose: "",
onAccountAdded: "",
onAccountRemoved: ""
},
components: [ {
name: "toolbar",
kind: "Neo.Toolbar",
header: "Accounts",
closeable: !0,
left: [ {
name: "backButton",
kind: "Neo.Button",
text: "Back",
showing: !1,
ontap: "goTopLevel",
icon: "back"
} ]
}, {
name: "content",
layoutKind: "FittableRowsLayout",
fit: !0
}, {
name: "toolbarBottom",
kind: "Neo.Toolbar",
middle: [ {
name: "addButton",
kind: "Neo.Button",
text: "New",
ontap: "newAccount",
icon: "io"
}, {
name: "removeButton",
kind: "Neo.Button",
ontap: "promptRemoveAccount",
text: "Delete",
showing: !1,
icon: "delete"
}, {
name: "cancelButton",
kind: "Neo.Button",
ontap: "goTopLevel",
text: "Cancel",
showing: !1,
blue: !1,
classes: "onyx-negative",
icon: "cancel"
}, {
name: "saveButton",
kind: "Neo.Button",
disabled: !0,
showing: !1,
text: "Save",
blue: !1,
classes: "onyx-affirmative",
ontap: "saveTwitterAccount",
icon: "save"
}, {
name: "cancelRemoveAccount",
kind: "Neo.Button",
text: "Cancel",
ontap: "goBackToViewAccount",
icon: "cancel"
}, {
name: "removeAccount",
kind: "Neo.Button",
text: "Are you sure?",
ontap: "removeAccount",
blue: !1,
classes: "onyx-negative",
icon: "delete"
} ]
} ],
oauth: null,
create: function() {
this.inherited(arguments);
},
reset: function() {
this.$.richText && this.$.richText.blur(), this.goTopLevel();
},
hideAllToolbuttons: function() {
enyo.forEach(this.$.toolbarBottom.$.middle.children, function(e) {
e.hide();
}.bind(this)), this.$.backButton.hide();
},
goTopLevel: function(e, t) {
this.editing_acc_id = null, this.$.toolbar.setHeader("Accounts"), this.hideAllToolbuttons(), this.$.addButton.show(), this.$.content.destroyClientControls(), this.$.content.createComponent({
name: "accountsList",
kind: "Neo.AccountsList",
fit: !0,
onAccountClick: "viewAccountFromListTap"
}, {
owner: this
}), this.$.accountsList.buildAccounts(), this.render(), this.reflow();
},
goDownLevel: function(e) {
var t;
this.hideAllToolbuttons(), e === "new" ? (t = "New", this.$.cancelButton.show(), this.$.saveButton.show()) : (t = "@" + App.Users.get(e).username, this.$.removeButton.show()), this.$.toolbar.setHeader(t), this.$.accountsList && this.$.accountsList.destroy();
},
viewAccountFromListTap: function(e, t) {
this.viewAccount(this.$.accountsList.accounts[t.index].id);
},
viewAccount: function(e) {
this.editing_acc_id = e, this.goDownLevel(e);
var t = App.Users.get(e);
this.$.secondLevel && this.$.secondLevel.destroy(), this.$.content.createComponents([ {
name: "secondLevel",
kind: "FittableRows",
components: [ {
name: "accountInfo",
kind: "onyx.Item",
classes: "highlightable",
style: "box-shadow:inset 0px 0px 8px rgba(0,0,0,0.7);",
tapHighlight: !0,
ontap: "viewProfile",
layoutKind: "FittableColumnsLayout",
owner: this,
components: [ {
name: "spinner",
style: "width: 50px",
style: "height: 55px",
owner: this,
components: [ {
name: "innerSpinner",
kind: "onyx.Spinner",
style: "margin: auto;",
showing: !0
} ]
}, {
name: "avatar",
kind: "Image",
style: "width:50px; height:50px; box-shadow:0px 0px 8px rgba(0,0,0,0.7);",
classes: "avatar",
showing: !1,
owner: this
}, {
style: "width: 10px"
}, {
kind: "FittableRows",
fit: !0,
style: "height: 50px;",
components: [ {
name: "realname",
fit: !0,
style: "font-weight: bold",
content: t.username,
owner: this
}, {
name: "username",
fit: !0,
classes: "link",
content: "@" + t.username
} ]
} ]
} ]
} ]), this.$.removeButton.show(), this.$.backButton.show(), this.$.toolbar.render(), this.$.toolbar.reflow(), AppUtils.getAccount(e, enyo.bind(this, function(e) {
this.$.realname.setContent(e.name), this.$.avatar.show(), this.$.avatar.setSrc(e.profile_image_url), this.$.spinner.setShowing(!1), this.$.innerSpinner.setShowing(!1);
}), function(e, t, n) {
console.error("Couldn't find user's avatar");
}), this.render();
},
changeCredentials: function(e, t) {
this.createAccountEditComponents(App.Users.get(e.account_id));
},
newAccount: function(e, t) {
this.goDownLevel("new"), this.createAccountEditComponents();
},
changeService: function(e) {
this.createAccountEditComponents();
},
createAccountEditComponents: function(e) {
this.$.secondLevel && this.$.secondLevel.destroy(), this.$.content.createComponents([ {
name: "secondLevel",
style: "text-align:center",
kind: "FittableRows",
components: [ {
kind: "FittableRows",
components: [ {
tag: "br"
}, {
tag: "br"
}, {
tag: "br"
}, {
name: "getTwitterAuthButton",
kind: "Neo.Button",
text: "Get PIN",
ontap: "getTwitterPinAuthorization",
icon: "import"
}, {
kind: "onyx.InputDecorator",
style: "background-color:white; margin:10px;",
components: [ {
name: "twitterPinInput",
kind: "onyx.Input",
oninput: "inputChanging",
placeholder: "Enter PIN"
}, {
kind: "Neo.Icon",
icon: "key",
_col: "black/"
} ]
}, {
name: "tokenMsg",
style: "color: red; font-weight: bold"
} ]
} ]
} ], {
owner: this
}), this.render(), e ? (this.editing_acc_id = e.id, this.$.username.setValue(e.username), this.$.password.show(), this.$.type.setValue(e.type), e.type === SPAZCORE_SERVICE_CUSTOM ? (this.$.api_base_url.show(), this.$.api_base_url.setValue(App.Users.getMeta(e.id, "twitter-api-base-url"))) : this.$.api_base_url.setShowing(!1)) : this.editing_acc_id = null;
},
getTwitterPinAuthorization: function(e, t) {
if (!SPAZCORE_CONSUMERKEY_TWITTER) {
console.error("SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter"), AppUtils.showBanner($L("SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter"));
return;
}
this.oauth = OAuth({
consumerKey: SPAZCORE_CONSUMERKEY_TWITTER,
consumerSecret: SPAZCORE_CONSUMERSECRET_TWITTER,
requestTokenUrl: "https://twitter.com/oauth/request_token",
authorizationUrl: "https://twitter.com/oauth/authorize",
accessTokenUrl: "https://twitter.com/oauth/access_token"
}), this.$.getTwitterAuthButton.setActive(!0), this.$.getTwitterAuthButton.setDisabled(!0), this.oauth.fetchRequestToken(_.bind(function(e) {
this.$.getTwitterAuthButton.setActive(!1), this.$.getTwitterAuthButton.setDisabled(!1), this.$.tokenMsg.applyStyle("color", "green"), this.$.tokenMsg.setContent("Got tokens, enter key to continue.."), this.authwindow = sch.openInBrowser(e, "authorize");
}, this), _.bind(function(e) {
this.$.getTwitterAuthButton.setActive(!1), this.$.getTwitterAuthButton.setDisabled(!1), this.$.tokenMsg.applyStyle("color", "red"), this.$.tokenMsg.setContent("Token request failed."), AppUtils.showBanner($L("Problem getting Request Token from Twitter")), console.error("ERROR: ", e, JSON.stringify(e));
}, this)), e.setActive(!1);
},
saveTwitterAccount: function(e, t) {
var n = this, r = SPAZCORE_SERVICE_TWITTER, i = this.$.api_base_url ? this.$.api_base_url.getValue() : null, s = this.$.twitterPinInput.getValue();
s && this.oauth ? (this.oauth.setVerifier(s), this.$.saveButton.setActive(!0), this.$.saveButton.setDisabled(!0), this.oauth.fetchAccessToken(function(e) {
var t = AppUtils.getQueryVars(e.text), s = t.screen_name + ":" + t.oauth_token + ":" + t.oauth_token_secret;
if (this.editing_acc_id) this.editing_acc_id = null; else {
var o = App.Users.add(t.screen_name.toLowerCase(), s, r);
App.Users.setMeta(o, "twitter-api-base-url", i);
}
n.$.saveButton.setActive(!1), n.$.saveButton.setDisabled(!1), n.goTopLevel(), neoapp.accountAdded(o ? o.id : null), App.Users.getAll().length === 1 && n.doClose();
}, function(e) {
AppUtils.showBanner($L("Problem getting access token from Twitter; must re-authorize")), n.authwindow && n.authwindow.close(), n.$.twitterPinInput.setValue(""), n.$.getTwitterAuthButton.setText("Try Again"), n.$.getTwitterAuthButton.setActive(!1), n.$.saveButton.setActive(!1), n.$.saveButton.setDisabled(!1);
})) : AppUtils.showBanner($L("You must log in enter the PIN you are given to continue", 3e3));
},
saveAccount: function(e, t) {
var n = this, r = SPAZCORE_SERVICE_TWITTER, i = this.$.username.getValue(), s = this.$.password.getValue(), o = this.$.api_base_url ? this.$.api_base_url.getValue() : null, u = new SpazTwit, a = !1, f = App.Users.getAll();
for (var l = 0; l < f.length; l++) i == f[l].username && r == f[l].type && (a = !0);
a && (n.$.saveButton.setActive(!1), n.$.saveButton.setDisabled(!1), AppUtils.showBanner($L("Add account failed!<br>Reason: duplicate")));
if (i && s && !a) {
u.setBaseURL(o);
var c = new SpazAuth(r);
sch.error("authorizing\u2026"), n.$.saveButton.setActive(!0), n.$.saveButton.setDisabled(!0), c.authorize(i, s, function(e) {
if (e) {
var t = c.save();
sch.error("auth_pickle:"), sch.error(t);
if (this.editing_acc_id) this.editing_acc_id = null; else {
var s = App.Users.add(i.toLowerCase(), t, r);
App.Users.setMeta(s, "twitter-api-base-url", o);
}
n.$.saveButton.setActive(!1), n.$.saveButton.setDisabled(!1), n.goTopLevel(), neoapp.accountAdded(s ? s.id : null), App.Users.getAll().length === 1 && n.doClose();
} else n.$.saveButton.setActive(!1), n.$.saveButton.setDisabled(!1), AppUtils.showBanner("Verification failed!");
});
}
},
inputChanging: function() {
this.$.saveButton.setDisabled(Util.isEmpty(this.$.twitterPinInput.getValue()));
},
promptRemoveAccount: function(e, t) {
this.hideAllToolbuttons(), this.$.cancelRemoveAccount.show(), this.$.removeAccount.show();
},
removeAccount: function(e, t) {
App.Users.remove(this.editing_acc_id), neoapp.accountRemoved(this.editing_acc_id), this.editing_acc_id = null, this.goTopLevel();
},
viewProfile: function(e, t) {
var n = App.Users.get(this.editing_acc_id);
AppUI.viewUser(n.username, n.type, this.editing_acc_id), this.doClose();
},
goBackToViewAccount: function(e, t) {
var n = this.editing_acc_id;
this.goTopLevel(), this.viewAccount(n);
}
});

// AccountsList.js

enyo.kind({
name: "Neo.AccountsList",
events: {
onAccountClick: ""
},
components: [ {
kind: "List",
classes: "enyo-fit list",
onSetupItem: "setupRow",
components: [ {
kind: "onyx.Item",
tapHighlight: !0,
classes: "tweet",
layoutKind: "FittableColumnsLayout",
ontap: "accountClick",
components: [ {
name: "icon",
kind: "Neo.Icon",
icon: "twitter"
}, {
name: "label",
content: "",
style: "font-size: 18px; padding-top: 0px; padding-right: 5px"
}, {
name: "hr",
tag: "hr"
} ]
} ]
} ],
accounts: [],
create: function() {
this.inherited(arguments), this.buildAccounts();
},
buildAccounts: function() {
var e = App.Users.getAll();
this.accounts = [];
for (var t in e) this.accounts.push({
id: e[t].id,
content: "@" + e[t].username,
type: e[t].type
});
this.$.list.setCount(this.accounts.length), this.$.list.refresh();
},
setupRow: function(e, t) {
var n = t.index, r = this.accounts[n];
this.$.label.setContent(r.content), this.$.hr.show(), n == this.accounts.length - 1 && this.$.hr.hide();
},
accountClick: function(e, t) {
this.bubble("onAccountClick", t);
}
});

// FilterPopup.js

enyo.kind({
name: "Neo.FilterPopup",
kind: "FittableRows",
style: "text-align: center;",
events: {
onClose: ""
},
components: [ {
kind: "Neo.Toolbar",
header: "Add Filter",
closeable: !0
}, {
classes: "compose",
components: [ {
tag: "hr"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "searchTextBox",
kind: "Neo.RichText",
onkeydown: "searchBoxKeydown",
alwaysLooksFocused: !0,
selectAllOnFocus: !0,
richContent: !1,
multiline: !1
} ]
}, {
tag: "hr"
} ]
}, {
kind: "Neo.Toolbar",
middle: [ {
name: "addButton",
kind: "Neo.Button",
ontap: "addFilter",
text: "Create Filter",
icon: "tick",
blue: !1,
classes: "onyx-affirmative"
} ]
} ],
close: function() {
this.inherited(arguments);
},
reset: function() {
this.$.searchTextBox.setValue(""), this.$.searchTextBox.focus();
},
setupItem: function(e, t) {
var n = this.searches[t.index];
enyo.error(n), this.$.searchesContent.setContent(n);
},
searchBoxKeydown: function(e, t) {
t.keyCode === 13 && (this.addFilter(), t.preventDefault());
},
addFilter: function() {
var e = this.$.searchTextBox.getValue();
this.$.richText.blur(), this.doClose(), AppUI.addFilter(e);
}
});

// AboutPopup.js

enyo.kind({
name: "Neo.AboutPopup",
style: "color: grey; text-align: center;",
layoutKind: "FittableRowsLayout",
events: {
onClose: ""
},
components: [ {
kind: "Neo.Toolbar",
header: "About",
closeable: !0,
onclose: "exit"
}, {
name: "panels",
kind: "Panels",
draggable: !1,
index: 0,
fit: !0,
components: [ {
name: "about",
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
components: [ {
tag: "h1",
content: enyo.fetchAppInfo().title + " v" + enyo.fetchAppInfo().version,
allowHtml: !0
}, {
tag: "br"
}, {
content: "Neo Twitter Client"
}, {
tag: "br"
}, {
content: "by Jake Morrison and Bryan Leasot"
}, {
tag: "br"
}, {
content: "The only twitter client you need"
}, {
tag: "br"
}, {
tag: "br"
}, {
tag: "br"
}, {
tag: "br"
}, {
content: "For more information, follow @Neo_webOS"
}, {
tag: "br"
}, {
content: "For help, send an email to fxjmapps@gmail.com"
}, {
tag: "br"
}, {
content: "To talk to the developers, follow @fxspec06 and @JakeMorrison24"
}, {
tag: "br"
}, {
content: "To learn more about Enyo, follow @EnyoJS and visit http://www.enyojs.com/"
}, {
tag: "br"
}, {
content: "To find the latest news and information about webOS, follow @webOSNation and visit http://www.webosnation.com/"
}, {
tag: "br"
}, {
content: "To get the most out of your webOS device, follow @webosinternals and visit http://www.webosinternals.org/"
}, {
tag: "br"
}, {
content: "To chat with cool webOS fans, visit #webos, #webos-ports, #webos-offtopic, and #enyojs on the IRC freenode network"
}, {
style: "height: 75%;"
}, {
tag: "h1",
content: "Thank you for purchasing Neo"
}, {
tag: "br"
}, {
kind: "Neo.Icon",
_col: "red_dark/",
_res: "xhdpi/",
icon: "heart",
style: "width: 50px; height: 50px;margin:auto;"
}, {
tag: "br"
}, {
style: "font-style: italic;",
content: "Support webOS developers"
}, {
style: "height: 50%;"
} ]
}, {
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
allowHtml: !0,
components: [ {
name: "licence",
allowHtml: !0
} ]
}, {
kind: "Scroller",
fit: !0,
touch: !0,
thumb: !1,
allowHtml: !0,
components: [ {
tag: "h1",
content: enyo.fetchAppInfo().title + " v" + enyo.fetchAppInfo().version,
allowHtml: !0
}, {
tag: "br"
}, {
content: "CHANGELOG"
}, {
tag: "br"
}, {
style: "text-align: left;",
allowHtml: !0,
content: "//////////////////////////\n//						// 1.3.13\n//						// version 0.5.3\n//						// app catalog submission\n	//\n	//- Fixed twitter search URL\n	//- Fixed large tweet bug\n	//- Added anchors for lists\n	//- Fixed lack of notifications\n	//- Fixed horrible retweet bug\n	//- Fixed avatar bug from 0.5.1\n	//- Fixed infamous 'black screen glitch'\n	//\n	//"
}, {
tag: "br"
}, {
style: "text-align: left;",
allowHtml: !0,
content: '//////////////////////////<br/>//						// 12.27.12<br/>//						// version 0.5.2 *beta<br/>//<br/>// - Added ability to tap a selected sidebar to select it again (temp fix to help deal with "black screen glitch")<br/>// - Fixed glitch from unreleased 0.5.1 with icons<br/>// - Added more icons<br/>// - Separated themes from basic and advanced<br/>// - Added 6 new Toolbar themes to select<br/>//- Added changelog to about section<br/>// - Added placeholder help button to Themes<br/>// - Added placeholder basic button to Themes<br/>// - Changed Themes behavior, added functionality'
}, {
tag: "br"
}, {
style: "text-align: left;",
allowHtml: !0,
content: "//////////////////////////<br/>//					// 12.21.12<br/>//					// version 0.5.1<br/>//app catalog update #1<br/>//app catalog BUMP to top<br/>//<br/>//CHANGES:<br/>//- Added setting for hiding of minimize graphics<br/>//- Fixed button tap issues<br/>//- Fixed icon not displaying issues (icons not yet decided now appear with 'bug' icon)<br/>//- Minor optimization<br/>//<br/>"
}, {
tag: "br"
}, {
style: "text-align: left;",
allowHtml: !0,
content: "//////////////////////////<br/>//						//<br/>//						// version 0.5.0<br/>// OFFICIAL APP CATALOG RELEASE<br/>//<br/>//"
}, {
tag: "br"
} ]
} ]
}, {
kind: "Neo.Toolbar",
middle: [ {
name: "bottomButton",
kind: "Neo.Button",
text: "License",
ontap: "toggle",
icon: "overflow"
} ]
} ],
create: function() {
this.inherited(arguments);
var e = document.getElementById("licenseContent");
this.$.licence.setContent(e.innerHTML);
},
reset: function() {
this.$.panels.setIndex(0), this.render(), this.reflow();
},
toggle: function(e, t) {
var n = this.$.panels.index, r = n == 1 ? 2 : n == 2 ? 0 : 1;
this.$.panels.setIndex(r);
switch (r) {
case 0:
this.$.bottomButton.setText("More"), this.$.bottomButton.setIcon("overflow");
break;
case 1:
this.$.bottomButton.setText("Even More"), this.$.bottomButton.setIcon("tag");
break;
case 2:
this.$.bottomButton.setText("Less"), this.$.bottomButton.setIcon("io");
}
},
exit: function(e, t) {
this.doClose();
}
});

// PulldownList.js

enyo.kind({
name: "Neo.PulldownList",
kind: "enyo.PulldownList",
pulldownTools: [ {
name: "pulldown",
classes: "neo-list-pulldown",
components: [ {
name: "puller",
kind: "Neo.Puller"
} ]
} ],
pullingMessage: "load tweets",
pulledMessage: "release...",
loadingMessage: "loading...",
pullingIconClass: "neo-puller-arrow neo-puller-arrow-down",
pulledIconClass: "neo-puller-arrow neo-puller-arrow-up",
loadingIconClass: ""
}), enyo.kind({
name: "Neo.Puller",
kind: "Neo.Tweet.other",
show: [],
published: {
text: "",
iconClass: ""
},
pullee: [ {
name: "iconleft",
classes: "inside",
style: "float: left;"
}, {
name: "iconright",
classes: "outside",
style: "float: right;"
}, {
name: "text",
classes: "neo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.$.body.parent.createComponents(this.pullee, {
owner: this
}), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text), this.render();
},
iconClassChanged: function(e) {
this.$.iconleft.removeClass(e), this.$.iconright.removeClass(e), this.$.iconleft.addClass(this.iconClass), this.$.iconright.addClass(this.iconClass);
}
});

// NeoNotifier.js

enyo.kind({
name: "Neo.Notifier",
kind: enyo.Component,
tweets: {},
valid_types: [ "tweet", "mention", "private_message", "search" ],
create: function() {
this.inherited(arguments);
},
addTweet: function(e) {
if (!e.is_author) {
var t = e.account_id, n = "@" + App.Users.get(e.account_id).username, r = e.service_id, i = "notify-newmessages";
e.is_mention ? i = "notify-mentions" : e.is_private_message ? i = "notify-dms" : e.is_search_result && (i = "notify-searchresults");
}
if (App.Prefs.get(i)) {
this.tweets[n] || (this.tweets[n] = {
"notify-newmessages": [],
"notify-mentions": [],
"notify-dms": [],
"notify-searchresults": []
});
var s = this.tweets[n][i];
s.indexOf(r) === -1 && this.tweets[n][i].push(r);
}
},
raiseNotifications: function() {
for (var e in this.tweets) for (var t in this.tweets[e]) {
var n = this.tweets[e][t].length, r = "", i = "";
if (n > 0) {
switch (t) {
case "notify-newmessages":
i = n > 1 ? "tweets" : "tweet";
break;
case "notify-mentions":
i = n > 1 ? "mentions" : "mention";
break;
case "notify-dms":
i = n > 1 ? "private messages" : "private message";
break;
case "notify-searchresults":
i = n > 1 ? "search results" : "search result";
break;
default:
i = "tweets";
}
r = enyo.macroize($L("{$count} new {$type_label}"), {
count: n,
type_label: i
}), this.raiseNotification(e, r);
}
}
this.resetCounts();
},
raiseNotification: function(e, t) {
AppUtils.showDashboard({
title: e,
text: t
});
},
resetCounts: function() {
this.tweets = {};
}
});

// ImageView.js

enyo.kind({
name: "Neo.ImageViewPopup",
kind: "onyx.Popup",
modal: !0,
events: {
onClose: ""
},
style: "height: 100%; width: 100%; ",
classes: "enyo-imageviewpopup",
components: [ {
kind: "onyx.IconButton",
style: "position: absolute; right: 10px; top: 10px; z-index: 1000;",
src: "assets/images/icon-close.png",
ontap: "doClose"
}, {
name: "imageView",
kind: "enyo.Image",
style: "margin: 10px;",
height: "100%",
fit: !0,
onGetLeft: "getLeft",
onGetRight: "getRight"
} ],
create: function() {
this.inherited(arguments);
},
setImages: function(e, t) {
this.$.imageView.applyStyle("height", window.innerHeight - 20 + "px"), this.images = e, this.index = t, this.$.imageView.setCenterSrc(this.images[this.index]);
},
getLeft: function(e, t) {
return t && this.index--, this.images[this.index - 1];
},
getRight: function(e, t) {
return t && this.index++, this.images[this.index + 1];
}
});

// Blackberry.js

enyo.kind({
name: "Neo.BlackBerryExtention",
published: {
notification: ""
},
components: [ {
kind: "enyo.Signals",
onNotify: "notify",
onLaunchBrowser: "launchBrowser"
} ],
create: function() {
this.inherited(arguments), console.log("loading Neo BlackBerry Extentions..."), typeof blackberry != "undefined" ? console.log("adding invoked listener..") && blackberry.event.addEventListener("invoked", this.appRelaunched) : console.warn("blackberry is undefined...");
},
appRelaunched: function(e) {
this.error("CATCHING BLACKBERRY NOTIFICATION TAP..."), this.log(e), e.action == "relaunch" && doSomething(e.uri);
},
notify: function(e) {
this.notification = new Notification(e);
},
email: function(e, t, n) {
var r = new blackberry.invoke.MessageArguments(e || "fxjmapps@gmail.com", t || "Neo: Twitter for BlackBerry v" + enyo.fetchAppRootPath(), n || "I love Neo.");
r.view = blackberry.invoke.MessageArguments.VIEW_NEW, blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, r);
},
launchBrowser: function(e, t) {
if (t != null) var n = t.url; else var n = e;
console.log("LAUNCHING BROWSER.....", n), blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, new blackberry.invoke.BrowserArguments(n));
},
filePicker: function(e, t, n) {
blackberry.invoke.card.invokeFilePicker({
title: "Neo: Image Upload",
mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
type: [ blackberry.invoke.card.FILEPICKER_TYPE_PICTURE ],
successCallback: e || this.onSuccess.bind(this),
errorCallback: n || this.onError.bind(this)
});
},
fileTransfer: function(e, t, n, r, i) {
var s = {
params: n
};
blackberry.io.filetransfer.upload({
filePath: e,
server: t,
options: s,
successCallback: r || this.onSuccess.bind(this),
errorCallback: i || this.onError.bind(this)
});
},
onSuccess: function(e) {
this.error("UPLOAD SUCCESS!", e);
},
onError: function(e) {
this.error("UPLOAD FAILED!", e);
},
notifyInfo: function(e, t) {
if (!e) return;
t.payloadURI || (t.payloadURI = "relaunch"), new Notification(e, t);
},
notifyEvent: function(e, t, n, r) {
if (!n || !e) return;
var i = new Notification(e, {
body: t || "Notification brought to you by: Neo",
onshow: n,
onerror: r
});
},
notifyApp: function(e, t, n, r, i) {
if (!e) return;
var s = {
target: t || "sys.browser",
targetAction: n || "bb.action.OPEN",
payloadType: r || "text/html",
payloadURI: i || "the link"
};
new Notification(e, s);
}
});
