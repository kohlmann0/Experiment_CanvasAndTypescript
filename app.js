/*
To anyone reading this:
The starting point of anything you want to use is the window.onload functions at the bottom.
There are several different versions as I progressed through different things I added. Most recent is at the top.

I am using this as kind of a test bed to learn Typescript, but also as a way to learn HTLM<Canvas>.
You'll see a few experiments specifically dedicated to Typescript Inheritence, and a few specifically dedicated to Canvas drawing functions.

I would not call any of it "Production Code" (I'm not sure what front end best practices are), but I've tried to keep it fairly well organized.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Canvas, and all my custom drawing methods.
var BaseCanvas = /** @class */ (function () {
    function BaseCanvas(element, window) {
        this.element = element;
        this.context = this.element.getContext("2d");
        this.width = element.width = window.innerWidth;
        this.height = element.height = window.innerHeight;
        console.log("Canvas Width: " + this.width + " | Canvas Height: " + this.height);
    }
    BaseCanvas.prototype.DrawPointToPoint = function (startPoint, stopPoint) {
        this.context.beginPath();
        this.context.moveTo(startPoint.x, startPoint.y);
        this.context.lineTo(stopPoint.x, stopPoint.y);
        this.context.stroke();
    };
    BaseCanvas.prototype.DrawLine = function (line) {
        this.DrawPointToPoint(line.startPoint, line.stopPoint);
    };
    BaseCanvas.prototype.DrawRandomLine = function (index) {
        var startPoint = new Point(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
        var stopPoint = new Point(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
        this.DrawPointToPoint(startPoint, stopPoint);
    };
    BaseCanvas.prototype.DrawContinuousLine = function (points) {
        var lengthOfArray = points.length;
        if (lengthOfArray > 1) {
            for (var i = 1; i < lengthOfArray; i++) {
                this.DrawPointToPoint(points[i - 1], points[i]);
            }
        }
    };
    BaseCanvas.prototype.DrawClosedLine = function (points) {
        this.DrawContinuousLine(points);
        this.DrawPointToPoint(points[points.length - 1], points[0]);
    };
    BaseCanvas.prototype.DrawShape = function (shape) {
        this.DrawClosedLine(shape.points);
    };
    // This uses default parameters
    BaseCanvas.prototype.DrawCircle = function (x, y, radius, outline, fillStyle) {
        if (outline === void 0) { outline = true; }
        if (fillStyle === void 0) { fillStyle = ""; }
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2);
        //console.log("outline = " + outline);
        //console.log("fillcolor = " + fillStyle);
        if (outline && outline == true) {
            this.context.stroke();
        }
        if (fillStyle && fillStyle.length > 0) {
            this.context.fillStyle = fillStyle;
            this.context.fill();
        }
    };
    BaseCanvas.prototype.DrawGradientCircle = function (x, y, radius, baseColor, innerGradientColor, outline) {
        // So the interesting thing about a gradient, is that it's not really an "Object", like stroking a circle or whatever, drawing directly on the canvas...
        // It is actually a "Fill Style" for a rectangle, and then you fill the rectangle.
        // Picture it like, instead of drawing a circle on the page, think of it as dropping paint on a sheet of paper (the rectangle), and then laying that paper on the canvas.
        if (innerGradientColor === void 0) { innerGradientColor = new Color(255, 255, 255, 1); }
        if (outline === void 0) { outline = false; }
        var gradientXCenter = x - (.25 * radius); // for testing now, just do a fixed gradient location (.25R). May Change later.
        var gradientYCenter = y - (.25 * radius);
        console.log("True Center Center: (" + x + "," + y + ")");
        console.log("Gradient Center: (" + gradientXCenter + "," + gradientYCenter + ")");
        var circle = this.context.createRadialGradient(gradientXCenter, gradientYCenter, 0, x, y, radius);
        var finalGradientColor = baseColor.MixColor(innerGradientColor);
        console.log("Base: " + baseColor.ToRGBAString());
        console.log("Gradient:" + innerGradientColor.ToRGBAString());
        console.log("Mixed:" + finalGradientColor.ToRGBAString());
        circle.addColorStop(0, finalGradientColor.ToRGBAString());
        circle.addColorStop(.98, baseColor.ToRGBAString(1));
        circle.addColorStop(1, baseColor.ToRGBAString(0));
        // Always draw the circle
        this.context.fillStyle = circle;
        this.context.fillRect(0, 0, this.width, this.height);
        // draw the outline if needed
        if (outline && outline == true) {
            this.DrawCircle(x, y, radius, true);
        }
    };
    BaseCanvas.prototype.WriteText = function (text, x, y, font, fillstyle, outlineOnly) {
        if (outlineOnly === void 0) { outlineOnly = false; }
        this.context.font = '48px serif';
        if (outlineOnly) {
            this.context.strokeText(text, x, y);
        }
        else {
            this.context.fillStyle = fillstyle; // Reminder, you have to give it a fill style, before you try to do a fill text. MDN does not mention that.
            this.context.fillText(text, x, y);
        }
        //var textlength = this.context.measureText(text); // TextMetrics object
        //console.log("textWidth: " + textlength.width); // measures the width of the text... assuming it's in pixels?
    };
    BaseCanvas.prototype.DrawSprite = function (sprite, centerX, centerY, columnIndex, rowIndex, scale) {
        if (rowIndex === void 0) { rowIndex = 0; }
        if (scale === void 0) { scale = 1; }
        console.log("loaded: " + sprite.Loaded);
        console.log("centerX: " + centerX);
        console.log("centerY: " + centerY);
        console.log("columnIndex: " + columnIndex);
        console.log("rowIndex: " + rowIndex);
        console.log("scale: " + scale);
        var shiftedX = centerX - (sprite.width / 2);
        var shiftedY = centerY - (sprite.height / 2);
        var scaledWidth = sprite.width * scale;
        var scaledHeight = sprite.height * scale;
        console.log("shiftedX: " + shiftedX);
        console.log("shiftedY: " + shiftedY);
        console.log("scaledWidth: " + scaledWidth);
        console.log("scaledHeight: " + scaledHeight);
        this.context.drawImage(sprite.imageFile, sprite.FrameX(columnIndex, rowIndex), sprite.FrameX(columnIndex, rowIndex), sprite.width, sprite.height, shiftedX, shiftedY, scaledWidth, scaledHeight);
    };
    return BaseCanvas;
}());
// Class progression
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.ToLogString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    return Point;
}());
var Line = /** @class */ (function () {
    function Line(startPoint, stopPoint) {
        this.startPoint = startPoint;
        this.stopPoint = stopPoint;
    }
    Line.prototype.ToLogString = function () {
        return this.startPoint.ToLogString() + "|" + this.stopPoint.ToLogString();
    };
    return Line;
}());
var Shape = /** @class */ (function () {
    function Shape(points) {
        this.points = points;
    }
    Shape.prototype.ToLogString = function () {
        var outputString = "";
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point = _a[_i];
            outputString += "|" + point.ToLogString();
        }
        return outputString.substring(1);
    };
    return Shape;
}());
// Inheritance
// extends is the keyword here
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(width, height, centerPoint) {
        var _this = this;
        // Draw clockwise from upper left corner
        var upperLeft = new Point(centerPoint.x - width / 2, centerPoint.y - height / 2);
        var upperRight = new Point(centerPoint.x + width / 2, centerPoint.y - height / 2);
        var lowerLeft = new Point(centerPoint.x - width / 2, centerPoint.y + height / 2);
        var lowerRight = new Point(centerPoint.x + width / 2, centerPoint.y + height / 2);
        var pointList = [upperLeft, upperRight, lowerRight, lowerLeft];
        // Super is the key word here
        _this = _super.call(this, pointList) || this;
        return _this;
    }
    Rectangle.prototype.ToLogString = function () {
        // Super is the keyword here
        var outputString = "Rectangle: " + _super.prototype.ToLogString.call(this);
        return outputString;
    };
    return Rectangle;
}(Shape));
var Dot = /** @class */ (function () {
    function Dot(centerPoint, radius) {
        this.centerPoint = centerPoint;
        this.radius = radius;
    }
    return Dot;
}());
var Color = /** @class */ (function () {
    /// 0 to 255 per channel type (0 is Black, 255 is White, or max channel)
    function Color(redChannel, greenChannel, blueChannel, alphaChannel) {
        if (alphaChannel === void 0) { alphaChannel = 1; }
        this.r = Math.max(Math.min(redChannel, 255), 0);
        this.g = Math.max(Math.min(greenChannel, 255), 0);
        this.b = Math.max(Math.min(blueChannel, 255), 0);
        this.a = Math.max(Math.min(alphaChannel, 1), 0);
    }
    Color.prototype.ToRGBAString = function (a) {
        var output = "rgba(" + this.r + "," + this.g + "," + this.b + ",";
        if (a === null || a === undefined) {
            output += this.a;
        }
        else {
            output += a;
        }
        output += ")";
        return output;
    };
    Color.prototype.ToRGBString = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + ")";
    };
    Color.prototype.MixColor = function (alternateColor) {
        // Attempt Number 1 (gets the job done for now)
        var alphaRatio = this.a / (this.a + alternateColor.a);
        var alphaCannel = (this.a * alphaRatio + alternateColor.a * (1 - alphaRatio));
        var newRedChannel = (this.r * alphaRatio + alternateColor.r * (1 - alphaRatio));
        var newGreenChannel = (this.g * alphaRatio + alternateColor.g * (1 - alphaRatio));
        var newBlueChannel = (this.b * alphaRatio + alternateColor.b * (1 - alphaRatio));
        //console.log("Alpha: " + alphaRatio);
        //console.log("newRedChannel: " + newRedChannel);
        //console.log("newGreenChannel: " + newGreenChannel);
        //console.log("newBlueChannel: " + newBlueChannel);
        //return new Color(newRedChannel, newGreenChannel, newBlueChannel, alphaCannel); // Mix Alpha Channels
        return new Color(newRedChannel, newGreenChannel, newBlueChannel, this.a); // Keep the base transparency
        // Also recommened "Lab Space" conversion
        //https://stackoverflow.com/questions/649454/what-is-the-best-way-to-average-two-colors-that-define-a-linear-gradient
        //https://stackoverflow.com/questions/398224/how-to-mix-colors-naturally-with-c
        //https://en.wikipedia.org/wiki/CIELAB_color_space
        //https://stackoverflow.com/questions/726549/algorithm-for-additive-color-mixing-for-rgb-values
        // AltTrial =SQRT(r^2*alphaRatio + r^2*(1-alphaRatio))
    };
    return Color;
}());
var Sprite = /** @class */ (function () {
    function Sprite(source, numberOfRows, numberOfColumns) {
        var _this = this;
        this.Loaded = false;
        this.imageFile = new Image();
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
        this.imageFile.addEventListener('load', function () {
            _this.totalWidth = _this.imageFile.width;
            _this.totalHeight = _this.imageFile.height;
            _this.width = _this.totalWidth / numberOfColumns;
            _this.height = _this.totalHeight / numberOfRows;
            _this.Loaded = true;
            console.log("Loaded: " + source);
        }, false);
        this.imageFile.src = source;
    }
    Sprite.prototype.SourceCoordinates = function (columnIndex, rowIndex, scale) {
        if (rowIndex === void 0) { rowIndex = 0; }
        var output;
        output[0] = this.FrameX(columnIndex, rowIndex);
        output[1] = this.FrameY(columnIndex, rowIndex);
        output[2] = this.width;
        output[3] = this.height;
        return output;
    };
    // 0 based index
    Sprite.prototype.FrameX = function (columnIndex, rowIndex) {
        if (rowIndex === void 0) { rowIndex = 0; }
        return this.width * columnIndex;
    };
    // 0 based index
    Sprite.prototype.FrameY = function (columnIndex, rowIndex) {
        if (rowIndex === void 0) { rowIndex = 0; }
        return this.height * rowIndex;
    };
    return Sprite;
}());
var LoadManager = /** @class */ (function () {
    function LoadManager(func) {
        this.onLoadCallbackFunction = func;
    }
    LoadManager.prototype.AllObjectsLoaded = function () {
        if (this.sprites != undefined && this.sprites != undefined) {
            for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                var sprite = _a[_i];
                var obj = sprite;
                if (sprite.Loaded == false) { //  Why the F can't I cast it within the If or the For loop. It's fucking rediculous.
                    return false;
                }
            }
            console.log("All Objects Loaded");
            return true;
        }
        else {
            console.log("All Objects Loaded");
            return true;
        }
    };
    LoadManager.prototype.WaitForAllObjectsLoaded = function () {
        if (this.AllObjectsLoaded()) {
            this.onLoadCallbackFunction;
        }
        else {
            // Wait a tic
        }
    };
    return LoadManager;
}());
// Static Helper Functions
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function tempDrawImage(canvas, img, scaleFactor) {
    //let width = img.width;
    //let height = img.height;
    if (scaleFactor === void 0) { scaleFactor = 1; }
    canvas.context.drawImage(img, 100, 100, img.width * scaleFactor, img.height * scaleFactor);
}
;
// // Slicing a sprite sheet
// // Having trouble figuring out how to wait until all the fiels are loaded, before attempting to draw them.
// window.onload = function () {
//     let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//     let loadManager: LoadManager = new LoadManager(function () { console.log("CallbackFunction was called"); })
//     loadManager.sprites.push(new Sprite('Images/coin-sprite-animation-sprite-sheet.png', 1, 10));
//     loadManager.AllObjectsLoaded();
//     //let sprite: Sprite = new Sprite('Images/coin-sprite-animation-sprite-sheet.png', 1, 10);
//     //canvas.DrawSprite(sprite, 100, 100, 0, 0, 1);
// };
//// Displaying real images (ie. maybe a sprite sheet or an icon, or some other png or jpg or something.)
//// (Works, moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let img = new Image();
//    // If you try to call drawImage() before the image has finished loading, it won't do anything (or, in older browsers, may even throw an exception). 
//    // So you need to be sure to use the load event so you don't try this before the image has loaded:
//    img.addEventListener('load', function () {
//        // execute drawImage statements here
//        tempDrawImage(canvas, img, .25);
//    }, false);
//    // If you're only using one external image this can be a good approach, but once you need to track more than one we need to resort to something more clever. 
//    // It's beyond the scope of this tutorial to look at image pre-loading tactics, but you should keep that in mind.
//    img.src = 'Images/coin-sprite-animation-sprite-sheet.png'; // Set source path
//};
// Fun with Gradients. Random balls again, but this time, with gradients (works pretty awesome, moving on.)
// Adding Text to the display (works, moving on)
window.onload = function () {
    var canvas = new BaseCanvas(document.getElementById("canvas"), window);
    var numberOfDots = randomIntFromInterval(1, 20); //(20 to 100)    
    // Clip gives it a fun border
    canvas.context.rect(50, 50, canvas.width - 100, canvas.height - 100);
    canvas.context.stroke();
    canvas.context.clip();
    console.log("numberOfDots = " + numberOfDots);
    for (var i = 0; i < numberOfDots; i++) {
        var centerPoint = new Point(randomIntFromInterval(10, canvas.width) - 10, randomIntFromInterval(10, canvas.height - 10));
        var dot = new Dot(centerPoint, randomIntFromInterval(10, 100));
        var baseColor = new Color(randomIntFromInterval(0, 200), randomIntFromInterval(0, 200), randomIntFromInterval(0, 200), 1); // Solid Color of the "Ball""
        var gradientColor = new Color(255, 255, 255, .5); // Color of the "Light"
        canvas.DrawGradientCircle(dot.centerPoint.x, dot.centerPoint.y, dot.radius, baseColor, gradientColor, true);
    }
    var textString = numberOfDots + " Balls";
    canvas.context.font = '48px serif';
    canvas.context.fillStyle = 'rgba(0,0,0,1)'; // Reminder, you have to give it a fill style, before you try to do a fill text. MDN does not mention that.
    canvas.context.fillText(textString, 100, 200);
    canvas.context.strokeText(textString, 100, 200);
    var text = canvas.context.measureText(textString); // TextMetrics object
    console.log("textWidth: " + text.width); // measures the width of the text... assuming it's in pixels?
};
//// What is an SVG path? (Seems to work, moving on)
//// Seem to be vector based rather than point to point.
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let p = new Path2D('M10 10 h 80 v 80 h -80 Z');
//    //The path will move to point (M10 10) and then move horizontally 80 points to the right (h 80), then 80 points down (v 80), then 80 points to the left (h -80), and then back to the start (z). 
//    canvas.context.stroke(p);
//};
//// Path2D objects -- This caches the drawing path as an object to speed up things This works pretty well. First pass seems a little slow, but was quick every time after that. Moving on, will continue to use.)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let rectangle: Path2D = new Path2D();
//    rectangle.rect(10, 10, 50, 50);
//    let circle: Path2D = new Path2D();
//    circle.moveTo(125, 35);
//    circle.arc(120, 35, 25, 0, 2 * Math.PI);
//    canvas.context.stroke(rectangle);
//    canvas.context.fill(circle);    
//};
//// Curves [Direct Copy and Paste] (This works, but not easy. Moving on.)
//    // These fuckers are tough... I don't know how you plan those out to get exactly what you want... how do you know what control point to use, etc.
//// cp is the control point, ep is the next end point, staring from the current position.
//// quadraticCurveTo(cp1x, cp1y,   epx, epy) (single control point in the middle)
//// bezierCurveTo(cp1x, cp1y, cp2x, cp2y,   epx, epy) two control points to give "tangents"
//// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#Bezier_and_quadratic_curves
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    //canvas.context.beginPath();
//    //canvas.context.moveTo(75, 25);
//    //canvas.context.quadraticCurveTo(25, 25, 25, 62.5);
//    //canvas.context.quadraticCurveTo(25, 100, 50, 100);
//    //canvas.context.quadraticCurveTo(50, 120, 30, 125);
//    //canvas.context.quadraticCurveTo(60, 120, 65, 100);
//    //canvas.context.quadraticCurveTo(125, 100, 125, 62.5);
//    //canvas.context.quadraticCurveTo(125, 25, 75, 25);
//    //canvas.context.stroke();
//    canvas.context.beginPath();
//    canvas.context.moveTo(75, 40);
//    canvas.context.bezierCurveTo(75, 37, 70, 25, 50, 25);
//    canvas.context.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
//    canvas.context.bezierCurveTo(20, 80, 40, 102, 75, 120);
//    canvas.context.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
//    canvas.context.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
//    canvas.context.bezierCurveTo(85, 25, 75, 37, 75, 40);
//    canvas.context.fill();
//};
//// ArcTo is REALLY weird. Bascially you make an angle out of three points... and then add an arc tangent to each side, with a specific radius (Good enough, moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    canvas.context.beginPath();
//    canvas.context.moveTo(50, 20); //red
//    canvas.context.arcTo(150, 20, 100, 70, 20); //blue/green
//    canvas.context.stroke();
//    canvas.DrawCircle(50, 20, 2, false, 'red')
//    canvas.DrawCircle(150, 20, 2, false, 'blue')
//    canvas.DrawCircle(100, 70, 2, false, 'green')
//    //canvas.DrawPointToPoint(new Point(50, 20), new Point(150, 20)); // uncomment me to see the tangent lines
//    //canvas.DrawPointToPoint(new Point(150, 20), new Point(100, 70));
//};
////Totally Random / Also trying the Clip function (Good enough, moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let numberOfDots: number = randomIntFromInterval(20, 50); //(20 to 100)    
//    // Also trying a thing with the "clip" function -- Stroke a regular rectangle, and then "Clip" it. Everything outside of it, drawn afterwards, will be dropped.
//    canvas.context.rect(50, 50, canvas.width - 100, canvas.height - 100);
//    canvas.context.stroke();
//    canvas.context.clip();
//    console.log("numberOfDots = " + numberOfDots)
//    for (let i: number = 0; i < numberOfDots; i++) {
//        let centerPoint: Point = new Point(randomIntFromInterval(10, canvas.width) - 10, randomIntFromInterval(10, canvas.height - 10))
//        let dot: Dot = new Dot(centerPoint, randomIntFromInterval(10, 100));
//        let colorString: string = 'rgb(' + randomIntFromInterval(0, 200) + ',' + randomIntFromInterval(0, 200) + ',' + randomIntFromInterval(0, 200) + ',' + (1 - (Math.random() / 4)) + ')';
//        console.log("ColorString = " + colorString);
//        canvas.DrawCircle(dot.centerPoint.x, dot.centerPoint.y, dot.radius, true, colorString)
//    }
//    //  This doesn't work. You have set the clip BEFORE trying to draw the thing you want clipped.
//    // Also trying a thing with the "clip" function
//    //canvas.context.rect(50, 50, canvas.width - 100, canvas.height - 100);
//    //canvas.context.stroke();
//    //canvas.context.clip();
//};
//// Refactored to "DrawCircle" (Good enough, moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//        let radius: number = 5;
//    canvas.DrawCircle(10, 10, radius);
//    canvas.DrawCircle(20, 10, radius, false, 'red');
//    canvas.DrawCircle(30, 10, radius, true, 'red');
//    canvas.DrawCircle(40, 10, radius, true, '');
//    canvas.DrawCircle(50, 10, radius, true);
//    //canvas.DrawCircle(60, 10, radius, 'green'); // This one does not work, need a paraneter for the stroke outline or not.
//    canvas.DrawCircle(70, 10, radius, true, 'green');
//    canvas.DrawCircle(80, 10, radius, false, 'rgb(0,0,0,1)'); 
//    canvas.DrawCircle(85, 10, radius, false, 'rgb(0,0,0,.75)');
//    canvas.DrawCircle(90, 10, radius, false, 'rgb(0,0,0,.5)');
//    canvas.DrawCircle(95, 10, radius, false, 'rgb(0,0,0,.25)'); 
//};
//// Using some more pre-defined Canvas objects (Good enough, moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let upperLeftCorner: Point = new Point(20, 10);
//    let width: number = 20;
//    let height: number = 10;
//    // "FillRect" draws a filled in box. This creates a weird red fade-out of a red square
//    for (let i: number = 1; i < 20; i++) {
//        canvas.context.fillStyle = 'rgb(200,0,0,' + 1/i + ')'; // color is read and then gets less and less Alpha channel as it goes.
//        canvas.context.fillRect(upperLeftCorner.x * i, upperLeftCorner.y * i, width * i, height * i);
//    }
//    // "StrokeRect" is like Fill Rect, except it only draws the outline
//    for (let i: number = 1; i < 20; i++) {
//        // Huh, this gives it a little more "interesting" shape.
//        canvas.context.strokeRect(upperLeftCorner.x * i, upperLeftCorner.y * i, width * i, height * i);
//    }
//    // "ClearRect" is like an eraser
//    for (let i: number = 1; i < 20; i++) {
//        // scrub a line going down the middle, about half the width of the original (just for a test, cause it looks stupid in general)
//        canvas.context.clearRect(upperLeftCorner.x * i, upperLeftCorner.y * i, width, height);        
//    }
//    // Note: it's hard to tell, but it looks like the "clearRect" does not kill the outline... or if it doesn, maybe about half the outline?
//    // The "rect" commands are the only real primatives.
//    // According to https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes, everything else is built by Paths.
//    // Similar to how I did my previous "Points, and Shapes" drawing.
//    // There are several commands required for drawing a path...
//    //  - beginPath()
//    //  - "Path Methods" like moveTo, lineTo, etc.
//    //  - closePath() [optional, if you want to close the shape or not]
//    //  - stroke() actually draws the shape
//    //  - fill() fills the shape in
//    // Basic Filled Triangle from the MDN tutorial
//    canvas.context.fillStyle = 'rgb(0,0,200)';
//    canvas.context.beginPath();
//    canvas.context.moveTo(75, 50);
//    canvas.context.lineTo(100, 75);
//    canvas.context.lineTo(100, 25);
//    canvas.context.fill();
//    // Note: You do not have to stroke and fill between each object. You can "Move To" in between.
//    canvas.context.beginPath();
//    canvas.context.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
//    canvas.context.moveTo(110, 75);
//    canvas.context.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
//    canvas.context.moveTo(65, 65);
//    canvas.context.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
//    canvas.context.moveTo(95, 65);
//    canvas.context.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
//    canvas.context.stroke();
//};
// Testing Typescript Inheritence (This works moving on)
//window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let centerPoint: Point = new Point(20, 20);
//    let width: number = 10;
//    let height: number = 10;
//    let rectangle: Rectangle = new Rectangle(width, height, centerPoint);
//    canvas.DrawShape(rectangle);
//    console.log(rectangle.ToLogString());
//};
// Shape object, and inherited functions (This works moving on)
//window.onload = function () {
//    let canvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let point1 = new Point(10, 10);
//    let point2 = new Point(10, 20);
//    let point3 = new Point(20, 20);
//    let point4 = new Point(20, 10);  
//    let pointList: Point[] = [point1, point2, point3, point4];
//    let square = new Shape(pointList) // This might need to be refactored or something... something more specific...
//    canvas.DrawShape(square);
//};
//// Draw Continuous and closed line (This works, moving on)
//window.onload = function () {
//    let canvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let point1 = new Point(10, 10);
//    let point2 = new Point(10, 20);
//    let point3 = new Point(20, 20);
//    let point4 = new Point(20, 10);
//    let pointList: Point[] = [point1, point2, point3, point4];
//    canvas.DrawClosedLine(pointList);
//};
//// Refactored (This works, moving on)
//window.onload = function () {
//    let canvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let point1 = new Point(10, 10);
//    let point2 = new Point(10, 20);
//    let point3 = new Point(20, 20);
//    let point4 = new Point(20, 10);
//    let point5 = new Point(15, 15);
//    let line1 = new Line(point1, point2);
//    let line2 = new Line(point2, point3);
//    let line3 = new Line(point3, point4);
//    let line4 = new Line(point4, point1);
//    let line5 = new Line(point1, point5);
//    canvas.DrawLine(line1);
//    console.log("line1 = " + line1.ToLogString);
//    canvas.DrawLine(line2);
//    console.log("line2 = " + line2.ToLogString);
//    canvas.DrawLine(line3);
//    console.log("line3 = " + line3.ToLogString);
//    canvas.DrawLine(line4);
//    console.log("line4 = " + line4.ToLogString);
//    canvas.DrawLine(line5);
//    console.log("line5 = " + line5.ToLogString);
//    for (let i = 0; i < 15; i += 1) {
//        canvas.DrawRandomLine(i);
//    }
//};
////Line and Point objects (This work, moving on)
//window.onload = function () {
//    let canvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let point1 = new Point(20, 10);
//    let point2 = new Point(10, 20);
//    let line1 = new Line(point1, point2);
//    canvas.DrawLine(line1);
//};
////Original Modified (This works, moving on)
//window.onload = function () {
//    let canvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    for (var i = 0; i < 3; i += 1) {
//        canvas.context.beginPath();
//        canvas.context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
//        canvas.context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
//        canvas.context.stroke();
//    }
//};
////Original (this work, moving on)
//window.onload = function () {
//    var canvas = <HTMLCanvasElement>document.getElementById("canvas"),
//        context = canvas.getContext("2d"),
//        width = canvas.width = window.innerWidth,
//        height = canvas.height = window.innerHeight;
//    for (var i = 0; i < 3; i += 1) {
//        context.beginPath();
//        context.moveTo(Math.random() * width, Math.random() * height);
//        context.lineTo(Math.random() * width, Math.random() * height);
//        context.stroke();
//    }
//};
