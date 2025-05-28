import { PricingTable } from "@clerk/nextjs";

const Subscription = () => {
  return (
    <div className="min-h-screen flex justify-center items-center p-5 md:p-10 mt-20">
      <PricingTable />
    </div>
  );
};

export default Subscription;
