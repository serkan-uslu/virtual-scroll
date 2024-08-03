# Virtual Scroll Example

Bu proje, React ile uygulanmış bir sanal kaydırma bileşenini gösterir. `VirtualScroll` bileşeni, yalnızca görünen öğeleri ve küçük bir tamponu render ederek büyük bir öğe listesini verimli bir şekilde render eder.

## İçindekiler

- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Bileşenler](#bileşenler)
  - [VirtualScroll](#virtualscroll)
  - [App](#app)
- [Veri Üretimi](#veri-üretimi)

## Kurulum

Bu projeyi çalıştırmak için Node.js ve npm kurulu olmalıdır. Aşağıdaki adımları izleyin:

1. Depoyu klonlayın:
    ```sh
    git clone <repository_url>
    cd <repository_directory>
    ```

2. Bağımlılıkları yükleyin:
    ```sh
    npm install
    ```

3. Geliştirme sunucusunu başlatın:
    ```sh
    npm start
    ```

## Kullanım

Bu projedeki ana bileşen `VirtualScroll` olup, `App` bileşeninde kullanıcı verilerini görüntülemek için kullanılır.

### VirtualScroll

`VirtualScroll` bileşeni aşağıdaki özellikleri alır:

- `itemHeight` (sayı): Listedeki her bir öğenin yüksekliği (varsayılan: 50).
- `itemCount` (sayı): Listedeki toplam öğe sayısı.
- `renderItem` (fonksiyon): Bir indeks alır ve bu indeksteki öğe için bir React elementi döner.
- `tolerance` (sayı): Daha düzgün kaydırma için görünen alanın üzerinde ve altında render edilecek öğe sayısı (varsayılan: 5).

### App

`App` bileşeni, `faker.js` kullanarak 5000 rastgele kullanıcı üretir ve bunları `VirtualScroll` bileşeni ile görüntüler. Her kullanıcı öğesi bir ID, kullanıcı adı, e-posta, avatar ve şifre içerir.

## Bileşenler

### VirtualScroll

Bu bileşen, sanal kaydırma mantığını yönetir.

```jsx
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
```

### App

Ana uygulama bileşeni, `VirtualScroll` kullanarak rastgele kullanıcı listesini görüntüler.

```jsx
import VirtualScroll from "./VirtualScroll";
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
  };
}

export const data = faker.helpers.multiple(createRandomUser, {
  count: 5000,
});

const renderItem = (index) => {
  const item = data[index];

  return (
    <div className="rounded overflow-hidden shadow-lg p-4 bg-white">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="text-gray-900 font-bold text-xl mb-2">
            {item.userId}
          </div>
          <div className="text-gray-700 text-base">{item.username}</div>
          <div className="text-gray-700 text-base">{item.email}</div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={item.avatar}
            alt="Avatar"
            className="h-16 w-16 rounded-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-gray-700 text-base">{item.password}</div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="container mx-auto max-w-sm">
      <div style={{ height: "500px", overflowY: "auto" }}>
        <VirtualScroll
          itemHeight={150}
          tolerance={2}
          itemCount={data.length}
          renderItem={renderItem}
        />
      </div>
    </div>
  );
};

export default App;
```

## Veri Üretimi

`App` bileşeni, `faker.js` kullanarak rastgele kullanıcı verileri üretir. `createRandomUser` fonksiyonu, bir UUID, kullanıcı adı, e-posta, avatar URL'si ve şifre ile bir kullanıcı nesnesi oluşturur.

```jsx
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
  };
}

export const data = faker.helpers.multiple(createRandomUser, {
  count: 5000,
});
```
 