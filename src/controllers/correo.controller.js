mensajeCorreo = {};
const nodemailer = require("nodemailer");

mensajeCorreo.enviarMensaje = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { nombres, apellidos, numCel, email, mensaje } = req.body;

  const cuerpoMensajeEmpresa = `
  <p style="font-weight: bold;">Mensaje:</p>
  <p>${mensaje}</p>
  <br>
  <br>
  <hr> <!-- Línea horizontal -->
  <p style="font-weight: bold;">Información de contacto:</p>
  <strong>Nombre:</strong> ${nombres} ${apellidos}<br>
  <strong>Teléfono celular:</strong> ${numCel}<br>
  <strong>Correo:</strong> ${email}<br>
  `;

  const mensajeParaEmpresa = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Nuevo Mensaje De Cliente",
    html: cuerpoMensajeEmpresa,
  };

  const cuerpoMensajeCliente = `
  <p style="font-weight: bold;">Gracias Por Comunicarse Con nosotros</p>
  <p>Su mensaje a sido enviado a la empresa exitosamente</p>
  <hr> <!-- Línea horizontal -->

  <tr>
      <td>
        <ul>
          <p style="font-weight: bold;">Mensaje:</p>
          <p>${mensaje}</p>
          <br>
          <br>

          <hr> <!-- Línea horizontal -->
          <p style="font-weight: bold;">Sus datos:</p>
          <strong>Nombre:</strong> ${nombres} ${apellidos}<br>
          <strong>Teléfono celular:</strong> ${numCel}<br>
          <strong>Correo:</strong> ${email}<br>
        </ul>
    </td>
  </tr>

  <hr> <!-- Línea horizontal -->
  <br>
  <br>
  <br>
  <p style="font-weight: bold;">Delicas Rápidas</p>
  <p>Queremos darte la mejor atención. Conócenos</p>
  `;

  const mensajeParaCliente = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mensaje Enviado Con Éxito.",
    html: cuerpoMensajeCliente,
  };

  transporter.sendMail(mensajeParaEmpresa, function (error, info) {
    if (error) {
      console.log(error);
      req.flash('errors', 'Se a producido un error al enviar el mensaje.');
    } else {
      console.log("Email enviado a la empresa: " + info.response);
      req.flash('success', 'Mensaje enviado a la empresa.');

      transporter.sendMail(mensajeParaCliente, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email enviado al cliente: " + info.response);
        }
      });
    }
    res.redirect('/');
  });
};

module.exports = mensajeCorreo;