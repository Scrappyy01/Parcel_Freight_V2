'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./parcel-freight-address.css";
import {
  mergeDateAndTime,
  addMinutes,
  isSameDay,
  isWeekend,
  isHoliday,
  isAfterCutoff,
  nextBusinessDate,
} from "@/utils/helpers";
import { STATE_TZ } from "@/utils/constant";

/**
 * PF_Extra_Form
 *
 * Enforces pickup-local rules:
 *  start:
 *   - 07:00 ≤ start < 17:00
 *   - not in the past; if today and now > cutoff -> move to next business day
 *   - within next 14 days (inclusive)
 *   - not weekend / public holiday
 *  end:
 *   - 13:00 ≤ end ≤ 19:00 (same day as start)
 *   - ≥ 2 hours after start
 */

const TWO_HOURS = 120; // minutes
const START_MIN_H = 7;
const START_MAX_H = 17; // exclusive upper bound for picker via maxTime
const END_MIN_H = 13;
const END_MAX_H = 19;

function setHM(base, h, m = 0) {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function setHMFromHHmm(base, hhmm) {
  if (!hhmm) return setHM(base, START_MAX_H, 0);
  const [h, m] = hhmm.split(":").map(Number);
  return setHM(
    base,
    Number.isFinite(h) ? h : START_MAX_H,
    Number.isFinite(m) ? m : 0
  );
}

function clamp(date, min, max) {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return date;
}

function maxDate(a, b) {
  return a > b ? a : b;
}

function minDate(a, b) {
  return a < b ? a : b;
}

const PF_Fedex_Extra_Form = ({
  formData,
  serviceName, // not used for rules now but preserved for compatibility
  onChange,
  hasError,
  pickup_state = "Australia/Brisbane",
  holidaysSet,
}) => {
  const { data: collection } = useSelector((state) => state.collection);

  // Pickup local tz
  const tz = STATE_TZ[pickup_state || ""] || "Australia/Brisbane";
  const cutoffHHmm = collection?.service_collection_cutoff_time || "14:30";
  const closeHHmm = collection?.collection_close_time || "17:00";

  // date range (today .. today + 14 days)
  const today = new Date();
  const maxDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 14);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // state
  const [startDate, setStartDate] = useState(() => new Date());
  const [startTime, setStartTime] = useState(() => new Date());
  const [endTime, setEndTime] = useState(null);

  // dynamic time windows for the selected day
  const [minStartTime, setMinStartTime] = useState(() =>
    setHM(new Date(), START_MIN_H, 0)
  );
  const [maxStartTime, setMaxStartTime] = useState(() =>
    setHM(new Date(), START_MAX_H, 0)
  );

  const [autoChangedMsg, setAutoChangedMsg] = useState(null);

  // --- initialization from existing values, with rule-based adjustments ---
  useEffect(() => {
    // initial date comes from collection or today
    let baseDate = formData?.collection_date_time
      ? new Date(formData.collection_date_time)
      : collection?.collection_date_time
        ? new Date(collection.collection_date_time)
        : new Date();

    // clamp to [today, today+14]
    if (baseDate < today) baseDate = today;
    if (baseDate > maxDay) baseDate = maxDay;

    // bump forward if weekend/holiday
    if (isWeekend(baseDate, tz) || isHoliday(baseDate, tz, holidaysSet)) {
      baseDate = nextBusinessDate(baseDate, tz, holidaysSet);
    }

    // if selecting today and now > cutoff/close => next business day
    if (isSameDay(baseDate, today)) {
      const now = new Date();
      const nowAfterClose = isAfterCutoff(now, closeHHmm, tz);
      const nowAfterCutoff = isAfterCutoff(now, cutoffHHmm, tz);
      if (nowAfterClose || nowAfterCutoff) {
        baseDate = nextBusinessDate(
          addMinutes(baseDate, 24 * 60),
          tz,
          holidaysSet
        );
        setAutoChangedMsg(
          nowAfterClose
            ? `It's after the collection closing time (${closeHHmm}) today, so we've moved the collection date to the next business day.`
            : `It's after the collection cutoff time (${cutoffHHmm}) today, so we've moved the collection date to the next business day.`
        );
      }
    }

    // enforce bounds again post-shift
    if (baseDate > maxDay) baseDate = maxDay;

    setStartDate(baseDate);

    // set start window for the day 07:00..17:00 (and close time)
    const nowOnBase = mergeDateAndTime(baseDate, new Date());
    const minS0 = isSameDay(baseDate, today)
      ? maxDate(setHM(baseDate, START_MIN_H, 0), nowOnBase)
      : setHM(baseDate, START_MIN_H, 0);
    const maxByWindow0 = setHM(baseDate, START_MAX_H, 0);
    const maxByClose0 = setHMFromHHmm(baseDate, closeHHmm);
    const maxS0 = minDate(maxByWindow0, maxByClose0);

    if (maxS0 < minS0) {
      // Today after close => roll to next business day before rendering pickers
      baseDate = nextBusinessDate(
        addMinutes(baseDate, 24 * 60),
        tz,
        holidaysSet
      );
      if (baseDate > maxDay) baseDate = maxDay;
      setStartDate(baseDate);
      const minS1 = setHM(baseDate, START_MIN_H, 0);
      const maxS1 = minDate(
        setHM(baseDate, START_MAX_H, 0),
        setHMFromHHmm(baseDate, closeHHmm)
      );
      setMinStartTime(minS1);
      setMaxStartTime(maxS1);
      setAutoChangedMsg(
        `It's after the collection closing time (${closeHHmm}) today, so we've moved the collection date to the next business day.`
      );
    } else {
      setMinStartTime(minS0);
      setMaxStartTime(maxS0);
    }

    // initialize start time
    let initialStart = formData?.collection_time_start
      ? new Date(formData.collection_time_start)
      : new Date();
    initialStart = mergeDateAndTime(baseDate, initialStart);
    initialStart = clamp(
      initialStart,
      isSameDay(baseDate, today)
        ? maxDate(setHM(baseDate, START_MIN_H, 0), nowOnBase)
        : setHM(baseDate, START_MIN_H, 0),
      minDate(
        setHM(baseDate, START_MAX_H, 0),
        setHMFromHHmm(baseDate, closeHHmm)
      )
    );
    setStartTime(initialStart);

    // initialize end time respecting 2h gap & 13:00..19:00
    const endMinByWindow = setHM(baseDate, END_MIN_H, 0);
    const endMinByGap = addMinutes(initialStart, TWO_HOURS);
    const minEnd = maxDate(endMinByWindow, endMinByGap);
    const maxEnd = setHM(baseDate, END_MAX_H, 0);

    let initialEnd = formData?.collection_time_end
      ? mergeDateAndTime(baseDate, new Date(formData.collection_time_end))
      : minEnd;
    initialEnd = clamp(initialEnd, minEnd, maxEnd);
    setEndTime(initialEnd);
  }, []);

  // --- user changes the date ---
  const handleOnChange = (date) => {
    let picked = date ?? new Date();
    setAutoChangedMsg(null);

    // clamp to 14 days and not past
    const todayLocal = new Date();
    if (picked < todayLocal) picked = todayLocal;
    if (picked > maxDay) picked = maxDay;

    // not weekend or public holiday
    if (isWeekend(picked, tz) || isHoliday(picked, tz, holidaysSet)) {
      picked = nextBusinessDate(picked, tz, holidaysSet);
    }

    // if today and now > close/cutoff -> move to next business day
    if (isSameDay(picked, todayLocal)) {
      const now = new Date();
      const afterClose = isAfterCutoff(now, closeHHmm, tz);
      const afterCutoff = isAfterCutoff(now, cutoffHHmm, tz);
      if (afterClose || afterCutoff) {
        picked = nextBusinessDate(picked, tz, holidaysSet);
        if (picked > maxDay) picked = maxDay;
        setAutoChangedMsg(
          afterClose
            ? `It's after the collection closing time (${closeHHmm}) today, so we've moved the collection date to the next business day.`
            : `It's after the collection cutoff time (${cutoffHHmm}) today, so we've moved the collection date to the next business day.`
        );
      }
    }

    // apply
    setStartDate(picked);

    // update time windows for the day
    const nowOnPicked = mergeDateAndTime(picked, new Date());
    const minS0 = isSameDay(picked, todayLocal)
      ? maxDate(setHM(picked, START_MIN_H, 0), nowOnPicked)
      : setHM(picked, START_MIN_H, 0);
    const maxByWindow0 = setHM(picked, START_MAX_H, 0);
    const maxByClose0 = setHMFromHHmm(picked, closeHHmm);
    const maxS0 = minDate(maxByWindow0, maxByClose0);

    if (maxS0 < minS0) {
      // Today after close => roll to next business day
      picked = nextBusinessDate(picked, tz, holidaysSet);
      if (picked > maxDay) picked = maxDay;
      setStartDate(picked);
      const minS1 = setHM(picked, START_MIN_H, 0);
      const maxS1 = minDate(
        setHM(picked, START_MAX_H, 0),
        setHMFromHHmm(picked, closeHHmm)
      );
      setMinStartTime(minS1);
      setMaxStartTime(maxS1);
      setAutoChangedMsg(
        `It's after the collection closing time (${closeHHmm}) today, so we've moved the collection date to the next business day.`
      );
    } else {
      setMinStartTime(minS0);
      setMaxStartTime(maxS0);
    }

    // keep previous start time on the new date but clamp to window
    setStartTime((prev) => {
      const candidate = mergeDateAndTime(
        picked,
        prev ?? setHM(new Date(), START_MIN_H, 0)
      );
      return clamp(
        candidate,
        isSameDay(picked, todayLocal)
          ? maxDate(setHM(picked, START_MIN_H, 0), nowOnPicked)
          : setHM(picked, START_MIN_H, 0),
        minDate(setHM(picked, START_MAX_H, 0), setHMFromHHmm(picked, closeHHmm))
      );
    });

    setEndTime((prev) => {
      const newEndWindowMin = setHM(picked, END_MIN_H, 0);
      const maxEnd = setHM(picked, END_MAX_H, 0);
      const minEndByGap = addMinutes(
        mergeDateAndTime(picked, startTime),
        TWO_HOURS
      );
      const minEnd = maxDate(newEndWindowMin, minEndByGap);
      const candidate = prev ? mergeDateAndTime(picked, prev) : minEnd;
      return clamp(candidate, minEnd, maxEnd);
    });
  };

  // --- user changes time ---
  const handleTimeChange = (time, type) => {
    const picked = time ?? new Date();
    setAutoChangedMsg(null);

    if (type === "start_time") {
      const nowLocal = new Date();
      const minS = isSameDay(startDate, nowLocal)
        ? maxDate(
            setHM(startDate, START_MIN_H, 0),
            mergeDateAndTime(startDate, nowLocal)
          )
        : setHM(startDate, START_MIN_H, 0);
      const maxByWindow = setHM(startDate, START_MAX_H, 0);
      const maxByClose = setHMFromHHmm(startDate, closeHHmm);
      const maxS = minDate(maxByWindow, maxByClose);

      let mergedStart = mergeDateAndTime(startDate, picked);

      // If picked time exceeds closing/window max, roll to next business day (07:00–17:00 respecting close)
      if (mergedStart > maxS) {
        let nextDate = nextBusinessDate(
          addMinutes(startDate, 24 * 60),
          tz,
          holidaysSet
        );
        if (nextDate > maxDay) nextDate = maxDay;
        const nextMin = setHM(nextDate, START_MIN_H, 0);
        const nextMax = minDate(
          setHM(nextDate, START_MAX_H, 0),
          setHMFromHHmm(nextDate, closeHHmm)
        );
        let rolled = mergeDateAndTime(nextDate, picked);
        rolled = clamp(rolled, nextMin, nextMax);

        setStartDate(nextDate);
        setMinStartTime(
          isSameDay(nextDate, nowLocal)
            ? maxDate(nextMin, mergeDateAndTime(nextDate, nowLocal))
            : nextMin
        );
        setMaxStartTime(nextMax);

        setStartTime(rolled);
        setAutoChangedMsg(
          `Selected start exceeds closing time (${closeHHmm}). Moved to next business day.`
        );

        const endMinByWindow = setHM(nextDate, END_MIN_H, 0);
        const endMinByGap = addMinutes(rolled, TWO_HOURS);
        const minEnd = maxDate(endMinByWindow, endMinByGap);
        const maxEnd = setHM(nextDate, END_MAX_H, 0);
        setEndTime((prev) => {
          const candidate = prev ? mergeDateAndTime(nextDate, prev) : minEnd;
          return clamp(candidate, minEnd, maxEnd);
        });
        return;
      }

      // otherwise, clamp within today's window
      mergedStart = clamp(mergedStart, minS, maxS);

      // if same-day and mergedStart is in the past -> bump up to now but still within window
      if (isSameDay(mergedStart, nowLocal) && mergedStart < nowLocal) {
        mergedStart = clamp(nowLocal, minS, maxS);
      }

      setStartTime(mergedStart);
    }

    if (type === "end_time") {
      const mergedEnd = mergeDateAndTime(startDate, picked);
      const minEnd = maxDate(
        setHM(startDate, END_MIN_H, 0),
        addMinutes(startTime ?? mergedEnd, TWO_HOURS)
      );
      const maxEnd = setHM(startDate, END_MAX_H, 0);
      const finalEnd = clamp(
        mergedEnd < minEnd ? minEnd : mergedEnd,
        minEnd,
        maxEnd
      );

      setEndTime(finalEnd);
    }
  };

  // datepicker guards
  const minDateDP = today;
  const maxDateDP = new Date(maxDay);

  // filter dates: disable weekends/holidays
  const filterDate = (d) => {
    if (!d) return false;
    return !isWeekend(d, tz) && !isHoliday(d, tz, holidaysSet);
  };

  // Sync changes to parent AFTER render to avoid setState-during-render warnings
  const lastEmitted = React.useRef({ d: 0, s: 0, e: 0 });
  useEffect(() => {
    const d = startDate ? startDate.getTime() : 0;
    const s = startTime ? startTime.getTime() : 0;
    const e = endTime ? endTime.getTime() : 0;

    if (d && lastEmitted.current.d !== d) {
      onChange(startDate, "collection_date_time");
      lastEmitted.current.d = d;
    }
    if (s && lastEmitted.current.s !== s) {
      onChange(startTime, "collection_time_start");
      lastEmitted.current.s = s;
    }
    if (e && lastEmitted.current.e !== e) {
      onChange(endTime, "collection_time_end");
      lastEmitted.current.e = e;
    }
  }, [startDate, startTime, endTime, onChange]);

  return (
    <>
      <div>
        <div className="mb-4">
          <label className="pfs-input-label mr-3">
            Select a Collection Date &nbsp;
          </label>
          <div className="react-datepicker-column">
            <DatePicker
              showIcon
              selected={startDate}
              dateFormat={"dd/MM/yyyy"}
              onChange={handleOnChange}
              name="collection_date_time"
              className="form-control"
              minDate={minDateDP}
              maxDate={maxDateDP}
              filterDate={filterDate}
            />

            {/* Start time: 07:00–17:00, not past, same day as date */}
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
              maxTime={maxStartTime}
            />

            {/* End time: 13:00–19:00, at least 2h after start */}
            <DatePicker
              selected={endTime}
              onChange={(time) => handleTimeChange(time, "end_time")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="HH:mm"
              placeholderText="End Time"
              className="form-control"
              minTime={(() => {
                const minByWindow = setHM(startDate, END_MIN_H, 0);
                const minByGap = addMinutes(
                  startTime ?? setHM(startDate, START_MIN_H, 0),
                  TWO_HOURS
                );
                const endMax = setHM(startDate, END_MAX_H, 0);
                const minEnd = maxDate(minByWindow, minByGap);
                return minDate(minEnd, endMax);
              })()}
              maxTime={setHM(startDate, END_MAX_H, 0)}
            />

            {autoChangedMsg && (
              <div>
                <p className="text-xs text-red-600 font-bold mt-1">
                  {autoChangedMsg}
                </p>
              </div>
            )}

            {/* Parent-level validation messages */}
            {hasError && !formData?.collection_time_start && (
              <div>
                <p className="text-xs text-red-600 font-light mt-1">
                  Please select a valid start time.
                </p>
              </div>
            )}
            {hasError && !formData?.collection_time_end && (
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

export default PF_Fedex_Extra_Form;



