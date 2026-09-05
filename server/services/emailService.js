const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

function getStatusEmail(order, status) {
  const customerName = order.fullName || "Customer";
  const orderId = order.orderId;
  const sketchType = order.sketchType || "Custom Sketch";
  const paperSize = order.paperSize || "A4";

  const trackUrl = "https://paras-arts.vercel.app/track";
  const logoUrl = "https://paras-arts.vercel.app/logo.png";

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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${template.subject}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f3f3;
  font-family:Arial,Helvetica,sans-serif;
  color:#222222;
">

  <div style="
    width:100%;
    background:#f3f3f3;
    padding:25px 10px;
    box-sizing:border-box;
  ">

    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 2px 12px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:#111111;
        text-align:center;
        padding:32px 20px 28px 20px;
      ">

        <img
          src="${logoUrl}"
          alt="Paras Arts"
          width="110"
          style="
            display:block;
            width:110px;
            max-width:40%;
            height:auto;
            margin:0 auto 18px auto;
          "
        >

        <div style="
          font-size:28px;
          line-height:34px;
          font-weight:bold;
          letter-spacing:1px;
          color:#ffffff;
        ">
          PARAS ARTS
        </div>

        <div style="
          margin-top:8px;
          font-size:11px;
          line-height:16px;
          letter-spacing:3px;
          font-weight:bold;
          color:#ffffff;
        ">
          WHERE EVERY FRAME REMEMBERS
        </div>

      </div>


      <!-- CONTENT -->
      <div style="
        padding:35px 30px;
      ">

        <h2 style="
          margin:0 0 22px 0;
          color:#222222;
          font-size:23px;
          line-height:31px;
        ">
          ${template.heading}
        </h2>


        <p style="
          margin:0 0 16px 0;
          font-size:15px;
          line-height:25px;
        ">
          Hello <strong>${customerName}</strong>,
        </p>


        <p style="
          margin:0 0 22px 0;
          font-size:15px;
          line-height:25px;
          color:#444444;
        ">
          ${template.message}
        </p>


        <!-- ORDER DETAILS -->
        <div style="
          background:#f7f7f7;
          border:1px solid #eeeeee;
          border-radius:10px;
          padding:20px;
          margin:25px 0;
        ">

          <div style="
            font-size:16px;
            font-weight:bold;
            margin-bottom:14px;
            color:#222222;
          ">
            Order Details
          </div>


          <p style="
            margin:8px 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Order ID:</strong>
            ${orderId}
          </p>


          <p style="
            margin:8px 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Sketch:</strong>
            ${sketchType}
          </p>


          <p style="
            margin:8px 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Paper Size:</strong>
            ${paperSize}
          </p>


          <p style="
            margin:8px 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Status:</strong>
            ${status}
          </p>


          <p style="
            margin:8px 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Advance Payment:</strong>
            ₹200
          </p>


          <p style="
            margin:8px 0 0 0;
            font-size:14px;
            line-height:21px;
          ">
            <strong>Payment:</strong>
            ${order.paymentStatus || "Pending"}
          </p>

        </div>


        <!-- NEXT STEP -->
        <p style="
          margin:0 0 18px 0;
          font-size:15px;
          line-height:25px;
          color:#444444;
        ">
          ${template.next}
        </p>


        <p style="
          margin:0 0 25px 0;
          font-size:15px;
          line-height:25px;
          color:#444444;
        ">
          You can track your order anytime using your
          <strong>Order ID and email address</strong>.
        </p>


        <!-- TRACK ORDER BUTTON -->
        <div style="
          text-align:center;
          margin:30px 0;
        ">

          <a
            href="${trackUrl}"
            target="_blank"
            style="
              display:inline-block;
              background:#111111;
              color:#ffffff;
              text-decoration:none;
              padding:14px 30px;
              border-radius:8px;
              font-size:15px;
              font-weight:bold;
              letter-spacing:0.2px;
            "
          >
            Track Your Order
          </a>

        </div>


        <!-- WEBSITE LINK -->
        <p style="
          text-align:center;
          margin:25px 0 0 0;
          font-size:13px;
          line-height:21px;
          color:#777777;
        ">
          Visit
          <a
            href="https://paras-arts.vercel.app"
            target="_blank"
            style="
              color:#222222;
              font-weight:bold;
              text-decoration:none;
            "
          >
            Paras Arts
          </a>
          anytime to explore our artwork.
        </p>

      </div>


      <!-- FOOTER -->
      <div style="
        background:#111111;
        text-align:center;
        padding:25px 20px;
      ">

        <p style="
          margin:0 0 7px 0;
          color:#ffffff;
          font-size:14px;
        ">
          Thank you for choosing <strong>Paras Arts</strong>.
        </p>

        <p style="
          margin:0 0 18px 0;
          color:#aaaaaa;
          font-size:12px;
        ">
          Where every frame remembers.
        </p>

        <p style="
          margin:0;
          color:#aaaaaa;
          font-size:12px;
          line-height:19px;
        ">
          — Paras Kosambe<br>
          <strong style="color:#ffffff;">Paras Arts</strong>
        </p>

      </div>

    </div>

  </div>

</body>
</html>
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