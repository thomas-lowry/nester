//
const potentialNodesToNest = Array.from(figma.currentPage.findAll(item => item.parent.type === 'PAGE') as SceneNode[]);
const topLevelFrames = Array.from(figma.currentPage.findAll(frame => frame.type === 'FRAME' && frame.parent.type === 'PAGE') as FrameNode[]);
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
} else {
	figma.closePlugin('Nice job! There is nothing to nest.')
}

function checkOverlap(node, frame) {
	// first lets check to make sure index of the node is above the frame
	// we are comparing
	// if the index is lower than the frame it is covered by the frame
	// and not what we are testing for
	if (node.parent.children.indexOf(node) > frame.parent.children.indexOf(frame)) {
		//x position
		// check to make sure both x coordinates of the top left and top right
		// are within the range of the parent frame
		if (node.x >= frame.x && (node.x + node.width) <= (frame.x + frame.width)) {
			//y position
			if (node.y >= frame.y && (node.y + node.height) <= (frame.y + frame.height)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}	
}
