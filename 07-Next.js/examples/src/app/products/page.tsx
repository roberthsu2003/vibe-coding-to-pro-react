async function getProducts() {
  return [
    { id: 1, name: "商品 A", price: 100 },
    { id: 2, name: "商品 B", price: 200 },
  ];
}

export default async function Products() {
  const products = await getProducts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">商品列表</h1>
      <ul className="mt-4 space-y-2">
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
