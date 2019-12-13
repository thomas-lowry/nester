//vars
const potentialNodesToNest = Array.from(figma.currentPage.findAll(item => item.parent.type === 'PAGE'));
const topLevelFrames = Array.from(figma.currentPage.findAll(frame => frame.type === 'FRAME' && frame.parent.type === 'PAGE'));
var count = 0;

//check to see if the initial conditions are met
if (topLevelFrames.length != 0 && potentialNodesToNest.length != 0) {
    potentialNodesToNest.forEach(node => {
        topLevelFrames.forEach(frame => {
            if (checkOverlap(node, frame) === true) {
                if (node.id != frame.id) {
                    let childX = Math.abs(frame.x - node.x);
                    let childY = Math.abs(frame.y - node.y);
                    frame.appendChild(node);
                    node.x = childX;
                    node.y = childY;
                    count++;
                }
            }
        });
    });
    figma.closePlugin(count + ' objects nested.');
}
else {
    figma.closePlugin('Nice job! There is nothing to nest.');
}

// check to make sure entire node is encapsulated ontop of the frame
// the plugin will pass on nodes that overlap the frame bounds 
function checkOverlap(node, frame) {
    // first lets check to make sure index of the node is above the frame
    // compare index of element to index of frame, node must be above to continue
    if (node.parent.children.indexOf(node) > frame.parent.children.indexOf(frame)) {
        // x position
        // check to make sure both x coordinates of the top left and top right
        // are within the range of the parent frame
        if (node.x >= frame.x && (node.x + node.width) <= (frame.x + frame.width)) {
            // y position (same as x)
            if (node.y >= frame.y && (node.y + node.height) <= (frame.y + frame.height)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
