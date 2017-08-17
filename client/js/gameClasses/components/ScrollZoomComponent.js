var ScrollZoomComponent = IgeEventingClass.extend({
	classId: 'ScrollZoomComponent',
	componentId: 'scrollZoom',
		
	init: function (entity, options) {
		var self = this;
		this._entity = entity;
		this._enabled = false;
		this.scrollScale = 1.0;

		this._options = {
			scaleMin: parseFloat(GameConfig.config['scaleMin']),
			scaleMax: parseFloat(GameConfig.config['scaleMax']),
			scaleStep: 0.05,
			zoomLevels: parseInt(GameConfig.config['zoomLevels'])
		};
		this.currentZoomLevel = this._options.zoomLevels;

		for (i in options) {
			this._options[i] = options[i];
		}

		ige.input.on('mouseWheel', function (event) { self._handleMouseWheel(event); });
		document.getElementById("igeFrontBuffer").addEventListener('mousewheel', function(e) {
			e.preventDefault();
			return false;
		}, false);
	},

	enabled: function (val) {
		if (val !== undefined) {
			this._enabled = val;
			return this._entity;
		}
		return this._enabled;
	},

	_handleMouseWheel: function(event) {
		if (this._enabled) {
			var newScrollScale;
			if (event.wheelDelta > 0) {
				newScrollScale = this._getScrollScaleForZoomDirection("up");
			} else if (event.wheelDelta < 0) {
				newScrollScale = this._getScrollScaleForZoomDirection("down");
			}
			this.scrollScale = newScrollScale;

			if (this._entity.scaleToPoint) // use this nicer zoom if available
				this._entity.scaleToPoint.scaleTo(newScrollScale, newScrollScale, event.igeX, event.igeY);
			else
				this._entity.camera.scaleTo(newScrollScale, newScrollScale, 0);

			if (this._entity.limitZoomPan)
				this._entity.limitZoomPan._limitPanToWindow(this._entity);
		}
	},

	_handleManualZoom: function(direction){
		var newScrollScale;
		if (direction === "in") {
			newScrollScale = this._getScrollScaleForZoomDirection("up");
		} else if (direction === "out") {
			newScrollScale = this._getScrollScaleForZoomDirection("down");
		}
		this.scrollScale = newScrollScale;

		if (this._entity.scaleToPoint) // use this nicer zoom if available
			this._entity.scaleToPoint.scaleTo(newScrollScale, newScrollScale, ige._canvasPosition().width / 2, ige._canvasPosition().height / 2);
		else
			this._entity.camera.scaleTo(newScrollScale, newScrollScale, 0);

		if (this._entity.limitZoomPan)
			this._entity.limitZoomPan._limitPanToWindow(this._entity);
	},

	_getScrollScaleForZoomDirection: function(direction) {
		var limitX = this._entity.limitZoomPan._getLimitX(this._entity, this._options.scaleMin);
		var step = (this._options.scaleMax - limitX) / (this._options.zoomLevels - 1);
		if(this._options.zoomLevels === 1)
			return this._options.scaleMax;
		if(direction === "up") {
			if(this.currentZoomLevel === this._options.zoomLevels)
				return this._options.scaleMax;
			this.currentZoomLevel++;
			return limitX + (this.currentZoomLevel - 1) * step;
		} else if(direction === "down") {
			if(this.currentZoomLevel === 1)
				return limitX;
			this.currentZoomLevel--;
			return limitX + (this.currentZoomLevel - 1) * step;
		}
	}
});