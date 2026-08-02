/** Single source of truth for Paras Arts brand + contact details. */
export const SITE = {
  name: "Paras Arts",
  tagline: "Where every frame remembers",
  artist: "Paras Kosambe",
  email: "paraskosambe@gmail.com",
  phoneDisplay: "+91 91379 35311",
  whatsapp: "919137935311",
  instagram:
    "https://www.instagram.com/paras.arts.3313?igsh=MXI4bXRnNXhlbG9tdw==",
  instagramHandle: "@paras.arts.3313",
  location: "India · Commissions shipped worldwide",
} as const;

export function whatsappUrl(message = "Hello Paras Arts, I'd like to enquire about a commission.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message.slice(0, 500))}`;
}

export function mailtoUrl(subject = "Commission enquiry — Paras Arts") {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject.slice(0, 200))}`;
}
