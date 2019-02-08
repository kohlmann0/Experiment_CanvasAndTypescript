
/*
To anyone reading this:
The starting point of anything you want to use is the window.onload functions at the bottom.
There are several different versions as I progressed through different things I added. Most recent is at the top.

I am using this as kind of a test bed to learn Typescript, but also as a way to learn HTLM<Canvas>.
You'll see a few experiments specifically dedicated to Typescript Inheritance, and a few specifically dedicated to Canvas drawing functions.

I would not call any of it "Production Code" (I'm not sure what front end best practices are), but I've tried to keep it fairly well organized.
*/




// Canvas, and all my custom drawing methods.
class BaseCanvas {
    element: HTMLCanvasElement;
    timerToken: number;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(element: HTMLCanvasElement, window: Window) {
        this.element = element;
        this.context = this.element.getContext("2d");
        this.width = element.width = window.innerWidth;
        this.height = element.height = window.innerHeight;

        console.log("Canvas Width: " + this.width + " | Canvas Height: " + this.height);
    }

    DrawPointToPoint(startPoint: Point, stopPoint: Point) {
        this.context.beginPath();
        this.context.moveTo(startPoint.x, startPoint.y);
        this.context.lineTo(stopPoint.x, stopPoint.y);
        this.context.stroke();
    }

    DrawLine(line: Line) {
        this.DrawPointToPoint(line.startPoint, line.stopPoint);
    }

    DrawRandomLine(index: number) {
        let startPoint: Point = new Point(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
        let stopPoint: Point = new Point(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
        this.DrawPointToPoint(startPoint, stopPoint);
    }

    DrawContinuousLine(points: Point[]) {
        let lengthOfArray: number = points.length;
        if (lengthOfArray > 1) {
            for (let i = 1; i < lengthOfArray; i++) {
                this.DrawPointToPoint(points[i - 1], points[i]);
            }
        }
    }

    DrawClosedLine(points: Point[]) {
        this.DrawContinuousLine(points);
        this.DrawPointToPoint(points[points.length - 1], points[0]);
    }

    DrawShape(shape: Shape) {
        this.DrawClosedLine(shape.points);
    }


    // This uses default parameters
    DrawCircle(x: number, y: number, radius: number, outline: boolean = true, fillStyle: string = "") {
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
    }

    DrawGradientCircle(x: number, y: number, radius: number, baseColor: Color, innerGradientColor: Color = new Color(255, 255, 255, 1), outline: boolean = false) {
        // So the interesting thing about a gradient, is that it's not really an "Object", like stroking a circle or whatever, drawing directly on the canvas...
        // It is actually a "Fill Style" for a rectangle, and then you fill the rectangle.
        // Picture it like, instead of drawing a circle on the page, think of it as dropping paint on a sheet of paper (the rectangle), and then laying that paper on the canvas.

        let gradientXCenter: number = x - (.25 * radius); // for testing now, just do a fixed gradient location (.25R). May Change later.
        let gradientYCenter: number = y - (.25 * radius);

        console.log("True Center Center: (" + x + "," + y + ")")
        console.log("Gradient Center: (" + gradientXCenter + "," + gradientYCenter + ")")

        let circle = this.context.createRadialGradient(gradientXCenter, gradientYCenter, 0, x, y, radius)

        let finalGradientColor: Color = baseColor.MixColor(innerGradientColor);

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
    }

    WriteText(text: string, x: number, y: number, font: string, fillstyle: string, outlineOnly: boolean = false) {
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
    }

    DrawSprite(sprite: Sprite, centerX: number, centerY: number, columnIndex: number, rowIndex: number = 0, scale: number = 1) {

        console.log("loaded: " + sprite.Loaded)
        console.log("centerX: " + centerX);
        console.log("centerY: " + centerY);
        console.log("columnIndex: " + columnIndex);
        console.log("rowIndex: " + rowIndex);
        console.log("scale: " + scale);

        let shiftedX = centerX - (sprite.width / 2);
        let shiftedY = centerY - (sprite.height / 2);
        let scaledWidth = sprite.width * scale;
        let scaledHeight = sprite.height * scale;

        console.log("shiftedX: " + shiftedX);
        console.log("shiftedY: " + shiftedY);
        console.log("scaledWidth: " + scaledWidth);
        console.log("scaledHeight: " + scaledHeight);

        this.context.drawImage(sprite.imageFile, sprite.FrameX(columnIndex, rowIndex), sprite.FrameX(columnIndex, rowIndex), sprite.width, sprite.height, shiftedX, shiftedY, scaledWidth, scaledHeight);
    }

}



// Class progression
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    ToLogString(): string {
        return "(" + this.x + "," + this.y + ")";
    }
}

class Line {
    startPoint: Point;
    stopPoint: Point;

