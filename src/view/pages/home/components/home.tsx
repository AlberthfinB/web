"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";
import { IEventComing } from "../types";
import { ICategoryEvent } from "../types";



const EventList = () => {
  const [eventComing, setEventComing] = useState<IEventComing[]>([]);
  const [categoryEvent, setCategoryEvent] = useState<ICategoryEvent[]>([]);
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(0);
  const [totalData, seTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [debounceValueSearch] = useDebounce(search,1000); // debounce search name event
  const [debounceValueLocation] = useDebounce(location,1000); //debounce search locaton event

  const getEventComing = async () => {
    try {
      const response = await axiosInstance.get(
        `/management/events-coming?pageSize=${pageSize}&pageNumber=${pageNumber}&location=${debounceValueLocation}&search=${debounceValueSearch}&category=${category}`
      );

      setEventComing(response.data.data);
      setPageSize(response.data?.pagination?.pageSize);
      setPageNumber(response.data?.pagination?.currentPage);
      seTotalData(response.data?.pagination?.totalItems);
      setTotalPage(response.data?.pagination?.totalPages);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get("/master/category");
      setCategoryEvent(response.data.data);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    getEventComing();
    getCategory();
  }, []);

  useEffect(() => {
    getEventComing();
  }, [pageNumber, debounceValueSearch, debounceValueLocation, category]);

  const handleSearch = (e :React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPageNumber(1); // reset halaman ke awal saat filter diterapkan
    console.log(handleSearch);
  };

  const handleSearchLocation = (e : React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setPageNumber(1);
    console.log(handleSearchLocation);
  };

  const changePage = async (e : {selected:number}) => {
    const newPage = e.selected + 1;
    setPageNumber(newPage);
  };

  const handleOnClick = async (event_id: number) => {
    router.push(`/event-detail/${event_id}`);
  };

  const handlerCategory = async (category_id: number) => {
    setCategory(category_id);
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Coming Events</h1>

        {/* Filter */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-4 mb-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search events"
                  className="w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={handleSearchLocation}
                  placeholder="Location"
                  className="w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10A7 7 0 103 10a7 7 0 0014 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <button
            className="btn btn-bg-white"
            onClick={() => handlerCategory(0)}
          >
            All
          </button>
          {categoryEvent.map((category) => (
            <button
              key={category.event_category_id}
              className="btn btn-bg-white"
              onClick={() => handlerCategory(category.event_category_id)}
            >
              {category.event_category_name}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventComing.map((event) => (
            <div
              key={event.event_id}
              className="card bg-gray-100 shadow-xl rounded-lg overflow-hidden"
              onClick={() => handleOnClick(event.event_id)}
            >
              <figure>
                <img
                  src={event.image_event}
                  alt={event.name_event}
                  className="w-full h-40 object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">
                  {event.name_event}
                </h2>
                <p className="text-gray-600 text-sm">{event.location}</p>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination mt-6 flex justify-center">
          <ReactPaginate
            breakLabel={"..."}
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={totalPage}
            onPageChange={changePage}
            pageClassName={"join-item btn btn-sm border-none bg-white"}
            pageLinkClassName={""}
            activeClassName={"active-pagination text-primary"}
            className={"flex gap-1 items-center "}
            disabledClassName={"disabled"}
          />
        </div>
      </div>
    </div>
  );
};

export default EventList;
