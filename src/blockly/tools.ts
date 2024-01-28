const get_topstack_of_block = block => {
  let base = block;
  while (base.getOutputShape() && base.getSurroundParent()) {
      base = base.getSurroundParent();
  }
  return base;
}

const myFlash = { block: null, timerID: null };
    
        class BlockFlasher {
            static flash(block: BlockSvg) {
                if (myFlash.timerID > 0) {
                    clearTimeout(myFlash.timerID);
                    if (myFlash.block.svgPath_) {
                        myFlash.block.svgPath_.style.fill = "";
                    }
                }
    
                let count = 4;
                let flashOn = true;
                myFlash.block = block;
    
                function _flash() {
                    if (myFlash.block.svgPath_) {
                        myFlash.block.svgPath_.style.fill = flashOn ? "#ffff80" : "";
                    }
                    flashOn = !flashOn;
                    count--;
                    if (count > 0) {
                        myFlash.timerID = setTimeout(_flash, 200);
                    } else {
                        myFlash.timerID = 0;
                        myFlash.block = null;
                    }
                }
    
                _flash();
            }
        }
    
        const scroll_block_into_view = block => {
            if (!block) {
                return;
            }
    
            const offsetX = 32,
                  offsetY = 32;
    
            const workspace = Blockly.getMainWorkspace();
    
            let root = block.getRootBlock();
            let base = get_topstack_of_block(block);
            let ePos = base.getRelativeToSurfaceXY(),
                rPos = root.getRelativeToSurfaceXY(),
                scale = workspace.scale,
                x = rPos.x * scale,
                y = ePos.y * scale,
                xx = block.width + x,
                yy = block.height + y,
                s = workspace.getMetrics();
            if (
                x < s.viewLeft + offsetX - 4 ||
                xx > s.viewLeft + s.viewWidth ||
                y < s.viewTop + offsetY - 4 ||
                yy > s.viewTop + s.viewHeight
            ) {
                let sx = x - s.contentLeft - offsetX,
                    sy = y - s.contentTop - offsetY;
    
                workspace.scrollbar.set(sx, sy);
            }
            BlockFlasher.flash(block);
        };

export {
  BlockFlasher,
  get_topstack_of_block,
  scroll_block_into_view,
}