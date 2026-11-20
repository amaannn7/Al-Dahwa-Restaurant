import { describe, expect, it } from "vitest";
import {
  buildInquiryMessage,
  buildMeetingMessage,
  formatDate,
  formatTime,
  isValidEmail,
  isValidFutureDate,
  meetingSlots,
  messageUrl,
  todayInRiyadh,
  validateInquiry,
  validateMeeting,
  type CateringInquiry,
  type MeetingRequest,
} from "@/lib/catering";
import { MAX_WA_URL_LENGTH } from "@/lib/whatsapp";

const TODAY = "2026-11-20";

const inquiry: CateringInquiry = {
  eventType: "wedding",
  guests: "51-100",
  service: "buffet",
  date: "2026-11-26",
  mealTime: "dinner",
  location: "Al Malaz",
  name: "Ahmed & Sons",
  phone: "0501234567",
  email: "",
  details: "Mixed grill, mahashi and juice. #1 ?=&",
};

const meeting: MeetingRequest = {
  meetingType: "in-person",
  date: "2026-11-22",
  time: "19:30",
  name: "Sara",
  phone: "+966 55 123 4567",
  eventType: "corporate",
  guests: "",
  topic: "",
};

describe("dates and times", () => {
  it("formats Gregorian dates with Latin digits in both languages", () => {
    expect(formatDate("2026-11-26", "en")).toBe("Thursday, 26 November 2026");
    const ar = formatDate("2026-11-26", "ar");
    expect(ar).toContain("26");
    expect(ar).toContain("2026");
    expect(ar).toContain("نوفمبر");
    expect(ar).toContain("الخميس");
  });

  it("accepts today and later, rejects past and impossible dates", () => {
    expect(isValidFutureDate("2026-11-20", TODAY)).toBe(true);
    expect(isValidFutureDate("2027-02-01", TODAY)).toBe(true);
    expect(isValidFutureDate("2026-11-19", TODAY)).toBe(false);
    expect(isValidFutureDate("2027-02-30", TODAY)).toBe(false);
    expect(isValidFutureDate("26/11/2026", TODAY)).toBe(false);
    expect(isValidFutureDate("", TODAY)).toBe(false);
  });

  it("uses Riyadh time for today", () => {
    // 22:30 UTC on 19 Nov is 01:30 on 20 Nov in Riyadh (UTC+3).
    expect(todayInRiyadh(new Date("2026-11-19T22:30:00Z"))).toBe("2026-11-20");
  });

  it("offers half-hour meeting slots within opening hours", () => {
    const slots = meetingSlots();
    expect(slots[0]).toBe("12:00");
    expect(slots.at(-1)).toBe("22:00");
    expect(slots).toHaveLength(21);
    expect(formatTime("19:30", "en")).toBe("7:30 PM");
    expect(formatTime("12:00", "en")).toBe("12:00 PM");
    expect(formatTime("12:00", "ar")).toBe("12:00 م");
  });
});

describe("validation", () => {
  it("passes a complete inquiry", () => {
    expect(validateInquiry(inquiry, TODAY)).toEqual({});
  });

  it("flags every missing required inquiry field", () => {
    const empty: CateringInquiry = { eventType: "", guests: "", service: "", date: "", mealTime: "", location: "", name: "", phone: "", email: "", details: "" };
    expect(Object.keys(validateInquiry(empty, TODAY)).sort()).toEqual(["date", "eventType", "guests", "name", "phone", "service"]);
  });

  it("rejects unknown option ids and a bad optional email", () => {
    const e = validateInquiry({ ...inquiry, eventType: "rave", guests: "9999", email: "not-an-email" }, TODAY);
    expect(e).toEqual({ eventType: true, guests: true, email: true });
    expect(isValidEmail("name@example.sa")).toBe(true);
  });

  it("validates meetings: type, date, slot, name and phone", () => {
    expect(validateMeeting(meeting, TODAY, meetingSlots())).toEqual({});
    const e = validateMeeting({ ...meeting, meetingType: "", time: "03:00", date: "2026-01-01" }, TODAY, meetingSlots());
    expect(e).toEqual({ meetingType: true, time: true, date: true });
  });
});

describe("messages", () => {
  it("writes out the inquiry with readable labels (English)", () => {
    const msg = buildInquiryMessage("en", "Al-Dafwa Restaurant", inquiry);
    expect(msg).toContain("Hello Al-Dafwa Restaurant!");
    expect(msg).toContain("Event type: Wedding or engagement");
    expect(msg).toContain("Event date: Thursday, 26 November 2026");
    expect(msg).toContain("Serving time: Dinner");
    expect(msg).toContain("Number of guests: 51 to 100 guests");
    expect(msg).toContain("Catering service: Delivery with buffet setup");
    expect(msg).toContain("Event location: Al Malaz");
    expect(msg).toContain("Name: Ahmed & Sons");
    expect(msg).not.toContain("Email:");
    expect(msg).toContain("Mixed grill, mahashi and juice.");
    expect(msg).not.toMatch(/confirmed|booked|order placed/i);
  });

  it("writes the inquiry in Arabic", () => {
    const msg = buildInquiryMessage("ar", "مطاعم الدفواء", inquiry);
    expect(msg).toContain("مرحباً مطاعم الدفواء!");
    expect(msg).toContain("نوع المناسبة: زواج أو ملكة");
    expect(msg).toContain("الخدمة المطلوبة: توصيل مع تجهيز البوفيه");
    expect(msg).toContain("عدد الضيوف: من 51 إلى 100 ضيف");
  });

  it("writes the meeting request and leaves out empty optional fields", () => {
    const msg = buildMeetingMessage("en", "Al-Dafwa Restaurant", meeting);
    expect(msg).toContain("request a meeting");
    expect(msg).toContain("Meeting type: In person at the restaurant");
    expect(msg).toContain("Preferred date: Sunday, 22 November 2026");
    expect(msg).toContain("Preferred time: 7:30 PM");
    expect(msg).toContain("Event type: Corporate event or office lunch");
    expect(msg).not.toContain("Number of guests");
    expect(msg).not.toContain("To discuss");
    const ar = buildMeetingMessage("ar", "مطاعم الدفواء", { ...meeting, meetingType: "phone" });
    expect(ar).toContain("نوع الموعد: مكالمة هاتفية");
    expect(ar).toContain("الوقت المفضل: 7:30 م");
  });

  it("URL-encodes the message and refuses one that is too long", () => {
    const url = messageUrl("966504224206", buildInquiryMessage("en", "Al-Dafwa Restaurant", inquiry));
    expect(url).toMatch(/^https:\/\/wa\.me\/966504224206\?text=/);
    expect(decodeURIComponent(url!.split("?text=")[1])).toContain("#1 ?=&");
    expect(messageUrl("966504224206", "ش".repeat(MAX_WA_URL_LENGTH))).toBeNull();
  });
});
