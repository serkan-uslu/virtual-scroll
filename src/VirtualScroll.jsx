import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VirtualScroll = ({
  itemHeight = 50,
  itemCount,
  renderItem,
  tolerance = 5,
}) => {
  if (typeof itemHeight !== "number" || itemHeight <= 0) {
    throw new Error("'itemHeight' prop must be a positive number.");
  }

  if (typeof itemCount !== "number" || itemCount <= 0) {
    throw new Error("'itemCount' prop must be a positive number.");
  }

  if (typeof renderItem !== "function") {
    throw new Error("'renderItem' prop must be a function.");
  }

  if (typeof tolerance !== "number" || tolerance < 0) {
    throw new Error("'tolerance' prop must be a non-negative number.");
  }

  const [scrollTop, setScrollTop] = useState(0);
  const viewportRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (viewportRef.current) {
      setScrollTop(viewportRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const totalHeight = itemCount * itemHeight;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - tolerance
  );
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor(
      (scrollTop +
        (viewportRef.current ? viewportRef.current.clientHeight : 0)) /
        itemHeight
    ) + tolerance
  );

  const items = useMemo(() => {
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(renderItem(i));
    }
    return visibleItems;
  }, [startIndex, endIndex, renderItem]);

  return (
    <div ref={viewportRef} style={{ height: "400px", overflowY: "auto" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {items.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: "absolute",
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

VirtualScroll.propTypes = {
  itemHeight: PropTypes.number,
  itemCount: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  tolerance: PropTypes.number,
};

export default VirtualScroll;
