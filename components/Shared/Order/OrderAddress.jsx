export default function OrderAddress({ address }) {
  if (!address?.street) return <p className="text-sm text-gray-400">Not provided</p>;
  return (
    <p className="text-sm leading-6 text-gray-700">
      {address.street}
      <br />
      {[address.city, address.state, address.zipCode].filter(Boolean).join(", ")}
      {address.country && (
        <>
          <br />
          {address.country}
        </>
      )}
    </p>
  );
}