    constructor(startPoint: Point, stopPoint: Point) {
        this.startPoint = startPoint;
        this.stopPoint = stopPoint;
    }

    ToLogString(): string {
        return this.startPoint.ToLogString() + "|" + this.stopPoint.ToLogString();
    }
}

abstract class Shape {
    points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }

    ToLogString(): string {
        let outputString: string = "";
        for (let point of this.points) {
            outputString += "|" + point.ToLogString();
        }
        return outputString.substring(1);
    }
}

// Inheritance
// extends is the keyword here
class Rectangle extends Shape {
    centerPoint: Point;
    width: number;
    height: number;

    constructor(width: number, height: number, centerPoint: Point) {
        // Draw clockwise from upper left corner
        let upperLeft: Point = new Point(centerPoint.x - width / 2, centerPoint.y - height / 2);
        let upperRight: Point = new Point(centerPoint.x + width / 2, centerPoint.y - height / 2);
        let lowerLeft: Point = new Point(centerPoint.x - width / 2, centerPoint.y + height / 2);
        let lowerRight: Point = new Point(centerPoint.x + width / 2, centerPoint.y + height / 2);
        let pointList: Point[] = [upperLeft, upperRight, lowerRight, lowerLeft];
        // Super is the key word here
        super(pointList);
    }

    ToLogString(): string {
        // Super is the keyword here
        let outputString: string = "Rectangle: " + super.ToLogString();
        return outputString;
    }
}

class Dot {
    centerPoint: Point;
    radius: number;

    constructor(centerPoint: Point, radius: number) {
        this.centerPoint = centerPoint;
        this.radius = radius;
    }
}


class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    /// 0 to 255 per channel type (0 is Black, 255 is White, or max channel)
    constructor(redChannel: number, greenChannel: number, blueChannel: number, alphaChannel: number = 1) {
        this.r = Math.max(Math.min(redChannel, 255), 0);
        this.g = Math.max(Math.min(greenChannel, 255), 0);
        this.b = Math.max(Math.min(blueChannel, 255), 0);
        this.a = Math.max(Math.min(alphaChannel, 1), 0);
    }

    ToRGBAString(a?: number): string {
        let output: string = "rgba(" + this.r + "," + this.g + "," + this.b + ","
        if (a === null || a === undefined) {
            output += this.a;
        } else {
            output += a;
        }
        output += ")";
        return output;
    }

    ToRGBString(): string {
        return "rgba(" + this.r + "," + this.g + "," + this.b + ")";
    }

    MixColor(alternateColor: Color): Color {

        // Attempt Number 1 (gets the job done for now)
        let alphaRatio = this.a / (this.a + alternateColor.a);
        let alphaCannel = (this.a * alphaRatio + alternateColor.a * (1 - alphaRatio));
        let newRedChannel = (this.r * alphaRatio + alternateColor.r * (1 - alphaRatio));
        let newGreenChannel = (this.g * alphaRatio + alternateColor.g * (1 - alphaRatio));
        let newBlueChannel = (this.b * alphaRatio + alternateColor.b * (1 - alphaRatio));

        //console.log("Alpha: " + alphaRatio);
        //console.log("newRedChannel: " + newRedChannel);
        //console.log("newGreenChannel: " + newGreenChannel);
        //console.log("newBlueChannel: " + newBlueChannel);

        //return new Color(newRedChannel, newGreenChannel, newBlueChannel, alphaCannel); // Mix Alpha Channels
        return new Color(newRedChannel, newGreenChannel, newBlueChannel, this.a); // Keep the base transparency

        // Also recommended "Lab Space" conversion
        //https://stackoverflow.com/questions/649454/what-is-the-best-way-to-average-two-colors-that-define-a-linear-gradient
        //https://stackoverflow.com/questions/398224/how-to-mix-colors-naturally-with-c
        //https://en.wikipedia.org/wiki/CIELAB_color_space
        //https://stackoverflow.com/questions/726549/algorithm-for-additive-color-mixing-for-rgb-values

        // AltTrial =SQRT(r^2*alphaRatio + r^2*(1-alphaRatio))
    }

}

