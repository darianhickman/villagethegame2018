/**
 * Creates a new sprite sheet (Texture Atlas) from Texture Packer data that cuts an image up into
 * arbitrary sections.
 */
var TexturePackerAtlas = IgeTexture.extend({
    classId: 'TexturePackerAtlas',
    IgeSpriteSheet: true,

    init: function (atlasname,imageurl,dataurl) {

        this.dataurl = dataurl;
        this.atlasName = atlasname;
        this.atlasData = null;

        IgeTexture.prototype.init.call(this, imageurl);
    },

    /**
     * Loads the TexturePacker data and calls the original method to load the texture's image.
     * @param {String} imageUrl The image url used to load the
     * image data.
     * @private
     */
    _loadImage: function(imageUrl) {
        var self = this,
            scriptElem;

        if (typeof(self.dataurl) === 'string') {
            if (ige.isClient) {
                scriptElem = document.createElement('script');
                scriptElem.src = self.dataurl;
                scriptElem.onload = function () {
                    self.log('Texture packer data loaded, waiting for image...');
                    self.atlasData = eval(self.atlasName);
                    IgeTexture.prototype._loadImage.call(self,imageUrl);
                };
                document.getElementsByTagName('head')[0].appendChild(scriptElem);
            } else {
                this.log('URL-based Tiled data is only available client-side. If you want to load Tiled map data on the server please include the map file in your ServerConfig.js file and then specify the map\'s data object instead of the URL.', 'error');
                IgeTexture.prototype._loadImage.call(self,imageUrl);
            }
        } else {
            self.atlasData = self.dataurl;
            IgeTexture.prototype._loadImage.call(self,imageUrl);
        }
    },

    _textureLoaded: function () {

        var self = this,
            celldata;

        if (this.image) {
            // Store the cell sheet image
            this._sheetImage = this.image;

            // Load the Cell Data
            celldata = self._processData(self.atlasData);

            for (i = 0; i < celldata.length; i++) {
                self._cells[i + 1] = celldata[i];
                if (self._checkModulus) {
                    // Check cell for division by 2 modulus warnings
                    if (self._cells[i][2] % 2) {
                        self.log('This texture\'s cell definition defines a cell width is not divisible by 2 which can cause the texture to use sub-pixel rendering resulting in a blurred image. This may also slow down the renderer on some browsers. Image file: ' + this._url, 'warning', cells[i]);
                    }

                    if (_cells[i][3] % 2) {
                        self.log('This texture\'s cell definition defines a cell height is not divisible by 2 which can cause the texture to use sub-pixel rendering resulting in a blurred image. This may also slow down the renderer on some browsers. Image file: ' + this._url, 'warning', cells[i]);
                    }
                }
            }

        } else {
            // Unable to create cells from non-image texture
            this.log('Cannot create cell-sheet because texture has not loaded an image!', 'error');
        }

        IgeTexture.prototype._textureLoaded.call(this);
    },

    /**
     * Uses the Texture Packer JSON Array data to map frames to cells
     * @param data (Texture Packer JSON Array)
     * @return {Array} An array of cell bounds.
     */
    _processData: function (data) {

        var frames = [],i;

        for (i=0;i<data.frames.length;i++){

            var frame = [];
            frame[0] = data.frames[i].frame.x;
            frame[1] = data.frames[i].frame.y;
            frame[2] = data.frames[i].frame.w;
            frame[3] = data.frames[i].frame.h;
            frame[4] = data.frames[i].filename;
            frames[i] = frame;
        }

        return frames;
    },

    /**
     * Returns the total number of cells in the cell sheet.
     * @return {Number}
     */
    cellCount: function () {
        return this._cells.length;
    },

    /**
     * Returns the cell index that the passed cell id corresponds
     * to.
     * @param {String} id
     * @return {Number} The cell index that the cell id corresponds
     * to or -1 if a corresponding index could not be found.
     */
    cellIdToIndex: function (id) {

        var cells = this._cells,i;

        for (i = 1; i < cells.length; i++) {
            if (cells[i][4] === id) {
                // Found the cell id so return the index
                return i;
            }
        }

        return -1;
    },

    /**
     * Returns a string containing a code fragment that when
     * evaluated will reproduce this object.
     * @return {String}
     */
    stringify: function () {

        return "new " + this.classId() + "('" + this.url() + "', " + this._cells.toString() + ")";
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TexturePackerAtlas; }
