import { FiAlertCircle } from "react-icons/fi";
import { TablaAmenities } from "@/components/admin/amenities/tablaAmenities";

export default async function Amenities() {
  let amenities: any[] | null = null;

  try {
    const response = await fetch(`${process.env.API_HOST}/api/Amenity`, {
      method: "GET",
      cache: "no-store",
    });
    amenities = await response.json();
  } catch (error) {
    console.error("Error fetch usuarios:", error);
  }

  if (!amenities) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-700">
        <FiAlertCircle size={48} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error, intentelo mas tarde</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <TablaAmenities params={amenities} />
    </div>
  );
}
