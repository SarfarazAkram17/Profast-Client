import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import rider from "../../assets/rider.png";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const BeARider = () => {
  const axiosSecure = useAxiosSecure();
  const [regions, setRegions] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const { user, userEmail, uid } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    watch,
  } = useForm();

  useEffect(() => {
    fetch("./division.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  useEffect(() => {
    fetch("./serviceCenter.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data));
  }, []);

  const riderRegion = watch("riderRegion");
  const riderDistrict = watch("riderDistrict");

  const filteredServiceCenters =
    riderRegion !== ""
      ? serviceCenters.filter(
          (serviceCenter) => serviceCenter.region === riderRegion
        )
      : [];

  const filteredRiderWirehouses = filteredServiceCenters.filter(
    (sc) => sc.district === riderDistrict
  );

  const onSubmit = (data) => {
    setLoading(true);

    const riderData = {
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    axiosSecure
      .post(`/riders?uid=${uid}`, riderData)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Application Submitted!",
            text: "Your application is pending approval.",
          });
          
          reset();
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="py-16 px-4 sm:px-8 md:px-12 bg-white rounded-2xl">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-6">Be A Rider</h1>
      <p className="max-w-md text-sm">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>
      <div className="divider mb-4"></div>

      <h3 className="text-lg md:text-xl font-extrabold text-[#03373D]">
        Tell us about yourself
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_38%] items-center gap-12 mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="lable font-semibold text-xs">Your Name</label>
              <input
                type="text"
                value={user.displayName}
                readOnly
                disabled
                {...register("riderName")}
                className="input font-bold input-bordered w-full mt-2"
              />
            </div>
            <div>
              <label className="lable font-semibold text-xs">Your Age</label>
              <input
                type="number"
                placeholder="Your Age"
                {...register("riderAge", {
                  required: "Age is required",
                  min: {
                    value: 18,
                    message: "You must be at least 18 years old",
                  },
                })}
                className="input input-bordered w-full mt-2"
              />
              {errors.riderAge && (
                <p className="text-red-500 text-sm mt-2 font-bold">
                  {errors.riderAge.message}
                </p>
              )}
            </div>
            <div>
              <label className="lable font-semibold text-xs">Your Email</label>
              <input
                type="email"
                value={userEmail}
                readOnly
                disabled
                {...register("riderEmail")}
                className="input font-bold input-bordered w-full mt-2"
              />
            </div>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Your region</legend>
                <select
                  {...register("riderRegion", {
                    required: "Your Region is required",
                  })}
                  defaultValue=""
                  className="select w-full"
                >
                  <option value="" disabled={true}>
                    Select your region
                  </option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </fieldset>
              {errors.riderRegion && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderRegion.message}
                </p>
              )}
            </div>
            <div>
              <label className="lable font-semibold text-xs">Nid No</label>
              <input
                type="number"
                placeholder="NID"
                {...register("riderNidNo", { required: "Nid No is required" })}
                className="input input-bordered w-full mt-2"
              />
              {errors.riderNidNo && (
                <p className="text-red-500 text-sm mt-2 font-bold">
                  {errors.riderNidNo.message}
                </p>
              )}
            </div>
            <div>
              <label className="lable font-semibold text-xs">Contact</label>
              <input
                type="number"
                placeholder="Contact"
                {...register("riderContact", {
                  required: "Contact is required.",
                })}
                className="input input-bordered w-full mt-2"
              />
              {errors.riderContact && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderContact.message}
                </p>
              )}
            </div>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Rider District</legend>
                <select
                  {...register("riderDistrict", {
                    required: "Rider District is required",
                  })}
                  defaultValue=""
                  className="select w-full"
                  disabled={!riderRegion}
                >
                  <option value="" disabled={true}>
                    Select Rider District
                  </option>
                  {filteredServiceCenters.map((serviceCenter, index) => (
                    <option value={serviceCenter.district} key={index}>
                      {serviceCenter.district}
                    </option>
                  ))}
                </select>
              </fieldset>
              {errors.riderDistrict && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderDistrict.message}
                </p>
              )}
            </div>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Which wire-house you want to work?
                </legend>
                <select
                  {...register("riderWirehouse", {
                    required: "Rider Wire house is required",
                  })}
                  defaultValue=""
                  className="select w-full"
                  disabled={!riderDistrict}
                >
                  <option value="" disabled={true}>
                    Select Wire house
                  </option>
                  {filteredRiderWirehouses.map((serviceCenter) =>
                    serviceCenter.covered_area.map((area, index) => (
                      <option value={area} key={index}>
                        {area}
                      </option>
                    ))
                  )}
                </select>
              </fieldset>
              {errors.riderWirehouse && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderWirehouse.message}
                </p>
              )}
            </div>
            <div>
              <label className="lable font-semibold text-xs">Bike Brand</label>
              <input
                type="text"
                placeholder="Your Bike Brand"
                {...register("riderBikeBrand", {
                  required: "Bike Bracnd is required",
                })}
                className="input input-bordered w-full mt-2"
              />
              {errors.riderBikeBrand && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderBikeBrand.message}
                </p>
              )}
            </div>
            <div>
              <label className="lable font-semibold text-xs">
                Bike Registrantion No
              </label>
              <input
                type="text"
                placeholder="Your Bike Registrantion No"
                {...register("riderBikeRegistrationNo", {
                  required: "Bike Registration No is required",
                })}
                className="input input-bordered w-full mt-2"
              />
              {errors.riderBikeRegistrantionNo && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.riderBikeRegistrantionNo.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Additional Information
                </legend>
                <textarea
                  className="textarea w-full"
                  placeholder="Additional Information (optional)"
                  rows={4}
                  {...register("riderAdditionalInformation")}
                ></textarea>
              </fieldset>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-black w-full mt-8"
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <div>
          <img src={rider} className="w-full" alt="" />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
