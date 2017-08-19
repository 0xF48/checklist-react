
/* 
	tetris grid  

	parses through items and arranges them into a grid, resizing and positioning based on index and w/h amount.

	NOTE:
		FIXED GRIDS:
			do not cycle through many offsets at once, this will result in grid resets!
			gradually increase the offset, you may increase the max offset but beware that offsetting more than an optimal amount may result in visual glitching depending on grid size!
			
			It is recommended to NOT use hard_sync. Keep your data lists consistent, if you want to display unique data, its best not to replace existing list items but add new ones with custom settings!
		ALL GRIDS:
			hard_sync matches and diffs all cached list items and prop children to make sure that child indecies do not go out of sync with the index_array.
		SCROLLABLE GRIDS:

	NOTE:
		if you do not use hard_sync which defaults to easy sync by default, IF you switch or shuffle the prop children, the grid will BREAK!!

	NOTE:
		remember to change grid ID (props.list_id) if you are working with different sets of children.
*/
window.ty = 'matrix3d(0,0,1.00,0,0.00,0.6,0.00,0,-1,0,0,0,0,0,0,1)';
require('./style/TetrisGrid.scss');
var React = require('react');

// console.log(React)
Mixin = {
	contextTypes: {
		animate: React.PropTypes.bool,
		scroll: React.PropTypes.object,
		fixed: React.PropTypes.bool,
		diam: React.PropTypes.number,
		vertical: React.PropTypes.bool,
		outerWidth: React.PropTypes.number,
		outerHeight: React.PropTypes.number,
		w: React.PropTypes.number,
		h: React.PropTypes.number,
	}
}



function clamp(n,min,max){
	if (n <= min) return min
	if(n >= max) return max
	return n
}





