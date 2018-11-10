import { Directive, ElementRef, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { select } from 'd3';

var AgWordCloudDirective = (function () {
    /**
     * @param {?} element
     */
    function AgWordCloudDirective(element) {
        this.temp = [];
        this.color = ['#2BAAE2', '#FF6B8D', '#cecece', '#003E5D', '#22BAA0', '#cecece'];
        this.element = element;
    }
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.ngOnInit = function () {
        this.update();
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.roundNumber = function () {
        var _this = this;
        var /** @type {?} */ temp = this.wordData.map(function (d) {
            if (d.color) {
                return { text: d.text, size: _this.scale(d.size), color: d.color };
            }
            return {
                text: d.text,
                size: _this.scale(d.size),
                color: _this.color[Math.floor(Math.random() * _this.color.length)]
            };
        });
        this.temp.length = 0;
        (_a = this.temp).push.apply(_a, temp);
        var _a;
    };
    /**
     * @param {?} inputY
     * @return {?}
     */
    AgWordCloudDirective.prototype.scale = function (inputY) {
        var /** @type {?} */ x = inputY - this.old_min;
        var /** @type {?} */ y = this.old_max - this.old_min;
        var /** @type {?} */ percent = x / y;
        return percent * (50 - 10) + 10;
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.updateMaxMinValues = function () {
        var _this = this;
        this.old_min = Number.MAX_VALUE;
        this.old_max = Number.MIN_VALUE;
        this.wordData.map(function (res) {
            if (res.size < _this.old_min) {
                _this.old_min = res.size;
            }
            if (res.size > _this.old_max) {
                _this.old_max = res.size;
            }
        });
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.setup = function () {
        if (!this.width) {
            this.width = 500 - this.options.margin.right - this.options.margin.left;
        }
        if (!this.height) {
            this.height = this.width * 0.75 - this.options.margin.top - this.options.margin.bottom;
        }
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.buildSVG = function () {
        this.svg = select(this.element.nativeElement)
            .append('svg')
            .attr('class', 'wordcloud-svg')
            .attr('width', this.width + this.options.margin.left + this.options.margin.right)
            .attr('height', this.height + this.options.margin.top + this.options.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + ~~(this.width / 2) + ',' + ~~(this.height / 2) + ')');
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.populate = function () {
        var _this = this;
        if (this.svg) {
            this.svg.selectAll('*').remove();
        }
        this.updateMaxMinValues();
        this.roundNumber();
        var /** @type {?} */ fontFace = (this.options.settings.fontFace == null) ? 'Roboto' : this.options.settings.fontFace;
        var /** @type {?} */ fontWeight = (this.options.settings.fontWeight == null) ? 'normal' : this.options.settings.fontWeight;
        var /** @type {?} */ spiralType = (this.options.settings.spiral == null) ? 'archimedean' : this.options.settings.spiral;
        d3.layout.cloud()
            .size([this.width, this.height])
            .words(this.temp)
            .padding(5)
            .rotate(function () { return (~~(Math.random() * 2) * 90); })
            .font(fontFace)
            .fontWeight(fontWeight)
            .fontSize(function (d) { return (d.size); })
            .spiral(spiralType)
            .on('end', function () {
            _this.drawWordCloud(_this.temp);
        })
            .start();
    };
    /**
     * @param {?} words
     * @return {?}
     */
    AgWordCloudDirective.prototype.drawWordCloud = function (words) {
        var _this = this;
        var /** @type {?} */ self = this;
        var /** @type {?} */ tooltip = select(this.element.nativeElement)
            .append('div')
            .attr('class', 'wordcloud-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .text('a simple tooltip');
        this.svg
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', function (d) { return d.size + 'px'; })
            .style('fill', function (d, i) {
            return d.color;
        })
            .attr('mdTooltip', 'ddd')
            .attr('text-anchor', 'middle')
            .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'; })
            .attr('class', 'word-cloud')
            .on('mouseover', function (d, i) {
            return _this.options.labels ? tooltip.style('visibility', 'visible').text('Size: ' + self.getWordSize(d.text)) : tooltip.style('display', 'none');
        })
            .on('mouseout', function () {
            return tooltip.style('visibility', 'hidden');
        })
            .text(function (d) {
            return d.text;
        });
    };
    /**
     * @param {?} word
     * @return {?}
     */
    AgWordCloudDirective.prototype.getWordSize = function (word) {
        var /** @type {?} */ indexOfWord = this.wordData.findIndex(function (i) { return i.text === word; });
        if (indexOfWord === -1)
            return 0;
        return this.wordData[indexOfWord].size;
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.update = function () {
        this.removeElementsByClassName('wordcloud-svg');
        this.removeElementsByClassName('wordcloud-tooltip');
        this.setup();
        this.buildSVG();
        this.populate();
    };
    /**
     * @param {?} classname
     * @return {?}
     */
    AgWordCloudDirective.prototype.removeElementsByClassName = function (classname) {
        var /** @type {?} */ elements = this.element.nativeElement.getElementsByClassName(classname);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    };
    return AgWordCloudDirective;
}());
AgWordCloudDirective.decorators = [
    { type: Directive, args: [{ selector: 'div[AgWordCloud]', exportAs: 'ag-word-cloud' },] },
];
/**
 * @nocollapse
 */
AgWordCloudDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
AgWordCloudDirective.propDecorators = {
    'wordData': [{ type: Input },],
    'color': [{ type: Input },],
    'options': [{ type: Input },],
    'width': [{ type: Input },],
    'height': [{ type: Input },],
};

var AgWordCloudModule = (function () {
    function AgWordCloudModule() {
    }
    /**
     * @return {?}
     */
    AgWordCloudModule.forRoot = function () {
        return {
            ngModule: AgWordCloudModule
        };
    };
    return AgWordCloudModule;
}());
AgWordCloudModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    AgWordCloudDirective
                ],
                exports: [
                    AgWordCloudDirective
                ]
            },] },
];
/**
 * @nocollapse
 */
AgWordCloudModule.ctorParameters = function () { return []; };

export { AgWordCloudModule, AgWordCloudDirective };
