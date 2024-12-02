import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ICategoryEvent ,ITicketType,IPromotionType,IFormData } from "../types";



const CreateEvent = () => {
  const router = useRouter();
  const [categoryEvent, setCategoryEvent] = useState<ICategoryEvent[]>([]);
  const [ticketType, setTicketType] = useState<ITicketType[]>([]);
  const [promotionType, setPromotionType] = useState<IPromotionType[]>([]);

  const [formData, setFormData] = useState<IFormData>({
    name_event: "",
    location: "",
    description: "",
    image_event: null, // Default value untuk properti file
    ticket_price: "",
    promo_event: "1",
    seats: "",
    event_expired: "",
    ticket_id: "",
    event_category_id: "",
    promo_valid_date: "",
    promo_quota: "",
    discount: "",
  });

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get("/master/category");
      setCategoryEvent(response.data.data);
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const getTicketType = async () => {
    try {
      const response = await axiosInstance.get("/master/ticket");
      setTicketType(response.data.data);
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const getPromotionType = async () => {
    try {
      const response = await axiosInstance.get("/master/promotion-type");
      setPromotionType(response.data.data);
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name_event", formData.name_event);
    data.append("location", formData.location);
    data.append("description", formData.description);
    if (formData.image_event) {
      data.append("image_event", formData.image_event); // Tambahkan file
    }
    data.append("event_category_id", formData.event_category_id);
    data.append("event_expired", formData.event_expired);
    data.append("ticket_price", formData.ticket_price);
    data.append("seats", formData.seats);
    data.append("promotion_type_id", formData.promo_event);
    data.append("max_uses", formData.promo_quota);
    data.append("valid_until", formData.promo_valid_date);
    data.append("ticket_id", formData.ticket_id);
    data.append("discount", formData.discount);
    data.append("status_event_id", "1"); //published

    try {
      const response = await axiosInstance.post(
        "/management/create-event",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.code === 201) {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => router.push("/"));
      }
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFormData({ ...formData, image_event: file });
    }
  };

  useEffect(() => {
    getCategory();
    getTicketType();
    getPromotionType();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      ticket_price: "",
      promo_event: "1",
      promo_valid_date: "",
      promo_quota: "",
      discount: "",
    });
  }, [formData.ticket_id]);

  useEffect(() => {
    setFormData({
      ...formData,
      promo_valid_date: "",
      promo_quota: "",
      discount: "",
    });
  }, [formData.promo_event]);

  return (
    <div className="flex items-center justify-center">
      <div className="shadow-lg rounded-lg p-8 w-full max-w-8xl">
        <h1 className="text-2xl font-semibold mb-6">Create Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="name_event"
                >
                  Event Name
                </label>
                <textarea
                  id="name_event"
                  name="name_event"
                  className="textarea textarea-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.name_event}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="textarea min-h-[8.2rem] textarea-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="event_category_id"
                >
                  Event Category
                </label>
                <select
                  id="event_category_id"
                  name="event_category_id"
                  className="select select-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.event_category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryEvent?.length > 0 &&
                    categoryEvent.map((category) => (
                      <option
                        key={category.event_category_id}
                        value={category.event_category_id}
                      >
                        {category.event_category_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="ticket_id"
                >
                  Ticket Type
                </label>
                <select
                  id="ticket_id"
                  name="ticket_id"
                  className="select select-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.ticket_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a Ticket Type
                  </option>
                  {ticketType?.length > 0 &&
                    ticketType.map((ticket) => (
                      <option key={ticket.ticket_id} value={ticket.ticket_id}>
                        {ticket.ticket_type}
                      </option>
                    ))}
                </select>
              </div>

              {Number(formData.ticket_id) === 2 && (
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="ticket_price"
                  >
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    id="ticket_price"
                    name="ticket_price"
                    className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                    value={formData.ticket_price}
                    onChange={handleChange}
                    required={Number(formData.ticket_id) === 2 ? true : false}
                  />
                </div>
              )}
            </div>

            {/* Kolom Kanan */}
            <div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="location"
                >
                  Location
                </label>
                <textarea
                  id="location"
                  name="location"
                  className="textarea textarea-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="image_event"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image_event"
                  name="image_event"
                  className="file-input w-full border-2 border-gray-500 bg-white mt-1"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="event_expired"
                >
                  Event Start
                </label>
                <input
                  type="datetime-local"
                  id="event_expired"
                  name="event_expired"
                  className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.event_expired}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="seats"
                >
                  Seats
                </label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                  value={formData.seats}
                  onChange={handleChange}
                  required
                />
              </div>

              {Number(formData.ticket_id) === 2 && (
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="promo_event"
                  >
                    Promo Event
                  </label>
                  <select
                    id="promo_event"
                    name="promo_event"
                    className="select select-bordered w-full bg-white border-2 border-gray-500 mt-1"
                    value={formData.promo_event}
                    onChange={handleChange}
                    required={Number(formData.ticket_id) === 2 ? true : false}
                  >
                    {promotionType?.length > 0 &&
                      promotionType.map((promotion) => (
                        <option
                          key={promotion.promotion_type_id}
                          value={promotion.promotion_type_id}
                        >
                          {promotion.promotion_type}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {Number(formData.promo_event) === 3 && (
                <>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="promo_valid_date"
                    >
                      Promo Valid Date
                    </label>
                    <input
                      type="datetime-local"
                      id="promo_valid_date"
                      name="promo_valid_date"
                      className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                      value={formData.promo_valid_date}
                      onChange={handleChange}
                      onFocus={(e) => e.target.showPicker()}
                      required={
                        Number(formData.promo_event) === 3 ? true : false
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="discount"
                    >
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                      value={formData.discount}
                      onChange={handleChange}
                      required={
                        Number(formData.promo_event) === 3 ? true : false
                      }
                    />
                  </div>
                </>
              )}

              {Number(formData.promo_event) === 2 && (
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="promo_quota"
                  >
                    Promo Quota
                  </label>
                  <input
                    type="text"
                    id="promo_quota"
                    name="promo_quota"
                    className="input input-bordered w-full bg-white border-2 border-gray-500 mt-1"
                    value={formData.promo_quota}
                    onChange={handleChange}
                    required={Number(formData.promo_event) === 2 ? true : false}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