/* pass -1 for w/h to set size based on amount of children and grid dimentions */
var GridItem = React.createClass({
	displayName: 'GridItem',

	mixins: [Mixin],
	hidden: null,
	getDefaultProps: function getDefaultProps() {
		this.hide_t = null;
		return {
			show_beta: 1,
			render_beta: 2,
			animate: false,
			end: false,

			w: null,
			h: null,
			grid_shifts: 0,
			r: null,
			c: null,

			ease_dur: 0.4
		};
	},

	// getInitialState: function(){

	// },

	checkHidden: function checkHidden() {
		// console.log(-this.context.scroll.y);
		// console.log(this.props.end);
		var ch = this.context.outerHeight;
		if (this.context.vertical) {
			var top = (this.props.r - this.props.grid_shifts) * this.context.diam;
			var h = this.context.diam * this.props.h;
			var scroll = -this.context.scroll.y;

			if (scroll < top + h + ch * this.props.show_beta && scroll > top - ch - ch * this.props.show_beta) return 1;
			if (scroll < top + h + ch * this.props.render_beta && scroll > top - ch - ch * this.props.render_beta) return 0;
		} else {
			var left = (this.props.c - this.props.grid_shifts) * this.context.diam;
			var w = this.context.diam * this.props.w;
			var scroll = -this.context.scroll.x;
			if (scroll < left + w + ch * this.props.show_beta && scroll > left - ch - ch * this.props.show_beta) return 1;
			if (scroll < left + w + ch * this.props.render_beta && scroll > left - ch - ch * this.props.render_beta) return 0;
		}

		return -1;
	},

	// componentDidUpdate: function(props,state){
	// 	var check = this.checkHidden();
	// 	var hidden = check < 0;
	// 	if(this.hidden == hidden) return
	// 	if(check == -1){
	// 		this.hide(true);		
	// 	}else{
	// 		this.show(check == 0)
	// 	}
	// },

	hide: function hide(set) {

		this.hidden = true;
		// this.refs.item.style.visibility = 'hidden';
		this.refs.item.style.display = 'none';
	},

	show: function show(set, delay) {

		this.hidden = false;

		if(this.hide_t){
			clearTimeout(this.hide_t);
			this.hide_t = null;
		}

		// set = true

		if (set == true) {
			// this.refs.item.style.visibility = 'visible'
			this.refs.item.style.display = 'block';
			this.refs.item.style.transition = '';
			this.refs.item.style.transform = '';
			this.hide_t = setTimeout(function () {
				this.refs.item.style.transition = 'transform ' + this.props.ease_dur + 's cubic-bezier(.29,.3,.08,1)';
			}.bind(this), 1);
			return;
		} else {
			var x = this.props.w > this.props.h;

			var t_x = 'matrix3d(0.6,0,0.00,'+(-0.001+Math.random()*0.002)+',0.00,0,1.00,-0.003,0,-1,0,0,0,0,0,1)';
			var t_y = 'matrix3d(0,0,1,'+(-0.001+Math.random()*0.002)+',0.00,0.6,0.00,0.001,-1,0,0,0,0,0,0,1)';

			this.refs.item.style.transition = '';
			this.refs.item.style.transform = '' + (x ? t_x : t_y);
			// this.refs.item.style.visibility = 'visible'
			this.refs.item.style.display = 'block';

			this.hide_t = setTimeout(function () {
				this.refs.item.style.transition = 'transform ' + this.props.ease_dur + 's cubic-bezier(.29,.3,.08,1)';
				this.refs.item.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)';
			}.bind(this),50);
		}

		if (this.props.onShow != null) {
			this.props.onShow();
		}
	},

	componentDidMount: function componentDidMount() {
		if (this.props.animate == false) {
			return this.show(false);
		}
		var check = this.checkHidden();
		this.hidden = true;

		if (this.context.fixed) {
			return this.show(false);
		}

		if (check < 0) {
			this.hide();
		} else {
			this.show(check == 0);
		}

		if(this.props.animate){
			this.update_scroll_interval = setInterval(this.scrollUpdate, 100 + Math.random() * 300);
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		if (this.context.animate == false) {
			return;
		}
		// console.log("UNMOUNT ITEM")
		this.hidden = true;
		clearInterval(this.update_scroll_interval);
	},

	scrollUpdate: function scrollUpdate() {
		var check = this.checkHidden();
		var hidden = check < 0;
		if (this.hidden == hidden) return;
		if (check < 0) this.hide(true);else this.show(check == 0);
	},

	render: function render() {

		if (!this.context.fixed) {
			var left = this.props.c * this.context.diam + 'px';
			var top = (this.props.r - this.props.grid_shifts) * this.context.diam + 'px';
			var h = this.context.diam * this.props.h + 'px';
			var w = this.context.diam * this.props.w + 'px';
		} else {
			var left = 100 / this.context.w * this.props.c + '%';
			var top = 100 / this.context.h * this.props.r + '%';
			var w = 100 / this.context.w * this.props.w + '%';
			var h = 100 / this.context.h * this.props.h + '%';
		}

		var style = {
			left: left,
			top: top,
			height: h,
			width: w
		};

		return React.createElement(
			'div',
			{ className: '-i-grid-item-outer ' + this.props.outerClassName, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, ref: 'item', style: style },
			this.props.children
		);
	}
});

module.exports.GridItem = GridItem;


