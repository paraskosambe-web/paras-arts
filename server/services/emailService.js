const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

function getStatusEmail(order, status) {
  const customerName = order.fullName || "Customer";
  const orderId = order.orderId;
  const sketchType = order.sketchType || "Custom Sketch";
  const paperSize = order.paperSize || "A4";

  const messages = {
    Accepted: {
      subject: `Paras Arts — Order ${orderId} Accepted`,
      heading: "Your Order Has Been Accepted! 🎨",
      message:
        "Thank you for choosing Paras Arts! Your custom sketch order has been accepted and your commission is now confirmed.",
      next:
        "Your artwork will now be scheduled for creation. We will keep you updated as your order progresses.",
    },

    "In Progress": {
      subject: `Paras Arts — Your Order ${orderId} Is In Progress`,
      heading: "Your Artwork Is Being Created 🎨",
      message:
        "Great news! Your Paras Arts commission is now in progress.",
      next:
        "Your artwork is currently being created. We will notify you when it is completed.",
    },

    Completed: {
      subject: `Paras Arts — Order ${orderId} Completed`,
      heading: "Your Artwork Is Completed! ✨",
      message:
        "Your custom artwork has been completed successfully.",
      next:
        "Thank you for trusting Paras Arts with your artwork. We hope you love the final result!",
    },

    Cancelled: {
      subject: `Paras Arts — Order ${orderId} Cancelled`,
      heading: "Order Cancellation Notice",
      message:
        "We’re sorry to inform you that your Paras Arts order has been cancelled.",
      next:
        "If you have any questions regarding the cancellation, please contact Paras Arts.",
    },
  };

  const template = messages[status];

  if (!template) {
    return null;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:35px; border-radius:12px;">

        <h1 style="margin-top:0; color:#222;">
          Paras Arts
        </h1>

        <p style="color:#777; margin-top:-10px;">
          Where every frame remembers
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">

        <h2 style="color:#222;">
          ${template.heading}
        </h2>

        <p>
          Hello <strong>${customerName}</strong>,
        </p>

        <p>
          ${template.message}
        </p>

        <div style="background:#f7f7f7; padding:20px; border-radius:8px; margin:25px 0;">

          <p style="margin:5px 0;">
            <strong>Order ID:</strong> ${orderId}
          </p>

          <p style="margin:5px 0;">
            <strong>Sketch:</strong> ${sketchType}
          </p>

          <p style="margin:5px 0;">
            <strong>Paper Size:</strong> ${paperSize}
          </p>

          <p style="margin:5px 0;">
            <strong>Status:</strong> ${status}
          </p>

          <p style="margin:5px 0;">
            <strong>Advance Payment:</strong> ₹200
          </p>

          <p style="margin:5px 0;">
            <strong>Payment:</strong> ${order.paymentStatus || "Pending"}
          </p>

        </div>

        <p>
          ${template.next}
        </p>

        <p>
          You can track your order anytime using your
          <strong>Order ID and email address</strong>.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

        <p style="margin-bottom:5px;">
          Thank you for choosing <strong>Paras Arts</strong>.
        </p>

        <p style="margin-top:5px;">
          Where every frame remembers.
        </p>

        <p style="margin-top:25px;">
          — Paras Kosambe<br>
          <strong>Paras Arts</strong>
        </p>

      </div>
    </div>
  `;

  return {
    subject: template.subject,
    html,
  };
}

async function sendOrderStatusEmail(order, status) {
  if (!order?.email) {
    console.log("No customer email found. Notification skipped.");
    return;
  }

  const email = getStatusEmail(order, status);

  if (!email) {
    console.log(`No email template configured for status: ${status}`);
    return;
  }

  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured.");
    return;
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    console.error("BREVO_SENDER_EMAIL is not configured.");
    return;
  }

  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "Paras Arts",
      email: process.env.BREVO_SENDER_EMAIL,
    },

    to: [
      {
        email: order.email,
        name: order.fullName || "Customer",
      },
    ],

    subject: email.subject,

    htmlContent: email.html,
  });

  console.log(
    `Order status email sent to ${order.email} for ${order.orderId}. Message ID: ${result.messageId}`
  );
}

module.exports = {
  sendOrderStatusEmail,
};