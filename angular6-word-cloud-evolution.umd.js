(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'd3'], factory) :
	(factory((global['angular4-word-cloud'] = {}),global.core,global.common,global.D3));
}(this, (function (exports,core,common,D3) { 'use strict';

var AgWordCloudDirective = (function () {
    /**
     * @param {?} element
     */
    function AgWordCloudDirective(element) {
        this.temp = [];
        this.color = ['#2BAAE2', '#FF6B8D', '#cecece', '#003E5D', '#22BAA0', '#cecece'];
        this.element = element;
        this.selectedElement = null;
        this.rotation = false;
        this.drag = false;
        this.pan = false;
        this.zoom = false;
        this.offset = {}
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
                return { text: d.text, size: d.size, color: d.color };
            }
            return {
                text: d.text,
                size: d.size,
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
        this.width = this.element.nativeElement.clientWidth/2
        this.height = this.element.nativeElement.clientHeight/2
        // if (!this.width) {
        //     this.width = 500 - this.options.margin.right - this.options.margin.left;
        // }
        // if (!this.height) {
        //     this.height = this.width * 0.75 - this.options.margin.top - this.options.margin.bottom;
        // }
    };
    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.buildSVG = function () {
        

        let height = this.element.nativeElement.clientHeight
        let width = this.element.nativeElement.clientWidth
        // var transform = D3.zoomIdentity.translate(200, 0).scale(1);
        this.svg = D3.select(this.element.nativeElement)
            .append('svg')
            // .attr('id', 'my-SVG')
            .attr('viewBox', '0 0 '+width+ ' ' +  height)
            .attr('id', 'my-svg')
            .attr('class', 'wordcloud-svg')
            .call(D3.zoom().scaleExtent([1, 3])
            // .call(D3.zoom().transform, D3.zoomIdentity.translate(width, height))
            .on('zoom', (e, i, f) => {
                if (D3.event.sourceEvent === null){
                    var h = f[i].children[0].children[0].getBBox().height;
                    var w = f[i].children[0].children[0].getBBox().width;
    
                    var padding = 0;
                    var transform = D3.event.transform;
    
                    var tbound = -(h-height)-padding;
                    var bbound = padding;
                    var lbound = -(w-width)-padding;
                    var rbound = padding;
    
                    var translation = [
                        Math.max(Math.min(transform.x, rbound), lbound),
                        Math.max(Math.min(transform.y, bbound), tbound)
                    ];
                    var scale = transform.k
                    console.log("Width: "+w*scale+" || Height: "+h*scale+" /// "+"Left: "+translation[0]+" || Top: "+translation[1]);
                     this.element.nativeElement.children[0].children[0]
                    .setAttributeNS(null, 'transform', 'translate(' + translation + ')scale(' + transform.k + ')')
                } else {
                    this.element.nativeElement.children[0].children[0]
                    .setAttributeNS(null, 'transform', 'translate(' + [D3.event.transform.x , D3.event.transform.y] + ')scale(' + D3.event.transform.k + ')')
                }
                
                // D3.select(this.element.nativeElement)
                //     .attr("transform", "translate(" + translation + ")" +" scale(" + transform.k + ")");
                // console.log(D3.select(this.element.nativeElement)[0]);

                // if (D3.event.sourceEvent){
                //     
                // } else {
                //     var mouse = [this.width/2 , this.height/2]
                // }
                // D3.select(this.element.nativeElement.children[0].children[0])
               

             }))
            // .on("dblclick.zoom", null)
            // .on('dblclick', (e, i, f) => {
            //     console.log(e,i,f)
            //     console.log(window.event)
            //     console.log(D3.event)
            //     if (D3.event.sourceEvent){
            //         var mouse = D3.mouse(this.element.nativeElement.children[0]);
            //     } else {
            //         console.log("D3 in else: ", D3)
            //         console.log("D3.event in else: ", D3.event)
            //         console.log("event in else: ", window.event)
            //         var mouse = [0 , 0]
            //     }
            //     D3.select(this.element.nativeElement.children[0].children[0])
            //     this.element.nativeElement.children[0].children[0]
            //     .setAttributeNS(null, 'transform', 'translate(' + [mouse[0] , mouse[1]] + ')scale(' + D3.event.transform.k + ')')
            // })
            .append('g')
            .attr('id', 'g')

            .attr('transform', 'translate(' + ~~(this.width / 2) + ',' + ~~(this.height / 2) + ')');

            this.svg.transition()
            .duration(750)
            .call(D3.zoom().transform, D3.zoomIdentity
                .translate(width, height)
                .scale(8)
                // .translate(-(+active.attr('cx')), -(+active.attr('cy')))
            )
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
        var /** @type {?} */ fontFace = 'arial';
        var /** @type {?} */ fontWeight = (this.options.settings.fontWeight == null) ? 'normal' : this.options.settings.fontWeight;
        var /** @type {?} */ spiralType = (this.options.settings.spiral == null) ? 'archimedean' : this.options.settings.spiral;
        d3.layout.cloud()
            .size([this.width, this.height])
            .words(this.temp)
            // .padding(5)
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
        // var /** @type {?} */ tooltip = D3.select(this.element.nativeElement)
        //     .append('div')
        //     .attr('class', 'wordcloud-tooltip')
        //     .style('position', 'absolute')
        //     .style('z-index', '10')
        //     .style('visibility', 'hidden')
        //     .text('a simple tooltip');
        this.svg
            .selectAll('text')
            .data(words)
            .enter()
            .append('g')
            .attr('class', 'g-word-cloud')
            .append('text')
            .style('cursor', 'move')
            .style('-webkit-user-select', 'none')
            .style('-moz-user-select', 'none')
            .style('-ms-user-select', 'none')
            .style('user-select', 'none')
            .style('font-family', 'arial')
            .attr('id', 'wordCloudSVG')
            .style('font-size', function (d) { return d.size + 'px'; })
            .style('fill', function (d, i) {
            return d.color;
        })
            .attr('mdTooltip', 'ddd')
            .attr('text-anchor', 'middle')
            .attr('x', function(d) {return d.x})
            .attr('y', function(d) {return d.y})
            .attr('transform', function (d) { return 'rotate(' + [d.rotate, d.x, d.y] + ')'; })
            .attr('class', 'word-cloud draggable')
            .on('mousedown', function(e, i, f){
                if (f[i].classList.contains('draggable')) {
                    if (D3.event){
                        D3.event.stopPropagation();
                    }
                    f[i].classList.add('selected-svg')
                    var event = window.event;
                    // console.log(event)
                    // event.preventDefault()

                    // console.log(D3.event)
                    // D3.event.preventDefault()
                    this.selectedElement = f[i];
                    this.offset = getMousePosition(e, f[i]);
                    this.offset.x -= parseFloat(this.selectedElement.getAttributeNS(null, "x"));
                    this.offset.y -= parseFloat(this.selectedElement.getAttributeNS(null, "y"));
                }

                function getMousePosition(e, f) {
                    var CTM = null;
                    var event = window.event;
                    if (e.rotate === 90){
                        var pt = f.nearestViewportElement.createSVGPoint();
                        pt.x = event.clientX;
                        pt.y = event.clientY;
                        var globalPoint = pt.matrixTransform(f.nearestViewportElement.getScreenCTM().inverse());
                        var globalToLocal = f.nearestViewportElement.getScreenCTM().inverse().multiply(f.getScreenCTM()).inverse();
                        var inObjectSpace = globalPoint.matrixTransform( globalToLocal );
                        return {
                            x: inObjectSpace.x,
                            y: inObjectSpace.y
                            };
                    } else {
                        CTM = f.getScreenCTM();
                        return {
                        x: (event.clientX - CTM.e) / CTM.a,
                        y: (event.clientY - CTM.f) / CTM.d
                        };
                    }
                }
            })
            .on('mousemove', function(e, i, f){
                if (this.selectedElement) {
                    // if (D3.event.sourceEvent){
                    //     D3.event.sourceEvent.stopPropagation();
                    // }
                    var coord = getMousePosition(e, f[i]);
                    this.selectedElement.setAttributeNS(null, "x", coord.x - this.offset.x);
                    this.selectedElement.setAttributeNS(null, "y", coord.y - this.offset.y);
                  }
                  
                  function getMousePosition(e, f) {
                    var CTM = null;
                    var event = window.event;
                    if (e.rotate === 90){
                        var pt = f.nearestViewportElement.createSVGPoint();
                        pt.x = event.clientX;
                        pt.y = event.clientY;
                        var globalPoint = pt.matrixTransform(f.nearestViewportElement.getScreenCTM().inverse());
                        var globalToLocal = f.nearestViewportElement.getScreenCTM().inverse().multiply(f.getScreenCTM()).inverse();
                        var inObjectSpace = globalPoint.matrixTransform( globalToLocal );
                        return {
                            x: inObjectSpace.x,
                            y: inObjectSpace.y
                            };
                    } else {
                        CTM = f.getScreenCTM();
                        return {
                        x: (event.clientX - CTM.e) / CTM.a,
                        y: (event.clientY - CTM.f) / CTM.d
                        };
                    }
                }
            })
            .on('mouseup', function(e, i, f){
                if (D3.event.sourceEvent){
                    D3.event.sourceEvent.stopPropagation();
                }
                f[i].classList.remove('selected-svg');
                this.selectedElement = null
            })
            .on('mouseleave', function(e, i, f){
                if (D3.event.sourceEvent){
                    D3.event.sourceEvent.stopPropagation();
                }
                f[i].classList.remove('selected-svg');
                this.selectedElement = null
            })
            .on('dblclick', function(e, i, f){
                if (D3.event){
                    D3.event.stopPropagation();
                }
                if (e.rotate === 90){
                    var bb = f[i].getBBox();
                    var cx = bb.x + bb.width/2;
                    var cy = bb.y + bb.height/2;

                    var animation = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform")
                    animation.setAttributeNS(null, "attributeName", "transform");
                    animation.setAttributeNS(null, "attributeType", "XML");
                    animation.setAttributeNS(null, "type", "rotate");
                    animation.setAttributeNS(null, "dur", "0.5s");
                    animation.setAttributeNS(null, "additive", "sum")
                    animation.setAttributeNS(null, "fill", "freeze")
                    animation.setAttributeNS(null, "from", "90 "+cx+" "+cy);
                    animation.setAttributeNS(null, "to", "0 "+cx+" "+cy);

                    f[i].appendChild(animation);
                    f[i].getBoundingClientRect();
                    f[i].setAttributeNS(null, 'transform', f[i].getAttributeNS(null, 'transform') +'rotate(' + [-90, f[i].getAttributeNS(null, 'x'), f[i].getAttributeNS(null, 'y')] + ')')
                    animation.beginElement();                
                    e.rotate = 0;
                }
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

    /**
     * @return {?}
     */
    AgWordCloudDirective.prototype.rotate = function () {

    }
    return AgWordCloudDirective;
}());
AgWordCloudDirective.decorators = [
    { type: core.Directive, args: [{ selector: 'div[AgWordCloud]', exportAs: 'ag-word-cloud' },] },
];
/**
 * @nocollapse
 */
AgWordCloudDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
]; };
AgWordCloudDirective.propDecorators = {
    'wordData': [{ type: core.Input },],
    'color': [{ type: core.Input },],
    'options': [{ type: core.Input },],
    'width': [{ type: core.Input },],
    'height': [{ type: core.Input },],
    'rotation': [{ type: core.Input },],
    'drag': [{ type: core.Input },],
    'pan': [{ type: core.Input },],
    'zoom': [{ type: core.Input },]
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
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
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

exports.AgWordCloudModule = AgWordCloudModule;
exports.AgWordCloudDirective = AgWordCloudDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