var Grid = React.createClass({
	displayName: 'Grid',


	getDefaultProps: function getDefaultProps() {
		var defaults = {
			toggle_reset: false,
			bottom_pad: 50,
			auto : false,
			_id: null,
			show_beta: 1,
			render_beta: 2,
			animate: true,
			hard_sync: false, // hard sync checks props children against buffered children on every update (not recommended with large amounts of children elements)
			update_offset_beta: 1,
			max_reached: false,
			native_scroll: true,
			max_grid_height_beta: 3,
			pause_scroll: false,
			fixed: false,
			show_loader: true,
			ease_dur: 0.4,
			vertical: true,
			offset: 0, //grid buffer offset.
			fill_up: true, //fill empty spots
			h: 2, //width of grid
			w: 2 
		};
		return defaults;
	},

	childContextTypes: {
		animate: React.PropTypes.bool,
		fixed: React.PropTypes.bool,
		diam: React.PropTypes.number,
		vertical: React.PropTypes.bool,
		scroll: React.PropTypes.object,
		outerWidth: React.PropTypes.number,
		outerHeight: React.PropTypes.number,
		w: React.PropTypes.number,
		h: React.PropTypes.number
	},

	getChildContext: function getChildContext() {
		// console.log(this.refs);
		return {
			animate: this.props.animate,
			fixed: this.props.fixed,
			vertical: this.props.vertical,
			scroll: this.stage,
			outerHeight: this.refs.outer ? this.refs.outer.clientHeight : 0,
			outerWidth: this.refs.outer ? this.refs.outer.clientWidth : 0,
			w: this.props.w,
			h: this.props.h,
			diam: this.getDiam()
		};
	},

	getInitialState: function getInitialState() {
		this.init(null,true);
		return {};
	},

	init: function init(props,force_scroll_reset) {
		if(this.refs && this.refs.outer){
			this.refs.outer.scrollTop = 0
		}
		this.index_array = [];
		this.max_reached = false;
		this.grid_shifts = 0;
		this.total_max_pos = 0;
		this.max_pos = 1;
		this.display_grid = [];
		this.children = [];
		this.grid = [];
		this.grid_keys = []; //array of grid children keys, used to find the grid index more efficiently.
		this.max_scroll_pos = 0; //minimum scroll position allowed.
		this.min_scroll_pos = 0; //maximum scroll position allowed.
		this.scroll_check_pos = 0;
		this.scrolling = false;
		this.check_end_interval = null;
		this.last_grid_index = 0;


		if(force_scroll_reset){
			this.stage = {
				y: 0,
				x: 0
			};
			this.scroll_pos = 0; //scroll position
			this.scroll_ppos = 0; // scroll previous position needed to check scroll
		}

		// console.log('init index array',props && props.w,props && props.h)
		this.initIndexArray(props && props.w || this.props.w ,props && props.h || this.props.h );
		
	},

	/* initialize the index array with a set width and height */
	initIndexArray: function initIndexArray(w, h) {


		for (var r = 0; r < h; r++) {
			var row = [];
			for (var c = 0; c < w; c++) {
				row[c] = -1;
			}
			this.index_array[r] = row;
		}


		this.last_grid_index = 0;
		this.min_scroll_pos = 0;

		this.greatest_index = 0;
		this.lowest_index = 0;
	},

	//diameter for positioning.
	getDiam: function getDiam() {
		if (this.refs.inner == null) return 0;

		if (this.props.fixed) {
			return null;
		} else {
			return this.refs.inner.clientWidth / this.props.w;
		}
	},

	findAdjacentSpot: function findAdjacentSpot() {
		alert('not implemented');
	},

	fillUpGrid: function fillUpGrid(props) {
		// console.log('fill up')
		var offset = props.offest || 0
		// console.log(this.children.length)
		// console.log('FILL',offset)
		for (var i = offset; i < this.children.length; i++) {
			var c = this.children[i];

			if (this.gridIndex(c) != -1) continue;
			// console.log(this.children);
			var spot = this.findFreeSpot(c.props.w, c.props.h, false,props);
			

			if (spot == null) return;
			this.fillSpot(i, spot[0], spot[1], c.props.w, c.props.h,props);
			this.addToGrid(c, spot[0], spot[1], i,props);
		}
	},

	findIndex: function findIndex(item_index) {
		var spots = [];
		for (var r = 0; r < col.length - 1; r++) {
			for (var c = 0; c < col[r].length - 1; c++) {
				if (col[r][c] == item_index) {
					spots.push([r, c]);
				}
			}
		}
	},

	/* sync props children with static child buffer array*/
	/* grid doesnt care what arrangement the prop children are in, 
 it will append to the buffer if new children are discovered and set null to buffer indecies that are not part of child props */
	// hardSyncChildren: function hardSyncChildren(new_children) {

	// 	//remove any buffer children that arent part of new children
	// 	for (var i = 0; i < this.children.length; i++) {
	// 		var c = this.children[i];
	// 		if (c == null) continue;
	// 		var found = false;
	// 		for (var j = 0; j < new_children.length; j++) {
	// 			if (c.key == new_children[j].key) {
	// 				found = true;
	// 			}
	// 		}
	// 		if (!found) this.removeChild(c);
	// 	}

	// 	//add new children that are not part of the buffer
	// 	for (var j = 0; j < new_children.length; j++) {
	// 		var n_c = new_children[j];
	// 		if (n_c == null) continue;
	// 		var found = false;
	// 		for (var i = 0; i < this.children.length; i++) {
	// 			if (this.children[i].key == n_c.key) {
	// 				found = true;
	// 			}
	// 		}
	// 		if (found == false) this.addChild(n_c);
	// 	}
	// },

	//remove child from buffer
	removeChild: function removeChild(index) {
		var child = this.children[index];
		if (child == null) throw 'cant remove child that doesnt exist.';
		this.children[index] = null;

		//we also need to check if the desynced child is part of the grid, and remove it.
		var gi = this.gridIndex(child);
		if (gi != -1) {
			var c = this.grid[gi];
			this.makeFreeSpot(c.props.r, c.props.c, c.props.w, c.props.h);
		}
	},

	//add child to buffer
	addChild: function addChild(child) {
		this.children.push(child);
	},

	/*
		do not check children against new_children 
		NOTE:
		keep in mind that if prop children are shuffled or rearranged, grid WILL break.
 	*/
	easySyncChildren: function easySyncChildren(props) {
		//	console.log("EASEY SYNC",new_children)
		// console.log("EASY SYNC",this.last_grid_index,new_children.length);
		this.children = props.children.slice(this.last_grid_index, this.last_grid_index + props.children.length);
		// console.log(this.children)
	},

	/* set the lowest and greatest indecies of the children */
	setMarkers: function setMarkers() {
		var g = null;
		var l = null;
		for (var r = 0; r < this.index_array.length; r++) {
			for (var c = 0; c < this.index_array[r].length; c++) {
				l = l == null ? this.index_array[r][c] : this.index_array[r][c] < l ? this.index_array[r][c] : l;
				g = g == null ? this.index_array[r][c] : this.index_array[r][c] > g ? this.index_array[r][c] : g;
			}
		}
		this.lowest_index = l;
		this.greatest_index = g;
	},

	/* add to grid */
	addToGrid: function addToGrid(child, r, c, index,props) {
	
		// console.log(child.props.w,child.props.h)
		var n_child = React.cloneElement(child, {
			key: child.props.key,
			show_beta: props.show_beta,
			render_beta: props.render_beta,
			animate: props.animate,
			ease_dur: props.ease_dur + Math.random()*0.3,
			w: child.props.w,
			h: child.props.h,
			end: false,
			r: r,
			c: c
		});
		this.grid.push(n_child);
		this.grid_keys.push(n_child.key);
	},

	//the final remove element from the grid index
	removeFromGrid: function removeFromGrid(child) {
		var i = this.gridIndex(child);
		if (i == -1) throw 'cant remove grid child, it does not exist';
		this.grid[i] = React.cloneElement(this.grid[i], { end: true });
	},

	/* get the grid index of a child, returning -1 if none is found */
	gridIndex: function gridIndex(child) {
		return this.grid_keys.indexOf(child.key);
	},

	/* remove any children within the passed spot boundries and set the now empty array spots to -1 */
	makeFreeSpot: function makeFreeSpot(r, c, w, h) {

		for (var n_h_i = 0; n_h_i < h; n_h_i++) {
			for (var n_w_i = 0; n_w_i < w; n_w_i++) {
				this.makeFreeSpot(r + n_h_i, c + n_w_i, 0, 0);
			}
		}

		var o_c_i = this.index_array[r][c]; //old child index
		if (o_c_i == -1) return true; //already free spot.

		var o_c = this.children[o_c_i]; //old child

		this.removeFromGrid(o_c); //remove old child from grid.

		var o_w = o_c.props.w; //old child width
		var o_h = o_c.props.h; //old child height

		var arr = this.index_array;

		var l = arr.length;

		//remove the indecies of old child in r,c position from index array

		for (var r = 0; r < l; r++) {
			var rl = arr[r].length;
			for (var c = 0; c < rl; c++) {
				if (arr[r][c] == o_c_i) {
					// //console.log("index ",o_c_i,"emptied for",r,c)
					arr[r][c] = -1;
				}
			}
		}
	},

	/* find the lowest or highest index spot on the grid */
	// findMaxIndexSpot: function findMaxIndexSpot(w, h, reverse) {

	// 	var arr = this.index_array;
	// 	var spot = [];
	// 	var l = arr.length;
	// 	var lai = null; //lowest average index


	// 	for (var r = 0; r < l; r++) {
	// 		var rl = arr[r].length;
	// 		for (var c = 0; c < rl; c++) {
	// 			var index_total = -1;
	// 			for (var h_i = 0; h_i < h && r + h_i < l; h_i++) {
	// 				for (var w_i = 0; w_i < w && c + w_i < rl; w_i++) {
	// 					index_total += arr[r + h_i][c + w_i];
	// 				}
	// 			}

	// 			if (c + w <= rl && r + h <= l && (lai == null || (reverse ? index_total > lai : index_total < lai))) {
	// 				lai = index_total;
	// 				spot = [r, c];
	// 			}
	// 		}
	// 	}

	// 	if (spot.length == 0) {
	// 		throw ' could not find lowest index spot ? ';
	// 	}

	// 	return spot;
	// },

	//find and index spot from BOTTOM to TOP
	findFreeSpot: function findFreeSpot(w, h, reverse,props) {
		// console.log(this.index_array[0][8])
		// var reverse = true
		var self = this;
		var max_r = 0;
		var min_r = 10;
		var col = this.index_array;
		var l = col.length;

		var l_min = l - min_r;
		if (l_min < 0) l_min = 0;
		function find() {
			for (var r = reverse ? l - 1 : l_min; (reverse ? r >= 0 : r < l) && (max_r ? reverse ? r >= l - max_r : r <= max_r : true /* WAT */); reverse ? r-- : r++) {
				// console.log(l,r)
				var rl = col[r].length;
				for (var c = 0; c < rl; c++) {
					if (r + h > l || c + w > rl) continue;

					var found = true;
					for (var h_i = 0; h_i < h && found == true; h_i++) {
						for (var w_i = 0; w_i < w && found == true; w_i++) {
							if (col[r + h_i][c + w_i] == -1) {
								found = true;
							} else {
								found = false;
							}
						}
					}
					if (found == true) return [r, c];
				}
			}

			if (props.fixed) return null;

			if (props.vertical) {
				var row = [];
				for (var c = 0; c < props.w; c++) {
					row.push(-1);
				}

				self.index_array.push(row);
			} else {
				for (var r = 0; r < props.h; r++) {
					col[r].push(-1);
				}
			}

			l = self.index_array.length;

			return find();
		}

		return find();
	},

	//from ANY free SPOT
	findFreeSpots: function findFreeSpots() {
		var arr = this.index_array;
		var l = arr.length;
		var spots = [];
		for (var r = 0; r < l; r++) {
			var rl = arr[r].length;
			for (var c = 0; c < rl; c++) {
				if (arr[r][c] != -1) continue;
				var h_i = 0;
				var w_i = 0;

				while (c + w_i + 1 < rl && arr[r + h_i][c + w_i + 1] == -1) {
					spots.push({
						r: r,
						c: c,
						h: h_i + 1,
						w: w_i + 1
					});
					w_i += 1;
				}

				while (r + h_i + 1 < l && arr[r + h_i + 1][c + w_i] == -1) {
					spots.push({
						r: r,
						c: c,
						h: h_i + 1,
						w: w_i + 1
					});
					h_i += 1;
				}

				spots.push({
					r: r,
					c: c,
					h: h_i + 1,
					w: w_i + 1
				});
			}
		}

		return spots;
	},

	/* add a row to the grid */
	// insertIndexRow: function(r){
	// 	if(this.props.fixed) throw 'cant add index rows to fixed index array, disable fixed index array option.'

	// 	this.grid_shifts ++;
	// 	var row = []
	// 	for(var i = 0;i<this.props.w;i++){
	// 		row.push(-1)
	// 	}
	// 	this.index_array.splice(r,row)

	// },

	/* fill spot */
	fillSpot: function fillSpot(child_i, r, c, w, h,props) {
		//	console.log('fill spot',r,c,w,h,'#'+child_i)


		var col = this.index_array;

		for (var h_i = 0; h_i < h; h_i++) {
			if (col[r + h_i] == null) throw 'fill spot error: row does not exist not empty ' + r + ',' + c + '';
			for (var w_i = 0; w_i < w; w_i++) {
				if (col[r + h_i][c + w_i] == null) throw 'fill spot error: column does not exist not empty ' + r + ',' + c + '';
				if (col[r + h_i][c + w_i] != -1) throw 'fill spot error: not empty ' + r + ',' + c + '';else col[r + h_i][c + w_i] = child_i;
				//	console.log("filled spot",r+h_i,c+w_i,"with",child_i)
			}
		}
		this.setMarkers();
		return true;
	},

	/* reset the grid, removing all state children and setting outer prop children to end their life cycle on the next update */
	resetGrid: function resetGrid(w, h) {

		this.initIndexArray(w, h);

		for (var i = 0; i < this.grid.length; i++) {
			this.grid[i] = React.cloneElement(this.grid[i], { end: true });
		}
		// this.grid = [];

		this.children = [];
	},

	/* child index */
	childIndex: function childIndex(key) {
		for (var c = 0; c < this.children.length; c++) {
			if (this.children[c].key == key) return c;
		}
		return -1;
	},

	/* fill empty spots */
	fillEmptySpots: function fillEmptySpots(props) {
		var offset = props.offset
		if (offset == null) throw 'cant fill empty spots with no offset';

		var spots = this.findFreeSpots();

		if (spots.length == 0) return;

		var spots = spots.sort(function (s1, s2) {
			if (s1.w * s2.h < s2.w * s2.h) return -1;else return 1;
		});

		/* first go back from offset and try and fill. */
		for (var i = offset; i >= 0; i--) {
			var c = this.children[i];
			if (this.gridIndex(c) != -1) continue;
			for (var j = 0; j < spots.length && found == false; j++) {
				var s = spots[j];
				if (s == null) continue;
				if (s.w == c.props.w && s.h == c.props.h) {
					//yey we found a free spot!
					this.fillSpot(i, s.r, s.c, s.w, s.h,props);
					this.addToGrid(c, s.r, s.c, i,props);
					found = true;
				}
			}
			if (found) spots = this.findFreeSpots();
		}

		//filter out nulls.
		spots = this.findFreeSpots();
		if (spots.length == 0) return;

		/*
  If we failed to fill the grid up by going back from offset, 
  go forwards from offset and if child is not in grid fill up all the way until no children remaining
  */
		//	console.log("FIND FW",spots)
		for (var i = offset; i < this.children.length; i++) {
			var c = this.children[i];
			if (this.gridIndex(c) != -1) continue;
			// //console.log('GRID INDEX OF',i,this.gridIndex(c))
			var found = false;
			for (var j = 0; j < spots.length && found == false; j++) {
				var s = spots[j];
				if (s == null) continue;
				if (s.w == c.props.w && s.h == c.props.h) {
					//yey we found a free spot!
					this.fillSpot(i, s.r, s.c, s.w, s.h,props);
					this.addToGrid(c, s.r, s.c, i,props);
					found = true;
				}
			}
			if (found) spots = this.findFreeSpots();
		}

		/*done*/
		return;
	},

	/* grid state sync has to happen before the render happens, the grid elements need to be rendered */
	componentWillUpdate: function(props, state){
		if(!Array.isArray(props.children)){
			if(props.children){
				props.children = [props.children]
			}else{
				props.children = []
			}
		}
		
		if (this.props._id != props._id || this.props.w != props.w){
			this.pause_scroll = true
			this.init(props,true);
			this.easySyncChildren(props);
			this.fillUpGrid(props);
			
				

		}

		//resync if children lengths dont match
		if(this.state.toggle_reset == true){
			this.state.toggle_reset = false
			console.log('RESET GRID')
			this.pause_scroll = true
			this.init(props,true);
			this.easySyncChildren(props);
			this.fillUpGrid(props);
		}else if (this.children.length < props.children.length) {
			console.log('LENGTH SMALLER')
			// console.log(props.children)
			this.pause_scroll = true
			this.easySyncChildren(props);
			if (props.fixed == true) {
				this.fillUpGrid(props);
				this.fillEmptySpots(props);
			} else {
				this.fillUpGrid(props);
			}
		}else if (props.children.length < this.children.length){
			this.pause_scroll = true
			// console.log('init with new screoll')
			this.init(props,true);
			this.easySyncChildren(props);
			this.fillUpGrid(props);
		}


		//if offset changed go back or forwards.
		// if (this.props.offset != props.offset && this.props.fixed) {
		// 	var d = props.offset - this.props.offset;
		// 	if (Math.abs(d) > props.max_offset) {
		// 		this.resetGrid(props.w, props.h);
		// 		// this.fillInitialGrid(props.offset);
		// 	} else if (d > 0) {
		// 		for (var i = 0; i < d; i++) {
		// 			this.goForward();
		// 		}
		// 	} else if (d < 0) {
		// 		for (var i = 0; i < d; i++) {
		// 			this.goBack();
		// 		}
		// 	}
		// 	this.fillEmptySpots(props.offset);
		// }
		// this.getMinMax();
		if (!this.props.fixed) {
			this.display_grid = this.getScrollGrid();
		}
		this.pause_scroll = false
	},

	getScrollGrid: function getScrollGrid(off) {
		// console.log('get scroll grid')

		var scroll = this.scroll_pos;
		var d = this.getDiam();
		var grid = [];
		var min_c, max_c, t_max_c;

		// console.log("GET GRID",this.grid);
		var min = scroll - this.refs.outer.clientHeight * this.props.max_grid_height_beta;
		var max = scroll + this.refs.outer.clientHeight * (this.props.max_grid_height_beta + 1);
		// var current_max = false
		for (var i = 0; i < this.grid.length; i++) {
			if (!t_max_c || c.props.r > t_max_c.props.r) {
				t_max_c = c;
			}

			var c = this.grid[i];
			var pos = c.props.r * d;

			// console.log(pos,min,max);
			if (pos <= max && pos >= min) {
				grid.push(c);
				if (!min_c || c.props.r < min_c.props.r) {
					min_c = c;
				}
				if (!max_c || c.props.r > max_c.props.r) {
					max_c = c;
				}
				// if(i == this.grid.length){
				// 	current_max = true
				// }
			} else {
				if (c.props.end != false) {
					this.removeFromGrid(c);
					grid.push(c);
				}
			}
		}

		// this.current_max = current_max;
		// console.log(max_c.props.r * d + d * max_c.props.h);
		this.max_pos = max_c ? (max_c.props.r * d + d * max_c.props.h) : 0
		this.min_scroll_pos = min_c ? min_c.props.r * d - 50 : this.min_scroll_pos;
		this.max_scroll_pos = max_c ? max_c.props.r * d + d * max_c.props.h - this.refs.outer.clientHeight : this.max_scroll_pos;
		this.total_max_pos = t_max_c ? t_max_c.props.r * d + d * t_max_c.props.h - this.refs.outer.clientHeight : this.total_max_pos;
		if (this.total_max_pos < 0) this.total_max_pos = 0;
		if (this.max_scroll_pos < 0) this.max_scroll_pos = 0;

		// if(this.props.auto){
		// 	this.max_scroll_pos = d * max_c.props.h
		// 	this.total_max_pos = d * max_c.props.h
		// }

		return grid;
	},

	// resetGridPos: function(){
	// 	this.scroll_pos = 0;
	// 	this.refs.outer.scrollTop = 0;
	// 	this.stage.y = 0
	// 	this.stage.x = 0
	// 	this.min_scroll_pos = 0
	// 	this.max_scroll_pos = 0
	// },


	onMouseWheel: function onMouseWheel(e) {
		e = e || window.event;
		if (this.scroll_pos <= this.min_scroll_pos && (e.deltaY || e.detail) < 0) {

			if (this.scrolling == true) {
				this.refs.outer.scrollTop = this.min_scroll_pos;
				if (this.refs.outer.scrollTo) this.refs.outer.scrollTo(0, this.min_scroll_pos);
				e.preventDefault();
				e.stopPropagation();
				e.returnValue = false;
			}else if(this.pause_scroll){
				e.preventDefault();
				e.stopPropagation();
				e.returnValue = false;
			}
			return false;
		}
	},

	/* 
 	update scroll position for further calculations
 	be aware that  high cpu usage may cause scroll bottlenecks 
 */
	onScroll: function onScroll(e) {
		this.scroll_pos = e.target.scrollTop;
		this.stage.y = -e.target.scrollTop;
		this.stage.x = -e.target.scrollLeft;

		if (this.scrolling == false) {
			if (this.props.onScrollStart) this.props.onScrollStart(this.scroll_pos, r_max - this.scroll_pos);
			this.scrolling = true;
		}
		if(this.pause_scroll){
			e.preventDefault();
			e.stopPropagation();
			e.returnValue = false;
			return false
		}
	},

	componentDidMount: function componentDidMount() {

		/*
  	if grid is not fixed (scrollable) we set an interval to check 
  	if the container has stopped scrolling, 
  	this is needed for updating the grid buffer
  */
		if (!this.props.fixed) this.check_end_interval = setInterval(this.checkEndScroll, 200);

		/*
  	if native scroll is true, we need to freeze container scrolling 
  	if we reach a min and also update the scroll position variable
  	the scroll position variable is used in other methods and should be up to date.
  */
		if (this.props.native_scroll == true && !this.props.fixed) {
			this.refs.outer.addEventListener('DOMMouseScroll', this.onMouseWheel, false);
			this.refs.outer.addEventListener('mousewheel', this.onMouseWheel);
			this.refs.outer.addEventListener('scroll', this.onScroll);
		}

		//check if need to update after mounting.
		if (!this.props.fixed) {
			setTimeout(function () {
				if (this.checkGridUpdate() && this.props.onUpdate && !this.props.max_reached) this.props.onUpdate();
			}.bind(this));
		}

		this.forceUpdate();
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.toggle_reset){
			this.state.toggle_reset = true
		}	
	},

	componentWillUnmount: function componentWillUnmount() {

		this.refs.outer.removeEventListener('mousewheel', this.onMouseWheel);
		this.refs.outer.removeEventListener('scroll', this.onScroll);
		clearInterval(this.check_end_interval);
	},

	/*
 	update grid check
 	-1: no update
 	0: grid needs update
 	1: needs update
 */
	checkGridUpdate: function checkGridUpdate() {
		var oh = this.refs.outer.clientHeight;
		var off = this.props.update_offset_beta;
		var scroll = this.scroll_pos;
		var min = this.min_scroll_pos;
		var max = this.max_scroll_pos;
		var total_max = this.total_max_pos;
		var ret = -1;

		if (max - scroll <= oh * off && !this.props.max_reached && max >= total_max) {
			ret = 1;
		} else if (min > -50 && scroll - min <= oh * off || max - scroll <= oh * off && max != total_max) {
			ret = 0;
		}

		// console.log('grid needs update? ',ret,'|max:',max,'|min:',min,'|pos:',scroll,'reached:',this.props.max_reached,'off',off,'oh',oh,total_max)

		return ret;
	},

	scrollTo: function scrollTo() {},

	checkEndScroll: function checkEndScroll() {
		//console.log(this.scrolling);
		if (this.scroll_check_pos == this.scroll_pos && this.scrolling == true) {
			this.scrolling = false;

			//if the grid needs more children and max has not been reached return 1 if grid just needs update return 0 else return 1
			var upd = this.checkGridUpdate();
			// console.log(upd);
			if (upd == 1) {
				if (this.props.onUpdate) this.props.onUpdate();
			} else if (upd == 0) {
				this.forceUpdate();
			}
		}
		this.scroll_check_pos = this.scroll_pos;
	},

	/* render */
	render: function render() {
		// console.log(this.refs.outer && this.refs.outer.clientHeight);
		// console.log(this.props.max_reached && this.max_scroll_pos <= this.total_max_pos,this.props.max_reached,this.max_scroll_pos,this.total_max_pos)
		// console.log('render grid count:',this.display_grid.length);
		// console.log(this.props.fixed)
		var inner_style, inner, outer_style, top_loader;

		// var load_circle_style = {
		// 	position: 'absolute',
		// 	left: 'calc( 50% - 5px )',
		// 	bottom: (this.refs.outer ? this.refs.outer.clientHeight / 4 / 2 : 0) + 'px'
		// };

		//fixed grid render options
		if (this.props.fixed) {

			//set fixed width and height property
			if (this.props.width || this.props.height) {
				outer_style = { width: this.props.width, height: this.props.height };
			}
			inner = this.grid;

			//scrollable grid render options	
		} else {
			if (this.props.vertical) {
				inner_style = {
					height: this.props.fixed ? '100%' : ( (this.max_pos + (this.props.show_loader && this.props.bottom_pad || 0) ) + 'px'),
					transform: '',
					perspective: ''
				};
			}
			var inner = React.createElement(
				'div',
				{ style: inner_style, ref: 'inner', className: '-i-grid-inner '+this.props.innerClass },
				this.display_grid,
				this.props.show_loader && React.createElement('div', { className: '-i-loader ' + (this.props.max_reached && this.max_scroll_pos >= this.total_max_pos ? '-i-loader-stop' : '')})
			);
		}

		return React.createElement(
			'div',
			{ key: this.key, ref: 'outer', style: outer_style, className: '-i-grid ' + (this.props.native_scroll ? '-i-grid-scroll' : '') + ' ' + this.props.className || this.props.c },
			this.props.pre,
			inner
		);
	}
});

module.exports.Grid = Grid
module.exports.GridMixin = Mixin





