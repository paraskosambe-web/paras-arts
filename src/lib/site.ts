/** Single source of truth for Paras Arts brand + contact details. */
export const SITE = {
  name: "Paras Arts",
  tagline: "Where every frame remembers",
  artist: "Paras Kosambe",
  email: "paraskosambe@gmail.com",
  phoneDisplay: "+91 91379 35311",
  whatsapp: "919137935311",
  instagram: "https://www.instagram.com/paras.arts.3313/",
  instagramHandle: "@paras.arts.3313",
  location: "India · Commissions shipped worldwide",
  upiId: "paraskosambe@oksbi",
  advanceAmount: 200,
} as const;

/** UPI deep link for the advance payment (opens Google Pay / PhonePe / any UPI app). */
export function upiPayUrl(
  amount: number = SITE.advanceAmount,
  note = "Paras Arts Sketch Order Advance",
) {
  const params = new URLSearchParams({
    pa: SITE.upiId,
    pn: SITE.name,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function whatsappUrl(message = "Hello Paras Arts, I'd like to enquire about a commission.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message.slice(0, 500))}`;
}

export function mailtoUrl(subject = "Commission enquiry — Paras Arts") {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject.slice(0, 200))}`;
}