class Sprite {
    imagePath: string;
    imageFile: HTMLImageElement;

    height: number;
    width: number;
    numberOfRows: number;
    numberOfColumns: number;

    totalHeight: number;
    totalWidth: number;

    Loaded: boolean = false;

    constructor(imageFilePath: string, numberOfRows: number, numberOfColumns: number) {
        this.imageFile = new Image();
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
        this.imagePath = imageFilePath
        console.log("sprite created")
    }

    BeginFileLoad(func?:Function){
        console.log("Begin Sprite File Load")
        this.imageFile.addEventListener('load', () => {
            this.totalWidth = this.imageFile.width;
            this.totalHeight = this.imageFile.height;
            this.width = this.totalWidth / this.numberOfColumns;
            this.height = this.totalHeight / this.numberOfRows;
            this.Loaded = true;
            console.log("Loaded: " + this.imagePath);
            func;
        }, false);
        this.imageFile.src = this.imagePath;
    }
    // 0 based indexes
    FrameX(columnIndex: number, rowIndex: number = 0): number {
        return this.width * columnIndex;
    }

    // 0 based indexes
    FrameY(columnIndex: number, rowIndex: number = 0): number {
        return this.height * rowIndex;
    }
}

class ResourceManager_Images {
    self: ResourceManager_Images; // using "self" to get around the bad "this" reference in the callback function.
    loadedCounter: number;
    sourceList: { [sourceUrl: string]: HTMLImageElement } = {};

    constructor() {
        this.loadedCounter = 0;
        this.self = this;
    };


    percentLoaded(): number {
        if (Object.keys(this.sourceList).length == 0) {
            return 0;
        }
        else {
            return (this.loadedCounter / Object.keys(this.sourceList).length) * 100;
        }
    }

    getImage(url: string, originalCallback): HTMLImageElement {
        //console.log("Entering getImage: " + url);
        let newCallback = () => {
            //console.log('Enter getImage callback: ' + url);
            originalCallback();
            //console.log('Exit getImage callback');
        }

        if (this.sourceList[url] != undefined && this.sourceList[url] != null) {
            return this.sourceList[url];
        } else {
            this.sourceList[url] = this.downloadImage(url, newCallback); // As a callback, what do we really want to do? Right now just increment the counter, but, otherwise, what?
            return this.sourceList[url];
        }
        //console.log("Exiting getImage: " + url);
    }

    downloadImage(url: string, originalCallback): HTMLImageElement {
        //console.log("Entering downloadImage: " + url)
        let newCallback = () => {
            //console.log('Enter downloadImage callback: ' + url);
            this.loadedCounter++;
            console.log("Image Download Complete: " + url + ' | Counter: ' + this.loadedCounter)
            originalCallback();
            //console.log('Exit downloadImage callback');
        }

        let img = new Image();
        img.addEventListener('load', newCallback); // Why doesn't this fucking work!! Why won't it call the call-back.
        img.src = url;
        //console.log("TEST COMPLETE FIELD: " + url + "|" + img.complete); // This doesn't seem to work as expected... It shows up as true, as soon as I set the img.src... Cacheing maybe? Local Hard drive maybe?
        //console.log("Exiting downloadImage: " + url)

        return img;
    }
}


