'use client';

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./parcel-freight-address.css";
import {
  validateCollectionTime,
  getTime,
  isToday,
  adjustDateForCutoff,
  mergeDateAndTime,
  addMinutes,
  startOfDay,
  endOfDayQtr,
  isAfterCutoff,
  nextBusinessDate,
  isSameDay,
  isWeekend,
  isAfterCutoffNow,
  isSameOrEarlyDay,
  isHoliday,
} from "@/utils/helpers";
import { STATE_TZ } from "@/utils/constant";

const PF_Extra_Form = ({
  formData,
  serviceName,
  onChange,
  hasError,
  pickup_state = "Australia/Brisbane",
  holidaysSet,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [minStartTime, setMinStartTime] = useState(() =>
    startOfDay(new Date())
  );
  const [maxStartTime, setMaxStartTime] = useState(() =>
    endOfDayQtr(new Date())
  );
  const [autoChangedMsg, setAutoChangedMsg] = useState(null);

  const { data: collection } = useSelector((state) => state.collection);

  const tz = STATE_TZ[pickup_state || ""] || "Australia/Brisbane";
  const isFedEx =
    (serviceName || "").toLowerCase().replace(/\s+/g, "") === "fedex";
  const gapMins = isFedEx ? 120 : 15;

  useEffect(() => {
    let newDate = collection?.collection_date_time
      ? new Date(collection?.collection_date_time)
      : new Date();
    const today = new Date();
    let message = null;
    if (isFedEx) {
      if (
        collection?.collection_date_time &&
        (isWeekend(newDate, tz) || isHoliday(newDate, tz, holidaysSet))
      ) {
        newDate = nextBusinessDate(newDate, tz, holidaysSet);
      } else if (isSameDay(newDate, today) && isAfterCutoffNow()) {
        newDate = nextBusinessDate(newDate, tz, holidaysSet);
      }
      message =
        "It's after 14:30 today, so we've moved the collection date to the next business day.";
    }
    setStartDate(newDate);
    onChange(newDate, "collection_date_time");
    setAutoChangedMsg(message);
  }, []);

  useEffect(() => {
    if (formData?.collection_time_start) {
      setStartTime(new Date(formData.collection_time_start));
    } else {
      const time = new Date();
      setStartTime(time);
      onChange(time, "collection_time_start");
    }

    if (formData?.collection_time_end) {
      setEndTime(new Date(formData.collection_time_end));
    }
  }, [formData]);

  const handleOnChange = (date) => {
    let picked = date ?? new Date();
    const today = new Date();
    setAutoChangedMsg(null);
    let message = null;

    if (isFedEx) {
      if (
        isWeekend(picked, tz) ||
        isHoliday(picked, tz, holidaysSet) ||
        (isSameDay(picked, today) && isAfterCutoff(picked, "14:30"))
      ) {
        picked = nextBusinessDate(picked, tz, holidaysSet);
        message =
          "It's after 14:30 today, so we've moved the collection date to the next business day.";
      }
    }

    setStartDate(picked);
    onChange(picked, "collection_date_time");
    setAutoChangedMsg(message);

    const adjusted = adjustDateForCutoff(
      picked,
      formData?.dropoff_state,
      "14:30"
    );

    const startOfDay = (d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    const endOfDayQtr = (d) => {
      const x = new Date(d);
      x.setHours(23, 45, 0, 0);
      return x;
    };

    setMinStartTime(startOfDay(adjusted));
    setMaxStartTime(endOfDayQtr(adjusted));

    setStartTime((prev) => mergeDateAndTime(adjusted, prev ?? new Date()));
    setEndTime((prev) => (prev ? mergeDateAndTime(adjusted, prev) : null));
  };

  const handleTimeChange = (time, type) => {
    const picked = time ?? new Date();
    const today = new Date();
    setAutoChangedMsg(null);

    if (type === "start_time") {
      let mergedStart = mergeDateAndTime(startDate, picked);

      if (
        isFedEx &&
        isSameOrEarlyDay(startDate, today) &&
        isAfterCutoff(mergedStart, "14:30", tz)
      ) {
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const businessDay = nextBusinessDate(nextDay, tz, holidaysSet);
        setStartDate(businessDay);
        setMinStartTime(startOfDay(businessDay));
        setMaxStartTime(endOfDayQtr(businessDay));

        mergedStart = mergeDateAndTime(businessDay, picked);
        setAutoChangedMsg(
          "Collection time is after 14:30 in the pickup state. We've moved the date to the next business day."
        );
      }

      setStartTime(mergedStart);
      onChange(mergedStart, "collection_time_start");
      onChange(mergedStart, "collection_date_time");

      const minEnd = addMinutes(mergedStart, gapMins);
      if (!endTime || endTime < minEnd) {
        setEndTime(minEnd);
        onChange(minEnd, "collection_time_end");
      }
    }

    if (type === "end_time") {
      const mergedEnd = mergeDateAndTime(startDate, picked);
      const minEnd = addMinutes(startTime ?? mergedEnd, gapMins);
      const finalEnd = mergedEnd < minEnd ? minEnd : mergedEnd;
      setEndTime(finalEnd);
      onChange(finalEnd, "collection_time_end");
    }
  };

  return (
    <>
      <div>
        <div className="mb-4">
          <label className="pfs-input-label mr-3">
            Select a Collection Date HERE &nbsp;
          </label>
          <div className="react-datepicker-column">
            <DatePicker
              showIcon
              selected={startDate}
              dateFormat={"dd/MM/yyyy"}
              onChange={handleOnChange}
              name="collection_date_time"
              className="form-control"
            />
            <DatePicker
              selected={startTime}
              onChange={(time) => handleTimeChange(time, "start_time")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start Time"
              dateFormat="HH:mm"
              placeholderText="Start Time"
              className="form-control"
              minTime={minStartTime}
              maxTime={addMinutes(new Date(maxStartTime), -gapMins)}
            />
            <DatePicker
              selected={endTime}
              onChange={(time) => handleTimeChange(time, "end_time")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="HH:mm"
              placeholderText="End Time"
              minTime={
                startTime
                  ? addMinutes(startTime, gapMins)
                  : addMinutes(minStartTime, gapMins)
              }
              maxTime={maxStartTime}
              className="form-control"
            />

            {autoChangedMsg && (
              <div>
                <p className="text-xs text-red-600 font-bold mt-1">
                  {autoChangedMsg}
                </p>
              </div>
            )}
            {hasError &&
              formData.collection_date_time &&
              collection.service_collection_cutoff_time &&
              isToday(new Date(formData.collection_date_time)) &&
              (!validateCollectionTime(
                getTime(formData.collection_date_time),
                collection.service_collection_cutoff_time
              ) ||
                !getTime(formData.collection_time_start) ||
                !getTime(formData.collection_time_end)) && (
                <div>
                  <p className="text-xs text-red-600 font-light mt-1">
                    Select a early collection time than
                    {collection.service_collection_cutoff_time}
                  </p>
                </div>
              )}
            {hasError && !formData.collection_time_end && (
              <div>
                <p className="text-xs text-red-600 font-light mt-1">
                  Please select a valid end time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PF_Extra_Form;



