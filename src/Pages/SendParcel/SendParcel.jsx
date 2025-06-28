import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SendParcel = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [regions, setRegions] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);

  const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
  };

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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const recieverRegion = watch("recieverRegion");
  const recieverDistrict = watch("recieverDistrict");
  const type = watch("type");

  const filteredServiceCenters =
    senderRegion !== ""
      ? serviceCenters.filter(
          (serviceCenter) => serviceCenter.region === senderRegion
        )
      : [];

  const filteredReceiverServiceCenters =
    recieverRegion !== ""
      ? serviceCenters.filter((sc) => sc.region === recieverRegion)
      : [];

  const filteredSenderWirehouses = filteredServiceCenters.filter(
    (sc) => sc.district === senderDistrict
  );

  const filteredReceiverWirehouses = filteredReceiverServiceCenters.filter(
    (sc) => sc.district === recieverDistrict
  );

  const handleSendParcel = (data) => {
    const weight = parseFloat(data.weight) || 0;
    const fixedWeight = weight.toFixed(2);
    const isSameDistrict = data.senderDistrict === data.recieverDistrict;

    let baseCost = 0;
    let extraCost = 0;
    let breakdown = "";

    if (data.type === "Document") {
      baseCost = isSameDistrict ? 60 : 80;
      breakdown = `Document delivery ${
        isSameDistrict ? "within" : "outside"
      } the district.`;
    } else {
      if (weight <= 3) {
        baseCost = isSameDistrict ? 110 : 150;
        breakdown = `Non-Document up to 3kg ${
          isSameDistrict ? "within" : "outside"
        } the district.`;
      } else {
        const extraKg = weight - 3;
        const perKgCharge = extraKg * 40;
        const districtExtra = isSameDistrict ? 0 : 40;
        baseCost = isSameDistrict ? 110 : 150;
        extraCost = perKgCharge + districtExtra;

        breakdown = `
        Non-Document over 3kg ${
          isSameDistrict ? "within" : "outside"
        } the district.<br/>
        Extra charge: ৳40 x ${extraKg.toFixed(2)}kg = ৳${Math.round(
          perKgCharge
        )}<br/>
        ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}
      `;
      }
    }

    const totalCost = Math.round(baseCost + extraCost);

    Swal.fire({
      title: "Delivery Cost Breakdown",
      icon: "info",
      html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Parcel Type:</strong> ${
          data.type === "Document" ? "Document" : "Non-Document"
        }</p>
        <p><strong>Weight:</strong> ${fixedWeight} kg</p>
        <p><strong>Delivery Zone:</strong> ${
          isSameDistrict ? "Within Same District" : "Outside District"
        }</p>
        <div class="my-2 divider"></div>
        <p><strong>Base Cost:</strong> ৳${Math.round(baseCost)}</p>
        ${
          extraCost > 0
            ? `<p><strong>Extra Charges:</strong> ৳${Math.round(extraCost)}</p>`
            : ""
        }
        <div class="text-gray-500 text-sm">${breakdown}</div>
        <div class="my-2 divider"></div>
        <p class="text-xl font-bold text-green-600">Total Cost: ৳${totalCost}</p>
      </div>
    `,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "black",
      customClass: {
        popup: "rounded-xl shadow-md px-6 py-6",
        denyButton: "text-black",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          weight: weight ? parseFloat(weight) : 0,
          created_by: userEmail,
          creation_date: new Date().toISOString(),
          payment_status: "unpaid",
          delivery_status: "not_collected",
          cost: totalCost,
          tracking_id: generateTrackingID(),
        };

        axiosSecure
          .post("/parcels", parcelData)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                title: "Redirecting...",
                text: "Proceeding to payment gateway.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
              reset();
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });
  };

  return (
    <div className="py-16 px-4 sm:px-8 md:px-12 bg-white rounded-2xl">
      <h1 className="text-2xl md:text-4xl font-extrabold text-[#03373D] mb-6">
        Send a Parcel
      </h1>
      <div className="divider mb-3"></div>

      <h3 className="text-lg md:text-xl font-extrabold text-[#03373D] mb-6">
        Enter your parcel details
      </h3>

      <form onSubmit={handleSubmit(handleSendParcel)}>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="radio-12"
              value="Document"
              {...register("type", { required: "Type is required" })}
              className="radio bg-[#E2E2E2] text-white checked:bg-[#0AB010]"
            />
            Document
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="radio-12"
              value="Non-Document"
              {...register("type", { required: "Type is required" })}
              className="radio bg-[#E2E2E2] text-white checked:bg-[#0AB010]"
            />
            Non-Document
          </label>
        </div>
        {errors.type && (
          <p className="text-xs text-red-500 mt-2 font-bold">
            {errors.type.message}
          </p>
        )}

        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <label className="lable font-semibold text-sm">Parcel Name</label>
            <input
              type="text"
              placeholder="Parcel Name"
              {...register("title", { required: "Parcel name is required" })}
              className="input input-bordered w-full mt-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 font-bold">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="lable font-semibold text-sm">Parcel Weight</label>
            <input
              type="number"
              step="0.1"
              placeholder="Parcel Weight (kg)"
              {...register("weight", {
                required:
                  type === "Non-Document"
                    ? "Weight is required for Non-Document parcels"
                    : false,
              })}
              className="input input-bordered w-full mt-2"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-2 font-bold">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>

        <div className="divider my-6"></div>

        {/* sender + receiver information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="font-extrabold text-[#03373D] mb-6">
              Sender Details
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div>
                <label className="lable font-semibold text-xs">
                  Sender Name
                </label>
                <input
                  type="text"
                  placeholder="Sender Name"
                  {...register("senderName", {
                    required: "Sender name is required",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.senderName && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderName.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Your region</legend>
                  <select
                    {...register("senderRegion", {
                      required: "Sender region is required",
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
                {errors.senderRegion && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderRegion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="lable font-semibold text-xs">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  {...register("senderAddress", {
                    required: "Sender address is required",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="lable font-semibold text-xs">
                  Sender Contact No
                </label>
                <input
                  type="number"
                  placeholder="Sender Contact No"
                  {...register("senderContactNo", {
                    required: "Sender Contact No is required.",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.senderContactNo && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderContactNo.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Sender District</legend>
                  <select
                    {...register("senderDistrict", {
                      required: "Sender District is required",
                    })}
                    defaultValue=""
                    className="select w-full"
                    disabled={!senderRegion}
                  >
                    <option value="" disabled={true}>
                      Select Sender District
                    </option>
                    {filteredServiceCenters.map((serviceCenter, index) => (
                      <option value={serviceCenter.district} key={index}>
                        {serviceCenter.district}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.senderDistrict && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderDistrict.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Sender Pickup Wire house
                  </legend>
                  <select
                    {...register("senderWirehouse", {
                      required: "Sender Wire house is required",
                    })}
                    defaultValue=""
                    className="select w-full"
                    disabled={!senderDistrict}
                  >
                    <option value="" disabled={true}>
                      Select Wire house
                    </option>
                    {filteredSenderWirehouses.map((serviceCenter) =>
                      serviceCenter.covered_area.map((area, index) => (
                        <option value={area} key={index}>
                          {area}
                        </option>
                      ))
                    )}
                  </select>
                </fieldset>
                {errors.senderWirehouse && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.senderWirehouse.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Pickup Instruction
                  </legend>
                  <textarea
                    className="textarea w-full"
                    placeholder="Pickup Instruction"
                    rows={4}
                    {...register("pickupInstruction", {
                      required: "Pickup Instruction is required",
                    })}
                  ></textarea>
                </fieldset>
                {errors.pickupInstruction && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.pickupInstruction.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-[#03373D] mb-6">
              Reciever Details
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div>
                <label className="lable font-semibold text-xs">
                  Reciever Name
                </label>
                <input
                  type="text"
                  placeholder="Reciever Name"
                  {...register("recieverName", {
                    required: "Reciever Name is required",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.recieverName && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverName.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Receiver Region</legend>
                  <select
                    {...register("recieverRegion", {
                      required: "Reciever region is required",
                    })}
                    defaultValue=""
                    className="select w-full"
                  >
                    <option value="" disabled={true}>
                      Select Receiver Region
                    </option>
                    {regions.map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.recieverRegion && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverRegion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="lable font-semibold text-xs">
                  Reciever Address
                </label>
                <input
                  type="text"
                  placeholder="Reciever Address"
                  {...register("recieverAddress", {
                    required: "Reciever address is required",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.recieverAddress && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="lable font-semibold text-xs">
                  Reciever Contact No
                </label>
                <input
                  type="number"
                  placeholder="Reciever Contact No"
                  {...register("recieverContactNo", {
                    required: "Reciever Contact No is required.",
                  })}
                  className="input input-bordered w-full mt-2"
                />
                {errors.recieverContactNo && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverContactNo.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Reciever District</legend>
                  <select
                    {...register("recieverDistrict", {
                      required: "Reciever District is required",
                    })}
                    defaultValue=""
                    className="select w-full"
                    disabled={!recieverRegion}
                  >
                    <option value="" disabled={true}>
                      Select Reciever District
                    </option>
                    {filteredReceiverServiceCenters.map(
                      (serviceCenter, index) => (
                        <option value={serviceCenter.district} key={index}>
                          {serviceCenter.district}
                        </option>
                      )
                    )}
                  </select>
                </fieldset>
                {errors.recieverDistrict && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverDistrict.message}
                  </p>
                )}
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Reciever Delivery Wire house
                  </legend>
                  <select
                    {...register("recieverWirehouse", {
                      required: "Reciever Delivery Wire house is required",
                    })}
                    defaultValue=""
                    className="select w-full"
                    disabled={!recieverDistrict}
                  >
                    <option value="" disabled={true}>
                      Select Reciever Delivery Wire house
                    </option>
                    {filteredReceiverWirehouses.map((serviceCenter) =>
                      serviceCenter.covered_area.map((area, index) => (
                        <option value={area} key={index}>
                          {area}
                        </option>
                      ))
                    )}
                  </select>
                </fieldset>
                {errors.recieverWirehouse && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.recieverWirehouse.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Delivery Instruction
                  </legend>
                  <textarea
                    className="textarea w-full"
                    placeholder="Delivery Instruction"
                    rows={4}
                    {...register("deliveryInstruction", {
                      required: "Delivery Instruction is required",
                    })}
                  ></textarea>
                </fieldset>
                {errors.deliveryInstruction && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.deliveryInstruction.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary px-16 mt-16 text-black"
        >
          Proceed to Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
