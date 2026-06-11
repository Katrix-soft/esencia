// lib/mailer.js — Servicio de email con Nodemailer
// Extraído de api.js. Soporta SMTP real o fallback a archivos locales.
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs         = require('fs');
const path       = require('path');
const logger     = require('./logger');

let transporter = null;

function getTransporter() {
  if (!transporter && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendPasswordEmail(email, storeName, newPassword) {
  const tp = getTransporter();

  if (!tp) {
    logger.warn('SMTP no configurado. Guardando email en archivo local.', { email });
    // Fallback: guardar en disco para desarrollo
    const dir = path.join(__dirname, '..', 'emails');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filename = path.join(dir, `email_${Date.now()}.txt`);
    fs.writeFileSync(filename, `TO: ${email}\nSTORE: ${storeName}\nPASSWORD: ${newPassword}\n`);
    return false;
  }

  const html = `
    <div style="font-family:sans-serif;padding:20px;color:#333;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;">
      <h2 style="color:#2e3230;border-bottom:2px solid #2e3230;padding-bottom:10px;">Esencia — Cambio de Contraseña</h2>
      <p>Hola,</p>
      <p>Procesamos el cambio de contraseña para tu cuenta de la tienda <strong>"${storeName}"</strong>.</p>
      <table style="width:100%;background:#f9f9f9;padding:15px;border-radius:6px;margin:15px 0;">
        <tr><td style="font-weight:bold;width:100px;">Usuario:</td><td>${email}</td></tr>
        <tr><td style="font-weight:bold;">Contraseña:</td><td><code style="background:#eef;padding:2px 6px;border-radius:4px;">${newPassword}</code></td></tr>
      </table>
      <p>Te recomendamos cambiarla en el panel de administración.</p>
      <hr style="border:0;border-top:1px solid #eee;margin:20px 0;"/>
      <p style="font-size:.85em;color:#777;">Mensaje automático — No respondas a este correo.</p>
    </div>
  `;

  try {
    await tp.sendMail({
      from:    `"Soporte Esencia" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: `Nueva Contraseña — ${storeName}`,
      html,
    });
    logger.info('Email de contraseña enviado.', { email, storeName });
    return true;
  } catch (err) {
    logger.error('Error enviando email de contraseña.', { error: err.message });
    return false;
  }
}

async function sendWelcomeEmail(email, storeName, password, storeUrl) {
  const tp = getTransporter();
  if (!tp) {
    logger.warn('SMTP no configurado para email de bienvenida.', { email });
    return false;
  }

  const html = `
    <div style="font-family:sans-serif;padding:20px;color:#333;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;">
      <h2 style="color:#2e3230;border-bottom:2px solid #2e3230;padding-bottom:10px;">¡Bienvenido a Esencia! 🌸</h2>
      <p>Tu tienda <strong>"${storeName}"</strong> fue creada exitosamente.</p>
      <table style="width:100%;background:#f9f9f9;padding:15px;border-radius:6px;margin:15px 0;">
        <tr><td style="font-weight:bold;width:100px;">Email:</td><td>${email}</td></tr>
        <tr><td style="font-weight:bold;">Contraseña:</td><td><code style="background:#eef;padding:2px 6px;border-radius:4px;">${password}</code></td></tr>
        <tr><td style="font-weight:bold;">Tu tienda:</td><td><a href="${storeUrl}">${storeUrl}</a></td></tr>
      </table>
      <p>Accedé al panel de administración en <a href="https://esencia.katrix.com.ar">esencia.katrix.com.ar</a></p>
      <hr style="border:0;border-top:1px solid #eee;margin:20px 0;"/>
      <p style="font-size:.85em;color:#777;">Mensaje automático — Katrix SaaS</p>
    </div>
  `;

  try {
    await tp.sendMail({
      from:    `"Esencia Onboarding" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: `¡Tu tienda "${storeName}" está lista! 🌸`,
      html,
    });
    logger.info('Email de bienvenida enviado.', { email, storeName });
    return true;
  } catch (err) {
    logger.error('Error enviando email de bienvenida.', { error: err.message });
    return false;
  }
}

module.exports = { sendPasswordEmail, sendWelcomeEmail };