// Static Helper Functions
function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function tempDrawImage(canvas: BaseCanvas, img: HTMLImageElement, scaleFactor: number = 1) {
    //let width = img.width;
    //let height = img.height;

    canvas.context.drawImage(img, 100, 100, img.width * scaleFactor, img.height * scaleFactor)

};



// Slicing a sprite sheet
// Having trouble figuring out how to wait until all the files are loaded, before attempting to draw them.
window.onload = function () {
    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
    let loadManager: LoadManager = new LoadManager(function () { console.log("CallbackFunction was called"); })
    console.log("load manager created")
    let sprite:Sprite = new Sprite('Images/coin-sprite-animation-sprite-sheet.png', 1, 10);
    
    loadManager.sprites.push(sprite);
    loadManager.WaitForAllObjectsLoaded(function () { console.log("CallbackFunction was called2"); });
    console.log("Begin Download Started")
    loadManager.AllObjectsLoaded();

    //let sprite: Sprite = new Sprite('Images/coin-sprite-animation-sprite-sheet.png', 1, 10);
    //canvas.DrawSprite(sprite, 100, 100, 0, 0, 1);

};


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


// // Fun with Gradients. Random balls again, but this time, with gradients (works pretty awesome, moving on.)
// // Adding Text to the display (works, moving on)
// window.onload = function () {
//    let canvas: BaseCanvas = new BaseCanvas(<HTMLCanvasElement>document.getElementById("canvas"), window);
//    let numberOfDots: number = randomIntFromInterval(1, 20); //(20 to 100)    

//    // Clip gives it a fun border
//    canvas.context.rect(50, 50, canvas.width - 100, canvas.height - 100);
//    canvas.context.stroke();
//    canvas.context.clip();

//    console.log("numberOfDots = " + numberOfDots)
//    for (let i: number = 0; i < numberOfDots; i++) {
//        let centerPoint: Point = new Point(randomIntFromInterval(10, canvas.width) - 10, randomIntFromInterval(10, canvas.height - 10))
//        let dot: Dot = new Dot(centerPoint, randomIntFromInterval(10, 100));

//        let baseColor: Color = new Color(randomIntFromInterval(0, 200), randomIntFromInterval(0, 200), randomIntFromInterval(0, 200), 1); // Solid Color of the "Ball""
//        let gradientColor: Color = new Color(255, 255, 255, .5); // Color of the "Light"

//        canvas.DrawGradientCircle(dot.centerPoint.x, dot.centerPoint.y, dot.radius, baseColor, gradientColor, true)        
//    }

//    let textString = numberOfDots + " Balls";
//    canvas.context.font = '48px serif';
//    canvas.context.fillStyle = 'rgba(0,0,0,1)'; // Reminder, you have to give it a fill style, before you try to do a fill text. MDN does not mention that.
//    canvas.context.fillText(textString, 100, 200);
//    canvas.context.strokeText(textString, 100, 200);

//    var text = canvas.context.measureText(textString); // TextMetrics object
//    console.log("textWidth: " + text.width); // measures the width of the text... assuming it's in pixels?
// };


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


//// ArcTo is REALLY weird. Basically you make an angle out of three points... and then add an arc tangent to each side, with a specific radius (Good enough, moving on)
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
//    //canvas.DrawCircle(60, 10, radius, 'green'); // This one does not work, need a parameter for the stroke outline or not.

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
//    // Note: it's hard to tell, but it looks like the "clearRect" does not kill the outline... or if it 't', maybe about half the outline?


//    // The "rect" commands are the only real primitives.
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



// Testing Typescript Inheritance (This works moving on)
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
