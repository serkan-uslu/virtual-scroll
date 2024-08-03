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
