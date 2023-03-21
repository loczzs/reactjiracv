import { useState, useEffect } from "react";

// Hook dùng để phát hiện width/height hiện tại của trình duyệt là bao nhiêu px dể dựa vào đó có thể reponsive
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log(size.width,size.height)
    };

    // Lắng nghe event resize của trình duyệt, gọi tới hàm handleResize
    window.addEventListener("resize", handleResize);

    return () => {
      // Trước khi component bị unmount, sẽ removeEventListener
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
  

};
export default useWindowSize;